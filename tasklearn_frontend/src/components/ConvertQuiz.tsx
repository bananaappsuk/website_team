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
import left from "../../src/assets/home/left.png";
import right from "../../src/assets/home/right.png";
import { getAuth } from 'firebase/auth';

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
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, boolean>>({});

    const handleClear = () => {
        if (!currentAnswer.trim()) {
            return; // Exit the function early
        }
        setScoreSuccess(false);
        setScoreError(true); // Activate the error state
        setTimeout(() => {
            setScoreSuccess(false);
            setScoreError(false); // Activate the error state
        }, 4000);
    };

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) {
                    return;
                }

                const token = await user.getIdToken();
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/server/${server?.serverId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
                setQuizzes(data);
                setLoading(false);
            } catch (error) {
                setError((error as Error).message);
                setLoading(false);
            }
        };

        const fetchQuizzes2 = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) {
                    return;
                }

                const token = await user.getIdToken();
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/server/${server?.serverId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await response.json();
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
        if (!currentAnswer.trim() || answeredQuestions[currentQuizIndex]) {
            return; // Exit if the answer is empty or the question is already answered
        }

        const isCorrect =
            currentAnswer.trim().toLowerCase() ===
            filteredQuizzes[currentQuizIndex]?.action.trim().toLowerCase();

        if (isCorrect) {
            setScore((prevScore) => prevScore + 1);
            setScoreSuccess(true);
            setScoreError(false);
        } else {
            setScoreError(true);
            setScoreSuccess(false);
        }

        setAnsweredQuestions((prev) => ({
            ...prev,
            [currentQuizIndex]: true, // Mark the current question as answered
        }));

        setQuestion((prevQuestion) => prevQuestion + 1);
        setIsAnswerSubmitted(true);

        setTimeout(() => {
            setScoreSuccess(false);
            setScoreError(false);
        }, 4000);
    };

    // Update button disabled state based on whether the question is answered
    const isCurrentQuestionAnswered = !!answeredQuestions[currentQuizIndex];

    const handleRevealAnswer = () => {
        setShowAnswer(true);
    };

    const fetchTaskById = async (taskId: string) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                return;
            }

            const token = await user.getIdToken();
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/task/${taskId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
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
        setCurrentAnswer("");

    };

    // Navigate to the next quiz
    const handleNextQuiz = () => {
        setSelectedQuizTaskId("");
        if (currentQuizIndex < quizzes.length - 1) {
            setCurrentQuizIndex(currentQuizIndex + 1);
            setShowAnswer(false);
        }
        setCurrentAnswer("");

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

    return (
        <div className="w-full bg-white relative overflow-y-auto max-h-screen p-1">
            <div className="my-1 lg:my-4 flex justify-between items-center">
                <div className="text-[8px] sm:text-[10px] md:text-[12px] lg:text-[16px] font-semibold flex-1">Quiz</div>
                <p className="text-[8px] sm:text-[10px] md:text-[12px] lg:text-[16px] font-semibold">
                    {filteredQuizzes[currentQuizIndex]?.createdAt instanceof Timestamp
                        ? filteredQuizzes[currentQuizIndex]?.createdAt
                            .toDate()
                            .toLocaleDateString()
                        : new Date(
                            filteredQuizzes[currentQuizIndex]?.createdAt
                        ).toLocaleDateString()}
                </p>
            </div>
            <div className=" flex justify-end mr-3 lg:mr-6">
                {filteredQuizzes[currentQuizIndex]?.Library && (
                    <Image src={goldStar} alt="Star" className="h-3 w-3 lg:h-4 lg:w-4 xl:h-6 xl:w-6" />
                )}
            </div>
            <main className="">
                <div className="lg:mt-4 mt-2 flex">
                    <div className="w-full flex-col">
                        <div className="bg-white rounded-md">
                            <h3 className="text-[8px] sm:text-[10px] md:text-[12px] lg:text-[16px] font-semibold text-black bg-[#E7E7E7] pl-2 py-1">
                                Key Learning Points
                            </h3>
                            <p className="text-[8px] sm:text-[10px] md:text-[12px] lg:text-[16px] w-full px-1 py-3 sm:px-2 sm:py-4 lg:px-10 lg:py-6 border font-bold text-center shadow-sm text-black">
                                {filteredQuizzes[currentQuizIndex]?.keyLearningPoint}
                            </p>
                        </div>

                        <div className="bg-white rounded-md mb-4">
                            <h3 className="text-[8px] sm:text-[10px] md:text-[12px] lg:text-[16px] font-semibold text-black bg-[#E7E7E7] pl-2 py-1">
                                Action
                            </h3>
                            <input
                                type="text"
                                placeholder="Enter Answer"
                                value={currentAnswer}
                                onChange={(e) => {
                                    setCurrentAnswer(e.target.value);
                                    setIsAnswerSubmitted(false);
                                }}
                                className={`text-[8px] sm:text-[10px] md:text-[12px] lg:text-[16px] w-full px-1 py-3 sm:px-2 sm:py-4 lg:px-10 lg:py-6 placeholder:text-[#67A76B] ${scoreError && "placeholder:text-[#b3835c] bg-[#eca794]"
                                    } text-center border shadow-sm text-black ${scoreSuccess && "placeholder:text-[#aedfb5] bg-[#d1f5d9]"
                                    }`}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-1 lg:mt-4 gap-8">
                    <button
                        className="text-red-600 flex items-center"
                        onClick={handleClear}
                    >
                        <span className="mr-1">
                            <Image src={clear} alt="clear" className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-7 lg:w-7 xl:h-9 xl:w-9" />
                        </span>
                    </button>
                    <button
                        onClick={handleAnswerSubmit}
                        disabled={isCurrentQuestionAnswered}
                        className={`text-green-600 flex items-center ${isCurrentQuestionAnswered ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        <span className="mr-1">
                            <Image src={submit} alt="submit" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 xl:h-10 xl:w-10" />
                        </span>
                    </button>
                </div>

                <div className="bg-white rounded-md my-2 lg:my-6">
                    <h3 className="text-[8px] sm:text-[10px] md:text-[12px] lg:text-[16px] font-semibold text-black bg-[#E7E7E7] pl-2 py-1">
                        Action
                    </h3>
                    {!showAnswer ? (
                        <button
                            className="text-[8px] sm:text-[10px] md:text-[12px] lg:text-[16px] text-[#67A76B] font-bold underline w-full px-1 py-3 sm:px-2 sm:py-4 lg:px-10 lg:py-6 border shadow-sm"
                            onClick={handleRevealAnswer}
                        >
                            CLICK TO REVEAL ANSWER
                        </button>
                    ) : (
                        <p className="text-[8px] sm:text-[10px] md:text-[12px] lg:text-[16px] text-black w-full font-bold text-center px-10 py-6 border shadow-sm">
                            Answer:
                            <span className="ml-1">{filteredQuizzes[currentQuizIndex]?.action}</span>
                        </p>
                    )}
                </div>
                <div className="flex justify-center mt-4 lg:mt-8 gap-8 lg:gap-40">
                    <button onClick={() => {
                        handlePrevQuiz();
                        setIsAnswerSubmitted(false); // Re-enable submit for the previous question
                    }} disabled={currentQuizIndex === 0}>
                        <span className="">
                            <Image src={left} alt="leftArrow" className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-5 lg:w-5 xl:h-7 xl:w-7" />
                        </span>
                    </button>
                    <button
                        onClick={() => {
                            handleNextQuiz();
                            setIsAnswerSubmitted(false); // Re-enable submit for the next question
                        }}
                        disabled={currentQuizIndex === filteredQuizzes.length - 1}
                    >
                        <span className="">
                            <Image src={right} alt="rightArrow" className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-5 lg:w-5 xl:h-7 xl:w-7" />
                        </span>
                    </button>
                </div>
                <div className="mt-4 text-[8px] sm:text-[10px] md:text-[12px] lg:text-[16px] mt-2 lg:mt-12 flex justify-center items-center font-bold lg:ml-4 xl:mr-[92px]">
                    <span className="w-48 text-right">Score:</span>
                    <input
                        className="w-4 lg:w-12 text-center border-2 border-gray-300 rounded-md ml-2"
                        value={score ?? 0}
                        readOnly
                    />{" "}
                    <p className="ml-2 lg:ml-2">/</p>
                    <input
                        className="w-4 lg:w-12 text-center border-2 border-gray-300 rounded-md ml-2"
                        value={`${question}`}
                        readOnly
                    />
                </div>
                <div className="text-[8px] sm:text-[10px] md:text-[12px] lg:text-[16px] mt-2 lg:mt-12 mt-2 lg:mt-4 flex justify-center items-center font-bold">
                    <span className="w-48 text-right">Total Questions:</span>
                    <input
                        className="w-4 lg:w-12 text-center border-2 border-gray-300 rounded-md ml-0 lg:ml-2"
                        value={filteredQuizzes.length}
                        readOnly
                    />
                </div>
            </main>
        </div>
    );
};

export default ConvertQuiz;