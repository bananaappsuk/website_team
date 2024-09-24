import React, { useEffect, useState } from 'react';
import "../../src/app/globals.css";
import TaskSharing from '@/components/TaskSharing';
import { User } from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'next/router';

const HomePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!loading && !user) {
            setRedirecting(true);
            const timer = setTimeout(() => {
                router.push('/signin');
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [loading, user, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (redirecting) {
        return <div>You are not logged in. Redirecting...</div>;
    }


    return (
        <>
            <div className="bg-gray-100 flex justify-start items-start gap-2 w-full min-h-screen">
                <TaskSharing />
                <p>text</p>
            </div>

        </>
    );
};

export default HomePage;