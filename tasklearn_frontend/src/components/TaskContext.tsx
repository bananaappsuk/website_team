import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Task {
    [x: string]: any;
    createdBy: string;
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
}

export const TaskContext = createContext<TaskContextType | undefined>(
    undefined
);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [task, setTask] = useState<Task>({
        createdBy: "",
        taggedStaff: "",
        contributingStaff: "",
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
        <TaskContext.Provider value={{ task, setTask, jobRoleLists }}>
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