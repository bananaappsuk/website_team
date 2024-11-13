import React from 'react'

const Quiz = () => {
    return (
        <div></div>
    )
}

export default Quiz
// import React, { useEffect, useState } from 'react';
// import Image from 'next/image';
// import clear from "../../src/assets/home/image 2.png";
// import submit from "../../src/assets/home/image 1.png";
// import star from "../../src/assets/home/Vector.png";

// interface Task {
//     createdBy: string;
//     taggedStaff: string;
//     contributingStaff: string;
//     taskName: string;
//     history: string;
//     examination: string;
//     diagnosis: string;
//     plan: string;
//     followUp: string;
//     postConsultation: string;
//     feedback: string;
//     keyLearningPoint: string;
//     action: string;
//     Library: boolean;
//     Learn: boolean;
// }

// interface QuizProps {
//     task: Task;
// }

// const Quiz = ({ task }: QuizProps) => {
//     const [currentAnswer, setCurrentAnswer] = useState('');
//     const [score, setScore] = useState<number | null>(0);
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const [totalQuestions, setTotalQuestions] = useState<number>(1);
//     const [showAnswer, setShowAnswer] = useState(false);
//     const [showStar, setShowStar] = useState(false);

//     useEffect(() => {
//         if (task?.Library) {
//             setShowStar(true);
//         } else {
//             setShowStar(false);
//         }
//     }, [task?.Library]);

//     const handleAnswerSubmit = () => {
//         if (currentAnswer.trim().toLowerCase() === task?.action.trim().toLowerCase()) {
//             setScore(1); // Correct answer
//         } else {
//             setScore(0); // Incorrect answer
//         }
//         setCurrentAnswer('');
//     };

//     const handleRevealAnswer = () => {
//         setShowAnswer(true);
//     };

//     return (
//         <div className="w-full min-h-screen bg-white">
//             <main className="p-6">
//                 <section className="flex mb-6 justify-between">
//                     <h2 className="text-lg text-black font-semibold underline cursor-pointer">Quiz</h2>
//                     <div className="flex-col">
//                         <div className="text-sm text-black font-bold">{new Date().toLocaleDateString()}</div>
//                         {showStar && (
//                             <div className="flex items-center justify-center my-2">
//                                 <Image src={star} alt="Star" className="h-4 w-4" />
//                             </div>
//                         )}
//                     </div>
//                 </section>

//                 <div className="bg-white rounded-md">
//                     <h3 className="font-semibold text-black bg-[#E7E7E7] pl-2 py-1">Key Learning Points</h3>
//                     <p className="w-full px-10 py-6 border font-bold text-center shadow-sm text-black">
//                         {task?.keyLearningPoint}
//                     </p>
//                 </div>

//                 <div className="bg-white rounded-md mb-4">
//                     <h3 className="font-semibold text-black bg-[#E7E7E7] pl-2 py-1">Action</h3>
//                     <input
//                         type="text"
//                         placeholder="Enter Answer"
//                         value={currentAnswer}
//                         onChange={(e) => setCurrentAnswer(e.target.value)}
//                         className="w-full px-10 py-6 placeholder:text-[#67A76B] text-center border shadow-sm text-black"
//                     />
//                     <div className="flex justify-center mt-4 gap-8">
//                         <button className="text-red-600 flex items-center" onClick={() => setCurrentAnswer('')}>
//                             <span className="mr-1"><Image src={clear} alt="clear" className="h-8 w-8" /></span>
//                         </button>
//                         <button onClick={handleAnswerSubmit} className="text-green-600 flex items-center">
//                             <span className="mr-1"><Image src={submit} alt="submit" className="h-10 w-10" /></span>
//                         </button>
//                     </div>
//                 </div>

//                 <div className="bg-white rounded-md mb-4">
//                     <h3 className="font-semibold text-black bg-[#E7E7E7] pl-2 py-1">Action</h3>
//                     {!showAnswer ? (
//                         <button
//                             className="text-[#67A76B] font-bold underline w-full px-10 py-6 border shadow-sm"
//                             onClick={handleRevealAnswer}
//                         >
//                             CLICK TO REVEAL ANSWER
//                         </button>
//                     ) : (
//                         <p className="text-black w-full font-bold text-center px-10 py-6 border shadow-sm">
//                             Answer: {task?.action}
//                         </p>
//                     )}
//                 </div>

//                 <div className="mt-12 text-center text-black">
//                     <p>
//                         Score: <input className="w-12 text-center border-2 border-gray-300 rounded-md" value={score ?? 0} readOnly /> /
//                         <input className="ml-1 w-12 text-center border-2 border-gray-300 rounded-md" value={totalQuestions} readOnly />
//                     </p>
//                     <p className="pt-4">Total Questions: <input className="w-12 text-center border-2 border-gray-300 rounded-md" value={totalQuestions} readOnly /></p>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default Quiz;
