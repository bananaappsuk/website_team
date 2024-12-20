/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "../../firebase";
import axios from "axios";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import router from "next/router";
import { encryptData } from "../../utils/cryptoUtils";
import { getAuth } from 'firebase/auth';
interface Server {
    serverId: string;
    serverName: string;
    memberList: string[];
}
type UserData = {
    uid: string;
    email: string;
    userName: string;
    jobRole: string;
    profilePicUrl: string | undefined;
};
interface TrackingProps {
    selectedServer: Server | null;
    currentUserData: UserData | null;
}
const Tracking: React.FC<TrackingProps> = ({ selectedServer, currentUserData }) => {
    const [tasksList, setTasksList] = useState<[]>([]);
    const [allUsers, setAllUsers] = useState<UserData[]>([]);
    const [leaderboard, setLeaderboard] = useState<{
        [userName: string]: number;
    }>({});
    const [loading, setLoading] = useState<boolean>(true);
    //useEffect for fetch tasks
    useEffect(() => {
        fetchTasks();
    }, [selectedServer?.serverId]);

    const fetchTasks = async () => {
        setLoading(true)
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                return;
            }

            const token = await user.getIdToken();
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/server/${selectedServer?.serverId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data) {
                setTasksList(response.data);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Error on fetch tasks");
        }
        finally {
            setLoading(false)
        }
    };
    const allUserId = async () => {
        setLoading(true)
        try {
            const userDocs = await getDocs(collection(db, "users"));
            const users = userDocs.docs.map((doc) => {
                const data = doc.data() as UserData;
                return {
                    ...data,
                    uid: doc.id,
                };
            });
            setAllUsers(users.filter((user) => selectedServer?.memberList.includes(user?.uid)));
        } catch (error) {
            console.error("Error getting user data:", error);
        }
        finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        allUserId();
    }, []);
    useEffect(() => {
        if (tasksList.length === 0 || allUsers.length === 0) {
            setLeaderboard({});
            return;
        }
        const leaderboardData = allUsers.reduce((acc, user) => {
            const contributionCount = tasksList.reduce((count, task: any) => {
                return (
                    count +
                    task.contributingStaff.filter(
                        (staff: any) =>
                            staff === user.uid &&
                            !task.isDeleted &&
                            task.serverId === selectedServer?.serverId
                            && task.isCompleted
                    ).length
                );
            }, 0);
            if (contributionCount >= 0) {
                const key = `${user.userName}, ${user.jobRole}`;
                acc[key] = contributionCount;
            }
            return acc;
        }, {} as { [key: string]: number });
        setLeaderboard(leaderboardData);
    }, [tasksList, allUsers]);
    const handleProfile = async (data: string) => {
        const [userName] = data.split(",");
        try {
            const q = query(
                collection(db, "users"),
                where("userName", "==", userName)
            );
            const userDocs = await getDocs(q);
            const users = userDocs.docs.map((doc) => {
                const data = doc.data() as UserData;
                return { ...data, uid: doc.id };
            });
            if (users[0].uid !== currentUserData?.uid) {
                const encryptedUser = encryptData(users[0]);
                if (encryptedUser) {
                    sessionStorage.setItem("user", encryptedUser);
                    router.push("/OtherProfile");
                }
            } else {
                console.error("Failed to encrypt user data");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    return (
        <div className="flex flex-col items-center">
            <h1 className="font-bold text-[20px]">
                {selectedServer && selectedServer.serverName}
            </h1>
            <div className="grid grid-cols-2 gap-[2rem] items-center justify-center font-bold gap-x-[19rem] mt-[2.5rem] mb-8">
                <p>Number of pending tasks</p>
                <p className="w-[50px] h-[25px] border border-[#848181] flex justify-center">
                    {
                        tasksList.filter(
                            (task: {
                                isDeleted: boolean;
                                isShared: boolean;
                                serverId: string;
                            }) =>
                                task.isShared &&
                                task.serverId === selectedServer?.serverId &&
                                !task.isDeleted
                        ).length
                    }
                </p>
                <p>Number of completed tasks</p>
                <p className="w-[50px] h-[25px] border border-[#848181] flex justify-center">
                    {
                        tasksList.filter(
                            (task: {
                                isCompleted: boolean;
                                isDeleted: boolean;
                                serverId: string;
                            }) =>
                                task.isCompleted &&
                                task.serverId === selectedServer?.serverId &&
                                !task.isDeleted
                        ).length
                    }
                </p>
                <p>Number of learning tasks</p>
                <p className="w-[50px] h-[25px] border border-[#848181] flex justify-center">
                    {" "}
                    {
                        tasksList.filter(
                            (task: {
                                Learn: boolean;
                                serverId: string;
                                isDeleted: boolean;
                            }) =>
                                task.Learn &&
                                task.serverId === selectedServer?.serverId &&
                                !task.isDeleted
                        ).length
                    }
                </p>
            </div>
            <div className="rounded-md border border-gray-200 p-4 mt-4">
                <h1 className=" font-bold flex justify-center text-[20px] mt-4">
                    Top Contributors
                </h1>
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : (
                    <div className="overflow-y-auto max-h-screen mt-4">
                        {Object.entries(leaderboard)
                            .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
                            .map(([key, count]) => {
                                const [userName] = key.split(",");
                                return (
                                    <React.Fragment key={key}>
                                        <div className="mt-6 grid grid-cols-2 gap-[1rem] font-bold gap-x-[12rem]">
                                            <button
                                                className={`flex justify-start ${userName === currentUserData?.userName
                                                        ? "cursor-default"
                                                        : "cursor-pointer hover:underline"
                                                    }`}
                                                onClick={() => handleProfile(key)}
                                                disabled={userName === currentUserData?.userName}
                                            >
                                                {key}
                                            </button>
                                            <p className="ml-[60px] w-[50px] h-[25px] border border-[#848181] flex justify-center">
                                                {count}
                                            </p>
                                        </div>
                                        <div className="border border-gray-200 h-[1px] w-full my-4"></div>
                                    </React.Fragment>
                                );
                            })}
                        {Object.keys(leaderboard).length === 0 && !loading && (
                            <div className="mt-5">No contributors found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
export default Tracking;