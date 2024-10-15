/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import "../../src/app/globals.css";
import { FiPlus } from "react-icons/fi";
import Image from "next/image";
import { HiChevronRight } from "react-icons/hi";
import Profile from "../../src/assets/home/Ellipse 1.png";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useTask, Task } from "../components/TaskContext";
import back from "../../src/assets/home/back.png";
import deleteIcon from "../assets/Quiz/Vector.png";
import { HiChevronDown } from "react-icons/hi";
import Quizzes from "@/pages/tabs/Quizzes";
import { useRouter } from "next/router";

const TaskSharing = () => {
    const [search, setSearch] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showStar, setShowStar] = useState(false);
    const [showQuiz, setShowQuiz] = useState<boolean>(false);
    const [tasksList, setTasksList] = useState<Task[]>([]);
    const [showForm, setShowForm] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [filter, setFilter] = useState("All Task");
    const { task, setTask } = useTask();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [newTasksList, setnewTasksList] = useState<any[]>([]);
    const taskCategories = [
        "All Task",
        "Pending Task",
        "Completed Task",
        "Deleted Task",
        "Learning",
    ];
    const [dropdownVisible, setDropdownVisible] = useState<boolean[]>(
        Array(taskCategories.length).fill(false)
    );
    const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
    const [selectedTask, setselectedTask] = useState<any>(false);
    const router = useRouter();

    useEffect(() => {
        fetchTasks(filter);
    }, []);

    const handlesearch = (param: any) => {
        if (param) {
            setSearch(param);
            setFilter("All Task");
            setShowForm(false);
            console.log("test", tasksList);

            const filtered = tasksList.filter((task) => {
                return Object.values(task).some((value) =>
                    value?.toString().toLowerCase().includes(param.toLowerCase())
                );
            });
            setTasksList(filtered);
        } else {
            setSearch("");
            handleTasksClick("All Task");
            fetchTasks(filter);
        }
    };

    const handleResetInputs = () => {
        const { _id, ...newTask } = task;
        setTask({
            ...newTask,
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
                    handleTasksClick("All Task");
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

    const handleTasksClick = (item: string) => {
        handleResetInputs();
        setselectedTask(false);
        setShowQuiz(false);
        setFilter(item);
        fetchTasks(item);
        setShowForm(true);
    };

    const handleDropdown = (index: any) => {
        setselectedTask(false);
        const newDropdownVisible = dropdownVisible.map((isVisible, i) =>
            i === index ? !isVisible : isVisible
        );
        setDropdownVisible(newDropdownVisible);
    };

    const handleDeleteTask = async (id: String, filter: any) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                fetchTasks(filter);
                fetchTasks("Deleted Task");
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    //delete the task from dB

    const handleDeletedTask = async (taskId: String) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`,
                {
                    method: "DELETE",
                }
            );
            if (response.ok) {
                fetchTasks(filter);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleDelete = (newItem: any, filter: any) => {
        if (!newItem.isDeleted) {
            handleDeleteTask(newItem._id, filter);
        }
        if (newItem.isDeleted) {
            handleDeletedTask(newItem._id);
        }
    };

    const fetchTaskById = async (taskId: string) => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/task/${taskId}`
            );

            if (response) {
                setTask(response.data);

                if (response.data._id === taskId) {
                    setselectedTask(true);
                    setShowForm(true);
                } else {
                    setselectedTask(false);
                }
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleTaskEdit = (taskId: string) => {
        fetchTaskById(taskId);
    };

    console.log(filter);
    console.log(filteredTasks);

    return (
        <>
            <ToastContainer />
            <div className="w-full flex gap-2 bg-gray-100">
                <div className="w-[7%] flex flex-col items-center space-y-4 bg-white min-h-screen">
                    <div className="pt-12 text-green-500 text-lg md:text-3xl font-bold">
                        <a href="/Homepage">TL</a>
                    </div>
                    <div className="rounded-full overflow-hidden h-6 w-6 md:w-10 md:h-10 lg:w-12 lg:h-12">
                        <Image src={Profile} alt="Profile Picture" width={64} height={64} />
                    </div>

                    <button className="flex items-center justify-center h-6 w-6 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gray-300 rounded-full text-3xl text-white">
                        +
                    </button>
                </div>
                <div className="w-[25%] flex min-h-screen">
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
                                className="w-[80%] border hover:border-[#BFBFBF] bg-[#68A86B] hover:bg-white text-white hover:text-[#BFBFBF] font-bold p-1 lg:py-2 lg:px-2 rounded-lg flex justify-center items-center"
                            >
                                Task <FiPlus className="ml-2" />
                            </a>
                        </div>

                        <div className="p-2 relative">
                            <input
                                type="text"
                                placeholder="Search @ User, Patient ID..."
                                value={search}
                                onChange={(e) => handlesearch(e.target.value)}
                                className="w-full p-1 border border-gray-300 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEBEBE]"
                            />
                        </div>

                        <ul className="p-4 space-y-4">
                            {taskCategories.map((item: any, index: any) => (
                                <>
                                    <li
                                        key={item}
                                        onClick={() => {
                                            handleTasksClick(item);
                                            handleDropdown(index);
                                        }}
                                        className="flex justify-between items-center text-gray-600 hover:text-black hover:font-semibold cursor-pointer"
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
                                                <div
                                                    key={index}
                                                    className={`text-black justify-between flex `}
                                                >
                                                    <p
                                                        className={`cursor-pointer hover:text-[#68A86B] ${selectedTask && newItem._id === task?._id
                                                                ? "text-[#68A86B]"
                                                                : ""
                                                            }`}
                                                        onClick={() => handleTaskEdit(newItem._id)}
                                                    >
                                                        {newItem?.taskName}
                                                    </p>
                                                    <Image
                                                        className=" object-contain w-[16px] cursor-pointer"
                                                        src={deleteIcon}
                                                        alt="delete"
                                                        onClick={() => handleDelete(newItem, item)}
                                                    />
                                                </div>
                                            );
                                        })}
                                </>
                            ))}
                        </ul>
                    </div>
                </div>
                {showForm && (
                    <section className="w-[70%] bg-white shadow">
                        <div className="pt-1">
                            <div className="pt-11 px-4 text-black font-bold items-center flex justify-end gap-2">
                                <a href="/Homepage">H</a>
                                <a href="/UserProfile">P</a>
                            </div>
                            <div className="mt-2 h-[1px] w-full bg-gray-300" />
                            <div className="p-4">
                                <p className="text-2xl text-black font-bold">Task Sharing</p>
                            </div>
                        </div>
                        <form className="p-4 rounded">
                            <div className="flex flex-col gap-4">
                                <div className="relative">
                                    <div className="flex items-center border border-gray p-1 rounded-md">
                                        <label className="whitespace-nowrap mr-2 text-black">
                                            Created by:
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="@ Username"
                                            className={`flex-1 outline-none text-black ${selectedTask ? "cursor-default" : ""
                                                }`}
                                            value={task.createdBy}
                                            onChange={(e) =>
                                                setTask({ ...task, createdBy: e.target.value })
                                            }
                                            required
                                            readOnly={selectedTask}
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="flex items-center border border-gray p-1 rounded-md">
                                        <label className="whitespace-nowrap mr-2 text-gray-700">
                                            Tagged Staff:
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="@ Username"
                                            className={`flex-1 outline-none text-black ${selectedTask ? "cursor-default" : ""
                                                }`}
                                            value={task.taggedStaff}
                                            onChange={(e) =>
                                                setTask({ ...task, taggedStaff: e.target.value })
                                            }
                                            required
                                            readOnly={selectedTask}
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="flex items-center border border-gray p-1 rounded-md">
                                        <label className="whitespace-nowrap mr-2 text-gray-700">
                                            Contributing Staff:
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="@ Username"
                                            className={`flex-1 outline-none  text-black ${selectedTask ? "cursor-default" : ""
                                                }`}
                                            value={task.contributingStaff}
                                            onChange={(e) =>
                                                setTask({ ...task, contributingStaff: e.target.value })
                                            }
                                            required
                                            readOnly={selectedTask}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 text-black">
                                        Task/Instruction
                                    </label>
                                    <input
                                        type="text"
                                        placeholder=""
                                        className={`w-full input-field border border-gray p-1 rounded-md text-black ${selectedTask ? "outline-none cursor-default" : ""
                                            }`}
                                        value={task.taskName}
                                        onChange={(e) =>
                                            setTask({ ...task, taskName: e.target.value })
                                        }
                                        required
                                        readOnly={selectedTask}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block mb-1 text-black">History:</label>
                                    <textarea
                                        placeholder=""
                                        className={`w-full input-field border border-gray p-1 rounded-md text-black ${selectedTask ? "outline-none cursor-default" : ""
                                            }`}
                                        value={task.history}
                                        onChange={(e) =>
                                            setTask({ ...task, history: e.target.value })
                                        }
                                        required
                                        readOnly={selectedTask}
                                    />
                                </div>
                                <div className="flex gap-4 w-full">
                                    <div className="flex-1">
                                        <label className="block mb-1 text-black">
                                            Examination:
                                        </label>
                                        <textarea
                                            placeholder=""
                                            className={`w-full border border-gray p-1 rounded-md text-black ${selectedTask ? "outline-none cursor-default" : ""
                                                }`}
                                            value={task.examination}
                                            onChange={(e) =>
                                                setTask({ ...task, examination: e.target.value })
                                            }
                                            required
                                            readOnly={selectedTask}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block mb-1 text-black">Diagnosis:</label>
                                        <textarea
                                            placeholder=""
                                            className={`w-full border border-gray p-1 rounded-md text-black ${selectedTask ? "outline-none cursor-default" : ""
                                                }`}
                                            value={task.diagnosis}
                                            onChange={(e) =>
                                                setTask({ ...task, diagnosis: e.target.value })
                                            }
                                            required
                                            readOnly={selectedTask}
                                        />
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <label className="block mb-1 text-black">Plan:</label>
                                    <textarea
                                        placeholder=""
                                        className={`w-full input-field border border-gray p-1 rounded-md text-black ${selectedTask ? "outline-none cursor-default" : ""
                                            }`}
                                        value={task.plan}
                                        onChange={(e) => setTask({ ...task, plan: e.target.value })}
                                        required
                                        readOnly={selectedTask}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block mb-1 text-black">Follow Up:</label>
                                    <textarea
                                        placeholder=""
                                        className={`w-full input-field border border-gray p-1 rounded-md text-black ${selectedTask ? "outline-none cursor-default" : ""
                                            }`}
                                        value={task.followUp}
                                        onChange={(e) =>
                                            setTask({ ...task, followUp: e.target.value })
                                        }
                                        required
                                        readOnly={selectedTask}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block mb-1 text-black">
                                        Post Consultation:
                                    </label>
                                    <textarea
                                        placeholder=""
                                        className={`w-full input-field border border-gray p-1 rounded-md text-black ${selectedTask ? "outline-none cursor-default" : ""
                                            }`}
                                        value={task.postConsultation}
                                        onChange={(e) =>
                                            setTask({ ...task, postConsultation: e.target.value })
                                        }
                                        required
                                        readOnly={selectedTask}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block mb-1 text-black">Feedback:</label>
                                    <textarea
                                        placeholder=""
                                        className={`w-full input-field border border-gray p-1 rounded-md text-black ${selectedTask ? "outline-none cursor-default" : ""
                                            }`}
                                        value={task.feedback}
                                        onChange={(e) =>
                                            setTask({ ...task, feedback: e.target.value })
                                        }
                                        required
                                        readOnly={selectedTask}
                                    />
                                </div>
                                <div className="flex gap-4 w-full">
                                    <div className="flex-1">
                                        <label className="block mb-1 text-black">
                                            Key Learning Point:
                                        </label>
                                        <textarea
                                            placeholder=""
                                            className={`w-full border border-gray p-1 rounded-md text-black ${selectedTask ? "outline-none cursor-default" : ""
                                                }`}
                                            value={task.keyLearningPoint}
                                            onChange={(e) =>
                                                setTask({ ...task, keyLearningPoint: e.target.value })
                                            }
                                            readOnly={selectedTask}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block mb-1 text-black">Action:</label>
                                        <textarea
                                            placeholder=""
                                            className={`w-full border border-gray p-1 rounded-md text-black ${selectedTask ? "outline-none cursor-default" : ""
                                                }`}
                                            value={task.action}
                                            onChange={(e) =>
                                                setTask({ ...task, action: e.target.value })
                                            }
                                            readOnly={selectedTask}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`flex mt-4 relative ${task?.isShared || task?.isCompleted || task?.isDeleted
                                        ? "justify-center"
                                        : "justify-between"
                                    }`}
                            >
                                <button
                                    type="submit"
                                    onClick={handleShare}
                                    className={`btn-submit bg-[#68A86B] border border-[#68A86B] text-white py-1 px-7 rounded-lg hover:bg-green-100 hover:text-black transition duration-300 ${task?.isShared || task?.isCompleted || task?.isDeleted
                                            ? "hidden"
                                            : "block"
                                        }`}
                                >
                                    Share
                                </button>
                                <label className="block mb-2 text-black font-bold">
                                    <input
                                        type="checkbox"
                                        className={`mr-2 appearance-none h-4 w-4 border rounded-sm checked:bg-[#68A86B] checked:border-transparent focus:outline-none transition duration-200  relative checked:before:content-['✔'] checked:before:text-white checked:before:absolute checked:before:left-0 checked:before:top-[-5px] ${selectedTask ? "cursor-default" : "cursor-pointer"
                                            }`}
                                        checked={task.Library}
                                        onChange={(e) =>
                                            setTask({ ...task, Library: e.target.checked })
                                        }
                                        disabled={selectedTask}
                                    />
                                    Library
                                </label>
                                <label
                                    className={`block mb-2 text-black font-bold ${task?.isShared || task?.isCompleted || task?.isDeleted
                                            ? "absolute right-0"
                                            : ""
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        className={`mr-2 appearance-none h-4 w-4 border rounded-sm checked:bg-[#68A86B] checked:border-transparent focus:outline-none transition duration-200 relative checked:before:content-['✔'] checked:before:text-white checked:before:absolute checked:before:left-0 checked:before:top-[-5px] ${selectedTask ? "cursor-default" : "cursor-pointer "
                                            }`}
                                        checked={task.Learn}
                                        onChange={(e) =>
                                            setTask({ ...task, Learn: e.target.checked })
                                        }
                                        disabled={selectedTask}
                                    />
                                    Learn
                                </label>
                            </div>
                            <div className="flex mt-2 justify-center">
                                <p className="text-black">
                                    Message about task during supervision/collaboration
                                </p>
                            </div>
                            <div className="flex mt-4 justify-center">
                                <button
                                    type="button"
                                    onClick={handleComplete}
                                    className={`w-[20%] btn-submit bg-[#68A86B] border border-[#68A86B] text-white py-1 px-7 rounded-lg hover:bg-green-100 hover:text-black transition duration-300 ${task?.isCompleted || task?.isDeleted ? "hidden" : "block"
                                        }`}
                                >
                                    Complete
                                </button>
                            </div>
                        </form>
                    </section>
                )}

                {/* Quiz Section */}
                {showQuiz && (
                    <div className="text-black w-[40%] shadow-lg border-2 bg-white rounded-lg">
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