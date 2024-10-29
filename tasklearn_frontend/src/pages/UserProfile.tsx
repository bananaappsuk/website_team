/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
import React, { useEffect, useRef, useState } from "react";
import { useTask } from "../components/TaskContext";
import { User } from "firebase/auth";
import { auth, db } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import "../../src/app/globals.css";
import Quizzes from "./tabs/Quizzes";
import Image from "next/image";
import searchIcon from "../../src/assets/Quiz/Group 1.png";
import goldStar from "../../src/assets/Library/Vector (1).png";
import grayStar from "../../src/assets/Library/Vector.png";
import { useRouter } from "next/router";
import Libraries from "./tabs/Libraries";
import Tracking from "./tabs/Tracking";
import { useAuth } from "../auth";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import SidebarProfile from "@/components/SidebarProfile";
import Followers from "./tabs/Followers";
import Following from "./tabs/Following";
import Career from "./tabs/Career";
import Requests from "./tabs/FollowRequests";
import { toast } from "react-toastify";

const tabs = [
  { name: "My Quiz" },
  { name: "Library" },
  { name: "Tracking", content: "Tracking Content" },
  { name: "Feed", content: "Feed Content" },
  { name: "Followers", content: "Followers Content" },
  { name: "Following", content: "Following Content" },
  { name: "Saved", content: "Saved Content" },
  { name: "Career", content: "Career Content" },
  { name: "Requests", content: "Requests Content" },
];

