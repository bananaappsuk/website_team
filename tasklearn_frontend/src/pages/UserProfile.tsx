/* eslint-disable @next/next/no-html-link-for-pages */
import React, { useEffect, useState } from "react";
import { useTask } from "../components/TaskContext";
import { User } from "firebase/auth";
import { auth } from "../firebase";
import "../../src/app/globals.css";
import Quizzes from "./tabs/Quizzes";
import Profile from "../../src/assets/home/Ellipse 1.png";
import Image from "next/image";
import searchIcon from "../../src/assets/Quiz/Group 1.png";
import goldStar from "../../src/assets/Library/Vector (1).png";
import grayStar from "../../src/assets/Library/Vector.png";
import { useRouter } from "next/router";
import Libraries from "./tabs/Libraries";
import Tracking from "./tabs/Tracking";

const tabs = [
  { name: "My Quiz" },
  { name: "Library" },
  { name: "Tracking"},
  { name: "Feed", content: "Feed Content" },
  { name: "Followers", content: "Followers Content" },
  { name: "Following", content: "Following Content" },
  { name: "Saved", content: "Saved Content" },
  { name: "Career", content: "Career Content" },
  { name: "Requests", content: "Requests Content" },
];

const UserProfile = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("My Quiz");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { task } = useTask();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  //useEffect for storeLink
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
    if (!loading && !user) {
      setRedirecting(true);
      const timer = setTimeout(() => {
        router.push("/signin");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [loading, user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (redirecting) {
    return <div>You are not logged in. Redirecting...</div>;
  }

  return (
    <>
      <div className="w-full flex gap-2 bg-gray-100">
        <div className="w-[7%] flex flex-col items-center space-y-4 bg-white min-h-screen">
          <div className="pt-4 text-green-500 text-lg md:text-3xl font-bold">
            <a href="/Homepage">TL</a>
          </div>
          <div className="rounded-full overflow-hidden h-6 w-6 md:w-10 md:h-10 lg:w-12 lg:h-12">
            <Image src={Profile} alt="Profile Picture" width={64} height={64} />
          </div>

          <button className="flex items-center justify-center h-6 w-6 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gray-300 rounded-full text-3xl text-white">
            +
          </button>
        </div>
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
          <div className="flex">
            <h1 className="p-8">
              {user ? user.email : "No user information available"}
            </h1>
            <div className="ml-auto relative mt-4 mr-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for users by name, job title"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-2 rounded-md px-3 pl-12 py-1 bg-gray-100 w-full sm:w-96"
                />
                <Image
                  src={searchIcon}
                  alt="Search Icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5"
                />
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
                  <div className="w-[90%] shadow-lg border-2 rounded-lg p-8">
                    <Tracking />
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
