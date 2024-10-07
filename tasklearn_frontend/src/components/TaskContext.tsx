import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Task {
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
    setTask: React.Dispatch<React.SetStateAction<Task>>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [task, setTask] = useState<Task>({
        createdBy: '',
        taggedStaff: '',
        contributingStaff: '',
        taskName: '',
        history: '',
        examination: '',
        diagnosis: '',
        plan: '',
        followUp: '',
        postConsultation: '',
        feedback: '',
        keyLearningPoint: '',
        action: '',
        Library: false,
        Learn: false,
        isShared: false,
        isCompleted: false,
        isDeleted: false,
    });

    return (
        <TaskContext.Provider value={{ task, setTask }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTask = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTask must be used within a TaskProvider');
    }
    return context;
};