const UserProfile = () => {
  type UserData = {
    uid: any;
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
  const [showLogout, setShowLogout] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("My Quiz");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { task } = useTask();
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [followDocs, setFollowDocs] = useState<Follow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const { logout } = useAuth();
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const [showResults, setShowResults] = useState(false);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.trim() !== "") {
        const userDocs = await getDocs(collection(db, "users"));
        const users = userDocs.docs.map((doc) => {
          const data = doc.data() as UserData;
          return { ...data, uid: doc.id };
        });

        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        // Determine the match type based on the length of the search term
        const filtered = users.filter((user) => {
          const userName = user.userName?.toLowerCase();
          const jobRole = user.jobRole?.toLowerCase();

          // Match one letter or two or more letters
          if (lowerCaseSearchTerm.length === 1) {
            return (
              (userName && userName.includes(lowerCaseSearchTerm)) ||
              (jobRole && jobRole.includes(lowerCaseSearchTerm))
            );
          } else if (lowerCaseSearchTerm.length >= 2) {
            return (
              (userName && userName.includes(lowerCaseSearchTerm)) ||
              (jobRole && jobRole.includes(lowerCaseSearchTerm))
            );
          }
          return false; // No match if the search term is empty or less than 1
        });

        setFilteredUsers(filtered);
      } else {
        setFilteredUsers([]);
      }
    };
    searchUsers();
  }, [searchTerm]);

  useEffect(() => {
    const fetchAllFollowRequests = async () => {
      const allFollowRequestsDoc = await getDocs(
        collection(db, "followRequests")
      );
      const requests = allFollowRequestsDoc.docs.map((doc) => {
        return { ...doc.data(), uid: doc.id } as Follow;
      });
      setFollowDocs(requests);
    };

    fetchAllFollowRequests();
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setFilteredUsers([]); // Clear search results when clicking outside
        setShowResults(false); // Hide search results
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]); // Removed the other `handleClickOutsidee` logic

  const handleToggle = () => {
    setShowLogout((prev) => !prev);
  };

  // Handle click outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowLogout(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    const storedLink = localStorage.getItem("activeLink");
    if (storedLink) {
      setActiveTab(storedLink);
    } else {
      setActiveTab("My Quiz");
    }
  }, [router.pathname]);

  const handleBeforeUnload = () => {
    localStorage.removeItem("activeLink");
  };

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

  useEffect(() => {
    if (!loading && !user) {
      setRedirecting(true);
      const timer = setTimeout(() => {
        router.push("/signin");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [loading, user, router]);

  const userId = userData ? userData.uid : null;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (redirecting) {
    return <div>You are not logged in. Redirecting...</div>;
  }

  const fetchFollowRequest = async () => {
    try {
      const allFollowRequestsDoc = await getDocs(
        collection(db, "followRequests")
      );
      const requests = allFollowRequestsDoc.docs.map((doc) => {
        return { ...doc.data(), uid: doc.id } as Follow;
      });
      setFollowDocs(requests);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleFollowRequest = async (followeeId: string) => {
    try {
      const checkReq = followDocs.filter(
        (req) =>
          req.followeeId === followeeId &&
          req.followerId === userData?.uid &&
          req.status === "pending"
      );
      if (checkReq[0]) {
        const deleteReq = doc(db, "followRequests", checkReq[0].uid);
        await deleteDoc(deleteReq);
        setFollowDocs((prevFollowDocs) =>
          prevFollowDocs.filter((doc) => doc.uid !== checkReq[0].uid)
        );
      } else {
        console.log("send");

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
    return followDocs.some(
      (request) =>
        request.followeeId === uid && request.followerId === userData?.uid
    );
  };


  return (
    <>
      <div className="w-full flex gap-2 bg-gray-100">
        <SidebarProfile userId={userId} />
        <div className="w-full bg-white shadow-md rounded-lg text-black">
          <div className="p-4 flex justify-between">
            <div className="text-start">
              <h1 className="text-[10px] sm:text-md md:text-md lg:text-2xl xl:text-3xl font-bold text-[#68A86B]">
                <a href="/Homepage">T-askLearn</a>
              </h1>
              <p className="text-[2px] sm:text-[4px] lg:text-[6px] xl:text-[8px] text-[#68A86B]">
                <a href="/Homepage">
                  Collaborate to Learn, Learn to Collaborate
                </a>
              </p>
            </div>

            <div className="px-4 text-black font-bold items-center flex justify-end gap-2">
              <a href="/Homepage" onClick={handleBeforeUnload}>
                H
              </a>
              <a href="/UserProfile">P</a>
            </div>
          </div>

          <div className="h-[1px] w-full bg-gray-300" />
          <div className="flex mb-4 mt-2 ">
            <div
              ref={dropdownRef}
              className="flex flex-row items-center ml-4 gap-y-1"
            >
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={handleToggle}
              >
                <img
                  src={userData?.profilePicUrl}
                  alt="profilePic"
                  className="bg-cover object-cover flex w-[67px] h-[67px] rounded-full"
                />
                <p className="mt-2 font-semibold">
                  {userData?.userName}, <span>{userData?.jobRole}</span>
                </p>
              </div>

              {/* Conditionally render the Logout button */}
              {showLogout && (
                <button
                  onClick={logout}
                  className="mt-2 p-2 bg-[#68A86B] text-white rounded-md hover:bg-red-600"
                >
                  Logout
                </button>
              )}
            </div>
            <div className="ml-auto relative mt-4 mr-8">
              <div ref={searchRef} className="relative">
                <input
                  type="text"
                  placeholder="Search for users by name, job title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setShowResults(true)}
                  className="border-2 rounded-md px-3 pl-12 py-1 bg-gray-100 w-full sm:w-96"
                />
                <Image
                  src={searchIcon}
                  alt="Search Icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                />
                {showResults && searchTerm && (
                  <div className="absolute bg-white text-black shadow-lg rounded-lg mt-2 w-full sm:w-96 max-h-60 overflow-y-auto">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user, index) => (
                        <div className="flex justify-between items-center">
                          <div key={user.email} className="p-2 border-b">
                            <p className="font-semibold">{user.userName}</p>
                            <p className="text-sm text-gray-500">
                              {user.jobRole}
                            </p>
                          </div>
                          {userData?.userName !== user.userName && (
                            <button
                              className={`py-2 px-4 rounded-md ${
                                checkFollowRequest(user.uid)
                                  ? "bg-gray-400 text-white"
                                  : "bg-green-600 text-white"
                              }`}
                              ref={(el: any) =>
                                (buttonRefs.current[index] = el)
                              }
                              onClick={() => handleFollowRequest(user.uid)}
                            >
                              {checkFollowRequest(user.uid)
                                ? "Requested"
                                : "Follow"}
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500">No result found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="px-8 flex space-x-4 border-b justify-between">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  className={`px-4 py-2 ${
                    activeTab === tab.name
                      ? "rounded-md border-b-2 border-[#68A86B] bg-[#68A86B] text-white"
                      : "text-gray-500"
                  }`}
                  onClick={() => {
                    setActiveTab(tab.name);
                    localStorage.setItem("activeLink", tab.name);
                  }}
                >
                  <span className="flex items-center">
                    {tab.name}{" "}
                    {tab.name === "Library" && (
                      <Image
                        src={activeTab === "Library" ? goldStar : grayStar}
                        alt="Star Icon"
                        width={20}
                        height={20}
                        className="ml-2"
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-4">
              {activeTab === "My Quiz" ? (
                <div className="flex justify-center">
                  <div className="w-[70%] shadow-lg border-2 rounded-lg p-8">
                    <div className="px-28 pt-8 pb-4 flex justify-between items-center">
                      <div>
                        <input
                          type="radio"
                          id="onlyMe"
                          name="visibility"
                          defaultChecked
                        />
                        <label htmlFor="onlyMe" className="ml-2">
                          Only Me
                        </label>
                      </div>
                      <div>
                        <input type="radio" id="followers" name="visibility" />
                        <label htmlFor="followers" className="ml-2">
                          Followers
                        </label>
                      </div>
                      <div>
                        <input type="radio" id="public" name="visibility" />
                        <label htmlFor="public" className="ml-2">
                          Public
                        </label>
                      </div>
                    </div>
                    <Quizzes />
                  </div>
                </div>
              ) : activeTab === "Library" ? (
                <div className="flex justify-center">
                  <div className="w-[70%] shadow-lg border-2 rounded-lg p-8">
                    <Libraries />
                  </div>
                </div>
              ) : activeTab === "Tracking" ? (
                <div className="flex justify-center">
                  <div className="w-[70%] shadow-lg border-2 rounded-lg p-8">
                    <Tracking />
                  </div>
                </div>
              ) : activeTab === "Followers" ? (
                <div className="flex justify-center">
                  <div className="w-[70%] shadow-lg border-2 rounded-lg p-8">
                    <Followers />
                  </div>
                </div>
              ) : activeTab === "Following" ? (
                <div className="flex justify-center">
                  <div className="w-[70%] shadow-lg border-2 rounded-lg p-8">
                    <Following />
                  </div>
                </div>
              ) : activeTab === "Career" ? (
                <div className="flex justify-center">
                  <div className="w-[70%] shadow-lg border-2 rounded-lg p-8">
                    <Career />
                  </div>
                </div>
              ) : activeTab === "Requests" ? (
                <div className="flex justify-center">
                  <div className="w-[70%] shadow-lg border-2 rounded-lg p-8">
                    <Requests followDocs={followDocs} userData={userData} />
                  </div>
                </div>
              ) : (
                tabs.map(
                  (tab) =>
                    activeTab === tab.name && (
                      <div key={tab.name}>
                        <h2 className="text-xl font-bold">{tab.name} Page</h2>
                        <p>{tab.content}</p>
                      </div>
                    )
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
