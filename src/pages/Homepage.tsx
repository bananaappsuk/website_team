import React, { useEffect, useState } from 'react';
import "../../src/app/globals.css";
import TaskSharing from '@/components/TaskSharing';
import { User } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';


const HomePage = () => {
    const [user, setUser] = useState<User | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const [userData, setUserData] = useState<any>(null);  // Adjust type as needed
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        const fetchUserData = async (currentUser: User | null) => {
            try {
                setLoading(true);
                if (currentUser) {
                    setUser(currentUser);
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    if (userDoc.exists()) {
                        setUserData({
                            ...userDoc.data(),
                            uid: currentUser.uid, // Include UID in the userData state
                        });
                    } else {
                        setUser(null);
                        setUserData(null);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            fetchUserData(currentUser);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (router.pathname === "/Homepage") {
            localStorage.removeItem("activeLink");
        }
    }, [router.pathname]);

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
            </div>
        </>
    );
};

export default HomePage;