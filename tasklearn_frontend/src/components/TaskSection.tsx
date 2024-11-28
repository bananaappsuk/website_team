/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HiChevronRight } from "react-icons/hi";
import deleteIcon from "../assets/Quiz/Vector.png";
import { HiChevronDown, HiX } from "react-icons/hi";
import { useTask } from "../components/TaskContext";
import axios from "axios";
import { toast } from "react-toastify";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useRouter } from "next/router";
import Plus from "../assets/home/icon.png";

interface Server {
    _id: string;
    channelName: string;
    createdByUserId: string;
}

interface ServerDisplayProps {
    server: { serverId: string; serverName: string } | null;
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
};

interface TaskSectionProps {
    server: { serverId: string; serverName: string } | null;
}

type CombinedProps = ServerDisplayProps & Props & Server & TaskSectionProps;

const TaskSection: React.FC<CombinedProps> = ({
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
}) => {
  const { task, setTask, selectedServerId } = useTask();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const ServerDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { id } = router.query;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [servers, setServers] = useState<Server | null>(null);
  const [inviteLink, setInviteLink] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [buttonText, setButtonText] = useState("Copy");
  const [filteredSearchTask, setFilteredSearchTask] = useState([]);
  const [filteredPatientId, setFilteredPatientId] = useState<any[]>([]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  const handleDropdown = (index: any) => {
    setselectedTask(false);
    const newDropdownVisible = dropdownVisible.map((isVisible, i) =>
      i === index ? !isVisible : isVisible
    );
    setDropdownVisible(newDropdownVisible);
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
      if (searchTerm.trim() !== "") {
        try {
          // Fetch tasks by server ID
          const taskResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/server/${server?.serverId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!taskResponse.ok) throw new Error("Failed to fetch tasks");
          const tasks = await taskResponse.json();

          // Fetch user data
          const userDocs = await getDocs(collection(db, "users"));
          const users = userDocs.docs.map((doc) => doc.data() as UserData);

          const lowerCaseSearchTerm = searchTerm.toLowerCase();

          // Filter users based on search term
          const filteredUsers = users.filter((user) => {
            const userName = user.userName?.toLowerCase();
            const jobRole = user.jobRole?.toLowerCase();
            return (
              (userName && userName.includes(lowerCaseSearchTerm)) ||
              (jobRole && jobRole.includes(lowerCaseSearchTerm))
            );
          });

          // Filter patient IDs based on search term
          const filteredPatients = tasks.filter((task: any) => {
            const patientId = task.patientId?.toLowerCase();
            return patientId && patientId.includes(lowerCaseSearchTerm);
          });

          setFilteredUsers(filteredUsers);
          setFilteredPatientId(filteredPatients);
        } catch (error) {
          console.error("Error fetching data:", error);
          setFilteredUsers([]);
          setFilteredPatientId([]);
        }
      } else {
        setFilteredUsers([]);
        setFilteredPatientId([]);
      }
    };

    fetchAndSearchData();
  }, [searchTerm, server?.serverId]);

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
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/task/${taskId}`
      );

      if (response) {
        setTask(response.data);
        if (response.data._id === taskId) {
          setSelectedQuizTaskId(response.data._id);
          setselectedTask(true);
          setShowForm(true);
          setBtnDisble(false)
        } else {
          setselectedTask(false);
          setSelectedQuizTaskId("");
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    }
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
        fetchTasks(filter);
        fetchTasks("Deleted Tasks");
        fetchTasks("All Tasks");
        fetchTasks("Learning");
        fetchTasks("Pending Tasks");
        fetchTasks("Completed Tasks");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteQuiz = async (taskId: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/task/${taskId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      handleTasksClick("Deleted Tasks");
    }
  };

  //delete the task from dB

  const handleDeletedTask = async (taskId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        handleDeleteQuiz(taskId);
        fetchTasks(filter);
        fetchTasks("Deleted Tasks");
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

  useEffect(() => {
    const fetchServer = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/servers/${id}`
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
    } catch (err) {
      toast.warning("Share cancelled");
    }
  };

  return (
    <div>
      {server ? (
        <div ref={ServerDropdownRef} className="w-full max-w-md mx-auto mt-5">
          <div
            className="flex items-center justify-between px-4 py-1 cursor-pointer"
            onClick={toggleOpen}
          >
            <span className="text-md font-bold text-black">
              {server.serverName}
            </span>
            {isOpen ? (
              <HiChevronDown className="w-4 h-4 text-gray-600" />
            ) : (
              <HiChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </div>
          {isOpen && (
            <div
              onClick={generateInviteLink}
              className="bg-[#F4F4F4] flex items-center cursor-pointer"
            >
              <div className="px-4 py-6 text-black">Invite Link</div>
              <div className="px-5 py-6 ml-auto">
                <Image src={Plus} alt="plus" className="w-3 h-3" />
              </div>
            </div>
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
        {showResults && searchTerm && (
          <div className="absolute bg-white text-black shadow-lg rounded-lg mt-2 w-full sm:w-96 max-h-60 overflow-y-auto">
            {filteredUsers.length > 0 || filteredPatientId.length > 0 ? (
              filteredUsers.map((user, index) => {
                const patients = filteredPatientId.filter(
                  (item) =>
                    item.createdBy.trim().toLowerCase() ===
                    user.userName.trim().toLowerCase()
                );

                return (
                  <div key={index} className="p-2 border-b">
                    <p className="font-semibold">{user.userName}</p>
                    <p className="text-sm text-gray-500">{user.jobRole}</p>
                    <div className="font-semibold">
                      {patients.length > 0
                        ? patients.map((patient, index) => (
                            <p key={index}>{patient.patientId}</p>
                          ))
                        : "No patientId"}
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

      {server ? (
        <div className="mt-2">
          <ul className="px-4 space-y-4 ">
            {taskCategories.map((item: any, index: any) => (
              <>
                <li
                  key={item}
                  onClick={() => {
                    handleTasksClick(item);
                    handleDropdown(index);
                  }}
                  className="flex justify-between items-center text-black font-bold cursor-pointer"
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
                            className={`cursor-pointer hover:text-[#68A86B] ${
                              selectedTask && newItem._id === task?._id
                                ? "text-[#68A86B]"
                                : ""
                            }`}
                            onClick={() => fetchTaskById(newItem._id)}
                          >
                            {newItem && newItem?.patientId}
                          </p>
                          <Image
                            className=" object-contain w-[16px] cursor-pointer"
                            src={deleteIcon}
                            alt="delete"
                            onClick={() => handleDelete(newItem, item)}
                          />
                        </div>
                      </>
                    );
                  })}
              </>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex items-center justify-between px-4 py-1 text-black">
          {" "}
          Select a server
        </div>
      )}
    </div>
  );
};

export default TaskSection;