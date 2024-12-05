/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import Image from "next/image";
import clear from "../assets/home/image 2.png";
import submit from "../assets/home/image 1.png";
import searchIcon from "../assets/Quiz/Group 1.png";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import goldStar from "../assets/Library/Vector (1).png";
import { db } from "../firebase";
import left from "../../src/assets/home/left.png";
import right from "../../src/assets/home/right.png";
import { toast } from "react-toastify";
import { getAuth } from 'firebase/auth';


interface Quiz {
    _id: string;
    keyLearningPoint: string;
    action: string;
    Library: boolean;
    Learn: boolean;
    createdAt: Timestamp;
    createdBy: string;
}
type UserData = {
    uid: any;
    email: string;
    userName: string;
    jobRole: string;
    profilePicUrl: string | undefined;
};
interface Follow {
    followeeId: string;
}
interface Props {
    fetchId: Follow[];
    otherUser: UserData | null;
}
const OtherProfileQuizzes: React.FC<Props> = ({ fetchId, otherUser }) => {
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
    const [userData, setUserData] = useState<UserData[]>([]);
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
                const combinedQuizzes: any[] = [];
                for (let idObj of fetchId) {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/feed/followers/${idObj.followeeId}`,
                        {
                            method: "GET", headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    if (!response.ok) {
                        throw new Error("Failed to fetch quizzes");
                    }
                    const data = await response.json();
                    combinedQuizzes.push(...data);
                }
                setQuizzes((prev) => deduplicateQuizzes([...prev, ...combinedQuizzes]));
                setFilteredQuizzes((prev) =>
                    deduplicateQuizzes([...prev, ...combinedQuizzes])
                );
            } catch (error) {
                console.error("Error fetching quizzes:", error);
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };
        if (fetchId.length > 0) {
            setLoading(true);
            fetchQuizzes();
        }
    }, [fetchId]);
    const fetchPublicQuizzes = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                return;
            }

            const token = await user.getIdToken();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/all/feed/public`,
                {
                    method: "GET", headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch quizzes");
            }
            const data = await response.json();
            const filteredData = data.filter(
                (item: any) => item.createdBy === otherUser?.uid
            );
            setQuizzes((prev) => deduplicateQuizzes([...prev, ...filteredData]));
            setFilteredQuizzes((prev) =>
                deduplicateQuizzes([...prev, ...filteredData])
            );
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        setLoading(true);
        fetchPublicQuizzes();
    }, []);
    useEffect(() => {
        const fetchUserDetails = async (userIds: string[]): Promise<UserData[]> => {
            if (userIds.length === 0) {
                return [];
            }
            const userDetails: UserData[] = [];
            for (const id of userIds) {
                const userDoc = await getDoc(doc(db, "users", id));
                if (userDoc.exists()) {
                    userDetails.push({ uid: id, ...userDoc.data() } as UserData);
                }
            }
            setUserData(userDetails);
            return userDetails;
        };
        if (filteredQuizzes.length > 0) {
            const userIds = filteredQuizzes.map((quiz) => quiz.createdBy);
            fetchUserDetails(userIds);
        }
    }, [filteredQuizzes]);
    const deduplicateQuizzes = (quizzes: Quiz[]) => {
        const seen = new Set();
        return quizzes.filter((quiz: any) => {
            const key = quiz._id; // Assuming each quiz has a unique ID
            if (seen.has(key)) {
                return false;
            }
            seen.add(key);
            return true;
        });
    };

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
    if (loading) {
        return <div className="text-[20px] text-center font-bold items-center mt-40 text-black">Loading quizzes...</div>;
    }

    if (quizzes.length === 0) {
        return <div className="text-[20px] text-center font-bold items-center my-20 lg:my-0 lg:mt-40 text-black">No quizzes available</div>;
    }

    return (
        <div className="w-full min-h-screen bg-white">
            <div className="my-4 flex justify-between items-center">
                {searchTerm && (
                    <div className="text-[7px] sm:text-[12px] md:text-[14px] xl:text-[16px] flex justify-start font-bold">
                        <span className="">Total Questions (Filtered):</span>
                        <input
                            className="ml-2 w-4 sm:w-6 md:w-8 lg:w-10 xl:w-12 border-2 text-center border-gray-300 rounded-md"
                            value={filteredQuizzes.length}
                            readOnly
                        />
                    </div>
                )}
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
            {filteredQuizzes.length === 0 && (
                <div className="text-[20px] text-center font-bold items-center text-black mt-12">
                    No quizzes available
                </div>
            )}
            {filteredQuizzes.length > 0 && (
                <main className="">
                    <div className="text-sm text-black flex items-center gap-4 ">
                        <div className="font-bold text-[16px] text-start">
                            <span className="">
                                {filteredQuizzes[currentQuizIndex]?.createdAt instanceof Timestamp
                                    ? filteredQuizzes[currentQuizIndex]?.createdAt
                                        .toDate()
                                        .toLocaleDateString()
                                    : new Date(
                                        filteredQuizzes[currentQuizIndex]?.createdAt
                                    ).toLocaleDateString()}
                            </span>
                        </div>
                        {filteredQuizzes[currentQuizIndex]?.Library && (
                            <Image src={goldStar} alt="Star" className="h-3 w-3 lg:h-4 lg:w-4 xl:h-6 xl:w-6" />
                        )}
                    </div>
                    <div className="mt-4 flex">
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
                                    Action
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
                                    }}
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
                            <p className="text-black w-full font-bold text-center px-10 py-6 border shadow-sm break-words">
                                Answer: <span className="ml-1">{filteredQuizzes[currentQuizIndex]?.action}</span>
                            </p>
                        )}
                    </div>
                    <div className="flex justify-center mt-8 gap-8 lg:gap-40">
                        <button onClick={() => {
                            handlePrevQuiz();
                            setIsAnswerSubmitted(false); // Re-enable submit for the previous question
                        }} disabled={currentQuizIndex === 0}>
                            <span className="">
                                <Image src={left} alt="leftArrow" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-6 lg:w-6 xl:h-7 xl:w-7" />
                            </span>
                        </button>
                        <button
                            onClick={() => {
                                handleNextQuiz();
                                setIsAnswerSubmitted(false); // Re-enable submit for the next question
                            }}
                            disabled={
                                currentQuizIndex === quizzes.length - 1 ||
                                currentQuizIndex === filteredQuizzes.length - 1
                            }
                        >
                            <span className="">
                                <Image src={right} alt="rightArrow" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-6 lg:w-6 xl:h-7 xl:w-7" />
                            </span>
                        </button>
                    </div>
                    <div className="mt-12 text-black flex flex-col">
                        <div className="flex justify-center items-center font-bold ml-4 mr-[140px]">
                            <span className="w-48 text-right">Score:</span>
                            <input
                                className="w-12 text-center border-2 border-gray-300 rounded-md ml-2"
                                value={score ?? 0}
                                readOnly
                            />{" "}
                            <p className="ml-2">/</p>
                            <input
                                className="w-12 text-center border-2 border-gray-300 rounded-md ml-2"
                                value={`${question}`}
                                readOnly
                            />
                        </div>
                        <div className="mt-4 flex justify-center items-center font-bold mr-[44px]">
                            <span className="w-48 text-right">Total Questions:</span>
                            <input
                                className="w-12 text-center border-2 border-gray-300 rounded-md ml-2"
                                value={filteredQuizzes.length}
                                readOnly
                            />
                        </div>
                    </div>
                </main>
            )}
        </div>
    );
};
export default OtherProfileQuizzes;