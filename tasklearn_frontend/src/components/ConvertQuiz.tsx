/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import Image from "next/image";
import clear from "../assets/home/image 2.png";
import submit from "../assets/home/image 1.png";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Timestamp } from "firebase/firestore";
import goldStar from "../assets/Library/Vector (1).png";
import axios from "axios";
import { toast } from "react-toastify";
import { useTask } from "../components/TaskContext";

interface Quiz {
    _id: string;
    keyLearningPoint: string;
    action: string;
    Library: boolean;
    Learn: boolean;
    createdAt: Timestamp;
    serverId: string;
    createdBy: string;
    taskId: string;
}

interface TaskSectionProps {
    server: { serverId: string; serverName: string; memberList: string[] } | null;
    selectedQuizTaskId: string;
    setShowQuiz: React.Dispatch<React.SetStateAction<boolean>>;
    showQuiz: boolean;
    setSelectedQuizTaskId: React.Dispatch<React.SetStateAction<string>>;
}

const ConvertQuiz: React.FC<TaskSectionProps> = ({
    server,
    selectedQuizTaskId,
    setShowQuiz,
    showQuiz,
    setSelectedQuizTaskId,
}) => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const { task, setTask } = useTask();
    const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [score, setScore] = useState<number>(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [showStar, setShowStar] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scoreSuccess, setScoreSuccess] = useState<boolean>(false);
    const [scoreError, setScoreError] = useState<boolean>(false);
    const [question, setQuestion] = useState<number>(0);

    const handleClear = () => {
        setCurrentAnswer("");
        setScoreError(true); // Activate the error state
        setScoreSuccess(false); // Change background color to red
    };

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/server/${server?.serverId}`,
                    {
                        method: "GET",
                    }
                );
                const data = await response.json();
                console.log("Fetched quizzes:", data);
                setQuizzes(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
                setError((error as Error).message);
                setLoading(false);
            }
        };

        const fetchQuizzes2 = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/server/${server?.serverId}`,
                    {
                        method: "GET",
                    }
                );
                const data = await response.json();
                console.log("Fetched2 quizzes:", data);
                setQuizzes(data);
                setFilteredQuizzes(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching quizzes:", error);
                setError((error as Error).message);
                setLoading(false);
            }
        };
        if (selectedQuizTaskId) {
            fetchQuizzes();
        } else if (selectedQuizTaskId === "") {
            fetchQuizzes2();
        }
    }, []);

    useEffect(() => {
        if (selectedQuizTaskId && showQuiz) {
            const filtered = quizzes.filter(
                (quiz) => quiz.taskId === selectedQuizTaskId
            );
            setFilteredQuizzes(filtered);
            if (filtered.length > 0) {
                const Newfiltered = quizzes.filter(
                    (quiz) => quiz.taskId !== selectedQuizTaskId
                );
                setFilteredQuizzes([...filtered, ...Newfiltered]);
                setCurrentQuizIndex(0);
                setShowQuiz(true);
            }
        }
    }, [selectedQuizTaskId, showQuiz, quizzes]);

    useEffect(() => {
        if (selectedQuizTaskId === "") {
            const filtered = quizzes
                .slice()
                .reverse()
                .filter((quiz) => quiz);

            setFilteredQuizzes(filtered);
            setCurrentQuizIndex(0);
        }
    }, [quizzes]);


    useEffect(() => {
        if (filteredQuizzes[currentQuizIndex]?.Library) {
            setShowStar(true);
        } else {
            setShowStar(false);
        }
    }, [currentQuizIndex, filteredQuizzes]);

    const handleAnswerSubmit = () => {
        if (
            currentAnswer.trim().toLowerCase() ===
            filteredQuizzes[currentQuizIndex]?.action.trim().toLowerCase()
        ) {
            setScore((prevScore) => prevScore + 1);
            setScoreSuccess(true);
            setScoreError(false);
            setQuestion((prevQuestion) => prevQuestion + 1);
        } else {
            setScoreError(true);
            setScoreSuccess(false);
            setQuestion((prevQuestion) => prevQuestion + 1);
        }
        setTimeout(() => {
            setScoreSuccess(false);
            setScoreError(false);
        }, 2000);
        setCurrentAnswer("");
    };

    const handleRevealAnswer = () => {
        setShowAnswer(true);
    };

    const fetchTaskById = async (taskId: string) => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/task/${taskId}`
            );

            if (response) {
                setTask(response.data);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (filteredQuizzes[currentQuizIndex]) {
            fetchTaskById(filteredQuizzes[currentQuizIndex].taskId);
        }
    }, [currentQuizIndex]);

    const handlePrevQuiz = () => {
        setSelectedQuizTaskId("");
        if (currentQuizIndex > 0) {
            setCurrentQuizIndex(currentQuizIndex - 1);
            setShowAnswer(false);
        }
    };

    // Navigate to the next quiz
    const handleNextQuiz = () => {
        setSelectedQuizTaskId("");
        if (currentQuizIndex < quizzes.length - 1) {
            setCurrentQuizIndex(currentQuizIndex + 1);
            setShowAnswer(false);
        }
    };

    if (loading) {
        return <div>Loading quizzes...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // If there are no quizzes, show a message
    if (quizzes.length === 0) {
        return <div>No quizzes available</div>;
    }
    console.log(currentQuizIndex);

    return (
        <div className="w-full bg-white relative overflow-y-auto max-h-screen">
            <div className="my-4 flex justify-between items-center">
                <div className=" font-semibold flex-1">Quiz</div>
                <p className="">
                    {filteredQuizzes[currentQuizIndex]?.createdAt instanceof Timestamp
                        ? filteredQuizzes[currentQuizIndex]?.createdAt
                            .toDate()
                            .toLocaleDateString()
                        : new Date(
                            filteredQuizzes[currentQuizIndex]?.createdAt
                        ).toLocaleDateString()}
                </p>
            </div>
            <div className=" flex justify-end mr-7">
                {filteredQuizzes[currentQuizIndex]?.Library && (
                    <Image src={goldStar} alt="Star" className="h-6 w-6" />
                )}
            </div>
            <main className="">
                <div className="mt-4 flex">
                    <div className="w-full flex-col">
                        <div className="bg-white rounded-md">
                            <h3 className="font-semibold text-black bg-[#E7E7E7] pl-2 py-1">
                                Key Learning Points
                            </h3>
                            <p className="w-full px-10 py-6 border font-bold text-center shadow-sm text-black">
                                {filteredQuizzes[currentQuizIndex]?.keyLearningPoint}
                            </p>
                        </div>

                        <div className="bg-white rounded-md mb-4">
                            <h3 className="font-semibold text-black bg-[#E7E7E7] pl-2 py-1">
                                Action
                            </h3>
                            <input
                                type="text"
                                placeholder="Enter Answer"
                                value={currentAnswer}
                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                className={`w-full px-10 py-6 placeholder:text-[#67A76B] ${scoreError && "placeholder:text-[#b3835c] bg-[#eca794]"
                                    } text-center border shadow-sm text-black ${scoreSuccess && "placeholder:text-[#aedfb5] bg-[#d1f5d9]"
                                    }`}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-4 gap-8">
                    <button
                        className="text-red-600 flex items-center"
                        onClick={handleClear}
                    >
                        <span className="mr-1">
                            <Image src={clear} alt="clear" className="h-8 w-8" />
                        </span>
                    </button>
                    <button
                        onClick={handleAnswerSubmit}
                        className="text-green-600 flex items-center"
                    >
                        <span className="mr-1">
                            <Image src={submit} alt="submit" className="h-10 w-10" />
                        </span>
                    </button>
                </div>

                <div className="bg-white rounded-md my-6">
                    <h3 className="font-semibold text-black bg-[#E7E7E7] pl-2 py-1">
                        Action
                    </h3>
                    {!showAnswer ? (
                        <button
                            className="text-[#67A76B] font-bold underline w-full px-10 py-6 border shadow-sm"
                            onClick={handleRevealAnswer}
                        >
                            CLICK TO REVEAL ANSWER
                        </button>
                    ) : (
                        <p className="text-black w-full font-bold text-center px-10 py-6 border shadow-sm">
                            Answer:
                            {filteredQuizzes[currentQuizIndex]?.action}
                        </p>
                    )}
                </div>
                <div className="flex justify-center mt-8 gap-40">
                    <button onClick={handlePrevQuiz} disabled={currentQuizIndex === 0}>
                        <FaArrowLeft size={24} />
                    </button>
                    <button
                        onClick={handleNextQuiz}
                        disabled={currentQuizIndex === filteredQuizzes.length - 1}
                    >
                        <FaArrowRight size={24} />
                    </button>
                </div>

                <div className="mt-12 text-black flex flex-col">
                    <div className="flex justify-center items-center font-bold ml-4">
                        <span className="w-48 text-right">Score:</span>
                        <input
                            className="w-12 text-center border-2 border-gray-300 rounded-md ml-2"
                            value={score ?? 0}
                            readOnly
                        />{" "}
                        /
                        <input
                            className="w-12 text-center border-2 border-gray-300 rounded-md ml-2"
                            value={`${question}`}
                        />
                    </div>
                    <div className="mt-4 flex justify-center items-center font-bold">
                        <span className="w-48 text-right">Total Questions:</span>
                        <input
                            className="w-12 text-center border-2 border-gray-300 rounded-md ml-2"
                            value={filteredQuizzes.length}
                            readOnly
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ConvertQuiz;