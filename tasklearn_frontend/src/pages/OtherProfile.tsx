/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import "../app/globals.css";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import clear from "../assets/home/image 2.png";
import submit from "../assets/home/image 1.png";
import searchIcon from "../assets/Quiz/Group 1.png";
import {
    collection,
    getDoc,
    doc,
    addDoc,
    deleteDoc,
    where,
    query,
    getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { User } from "firebase/auth";
import { toast } from "react-toastify";
import { decryptData } from "../utils/cryptoUtils";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Quizzes from "./tabs/Quizzes";

type UserData = {
    uid: string;
    email: string;
    userName: string;
    jobRole: string;
    profilePicUrl: string | undefined;
    jobsAndDescriptions?: string;
    careerAspirations?: string;
};
type Follow = {
    uid: string;
    followerId: string;
    followeeId: string;
    status: string;
};

const OtherProfile = () => {
    const [otherUser, setOtherUser] = useState<UserData | null>(null);
    const [followDoc, setFollowDoc] = useState<Follow[]>([]);
    const [followDocs, setFollowDocs] = useState<Follow[]>([]);
    const [followingDocs, setFollowingDocs] = useState<Follow[]>([]);
    const [otherFollowDocs, setOtherFollowDocs] = useState<Follow[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [otherfollowingIds, setOtherFollowingIds] = useState<string[]>([]);
    const [otherFollowerIds, setOtherFollowerIds] = useState<string[]>([]);
    const [followerUsers, setFollowerUsers] = useState<UserData[]>([]);
    const [followingUsers, setFollowingUsers] = useState<UserData[]>([]);
    const [sendFollowRequest, setSendFollowRequest] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user); // Store Firebase user object
                const userDoc = await getDoc(doc(db, "users", user.uid)); // Fetch user data from Firestore

                if (userDoc.exists()) {
                    // Add UID to the user data
                    setUserData({
                        ...userDoc.data(),
                        uid: user.uid, // Include UID in the userData state
                    } as unknown as UserData);
                }
            } else {
                setUser(null);
                setUserData(null);
            }
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    const fetchFollowerUserDetails = async (followerIds: string[]) => {
        try {
            if (followerIds.length === 0) {
                return [];
            }
            const userDetails: UserData[] = [];
            for (const id of followerIds) {
                const userDoc = await getDoc(doc(db, "users", id));
                if (userDoc.exists()) {
                    userDetails.push({ uid: id, ...userDoc.data() } as UserData);
                }
            }

            setFollowerUsers(userDetails);
            return userDetails;
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const fetchFollowingUserDetais = async (followeeId: string[]) => {
        try {
            if (followeeId.length === 0) {
                return [];
            }
            const userDetails: UserData[] = [];
            for (const id of followeeId) {
                const userDoc = await getDoc(doc(db, "users", id));
                if (userDoc.exists()) {
                    userDetails.push({ uid: id, ...userDoc.data() } as UserData);
                }
            }

            setFollowingUsers(userDetails);
            return userDetails;
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const fetchFollowRequests = async () => {
        try {
            const match = query(
                collection(db, "followRequests"),
                where("followerId", "==", userData?.uid),
                where("followeeId", "==", otherUser?.uid)
            );
            const followRequestsDoc = await getDocs(match);
            const request = followRequestsDoc.docs.map(
                (doc) =>
                ({
                    ...doc.data(),
                    uid: doc.id,
                } as Follow)
            );

            setFollowDoc(request);
            fetchOtherFollowRequest();
            fetchOtherFollowingRequest();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const fetchOtherFollowingRequest = async () => {
        try {
            const match = query(
                collection(db, "followRequests"),
                where("followerId", "==", otherUser?.uid),
                where("status", "==", "accept")
            );
            const otherFollowingReqDoc = await getDocs(match);
            const request = otherFollowingReqDoc.docs.map(
                (doc) =>
                ({
                    ...doc.data(),
                    uid: doc.id,
                } as Follow)
            );
            setFollowingDocs(request);
            const followingIds = request.map((req) => req.followeeId);
            setOtherFollowingIds(followingIds);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchOtherFollowRequest = async () => {
        try {
            const match = query(
                collection(db, "followRequests"),
                where("followeeId", "==", otherUser?.uid),
                where("status", "==", "accept")
            );
            const otherFollowReqDoc = await getDocs(match);
            const request = otherFollowReqDoc.docs.map(
                (doc) =>
                ({
                    ...doc.data(),
                    uid: doc.id,
                } as Follow)
            );
            setFollowDocs(request);
            const followerIds = request.map((req) => req.followerId);
            setOtherFollowerIds(followerIds);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (otherFollowerIds.length > 0) {
            fetchFollowerUserDetails(otherFollowerIds);
        }
        if (otherfollowingIds.length > 0) {
            fetchFollowingUserDetais(otherfollowingIds);
        }
    }, [otherFollowerIds, otherfollowingIds]);

    const fetchAllFollowRequest = async () => {
        try {
            const allFollowRequestsDoc = await getDocs(
                collection(db, "followRequests")
            );
            const requests = allFollowRequestsDoc.docs?.map((doc) => {
                return { ...doc.data(), uid: doc.id } as Follow;
            });
            setOtherFollowDocs(requests);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (userData?.uid && otherUser?.uid) {
            fetchFollowRequests();
            fetchAllFollowRequest();
        }
    }, [userData, otherUser, sendFollowRequest]);

    useEffect(() => {
        const userStr = sessionStorage.getItem("user");
        if (userStr) {
            try {
                const user = decryptData(userStr);
                if (user && user.uid) {
                    setOtherUser(user);
                } else {
                    console.error("User ID is undefined or user data is incomplete");
                }
            } catch (error) {
                console.error("Error decrypting user data:", error);
            }
        } else {
            console.error("No user data found");
        }
    }, []);

    const handleFollowRequest = async () => {
        try {
            if (followDoc.length > 0) {
                const deleteReq = doc(db, "followRequests", followDoc[0].uid);
                await deleteDoc(deleteReq);
                setFollowDoc([]);
            } else {
                const sendFollowRequest = await addDoc(
                    collection(db, "followRequests"),
                    {
                        followerId: userData?.uid,
                        followeeId: otherUser?.uid,
                        status: "pending",
                    }
                );
                if (sendFollowRequest) {
                    setSendFollowRequest(true);
                    fetchFollowRequests();
                }
            }
        } catch (error) { }
    };

    const checkFollowRequest = () => {
        return followDoc?.some(
            (request) =>
                request.followeeId === otherUser?.uid &&
                request.followerId === userData?.uid &&
                request.status === "pending"
        );
    };

    const checkAcceptedRequest = () => {
        return followDoc?.some(
            (request) =>
                request.followeeId === otherUser?.uid &&
                request.followerId === userData?.uid &&
                request.status === "accept"
        );
    };

    const stylePending = checkFollowRequest()
        ? "bg-gray-400 text-white hover:bg-gray-600"
        : "bg-[#67A76B] text-white hover:bg-green-600";
    const styleAccept = checkAcceptedRequest()
        ? "bg-[#67A76B] text-white hover:bg-green-600"
        : "bg-gray-400 text-white hover:bg-gray-600";
    const buttonText = checkAcceptedRequest()
        ? "Following"
        : checkFollowRequest()
            ? "Requested"
            : "Follow";

    const checkOtherFollowRequest = (followeeId: string) => {
        return otherFollowDocs?.some(
            (request) =>
                request.followeeId === followeeId &&
                request.followerId === userData?.uid &&
                request.status === "pending"
        );
    };

    const checkOtherAcceptedRequest = (followeeId: string) => {
        return otherFollowDocs?.some(
            (request) =>
                request.followeeId === followeeId &&
                request.followerId === userData?.uid &&
                request.status === "accept"
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }




    const handleOtherFollower = async (followeeId: string) => {
        try {
            const checkReq = otherFollowDocs?.filter(
                (req) =>
                    req.followeeId === followeeId &&
                    req.followerId === userData?.uid &&
                    (req.status === "pending" || req.status === "accept")
            );

            if (checkReq.length > 0) {
                const deleteId = checkReq
                    .filter((doc) => doc.followeeId === followeeId)
                    .map((doc) => doc.uid);
                if (deleteId.length > 0) {
                    const deleteReq = doc(db, "followRequests", deleteId[0]);
                    await deleteDoc(deleteReq);

                    setOtherFollowDocs((prevFollowDocs) =>
                        prevFollowDocs.filter((doc) => doc.uid !== deleteId[0])
                    );
                }
            } else {
                const sendFollowRequest = await addDoc(
                    collection(db, "followRequests"),
                    {
                        followerId: userData?.uid,
                        followeeId,
                        status: "pending",
                    }
                );
                if (sendFollowRequest) {
                    fetchAllFollowRequest();
                }
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    console.log(followingUsers);

    return (
        <div className="w-full flex gap-2 bg-gray-100">
            <div className="flex flex-col lg:flex-row w-full">
                {/* Sidebar */}
                {/* <div className="w-full lg:w-[7%] flex lg:flex-col items-center bg-white p-4">
          <div className="pt-4 text-green-500 text-lg md:text-3xl font-bold">
            <Link href="/Homepage">TL</Link>
          </div>
          <div className="hidden lg:block rounded-full overflow-hidden h-12 w-12 mt-4">
          
          </div>
          <button className="mt-4 h-10 w-10 bg-gray-300 rounded-full text-3xl text-white">
            +
          </button>
        </div> */}
                {/* <img src="assets/Ellipse_1.png" alt="Profile" /> */}
                {/* Main Content Area */}
                <div className="w-full lg:w-[100%] bg-white shadow-md p-4">
                    {/* Header */}
                    <div className="p-4 flex justify-between">
                        <div className="text-start">
                            <h1 className="text-[10px] sm:text-md md:text-md lg:text-2xl xl:text-3xl font-bold text-[#68A86B]">
                                <Link href="/Homepage">T-askLearn</Link>
                            </h1>
                            <p className="text-[2px] sm:text-[4px] lg:text-[6px] xl:text-[8px] text-[#68A86B]">
                                <Link href="/Homepage">
                                    Collaborate to Learn, Learn to Collaborate
                                </Link>
                            </p>
                        </div>
                        <div className="px-4 text-black font-bold items-center flex justify-end gap-2">
                            <Link href="/Homepage">H</Link>
                            <Link href="/UserProfile">P</Link>
                        </div>
                    </div>
                    <div className="h-[1px] w-full bg-gray-300"></div>
                    {/* User Info */}
                    <div className="flex flex-col lg:flex-row mt-4">
                        <div className="w-full lg:w-auto items-center p-4  flex-col">
                            <img
                                src={otherUser?.profilePicUrl}
                                alt="profilePic"
                                className="bg-cover object-cover flex w-[67px] h-[67px] rounded-full mx-auto"
                            />
                            <p className="text-lg font-bold">
                                {otherUser?.userName + "," + otherUser?.jobRole}
                            </p>
                        </div>
                        <div className="ml-auto flex items-center">
                            {/* Step 3: Add onClick handler to open modal */}
                            <button
                                className={`mb-20   rounded-md px-4 py-2 ${checkAcceptedRequest() ? styleAccept : stylePending
                                    }`}
                                onClick={handleFollowRequest}
                            >
                                {buttonText}
                            </button>
                        </div>
                    </div>
                    {/* Main Quiz Section */}
                    <div className="p-4 lg:w-[40%] float-left">
                        <Quizzes userData={userData} />
                    </div>
                    <div className="p-4 border-2 rounded-lg ">
                        {/* Tabs: Followers, Following, Career */}
                        <div className="flex justify-around border-b mb-4 P1_2 fo_22">
                            <button className="text-center flex-1 py-2 border-gray-400">
                                Followers
                            </button>
                            <button className="text-center flex-1 py-2 border-gray-400">
                                Following
                            </button>
                            <button className="text-center flex-1 py-2 border-gray-400">
                                Career
                            </button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-center">
                            {/* Followers Section */}
                            <div className="bg-white p-4 shadow-md rounded-md">
                                <h3 className="text-lg font-bold border-b pb-2 mb-4">
                                    List of Followers
                                </h3>
                                <ul className="space-y-2">
                                    {followerUsers.length === 0 && <p>No Followers List Found</p>}
                                    {followerUsers?.map((user, index) => {
                                        const isPending = checkOtherFollowRequest(user.uid);
                                        const isAccepted = checkOtherAcceptedRequest(user.uid);
                                        const isDisabled = user.uid === userData?.uid;
                                        const css = {
                                            buttonStyle: isAccepted
                                                ? "bg-[#67A76B] text-white hover:bg-green-600"
                                                : isPending
                                                    ? "bg-gray-400 text-white hover:bg-gray-600"
                                                    : "bg-[#67A76B] text-white hover:bg-green-600",
                                            buttonText: isDisabled
                                                ? "Follower"
                                                : isAccepted
                                                    ? "Following"
                                                    : isPending
                                                        ? "Requested"
                                                        : "Follow",
                                        };
                                        return (
                                            <div
                                                key={index}
                                                className=" flex items-center gap-x-1 border-b py-2"
                                            >
                                                <p className="w-[70%] text-[14px] text-left">
                                                    {user.userName + "," + user.jobRole}
                                                </p>

                                                <button
                                                    className={`rounded-md transition  duration-300 px-10 py-1 w-[30%] flex justify-center text-sm ${css.buttonStyle}`}
                                                    onClick={() => handleOtherFollower(user.uid)}
                                                    disabled={user.uid === userData?.uid}
                                                >
                                                    {css.buttonText}
                                                </button>
                                            </div>
                                        );
                                    })}
                                    {/* Add more followers here */}
                                </ul>
                            </div>
                            {/* Following Section */}
                            <div className="bg-white p-4 shadow-md rounded-md">
                                <h3 className="text-lg font-bold border-b pb-2 mb-4">
                                    Following List
                                </h3>
                                <ul className="space-y-2">
                                    {followingUsers.length === 0 && (
                                        <p>No Following List Found</p>
                                    )}
                                    {followingUsers?.map((user, index) => {
                                        const isPending = checkOtherFollowRequest(user.uid);
                                        const isAccepted = checkOtherAcceptedRequest(user.uid);
                                        const isDisabled = user.uid === userData?.uid;
                                        const css = {
                                            buttonStyle: isAccepted
                                                ? "bg-[#67A76B] text-white hover:bg-green-600"
                                                : isPending
                                                    ? "bg-gray-400 text-white hover:bg-gray-600"
                                                    : "bg-[#67A76B] text-white hover:bg-green-600",
                                            buttonText: isDisabled
                                                ? "Following"
                                                : isAccepted
                                                    ? "Following"
                                                    : isPending
                                                        ? "Requested"
                                                        : "Follow",
                                        };
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center gap-x-1 border-b py-2"
                                            >
                                                <p className="w-[70%] text-[14px] text-left">
                                                    {user.userName + "," + user.jobRole}
                                                </p>

                                                <button
                                                    className={`rounded-md transition  duration-300 px-10 py-1 w-[30%] flex justify-center text-sm ${css.buttonStyle}`}
                                                    onClick={() => handleOtherFollower(user.uid)}
                                                    disabled={user.uid === userData?.uid}
                                                >
                                                    {css.buttonText}
                                                </button>
                                            </div>
                                        );
                                    })}

                                    {/* Add more following here */}
                                </ul>
                            </div>
                            {/* Career Section */}
                            <div className="bg-white p-4 shadow-md rounded-md">
                                <h3 className="text-lg font-bold border-b pb-2 mb-4">
                                    Job role and description
                                </h3>
                                <textarea
                                    disabled
                                    value={otherUser?.jobsAndDescriptions || ""}
                                    className="border mb-4 p-2 h-24 w-full resize-none" // Fixed height, full width, no resize
                                ></textarea>
                                <h3 className="text-lg font-bold border-b pb-2 mb-4">
                                    Career Aspirations
                                </h3>
                                <textarea
                                    disabled
                                    value={otherUser?.careerAspirations || ""}
                                    className="border p-2 h-24 w-full resize-none" // Fixed height, full width, no resize
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtherProfile;