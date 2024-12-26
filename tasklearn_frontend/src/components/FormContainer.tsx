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
  btnDisable2: boolean;
  fetchUsername: (uid: string) => Promise<string>;
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
  btnDisable2,
  fetchUsername
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
        if (searchUserName2.trim() == "@") {
          const userDocs = await getDocs(collection(db, "users"));
          const allUsers = userDocs.docs.map((doc) => ({
            ...(doc.data() as UserData),
            uid: doc.id,
          }));
          const filteredUsers = allUsers?.filter((user) =>
            uids.includes(user.uid)
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

          const filteredUsers = allUsers?.filter((user) =>
            uids.includes(user.uid)
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

  const fetchUIDsAndUsernames = async (
    userNames: string[]
  ): Promise<string[]> => {
    try {
      // Create a reference to the users collection
      const usersRef = collection(db, "users"); // Create an array of query promises for each username
      const queries = userNames.map((userName) => {
        const q = query(usersRef, where("userName", "==", userName));
        return getDocs(q);
      }); // Execute all queries in parallel
      const querySnapshots = await Promise.all(queries); // Process the results
      const userIds = querySnapshots.flatMap((querySnapshot) =>
        querySnapshot.docs.map((doc) => doc.id)
      );
      return userIds;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };
  const handleTagClick = async (uid: string, userName: string) => {
    const updatedTags = [...taggedStaffTags, userName];
    setTaggedStaffTags(updatedTags);
    setShowResults(false);
    setSearchUserName("");
    // Step 2: Fetch UIDs only if there are updated tags
    if (updatedTags.length > 0) {
      const uids = await fetchUIDsAndUsernames(updatedTags);

      // Step 3: Update task with new taggedStaff  UIDs
      setTask((prevTask) => ({
        ...prevTask,
        taggedStaff: uids,
      }));
    }
  };

  const handleTagClick2 = async (uid: string, userName: string) => {
    const updatedTags = [...contributingTags, userName];
    setContributingTags(updatedTags);
    setSearchUserName2("");
    setShowResults2(false);
    // Fetch UIDs only if there are updated tags
    if (updatedTags.length >= 0) {
      const uids = await fetchUIDsAndUsernames(updatedTags || contributingTags.map((item) => item));

      // Update task with new contributingStaff UIDs
      setTask((prevTask) => ({
        ...prevTask,
        contributingStaff: uids,
      }));
    }
  };

  const handleRemoveTag = async (tag: string) => {
    const newTagas = taggedStaffTags.filter((item) => item !== tag);
    setTaggedStaffTags(newTagas);
    setShowResults(false);
    if (newTagas.length > 0) {
      const uids = await fetchUIDsAndUsernames(newTagas);

      //  Update task with new taggedStaff  UIDs
      setTask((prevTask) => ({
        ...prevTask,
        taggedStaff: uids,
      }));
    } else {
      setTask((prevTask) => ({
        ...prevTask,
        taggedStaff: [],
      }));
    }
  };

  const handleRemoveTag2 = async (tag: string) => {
    const newTagas = contributingTags.filter((item) => item !== tag);
    setContributingTags(newTagas);
    setShowResults2(false);
    //  Fetch UIDs only if there are updated tags
    if (newTagas.length > 0) {
      const uids = await fetchUIDsAndUsernames(newTagas);

      //  Update task with new contributingStaff UIDs
      setTask((prevTask) => ({
        ...prevTask,
        contributingStaff: uids,
      }));
    } else {
      setTask((prevTask) => ({
        ...prevTask,
        contributingStaff: [],
      }));
    }
  };

  const userCheckFn = async () => {
    return server?.memberList.some(
      (item) => item === userData?.uid && server?.memberList.length > 0
    );
  };

  // const fetchCreatedByDetails = async (uid: string) => {

  //   const createdByDetails = await fetchUsername(uid);

  //   const detailsToSet = createdByDetails || task?.createdBy;
  //   setCreatedByDetails(detailsToSet);
  //   return createdByDetails;
  // };
  // useEffect(() => {

  //   if (task?.createdBy) {
  //     fetchCreatedByDetails(task?.createdBy);
  //   }


  // }, [task?.createdBy])



  if (patientIdLoading && server) {
    return <p className=" text-center ">Loading...</p>;
  }



  return (
    <div>
      {server && !patientIdLoading && (
        <form className="p-1 xl:p-4 w-full rounded overflow-y-auto max-h-screen">
          <div className="flex flex-col gap-4">
            <div className=" relative">
              <div className="text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px] flex items-start sm:items-center border border-gray p-1 rounded-md">
                <label className="whitespace-nowrap mr-2 text-[#666666]">
                  Task Code:<span className="text-red-500">*</span>
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
              <div className="text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px] flex items-start sm:items-center border border-gray p-1 rounded-md">
                <label className="whitespace-nowrap mr-2 text-[#666666]">
                  Created by:<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="@ Username"
                  className={`flex-1 outline-none text-black ${selectedTask ? "cursor-default" : "cursor-default"
                    }`}
                  value={`@${task?.createdBy
                    }`}
                  onChange={(e) =>
                    setTask({ ...task, createdBy: userData?.uid })
                  }
                  required
                  readOnly
                />
              </div>
            </div>

            <div className="relative" ref={searchRef}>
              <div className="text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px] flex items-start sm:items-center border border-gray p-1 rounded-md">
                <label className="whitespace-nowrap mr-2 text-[#666666]">
                  Tag staff for help / Completion:<span className="text-red-500">*</span>
                </label>
                <div className="flex gap-x-3">
                  <div className="">
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
                  placeholder={`${taggedStaffTags.length === 0 ? "@ Username" : ""
                    }`}
                  className={`flex-1 outline-none text-black ml-1 ${selectedTask ? "cursor-default" : ""
                    }`}
                  value={`${selectedTask || task.isShared && taggedStaffTags.length === 0
                    ? task?.taggedStaff
                      ?.map((item: any) => `@${item}`)
                      .join(" ")
                    : searchUserName
                    }`}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^@\w*$/.test(value)) {
                      setSearchUserName(value);
                    }
                  }}
                  onFocus={() => setShowResults(true)}
                  readOnly={selectedTask || task.isShared}
                />
              </div>
              {showResults && serverUsers && !loading && !selectedTask && (
                <div className="absolute left-[7rem] sm:left-[11.25rem] md:left-[15.25rem] lg:left-[15.25rem] bg-white text-black shadow-lg rounded-lg mt-2 w-[4rem] sm:w-[6rem] lg:w-[8rem] max-h-60 overflow-y-auto z-50 bg-red-500 cursor-pointer text-[8px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px]">
                  {serverUsers.length > 0
                    ? serverUsers?.map((user) => (
                      <div key={user.uid} className="p-1 sm:p-1.5 lg:p-2 border-b">
                        <p
                          className="font-medium text-center"
                          onClick={() =>
                            handleTagClick(user?.uid, user?.userName)
                          }
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
                      <div className="p-2 text-gray-500 text-center">No user found</div>
                    )}
                </div>
              )}
            </div>

            <div className="relative" ref={searchRef2}>
              <div className="text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px] flex items-start sm:items-center border border-gray p-1 rounded-md">
                <label className="whitespace-nowrap mr-2 text-[#666666]">
                  Contributing Staff:{(task.isShared || task.isCompleted) && (
                    <span className="text-red-500">*</span>
                  )}
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
                  placeholder={`${contributingTags.length === 0 ? "@ Username" : ""
                    }`}
                  className={`flex-1 outline-none  text-black ml-1 ${selectedTask ? "cursor-default" : ""
                    }`}
                  value={`${selectedTask && contributingTags.length === 0
                    ? task?.contributingStaff
                      ?.map((item: any) => `@${item}`)
                      .join(" ")
                    : searchUserName2
                    }`}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^@\w*$/.test(value)) {
                      // Allow empty input or valid "@username" format
                      setSearchUserName2(value);
                    }
                  }}
                  onFocus={() => setShowResults2(true)}
                  readOnly={selectedTask}
                  required
                />
              </div>
              {showResults2 && serverUsers2 && !loading2 && !selectedTask && (
                <div className="absolute left-[4.5rem] sm:left-[7.25rem] md:left-[9.25rem] lg:left-[9.5rem] bg-white text-black shadow-lg rounded-lg mt-2 w-[4rem] sm:w-[6rem] lg:w-[8rem] max-h-60 overflow-y-auto z-50 cursor-pointer text-[8px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px]">
                  {serverUsers2.length > 0
                    ? serverUsers2?.map((user) => (
                      <div key={user.uid} className="p-2 border-b">
                        <p
                          className="font-medium"
                          onClick={() =>
                            handleTagClick2(user?.uid, user?.userName)
                          }
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
              <label className="block mb-1 text-[#666666] text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px]">
                {" "}
                Patient ID / Task Name / Instructions<span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder=""
                className={`resize-none text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px] w-full input-field border border-gray p-1 rounded-md text-black ${selectedTask || task.isShared || task.isCompleted
                  ? "outline-none cursor-default"
                  : ""
                  }resize-none`}
                value={task?.taskName}
                onChange={(e) => setTask({ ...task, taskName: e.target.value })}
                required
                readOnly={selectedTask || task.isShared || task.isCompleted}
                maxLength={2000}
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1 text-[#666666] text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px]">
                History{(task.isShared || task.isCompleted) && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <textarea
                placeholder=""
                className={`resize-none text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px] w-full input-field border border-gray p-1 rounded-md text-black ${selectedTask ? "outline-none cursor-default" : ""
                  }resize-none`}
                value={task?.history}
                onChange={(e) => setTask({ ...task, history: e.target.value })}
                required
                readOnly={selectedTask}
                maxLength={2000}
              />
            </div>
            <div className="flex gap-4 w-full">
              <div className="flex-1">
                <label className="block mb-1 text-[#666666] text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px]">
                  Examination{(task.isShared || task.isCompleted) && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <textarea
                  placeholder=""
                  className={`resize-none text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px] w-full border border-gray p-1 rounded-md text-black ${selectedTask ? "outline-none cursor-default" : ""
                    }resize-none`}
                  value={task?.examination}
                  onChange={(e) =>
                    setTask({ ...task, examination: e.target.value })
                  }
                  required
                  readOnly={selectedTask}
                  maxLength={2000}
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-[#666666] text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px]">
                  Diagnosis{(task.isShared || task.isCompleted) && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <textarea
                  placeholder=""
                  className={`resize-none text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px] w-full border border-gray p-1 rounded-md text-black ${selectedTask ? "outline-none cursor-default" : ""
                    }resize-none`}
                  value={task?.diagnosis}
                  onChange={(e) =>
                    setTask({ ...task, diagnosis: e.target.value })
                  }
                  required
                  readOnly={selectedTask}
                  maxLength={2000}
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block mb-1 text-[#666666] text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px]">
                Plan{(task.isShared || task.isCompleted) && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <textarea
                placeholder=""
                className={`resize-none text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px] w-full input-field border border-gray p-1 rounded-md text-black ${selectedTask ? "outline-none cursor-default" : ""
                  }resize-none`}
                value={task?.plan}
                onChange={(e) => setTask({ ...task, plan: e.target.value })}
                required
                readOnly={selectedTask}
                maxLength={2000}
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1 text-[#666666] text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px]">
                Follow Up{(task.isShared || task.isCompleted) && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <textarea
                placeholder=""
                className={`resize-none text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px] w-full input-field border border-gray p-1 rounded-md text-black ${selectedTask ? "outline-none cursor-default" : ""
                  }resize-none`}
                value={task?.followUp}
                onChange={(e) => setTask({ ...task, followUp: e.target.value })}
                required
                readOnly={selectedTask}
                maxLength={2000}
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1 text-[#666666] text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px]">
                Post Consultation{(task.isShared || task.isCompleted) && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <textarea
                placeholder=""
                className={`resize-none text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px] w-full input-field border border-gray p-1 rounded-md text-black ${selectedTask ? "outline-none cursor-default" : ""
                  }resize-none`}
                value={task?.postConsultation}
                onChange={(e) =>
                  setTask({ ...task, postConsultation: e.target.value })
                }
                required
                readOnly={selectedTask}
                maxLength={2000}
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1 text-[#666666] text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px]">
                Feedback{(task.isShared || task.isCompleted) && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <textarea
                placeholder=""
                className={`resize-none text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px] w-full input-field border border-gray p-1 rounded-md text-black ${selectedTask ? "outline-none cursor-default" : ""
                  }resize-none`}
                value={task?.feedback}
                onChange={(e) => setTask({ ...task, feedback: e.target.value })}
                required
                readOnly={selectedTask}
                maxLength={2000}
              />
            </div>
            <div className="flex gap-4 w-full">
              <div className="flex-1">
                <label className="block mb-1 text-[#666666] text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px]">
                  Key Learning Points
                </label>
                <textarea
                  placeholder="Enter why this task is being done"
                  className={`resize-none text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px] w-full border border-gray py-5 lg:py-10 px-2 text-center rounded-md text-black ${selectedTask ? "outline-none cursor-default" : ""
                    }resize-none`}
                  value={task?.keyLearningPoint}
                  onChange={(e) =>
                    setTask({ ...task, keyLearningPoint: e.target.value })
                  }
                  readOnly={selectedTask}
                  maxLength={2000}
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-[#666666] text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px]">
                  Action
                </label>
                <textarea
                  placeholder="Enter how this task should be done"
                  className={`resize-none text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px] w-full border border-gray py-5 lg:py-10 px-2 text-center rounded-md text-black ${selectedTask ? "outline-none cursor-default" : ""
                    }resize-none`}
                  value={task?.action}
                  onChange={(e) => setTask({ ...task, action: e.target.value })}
                  readOnly={selectedTask}
                  maxLength={2000}
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
              className={`text-[7px] sm:text-[12px] md:text-[14px] w-[15%] sm:w-[20%] md:w-[20%] lg:w-[15%] xl:w-[10%] btn-submit bg-[#68A86B] border border-[#68A86B] text-center text-white  py-1 px-1 sm:px-2 xl:px-5 rounded-md md:rounded-lg hover:bg-green-100 hover:text-black transition duration-300 ${task?.isShared || task?.isCompleted || task?.isDeleted
                ? "hidden"
                : "block"
                } ${selectedTask ||
                btnDisable ||
                (task.taggedStaff.length === 0 || !task.taskName) &&
                "bg-gray-400 hover:bg-gray-400 text-black border border-gray-400 cursor-not-allowed"
                } `}
              disabled={
                selectedTask || task.taggedStaff.length === 0 || btnDisable || !task.taskName
              }
            >
              Share
            </button>
            <label
              className={`text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px] block mb-2 text-black font-bold 
              }`}
            >
              <input
                type="checkbox"
                className={`mr-1 lg:mr-2 appearance-none h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4 border rounded-sm checked:bg-[#68A86B] checked:border-transparent focus:outline-none transition duration-200 relative checked:before:content-['✔'] checked:before:text-white checked:before:text-[8px] checked:before:top-[-3px] checked:before:left-[-2px]
                                    sm:checked:before:text-[10px] lg:checked:before:text-[14px] checked:before:absolute ${selectedTask && "cursor-default"
                  } ${!task.isShared && "cursor-not-allowed"
                  }`}
                checked={task?.Library}
                onChange={(e) =>
                  setTask({ ...task, Library: e.target.checked })
                }
                disabled={selectedTask || !task.isShared}
              />
              Library
            </label>
            <label
              className={`text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px] block mb-2 text-black font-bold ${task?.isShared || task?.isCompleted || task?.isDeleted
                ? "absolute right-0"
                : ""
                }`}
            >
              <input
                type="checkbox"
                className={`mr-1 lg:mr-2 appearance-none h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4 border rounded-sm checked:bg-[#68A86B] checked:border-transparent focus:outline-none transition duration-200 relative checked:before:content-['✔'] checked:before:text-white checked:before:text-[8px] checked:before:top-[-3px] checked:before:left-[-2px]
                                    sm:checked:before:text-[10px] lg:checked:before:text-[14px] checked:before:absolute ${selectedTask && "cursor-default"
                  }  ${!task.isShared && "cursor-not-allowed"
                  } `}
                checked={task?.Learn}
                onChange={(e) => setTask({ ...task, Learn: e.target.checked })}
                disabled={selectedTask || !task.isShared}
              />
              Learn
            </label>
          </div>
          <div className="flex mt-2 justify-center">
            <p className="text-[6px] sm:text-[11px] md:text-[13px] lg:text-[16px] text-[#797878]">
              Messages about task during supervision/collaboration
            </p>
          </div>
          <div className="flex mt-4 justify-center">
            <button
              type="button"
              onClick={handleComplete}
              className={`text-[7px] sm:text-[12px] md:text-[14px] md:text-[16px] w-[20%] sm:w-[20%] md:w-[20%] lg:w-[15%] xl:w-[15%] btn-submit ${task?.isCompleted || task?.isDeleted ? "hidden" : "block"
                } ${(selectedTask && btnDisable) ||
                (!task.isShared || !task.Learn
                  ? "cursor-not-allowed"
                  : "cursor-pointer")
                } ${!task?.isShared ||
                  !task.Learn ||
                  (userData &&
                    !task?.taggedStaff?.includes(userData?.userName) &&
                    !task.Learn)
                  ? "bg-gray-400 hover:bg-gray-400 hover:text-black border border-gray-400 cursor-not-allowed text-white"
                  : "bg-[#68A86B] border border-[#68A86B] text-center text-white"
                } py-1 px-1 sm:px-2 xl:px-5 rounded-md md:rounded-lg hover:text-black transition duration-300`}
              disabled={
                (selectedTask && btnDisable) || !task.isShared || !task.Learn
              }
            >
              Complete
            </button>
          </div>
        </form>
      )}

      {!server && (
        <div className="text-[8px] sm:text-[10px] md:text-[12px] xl:text-lg flex items-center justify-center px-4 py-1 text-black font-bold">
          {" "}
          Create or Select a server
        </div>
      )}
    </div>
  );
};

export default FormContainer;