/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
    getDoc,
    doc,
    collection,
    addDoc,
    deleteDoc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import OtherProfileQuizzes from "./OtherProfileQuizzes";

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
    otherUser: UserData | null;
    userData: UserData | null
};
const OtherProfileSection: React.FC<Props> = ({ otherUser, userData }) => {
    const [followeeId, setFolloweeId] = useState<Follow[]>([]);
    const [userId, setUserId] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchAllFollowRequests = async (otherUserId: string, currentUserId: string) => {
            try {
                const q = query(
                    collection(db, "followRequests"),
                    where("status", "==", "accept"),
                    where("followeeId", "==", otherUserId),
                    where("followerId", "==", currentUserId),
                );
                const AllDocs = await getDocs(q);
                const followeeIds = AllDocs.docs.map((doc) => ({
                    followeeId: doc.data().followeeId,
                }));
                setFolloweeId(followeeIds.map((item) => item.followeeId));
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.error("Error fetching follow requests:", error);
                toast.error(error.message);
            }
        };
        if (otherUser?.uid && userData?.uid) {
            fetchAllFollowRequests(otherUser.uid, userData?.uid);
        }
    }, [otherUser?.uid]);
    return (
        <div>
            <OtherProfileQuizzes fetchId={followeeId} otherUser={otherUser} userDataCurrent={userData} />
        </div>
    );
};
export default OtherProfileSection;