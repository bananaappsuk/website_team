/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

interface CreateTaskInChannelProps {
    serverId: string; // Define the type for serverId
    channelId: string; // Define the type for channelId
}

export default function CreateTaskInChannel({ serverId, channelId }: CreateTaskInChannelProps) {
    const [taskName, setTaskName] = useState('');
    const router = useRouter();
    const { ServerId, ChannelId } = router.query;

    const handleCreateTask = async () => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/servers/${ServerId}/channels/${ChannelId}/tasks`,
                { taskName }
            );
            toast.success(`Task created: ${response.data.taskName}`);
            router.push("/Homepage");
        } catch (error) {
            console.error('Error creating task:', error);
            toast.error('Error creating task');
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Create a Task in Channel</h1>
            <input
                className="border p-2 mt-4 w-full"
                placeholder="Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
            />
            <button
                className="bg-blue-500 text-white mt-4 p-2"
                onClick={handleCreateTask}
            >
                Create Task
            </button>
        </div>
    );
}
