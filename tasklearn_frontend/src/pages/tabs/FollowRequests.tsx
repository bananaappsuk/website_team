/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
    collection,
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

const Requests: React.FC<Props> = ({ userData }) => {
    const [reqUsers, setReqUsers] = useState<UserData[]>([]);
    const [followerIds, setFollowerIds] = useState<string[]>([]);
    const [isloading, setIsLoading] = useState(true);
    const [followDocs, setFollowDocs] = useState<Follow[]>([]);

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
        return userDetails;
    };

    useEffect(() => {
        const fetchFollowerIds = async () => {
            if (followDocs.length > 0) {
                const newId = followDocs.filter(
                    (req) => req.followeeId === userData?.uid && req.status === "pending"
                );
                const followerIds = newId.map((req) => req.followerId);
                setFollowerIds(followerIds);
                const details = await fetchUserDetails(followerIds);
                setReqUsers(details);
            }
            setIsLoading(false);
        };
        fetchFollowerIds();
    }, [followDocs]);

    useEffect(() => {
        const updateReqUsers = async () => {
            if (followerIds.length > 0) {
                const details = await fetchUserDetails(followerIds);
                setReqUsers(details);
                setIsLoading(false);
            } else {
                setIsLoading(true);
                setReqUsers([]);
            }
        };
        updateReqUsers();
    }, [followerIds]);

    const handleAccept = async (followerId: string) => {
        try {
            const reqDoc = followDocs?.find(
                (doc) =>
                    followerId === doc.followerId && userData?.uid === doc.followeeId
            );

            if (reqDoc) {
                const followRequestRef = doc(db, "followRequests", reqDoc.uid);
                //update firebase doc
                await updateDoc(followRequestRef, { status: "accept" });

                //update state
                const newFollowDocs = followDocs.map((doc) =>
                    doc.uid === reqDoc.uid ? { ...doc, status: "accept" } : doc
                );
                setFollowDocs(newFollowDocs);
                // updated follower IDs based on the newly updated state
                const updatedFollowerIds = newFollowDocs
                    .filter(
                        (doc) =>
                            doc.followeeId === userData?.uid && doc.status === "pending"
                    )
                    .map((req) => req.followerId);

                // Fetch and set user details
                const userDetails = await fetchUserDetails(updatedFollowerIds);
                setReqUsers(userDetails);
            }
        } catch (error) {
            console.error("Error updating follow request:", error);
        }
    };

    const handleDecline = async (followerId: string) => {
        try {
            const reqDoc = followDocs?.find(
                (doc) =>
                    followerId === doc.followerId && userData?.uid === doc.followeeId
            );

            if (reqDoc) {
                const deleteReq = doc(db, "followRequests", reqDoc?.uid);
                await deleteDoc(deleteReq);

                setFollowDocs((prevFollowDocs) =>
                    prevFollowDocs.filter((doc) => doc.uid !== reqDoc.uid)
                );

                setReqUsers((prevReqUsers) =>
                    prevReqUsers.filter((user) => user.uid !== followerId)
                );
            }
        } catch (error) {
            console.error("Error decline follow request:", error);
        }
    };

    return (
        <div className="w-full mx-auto p-4">
            <h2 className="text-center text-lg font-semibold mb-4">
                Follow Requests
            </h2>
            <ul className="space-y-4">
                {isloading ? (
                    <div className="text-center">Loading...</div>
                ) : reqUsers.length === 0 ? (
                    <div className="text-center text-[20px]">No follow requests</div>
                ) : (
                    reqUsers?.map((user, index) => (
                        <li
                            key={index}
                            className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md"
                        >
                            <div>
                                <p className="text-[20px] font-medium">
                                    {user.userName + "," + user.jobRole}
                                </p>
                            </div>
                            <div className="flex space-x-2 mr1">
                                <button
                                    className="bgco_2 text-white py-1 px-4 rounded-md font-semibold hover:bg-green-600 bg-[#67A76B] transition duration-300"
                                    onClick={() => handleAccept(user.uid)}
                                >
                                    Accept
                                </button>
                                <button
                                    className="bgco_3 text-white py-1 px-4 rounded-md hover:bg-red-600 bg-[#D26767] transition duration-300"
                                    onClick={() => handleDecline(user.uid)}
                                >
                                    Decline
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default Requests;