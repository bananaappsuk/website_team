/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import FeedQuizzes from "@/components/FeedQuizzes";
import React, { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";

type Follow = {
    followeeId: string;
};

type UserData = {
    uid: string;
    email: string;
    userName: string;
    jobRole: string;
    profilePicUrl: string | undefined;
};

type Props = {
    userData: UserData | null;
};

const Feed: React.FC<Props> = ({ userData }) => {
    const [followeeId, setFolloweeId] = useState<Follow[]>([]);
    const [userId, setUserId] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const allUserId = async () => {
        try {
            const userDocs = await getDocs(collection(db, "users"));
            const users = userDocs.docs.map((doc) => {
                const data = doc.data() as UserData;
                return {
                    ...data,
                    uid: doc.id,
                };
            });

            const userFilter = users?.filter((user) => user.uid !== userData?.uid);
            if (userFilter) {
                setUserId(userFilter.map((ids) => ids.uid))
            }

        } catch (error) {
            console.error("Error getting user data:", error);
        }
    };


    useEffect(() => {
        const fetchAllFollowRequests = async () => {
            try {
                const q = query(
                    collection(db, "followRequests"),
                    where("status", "==", "accept"),
                    where("followerId", "==", userData?.uid)
                );

                const AllDocs = await getDocs(q);
                const followeeIds = AllDocs.docs.map((doc) => ({
                    followeeId: doc.data().followeeId,
                }));

                setFolloweeId(followeeIds);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.error("Error fetching follow requests:", error);
                toast.error(error.message);
            }
        };

        if (userData?.uid) {
            fetchAllFollowRequests();
            allUserId();
        }
    }, [userData?.uid]);

    return (
        <div>
            {(followeeId.length > 0 && userId.length > 0) || (followeeId.length === 0 && userId.length > 0) ? (
                <FeedQuizzes fetchId={followeeId} userId={userId} currentUserData={userData} />
            ) : (
                <div>
                    {/* Loading */}
                </div>
            )}
        </div>
    );
};

export default Feed;