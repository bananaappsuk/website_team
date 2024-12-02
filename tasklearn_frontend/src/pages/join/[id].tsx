// pages/join/[id].tsx
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../../firebase";
import { getDoc, doc } from "firebase/firestore";
import { User } from "firebase/auth";
import { getAuth } from 'firebase/auth';
import { toast } from "react-toastify";

const JoinServer: FC = () => {
    type UserData = {
        uid: string;
        email: string;
        userName: string;
        jobRole: string;
        profilePicUrl: string | undefined;
    };

    const router = useRouter();
    const { id } = router.query;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [user, setUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Store the serverId in localStorage
        if (id) {
            localStorage.setItem("serverId", id as string);
        }
    }, [id]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));

                if (userDoc.exists()) {
                    setUserData({
                        ...(userDoc.data() as UserData),
                        uid: currentUser.uid,
                    });
                }
            } else {
                setUser(null);
                setUserData(null);
                router.push("/signin");
            }
            setLoading(false);
        });

        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const joinServer = async () => {
            if (id && userData) { // Ensure id and userData are both available
                try {
                    const auth = getAuth();
                    const user = auth.currentUser;

                    if (!user) {
                        toast.error("User is not authenticated");
                        return;
                    }

                    const token = await user.getIdToken();
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/servers/join`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, },
                        body: JSON.stringify({ serverId: id, userId: userData.uid }), // Pass userData.uid as userId
                    });

                    if (response.ok) {
                        localStorage.removeItem('serverId');
                        router.push(`/Homepage`);
                    } else {
                        const errorData = await response.json();
                        console.error("Failed to join the server:", errorData.message);
                    }
                } catch (error) {
                    console.error("Error joining server:", error);
                }
            }
        };

        if (id && userData) {
            joinServer();
        }
    }, [id, userData, router]); // Run only when id and userData are set

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-6">
            <p>Joining server...</p>
        </div>
    );
};

export default JoinServer;
