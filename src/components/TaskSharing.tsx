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
import Quizzes from "@/pages/tabs/Quizzes";
import { useRouter } from "next/router";
import { getDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { User } from "firebase/auth";
import { useAuth } from "../auth";
import SidebarProfile from "./SidebarProfile";
import TaskSection from "./TaskSection";
import FormContainer from "./FormContainer";

const TaskSharing = () => {
    const [showLogout, setShowLogout] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showStar, setShowStar] = useState(false);
    const [showQuiz, setShowQuiz] = useState<boolean>(false);
    const [tasksList, setTasksList] = useState<Task[]>([]);
    const [showForm, setShowForm] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [filter, setFilter] = useState("All Task");
    const { task, setTask, fetchPatientId, updatePatientId } = useTask();
    const taskCategories = [
        "All Task",
        "Pending Task",
        "Completed Task",
        "Deleted Task",
        "Learning",
    ];
    type UserData = {
        uid: any;
        email: string;
        userName: string;
        jobRole: string;
        profilePicUrl: string | undefined;
    };
    const [dropdownVisible, setDropdownVisible] = useState<boolean[]>(
        Array(taskCategories.length).fill(false)
    );
    const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
    const [selectedTask, setselectedTask] = useState<any>(false);
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [redirecting, setRedirecting] = useState(false);
    const router = useRouter();
    const { logout } = useAuth();
    const [selectedServer, setSelectedServer] = useState<{ serverId: string; serverName: string } | null>(null);

    const handleServerSelect = (server: { serverId: string; serverName: string }) => {
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

    useEffect(() => {
        if (!loading && !user) {
            setRedirecting(true);
            const timer = setTimeout(() => {
                router.push("/signin");
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


    const handleResetInputs = () => {
        fetchPatientId();
        const { _id, ...newTask } = task;
        setTask({
            ...newTask,
            patientId: task.patientId,
            createdBy: "",
            taggedStaff: "",
            contributingStaff: "",
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
            !task.createdBy ||
            !task.taggedStaff ||
            !task.contributingStaff ||
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

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ...task, isShared: true }),
                }
            );

            if (response.ok) {
                if (task.Library && task.Learn) {
                    setShowStar(true);
                } else {
                    setShowStar(false);
                }
                updatePatientId();
                toast.success("Task shared successfully");
                // Check if Learn is selected
                if (task.Learn) {
                    // Create quiz
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            keyLearningPoint: task.keyLearningPoint,
                            action: task.action,
                        }),
                    });
                    setShowQuiz(true);
                } else {
                    router.reload();
                }
                if (task.Library) {
                    // Create Library
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Libraries`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            keyLearningPoint: task.keyLearningPoint,
                            action: task.action,
                        }),
                    });
                }

                setTask({
                    ...task,
                    Library: false,
                    Learn: false,
                });
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
            !task.createdBy ||
            !task.taggedStaff ||
            !task.contributingStaff ||
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

        //complete task
        if (selectedTask) {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/task/update/${task?._id}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (response.ok) {
                    toast.success("Task Completed Successfully");
                    setShowQuiz(false);
                    handleTasksClick("All Task");
                    setDropdownVisible(Array(taskCategories.length).fill(false));
                }
            } catch (error: any) {
                toast.error(error.message);
            }
        }
        if (!selectedTask) {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ ...task, isCompleted: true }),
                    }
                );

                if (response.ok) {
                    toast.success("Task saved successfully");
                    setShowQuiz(false);
                    setTask({
                        ...task,
                        Library: false,
                        Learn: false,
                    });
                    updatePatientId();
                    handleTasksClick("All Task");
                    fetchPatientId();
                    setDropdownVisible(Array(taskCategories.length).fill(false));
                } else {
                    throw new Error("Failed to save task");
                }
            } catch (error) {
                toast.error("Error saving task: " + (error as Error).message);
            }
        }
    };

    const fetchTasks = async (filter: any) => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/tasks?filter=${filter}`
            );

            if (filter === "Pending Task") {
                setTasksList(
                    response.data.filter(
                        (task: { isShared: Boolean; isDeleted: Boolean }) =>
                            task.isShared && !task.isDeleted
                    )
                );
                const pendingTasks = response.data.filter(
                    (task: { isShared: boolean; isDeleted: boolean }) =>
                        task?.isShared && !task?.isDeleted
                );
                setFilteredTasks((prev) => {
                    return {
                        ...prev,
                        [filter]: pendingTasks,
                    };
                });
            }
            if (filter === "All Task") {
                setTasksList(
                    response.data.filter(
                        (task: { isDeleted: Boolean }) => !task.isDeleted
                    )
                );
                const allTasks = response.data.filter(
                    (task: { isDeleted: boolean }) => !task?.isDeleted
                );

                setFilteredTasks((prev) => {
                    return {
                        ...prev,
                        [filter]: allTasks,
                    };
                });
            }
            if (filter === "Completed Task") {
                setTasksList(
                    response.data.filter(
                        (task: { isCompleted: Boolean; isDeleted: Boolean }) =>
                            task.isCompleted && !task.isDeleted
                    )
                );

                const completedTasks = response.data.filter(
                    (task: { isCompleted: boolean; isDeleted: Boolean }) =>
                        task?.isCompleted && !task?.isDeleted
                );
                setFilteredTasks((prev) => {
                    return {
                        ...prev,
                        [filter]: completedTasks,
                    };
                });
            }
            if (filter === "Learning") {
                setTasksList(
                    response.data.filter(
                        (task: { Learn: Boolean; isDeleted: Boolean }) =>
                            task.Learn && !task.isDeleted
                    )
                );

                const learnTasks = response.data.filter(
                    (task: { Learn: boolean; isDeleted: Boolean }) =>
                        task?.Learn && !task?.isDeleted
                );
                setFilteredTasks((prev) => {
                    return {
                        ...prev,
                        [filter]: learnTasks,
                    };
                });
            }
            if (filter === "Deleted Task") {
                setTasksList(
                    response.data.filter((task: { isDeleted: Boolean }) => task.isDeleted)
                );

                const deletedTasks = response.data.filter(
                    (task: { isDeleted: Boolean }) => task?.isDeleted
                );

                setFilteredTasks((prev) => {
                    return {
                        ...prev,
                        [filter]: deletedTasks,
                    };
                });
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Failed to fetch tasks");
        }
    };

    const userId = userData ? userData.uid : null;


    const handleTasksClick = (item: string) => {
        handleResetInputs();
        setselectedTask(false);
        setShowQuiz(false);
        setFilter(item);
        fetchTasks(item);
        setShowForm(true);
    };

    return (
        <>
            <ToastContainer />
            <div className="w-full flex gap-2 bg-gray-100">
                <SidebarProfile userId={userId} onServerSelect={handleServerSelect} />
                <div className="w-[100%] flex min-h-screen sm:w-[30%] text-nowrap">
                    <div className="w-full bg-white space-y-1">
                        <div className="px-4 pt-3 pb-4 text-center">
                            <h1 className="text-[10px] sm:text-md md:text-md lg:text-2xl xl:text-3xl font-bold text-[#68A86B]">
                                <a href="/Homepage">T-askLearn</a>
                            </h1>
                            <p className="text-[2px] sm:text-[4px] lg:text-[6px] xl:text-[8px] text-[#68A86B]">
                                <a href="/Homepage">
                                    Collaborate to Learn, Learn to Collaborate
                                </a>
                            </p>
                        </div>
                        <div className="h-[1px] w-full bg-gray-300" />

                        <div className="p-0 lg:p-8 flex justify-center">
                            <a
                                href="/Homepage"
                                className="w-[80%] border hover:border-[#BFBFBF] bg-[#68A86B] hover:bg-white text-white hover:text-[#68A86B] font-bold p-1 lg:py-2 lg:px-2 rounded-lg flex justify-center items-center"
                            >
                                Task <FiPlus className="ml-2" />
                            </a>
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
                            fetchTasks={fetchTasks} _id={""} channelName={""} createdByUserId={""} />
                    </div>
                </div>
                {showForm && (
                    <section className="w-[100%] sm:w-[100%] bg-white shadow">
                        <div className="pt-1">
                            <div className="pt-5 px-4 text-black font-bold items-center flex justify-between">
                                <div ref={dropdownRef} className="flex gap-x-2 items-center">
                                    <div
                                        className="flex items-center cursor-pointer gap-2"
                                        onClick={handleToggle}
                                    >
                                        <img
                                            src={userData?.profilePicUrl}
                                            alt="profilePic"
                                            className="bg-cover object-cover w-[48.14px] h-[48.14px] rounded-full"
                                        />
                                        <p>{userData?.userName},</p>
                                        <p>{userData?.jobRole}</p>
                                    </div>

                                    {/* Conditionally render the Logout button */}
                                    {showLogout && (
                                        <button
                                            onClick={logout}
                                            className="ml-2 mr-[25px] p-2 bg-[#68A86B] text-white rounded-md hover:bg-red-600"
                                        >
                                            Logout
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <a href="/Homepage">H</a>
                                    <a href="/UserProfile">P</a>
                                </div>
                            </div>
                            <div className="mt-2 h-[1px] w-full bg-gray-300" />
                            <div className="p-4">
                                <p className="text-2xl text-black font-bold">Task Sharing</p>
                            </div>
                        </div>
                        <FormContainer
                            selectedTask={selectedTask}
                            handleShare={handleShare}
                            handleComplete={handleComplete}
                        />
                    </section>
                )}
                {/* Quiz Section */}
                {showQuiz && (
                    <div className="text-black w-[100%] sm:w-[40%] shadow-lg border-2 bg-white rounded-lg ">
                        <div className="mt-20">
                            <div className="h-[1px] w-full bg-gray-300" />
                        </div>
                        <p className="font-bold text-2xl text-center px-8 py-4">Learning</p>
                        <div className="px-8">
                            <Quizzes />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default TaskSharing;