/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useState } from "react";
import React from "react";
import Link from "next/link";
import CreateServerPopup from "../pages/server/CreateServerPopup";
import router from "next/router";
import { useTask } from "./TaskContext";
import { toast } from "react-toastify";
import { getAuth } from 'firebase/auth';

interface Server {
    _id: string;
    channelName: string;
    channelImage: string;
    channelType: string;
    createdByUserId: string;
    memberList: string[];
}

interface SidebarProfileProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userId: any;
    onServerSelect?: (server: { serverId: string; serverName: string; memberList: string[] }) => void;
    handleTasksClick: (arg: string) => void;
    setselectedTask: React.Dispatch<React.SetStateAction<boolean>>;
    taskCategories: string[];
    setDropdownVisible: React.Dispatch<React.SetStateAction<boolean[]>>;
    handleResetInputs: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFilteredTasks: React.Dispatch<React.SetStateAction<any[]>>;
}

const SidebarProfile: FC<SidebarProfileProps> = ({
    userId,
    onServerSelect,
    handleTasksClick,
    setselectedTask,
    taskCategories,
    setDropdownVisible,
    handleResetInputs,
    setFilteredTasks,
}) => {
    // Make sure to define userId in props
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [servers, setServers] = useState<Server[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState(true);
    const [isOpenServer, setIsOpenServer] = useState<boolean>(false);
    const { openServer } = router.query;
    const { selectedServerId, setSelectedServerId, fetchPatientId } = useTask();

    useEffect(() => {
        if (openServer !== undefined) {
            const shouldOpenServer = openServer === "true";
            setIsOpenServer(shouldOpenServer);
            if (shouldOpenServer) {
                router.replace(
                    {
                        pathname: router.pathname,
                        query: { ...router.query, openServer: "false" },
                    },
                    undefined,
                    { shallow: true }
                );
            }
        }
    }, [openServer]);

    useEffect(() => {
        if (isOpenServer) {
            setTimeout(() => {
                setIsPopupOpen(true);
                setIsOpenServer(false);
            }, 1000);
        }
    }, [isOpenServer]);

    useEffect(() => {
        const fetchServers = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) {
                    return;
                }

                const token = await user.getIdToken();
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/servers`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                const userServers = data.filter(
                    (server: Server) =>
                        server.createdByUserId === userId ||
                        server.memberList.includes(userId)
                );
                setServers(userServers); // Set the fetched server data to state
            } catch (error) {
                console.error("Error fetching servers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServers();
    }, [userId]);

    const handleServerClick = async (server: Server) => {
        if (router.pathname === "/Homepage") {
            setSelectedServerId(server._id);
            setFilteredTasks([{}]);
            handleResetInputs();
            setselectedTask(false);
            setDropdownVisible(Array(taskCategories.length).fill(false));
            onServerSelect &&
                onServerSelect({
                    serverId: server._id,
                    serverName: server.channelName,
                    memberList: server.memberList,
                });
            fetchPatientId(selectedServerId && selectedServerId);
        } else if (router.pathname === "/UserProfile") {
            setSelectedServerId(server._id);
            onServerSelect &&
                onServerSelect({
                    serverId: server._id,
                    serverName: server.channelName,
                    memberList: server.memberList,
                });
        }
    };

    return (
        <aside className="w-[7%] flex flex-col items-center space-y-4 px-4 sm:px-2 lg:px-3 xl:px-2 bg-white min-h-screen border">
            <div className="text-green-500 text-lg md:text-3xl font-bold"></div>
            <div className="flex flex-col space-y-4">
                {servers.map((server) => (
                    <div
                        key={server._id}
                        onClick={() => handleServerClick(server)}
                        className={`rounded-full overflow-hidden h-6 w-6 md:w-10 md:h-10 lg:w-16 lg:h-16 cursor-pointer ${selectedServerId === server._id ? "border-2 border-[#67A76B]" : ""
                            }`}
                    >
                        <img
                            src={server.channelImage}
                            alt="serverPic"
                            className="bg-cover object-cover w-full h-full rounded-full"
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={() => setIsPopupOpen(true)}
                className="pb-1 flex items-center justify-center h-6 w-6 md:w-10 md:h-10 lg:w-16 lg:h-16 bg-gray-300 rounded-full text-sm md:text-xl lg:text-3xl text-white"
            >
                +
            </button>
            {isPopupOpen && (
                <CreateServerPopup
                    onClose={() => setIsPopupOpen(false)}
                    userId={userId}
                    setselectedTask={setselectedTask}
                    onServerSelect={onServerSelect}
                /> // Pass userId here
            )}
        </aside>
    );
};

export default SidebarProfile;