/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
    import React, { useEffect, useRef, useState } from "react";
    import { useTask } from "../components/TaskContext";
    import { User } from "firebase/auth";
    import { auth, db } from "../firebase";
    import { getDoc, doc, query, where, updateDoc } from "firebase/firestore";
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
    import { collection, getDocs, addDoc, deleteDoc } from "firebase/firestore";
    import SidebarProfile from "@/components/SidebarProfile";
    import Followers from "./tabs/Followers";
    import Following from "./tabs/Following";
    import Career from "./tabs/Career";
    import Requests from "./tabs/FollowRequests";
    import { toast, ToastContainer } from "react-toastify";
    import { encryptData, decryptData } from "../utils/cryptoUtils";
    import Feed from "./tabs/Feed";
    import Saved from "./tabs/Saved";
    import { MdModeEditOutline } from "react-icons/md";
    import { getAuth } from 'firebase/auth';

    type Profile = {
        userName: string;
        jobRole: string;
    };

    const tabs = [
        { name: "MyQuiz" },
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
        const [activeTab, setActiveTab] = useState("MyQuiz");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { task, selectedServerId } = useTask();
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
        const [selectedServer, setSelectedServer] = useState<{
            serverId: string;
            serverName: string;
            memberList: string[];
            createdByUserId: string;
        } | null>(null);
        const { jobRoleLists } = useTask();
        const [edit, setEdit] = useState<boolean>(false);
        const [profileEdit, setProfileEdit] = useState<boolean>(false);
        const profilePicRef = useRef<HTMLInputElement>(null);
        const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
        const [buttonText, setButtonText] = useState("Save");
        const [profilePicLoading, setProfilePicLoading] = useState<boolean>(false)
        const [updatedProfileData, setUpdatedProfileData] = useState<Profile>({
            userName: "",
            jobRole: "",
        });
        useEffect(() => {
            if (userData && !profileEdit) {
                setUpdatedProfileData({
                    userName: userData?.userName || "",
                    jobRole: userData?.jobRole || "",
                });
            }
        }, [userData, profileEdit]);


    useEffect(() => {
        const searchUsers = async () => {
            if (searchTerm.trim() !== "") {
                const userDocs = await getDocs(collection(db, "users"));
                const users = userDocs.docs
                    .map((doc) => {
                        const data = doc.data() as UserData;
                        return { ...data, uid: doc.id };
                    })
                    .filter((user) => user.uid !== userData?.uid);

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
    }, []);

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
            setActiveTab("MyQuiz");
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
                router.push("/login");
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

    const handleProfile = (user: UserData) => {
        const encryptedUser = encryptData(user);
        if (encryptedUser) {
            sessionStorage.setItem("user", encryptedUser);
            router.push("/OtherProfile");
        } else {
            console.error("Failed to encrypt user data");
        }
    };

    const handleServerSelect = (server: {
        serverId: string;
        serverName: string;
        memberList: string[];
        createdByUserId: string;
    }) => {
        setSelectedServer(server); // Update with selected server's ID and name
    };

    const handleEditProfile = () => {
        setProfileEdit(true);
    };
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
        setUpdatedProfileData((prev) => {
            const newData = {
                ...prev,
                [name]: value,
            };
            const hasChanges =
                newData.userName !== userData?.userName ||
                newData.jobRole !== userData?.jobRole;
            const isEmpty =
                newData.userName.trim() === "" || newData.jobRole.trim() === "";
            setIsButtonDisabled(!hasChanges || isEmpty);
            if (!hasChanges || isEmpty) {
                setButtonText("Save"); // Reset to "Save" if both fields are empty
            } else if (hasChanges || !isEmpty) {
                setButtonText("Save Changes"); // Update to "Save Changes" if there's a modification
            }
            return newData;
        });
    };
    const handleProfileSave = async () => {
        try {
            const updates: any = {};
            if (updatedProfileData?.userName !== userData?.userName) {
                // Check if the new username already exists
                const usersRef = collection(db, "users");
                const docRef = query(
                    usersRef,
                    where("userName", "==", updatedProfileData?.userName)
                );
                const userDoc = await getDocs(docRef);
                if (!userDoc.empty) {
                    toast.error("Username already exists. Please choose another one.");
                    return;
                } else {
                    updates.userName = updatedProfileData?.userName;
                }
            }
            if (updatedProfileData?.jobRole !== userData?.jobRole) {
                updates.jobRole = updatedProfileData?.jobRole;
            }
            if (Object.keys(updates).length > 0) {
                const userRef = doc(db, "users", userData?.uid);
                await updateDoc(userRef, updates);
                // Fetch and update userData in real time
                const updatedUserDoc = await getDoc(userRef);
                if (updatedUserDoc.exists()) {
                    setUserData({
                        ...updatedUserDoc.data(),
                        uid: userData?.uid,
                    } as UserData);
                }
                toast.success("Profile updated successfully!");
                setProfileEdit(false);
                setIsButtonDisabled(true);
                setButtonText("Save");
            } else {
                toast.info("No changes to save.");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("An error occurred while updating the profile.");
        }
    };
    const profilePicUpload = async (profilePic: any) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                return;
            }

            const token = await user.getIdToken();
            const profile = new FormData();
            profile.append("profilePic", profilePic);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/upload/profile`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: profile,
                }
            );
            if (response.ok) {
                const data = await response.json();
                return data;
            }
        } catch (error: any) {
            toast.error(error);
        }
    };
    const handleProfilePicChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setProfilePicLoading(true);
        const { files, type } = e.target;
        try {
            const maxSize = 5 * 1024 * 1024;
            if (type === "file" && files) {
                if (!files[0]?.type.startsWith("image/")) {
                    toast.error("Please upload an image file.");
                    return
                } else if (files[0]?.type?.startsWith("image/")) {
                    if (files[0]?.size > maxSize) {
                        toast.error("File size is too large. Maximum size is 5MB.");
                        return;
                    }
                    else {
                        let profilePicUrl = "";
                        const profilePicData = await profilePicUpload(files[0]
                        );
                        profilePicUrl = profilePicData?.profilePicUrl || "";
                        if (profilePicUrl) {
                            const userRef = doc(db, "users", userData?.uid);
                            await updateDoc(userRef, {
                                profilePicUrl,
                            });
                            // Fetch and update userData in real time
                            const updatedUserDoc = await getDoc(userRef);
                            if (updatedUserDoc.exists()) {
                                setUserData({
                                    ...updatedUserDoc.data(),
                                    uid: userData?.uid,
                                } as UserData);
                            }
                            toast.success("Profile pic updated successfully!");
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("An error occurred while updating the profile pic.");
        }
        finally {
            setProfilePicLoading(false)
        }
    };


    return (
        <>
            <ToastContainer />
            <div className="w-full flex gap-2 bg-gray-100">
                <SidebarProfile userId={userId} handleTasksClick={function (arg: string): void {
                    throw new Error("Function not implemented.");
                }} setselectedTask={function (value: React.SetStateAction<boolean>): void {
                    throw new Error("Function not implemented.");
                }} taskCategories={[]} setDropdownVisible={function (value: React.SetStateAction<boolean[]>): void {
                    throw new Error("Function not implemented.");
                }} onServerSelect={handleServerSelect} handleResetInputs={function (): void {
                    throw new Error("Function not implemented.");
                }} setFilteredTasks={function (value: React.SetStateAction<any[]>): void {
                    throw new Error("Function not implemented.");
                }} />
                <div className="w-full bg-white shadow-md rounded-lg text-black">
                    <div className="p-4 flex justify-between">
                        <div className="text-start">
                            <h1 className="text-[12px] sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-[#68A86B]">
                                <a href="/Homepage">T-askLearn</a>
                            </h1>
                            <p className="text-center text-[3px] sm:text-[5px] md:text-[5px] lg:text-[6px] xl:text-[8px] text-[#68A86B]">
                                <a href="/Homepage">
                                    Collaborate to Learn, Learn to Collaborate
                                </a>
                            </p>
                        </div>
                        <div className="flex gap-4 items-center">
                            <div className="px-4 text-black font-bold flex justify-end gap-2">
                                <a href="/Homepage" onClick={handleBeforeUnload}>
                                    H
                                </a>
                                <a href="/UserProfile">P</a>
                            </div>
                            <button
                                onClick={logout}
                                className="mt-2 p-2 bg-[#68A86B] text-white rounded-md hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="h-[1px] w-full bg-gray-300" />
                    <div className="flex mb-4 mt-2 ">
                        <div

                            className="flex flex-row items-center ml-4 gap-y-1"
                        >
                            <div
                                className={`flex flex-col ${!profileEdit && " items-center"}`}
                            >
                                {userData?.profilePicUrl ? (
                                    <div
                                        className={` relative cursor-pointer`}
                                        onClick={() => {
                                            if (!profilePicLoading) {
                                                profilePicRef.current?.click();
                                            }
                                        }}
                                    >
                                        <img
                                            src={userData?.profilePicUrl}
                                            alt="profilePic"
                                            className="bg-cover object-cover flex w-[37px] h-[37px] sm:w-[47px] sm:h-[47px] lg:w-[57px] lg:h-[57px] xl:w-[67px] xl:h-[67px] rounded-full"
                                        />
                                        <input
                                            type="file"
                                            className=""
                                            style={{ display: "none" }}
                                            name="profilePic"
                                            ref={profilePicRef}
                                            accept="image/*"
                                            onChange={handleProfilePicChange}
                                            disabled={profilePicLoading}
                                        />
                                    </div>
                                ) : (
                                    <div
                                        className="flex items-center justify-center w-[37px] h-[37px] sm:w-[47px] sm:h-[47px] lg:w-[57px] lg:h-[57px] xl:w-[67px] xl:h-[67px] rounded-full bg-[#68A86B] text-white font-bold text-lg cursor-pointer"
                                        onClick={() => {
                                            if (!profilePicLoading) {
                                                profilePicRef.current?.click();
                                            }
                                        }}
                                    >
                                        {userData?.userName?.[0]?.toUpperCase() || "?"}
                                        <input
                                            type="file"
                                            className=""
                                            style={{ display: "none" }}
                                            name="profilePic"
                                            ref={profilePicRef}
                                            accept="image/*"
                                            onChange={handleProfilePicChange}
                                            disabled={profilePicLoading}
                                        />
                                    </div>
                                )}
                                <div
                                    className="mt-2 font-semibold flex gap-x-2  items-center"
                                    onMouseEnter={() => setEdit(true)}
                                    onMouseLeave={() => setEdit(false)}
                                >
                                    {profileEdit ? (
                                        <form className="flex-col space-y-2 space-x-2">
                                            <input
                                                type="text"
                                                className="p-1 w-[23%] border"
                                                value={updatedProfileData?.userName}
                                                autoFocus
                                                onChange={(e) => {
                                                    // This regex allows either only letters or a combination of letters and numbers, but not just numbers or special characters
                                                    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])|^[a-zA-Z]+$/;
                                                    const value = e.target.value;

                                                    // Check for allowed characters (letters and numbers only)
                                                    if (/^[a-zA-Z0-9]*$/.test(value) && (regex.test(value) || value === '')) {
                                                        handleChange(e); // Update form data if it meets the criteria
                                                    }
                                                }}
                                                minLength={3}
                                                maxLength={12}
                                                name="userName"
                                            />
                                            <select
                                                className="py-1 text-black rounded-sm border shrink-0 w-max "
                                                name="jobRole"
                                                value={updatedProfileData?.jobRole}
                                                onChange={handleChange}
                                            >
                                                <option value="" className="" disabled>
                                                    {updatedProfileData?.jobRole}
                                                </option>
                                                {profileEdit &&
                                                    jobRoleLists?.map((role, index) => (
                                                        <option key={index} value={role}>
                                                            {role}
                                                        </option>
                                                    ))}
                                            </select>
                                        </form>
                                    ) : (
                                        <div className="flex items-center">
                                            <p className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-[12px] xl:text-lg mt-2 font-bold">
                                                {userData?.userName}, <span>{userData?.jobRole}</span>
                                            </p>
                                            <div
                                                className={`ml-2 w-5 flex justify-center items-center mt-3 cursor-pointer`}
                                                onClick={handleEditProfile}
                                            >
                                                <MdModeEditOutline
                                                    className={`transition-opacity duration-300 ease-in-out ${edit && !profileEdit ? "flex" : "hidden"
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div
                                    className={`mt-3 mr-5 flex gap-x-3 ${profileEdit ? "flex" : "hidden"
                                        }`}
                                >
                                    <button
                                        className={` text-white py-1 px-4 rounded-md font-semibold ${isButtonDisabled
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-[#67A76B] hover:bg-green-600"
                                            } transition duration-300`}
                                        disabled={isButtonDisabled}
                                        onClick={handleProfileSave}
                                    >
                                        {buttonText}
                                    </button>
                                    <button
                                        className=" text-white py-1 px-4 rounded-md hover:bg-red-600 bg-[#D26767] font-semibold transition duration-300"
                                        onClick={() => {
                                            setProfileEdit(false);
                                            setIsButtonDisabled(true);
                                            setButtonText("Save");
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="ml-auto relative mt-4 mr-2 sm:mr-8">
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
                                    <div className="absolute bg-white text-black shadow-lg rounded-lg mt-2 w-full sm:w-96 max-h-60 overflow-y-auto z-10">
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user, index) => {
                                                return (
                                                    <div
                                                        className="flex justify-between items-center cursor-pointer"
                                                        onClick={() => handleProfile(user)}
                                                    >
                                                        <div
                                                            key={user.email}
                                                            className="p-2 border-b w-full"
                                                        >
                                                            <p className="font-semibold text-[9px] sm:text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px]">{user.userName}</p>
                                                            <p className="text-gray-500 text-[7px] sm:text-[9px] md:text-[11px] lg:text-[13px] xl:text-[15px]">
                                                                {user.jobRole}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="p-2 text-gray-500">No result found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="w-full px-1 md:px-2 lg:px-8 lg:space-x-4 md:space-x-0.5 space-x-1 flex border-b justify-between">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.name}
                                    className={`text-[4px] sm:text-[10px] md:text-[12px] lg:text-[14px] 2xl:text-[16px] px-2 lg:px-4 py-1 sm:py-2 ${activeTab === tab.name
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
                                                className="ml-0.5 sm:ml-2 w-1.5 h-1.5 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5"
                                            />
                                        )}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="p-4">
                            {activeTab === "MyQuiz" ? (
                                <div className="flex justify-center">
                                    <div className="w-full sm:w-[70%] shadow-lg border-2 rounded-lg p-8">

                                        <Quizzes userData={userData} />
                                    </div>
                                </div>
                            ) : activeTab === "Library" ? (
                                <div className="flex justify-center">
                                    <div className="w-full sm:w-[70%] shadow-lg border-2 rounded-lg p-8">
                                        {selectedServer ? (
                                            <Libraries selectedServer={selectedServer} userData={userData} />
                                        ) : (
                                            <div className="text-[20px] text-center items-center font-bold text-black mt-12">
                                                Create or Select a server
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : activeTab === "Tracking" ? (
                                <div className="flex justify-center">
                                    <div className="w-full sm:w-[70%]  shadow-lg border-2 rounded-lg p-8">
                                        {selectedServer ? (
                                            <Tracking selectedServer={selectedServer} currentUserData={userData} />
                                        ) : (
                                            <div className="text-[20px] text-center items-center font-bold text-black mt-12">
                                                Create or Select a server
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : activeTab === "Followers" ? (
                                <div className="flex justify-center">
                                    <div className="w-full sm:w-[70%] shadow-lg border-2 rounded-lg p-8">
                                        <Followers userData={userData} />
                                    </div>
                                </div>
                            ) : activeTab === "Following" ? (
                                <div className="flex justify-center">
                                    <div className="w-full sm:w-[70%] shadow-lg border-2 rounded-lg p-8">
                                        <Following userData={userData} />
                                    </div>
                                </div>
                            ) : activeTab === "Career" ? (
                                <div className="flex justify-center">
                                    <div className="w-full sm:w-[70%] shadow-lg border-2 rounded-lg p-8">
                                        <Career userData={userData} />
                                    </div>
                                </div>
                            ) : activeTab === "Requests" ? (
                                <div className="flex justify-center">
                                    <div className="w-full sm:w-[70%] shadow-lg border-2 rounded-lg p-8">
                                        <Requests userData={userData} />
                                    </div>
                                </div>
                            ) : activeTab === "Feed" ? (
                                <div className="flex justify-center">
                                    <div className="w-full sm:w-[70%] shadow-lg border-2 rounded-lg p-8">
                                        <Feed userData={userData} />
                                    </div>
                                </div>
                            ) : activeTab === "Saved" ? (
                                <div className="flex justify-center">
                                    <div className="w-full sm:w-[70%] shadow-lg border-2 rounded-lg p-8">
                                        <Saved userData={userData} />
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