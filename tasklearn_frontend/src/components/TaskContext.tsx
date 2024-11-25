/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth, db } from "@/firebase";
import axios from "axios";
import { doc, getDoc } from "firebase/firestore";
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import { toast } from "react-toastify";
import { User } from "firebase/auth";

export interface Task {
    patientId: any;
    [x: string]: any;
    createdBy: any;
    serverId: string;
    taggedStaff: string;
    contributingStaff: string;
    taskName: string;
    history: string;
    examination: string;
    diagnosis: string;
    plan: string;
    followUp: string;
    postConsultation: string;
    feedback: string;
    keyLearningPoint: string;
    action: string;
    Library: boolean;
    Learn: boolean;
    isShared: boolean;
    isCompleted: boolean;
    isDeleted: boolean;
}

interface TaskContextType {
    task: Task;
    jobRoleLists: string[];
    setTask: React.Dispatch<React.SetStateAction<Task>>;
    fetchPatientId: any;
    updatePatientId: any;
    selectedServerId: string | null;
    setSelectedServerId: React.Dispatch<React.SetStateAction<string | null>>;
    patientIdLoading: boolean;
}

type UserData = {
    uid: any;
    email: string;
    userName: string;
    jobRole: string;
    profilePicUrl: string | undefined;
};

export const TaskContext = createContext<TaskContextType | undefined>(
    undefined
);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
    const [patientId, setPatientId] = useState<string | null>(null);
    const [patientIdLoading, setpatientIdLoading] = useState<boolean>(true);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);

    const fetchPatientId = async () => {
        setpatientIdLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/patientId/fetch/${selectedServerId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                const data = await response.json();

                if (data) {
                    const firstElement = data;

                    setPatientId(firstElement.patientId);

                    const patientId = firstElement.patientId;
                    if (patientId && userData) {
                        setTask((prevTask) => ({ ...prevTask, patientId, createdBy: userData.userName }));
                    }
                }
            }
        } catch (error: any) {
            toast.error(error);
        } finally {
            setpatientIdLoading(false);
        }
    };

    useEffect(() => {
        if (selectedServerId) {

            fetchPatientId();
        }
    }, [selectedServerId]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUser(user);
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    setUserData({
                        ...userDoc.data(),
                        uid: user.uid, // Include UID in the userData state
                    } as unknown as UserData);
                }
            } else {
                setUser(null);
                setUserData(null);
            }
            setLoading(false);
        });

        // Cleanup
        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);





    const updatePatientId = async () => {
        try {
            if (patientId) {
                const prefix = patientId.slice(0, patientId.search(/\d/));
                const numberPart = patientId.slice(prefix.length);
                const incrementedNumber = (parseInt(numberPart, 10) + 1)
                    .toString()
                    .padStart(numberPart.length, "0");

                const updatedPatientId = `${prefix}${incrementedNumber}`;

                if (updatedPatientId && selectedServerId) {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/patientId/update/${selectedServerId}`,
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ updatedPatientId }),
                        }
                    );

                    if (response.ok) {
                        fetchPatientId();
                    }
                }
            }
        } catch (error: any) {
            toast.error(error);
        }
    };



    useEffect(() => {
        const fetchTaskByServerId = async (serverId: string) => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/server/${serverId}`
                );
                if (response) {
                    setTask(response.data);
                }
            } catch (error: any) {
                toast.error(error.message);
            }
        };
        if (selectedServerId) {
            fetchTaskByServerId(selectedServerId);
        }
    }, [selectedServerId]);




    const [task, setTask] = useState<Task>({
        patientId: "",
        createdBy: "",
        taggedStaff: "",
        contributingStaff: "",
        serverId: "",
        taskName: "",
        history: "",
        examination: "",
        diagnosis: "",
        plan: "",
        followUp: "",
        postConsultation: "",
        feedback: "",
        keyLearningPoint: "",
        action: "",
        Library: false,
        Learn: false,
        isShared: false,
        isCompleted: false,
        isDeleted: false,
    });

    const jobRoleLists: string[] = [
        "Advanced clinical practitioner",
        "Assistant practice manager",
        "Care coordinator",
        "Clinical pharmacist",
        "Community paramedic",
        "Dietician",
        "General practice assistants",
        "General practitioner",
        "Health & wellbeing coach",
        "Healthcare support workers",
        "Nursing associate",
        "Occupational therapist",
        "Operations manager",
        "Other",
        "Pharmacy technician",
        "Phlebotomist",
        "Physician associate",
        "Physiotherapist",
        "Practice manager",
        "Practice nurse",
        "Receptionist",
        "Social prescriber",
        "Specialist mental health practitioner",
        "Healthcare Student",
    ];

    return (
        <TaskContext.Provider
            value={{
                task,
                setTask,
                jobRoleLists,
                fetchPatientId,
                updatePatientId,
                selectedServerId,
                setSelectedServerId,
                patientIdLoading,
            }}
        >
            {children}
        </TaskContext.Provider>
    );
};

export const useTask = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error("useTask must be used within a TaskProvider");
    }
    return context;
};