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

const Followers: React.FC<Props> = ({ userData }) => {
    const [reqUsers, setReqUsers] = useState<UserData[]>([]);
    const [followerIds, setFollowerIds] = useState<string[]>([]);
    const [isloading, setIsLoading] = useState(true);
    const [followDocs, setFollowDocs] = useState<Follow[]>([]);

    useEffect(() => {
        const fetchAllFollowRequests = async () => {
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
            }
        };

        fetchAllFollowRequests();
    }, []);

    const fetchUserDetails = async (
        followerIds: string[]
    ): Promise<UserData[]> => {
        setIsLoading(true);
        if (followerIds.length === 0) {
            setIsLoading(false);
            return [];
        }
        const userDetails: UserData[] = [];
        for (const id of followerIds) {
            const userDoc = await getDoc(doc(db, "users", id));
            if (userDoc.exists()) {
                userDetails.push({ uid: id, ...userDoc.data() } as UserData);
            } else {
                setIsLoading(false);
            }
        }

        return userDetails;
    };

    useEffect(() => {
        if (followDocs.length === 0) {
            return;
        }

        const fetchFollowerIds = async () => {
            try {
                const newId = followDocs?.filter(
                    (req) => req.followeeId === userData?.uid && req.status === "accept"
                );
                const followerIds = newId.map((req) => req.followerId);

                setFollowerIds(followerIds); // Set follower IDs

                const details = await fetchUserDetails(followerIds); // Fetch user details
                setReqUsers(details);
                setIsLoading(false);
            } catch (error) {
                toast.error("Error fetching follower IDs and user details.");
            }
        };

        fetchFollowerIds();
    }, [followDocs]);

    const fetchFollowRequest = async () => {
        const allFollowRequestsDoc = await getDocs(
            collection(db, "followRequests")
        );
        const requests = allFollowRequestsDoc.docs.map((doc) => {
            return { ...doc.data(), uid: doc.id } as Follow;
        });
        setFollowDocs(requests);
    };

    const handleFollowRequest = async (followeeId: string) => {
        try {
            const checkReq = followDocs.filter(
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

                    setFollowDocs((prevFollowDocs) =>
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
                    fetchFollowRequest();
                }
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };
    const checkFollowRequest = (uid: string) => {
        return followDocs?.some(
            (request) =>
                request.followeeId === uid && request.followerId === userData?.uid
        );
    };
    const checkAcceptedRequest = (followeeId: string) => {
        return followDocs?.some(
            (request) =>
                request.followeeId === followeeId &&
                request.followerId === userData?.uid &&
                request.status === "accept"
        );
    };

    return (
        <div className="w-full mx-auto p-4">
            <h2 className="text-center text-lg font-semibold mb-4">
                List of followers
            </h2>
            <ul className="space-y-4">
                {isloading && <div className="text-center">Loading...</div>}

                {/* No Followers Found */}
                {!isloading && reqUsers.length === 0 && (
                    <div className="text-center">You Don't Have Any Followers Yet</div>
                )}
                {!isloading &&
                    reqUsers?.map((user, index) => {
                        const isPending = checkFollowRequest(user.uid);
                        const isAccepted = checkAcceptedRequest(user.uid);
                        const css = {
                            buttonStyle: isAccepted
                                ? "bg-[#67A76B] text-white hover:bg-green-600"
                                : isPending
                                    ? "bg-gray-400 text-white hover:bg-gray-600 "
                                    : "bg-[#67A76B] text-white hover:bg-green-600",
                            buttonText: isAccepted
                                ? "Follower"
                                : isPending
                                    ? "Requested"
                                    : "Follow Back",
                        };
                        return (
                            <li
                                key={index}
                                className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md"
                            >
                                <div>
                                    <p className="text-md font-medium">
                                        {user.userName + ", " + user.jobRole}
                                    </p>
                                </div>
                                <button
                                    className={` py-1 px-4 rounded-md transition duration-300  ${css.buttonStyle} `}
                                    onClick={() => handleFollowRequest(user.uid)}
                                >
                                    {css.buttonText}
                                </button>
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
};

export default Followers;