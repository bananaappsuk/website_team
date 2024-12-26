/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
    getDoc,
    doc,
    collection,
    addDoc,
    deleteDoc,
    getDocs,
    where,
    query,
} from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";

type Follow = {
    uid: string;
    followerId: string;
    followeeId: string;
    status: string;
};

type UserData = {
    uid: any;
    email: string;
    userName: string;
    jobRole: string;
    profilePicUrl: string | undefined;
};

type Props = {
    userData: UserData | null;
};

const Following: React.FC<Props> = ({ userData }) => {
    const [reqUsers, setReqUsers] = useState<UserData[]>([]);
    const [followerIds, setFollowerIds] = useState<string[]>([]);
    const [isloading, setIsLoading] = useState(true);
    const [followDocs, setFollowDocs] = useState<Follow[]>([]);
    const [pendingDeleteReq, setPendingDeleteReq] = useState<string | null>(null);
    const [processingRequest, setProcessingRequest] = useState<string | null>(
        null
    );
    const [deleteReqArray, setDeleteReqArray] = useState<boolean[]>([]);
    const [sendReqArray, setSendReqArray] = useState<boolean[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [isRequestInProgress, setIsRequestInProgress] =
        useState<boolean>(false);
    useEffect(() => {
        setDeleteReqArray(Array(reqUsers.length).fill(false));
        setSendReqArray(Array(reqUsers.length).fill(false));
    }, [reqUsers]);

    useEffect(() => {
        const fetchAllFollowRequests = async () => {
            setIsLoading(true);
            try {
                const allFollowRequestsDoc = await getDocs(
                    collection(db, "followRequests")
                );
                const requests = allFollowRequestsDoc.docs.map(
                    (doc) => ({ ...doc.data(), uid: doc.id } as Follow)
                );
                setFollowDocs(requests);
            } catch (error: any) {
                toast.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllFollowRequests();
    }, []);

    const fetchUserDetails = async (
        followerIds: string[]
    ): Promise<UserData[]> => {
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
        setIsLoading(false);
        return userDetails;
    };

    useEffect(() => {
        const updateFollowingData = async () => {
            setIsLoading(true);
            if (followDocs.length > 0) {
                const followerIds = followDocs
                    .filter(
                        (req) => req.followerId === userData?.uid && req.status === "accept"
                    )
                    .map((req) => req.followeeId);
                const userDetails = await fetchUserDetails(followerIds);
                setReqUsers(userDetails);
            } else {
                setReqUsers([]);
            }
            setIsLoading(false);
        };
        updateFollowingData();
    }, [followDocs]);

    useEffect(() => {
        const updateReqUsers = async () => {
            if (followerIds.length > 0) {
                const details = await fetchUserDetails(followerIds);
                setReqUsers(details);
                setIsLoading(false);
            } else {
                setReqUsers([]);
                setIsLoading(true);
            }
        };
        updateReqUsers();
    }, [followerIds]);

    const handleFollowingRequest = async (followeeId: string, index: number) => {
        try {
            const checkReq = followDocs.filter(
                (req) =>
                    req.followeeId === followeeId &&
                    req.followerId === userData?.uid &&
                    req.status === "accept"
            );
            if (deleteReqArray[index]) {
                setCurrentIndex(index);
                setPendingDeleteReq(followeeId);
            }
            if (checkReq.length > 0) {
                const deleteId = checkReq
                    .filter((doc) => doc.followeeId === followeeId)
                    .map((doc) => doc.uid);
                if (deleteId.length > 0) {
                    const deleteReq = doc(db, "followRequests", deleteId[0]);
                    await deleteDoc(deleteReq);
                    setDeleteReqArray((prev) => {
                        const newArr = [...prev];
                        newArr[index] = true;
                        return newArr;
                    });
                    setCurrentIndex(index)
                    setProcessingRequest(followeeId);
                }
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const checkFollowRequest = (followeeId: string, followerId: string) => {
        return followDocs?.some(
            (request) =>
                request.followeeId === followeeId &&
                request.followerId === followerId &&
                request.status === "pending"
        );
    };
    const sendFollowRequest = async (followeeId: string) => {
        if (isRequestInProgress) {
            return;
        }
        setIsRequestInProgress(true);
        // Check for existing follow request
        const existingRequest = await getDocs(
            query(
                collection(db, "followRequests"),
                where("followerId", "==", userData?.uid),
                where("followeeId", "==", followeeId),
                where("status", "==", "pending")
            )
        );
        // Delete existing follow request if it exists
        if (!existingRequest.empty) {
            const deletePromises = existingRequest.docs.map(async (doc) => {
                await deleteDoc(doc.ref);
            });
            await Promise.all(deletePromises);
        }
        // Send new follow request
        const newFollowRequest = await addDoc(collection(db, "followRequests"), {
            followerId: userData?.uid,
            followeeId,
            status: "pending",
        });
        if (newFollowRequest) {
            setSendReqArray((prev) => {
                const newArr = [...prev];
                newArr[currentIndex] = true;
                return newArr;
            });
            // Refresh or check the follow request status
            // checkFollowRequest(followeeId, userData?.uid);
            // fetchAllFollowRequests();
        }
        setIsRequestInProgress(false);
    };
    useEffect(() => {
        if (deleteReqArray[currentIndex] && pendingDeleteReq) {
            sendFollowRequest(pendingDeleteReq);
        }
    }, [deleteReqArray, pendingDeleteReq]);

    const checkFollowingRequest = (uid: string) => {
        return followDocs?.some(
            (request) => request.followeeId === uid && request.status === "accept"
        );
    };

    return (
        <div className="w-full mx-auto p-4 text-[7px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px]">
            <h2 className="text-center text-[7px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-lg font-semibold mb-4">Following list</h2>
            <ul className="space-y-4">
                {isloading ? (
                    <div className="text-center">Loading...</div>
                ) : reqUsers.length === 0 ? (
                    <div className="text-[7px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[20px] text-center items-center font-bold text-black mt-4">You haven't followed anyone yet</div>
                ) : (
                    reqUsers?.map((user, index) => {
                        const isFollowing = checkFollowingRequest(user.uid);
                        const isRequest = checkFollowRequest(user.uid, userData?.uid);
                        const css = {
                            buttonStyle:
                                isFollowing && !deleteReqArray[index]
                                    ? "bg-[#67A76B] text-white hover:bg-green-600"
                                    : deleteReqArray[index] && sendReqArray[index]
                                        ? "bg-gray-400 text-white hover:bg-gray-600"
                                        : "bg-[#67A76B] text-white hover:bg-green-600",
                            buttonText:
                                isFollowing && !deleteReqArray[index]
                                    ? "Following"
                                    : sendReqArray[index]
                                        ? "Requested"
                                        : "Follow",
                        };
                        return (
                            <li
                                key={index}
                                className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md"
                            >
                                <div>
                                    <p className="text-[7px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[20px] font-medium">
                                        {user.userName + ", " + user.jobRole}
                                    </p>
                                </div>
                                <button
                                    className={`mr1 py-1 px-4 rounded-md font-semibold transition duration-300 ${css.buttonStyle}`}
                                    onClick={() => handleFollowingRequest(user.uid, index)}
                                    disabled={sendReqArray[index]}
                                >
                                    {css.buttonText}
                                </button>
                            </li>
                        );
                    })
                )}
            </ul>
        </div>
    );
};

export default Following;