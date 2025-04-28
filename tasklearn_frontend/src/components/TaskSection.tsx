/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HiChevronRight } from "react-icons/hi";
import deleteIcon from "../assets/Quiz/Vector.png";
import removeUserIcon from "../assets/home/remove-user.jpg";
import exitIcon from "../assets/home/exit.png"
import { HiChevronDown, HiX } from "react-icons/hi";
import { Task, useTask } from "../components/TaskContext";
import axios from "axios";
import { toast } from "react-toastify";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import Plus from "../assets/home/icon.png";
import { getAuth } from "firebase/auth";
import { Router } from "react-router-dom";
import { RxExit } from "react-icons/rx";

interface Server {
    _id: string;
    channelName: string;
    createdByUserId: string;
}

interface ServerDisplayProps {
    server: { serverId: string; serverName: string; createdByUserId: string, memberList: string[]; } | null;

}

type UserData = {
    uid: any;
    email: string;
    userName: string;
    jobRole: string;
    profilePicUrl: string | undefined;
};

type Props = {
    selectedTask: boolean;
    setselectedTask: React.Dispatch<React.SetStateAction<boolean>>;
    taskCategories: string[];
    filteredTasks: any[];
    dropdownVisible: boolean[];
    setDropdownVisible: React.Dispatch<React.SetStateAction<boolean[]>>;
    handleTasksClick: (arg: string) => void;
    setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
    filter: string;
    fetchTasks: (args: string) => void;
    setFilter: React.Dispatch<React.SetStateAction<string>>;
    taskLoading: boolean;
    setShowQuiz: React.Dispatch<React.SetStateAction<boolean>>;
    showQuiz: boolean;
    setSelectedQuizTaskId: React.Dispatch<React.SetStateAction<string>>;
    setBtnDisble: React.Dispatch<React.SetStateAction<boolean>>;
    setFilteredTasks: React.Dispatch<React.SetStateAction<any[]>>;
    fetchUsernames: (uids: string[]) => Promise<UserName[]>;
    fetchUsername: (uid: string) => Promise<string>;
    refreshTrigger: boolean;
    quizzes: any[];
    userData: UserData | null;
    setTaggedStaffTags: React.Dispatch<React.SetStateAction<string[]>>;
    setContributingTags: React.Dispatch<React.SetStateAction<string[]>>;
    handleResetInputs: () => void;
};

interface UserName {
    userName: string;
}
interface JobRole {
    jobRole: string;
}
interface TaskSectionProps {
    server: { serverId: string; serverName: string; createdByUserId: string; memberList: string[] } | null;
}
interface ServerMember {
    userId: string;
    uid: string;  
    username: string;
    jobRole: string;
}
type CombinedProps = ServerDisplayProps & Props & Server & TaskSectionProps;

