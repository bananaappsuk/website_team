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
  userId: string[];
}

const FeedQuizzes: React.FC<Props> = ({ fetchId, userId }) => {
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
  const [question, setQuestion] = useState<number>(1);
  const [reset, setReset] = useState<boolean>(false);
  const [saved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        if (fetchId.length > 0) {
          for (let idObj of fetchId) {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/feed/${idObj.followeeId}`,
              { method: "GET" }
            );
            if (!response.ok) {
              throw new Error("Failed to fetch quizzes");
            }
            const data = await response.json();
            setQuizzes(data);
            setFilteredQuizzes(data);
            setLoading(false);
          }
        } else {
          console.error("No followeeId available.");
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setError((error as Error).message);
        setLoading(false);
      }
    };

    const fetchPublicQuizzes = async () => {
      try {
        if (userId.length > 0) {
          for (let idObj of userId) {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/quizzes/feed/public/${idObj}`,
              { method: "GET" }
            );

            if (!response.ok) {
              throw new Error("Failed to fetch quizzes");
            }
            const data = await response.json();
            setQuizzes((prev) => [...prev, ...data]);

            setFilteredQuizzes((prev) => [...prev, ...data]);
            setLoading(false);
          }
        } else {
          console.error("No followeeId available.");
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setError((error as Error).message);
        setLoading(false);
      }
    };

    if (fetchId.length > 0) {
      fetchQuizzes();
    }

    if (userId.length > 0) {
      fetchPublicQuizzes();
    }
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
      <div className="my-4 flex justify-between items-center">
        <div className=" font-semibold">
          <div>
            Question created by :{" "}
            <span>{userData && userData[currentQuizIndex]?.userName}</span>,{" "}
            <span>{userData && userData[currentQuizIndex]?.jobRole}</span>{" "}
            <span className="ml-auto">
              {filteredQuizzes[currentQuizIndex]?.createdAt instanceof Timestamp
                ? filteredQuizzes[currentQuizIndex]?.createdAt
                    .toDate()
                    .toLocaleDateString()
                : new Date(
                    filteredQuizzes[currentQuizIndex]?.createdAt
                  ).toLocaleDateString()}
            </span>
          </div>
        </div>
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
        <div className="text-sm text-black flex flex-row justify-end items-center gap-4 ">
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

          {filteredQuizzes[currentQuizIndex]?.Library && (
            <Image src={goldStar} alt="Star" className="h-6 w-6 " />
          )}
        </div>
        <div className="relative group flex justify-end mt-7">
          <button
            className="p-2 px-7 rounded-md bg-[#68A86B] text-white"
            onClick={() => setIsSaved(!saved)}
          >
            {saved ? "saved" : "save"}
          </button>
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
              value={filteredQuizzes.length}
              readOnly
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default FeedQuizzes;
