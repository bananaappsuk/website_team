import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Server {
    _id: string;
    channelName: string;
    createdByUserId: string;
}

const ServerDetail: FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [server, setServer] = useState<Server | null>(null);
    const [inviteLink, setInviteLink] = useState("");

    useEffect(() => {
        const fetchServer = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/servers/${id}`);
                if (!response.ok) {
                    throw new Error('Server not found');
                }
                const data = await response.json();
                setServer(data);
            } catch (error) {
                console.error("Error fetching server:", error);
            }
        };

        if (id) fetchServer();
    }, [id]);

    const generateInviteLink = () => {
        const link = `${window.location.origin}/join/${server?._id}`;
        setInviteLink(link);
    };


    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink);
        alert("Invite link copied to clipboard!");
    };

    return (
        <div className="container bg-white mx-auto p-6">
            {server ? (
                <div>
                    <h1 className="text-2xl font-bold">{server.channelName}</h1>
                    <button
                        onClick={generateInviteLink}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Generate Invite Link
                    </button>
                    {inviteLink && (
                        <div className="mt-4">
                            <input
                                type="text"
                                value={inviteLink}
                                readOnly
                                className="border p-2 w-full"
                            />
                            <button onClick={copyToClipboard} className="mt-2 px-4 py-2 bg-green-500 text-white rounded">
                                Copy Link
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ServerDetail;
