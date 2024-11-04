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
  followDocs: Follow[];
  userData: UserData | null;
  setFollowDocs: React.Dispatch<React.SetStateAction<Follow[]>>;
};

const Following: React.FC<Props> = ({
  userData,
  followDocs,
  setFollowDocs,
}) => {
  const [reqUsers, setReqUsers] = useState<UserData[]>([]);
  const [followerIds, setFollowerIds] = useState<string[]>([]);
  const [isloading, setIsLoading] = useState(true);

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
    setReqUsers(userDetails);
    return userDetails;
  };

  useEffect(() => {
    const fetchFollowerIds = async () => {
      const newId = followDocs?.filter(
        (req) => req.followeeId === userData?.uid && req.status === "accept"
      );
      const followerIds = newId.map((req) => req.followerId);

      setFollowerIds(followerIds);
      fetchUserDetails(followerIds);
    };

    fetchFollowerIds();
  }, [followDocs]);

  console.log(reqUsers);

  return (
    <div className="w-full mx-auto p-4">
      <h2 className="text-center text-lg font-semibold mb-4">Following List</h2>
      <ul className="space-y-4">
        {reqUsers?.map((user, index) => {
          return (
            <li
              key={index}
              className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md"
            >
              <div>
                <p className="text-sm">{user.userName + "," + user.jobRole}</p>
              </div>
              <button className=" mr1 text-white py-1 px-4 rounded-md bg-[#67A76B] transition duration-300">
                Follow
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Following;
