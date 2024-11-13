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

const Following: React.FC<Props> = ({ userData }) => {
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
      finally{
        setIsLoading(false)
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


  const handleFollowingRequest = async (followeeId: string) => {
    try {
      const checkReq = followDocs.filter(
        (req) =>
          req.followeeId === followeeId &&
          req.followerId === userData?.uid &&
          req.status === "accept"
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
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const checkFollowingRequest = (uid: string) => {
    return followDocs?.some(
      (request) => request.followeeId === uid && request.status === "accept"
    );
  };

  return (
    <div className="w-full mx-auto p-4">
      <h2 className="text-center text-lg font-semibold mb-4">Following List</h2>
      <ul className="space-y-4">
        {isloading ? (
          <div className="text-center">Loading...</div>
        ) : reqUsers.length === 0 ? (
          <div className="text-center">No Follow Request</div>
        ) : (
          reqUsers?.map((user, index) => {
            const isFollowing = checkFollowingRequest(user.uid);
            const css = {
              buttonStyle: isFollowing && "bg-[#67A76B] text-white",
              buttonText: isFollowing && "Following",
            };
            return (
              <li
                key={index}
                className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md"
              >
                <div>
                  <p className="text-sm">
                    {user.userName + "," + user.jobRole}
                  </p>
                </div>
                <button
                  className={`mr1 py-1 px-4 rounded-md transition duration-300 ${css.buttonStyle}`}
                  onClick={() => handleFollowingRequest(user.uid)}
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
