import React, { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
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
};

const Requests: React.FC<Props> = ({ followDocs, userData }) => {
  const [reqUsers, setReqUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const newId = followDocs.filter((req) => req.followeeId === userData?.uid);
  const followerIds = newId.map((req) => req.followerId);

  const fetchUserDetails = async (followerIds: any) => {
    const userDetails: UserData[] = [];
    for (const id of followerIds) {
      const userDocRef = doc(db, "users", id);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        userDetails.push(userDoc.data() as UserData);
      }
    }
    setLoading(true)
    setReqUsers(userDetails);
    setLoading(false)
  };

  useEffect(() => {
    fetchUserDetails(followerIds);
   
  }, []);



  console.log(reqUsers);

  console.log(loading);

  return (
    <div className="w-full mx-auto p-4">
      <h2 className="text-center text-lg font-semibold mb-4">
        Follow Requests
      </h2>
      {
        loading && <div className=" text-center">
        loading....
        </div>
      }
      <ul className="space-y-4">
        {reqUsers?.map((user, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md"
          >
            <div>
              <p className=" text-xl font-medium">
                {user.userName + "," + user.jobRole}
              </p>
            </div>
            <div className="flex space-x-2 mr1">
              <button className="bgco_2 text-white py-1 px-4 rounded-md hover:bg-green-600 transition duration-300">
                Accept
              </button>
              <button className="bgco_3 text-white py-1 px-4 rounded-md hover:bg-red-600 transition duration-300">
                Decline
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Requests;
