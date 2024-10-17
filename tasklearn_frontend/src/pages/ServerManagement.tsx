import { useState } from 'react';
import CreateServer from './CreateServer';
import CreateChannel from './CreateChannel';
import CreateTaskInChannel from './CreateTaskInChannel';
import { useRouter } from 'next/router';

export default function ServerManagement() {
    const [currentStep, setCurrentStep] = useState<'server' | 'channel' | 'task'>('server');
    const router = useRouter();
    const { serverId, channelId } = router.query; // Get serverId and channelId from URL

    const handleCreateServerSuccess = () => {
        setCurrentStep('channel'); // Move to channel creation after success
    };

    const handleCreateChannelSuccess = () => {
        setCurrentStep('task'); // Move to task creation after success
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Server Management</h1>
            {currentStep === 'server' && (
                <CreateServer onSuccess={handleCreateServerSuccess} />
            )}
            {currentStep === 'channel' && (
                <CreateChannel serverId={serverId} onSuccess={handleCreateChannelSuccess} />
            )}
            {currentStep === 'task' && (
                <CreateTaskInChannel serverId={serverId} channelId={channelId} />
            )}
            <div className="mt-4">
                <button className="bg-gray-300 p-2" onClick={() => setCurrentStep('server')}>
                    Back to Create Server
                </button>
                <button className="bg-gray-300 p-2" onClick={() => setCurrentStep('channel')}>
                    Back to Create Channel
                </button>
                <button className="bg-gray-300 p-2" onClick={() => setCurrentStep('task')}>
                    Back to Create Task
                </button>
            </div>
        </div>
    );
}
