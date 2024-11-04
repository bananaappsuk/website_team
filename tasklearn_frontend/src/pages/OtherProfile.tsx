/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import "../app/globals.css";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import clear from "../assets/home/image 2.png";
import submit from "../assets/home/image 1.png";
import searchIcon from "../assets/Quiz/Group 1.png";
import {
  collection,
  getDoc,
  doc,
  addDoc,
  deleteDoc,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { User } from "firebase/auth";

type UserData = {
  uid: string;
  email: string;
  userName: string;
  jobRole: string;
  profilePicUrl: string | undefined;
};
type Follow = {
  uid: string;
  followerId: string;
  followeeId: string;
  status: string;
};

const OtherProfile = () => {
  const [otherUser, setotherUser] = useState<UserData | null>(null);
  const [followDoc, setFollowDoc] = useState<Follow[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user); // Store Firebase user object
        const userDoc = await getDoc(doc(db, "users", user.uid)); // Fetch user data from Firestore

        if (userDoc.exists()) {
          // Add UID to the user data
          setUserData({
            ...userDoc.data(),
            uid: user.uid, // Include UID in the userData state
          } as unknown as UserData);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const fetchFollowRequests = async () => {
    const match = query(
      collection(db, "followRequests"),
      where("followerId", "==", userData?.uid),
      where("followeeId", "==", otherUser?.uid)
    );
    const followRequestsDoc = await getDocs(match);
    const request = followRequestsDoc.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          uid: doc.id,
        } as Follow)
    );
    setFollowDoc(request);
  };

  useEffect(() => {
    if (userData?.uid && otherUser?.uid  ) {
      fetchFollowRequests();
    }
  }, [userData, otherUser]);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      setotherUser(JSON.parse(userStr));
    }
  }, []);

  const handleFollowRequest = async () => {
    try {
      if (followDoc[0]) {     
         const deleteReq = doc(db, "followRequests", followDoc[0].uid);
         await deleteDoc(deleteReq);
         setFollowDoc([])
      } else {
        const sendFollowRequest = await addDoc(
          collection(db, "followRequests"),
          {
            followerId: userData?.uid,
            followeeId: otherUser?.uid,
            status: "pending",
          }
        );
        if (sendFollowRequest) {
          fetchFollowRequests();
        }
      }
    } catch (error) {}
  };

  const checkFollowRequest = () => {
    return followDoc?.some(
      (request) =>
        request.followeeId === otherUser?.uid &&
        request.followerId === userData?.uid &&
        request.status === "pending"
    );
  };

  const checkAcceptedRequest = () => {
    return followDoc?.some(
      (request) =>
        request.followeeId === otherUser?.uid &&
        request.followerId === userData?.uid &&
        request.status === "accept"
    );
  };

  const css = {
    stylePending: checkFollowRequest()
      ? "bg-gray-400 text-white"
      : "bg-[#67A76B] text-white",
    buttonText1: checkFollowRequest() ? "Requested" : "Follow",
    styleAccept: checkAcceptedRequest()
      ? "bg-[#67A76B] text-white"
      : "bg-gray-400 text-white",
    buttonText2: checkAcceptedRequest()
      ? "Following"
      : checkFollowRequest()
      ? "Requested"
      : "Follow",
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  
  return (
    <div className="w-full flex gap-2 bg-gray-100">
      <div className="flex flex-col lg:flex-row w-full">
        {/* Sidebar */}
        <div className="w-full lg:w-[7%] flex lg:flex-col items-center bg-white p-4">
          <div className="pt-4 text-green-500 text-lg md:text-3xl font-bold">
            <Link href="/Homepage">TL</Link>
          </div>
          <div className="hidden lg:block rounded-full overflow-hidden h-12 w-12 mt-4">
            {/* <img src="assets/Ellipse_1.png" alt="Profile" /> */}
          </div>
          <button className="mt-4 h-10 w-10 bg-gray-300 rounded-full text-3xl text-white">
            +
          </button>
        </div>
        {/* Main Content Area */}
        <div className="w-full lg:w-[100%] bg-white shadow-md p-4">
          {/* Header */}
          <div className="p-4 flex justify-between">
            <div className="text-start">
              <h1 className="text-[10px] sm:text-md md:text-md lg:text-2xl xl:text-3xl font-bold text-[#68A86B]">
                <Link href="/Homepage">T-askLearn</Link>
              </h1>
              <p className="text-[2px] sm:text-[4px] lg:text-[6px] xl:text-[8px] text-[#68A86B]">
                <Link href="/Homepage">
                  Collaborate to Learn, Learn to Collaborate
                </Link>
              </p>
            </div>
            <div className="px-4 text-black font-bold items-center flex justify-end gap-2">
              <Link href="/Homepage">H</Link>
              <Link href="/UserProfile">P</Link>
            </div>
          </div>
          <div className="h-[1px] w-full bg-gray-300"></div>
          {/* User Info */}
          <div className="flex flex-col lg:flex-row mt-4">
            <div className="w-full lg:w-auto items-center p-4  flex-col">
              <img
                src={otherUser?.profilePicUrl}
                alt="profilePic"
                className="bg-cover object-cover flex w-[67px] h-[67px] rounded-full mx-auto"
              />
              <p className="text-lg font-bold">
                {otherUser?.userName + "," + otherUser?.jobRole}
              </p>
            </div>
            <div className="ml-auto flex items-center">
              {/* Step 3: Add onClick handler to open modal */}
              <button
                className={`mb-20   rounded-md px-4 py-2 ${css.stylePending}`}
                onClick={handleFollowRequest}
              >
                {css.buttonText2}
              </button>
            </div>
          </div>
          {/* Main Quiz Section */}
          <div className="p-4 lg:w-[40%] float-left">
            {/* Quiz Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg font-bold underline">Quiz</h1>
              <span className="font-bold">12/08/2024</span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search key words"
                  className="border rounded-md px-3 pl-10 py-1 bg-gray-50"
                />
                <Image
                  src={searchIcon}
                  alt="Search Icon"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                />
              </div>
            </div>
            {/* Key Learning Points */}
            <div className="bg-white rounded-md p-4 mb-4">
              <h2 className="font-bold bg-gray-200 py-2 px-4 rounded-t-md">
                Key Learning Points
              </h2>
              <p className="text-center font-bold py-6 border">Ajith</p>
              {/* Action Section */}
              <h2 className="font-bold bg-gray-200 py-2 px-4 mt-4">Action</h2>
              <input
                type="text"
                placeholder="Enter Answer"
                className="w-full px-10 py-6 placeholder:text-green-800 text-center border rounded-md mt-2"
              />
            </div>
            {/* Icons Section */}
            <div className="flex justify-center mt-4 gap-8">
              <button className="text-red-600 flex items-center">
                <Image src={clear} alt="clear" className="h-8 w-8" />
              </button>
              <button className="text-green-600 flex items-center">
                <Image src={submit} alt="submit" className="h-10 w-10" />
              </button>
            </div>
            {/* Another Action Section */}
            <div className="p-4 mt-4">
              <h2 className="font-bold bg-gray-200 py-2 px-4">Action</h2>
              <button className="text-[#67A76B] font-bold underline w-full px-10 py-6 border shadow-sm">
                CLICK TO REVEAL ANSWER
              </button>
            </div>
            {/* Icons Section */}
            <div className="flex justify-center mt-4 gap-8">
              <button className="text-red-600 flex items-center">
                <img
                  src="assets/Vector_1.png"
                  alt="Clear"
                  className="h-8 w-8"
                />
              </button>
              <button className="text-green-600 flex items-center"></button>
            </div>
            {/* Score Section */}
            <div className="mt-12 text-black flex flex-col items-center">
              <div className="flex justify-center items-center font-bold mb-4">
                <span className="w-48 text-right mr-4">Score:</span>
                <input
                  className="w-12 text-center border rounded-md"
                  readOnly
                />{" "}
                /
                <input
                  className="w-12 text-center border rounded-md ml-2"
                  value="1"
                  readOnly
                />
              </div>
              <div className="flex justify-center items-center font-bold">
                <span className="w-48 text-right mr-4">Total Questions:</span>
                <input
                  className="w-12 text-center border rounded-md"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="p-4 border-2 rounded-lg ">
            {/* Tabs: Followers, Following, Career */}
            <div className="flex justify-around border-b mb-4 P1_2 fo_22">
              <button className="text-center flex-1 py-2 border-gray-400">
                Followers
              </button>
              <button className="text-center flex-1 py-2 border-gray-400">
                Following
              </button>
              <button className="text-center flex-1 py-2 border-gray-400">
                Career
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-center">
              {/* Followers Section */}
              <div className="bg-white p-4 shadow-md rounded-md">
                <h3 className="text-lg font-bold border-b pb-2 mb-4">
                  List of Followers
                </h3>
                <ul className="space-y-2">
                  <li className="border-b pb-2">Follower 1</li>
                  <li className="border-b pb-2">Follower 2</li>
                  <li className="border-b pb-2">Follower 3</li>
                  {/* Add more followers here */}
                </ul>
              </div>
              {/* Following Section */}
              <div className="bg-white p-4 shadow-md rounded-md">
                <h3 className="text-lg font-bold border-b pb-2 mb-4">
                  Following List
                </h3>
                <ul className="space-y-2">
                  <li className="border-b pb-2">Following 1</li>
                  <li className="border-b pb-2">Following 2</li>
                  <li className="border-b pb-2">Following 3</li>
                  {/* Add more following here */}
                </ul>
              </div>
              {/* Career Section */}
              <div className="bg-white p-4 shadow-md rounded-md">
                <h3 className="text-lg font-bold border-b pb-2 mb-4">
                  Qualifications
                </h3>
                <textarea
                  className="border mb-4 p-2 h-24 w-full resize-none" // Fixed height, full width, no resize
                ></textarea>
                <h3 className="text-lg font-bold border-b pb-2 mb-4">
                  Career Aspirations
                </h3>
                <textarea
                  className="border p-2 h-24 w-full resize-none" // Fixed height, full width, no resize
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherProfile;
