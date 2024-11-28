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
  userData:UserData | null
};

const OtherProfileSection: React.FC<Props> = ({ otherUser, userData }) => {
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
        setUserId(userFilter.map((ids) => ids.uid));
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
          where("followeeId", "==", otherUser?.uid)
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

    if (otherUser?.uid) {
      fetchAllFollowRequests();
      allUserId();
    }
  }, [otherUser?.uid]);

  console.log(userId);

  return (
    <div>
      {(followeeId.length > 0 && userId.length > 0) ||
      (followeeId.length === 0 && userId.length > 0) ? (
        <OtherProfileQuizzes fetchId={followeeId} userId={userId} />
      ) : (
        <div>No Quizzes available</div>
      )}
    </div>
  );
};

export default OtherProfileSection;
