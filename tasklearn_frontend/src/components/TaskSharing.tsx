/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import "../../src/app/globals.css";
import { FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useTask, Task } from "../components/TaskContext";
import { useRouter } from "next/router";
import { getDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { User } from "firebase/auth";
import { useAuth } from "../auth";
import SidebarProfile from "./SidebarProfile";
import TaskSection from "./TaskSection";
import FormContainer from "./FormContainer";
import ConvertQuiz from "../components/ConvertQuiz";
import { Timestamp } from "firebase/firestore/lite";
import { getAuth } from 'firebase/auth';


const TaskSharing = () => {
    const [showLogout, setShowLogout] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showStar, setShowStar] = useState(false);
    const [showQuiz, setShowQuiz] = useState<boolean>(false);
    const [tasksList, setTasksList] = useState<Task[]>([]);
    const [showForm, setShowForm] = useState(true);
    const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [filter, setFilter] = useState("All Tasks");
    const { task, setTask, fetchPatientId, updatePatientId } = useTask();
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const handleRefresh = () => {
        // Toggle the refresh trigger state
        setRefreshTrigger((prev) => !prev);
    };
    const taskCategories = [
        "All Tasks",
        "Pending Tasks",
        "Completed Tasks",
        "Deleted Tasks",
        "Learning",
    ];
    type UserData = {
        uid: any;
        email: string;
        userName: string;
        jobRole: string;
        profilePicUrl: string | undefined;
    };
    interface UserName {
        userName: string;
    };

    interface Quiz {
        _id: string;
        keyLearningPoint: string;
        action: string;
        Library: boolean;
        Learn: boolean;
        createdAt: Timestamp;
        serverId: string;
        createdBy: string;
        taskId: string;
    }

    const [dropdownVisible, setDropdownVisible] = useState<boolean[]>(
        Array(taskCategories.length).fill(false)
    );
    const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
    const [selectedTask, setselectedTask] = useState<any>(false);
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [taskLoading, setTaskLoading] = useState<boolean>(true);
    const [redirecting, setRedirecting] = useState(false);
    const [selectedQuizTaskId, setSelectedQuizTaskId] = useState<string>("");
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const router = useRouter();
    const { logout } = useAuth();
    const [taggedStaffTags, setTaggedStaffTags] = useState<string[]>([]);
    const [contributingTags, setContributingTags] = useState<string[]>([]);
    const [selectedServer, setSelectedServer] = useState<{
        serverId: string;
        serverName: string;
        memberList: string[];
        createdByUserId: string;
    } | null>(null);

    const [btnDisable, setBtnDisble] = useState<boolean>(false)
    const [btnDisable2, setBtnDisble2] = useState<boolean>(false)


    const handleServerSelect = (server: {
        serverId: string;
        serverName: string;
        memberList: string[];
        createdByUserId: string;
    }) => {
        setSelectedServer(server); // Update with selected server's ID and name
    };

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
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
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
        fetchPatientId();

        // Cleanup
        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchQuizzes = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                return;
            }

            const token = await user.getIdToken();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/convertQuizzes/server/${selectedServer?.serverId}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            if (Array.isArray(data)) {
                setQuizzes(data);
            } else {
                console.error("Fetched data is not an array:", data);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching quizzes:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedQuizTaskId.length > 0) {
            fetchQuizzes();
        }
        if (selectedQuizTaskId === "") {
            setQuizzes([]);
        }
    }, [selectedQuizTaskId]);

    useEffect(() => {
        if (selectedQuizTaskId && quizzes) {
            const filtered = quizzes.filter(
                (quiz) => quiz.taskId === selectedQuizTaskId
            );

            setFilteredQuizzes(filtered);
            if (filtered.length > 0) {
                const newFiltered = quizzes.filter(
                    (quiz) => quiz.taskId !== selectedQuizTaskId
                );
                setFilteredQuizzes([...filtered, ...newFiltered]);
            }
        }
    }, [selectedQuizTaskId, quizzes]);



    useEffect(() => {
        if (filteredQuizzes.length === 0) {
            setShowQuiz(false);
        }
        else {
            setShowQuiz(true);
        }
    }, [filteredQuizzes]);

    useEffect(() => {
        if (selectedServer?.serverId) {
            fetchPatientId(selectedServer.serverId);
        }
    }, [selectedServer]);

    useEffect(() => {
        if (!loading && !user) {
            setRedirecting(true);
            const timer = setTimeout(() => {
                router.push("/login");
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [loading, user, router]);

    if (redirecting) {
        return <div>Loading...</div>;
    }

    if (loading) {
        return <p>Loading...</p>;
    }


    const fetchUsernames = async (uids: string[]): Promise<UserName[]> => {
        const promises = uids.map(async (uid) => {
            const userDoc = await getDoc(doc(db, "users", uid));
            return userDoc.data()?.userName;
        });
        return await Promise.all(promises);
    };
    const fetchUsername = async (uid: string): Promise<string> => {
        const userDoc = await getDoc(doc(db, "users", uid));
        return userDoc.data()?.userName;
    };

    const userId = userData ? userData.uid : null;

    const handleResetInputs = () => {
        fetchPatientId(selectedServer?.serverId);
        setSelectedQuizTaskId("")
        setFilteredQuizzes([])
        setContributingTags([]);
        setTaggedStaffTags([]);
        setShowQuiz(false)
        setBtnDisble(false)
        const { _id, ...newTask } = task;
        setTask({
            ...newTask,
            patientId: task?.patientId,
            createdBy: userData?.userName,
            taggedStaff: [],
            serverId: "",
            contributingStaff: [],
            taskName: "",
            history: "",
            examination: "",
            diagnosis: "",
            plan: "",
            followUp: "",
            postConsultation: "",
            feedback: "",
            keyLearningPoint: "",
            action: "",
            Library: false,
            Learn: false,
            isShared: false,
            isCompleted: false,
            isDeleted: false,
        });

    };

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !task.taggedStaff.length || // Check if the array is empty
            task.taggedStaff.some((tag) => tag.trim() === "@" || tag.trim() === "")
        ) {
            toast.error("Please tag user at tag staff field");
            return;
        }

        if (
            !task.taskName
        ) {
            toast.error("Please fill in the required fields.");
            return;
        }

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                return;
            }

            const token = await user.getIdToken();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...task,
                        isShared: true,
                        serverId: selectedServer?.serverId,
                        createdBy: userData?.uid
                    }),
                }
            );
            if (response.ok) {
                const data = await response.json();
                setTaggedStaffTags([])
                const [taggedStaffDetails, contributingStaffDetails, createdByDetails] =
                    await Promise.all([
                        fetchUsernames(data.task.taggedStaff),
                        fetchUsernames(data.task.contributingStaff),
                        fetchUsername(data.task.createdBy),
                    ]);
                const updatedTask = {
                    ...data?.task,
                    taggedStaff: taggedStaffDetails,
                    contributingStaff: contributingStaffDetails,
                    createdBy: createdByDetails,
                };
                setTask(updatedTask);
                updatePatientId(selectedServer?.serverId);
                toast.success("Task shared successfully");
                setBtnDisble(true)
                setselectedTask(true)

                // if (task.Library) {
                //     // Create Library
                //     const auth = getAuth();
                //     const user = auth.currentUser;

                //     if (!user) {
                //         return;
                //     }

                //     const token = await user.getIdToken();
                //     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Libraries`, {
                //         method: "POST",
                //         headers: {
                //             "Content-Type": "application/json",
                //             Authorization: `Bearer ${token}`,
                //         },
                //         body: JSON.stringify({
                //             keyLearningPoint: task.keyLearningPoint,
                //             action: task.action,
                //             createdBy: userId,
                //             serverId: selectedServer?.serverId,
                //             taskId: data?.task?._id,
                //         }),
                //     });
                // }
                // if (task.Library && task.Learn) {
                //     const auth = getAuth();
                //     const user = auth.currentUser;

                //     if (!user) {
                //         return;
                //     }

                //     const token = await user.getIdToken();
                //     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`, {
                //         method: "POST",
                //         headers: {
                //             "Content-Type": "application/json",
                //             Authorization: `Bearer ${token}`,
                //         },
                //         body: JSON.stringify({
                //             keyLearningPoint: task.keyLearningPoint,
                //             action: task.action,
                //             Library: true,
                //             createdBy: userId,
                //             serverId: selectedServer?.serverId,
                //             taskId: data?.task?._id,
                //         }),
                //     });
                //     setSelectedQuizTaskId(data?.task?._id);
                //     // handleResetInputs();
                //     setselectedTask(true);


                // }

                // // Check if Learn is selected
                // else if (task.Learn && !task.Library) {
                //     // Create quiz
                //     const auth = getAuth();
                //     const user = auth.currentUser;

                //     if (!user) {
                //         return;
                //     }

                //     const token = await user.getIdToken();
                //     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`, {
                //         method: "POST",
                //         headers: {
                //             "Content-Type": "application/json",
                //             Authorization: `Bearer ${token}`,
                //         },
                //         body: JSON.stringify({
                //             keyLearningPoint: task.keyLearningPoint,
                //             action: task.action,
                //             Library: false,
                //             createdBy: userId,
                //             serverId: selectedServer?.serverId,
                //             taskId: data?.task?._id,
                //         }),
                //     });
                //     // handleResetInputs();
                //     setSelectedQuizTaskId(data?.task?._id);
                //     setselectedTask(true);

                // }
            } else {
                throw new Error("Failed to share task");
            }
        } catch (error) {
            toast.error("Error sharing task: " + (error as Error).message);
        }
    };

    const handleComplete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !task.contributingStaff.length || // Check if the array is empty
            task.contributingStaff.some(
                (tag) => tag.trim() === "@" || tag.trim() === ""
            )
        ) {
            toast.error("Please tag user at contributing staff field");
            return;
        }
        if (
            !task.createdBy ||
            !task.taskName ||
            !task.history ||
            !task.examination ||
            !task.diagnosis ||
            !task.plan ||
            !task.followUp ||
            !task.postConsultation ||
            !task.feedback
        ) {
            toast.error("Please fill in all required fields.");
            return;
        }
        // Complete task
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                return;
            }
            const token = await user.getIdToken();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/task/update/${task?._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ task }),
                }
            );
            if (response.ok) {
                const data = await response.json();
                const [taggedStaffDetails, contributingStaffDetails, createdByDetails] =
                    await Promise.all([
                        fetchUsernames(data.updatedItem.taggedStaff),
                        fetchUsernames(data.updatedItem.contributingStaff),
                        fetchUsername(data.updatedItem.createdBy),
                    ]);
                const updatedTask = {
                    ...data?.updatedItem,
                    taggedStaff: taggedStaffDetails,
                    contributingStaff: contributingStaffDetails,
                    createdBy: createdByDetails,
                };
                setTask(updatedTask);
                toast.success("Task Completed Successfully");
                setContributingTags([]);
                setBtnDisble(true);
                setDropdownVisible(Array(taskCategories.length).fill(false));
                // Create Libraries and Quizzes
                if (task.Library || task.Learn) {
                    const createLibrary = async () => {
                        if (!user) return;
                        const token = await user.getIdToken();
                        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Libraries`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                keyLearningPoint: task.keyLearningPoint,
                                action: task.action,
                                createdBy: userId,
                                serverId: selectedServer?.serverId,
                                taskId: data?.updatedItem?._id,
                            }),
                        });
                        await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/api/convertLibraries`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                    keyLearningPoint: task.keyLearningPoint,
                                    action: task.action,
                                    createdBy: userId,
                                    serverId: selectedServer?.serverId,
                                    taskId: data?.updatedItem?._id,
                                }),
                            }
                        );
                    };
                    const createQuiz = async (library: boolean) => {
                        if (!user) return;
                        const token = await user.getIdToken();
                        await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/api/convertQuizzes`,
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                    keyLearningPoint: task.keyLearningPoint,
                                    action: task.action,
                                    Library: library,
                                    createdBy: userId,
                                    serverId: selectedServer?.serverId,
                                    taskId: data?.updatedItem?._id,
                                }),
                            }
                        );
                        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                keyLearningPoint: task.keyLearningPoint,
                                action: task.action,
                                Library: library,
                                createdBy: userId,
                                serverId: selectedServer?.serverId,
                                taskId: data?.updatedItem?._id,
                            }),
                        });
                    };
                    if (task.Library) {
                        await createLibrary();
                    }
                    if (task.Library && task.Learn) {
                        await createQuiz(true);
                    } else if (task.Learn && !task.Library) {
                        await createQuiz(false);
                    }
                }
                // Fetch updated quizzes and set states
                setSelectedQuizTaskId(task._id);
                await fetchQuizzes();
                setselectedTask(true);
                setShowQuiz(true);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };



    const fetchTasks = async (filter: any) => {
        setTaskLoading(true);
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                return;
            }

            const token = await user.getIdToken();
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/tasks?filter=${filter}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                if (filter === "Pending Tasks") {
                    setTasksList(
                        response.data.filter(
                            (task: {
                                isShared: Boolean;
                                isDeleted: Boolean;
                                serverId: string;
                                taggedStaff: string[];
                                contributingStaff: string[]
                                isCompleted: boolean
                            }) =>
                                task.isShared &&
                                !task.isDeleted &&
                                selectedServer?.serverId &&
                                userData &&
                                task.taggedStaff?.includes(userData.uid) ||
                                userData &&
                                task.contributingStaff?.includes(userData.uid) &&
                                !task.isCompleted


                        )
                    );
                    const pendingTasks = response.data.filter(
                        (task: {
                            isShared: boolean;
                            isDeleted: boolean;
                            serverId: string;
                            taggedStaff: string[];
                            contributingStaff: string[];
                            isCompleted: boolean;
                        }) =>
                            (task?.isShared &&
                                !task?.isDeleted &&
                                task.serverId === selectedServer?.serverId &&
                                userData &&
                                task.taggedStaff?.includes(userData.uid)) ||
                            (userData &&
                                task.contributingStaff?.includes(userData.uid)) &&
                            !task.isCompleted
                    );
                    setFilteredTasks((prev) => {
                        return {
                            ...prev,
                            [filter]: pendingTasks,
                        };
                    });
                } else if (filter === "All Tasks") {
                    setTasksList(
                        response.data.filter(
                            (task: { isDeleted: Boolean; serverId: string }) =>
                                !task.isDeleted && task.serverId === selectedServer?.serverId
                        )
                    );
                    const allTasks = response.data.filter(
                        (task: { isDeleted: boolean; serverId: string }) =>
                            !task?.isDeleted && task.serverId === selectedServer?.serverId
                    );

                    setFilteredTasks((prev) => {
                        return {
                            ...prev,
                            [filter]: allTasks,
                        };
                    });
                } else if (filter === "Completed Tasks") {
                    setTasksList(
                        response.data.filter(
                            (task: {
                                isCompleted: Boolean;
                                isDeleted: Boolean;
                                serverId: string;
                            }) =>
                                task.isCompleted &&
                                !task.isDeleted &&
                                task.serverId === selectedServer?.serverId
                        )
                    );

                    const completedTasks = response.data.filter(
                        (task: {
                            isCompleted: boolean;
                            isDeleted: Boolean;
                            serverId: string;
                        }) =>
                            task?.isCompleted &&
                            !task?.isDeleted &&
                            task.serverId === selectedServer?.serverId
                    );
                    setFilteredTasks((prev) => {
                        return {
                            ...prev,
                            [filter]: completedTasks,
                        };
                    });
                } else if (filter === "Learning") {
                    setTasksList(
                        response.data.filter(
                            (task: {
                                Learn: Boolean;
                                isDeleted: Boolean;
                                serverId: string;
                            }) =>
                                task.Learn &&
                                !task.isDeleted &&
                                task.serverId === selectedServer?.serverId
                        )
                    );

                    const learnTasks = response.data.filter(
                        (task: { Learn: boolean; isDeleted: Boolean; serverId: string }) =>
                            task?.Learn &&
                            !task?.isDeleted &&
                            task.serverId === selectedServer?.serverId
                    );
                    setFilteredTasks((prev) => {
                        return {
                            ...prev,
                            [filter]: learnTasks,
                        };
                    });
                } else if (filter === "Deleted Tasks") {
                    setTasksList(
                        response.data.filter(
                            (task: { isDeleted: Boolean; serverId: string }) =>
                                task.isDeleted && task.serverId === selectedServer?.serverId
                        )
                    );

                    const deletedTasks = response.data.filter(
                        (task: { isDeleted: Boolean; serverId: string }) =>
                            task?.isDeleted && task.serverId === selectedServer?.serverId
                    );

                    setFilteredTasks((prev) => {
                        return {
                            ...prev,
                            [filter]: deletedTasks,
                        };
                    });
                }
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Failed to fetch tasks");
        } finally {
            setTaskLoading(false);
        }
    };


    const handleTasksClick = (item: string) => {
        // handleResetInputs();
        // setselectedTask(true);
        if (filteredQuizzes.length > 0) {
            setShowQuiz(true)
        }
        else {
            setShowQuiz(false);
        }
        setFilter(item);
        setShowForm(true);
    };


    return (
        <>
            <ToastContainer />
            <div className="w-full flex gap-2 bg-gray-100">
                <SidebarProfile
                    userId={userId}
                    onServerSelect={handleServerSelect}
                    handleTasksClick={handleTasksClick}
                    setselectedTask={setselectedTask}
                    taskCategories={taskCategories}
                    setDropdownVisible={setDropdownVisible}
                    handleResetInputs={handleResetInputs}
                    setFilteredTasks={setFilteredTasks}
                />
                <div className="w-[25%] sm:w-[30%] md:w-[40%] lg:w-[30%] w-[25%] flex min-h-screen">
                    <div className="pt-4 sm:pt-8 lg:pt-6 w-full bg-white space-y-2">
                        <div className="text-center">
                            <h1 className="text-[10px] sm:text-md md:text-md lg:text-xl xl:text-3xl font-bold text-[#68A86B]">
                                <a href="/Homepage">T-askLearn</a>
                            </h1>
                            <p className="text-[3px] sm:text-[3px] md:text-[3px] lg:text-[6px] xl:text-[8px] text-[#68A86B]">
                                <a href="/Homepage">
                                    Collaborate to Learn, Learn to Collaborate
                                </a>
                            </p>
                        </div>
                        <div className="h-[0.5px] xl:h-[1px] w-full bg-gray-300" />
                        <div className="overflow-y-auto max-h-screen">
                            <div className="flex justify-center my-1 md:my-2 lg:my-3">
                                <button
                                    className="md:w-[60%] lg:w-[50%] xl:w-[40%] border hover:border-[#BFBFBF] bg-[#68A86B] hover:bg-white text-white hover:text-[#68A86B] font-bold px-2 py-1 md:px-2 lg:py-1 lg:px-2 rounded-lg flex justify-center items-center cursor-pointer text-[8px] sm:text-[10px] md:text-[10px] lg:text-[14px] xl:text-[16px]"
                                    onClick={() => {
                                        setDropdownVisible(
                                            Array(taskCategories.length).fill(false)
                                        );
                                        handleResetInputs();
                                        handleRefresh();
                                        setShowQuiz(false);
                                        setselectedTask(false);
                                    }}
                                >
                                    Task{" "}
                                    <FiPlus className="font-bold ml-1 h-2 w-2 sm:h-2 sm:w-2 lg:h-3 lg:w-3 xl:h-4 xl:w-4" />
                                </button>
                            </div>

                            <TaskSection
                                server={selectedServer}
                                selectedTask={selectedTask}
                                setselectedTask={setselectedTask}
                                taskCategories={taskCategories}
                                filteredTasks={filteredTasks}
                                dropdownVisible={dropdownVisible}
                                setDropdownVisible={setDropdownVisible}
                                handleTasksClick={handleTasksClick}
                                setShowForm={setShowForm}
                                filter={filter}
                                setFilter={setFilter}
                                fetchTasks={fetchTasks}
                                _id={""}
                                channelName={""}
                                createdByUserId={""}
                                taskLoading={taskLoading}
                                showQuiz={showQuiz}
                                setShowQuiz={setShowQuiz}
                                setSelectedQuizTaskId={setSelectedQuizTaskId}
                                setBtnDisble={setBtnDisble}
                                setFilteredTasks={setFilteredTasks}
                                refreshTrigger={refreshTrigger}
                                quizzes={quizzes}
                                fetchUsername={fetchUsername}
                                fetchUsernames={fetchUsernames}
                                userData={userData}
                                setTaggedStaffTags={setTaggedStaffTags}
                                setContributingTags={setContributingTags}
                                handleResetInputs={handleResetInputs}
                            />
                        </div>
                    </div>
                </div>
                {showForm && (
                    <section className="w-[100%] sm:w-[100%] md:w-[100%] lg:w-[100%] xl:w-[100%] bg-white shadow">
                        <div className="pt-1">
                            <div className="pt-1 sm:pt-5 px-1 sm:px-4 text-black font-bold items-center flex justify-between">
                                <div className="flex gap-x-2 items-center">
                                    <div className="flex items-center gap-1">
                                        {userData?.profilePicUrl ? (
                                            <img
                                                src={userData?.profilePicUrl}
                                                alt="profilePic"
                                                className="bg-cover object-cover w-[18.14px] h-[18.14px] sm:w-[28.14px] sm:h-[28.14px] lg:w-[38.14px] lg:h-[38.14px] xl:w-[48.14px] xl:h-[48.14px] rounded-full"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-[18.14px] h-[18.14px] sm:w-[28.14px] sm:h-[28.14px] lg:w-[38.14px] lg:h-[38.14px] xl:w-[48.14px] xl:h-[48.14px] rounded-full bg-[#68A86B] text-white font-bold">
                                                {userData?.userName?.[0]?.toUpperCase() || "?"}
                                            </div>
                                        )}
                                        <div className="flex flex-col sm:flex-row">
                                            <p className="text-[6px] sm:text-[8px] md:text-[10px] lg:text-[12px] xl:text-lg">
                                                {userData?.userName},
                                            </p>
                                            <p className="sm:ml-1 text-[6px] sm:text-[8px] md:text-[10px] lg:text-[12px] xl:text-lg">
                                                {userData?.jobRole}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-0 sm:gap-4 items-center">
                                    <div className="text-[6px] sm:text-[7px] md:text-[10px] lg:text-[12px] xl:text-lg flex gap-1 md:gap-2 justify-center">
                                        <a href="/Homepage">H</a>
                                        <a href="/UserProfile">P</a>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="text-[6px] sm:text-[7px] md:text-[10px] lg:text-[12px] xl:text-lg w-[100%] xl:ml-2 p-1 md:p-2 bg-[#68A86B] text-white rounded-md hover:bg-red-600"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2 h-[1px] w-full bg-gray-300" />
                            <div className="p-4">
                                <p className="text-[12px] sm:text-[14px] md:text-[16px] xl:text-2xl text-black font-bold text-center">
                                    Task Sharing
                                </p>
                            </div>
                        </div>
                        <FormContainer
                            selectedTask={selectedTask}
                            handleShare={handleShare}
                            handleComplete={handleComplete}
                            server={selectedServer}
                            userData={userData}
                            taggedStaffTags={taggedStaffTags}
                            contributingTags={contributingTags}
                            setTaggedStaffTags={setTaggedStaffTags}
                            setContributingTags={setContributingTags}
                            btnDisable={btnDisable}
                            setBtnDisble={setBtnDisble}
                            btnDisable2={btnDisable2}
                            fetchUsername={fetchUsername}
                        />
                    </section>
                )}
                {/* Quiz Section */}
                {showQuiz && (
                    <div className="text-black w-[50%] sm:w-[60%] md:w-[50%] lg:w-[60%] xl:w-[60%] shadow-lg border-2 bg-white rounded-lg">
                        <div className="mt-10 sm:mt-14 lg:mt-16 xl:mt-20">
                            <div className="h-[1px] w-full bg-gray-300" />
                        </div>
                        <p className="mt-4 font-bold text-[12px] sm:text-[14px] md:text-[16px] xl:text-2xl text-center xl:px-8 xl:py-4">
                            Learning
                        </p>
                        <div className="p-1 xl:px-8">
                            <ConvertQuiz
                                server={selectedServer}
                                selectedQuizTaskId={selectedQuizTaskId}
                                setShowQuiz={setShowQuiz}
                                showQuiz={showQuiz}
                                setSelectedQuizTaskId={setSelectedQuizTaskId}
                                fetchUsername={fetchUsername}
                                fetchUsernames={fetchUsernames}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default TaskSharing;
