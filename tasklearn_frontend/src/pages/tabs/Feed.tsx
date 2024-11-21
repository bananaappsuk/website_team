import FeedQuizzes from "@/components/FeedQuizzes";
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
import { db } from "../../firebase";
import { toast } from "react-toastify";

type Follow = {
  followeeId: string;
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

const Feed: React.FC<Props> = ({ userData }) => {
  const [followeeId, setFolloweeId] = useState<Follow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      } catch (error: any) {
        console.error("Error fetching follow requests:", error);
        toast.error(error.message);
      }
    };

    if (userData?.uid) {
      fetchAllFollowRequests();
    }
  }, [userData?.uid]);

  console.log(followeeId);

  return (
    <div>
      <FeedQuizzes />
    </div>
  );
};

export default Feed;
