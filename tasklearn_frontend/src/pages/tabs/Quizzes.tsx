/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import Image from "next/image";
import clear from "../../assets/home/image 2.png";
import submit from "../../assets/home/image 1.png";
import deleteIcon from "../../assets/Quiz/Vector.png";
import searchIcon from "../../assets/Quiz/Group 1.png";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Timestamp } from "firebase/firestore";
import goldStar from "../../assets/Library/Vector (1).png";
import { getAuth } from 'firebase/auth';
import { toast } from "react-toastify";
import { useTask } from "@/components/TaskContext";

interface Quiz {
    _id: string;
    keyLearningPoint: string;
    action: string;
    Library: boolean;
    Learn: boolean;
    createdAt: Timestamp;
    createdBy: string;
    visibility: string;
    isSaved: boolean;
    taskId: string;
}

type UserData = {
    uid: any;
    email: string;
    userName: string;
    jobRole: string;
    profilePicUrl: string | undefined;
    jobsAndDescriptions?: string;
    careerAspirations?: string;
};

type Props = {
    userData: UserData | null;
    showQuiz?: boolean;
};

const Quizzes: React.FC<Props> = ({ userData, showQuiz = false }) => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [score, setScore] = useState<number>(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [showStar, setShowStar] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [visibilityData, setVisibilityData] = useState({
        visibility: "",
    });
    const [scoreSuccess, setScoreSuccess] = useState<boolean>(false);
    const [scoreError, setScoreError] = useState<boolean>(false);
    const [question, setQuestion] = useState<number>(0);
    const [reset, setReset] = useState<boolean>(false);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, boolean>>({});

  const { task, setTask} = useTask();

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
    
    const fetchQuizzes = async (preserveIndex = false) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
    
            if (!user) {
                return;
            }
            const token = await user.getIdToken();
            //console.log("Token",token)
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/contributing-staff/${userData?.uid}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
           // console.log("Fetching from:", `http://localhost:5000/api/quizzes/contributing-staff/${userData?.uid}`);

            if (!response.ok) {
                throw new Error("Failed to fetch quizzes");
            }
    
            const data = await response.json();
            console.log("Fetched contributing staff quizzes:", data);
    
            // Set the quizzes and filtered quizzes state
            setQuizzes(data);
            setFilteredQuizzes(data);
            setLoading(false);
    
            // Set visibility if present in the data
            if (data.length > 0 && data.slice().reverse()[currentQuizIndex]?.visibility) {
                setVisibilityData({
                    visibility: data.slice().reverse()[currentQuizIndex].visibility,
                });
            }
    
            if (!preserveIndex) {
                setCurrentQuizIndex(0);
            }
        } catch (error) {
            console.error("Error fetching contributing staff quizzes:", error);
            setError((error as Error).message);
            setLoading(false);
        }
    };
    
    useEffect(() => {
        console.log("User Data in Quizzes Component:", userData);
        fetchQuizzes();
    }, [userData]);
    
    useEffect(() => {
        if (filteredQuizzes[currentQuizIndex]?.visibility) {
            setVisibilityData({
                visibility: filteredQuizzes[currentQuizIndex].visibility,
            });
        }
    }, [filteredQuizzes, currentQuizIndex]);

    useEffect(() => {
        const filtered = quizzes
            .slice()
            .reverse()
            .filter(
                (quiz) =>
                    quiz.keyLearningPoint
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    quiz.action.toLowerCase().includes(searchTerm.toLowerCase())
            );
        setFilteredQuizzes(filtered);
        // setCurrentQuizIndex(0);
    }, [searchTerm, quizzes]);

    const handleDeleteQuiz = async (taskId: string) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                return;
            }

            const token = await user.getIdToken();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${taskId}`,

                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete quiz");
            }

            const updatedQuizzes = quizzes.filter((quiz) => quiz.taskId !== taskId);
            setQuizzes(updatedQuizzes);
            setFilteredQuizzes(updatedQuizzes);

            if (currentQuizIndex >= updatedQuizzes.length) {
                setCurrentQuizIndex(updatedQuizzes.length - 1);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error deleting quiz:", error);
            setError(error.message);
        }
    };

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

    const handlePrevQuiz = () => {
        if (currentQuizIndex > 0) {
            setCurrentQuizIndex(currentQuizIndex - 1);
            setShowAnswer(false);
        }
        setCurrentAnswer("");
    };

    // Navigate to the next quiz
    const handleNextQuiz = () => {
        if (currentQuizIndex < quizzes.length - 1) {
            setCurrentQuizIndex(currentQuizIndex + 1);
            setShowAnswer(false);
        }
        setCurrentAnswer("");
    };

    const handleReset = () => {
        // Check if the current question was answered correctly
        const isCorrect =
            currentAnswer.trim().toLowerCase() ===
            filteredQuizzes[currentQuizIndex]?.action.trim().toLowerCase();

        // Reset answered state for the current question
        setAnsweredQuestions((prev) => ({
            ...prev,
            [currentQuizIndex]: false, // Mark the current question as unanswered
        }));

        setCurrentAnswer(""); // Clear the current answer
        setIsAnswerSubmitted(false); // Allow submission again
        setShowAnswer(false); // Hide the revealed answer

        // Adjust the score and question count conditionally
        if (isCorrect) {
            setScore((prevScore) => {
                if (answeredQuestions[currentQuizIndex]) {
                    return Math.max(prevScore - 1, 0); // Ensure the score doesn't go below 0
                }
                return prevScore;
            });
            setQuestion((prevQuestion) => Math.max(prevQuestion - 1, 0)); // Ensure the question count doesn't go below 0
        }

        else {
            setQuestion((prevQuestion) => (answeredQuestions[currentQuizIndex] ? prevQuestion - 1 : prevQuestion));
        }
    };


    const handleVisibilityChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newVisibility = e.target.value;
        setVisibilityData({ visibility: newVisibility });
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                return;
            }

            const token = await user.getIdToken();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/visibility/${filteredQuizzes[currentQuizIndex]?._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ visibility: newVisibility }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (data) {
                    await fetchQuizzes(true);
                }
            }
        } catch (error) { }
    };


    if (loading) {
        return <div>Loading quizzes...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // If there are no quizzes, show a message
    if (quizzes.length === 0) {
        return <div className="text-[11px] sm:text-[14px] md:text-[16px] lg:text-[18px] xl:text-[20px] text-center items-center font-bold text-black mt-12">No quizzes available</div>;
    }





    return (
        <>
                <div className="w-full min-h-screen bg-white">
                    {!showQuiz && (
                        <div className="flex justify-end items-center">
                            {filteredQuizzes.length > 0 && (
                                <div className="ml-52 xl:ml-60 text-center font-bold flex-1 text-[14px] xl:text-[20px] hidden lg:block">Quiz Visible to</div>
                            )}
                            <div className="flex justify-end ml-auto relative">
                                <input
                                    type="text"
                                    placeholder="Search key words"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border-2 rounded-md px-3 pl-12 py-1 bg-gray-100 w-[80%]"
                                />
                                <Image
                                    src={searchIcon}
                                    alt="Search Icon"
                                    className="absolute left-16 top-1/2 transform -translate-y-1/2 w-4 h-4"
                                />
                            </div>
                        </div>
                    )}

                    {filteredQuizzes.length > 0 && (
                        <div className="py-4 sm:py-5 md:py-6 text-[12px] sm:text-[14px] md:text-[14px] text-center font-bold lg:hidden">Quiz Visible to</div>
                    )}


                    <main className="">
                        {filteredQuizzes.length === 0 ? (
                            <div className="text-[9px] sm:text-[12px] md:text-[14px] lg:text-[16px] xl:text-[16px] text-center items-center font-bold text-black mt-12">
                                No quizzes available
                            </div>
                        ) : (
                            <>
                                <div className="text-[7px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px] px-8 lg:px-28 lg:pt-8 pb-4 flex justify-between items-center">
                                    <div>
                                        <input
                                            type="radio"
                                            id="onlyMe"
                                            name="visibility"
                                            checked={visibilityData.visibility === "onlyMe"}
                                            value="onlyMe"
                                            onChange={handleVisibilityChange} />
                                        <label htmlFor="onlyMe" className="ml-2">
                                            Only Me
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            id="followers"
                                            name="visibility"
                                            value="followers"
                                            checked={visibilityData.visibility === "followers"}
                                            onChange={handleVisibilityChange} />
                                        <label htmlFor="followers" className="ml-2">
                                            Followers
                                        </label>
                                    </div>
                                    <div>
                                        <input
                                            type="radio"
                                            id="public"
                                            name="visibility"
                                            checked={visibilityData.visibility === "public"}
                                            value="public"
                                            onChange={handleVisibilityChange} />
                                        <label htmlFor="public" className="ml-2">
                                            Public
                                        </label>
                                    </div>
                                </div><div className="">
                                    <div className="text-sm text-black flex flex-row justify-between items-center gap-4">
                                        {searchTerm && (
                                            <div className="flex items-center justify-start font-bold">
                                                <span className="text-[7px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px]">Total Questions (Filtered):</span>
                                                <input
                                                    className="ml-2 w-8 sm:w-9 md:w-10 lg:w-11 xl:w-12 h-5 md:h-6 lg:h-7 xl:h-8 2xl:h-9 border-2 text-[7px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px] text-center border-gray-300 rounded-md"
                                                    value={filteredQuizzes.length}
                                                    readOnly />
                                            </div>
                                        )}
                                        
                                        <p className="flex items-center ml-auto gap-4 text-[7px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px]">
                                            {filteredQuizzes[currentQuizIndex]?.Library && (
                                                <Image src={goldStar} alt="Star" className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:h-6 xl:w-6" />
                                            )}

                                            {filteredQuizzes[currentQuizIndex]?.createdAt instanceof Timestamp
                                                ? filteredQuizzes[currentQuizIndex]?.createdAt
                                                    .toDate()
                                                    .toLocaleDateString()
                                                : new Date(
                                                    filteredQuizzes[currentQuizIndex]?.createdAt
                                                ).toLocaleDateString()}
                                        </p>

                                        <div className="relative group">
                                            <button
                                                className="p-2"
                                                onClick={() => handleDeleteQuiz(filteredQuizzes[currentQuizIndex]?.taskId)}
                                            >
                                                <Image src={deleteIcon} alt="Delete" className="w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:h-6 xl:w-6" />
                                            </button>
                                            <span className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                Delete Quiz
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex text-[7px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px]">
                                        <div className="w-full flex-col">
                                            <div className="bg-white rounded-md">
                                                <h3 className="font-semibold text-black bg-[#E7E7E7] pl-2 py-1">
                                                    Key Learning Points
                                                </h3>
                                                <p className="w-full px-10 py-6 border font-bold text-center shadow-sm text-black break-words">
                                                    {filteredQuizzes[currentQuizIndex]?.keyLearningPoint}
                                                </p>
                                            </div>

                                            <div className="bg-white rounded-md mb-4">
                                                <h3 className="font-semibold text-black bg-[#E7E7E7] pl-2 py-1">
                                                    Your Action
                                                </h3>
                                                <textarea
                                                    placeholder="Enter Answer"
                                                    value={currentAnswer}
                                                    onChange={(e) => {
                                                        setCurrentAnswer(e.target.value);
                                                        setIsAnswerSubmitted(false);
                                                    }}
                                                    maxLength={2000}
                                                    className={`w-full px-10 py-6 placeholder:text-[#67A76B] ${scoreError && "placeholder:text-[#b3835c] bg-[#eca794]"
                                                        } text-center border shadow-sm text-black ${scoreSuccess && "placeholder:text-[#aedfb5] bg-[#d1f5d9]"
                                                        }`}
                                                    style={{
                                                        resize: 'none',
                                                        overflowY: 'auto',
                                                    }} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-md my-6 text-[7px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px]">
                                        <h3 className="font-semibold text-black bg-[#E7E7E7] pl-2 py-1">
                                            Expected Action
                                        </h3>
                                        {!showAnswer ? (
                                            <button
                                                className="text-[#67A76B] font-bold underline w-full px-1 py-3 sm:px-2 sm:py-4 lg:px-10 lg:py-6 border shadow-sm"
                                                onClick={handleRevealAnswer}
                                            >
                                                CLICK TO REVEAL ANSWER
                                            </button>
                                        ) : (
                                            <p className="text-black w-full font-bold text-center px-10 py-6 border shadow-sm break-words">
                                                Answer: <span className="ml-1">{filteredQuizzes[currentQuizIndex]?.action}</span>
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-center mt-4 gap-8 text-[7px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px]">
                                        <button
                                            className="text-red-600 flex items-center"
                                            onClick={handleClear}
                                        >
                                            <span className="mr-1">
                                                <Image src={clear} alt="clear" className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:h-8 xl:w-8" />
                                            </span>
                                        </button>
                                        <button
                                            onClick={handleAnswerSubmit}
                                            disabled={isCurrentQuestionAnswered}
                                            className={`text-green-600 flex items-center ${isCurrentQuestionAnswered ? "opacity-50 cursor-not-allowed" : ""}`}
                                        >
                                            <span className="mr-1">
                                                <Image src={submit} alt="submit" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:h-10 xl:w-10" />
                                            </span>
                                        </button>
                                    </div>

                                    <div className="my-8 flex justify-center text-[7px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px]">
                                        <button className="bg-[#67A76B] px-4 py-1 rounded-lg text-white font-bold"
                                            onClick={handleReset}
                                        >
                                            Reset
                                        </button>
                                    </div>


                                    <div className="flex justify-center gap-40 text-[7px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px]">
                                        <button onClick={() => {
                                            handlePrevQuiz();
                                            setIsAnswerSubmitted(false); // Re-enable submit for the previous question
                                        }} disabled={currentQuizIndex === 0}
                                        >
                                            <FaArrowLeft size={24} className={`${currentQuizIndex === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-black'
                                                }`} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleNextQuiz();
                                                setIsAnswerSubmitted(false); // Re-enable submit for the next question
                                            }}
                                            disabled={currentQuizIndex === quizzes.length - 1 ||
                                                currentQuizIndex === filteredQuizzes.length - 1}
                                            className={`${currentQuizIndex === quizzes.length - 1 ||
                                                currentQuizIndex === filteredQuizzes.length - 1
                                                ? 'text-gray cursor-not-allowed'
                                                : 'text-blue'
                                                }`}
                                        >
                                            <FaArrowRight size={24} className={`${currentQuizIndex === quizzes.length - 1 ||
                                                currentQuizIndex === filteredQuizzes.length - 1
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-black'
                                                } `} />
                                        </button>
                                    </div>


                                    <div className="flex flex-col justify-center items-center mt-12 text-black flex flex-col text-[7px] sm:text-[10px] md:text-[12px] lg:text-[14px] xl:text-[16px]">
                                        <div className="flex justify-center items-center font-bold">
                                            <span className="text-right">Score:</span>
                                            <input
                                                className="w-12 text-center border-2 border-gray-300 rounded-md ml-2"
                                                value={score ?? 0}
                                                readOnly />{" "}
                                            <p className="ml-2">/</p>
                                            <input
                                                className="w-12 text-center border-2 border-gray-300 rounded-md ml-2"
                                                value={`${question}`}
                                                readOnly />
                                        </div>
                                        <div className="mt-4 flex justify-center items-center font-bold">
                                            <span className="text-right">Total Questions:</span>
                                            <input
                                                className="w-12 text-center border-2 border-gray-300 rounded-md ml-2"
                                                value={quizzes.length}
                                                readOnly />
                                        </div>
                                    </div>
                                </div></>
                        )}
                    </main>
                </div>
        </>
    );
};

export default Quizzes;