const TaskSection: React.FC<CombinedProps> = ({
    refreshTrigger,
    server,
    setselectedTask,
    selectedTask,
    taskCategories,
    filteredTasks,
    dropdownVisible,
    setDropdownVisible,
    handleTasksClick,
    setShowForm,
    filter,
    setFilter,
    fetchTasks,
    taskLoading,
    showQuiz,
    setShowQuiz,
    setSelectedQuizTaskId,
    setBtnDisble,
    setFilteredTasks,
    quizzes,
    fetchUsername,
    fetchUsernames,
    userData,
    setTaggedStaffTags,
    setContributingTags,
    handleResetInputs,
}) => {
    const [exitPopupOpen, setExitPopupOpen] = useState(false);
    const [removePopupOpen, setRemovePopupOpen] = useState(false);
    const [userToRemove, setUserToRemove] = useState<{ userId: string; username: string } | null>(null);
    const [removeMsgText, setRemoveMsgText] = useState("");
    const [serverMembers, setServerMembers] = useState<ServerMember[]>([]);
    const userId = userData ? userData.uid : null;

    const { task, setTask, selectedServerId } = useTask();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const ServerDropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { id } = router.query;
   const [servers, setServers] = useState<Server[]>([]);

    const [inviteLink, setInviteLink] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [buttonText, setButtonText] = useState("Copy");
    const [filteredSearchTask, setFilteredSearchTask] = useState([]);
    const [filteredPatientId, setFilteredPatientId] = useState<any[]>([]);
    const [createdByDetails, setCreatedByDetails] = useState<
        Record<string, string>
    >({});
    const [deletePopupOpen, setDeletePopupOpen] = useState<boolean>(false);
    const [deleteMsgText, setDeleteMsgText] = useState<string>(
        "Are you sure you want to delete this task and move it to the deleted tasks?"
    );
    const [taskToDelete, setTaskToDelete] = useState<{
        id: string;
        filter: any;
    } | null>(null);
    const [taskToDeleted, setTaskToDeleted] = useState<{
        id: string;
    } | null>(null);
    const [serverToDelete, setServerToDelete] = useState<{
        serverId: string;
        serverName: string;
    } | null>(null);
    const [user, setUser] = useState<UserData | null>(null);



    useEffect(() => {
        // Reset the search term and results whenever refreshTrigger changes
        setSearchTerm("");
        setShowResults(false);
        setFilteredPatientId([]);
    }, [refreshTrigger]);

    const fetchUsernames2 = async (uids: string[]): Promise<UserName[]> => {
        const promises = uids.map(async (uid) => {
            const userDoc = await getDoc(doc(db, "users", uid));
            return userDoc.data()?.userName;
        });
        return await Promise.all(promises);
    };
    const fetchJobRole = async (uids: string[]): Promise<JobRole[]> => {
        const promises = uids.map(async (uid) => {
            const userDoc = await getDoc(doc(db, "users", uid));
            return userDoc.data()?.jobRole;
        });
        return await Promise.all(promises);
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleDropdown = (index: any, item: string) => {
        if (task?.isCompleted) {
            setselectedTask(true);
        }
    
        const newDropdownVisible = [...dropdownVisible]; // Creating a new dropdown visibility array
    
        // Toggle the dropdown visibility for the clicked item
        newDropdownVisible[index] = !newDropdownVisible[index];
        setDropdownVisible(newDropdownVisible);
    
        if (!newDropdownVisible[index]) {
            // If the dropdown is closing, clear filtered tasks for the selected category
            if (item !== "Server Member List") {
                setFilteredTasks((prev) => ({
                    ...prev,
                    [item]: [], // Clear tasks for the clicked category
                }));
            }
        } else {
            // If the dropdown is opening, fetch tasks or server members
            if (item === "Server Member List") {
                // When "Server Member List" is clicked, fetch server members
                fetchServerMembers();
            } else {
                // Otherwise, fetch tasks for the selected category
                fetchTasks(item);
            }
        }
    };
    



    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                ServerDropdownRef.current &&
                !ServerDropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setShowResults(false); // Clear search results when clicking outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchAndSearchData = async () => {
            const trimmedSearchTerm = searchTerm.trim();

            // Case 1: Clear results when input is empty
            if (!trimmedSearchTerm) {
                setFilteredPatientId([]); // Clear previous results
                setShowResults(false); // Hide dropdown for empty input
                return;
            }

            // Case 2: No server selected
            if (!server?.serverId) {
                setFilteredPatientId([]); // Clear results when no server is selected
                setShowResults(true); // Hide dropdown when no server is selected
                return;
            }

            // Determine if it's a user search or patient ID search
            const isUserSearch = trimmedSearchTerm.startsWith("@");
            const query = isUserSearch
                ? trimmedSearchTerm.substring(1) // Remove '@' for user search
                : trimmedSearchTerm;

            if (isUserSearch && query.length > 0) {
                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) {
                    return;
                }

                const token = await user.getIdToken();
                try {
                    const taskResponse = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/server/${server?.serverId}`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const data = await taskResponse.json();
                    const filterDeletedData = data.filter((task: any) => !task.isDeleted);
                    const uids = filterDeletedData.map((task: any) => task.createdBy);
                    const userDetails = await fetchUsernames2(uids);
                    const updatedPatientIdTask = filterDeletedData.map(
                        (task: any, index: number) => ({
                            ...task,
                            createdBy: userDetails[index],
                        })
                    );

                    const regex = new RegExp(query, "i"); // Case-insensitive regex
                    const newSets = updatedPatientIdTask.filter((task: any) =>
                        regex.test(task.createdBy)
                    );

                    setFilteredPatientId(newSets);
                    setShowResults(true);
                } catch (error) {
                    console.error("Error fetching tasks:", error);
                    setFilteredPatientId([]);
                    setShowResults(false);
                }
            } else {
                try {
                    // Fetch data from the backend
                    const auth = getAuth();
                    const user = auth.currentUser;

                    if (!user) {
                        return;
                    }

                    const token = await user.getIdToken();
                    const response = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/search`,
                        {
                            params: {
                                query,
                                serverId: server.serverId,
                            },
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (response.status === 200 && response.data) {
                        const tasks = response.data;
                        const uids = tasks.map((task: any) => task.createdBy);
                        const userDetails = await fetchUsernames2(uids);
                        const updatedPatientIdTask = tasks.map(
                            (task: any, index: number) => ({
                                ...task,
                                createdBy: userDetails[index],
                            })
                        );
                        setFilteredPatientId(updatedPatientIdTask);
                        setShowResults(true);
                    } else {
                        setFilteredPatientId([]); // Clear results for invalid responses
                        setShowResults(false); // Hide dropdown for invalid responses
                    }
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        // Axios-specific error handling
                        console.error(
                            "Axios Error:",
                            error.response?.data || error.message
                        );
                    } else {
                        // Generic error handling
                        console.error("Unexpected Error:", error);
                    }
                    setFilteredPatientId([]); // Clear results on error
                    setShowResults(false); // Hide dropdown on error
                }
            }
        };

        // Debounce to avoid rapid API calls
        const delayDebounce = setTimeout(() => {
            fetchAndSearchData(); // Call the async function after debounce delay
        }, 50); // 300ms debounce delay

        return () => {
            clearTimeout(delayDebounce); // Clear timeout on cleanup
        };
    }, [searchTerm, server?.serverId]); // Trigger when searchTerm or serverId changes

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setShowResults(false); // Clear search results when clicking outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchTaskById = async (taskId: string) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                return;
            }

            const token = await user.getIdToken();
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/task/${taskId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response) {
                const data = await response.data;
                // Fetch usernames in parallel
                const [taggedStaffDetails, contributingStaffDetails, createdByDetails] =
                    await Promise.all([
                        fetchUsernames(data.taggedStaff),
                        fetchUsernames(data.contributingStaff),
                        fetchUsername(data.createdBy),
                    ]);
                const updatedTask = {
                    ...data,
                    taggedStaff: taggedStaffDetails,
                    contributingStaff: contributingStaffDetails,
                    createdBy: createdByDetails,
                };
                if (response.data._id === taskId) {

                    setSelectedQuizTaskId(response.data._id);
                    if (
                        (updatedTask.taggedStaff.includes(userData?.userName) &&
                            !updatedTask.isCompleted) ||
                        (updatedTask.contributingStaff.includes(userData?.userName) &&
                            !updatedTask.isCompleted)
                    ) {
                        setContributingTags([...updatedTask.contributingStaff]);
                        setTask({
                            ...data,
                            taggedStaff: taggedStaffDetails,
                            contributingStaff: data.contributingStaff,
                            createdBy: createdByDetails,
                        });
                        setselectedTask(false);
                    } else {
                        const updatedTask = {
                            ...data,
                            taggedStaff: taggedStaffDetails,
                            contributingStaff: contributingStaffDetails,
                            createdBy: createdByDetails,
                        };
                        setContributingTags([]);
                        setTask(updatedTask);
                        setselectedTask(true);
                    }
                    setShowForm(true);
                    setBtnDisble(false);
                } else {
                    setselectedTask(false);
                    setSelectedQuizTaskId("");
                }
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDeleteTask = async () => {

        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            return;
        }

        const token = await user.getIdToken();
        if (taskToDelete) {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskToDelete.id}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.ok) {
                    setFilter((prevFilter) => {
                        if (prevFilter === "Pending Tasks") {
                            return "Pending Tasks";
                        } else if (prevFilter === "Completed Tasks") {
                            return "Completed Tasks";
                        } else if (prevFilter === "Learning") {
                            return "Learning";
                        } else {
                            return "All Tasks";
                        }
                    });
                    fetchTasks(taskToDelete.filter);
                    fetchTasks("Deleted Tasks");
                    fetchTasks("All Tasks");
                    fetchTasks("Learning");
                    fetchTasks("Pending Tasks");
                    fetchTasks("Completed Tasks");
                    setDeletePopupOpen(false);
                    setTaskToDelete(null);
                }
            } catch (error: any) {
                toast.error(error.message);
            }
        }
    };




    const handleDeleteQuiz = async (taskId: string) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            return;
        }

        const token = await user.getIdToken();
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/convertQuizzes/task/${taskId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.ok) {
            handleTasksClick("Deleted Tasks");
        }
    };

    //delete the task from dB

    const handleDeletedTask = async (taskId: string) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                return;
            }

            const token = await user.getIdToken();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.ok) {
                handleDeleteQuiz(taskId);
                fetchTasks(filter);
                fetchTasks("Deleted Tasks");
                setDeletePopupOpen(false);
                setTaskToDeleted(null);
                handleResetInputs();
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = (newItem: any, filter: any) => {
        if (!newItem.isDeleted) {
            setDeleteMsgText(
                "Are you sure you want to delete this task and move it to the deleted tasks?"
            );
            setDeletePopupOpen(true);
            setTaskToDelete({ id: newItem._id, filter });
        }
        if (newItem.isDeleted) {
            setDeleteMsgText(
                "Are you sure you want to permanently delete this task? Can't recover the task again!"
            );
            setDeletePopupOpen(true);
            setTaskToDeleted({ id: newItem._id });
        }
    };

    const handleDeleteServer = (server: { serverId: string; serverName: string }) => {
        setDeleteMsgText(
            `Are you sure you want to delete the server "${server.serverName}"? This action cannot be undone.`
        );
        setDeletePopupOpen(true);
        setServerToDelete(server);
    };

    const handleConfirmClick = () => {
        if (taskToDelete) {
            handleDeleteTask();
        }
        if (taskToDeleted) {
            handleDeletedTask(taskToDeleted.id);
        }
        if (serverToDelete) {
            handleDeletedServer(serverToDelete.serverId);
        }
    };

    const handleDeletedServer = async (serverId: string) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                return;
            }

            const token = await user.getIdToken();
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/servers/${serverId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success(response.data.message || 'Server deleted successfully!');
            window.location.reload();
        } catch (error: any) {

        }
        setDeletePopupOpen(false);
        setServerToDelete(null);
    };



    useEffect(() => {
        const fetchServer = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) {
                    return;
                }

                const token = await user.getIdToken();
                const response = await fetch(
                    `${window.location.origin}/api/servers/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                setServers(data);
            } catch (error) {
                console.error("Error fetching server:", error);
            }
        };

        if (id) fetchServer();
    }, [id]);

    const generateInviteLink = () => {
        const link = `${window.location.origin}/join/${server?.serverId}`;
        setInviteLink(link.startsWith("http") ? link : `https://${link}`);
        setShowPopup(true);
    };

    const copyToClipboard = () => {
        navigator.clipboard
            .writeText(inviteLink)
            .then(() => {
                setButtonText("Copied"); // Change the button text
                // Reset the button text after a delay (optional)
                setTimeout(() => setButtonText("Copy"), 2000); // Resets to "Copy" after 2 seconds
            })
            .catch((err) => console.error("Failed to copy: ", err));
    };

    const closePopup = () => setShowPopup(false);

    const shareLink = async () => {
        try {
            await navigator.share({
                title: "Invite Link",
                text: inviteLink, // Only the URL, no extra text
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) { }
    };

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUser({
                uid: currentUser.uid,
                email: currentUser.email || "",
                userName: currentUser.displayName || "",
                jobRole: "", // Add appropriate logic to fetch the job role if needed
                profilePicUrl: currentUser.photoURL || undefined,
            });
        }
    }, []);

    const fetchServerMembers = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
    
            if (!user) return;
    
            const token = await user.getIdToken();
            const serverId = server?.serverId;
    
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/servers/${serverId}/server-members`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.status === 200) {

              console.log("Fetched server members:", response.data);
              // Fetch usernames using the uids
              const usernames = await fetchUsernames2(response.data.members);

              const jobRoles = await fetchJobRole(response.data.members); // Fetch job roles for the members

              // Combine the user IDs with their respective usernames
              const membersWithUsernames = response.data.members.map((memberId: number, index:number) => ({
                  userId: memberId,
                  username: usernames[index],  // Map the username fetched from fetchUsernames2
                  jobRole: jobRoles[index],    // Map the job role fetched from fetchJobRoles
              }));
              console.log("Username",usernames)
              console.log("Job Role", jobRoles)
              setServerMembers(membersWithUsernames); // Store members with usernames
            }
        } catch (error) {
            toast.error("Failed to fetch server members");
            console.error("Error fetching server members:", error);
        }
    };
    
    // Fetch members when `server` changes
    useEffect(() => {
        if (server) {
            fetchServerMembers();
        }
    }, [server]);
    
    const handleRemoveServerMember = async (
        serverId: string,
        userId: string
    ): Promise<{ serverName: string; username: string } | null> => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
    
            if (!user) {
                toast.error('User not authenticated');
                return null;
            }
    
            const token = await user.getIdToken();
    
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/servers/${serverId}/remove-member/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                return {
                    serverName: response.data.serverName,
                    username: response.data.username,
                };
            }
    
            return null;
    
        } catch (error) {
            console.error('Error removing user from server:', error);
            return null;
        }
    };
    
    const handleRemoveUserClick = (member: { userId: string; username: string }) => {
        setRemoveMsgText(`Are you sure you want to remove "${member.username}" from the server?`);
        setUserToRemove(member);
        setRemovePopupOpen(true);
    };
    
    const handleConfirmRemoveUser = async () => {
        if (!server || !userToRemove) {
            toast.error("Server not found or user missing.");
            return;
        }
    
        const { username, userId } = userToRemove;
    
        const removed = await handleRemoveServerMember(server.serverId, userId);
    
        if (removed) {
            toast.success(`Successfully removed "${username}" from the server`);
           // setServerMembers(prev => prev.filter(member => member.userId !== userId));
           setServerMembers(prev => {
            return prev.filter((member: ServerMember) => member.userId !== userId);
        });
        } else {
            toast.error(`Failed to remove "${username}" from the server`);
        }
    
        setRemovePopupOpen(false);
        setUserToRemove(null);
    };
    
    const handleExitServer = async (serverId: string) => {
        const auth = getAuth();
        const user = auth.currentUser;
    
        if (!user) {
            toast.error("You must be logged in to exit the server.");
            return;
        }
    
        const token = await user.getIdToken();
    
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/servers/${serverId}/exit`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            const updatedServer = response.data.updatedServer;
            console.log("Response updatedServer:", updatedServer);
    
            if (updatedServer) {
                if (updatedServer.isDeleted) {
                    toast.success('The server has been successfully deleted.');
    
                    setServers((prevServers) => {
                        const filtered = prevServers.filter((server) => server._id !== serverId);
                        return filtered;
                    });
                } else {
                    toast.info('You have successfully exited the server.');

                }
                router.push('/');

            } else {
                toast.error('Unable to update server details.');
            }
        } catch (error: any) {
            console.error("Error exiting server:", error);
            toast.error(error.response?.data?.message || "Something went wrong.");
        }
    
        setExitPopupOpen(false);
    };
    
    return (
        <div>
            {deletePopupOpen && (
                <div className="fixed inset-[-60px] bg-gray-800 bg-opacity-75 flex justify-center items-center z-10 text-black">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                        <h1 className="text-center font-bold">{deleteMsgText}</h1>
                        <div className="mt-5 flex justify-center gap-x-6">
                            <button
                                className=" text-white py-1 px-5 rounded-md hover:bg-red-600 bg-[#D26767] font-semibold transition duration-300"
                                onClick={handleConfirmClick}
                            >
                                Remove
                            </button>
                            <button
                                className={` text-white bg-[#68A86B] hover:bg-gray-600 py-1 px-5 rounded-md font-semibold $transition duration-300`}
                                onClick={() => {
                                    setTaskToDelete(null);
                                    setTaskToDeleted(null);
                                    setDeletePopupOpen(false);
                                    setServerToDelete(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {server ? (
                <div ref={ServerDropdownRef} className="w-full max-w-md mx-auto">
                    <div
                       // className="flex items-center justify-between px-2 sm:px-4 py-1 cursor-pointer gap-4 sm:gap-10 sm:gap-0"
                       className="flex items-center justify-between px-2 sm:px-4 py-1 cursor-pointer gap-4 sm:gap-10"

                       onClick={toggleOpen}
                    >
                        <span className="mt-2 sm:mt-0 text-md font-bold text-black text-[6px] sm:text-[7px] md:text-[10px] lg:text-[14px] xl:text-[16px]">
                            {server.serverName}
                        </span>
                        {server && user?.uid === server.createdByUserId && (
                            <>
                                <div className="sm:hidden relative group">
                                    <button
                                        className="h-1 w-1"
                                        onClick={() => handleDeleteServer({ serverId: server.serverId, serverName: server.serverName })}
                                    >
                                        <Image src={deleteIcon} alt="Delete" className="" />
                                    </button>
                                    {/* <span className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white text-[4px] rounded px-1 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        Delete Server
                                    </span> */}
                                </div>
                                <div className="hidden sm:block ml-auto relative group">
                                    <button
                                        className="flex items-center h-1 w-1 md:h-2 md:w-2 lg:h-3 lg:w-3 xl:h-3 xl:w-3"
                                        onClick={() => handleDeleteServer({ serverId: server.serverId, serverName: server.serverName })}
                                    >
                                        <Image src={deleteIcon} alt="Delete" className="ml-8" />
                                    </button>
                                    {/* <span className="absolute bottom-3 md:bottom-4 lg:bottom-5 xl:bottom-8 left-0 bg-gray-600 text-white text-[8px] rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        Delete Server
                                    </span> */}
                                </div>
                            </>
                        )}

                            {/* Exit Server Button (for members who are not the creator) */}
                            {server && user?.uid !== server.createdByUserId && (
                                <>
                                        <RxExit 
                                        onClick={() => setExitPopupOpen(true)} 
                                        className="flex items-center ml-auto text-[#67A76B] hover:text-green-700 "/>
                                </>
                             )}
                    
                        {isOpen ? (
                            <HiChevronDown className="mt-2 sm:mt-0 h-2 w-2 sm:w-3 sm:h-3 lg:h-4 lg:w-4 xl:h-5 xl:w-5 text-gray-600" />
                        ) : (
                            <HiChevronRight className="mt-2 sm:mt-0 h-2 w-2 sm:w-3 sm:h-3 lg:h-4 lg:w-4 xl:h-5 xl:w-5 text-gray-600" />
                        )}
                    </div>
                    {isOpen && (
                        <>
                            <div
                                onClick={generateInviteLink}
                                className="bg-[#F4F4F4] flex items-center cursor-pointer"
                            >
                                <div className="px-2 py-3 lg:px-4 lg:py-6 text-black text-[6px] sm:text-[10px] lg:text-[14px] xl:text-[16px] ">
                                    Invite Link
                                </div>
                                <div className="px-3 py-1 sm:px-5 sm:py-6 ml-auto">
                                    <Image
                                        src={Plus}
                                        alt="plus"
                                        className="w-1 h-1 sm:w-2 sm:h-2 lg:w-2 lg:h-2 xl:w-3 xl:h-3"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {showPopup && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                            <div className="relative w-full max-w-xl px-8 py-12 bg-white rounded shadow-lg text-black">
                                <div className="flex">
                                    <h2 className="text-lg sm:text-xl font-bold mb-4">
                                        Invite friends to {server.serverName + "'s"} Server{" "}
                                    </h2>
                                    <HiX
                                        className="ml-auto text-black hover:text-gray-800 focus:outline-none cursor-pointer"
                                        onClick={closePopup}
                                    />
                                </div>
                                <p className="text-gray-600 text-sm mb-4">
                                    Share this link with others to grant access to your server!
                                </p>
                                <div className="relative flex items-center bg-[#EBEBEB] px-3 py-3">
                                    <input
                                        type="text"
                                        value={inviteLink}
                                        readOnly
                                        className="bg-transparent flex-1 outline-none text-gray-700 text-sm" // Extra padding on the right for button space
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className="absolute right-0 mr-2 bg-[#68A86B] border border-[#68A86B] text-white font-semibold rounded-sm px-4 py-1 text-sm hover:bg-green-100 hover:text-black"
                                    >
                                        {buttonText}
                                    </button>
                                </div>
                                <div className="mt-12 flex justify-center">
                                    <button
                                        onClick={shareLink}
                                        className="w-[20%] bg-[#68A86B] border border-[#68A86B] text-white px-4 py-2 rounded-lg hover:bg-green-100 hover:text-black"
                                    >
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <h1 className="flex items-center justify-between px-4 py-1 text-black"></h1>
            )}
            <div ref={searchRef} className="p-2 relative">
                <input
                    type="text"
                    placeholder="Search @ User, Patient ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowResults(true)}
                    className="w-full p-1 border border-gray-300 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEBEBE]"
                />
                {showResults && (
                    <div className="absolute w-[78%] sm:w-[85%] md:w-[90%] lg:w-[87%] xl:w-[93%] bg-white text-black shadow-lg rounded-lg mt-2 max-h-60 overflow-y-auto">
                        {!server?.serverId ? (
                            <div className="p-2 text-gray-500">
                                You must select a server to search tasks
                            </div>
                        ) : searchTerm === "" ? (
                            <div className=""></div>
                        ) : filteredPatientId.length > 0 ? (
                            filteredPatientId.map((task, index) =>
                                task.message ? ( // Check if it's a message object
                                    <div key={index} className="p-2 text-gray-500">
                                        {task.message}
                                    </div>
                                ) : (
                                    <div
                                        key={index}
                                        className="w-full p-1 border-b cursor-pointer hover:bg-gray-100 text-[8px] sm:text-[10px] md:text-[11px] lg:text-[10px] xl:text-[12px] "
                                        onClick={() => {
                                            fetchTaskById(task._id);
                                            setShowResults(false);
                                        }}
                                    >
                                        <p className="flex font-semibold">
                                            <span className="hidden lg:block">Task Code: </span>
                                            <span className="lg:ml-1">{task.patientId}</span>
                                        </p>
                                        <p className="flex font-semibold text-gray-900">
                                            <span className="hidden lg:block">Created by: </span>
                                            <span className="lg:ml-1">
                                                {task.createdBy || "Loading..."}
                                            </span>
                                        </p>
                                        <p className="flex font-semibold text-gray-900">
                                            <span className="hidden lg:block">Task Name: </span>
                                            <span className="lg:ml-1">
                                                {task.taskName || "Loading..."}
                                            </span>
                                        </p>
                                    </div>
                                )
                            )
                        ) : (
                            <div className="p-2 text-gray-500">No matching tasks found</div>
                        )}
                    </div>
                )}
            </div>

            {server ? (
                <div className="mt-2">
                    <ul className="px-1 space-y-2 sm:px-2 sm:space-y-2 md:px-3 md:space-y-3 lg:px-4 lg:space-y-4">
                     
                        {taskCategories.map((item: any, index: any) => (
                            <>
                                <li
                                    key={item}
                                    onClick={() => {
                                        handleTasksClick(item);
                                        handleDropdown(index,item);
                                    }}
                                    className="text-[6px] sm:text-[7px] md:text-[10px] lg:text-[12px] xl:text-[16px] flex justify-between items-center text-black font-bold cursor-pointer"
                                >
                                    {item}
                                    {dropdownVisible[index] ? (
                                        <HiChevronDown />
                                    ) : (
                                        <HiChevronRight />
                                    )}
                                </li>
                                
                                {dropdownVisible[index] &&
                                    filteredTasks[item]?.map((newItem: any, index: any) => {
                                        return (
                                            <>
                                                <div
                                                    key={index}
                                                    className={`text-black justify-between flex `}
                                                >
                                                    <p
                                                        className={`text-[6px] sm:text-[7px] lg:text-[12px] xl:text-[16px] cursor-pointer hover:text-[#68A86B] ${newItem._id === task?._id
                                                            ? "text-[#68A86B] font-semibold"
                                                            : ""
                                                            }`}
                                                        onClick={() => fetchTaskById(newItem._id)}
                                                    >
                                                        {newItem && newItem?.patientId}
                                                    </p>
                                                    <Image
                                                        className=" object-contain w-[5px] sm:w-[8px] lg:w-[12px] xl:w-[16px] cursor-pointer"
                                                        src={deleteIcon}
                                                        alt="delete"
                                                        onClick={() => handleDelete(newItem, item)}
                                                    />
                                                </div>
                                            </>
                                        );
                                })}
                                {/* Show Server Members list if it's the correct category */}
                                
                                {dropdownVisible[index] && item === "Server Member List" && 
                                 user?.uid === server.createdByUserId &&
                                (
                                    <div className="text-black justify-between flex flex-col space-y-2">
                                        {serverMembers
                                                    ?.filter((member: ServerMember) => member.uid !== server.createdByUserId) // Exclude server creator

                                        .map((member, idx) => (
                                            <div key={idx} className="flex justify-between items-center">
                                                <p className="text-[6px] sm:text-[7px] lg:text-[12px] xl:text-[16px] cursor-pointer hover:text-[#68A86B]">
                                                    {member.username}  - {member.jobRole} {/* Display the username */}
                                                </p>
                                                <Image
                                                    className="object-contain w-[5px] sm:w-[8px] lg:w-[12px] xl:w-[16px] cursor-pointer"
                                                    src={removeUserIcon}
                                                    alt="remove user"
                                                    onClick={() => handleRemoveUserClick(member)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}  
                        {removePopupOpen && (
                            <div className="fixed inset-[-60px] bg-gray-800 bg-opacity-10 flex justify-center items-center z-10 text-black">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                                    <h1 className="text-center font-bold">{removeMsgText}</h1>
                                    <div className="mt-5 flex justify-center gap-x-6">
                                        <button
                                            className=" text-white py-1 px-5 rounded-md hover:bg-red-600 bg-[#D26767] font-semibold transition duration-300"
                                            onClick={handleConfirmRemoveUser}
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            className={` text-white bg-[#68A86B] hover:bg-gray-600 py-1 px-5 rounded-md font-semibold $transition duration-300`}
                                            onClick={() => setRemovePopupOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                          {/* Exit Confirmation Popup */}
                          {exitPopupOpen &&  (
                            <div className="fixed inset-[-60px] bg-gray-800 bg-opacity-10 flex justify-center items-center z-10 text-black">
                                <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                                    <p className="text-sm text-gray-600 mt-2">
                                        Are you sure you want to leave <strong>{server.serverName}</strong>? You won’t be able to access this server anymore.
                                    </p>                       
                                    <div className="mt-5 flex justify-center gap-x-6">
                                         <button
                                            className={` text-white bg-[#68A86B] hover:bg-gray-600 py-1 px-5 rounded-md font-semibold $transition duration-300`}
                                           onClick={() => handleExitServer(server.serverId)} // Pass serverId to handleExitServer
                                        >
                                            Exit Server
                                        </button>
                                        <button
                                            className=" text-white py-1 px-5 rounded-md hover:bg-red-600 bg-[#D26767] font-semibold transition duration-300"
                                            onClick={()=>setExitPopupOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        
                                    </div>
                                </div>
                            </div>
                        )}
                        </>
                            
                        ))}
                    
                    </ul>
                </div>
            ) : (
                
                <div>
                {/* This shows only on extra-small screens */}
                <div className="text-[8px] flex items-center justify-center font-bold lg:px-4 lg:py-1 text-black sm:hidden">
                  Select a server
                </div>
              
                {/* This shows on small screens and larger */}
                <div className="text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px] hidden sm:flex items-center justify-center text-center font-bold lg:px-4 lg:py-1 text-black">
                  Create or Select a server
                </div>
              </div>
              
            )}
        </div>
    );
};

export default TaskSection;