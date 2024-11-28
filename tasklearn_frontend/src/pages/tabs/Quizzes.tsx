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
  const [question, setQuestion] = useState<number>(1);
  const [reset, setReset] = useState<boolean>(false);

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
        setVisibilityData({
          visibility: data.slice().reverse()[currentQuizIndex].visibility,
        });
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

  const handleDeleteQuiz = async (taskId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/${taskId}`,
        {
          method: "DELETE",
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
    if (
      currentAnswer.trim().toLowerCase() ===
      quizzes.slice().reverse()[currentQuizIndex]?.action.trim().toLowerCase()
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
    setCurrentAnswer("");
  };

  const handleRevealAnswer = () => {
    setShowAnswer(true);
  };

  const handlePrevQuiz = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1);
      setShowAnswer(false);
    }
  };

  // Navigate to the next quiz
  const handleNextQuiz = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setShowAnswer(false);
    }
  };

  const handleVisibilityChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newVisibility = e.target.value;
    setVisibilityData({ visibility: newVisibility });
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
    } catch (error) {}
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
      {!showQuiz && (
        <div className="px-28 pt-8 pb-4 flex justify-between items-center">
          <div>
            <input
              type="radio"
              id="onlyMe"
              name="visibility"
              checked={visibilityData.visibility === "onlyMe"}
              value="onlyMe"
              onChange={handleVisibilityChange}
            />
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
              onChange={handleVisibilityChange}
            />
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
              onChange={handleVisibilityChange}
            />
            <label htmlFor="public" className="ml-2">
              Public
            </label>
          </div>
        </div>
      )}

      <div className="w-full min-h-screen bg-white">
        <div className="my-4 flex justify-between items-center">
          <div className="text-center font-semibold flex-1">Quiz</div>
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

        <main className="">
          <div className="text-sm text-black flex flex-row justify-between items-center gap-4">
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

            <p className="ml-auto">
              Question created on:{" "}
              {filteredQuizzes[currentQuizIndex]?.createdAt instanceof Timestamp
                ? filteredQuizzes[currentQuizIndex]?.createdAt
                    .toDate()
                    .toLocaleDateString()
                : new Date(
                    filteredQuizzes[currentQuizIndex]?.createdAt
                  ).toLocaleDateString()}
            </p>

            {filteredQuizzes[currentQuizIndex]?.Library && (
              <Image src={goldStar} alt="Star" className="h-6 w-6" />
            )}

            <div className="relative group">
              <button
                className="p-2"
                onClick={() =>
                  handleDeleteQuiz(filteredQuizzes[currentQuizIndex]?.taskId)
                }
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
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  className={`w-full px-10 py-6 placeholder:text-[#67A76B] ${
                    scoreError && "placeholder:text-[#b3835c] bg-[#eca794]"
                  } text-center border shadow-sm text-black ${
                    scoreSuccess && "placeholder:text-[#aedfb5] bg-[#d1f5d9]"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-4 gap-8">
            <button
              className="text-red-600 flex items-center"
              onClick={() => setCurrentAnswer("")}
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
                Answer: {filteredQuizzes[currentQuizIndex]?.action}
              </p>
            )}
          </div>
          <div className="flex justify-center mt-8 gap-40">
            <button onClick={handlePrevQuiz} disabled={currentQuizIndex === 0}>
              <FaArrowLeft size={24} />
            </button>
            <button
              onClick={handleNextQuiz}
              disabled={
                currentQuizIndex === quizzes.length - 1 ||
                currentQuizIndex === filteredQuizzes.length - 1
              }
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
                value={quizzes.length}
                readOnly
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Quizzes;
