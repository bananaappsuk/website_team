/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import ImageServer from "../../../src/assets/home/image 3.png";
import ImageNext from "../../../src/assets/home/Vector1.png";
import uploadImage from "../../../src/assets/home/Group 4.png";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import { useTask } from "@/components/TaskContext";
import { getAuth } from 'firebase/auth';


interface Server {
    _id: string;
    channelName: string;
    channelImage: string;
    channelType: string;
    createdByUserId: string;
    memberList: string[];
}

interface CreateServerPopupProps {
    onClose: () => void;
    userId: string;
    setselectedTask: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SidebarProfileProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userId: any;
    onServerSelect?: (server: {
        serverId: string;
        serverName: string;
        memberList: string[];
    }) => void;
}

type CombinedProps = SidebarProfileProps & CreateServerPopupProps;

const CreateServerPopup: React.FC<CombinedProps> = ({
    onClose,
    userId,
    onServerSelect,
    setselectedTask,
}) => {
    const [step, setStep] = useState(1);
    const [serverName, setServerName] = useState("");
    const [serverType, setServerType] = useState(""); // Add missing serverType state
    const [channelType, setChannelType] = useState("");
    const [serverImage, setServerImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false); // Loading state for the create action
    const [channelId] = useState(`channel-${Date.now()}`); // Generate a unique channel ID
    const [servers, setServers] = useState<Server[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loadingServer, setLoadingServer] = useState(true);
    const [serverImageUpload, setServerImageUpload] = useState<string | null>(
        null
    );
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { selectedServerId, setSelectedServerId } = useTask();

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
                setLoadingServer(false);
            }
        };

        fetchServers();
    }, [userId]);

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (!file.type.startsWith("image/")) {
                toast.error("Please upload a valid image file.");
                return;
            }


            const imageUrl = URL.createObjectURL(file);
            setServerImageUpload(imageUrl); // Set the image URL for preview
            setServerImage(file); // Set the actual file for server upload
        }
    };

    const handleCreate = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const nameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{2,15}$/;

        if (!serverImage) {
            toast.error("Please select an image for your server");
            return;
        }

        if (!serverName) {
            toast.error("Please enter a name for your server");
            return;
        }

        if (!nameRegex.test(serverName)) {
            toast.error(
                "Server name must contain letters and may include numbers, and must be between 2 to 15 characters"
            );
            return;
        }

        const formData = new FormData();
        formData.append("channelName", serverName || "My Server");
        formData.append("channelType", channelType);
        formData.append("createdByUserId", userId);
        formData.append("serverImage", serverImage); // Use 'serverImage' to match the backend

        setLoading(true);

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
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (response.ok) {
                const data = await response.json();

                if (data) {
                    const sequenceNumber = 1;
                    const randomNumber =
                        Math.floor(Math.random() * 900) + 100;
                    const formattedSequenceNumber = sequenceNumber
                        .toString()
                        .padStart(4, "0");
                    const capitalizedUsername = serverName.slice(0, 3).toUpperCase();
                    const patientId = `TL${capitalizedUsername}${randomNumber}${formattedSequenceNumber}`;

                    const response2 = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/patientId/new`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ patientId, createdId: data._id }),
                        }
                    );

                    if (response2.ok) {
                        setStep(4);
                    }
                }
            }

            if (!response.ok) {
                throw new Error("Failed to create server");
            }
        } catch (error) {
            console.error("Error creating server:", error);
            toast.error("Error creating server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current?.click(); // Trigger the hidden file input when image is clicked
    };

    const handleClose = () => {
        onClose(); // Call the onClose prop
        window.location.reload();
    };

    return (
        <>
            <ToastContainer />
            <div className="fixed inset-[-60px] bg-gray-800 bg-opacity-75 flex justify-center items-center z-10 text-black">
                <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
                    <button
                        className="absolute top-2 right-2 text-black hover:text-gray-700 cursor-pointer"
                        onClick={onClose}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                    {step === 1 && (
                        <div className="">
                            <h2 className="text-xl font-bold mb-4 text-center">
                                Create your server
                            </h2>
                            <p className="mb-4 text-center">
                                Your server is where you and your friends hang out.
                            </p>
                            <div
                                onClick={() => {
                                    setServerType("custom");
                                    handleNext();
                                }}
                                className="cursor-pointer"
                            >
                                <div className="bg-gray-100 w-full rounded-md py-4 items-center flex">
                                    <Image
                                        src={ImageServer}
                                        alt="Img"
                                        className="float-left ml-5"
                                    />
                                    <div className="font-bold ml-5">Create My Own</div>
                                    <Image src={ImageNext} alt="Img" className="ml-auto mr-6" />
                                </div>
                            </div>
                            <div className="mt-6">Recently added</div>

                            {servers.map((server) => (
                                <div
                                    key={server._id}
                                    className="mt-2 cursor-pointer"
                                    onClick={() =>
                                        onServerSelect &&
                                        onServerSelect({
                                            serverId: server._id,
                                            serverName: server.channelName,
                                            memberList: server.memberList,
                                        })
                                    }
                                >
                                    <div
                                        className={`w-full rounded-md py-4 items-center mb-4 flex ${server.channelName === "SpecialChannel"
                                            ? "bg-blue-200"
                                            : "bg-gray-100"
                                            }`}
                                        onClick={() => {
                                            onClose();
                                            setselectedTask(false);
                                            setSelectedServerId(server._id);
                                            onServerSelect &&
                                                onServerSelect({
                                                    serverId: server._id,
                                                    serverName: server.channelName,
                                                    memberList: server.memberList,
                                                });
                                        }}
                                    >
                                        <Image
                                            src={ImageServer}
                                            alt="Img"
                                            className="float-left ml-5"
                                        />
                                        <div className="font-bold ml-5">
                                            <h2
                                                className={`text-lg font-bold ${server.channelName === "SpecialChannel"
                                                    ? "text-blue-700"
                                                    : "text-black"
                                                    }`}
                                            >
                                                {server.channelName}
                                            </h2>
                                        </div>
                                        <Image src={ImageNext} alt="Img" className="ml-auto mr-6" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {step === 2 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-center">
                                Tell us more about your sever
                            </h2>
                            <p className="mb-4 text-center">
                                In order to help you with your setup, is your new server for
                                just a few friends or a larger community?{" "}
                            </p>
                            <div
                                onClick={() => {
                                    setChannelType("friends");
                                    handleNext();
                                }}
                                className="cursor-pointer"
                            >
                                <div className="bg-gray-100 w-full rounded-md py-4 items-center flex">
                                    <Image
                                        src={ImageServer}
                                        alt="Img"
                                        className="float-left ml-5"
                                    />
                                    <div className="font-bold ml-5">For me and my followers</div>
                                    <Image src={ImageNext} alt="Img" className="ml-auto mr-6" />
                                </div>
                            </div>
                            <div
                                onClick={() => {
                                    setChannelType("community");
                                    handleNext();
                                }}
                                className="mt-4 cursor-pointer"
                            >
                                <div className="bg-gray-100 w-full rounded-md py-4 items-center flex">
                                    <Image
                                        src={ImageServer}
                                        alt="Img"
                                        className="float-left ml-5"
                                    />
                                    <div className="font-bold ml-5">For my team</div>
                                    <Image src={ImageNext} alt="Img" className="ml-auto mr-6" />
                                </div>
                            </div>
                            <button type="button" onClick={handleBack} className="mt-8 cursor-pointer">
                                Back
                            </button>
                        </div>
                    )}
                    {step === 3 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-center">
                                Customize Your Server
                            </h2>
                            <p className="mb-4 text-center">
                                In order to help you with your setup, is your new server for
                                just a few friends or a larger community?
                            </p>
                            <div
                                className="w-full rounded-md py-8"
                            >
                                {serverImageUpload ? (
                                    <Image
                                        src={serverImageUpload}
                                        onClick={handleImageClick}
                                        alt="Uploaded Preview"
                                        className="bg-center bg-no-repeat w-32 h-32 object-cover rounded-md mx-auto cursor-pointer"
                                        width={32}
                                        height={32}
                                    />
                                ) : (
                                    <Image
                                        src={uploadImage}
                                        onClick={handleImageClick}
                                        alt="Upload"
                                        className="bg-center bg-no-repeat w-32 h-32 object-cover rounded-md mx-auto cursor-pointer"
                                    />
                                )}
                            </div>

                            {/* Hidden file input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            <label className="block text-black font-semibold">
                                Server Name
                            </label>
                            <input
                                type="text"
                                value={serverName}
                                onChange={(e) => setServerName(e.target.value)}
                                className="w-full mt-2 px-2 py-4 border bg-[#F3F1F1] rounded-lg"
                                minLength={2}
                                maxLength={15}
                            />

                            <div className="mt-6 flex items-center">
                                <div onClick={handleBack} className="cursor-pointer">
                                    Back
                                </div>
                                <button
                                    onClick={handleCreate}
                                    className="ml-auto w-[30%] btn-submit bg-[#68A86B] border border-[#68A86B] text-white py-3 px-7 rounded-md hover:bg-green-100 hover:text-black transition duration-300 float-right"
                                >
                                    {loading ? "Creating..." : "Create"}
                                </button>
                            </div>
                        </div>
                    )}
                    {step === 4 && (
                        <div>
                            <h2 className="text-xl font-bold text-center">
                                Server Created Successfully!
                            </h2>
                            <div className="flex justify-center">
                                <button
                                    onClick={handleClose}
                                    className="mt-4 w-[20%] py-2 bg-[#68A86B] text-white rounded hover:bg-green-100 hover:text-black border border-[#68A86B]"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CreateServerPopup;