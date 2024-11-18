/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import clear from "../../assets/home/image 2.png";
import submit from "../../assets/home/image 1.png";
import deleteIcon from "../../assets/Quiz/Vector.png";
import searchIcon from "../../assets/Quiz/Group 1.png";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Timestamp } from 'firebase/firestore';

interface Quiz {
    _id: string;
    keyLearningPoint: string;
    action: string;
    Library: boolean;
    Learn: boolean;
    createdAt: Timestamp;
}

const Quizzes = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [score, setScore] = useState<number | null>(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [showStar, setShowStar] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');


    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`);
                if (!response.ok) {
                    throw new Error('Failed to fetch quizzes');
                }
                const data = await response.json();
                console.log('Fetched quizzes:', data);
                setQuizzes(data);
                setFilteredQuizzes(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
                setError((error as Error).message);
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    useEffect(() => {
        const filtered = quizzes.filter((quiz) =>
            quiz.keyLearningPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.action.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredQuizzes(filtered);
        setCurrentQuizIndex(0);
    }, [searchTerm, quizzes]);

    const handleDeleteQuiz = async (quizId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${quizId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete quiz');
            }

            const updatedQuizzes = quizzes.filter((quiz) => quiz._id !== quizId);
            setQuizzes(updatedQuizzes);
            setFilteredQuizzes(updatedQuizzes);

            if (currentQuizIndex >= updatedQuizzes.length) {
                setCurrentQuizIndex(updatedQuizzes.length - 1);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Error deleting quiz:', error);
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
        if (currentAnswer.trim().toLowerCase() === quizzes[currentQuizIndex]?.action.trim().toLowerCase()) {
            setScore(1);
        } else {
            setScore(0);
        }
        setCurrentAnswer('');
    };

    const handleRevealAnswer = () => {
        setShowAnswer(true);
    };

    const handlePrevQuiz = () => {
        if (currentQuizIndex > 0) {
            setCurrentQuizIndex(currentQuizIndex - 1);
            setShowAnswer(false);
            setScore(null);
        }
    };



    // Navigate to the next quiz
    const handleNextQuiz = () => {
        if (currentQuizIndex < quizzes.length - 1) {
            setCurrentQuizIndex(currentQuizIndex + 1);
            setShowAnswer(false);
            setScore(null);
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

    return (
        <div className="w-full min-h-screen bg-white">
            <div className='my-4 flex justify-between items-center'>
                <div className="text-center font-semibold flex-1 pr-[10px]">
                    Quiz
                </div>
                <div className="ml-auto relative">
                    <input
                        type="text"
                        placeholder="Search key words"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-2 rounded-md px-3 pl-12 py-1 bg-gray-100 w-[100%] sm:w-[100%]"
                    />
                    <Image
                        src={searchIcon}
                        alt="Search Icon"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                    />
                </div>
            </div>

            <main className="">
                <div className="text-sm text-black flex flex-row justify-between items-center gap-4 ">
                    {searchTerm && (
                        <div className="flex justify-start font-bold">
                            <span className="w-48">Total Questions (Filtered):</span>
                            <input
                                className="w-12 border-2 text-center border-gray-300 rounded-md"
                                value={filteredQuizzes.length}
                                readOnly
                            />
                        </div>
                    )}

                    <p className='ml-auto '>Question created on: {
                        filteredQuizzes[currentQuizIndex]?.createdAt instanceof Timestamp
                            ? filteredQuizzes[currentQuizIndex]?.createdAt.toDate().toLocaleDateString()
                            : new Date(filteredQuizzes[currentQuizIndex]?.createdAt).toLocaleDateString()
                    }</p>

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


                <div className='mt-4 flex'>
                    <div className='w-full flex-col'>
                        <div className="bg-white rounded-md">
                            <h3 className="font-semibold text-black bg-[#E7E7E7] pl-2 py-1">Key Learning Points</h3>
                            <p className="w-full px-10 py-6 border font-bold text-center shadow-sm text-black">
                                {filteredQuizzes[currentQuizIndex]?.keyLearningPoint}
                            </p>
                        </div>

                        <div className="bg-white rounded-md mb-4">
                            <h3 className="font-semibold text-black bg-[#E7E7E7] pl-2 py-1">Action</h3>
                            <input
                                type="text"
                                placeholder="Enter Answer"
                                value={currentAnswer}
                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                className="w-full px-10 py-6 placeholder:text-[#67A76B] text-center border shadow-sm text-black"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-4 gap-8">
                    <button className="text-red-600 flex items-center" onClick={() => setCurrentAnswer('')}>
                        <span className="mr-1"><Image src={clear} alt="clear" className="h-8 w-8" /></span>
                    </button>
                    <button onClick={handleAnswerSubmit} className="text-green-600 flex items-center">
                        <span className="mr-1"><Image src={submit} alt="submit" className="h-10 w-10" /></span>
                    </button>
                </div>

                <div className="bg-white rounded-md my-6">
                    <h3 className="font-semibold text-black bg-[#E7E7E7] pl-2 py-1">Action</h3>
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
                    <button onClick={handlePrevQuiz} disabled={currentQuizIndex === 0}>
                        <FaArrowLeft size={24} />
                    </button>
                    <button onClick={handleNextQuiz} disabled={currentQuizIndex === quizzes.length - 1 ||
                        currentQuizIndex === filteredQuizzes.length - 1
                    }>
                        <FaArrowRight size={24} />
                    </button>
                </div>

                <div className="mt-12 text-black flex flex-col ">
                    <div className='flex justify-center items-center font-bold ml-4'>
                        <span className="w-35 text-center">Score:</span>
                        <input className="w-12 text-center border-2 border-gray-300 rounded-md ml-2" value={score ?? 0} readOnly /> /
                        <input className="w-12 text-center border-2 border-gray-300 rounded-md ml-2" value="1" />
                    </div>
                    <div className='mt-4 flex justify-center items-center font-bold'>
                        <span className="w-35 text-center">Total Questions:</span>
                        <input className="w-12 text-center border-2 border-gray-300 rounded-md ml-2" value={quizzes.length} readOnly />
                    </div>
                </div>




            </main>
        </div>
    );
};

export default Quizzes;
