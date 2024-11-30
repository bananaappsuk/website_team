/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { useTask } from "../components/TaskContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

type Props = {
    selectedTask: boolean;
    handleShare: (e: React.FormEvent) => Promise<void>;
    handleComplete: (e: React.FormEvent) => Promise<void>;
    taggedStaffTags: string[];
    contributingTags: string[];
    setTaggedStaffTags: React.Dispatch<React.SetStateAction<string[]>>;
    setContributingTags: React.Dispatch<React.SetStateAction<string[]>>;
    setBtnDisble: React.Dispatch<React.SetStateAction<boolean>>;
    btnDisable: boolean;
};
type UserData = {
    uid: any;
    email: string;
    userName: string;
    jobRole: string;
    profilePicUrl?: string | undefined;
};
interface TaskSectionProps {
    server: { serverId: string; serverName: string; memberList: string[] } | null;
    userData: UserData | null;
}

type combinedProps = TaskSectionProps & Props;

const FormContainer: React.FC<combinedProps> = ({
    server,
    selectedTask,
    handleShare,
    handleComplete,
    userData,
    taggedStaffTags,
    setTaggedStaffTags,
    contributingTags,
    setContributingTags,
    setBtnDisble,
    btnDisable,
}) => {
    const { task, setTask, patientIdLoading } = useTask();
    const [searchUserName, setSearchUserName] = useState("");
    const [searchUserName2, setSearchUserName2] = useState("");
    const [serverUsers, setServerUsers] = useState<UserData[]>([]);
    const [serverUsers2, setServerUsers2] = useState<UserData[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [showResults2, setShowResults2] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchRef2 = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [userCheck, setUserCheck] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    console.log("Task", selectedTask);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef2.current &&
                !searchRef2.current.contains(event.target as Node)
            ) {
                setShowResults2(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    //useEffect for taggedStaff

    useEffect(() => {
        const fetchUsersByUIDs = async (uids: string[]) => {
            setLoading(true);
            try {
                console.log("UIDs: ", uids);
                if (searchUserName.trim() == "@") {
                    const userDocs = await getDocs(collection(db, "users"));
                    const allUsers = userDocs.docs.map((doc) => ({
                        ...(doc.data() as UserData),
                        uid: doc.id,
                    }));
                    const filteredUsers = allUsers?.filter(
                        (user) => uids.includes(user.uid) && userData?.uid !== user.uid
                    );
                    if (filteredUsers && filteredUsers.length > 0) {
                        if (taggedStaffTags.length > 0) {
                            const newFilteredUsers = filteredUsers.filter(
                                (user) => !taggedStaffTags.includes(user.userName)
                            );
                            setServerUsers(newFilteredUsers);
                        } else {
                            setServerUsers(filteredUsers);
                        }
                    } else {
                        setServerUsers([]);
                    }
                    setLoading(false); // Ensure setLoading(false) is called in all cases
                }

                if (searchUserName.trim() !== "@") {
                    const userDocs = await getDocs(collection(db, "users"));
                    const allUsers = userDocs.docs.map((doc) => ({
                        ...(doc.data() as UserData),
                        uid: doc.id,
                    }));

                    const filteredUsers = allUsers?.filter(
                        (user) => uids.includes(user.uid) && userData?.uid !== user.uid
                    );

                    const lowerCaseSearchTerm = searchUserName.toLowerCase();

                    // Determine the match type based on the length of the search term
                    const filtered = filteredUsers.filter((user) => {
                        const userName = user.userName?.toLowerCase();

                        // Match one letter or two or more letters
                        if (
                            lowerCaseSearchTerm.slice(1).length === 1 &&
                            searchUserName.includes("@")
                        ) {
                            return (
                                userName && userName.includes(lowerCaseSearchTerm.slice(1))
                            );
                        } else if (
                            lowerCaseSearchTerm.slice(1).length >= 2 &&
                            searchUserName.includes("@")
                        ) {
                            return (
                                userName && userName.includes(lowerCaseSearchTerm.slice(1))
                            );
                        }
                        return false; // No match if the search term is empty or less than 1
                    });

                    if (filtered) {
                        setServerUsers(filtered);
                    }
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        if (server?.memberList && showResults && server.memberList.length > 0) {
            fetchUsersByUIDs(server?.memberList);
        } else {
            setServerUsers([]);
            setLoading(false);
        }

        if (showResults) {
            setShowResults2(false);
        }
    }, [showResults, searchUserName]);

    //useEffect for contributingStaff
    useEffect(() => {
        const fetchUsersByUIDs = async (uids: string[]) => {
            setLoading2(true);
            try {
                console.log("UIDs: ", uids);
                if (searchUserName2.trim() == "@") {
                    const userDocs = await getDocs(collection(db, "users"));
                    const allUsers = userDocs.docs.map((doc) => ({
                        ...(doc.data() as UserData),
                        uid: doc.id,
                    }));
                    const filteredUsers = allUsers?.filter(
                        (user) => uids.includes(user.uid) && userData?.uid !== user.uid
                    );
                    if (filteredUsers && filteredUsers.length > 0) {
                        if (contributingTags.length > 0) {
                            const newFilteredUsers = filteredUsers.filter(
                                (user) => !contributingTags.includes(user.userName)
                            );
                            setServerUsers2(newFilteredUsers);
                        } else {
                            setServerUsers2(filteredUsers);
                        }
                    } else {
                        setServerUsers2([]);
                    }
                    setLoading2(false); // Ensure setLoading(false) is called in all cases
                }

                if (searchUserName2.trim() !== "@") {
                    const userDocs = await getDocs(collection(db, "users"));
                    const allUsers = userDocs.docs.map((doc) => ({
                        ...(doc.data() as UserData),
                        uid: doc.id,
                    }));

                    const filteredUsers = allUsers?.filter(
                        (user) => uids.includes(user.uid) && userData?.uid !== user.uid
                    );

                    const lowerCaseSearchTerm = searchUserName2.toLowerCase();

                    // Determine the match type based on the length of the search term
                    const filtered = filteredUsers.filter((user) => {
                        const userName = user.userName?.toLowerCase();

                        // Match one letter or two or more letters
                        if (
                            lowerCaseSearchTerm.slice(1).length === 1 &&
                            searchUserName2.includes("@")
                        ) {
                            return (
                                userName && userName.includes(lowerCaseSearchTerm.slice(1))
                            );
                        } else if (
                            lowerCaseSearchTerm.slice(1).length >= 2 &&
                            searchUserName2.includes("@")
                        ) {
                            return (
                                userName && userName.includes(lowerCaseSearchTerm.slice(1))
                            );
                        }
                        return false; // No match if the search term is empty or less than 1
                    });

                    if (filtered) {
                        setServerUsers2(filtered);
                    }
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading2(false);
            }
        };

        if (server?.memberList && showResults2 && server.memberList.length > 0) {
            fetchUsersByUIDs(server?.memberList);
        } else {
            setServerUsers2([]);
            setLoading2(false);
        }
    }, [showResults2, searchUserName2]);

    const handleTagClick = (userName: string) => {
        setTaggedStaffTags((prevTags) => [...prevTags, userName]);
        setShowResults(false);
        setSearchUserName("");
    };

    const handleTagClick2 = (userName: string) => {
        setContributingTags((prevTags) => [...prevTags, userName]);
        setShowResults2(false);
        setSearchUserName2("");
    };

    useEffect(() => {
        setTask((prevTask) => ({
            ...prevTask,
            taggedStaff: taggedStaffTags,
            contributingStaff: contributingTags,
        }));
    }, [taggedStaffTags, contributingTags]);

    console.log(contributingTags);

    const handleRemoveTag = (tag: string) => {
        const newTagas = taggedStaffTags.filter((item) => item !== tag);
        setTaggedStaffTags(newTagas);
        setShowResults(false);
    };

    const handleRemoveTag2 = (tag: string) => {
        const newTagas = contributingTags.filter((item) => item !== tag);
        setContributingTags(newTagas);
        setShowResults2(false);
    };

    const userCheckFn = async () => {
        return server?.memberList.some(
            (item) => item === userData?.uid && server?.memberList.length > 0
        );
    };
    // reset tags

    const isReadOnlyTaggStaff = taggedStaffTags.length === 1;

    const isReadOnlyContributing = contributingTags.length === 1;


    if (patientIdLoading && server) {
        return <p className=" text-center ">Loading...</p>;
    }

    console.log("load", patientIdLoading);
    console.log(server, "server");



    return (
      <div>
        {server && !patientIdLoading && (
          <form className="p-4 rounded overflow-y-auto max-h-screen">
            <div className="flex flex-col gap-4">
              <div className=" relative">
                <div className="flex items-center border border-gray p-1 rounded-md">
                  <label className="whitespace-nowrap mr-2 text-[#666666]">
                    Patient ID:
                  </label>
                  <input
                    type="text"
                    className={`flex-1 outline-none text-black ${"cursor-default"}`}
                    value={task?.patientId}
                    required
                    readOnly
                  />
                </div>
              </div>
              <div className="relative">
                <div className="flex items-center border border-gray p-1 rounded-md">
                  <label className="whitespace-nowrap mr-2 text-[#666666]">
                    Created by:
                  </label>
                  <input
                    type="text"
                    placeholder="@ Username"
                    className={`flex-1 outline-none text-black ${
                      selectedTask ? "cursor-default" : ""
                    }`}
                    value={`@${task.createdBy}`}
                    onChange={(e) =>
                      setTask({ ...task, createdBy: e.target.value })
                    }
                    required
                    readOnly
                  />
                </div>
              </div>

              <div className="relative" ref={searchRef}>
                <div className="flex items-center border border-gray p-1 rounded-md">
                  <label className="whitespace-nowrap mr-2 text-[#666666]">
                    Tag staff for help / Completion:
                  </label>
                  <div className="flex gap-x-3">
                    <div className=" z-40 ">
                      <div className="flex gap-x-3">
                        {taggedStaffTags?.map((tag, index) => (
                          <div
                            key={index}
                            className=" bg-white flex gap-x-2 px-2 items-center rounded-md  border border-black "
                          >
                            {" "}
                            <span>{`@${tag}`}</span>
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              disabled={selectedTask}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder={`${
                      taggedStaffTags.length === 0 ? "@ Username" : ""
                    }`}
                    className={`flex-1 outline-none text-black ${
                      selectedTask ? "cursor-default" : ""
                    }`}
                    value={
                      selectedTask && taggedStaffTags.length === 0
                        ? task?.taggedStaff
                            ?.map((item: any) => `@${item}`)
                            .join(" ") || ""
                        : searchUserName
                    }
                    onChange={(e) => {
                      setSearchUserName(e.target.value);
                    }}
                    onFocus={() => setShowResults(true)}
                    readOnly={selectedTask || isReadOnlyTaggStaff}
                  />
                </div>
                {showResults && serverUsers && !loading && !selectedTask && (
                  <div className="absolute left-[14.25rem] bg-white text-black shadow-lg rounded-lg mt-2 w-full sm:w-96 lg:w-[10rem] max-h-60 overflow-y-auto z-50 cursor-pointer">
                    {serverUsers.length > 0
                      ? serverUsers?.map((user) => (
                          <div key={user.uid} className="p-2 border-b">
                            <p
                              className="font-medium"
                              onClick={() => handleTagClick(user.userName)}
                            >
                              {user?.userName}
                            </p>
                          </div>
                        ))
                      : !loading &&
                        showResults &&
                        server?.memberList?.length > 0 &&
                        server?.memberList?.includes(userData?.uid) &&
                        searchUserName === "@" && (
                          <div className="p-2 text-gray-500">No user found</div>
                        )}
                  </div>
                )}
              </div>

              <div className="relative" ref={searchRef2}>
                <div className="flex items-center border border-gray p-1 rounded-md">
                  <label className="whitespace-nowrap mr-2 text-[#666666]">
                    Contributing Staff:
                  </label>
                  <div className="flex gap-x-3">
                    {contributingTags?.map((tag, index) => (
                      <div
                        key={index}
                        className=" bg-white flex gap-x-2 px-2 items-center rounded-md  border border-black "
                      >
                        {" "}
                        <span>{`@${tag}`}</span>
                        <button
                          onClick={() => handleRemoveTag2(tag)}
                          disabled={selectedTask}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder={`${
                      contributingTags.length === 0 ? "@ Username" : ""
                    }`}
                    className={`flex-1 outline-none text-black ${
                      selectedTask ? "cursor-default" : ""
                    }`}
                    value={`${
                      selectedTask && contributingTags.length === 0
                        ? task?.contributingStaff
                            ?.map((item: any) => `@${item}`)
                            .join(" ") || ""
                        : searchUserName2
                    }`}
                    onChange={(e) => {
                      setSearchUserName2(e.target.value);
                    }}
                    onFocus={() => setShowResults2(true)}
                    readOnly={selectedTask || isReadOnlyContributing}
                  />
                </div>
                {showResults2 && serverUsers2 && !loading2 && !selectedTask && (
                  <div className="absolute left-[9.25rem] bg-white text-black shadow-lg rounded-lg mt-2 w-full sm:w-96 lg:w-[10rem] max-h-60 overflow-y-auto z-50 cursor-pointer">
                    {serverUsers2.length > 0
                      ? serverUsers2?.map((user) => (
                          <div key={user.uid} className="p-2 border-b">
                            <p
                              className="font-medium"
                              onClick={() => handleTagClick2(user.userName)}
                            >
                              {user?.userName}
                            </p>
                          </div>
                        ))
                      : !loading2 &&
                        showResults2 &&
                        server.memberList.length > 0 &&
                        server.memberList.includes(userData?.uid) &&
                        searchUserName2 === "@" && (
                          <div className="p-2 text-gray-500">No user found</div>
                        )}
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-1 text-[#666666]">
                  {" "}
                  Task Name/Instructions
                </label>
                <input
                  type="text"
                  placeholder=""
                  className={`w-full input-field border border-gray p-1 rounded-md text-black ${
                    selectedTask ? "outline-none cursor-default" : ""
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
                <label className="block mb-1 text-[#666666]">History</label>
                <textarea
                  placeholder=""
                  className={`w-full input-field border border-gray p-1 rounded-md text-black ${
                    selectedTask ? "outline-none cursor-default" : ""
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
                  <label className="block mb-1 text-[#666666]">
                    Examination
                  </label>
                  <textarea
                    placeholder=""
                    className={`w-full border border-gray p-1 rounded-md text-black ${
                      selectedTask ? "outline-none cursor-default" : ""
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
                  <label className="block mb-1 text-[#666666]">Diagnosis</label>
                  <textarea
                    placeholder=""
                    className={`w-full border border-gray p-1 rounded-md text-black ${
                      selectedTask ? "outline-none cursor-default" : ""
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
                <label className="block mb-1 text-[#666666]">Plan</label>
                <textarea
                  placeholder=""
                  className={`w-full input-field border border-gray p-1 rounded-md text-black ${
                    selectedTask ? "outline-none cursor-default" : ""
                  }`}
                  value={task.plan}
                  onChange={(e) => setTask({ ...task, plan: e.target.value })}
                  required
                  readOnly={selectedTask}
                />
              </div>
              <div className="col-span-2">
                <label className="block mb-1 text-[#666666]">Follow Up</label>
                <textarea
                  placeholder=""
                  className={`w-full input-field border border-gray p-1 rounded-md text-black ${
                    selectedTask ? "outline-none cursor-default" : ""
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
                <label className="block mb-1 text-[#666666]">
                  Post Consultation
                </label>
                <textarea
                  placeholder=""
                  className={`w-full input-field border border-gray p-1 rounded-md text-black ${
                    selectedTask ? "outline-none cursor-default" : ""
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
                <label className="block mb-1 text-[#666666]">Feedback</label>
                <textarea
                  placeholder=""
                  className={`w-full input-field border border-gray p-1 rounded-md text-black ${
                    selectedTask ? "outline-none cursor-default" : ""
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
                  <label className="block mb-1 text-[#666666]">
                    Key Learning Points
                  </label>
                  <textarea
                    placeholder="Enter why this task is being done"
                    className={`w-full border border-gray py-10 px-2 text-center rounded-md text-black ${
                      selectedTask ? "outline-none cursor-default" : ""
                    }`}
                    value={task.keyLearningPoint}
                    onChange={(e) =>
                      setTask({ ...task, keyLearningPoint: e.target.value })
                    }
                    readOnly={selectedTask}
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 text-[#666666]">Action</label>
                  <textarea
                    placeholder="Enter how this task should be done"
                    className={`w-full border border-gray py-10 px-2 text-center rounded-md text-black ${
                      selectedTask ? "outline-none cursor-default" : ""
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
              className={`flex mt-4 relative ${
                task?.isShared || task?.isCompleted || task?.isDeleted
                  ? "justify-center"
                  : "justify-between"
              }`}
            >
              <button
                type="submit"
                onClick={handleShare}
                className={`btn-submit bg-[#68A86B] border border-[#68A86B] text-white py-1 px-7 rounded-lg hover:bg-green-100 hover:text-black transition duration-300 ${
                  task?.isShared || task?.isCompleted || task?.isDeleted
                    ? "hidden"
                    : "block"
                } ${selectedTask && "cursor-not-allowed"} ${
                  !task.Learn && "cursor-not-allowed"
                }`}
                disabled={selectedTask || !task.Learn}
              >
                Share
              </button>
              <label className="block mb-2 text-black font-bold">
                <input
                  type="checkbox"
                  className={`mr-2 appearance-none h-4 w-4 border rounded-sm checked:bg-[#68A86B] checked:border-transparent focus:outline-none transition duration-200  relative checked:before:content-['✔'] checked:before:text-white checked:before:absolute checked:before:left-0 checked:before:top-[-5px] ${
                    selectedTask ? "cursor-default" : "cursor-pointer"
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
                className={`block mb-2 text-black font-bold ${
                  task?.isShared || task?.isCompleted || task?.isDeleted
                    ? "absolute right-0"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  className={`mr-2 appearance-none h-4 w-4 border rounded-sm checked:bg-[#68A86B] checked:border-transparent focus:outline-none transition duration-200 relative checked:before:content-['✔'] checked:before:text-white checked:before:absolute checked:before:left-0 checked:before:top-[-5px] ${
                    selectedTask ? "cursor-default" : "cursor-pointer "
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
              <p className="text-[#797878]">
                messages about task during supervision/collaboration
              </p>
            </div>
            <div className="flex mt-4 justify-center">
              <button
                type="button"
                onClick={handleComplete}
                className={`w-[20%] btn-submit bg-[#68A86B] border border-[#68A86B] text-white py-1 px-7 rounded-lg hover:bg-green-100 hover:text-black transition duration-300 ${
                  task?.isCompleted || task?.isDeleted ? "hidden" : "block"
                } ${selectedTask && btnDisable && "cursor-not-allowed"}`}
                disabled={selectedTask && btnDisable}
              >
                Complete
              </button>
            </div>
          </form>
        )}

        {!server && patientIdLoading && (
          <div className="flex items-center justify-between px-4 py-1 text-black">
            {" "}
            Select a server
          </div>
        )}
      </div>
    );
};

export default FormContainer;