/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';

interface CreateChannelProps {
    serverId: string;
    onSuccess: () => void;
}

export default function CreateChannel({ serverId, onSuccess }: CreateChannelProps) {
    const [channelName, setChannelName] = useState('');
    const router = useRouter();
    const { id: ServerId } = router.query; // Ensure serverId is retrieved correctly

    const handleCreateChannel = async () => {
        if (!ServerId) {
            toast.error('Server ID is undefined');
            return; // Prevents API call if serverId is undefined
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/servers/${ServerId}/channels`, {
                name: channelName,
            });
            toast.success(`Channel created: ${response.data.name}`);
            router.push("/CreateTaskInChannel"); // Redirect to the new channel page
        } catch (error) {
            console.error('Error creating channel:', error);
            toast.error('Error creating channel');
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Create a New Channel</h1>
            <input
                className="border p-2 mt-4 w-full"
                placeholder="Channel Name"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
            />
            <button
                className="bg-blue-500 text-white mt-4 p-2"
                onClick={handleCreateChannel}
            >
                Create Channel
            </button>
        </div>
    );
}
