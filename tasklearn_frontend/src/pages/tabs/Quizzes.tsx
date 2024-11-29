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

    const fetchQuizzes = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${userData?.uid}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch quizzes");
            }
            const data = await response.json();
            console.log("Fetched quizzes:", data);
            setQuizzes(data);
            setFilteredQuizzes(data);
            setLoading(false);
            if (data.slice().reverse()[currentQuizIndex]?.visibility) {
                setVisibilityData({ visibility: data.slice().reverse()[currentQuizIndex].visibility });
            }
        } catch (error) {
            console.error("Error fetching quizzes:", error);
            setError((error as Error).message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

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
        setCurrentQuizIndex(0);
    }, [searchTerm, quizzes]);

    const handleDeleteQuiz = async (quizId: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quizId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete quiz");
            }

            const updatedQuizzes = quizzes.filter((quiz) => quiz._id !== quizId);
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

    const handleVisibilityChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newVisibility = e.target.value;
        setVisibilityData({ visibility: newVisibility });
        console.log("vis", newVisibility);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/visibility/${filteredQuizzes[currentQuizIndex]?._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ visibility: newVisibility }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (data) {
                    fetchQuizzes();
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
        return <div>No quizzes available</div>;
    }





    return (
        <>


            <div className="w-full min-h-screen bg-white">
                {!showQuiz && (
                    <div className="flex justify-end">
                        <div className="ml-auto relative">
                            <input
                                type="text"
                                placeholder="Search key words"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border-2 rounded-md px-3 pl-12 py-1 bg-gray-100"
                            />
                            <Image
                                src={searchIcon}
                                alt="Search Icon"
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                            />
                        </div>
                    </div>
                )}


                <main className="">
                    {filteredQuizzes.length === 0 ? (
                        <div className="text-[20px] text-center items-center font-bold text-black mt-12">
                            No quizzes available
                        </div>
                    ) : (
                        <>
                            <div className="my-4 flex justify-between items-center">
                                <div className="text-center font-bold flex-1 text-[20px]">Quiz Visible to</div>
                            </div>
                            <div className="px-28 pt-8 pb-4 flex justify-between items-center">
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
                                        <div className="flex justify-start font-bold">
                                            <span className="w-48">Total Questions (Filtered):</span>
                                            <input
                                                className="w-12 border-2 text-center border-gray-300 rounded-md"
                                                value={filteredQuizzes.length}
                                                readOnly />
                                        </div>
                                    )}



                                    <p className="flex ml-auto gap-4">
                                        {filteredQuizzes[currentQuizIndex]?.Library && (
                                            <Image src={goldStar} alt="Star" className="h-6 w-6" />
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
                                            onClick={() => handleDeleteQuiz(filteredQuizzes[currentQuizIndex]._id)}
                                        >
                                            <Image src={deleteIcon} alt="Delete" className="h-6 w-6" />
                                        </button>
                                        <span className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-600 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            Delete Quiz
                                        </span>
                                    </div>
                                </div>

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
                                                onChange={(e) => {
                                                    setCurrentAnswer(e.target.value);
                                                    setIsAnswerSubmitted(false);
                                                }}
                                                className={`w-full px-10 py-6 placeholder:text-[#67A76B] ${scoreError && "placeholder:text-[#b3835c] bg-[#eca794]"
                                                    } text-center border shadow-sm text-black ${scoreSuccess && "placeholder:text-[#aedfb5] bg-[#d1f5d9]"
                                                    }`} />
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
                                        disabled={isCurrentQuestionAnswered}
                                        className={`text-green-600 flex items-center ${isCurrentQuestionAnswered ? "opacity-50 cursor-not-allowed" : ""}`}
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
                                            Answer: {filteredQuizzes[currentQuizIndex]?.action}
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-center mt-8 gap-40">
                                    <button onClick={() => {
                                        handlePrevQuiz();
                                        setIsAnswerSubmitted(false); // Re-enable submit for the previous question
                                    }} disabled={currentQuizIndex === 0}>
                                        <FaArrowLeft size={24} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleNextQuiz();
                                            setIsAnswerSubmitted(false); // Re-enable submit for the next question
                                        }}
                                        disabled={currentQuizIndex === quizzes.length - 1 ||
                                            currentQuizIndex === filteredQuizzes.length - 1}
                                    >
                                        <FaArrowRight size={24} />
                                    </button>
                                </div>

                                <div className="mt-12 text-black flex flex-col">
                                    <div className="flex justify-center items-center font-bold mr-[140px]">
                                        <span className="w-48 text-right">Score:</span>
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
                                    <div className="mt-4 flex justify-center items-center font-bold mr-[44px]">
                                        <span className="w-48 text-right">Total Questions:</span>
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