import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../auth';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router'; // Import useRouter

export default function CreateServer() {
    const [name, setName] = useState('');
    const { user } = useAuth();
    const router = useRouter(); // Initialize router

    const handleCreateServer = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/servers`, {
                name,
                createdBy: user?.uid,
            });
            toast.success(`Server created: ${response.data.name}`);
            router.push("/CreateChannel"); // Redirect to the new server page
        } catch (error) {
            console.error('Error creating server:', error);
            toast.error('Error creating server');
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Create a New Server</h1>
            <input
                className="border p-2 mt-4 w-full"
                placeholder="Server Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button
                className="bg-blue-500 text-white mt-4 p-2"
                onClick={handleCreateServer}
            >
                Create Server
            </button>
        </div>
    );
}
