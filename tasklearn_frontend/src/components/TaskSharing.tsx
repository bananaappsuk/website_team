/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import "../../src/app/globals.css";
import { FiPlus } from 'react-icons/fi';
import Image from "next/image";
import { HiChevronRight } from 'react-icons/hi';
import Profile from "../../src/assets/home/Ellipse 1.png";
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useTask } from '../components/TaskContext';
import clear from "../../src/assets/home/image 2.png";
import submit from "../../src/assets/home/image 1.png";
import star from "../../src/assets/home/Vector.png";
import back from "../../src/assets/home/back.png";
import Quizzes from '@/pages/tabs/Quizzes';

const TaskSharing = () => {
    const [search, setSearch] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showStar, setShowStar] = useState(false);
    const [showQuiz, setShowQuiz] = useState<boolean>(false);
    const [tasksList, setTasksList] = useState<Task[]>([]); /*V End*/
    const [showForm, setShowForm] = useState(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [filter, setFilter] = useState('All Task');
    const { task, setTask } = useTask();
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [score, setScore] = useState<number | null>(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [totalQuestions, setTotalQuestions] = useState<number>(1);
    const [showAnswer, setShowAnswer] = useState(false);

    const taskCategories = [
        'All Task',
        'Pending Task',
        'Completed Task',
        'Deleted Task',
        'Learning',
    ];
    useEffect(() => {
        fetchTasks(filter)
    }, []);


    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        //  if (!task.createdBy || !task.taggedStaff || !task.contributingStaff || !task.taskName || !task.history || !task.examination || !task.diagnosis || !task.plan || !task.followUp || !task.postConsultation || !task.feedback) {
        //     toast.error('Please fill in all required fields.');
        //      return;
        //  }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
               // console.log(response);
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...task, Learn: false }),
            });

            if (response.ok) {
                if (task.Library && task.Learn) {
                    setShowStar(true);
                } else {
                    setShowStar(false);
                }
                toast.success('Task shared successfully');

                // Check if Learn is selected
                if (task.Learn) {
                    // Create quiz
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quizzes`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            keyLearningPoint: task.keyLearningPoint,
                            action: task.action,
                        }),
                    });
                    setShowQuiz(true);
                } else {
                    handleTasksClick('All Task');
                }

                if (task.Library) {
                    // Create Library
                    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Libraries`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            keyLearningPoint: task.keyLearningPoint,
                            action: task.action,
                        }),
                    });
                }

                setTask({
                    ...task,
                    Library: false,
                    Learn: false,
                });
            } else {
                throw new Error('Failed to share task');
            }
        } catch (error) {
            toast.error('Error sharing task: ' + (error as Error).message);
        }
    };




    const handleComplete = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!task.createdBy || !task.taggedStaff || !task.contributingStaff || !task.taskName || !task.history || !task.examination || !task.diagnosis || !task.plan || !task.followUp || !task.postConsultation || !task.feedback) {
            toast.error('Please fill in all required fields.');
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...task, Library: false }),
            });

            if (response.ok) {
                toast.success('Task saved successfully');
                setShowQuiz(false);
                setTask({
                    ...task,
                    Library: false,
                    Learn: false,
                });
                handleTasksClick('All Task');
            } else {
                throw new Error('Failed to save task');
            }
        } catch (error) {
            toast.error('Error saving task: ' + (error as Error).message);
        }
    };

    const fetchTasks = async (filter: string) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks?filter=${filter}`);
            setTasksList(response.data);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('Failed to fetch tasks');
        }
    };

    const handleTasksClick = (item: string) => {
        setFilter(item);
        setShowForm(false);
        setShowQuiz(false);
        fetchTasks(item);
    };

    const handleBackToForm = () => {
        setShowForm(true);
    };
/*V start*/
const handleseach = (param: any) => {
    if (param) {
        setSearch(param);
        setFilter("All Task");
        setShowForm(false);
        console.log('test', tasksList);

        const filtered = tasksList.filter((task) => {
            // Check if any of the columns contain the search term
            return Object.values(task).some(value =>
                value?.toString().toLowerCase().includes(param.toLowerCase())
            );
        });

        setTasksList(filtered);
    } else {
        setSearch('');
        fetchTasks(filter);
    }
}

/*V End*/
    const handleAnswerSubmit = () => {
        if (currentAnswer.trim().toLowerCase() === task?.action.trim().toLowerCase()) {
            setScore(1); // Correct answer
        } else {
            setScore(0); // Incorrect answer
        }
        setCurrentAnswer('');
    };

    const handleRevealAnswer = () => {
        setShowAnswer(true);
    };

    return (
        <>
            <ToastContainer />
            <div className='w-full flex gap-2 bg-gray-100'>
                <div className="w-[7%] flex flex-col items-center space-y-4 bg-white min-h-screen">
                    <div className="pt-12 text-green-500 text-lg md:text-3xl font-bold"><a href="/Homepage">TL</a></div>
                    <div className="rounded-full overflow-hidden h-6 w-6 md:w-10 md:h-10 lg:w-12 lg:h-12">
                        <Image
                            src={Profile}
                            alt="Profile Picture"
                            width={64}
                            height={64}
                        />
                    </div>

                    <button className="flex items-center justify-center h-6 w-6 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gray-300 rounded-full text-3xl text-white">
                        +
                    </button>
                </div>
                <div className="w-[25%] flex min-h-screen">
                    <div className="w-full bg-white space-y-1">
                        <div className="px-4 pt-3 pb-4 text-center">
                            <h1 className="text-[10px] sm:text-md md:text-md lg:text-2xl xl:text-3xl font-bold text-[#68A86B]"><a href="/Homepage">T-askLearn</a></h1>
                            <p className="text-[2px] sm:text-[4px] lg:text-[6px] xl:text-[8px] text-[#68A86B]"><a href="/Homepage">Collaborate to Learn, Learn to Collaborate</a></p>
                        </div>
                        <div className="h-[1px] w-full bg-gray-300" />

                        <div className='p-0 lg:p-8 flex justify-center'>
                            <a href="/Homepage" className="w-[80%] border hover:border-[#BFBFBF] bg-[#68A86B] hover:bg-white text-white hover:text-[#BFBFBF] font-bold p-1 lg:py-2 lg:px-2 rounded-lg flex justify-center items-center">
                                Task <FiPlus className="ml-2" />
                            </a>
                        </div>

                        <div className="p-2 relative">
                            <input
                                type="text"
                                placeholder="Search @ User, Patient ID..."
                                value={search}
                                onChange={(e) => handleseach(e.target.value)}
                                className="w-full p-1 border border-gray-300 bg-gray-100 text-[#BEBEBE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEBEBE]"
                            />
                        </div>

                        <ul className="p-4 space-y-4">
                            {taskCategories.map((item) => (
                                <li
                                    key={item}
                                    onClick={() => handleTasksClick(item)}
                                    className="flex justify-between items-center text-gray-600 hover:text-black cursor-pointer"
                                >
                                    {item}
                                    <HiChevronRight />
                                </li>
                            ))}
                            <li className="flex justify-between items-center text-gray-600 hover:text-black cursor-pointer">
                                Anne Smith
                            </li>
                        </ul>
                    </div>
                </div>
                {showForm ? (
                    <section className='w-[70%] bg-white shadow'>
                        <div className='pt-1'>
                            <div className="pt-11 px-4 text-black font-bold items-center flex justify-end gap-2">
                                <a href="/Homepage">H</a>
                                <a href="/UserProfile">P</a>
                            </div>
                            <div className="mt-2 h-[1px] w-full bg-gray-300" />
                            <div className='p-4'>
                                <p className='text-2xl text-black font-bold'>Task Sharing</p>
                            </div>
                        </div>
                        <div className='p-4 flex justify-between gap-12'>
                            <a href="/Homepage" className="w-full border border-[#BFBFBF] bg-white hover:bg-[#68A86B] text-[#BFBFBF] hover:text-white font-bold py-2 px-4 rounded-full flex justify-center items-center">
                                Admin <FiPlus className="ml-2" />
                            </a>
                            <a href="/Homepage" className="w-full border border-[#BFBFBF] bg-white hover:bg-[#68A86B] text-[#BFBFBF] hover:text-white font-bold py-2 px-4 rounded-full flex justify-center items-center">
                                Triage <FiPlus className="ml-2" />
                            </a>
                            <a href="/Homepage" className="w-full border border-[#BFBFBF] bg-white hover:bg-[#68A86B] text-[#BFBFBF] hover:text-white font-bold py-2 px-4 rounded-full flex justify-center items-center">
                                Test <FiPlus className="ml-2" />
                            </a>
                        </div>
                        <form className="p-4 rounded">
                            <div className="flex flex-col gap-4">
                                <div className="relative">
                                    <div className="flex items-center border border-gray p-1 rounded-md">
                                        <label className="whitespace-nowrap mr-2 text-black">
                                            Created by:
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="@ Username"
                                            className="flex-1 outline-none text-black"
                                            value={task.createdBy}
                                            onChange={(e) => setTask({ ...task, createdBy: e.target.value })}
                                            required
                                        />

                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="flex items-center border border-gray p-1 rounded-md">
                                        <label className="whitespace-nowrap mr-2 text-gray-700">
                                            Tagged Staff:
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="@ Username"
                                            className="flex-1 outline-none text-black"
                                            value={task.taggedStaff}
                                            onChange={(e) => setTask({ ...task, taggedStaff: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="flex items-center border border-gray p-1 rounded-md">
                                        <label className="whitespace-nowrap mr-2 text-gray-700">
                                            Contributing Staff:
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="@ Username"
                                            className="flex-1 outline-none  text-black"
                                            value={task.contributingStaff}
                                            onChange={(e) => setTask({ ...task, contributingStaff: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-1 text-black">Task/Instruction</label>
                                    <input
                                        type="text"
                                        placeholder=""
                                        className="w-full input-field border border-gray p-1 rounded-md text-black"
                                        value={task.taskName}
                                        onChange={(e) => setTask({ ...task, taskName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block mb-1 text-black">History:</label>
                                    <textarea
                                        placeholder=""
                                        className="w-full input-field border border-gray p-1 rounded-md text-black"
                                        value={task.history}
                                        onChange={(e) => setTask({ ...task, history: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className='flex gap-4 w-full'>
                                    <div className="flex-1">
                                        <label className="block mb-1 text-black">Examination:</label>
                                        <textarea
                                            placeholder=""
                                            className="w-full border border-gray p-1 rounded-md text-black"
                                            value={task.examination}
                                            onChange={(e) => setTask({ ...task, examination: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block mb-1 text-black">Diagnosis:</label>
                                        <textarea
                                            placeholder=""
                                            className="w-full border border-gray p-1 rounded-md text-black"
                                            value={task.diagnosis}
                                            onChange={(e) => setTask({ ...task, diagnosis: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <label className="block mb-1 text-black">Plan:</label>
                                    <textarea
                                        placeholder=""
                                        className="w-full input-field border border-gray p-1 rounded-md text-black"
                                        value={task.plan}
                                        onChange={(e) => setTask({ ...task, plan: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block mb-1 text-black">Follow Up:</label>
                                    <textarea
                                        placeholder=""
                                        className="w-full input-field border border-gray p-1 rounded-md text-black"
                                        value={task.followUp}
                                        onChange={(e) => setTask({ ...task, followUp: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block mb-1 text-black">Post Consultation:</label>
                                    <textarea
                                        placeholder=""
                                        className="w-full input-field border border-gray p-1 rounded-md text-black"
                                        value={task.postConsultation}
                                        onChange={(e) => setTask({ ...task, postConsultation: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block mb-1 text-black">Feedback:</label>
                                    <textarea
                                        placeholder=""
                                        className="w-full input-field border border-gray p-1 rounded-md text-black"
                                        value={task.feedback}
                                        onChange={(e) => setTask({ ...task, feedback: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className='flex gap-4 w-full'>
                                    <div className="flex-1">
                                        <label className="block mb-1 text-black">Key Learning Point:</label>
                                        <textarea
                                            placeholder=""
                                            className="w-full border border-gray p-1 rounded-md text-black"
                                            value={task.keyLearningPoint}
                                            onChange={(e) => setTask({ ...task, keyLearningPoint: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block mb-1 text-black">Action:</label>
                                        <textarea
                                            placeholder=""
                                            className="w-full border border-gray p-1 rounded-md text-black"
                                            value={task.action}
                                            onChange={(e) => setTask({ ...task, action: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex mt-4 justify-between">
                                <button
                                    type="submit"
                                    onClick={handleShare}
                                    className="btn-submit bg-[#68A86B] border border-[#68A86B] text-white py-1 px-7 rounded-lg hover:bg-green-100 hover:text-black transition duration-300"
                                >
                                    Share
                                </button>
                                <label className="block mb-2 text-black font-bold">
                                    <input
                                        type="checkbox"
                                        className="mr-2 appearance-none h-4 w-4 border rounded-sm checked:bg-[#68A86B] checked:border-transparent focus:outline-none transition duration-200 cursor-pointer relative checked:before:content-['✔'] checked:before:text-white checked:before:absolute checked:before:left-0 checked:before:top-[-5px]"
                                        checked={task.Library}
                                        onChange={(e) => setTask({ ...task, Library: e.target.checked })}
                                    />
                                    Library
                                </label>
                                <label className="block mb-2 text-black font-bold">
                                    <input
                                        type="checkbox"
                                        className="mr-2 appearance-none h-4 w-4 border rounded-sm checked:bg-[#68A86B] checked:border-transparent focus:outline-none transition duration-200 cursor-pointer relative checked:before:content-['✔'] checked:before:text-white checked:before:absolute checked:before:left-0 checked:before:top-[-5px]"
                                        checked={task.Learn}
                                        onChange={(e) => setTask({ ...task, Learn: e.target.checked })}
                                    />
                                    Learn
                                </label>
                            </div>
                            <div className='flex mt-2 justify-center'>
                                <p className='text-black'>Message about task during supervision/collaboration</p>
                            </div>
                            <div className='flex mt-4 justify-center'>
                                <button
                                    type="button"
                                    onClick={handleComplete}
                                    className="w-[20%] btn-submit bg-[#68A86B] border border-[#68A86B] text-white py-1 px-7 rounded-lg hover:bg-green-100 hover:text-black transition duration-300"
                                >
                                    Complete
                                </button>
                            </div>
                        </form >
                    </section>
                ) : (
                    <section className='w-[70%] p-4 bg-white'>
                        <a
                            onClick={handleBackToForm}
                            className="cursor-pointer my-4 text-[#68A86B] font-bold py-2 px-2"
                        >
                            <Image src={back} alt="back" className="h-4 w-4" />
                        </a>
                        <h2 className="text-xl font-bold my-4 text-black">Tasks List</h2>
                        {tasksList.length > 0 ? (
                            <table className="min-w-full bg-white text-black rounded border-collapse table-auto shadow-md">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border border-gray-300 whitespace-nowrap">Tasks</th>
                                        <th className="py-2 px-4 border border-gray-300 whitespace-nowrap">Task Name</th>
                                        <th className="py-2 px-4 border border-gray-300 whitespace-nowrap">Created By</th>
                                        <th className="py-2 px-4 border border-gray-300 whitespace-nowrap">Tagged Staff</th>
                                        <th className="py-2 px-4 border border-gray-300 whitespace-nowrap">Contributing Staff</th>
                                        <th className="py-2 px-4 border border-gray-300 whitespace-nowrap">History</th>
                                        <th className="py-2 px-4 border border-gray-300 whitespace-nowrap">Examination</th>
                                        <th className="py-2 px-4 border border-gray-300 whitespace-nowrap">Diagnosis</th>
                                        <th className="py-2 px-4 border border-gray-300 whitespace-nowrap">Plan</th>
                                        <th className="py-2 px-4 border border-gray-300 whitespace-nowrap">Follow Up</th>
                                        <th className="py-2 px-4 border border-gray-300 whitespace-nowrap">Post Consultation</th>
                                        <th className="py-2 px-4 border border-gray-300 whitespace-nowrap">Feedback</th>
                                        <th className="py-2 px-4 border border-gray-300 whitespace-nowrap">Key Learning Point</th>
                                        <th className="py-2 px-4 border border-gray-300 whitespace-nowrap">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasksList.map((task: any, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">{index + 1}</td> {/* SNo */}
                                            <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">{task.taskName}</td>
                                            <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">{task.createdBy}</td>
                                            <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">{task.taggedStaff}</td>
                                            <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">{task.contributingStaff}</td>
                                            <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">{task.history}</td>
                                            <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">{task.examination}</td>
                                            <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">{task.diagnosis}</td>
                                            <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">{task.plan}</td>
                                            <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">{task.followUp}</td>
                                            <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">{task.postConsultation}</td>
                                            <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">{task.feedback}</td>
                                            <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">{task.keyLearningPoint}</td>
                                            <td className="py-2 px-4 border border-gray-300 whitespace-nowrap">{task.action}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        ) : (
                            <p className='flex justify-center items-center text-black'>No tasks available</p>
                        )}
                    </section>
                )}

                {/* Quiz Section */}
                {showQuiz && (
                    // <div className='w-[40%] min-h-screen bg-white'>
                    //     <div className="mt-20 h-[1px] w-full bg-gray-300" />
                    //     <header className="p-4 flex justify-center items-center bg-white">
                    //         <div className="text-xl text-black font-bold">Learning</div>
                    //     </header>
                    //     <div className="w-full">
                    //         <main className="p-6">
                    //             <section className="flex mb-6 justify-between">
                    //                 <h2 className="text-lg text-black font-semibold underline cursor-pointer">Quiz</h2>
                    //                 <div className="flex-col">
                    //                     <div className="text-sm text-black font-bold">{new Date().toLocaleDateString()}</div>
                    //                     {showStar && (
                    //                         <div className="flex items-center justify-center my-2">
                    //                             <Image src={star} alt="Star" className="h-4 w-4" />
                    //                         </div>
                    //                     )}
                    //                 </div>
                    //             </section>

                    //             <div className="bg-white rounded-md">
                    //                 <h3 className="font-semibold text-black bg-[#E7E7E7] pl-2 py-1">Key Learning Points</h3>
                    //                 <p className="w-full px-10 py-6 border font-bold text-center shadow-sm text-black">
                    //                     {task?.keyLearningPoint}
                    //                 </p>
                    //             </div>

                    //             <div className="bg-white rounded-md mb-4">
                    //                 <h3 className="font-semibold text-black bg-[#E7E7E7] pl-2 py-1">Action</h3>
                    //                 <input
                    //                     type="text"
                    //                     placeholder="Enter Answer"
                    //                     value={currentAnswer}
                    //                     onChange={(e) => setCurrentAnswer(e.target.value)}
                    //                     className="w-full px-10 py-6 placeholder:text-[#67A76B] text-center border shadow-sm text-black"
                    //                 />
                    //                 <div className="flex justify-center mt-4 gap-8">
                    //                     <button className="text-red-600 flex items-center" onClick={() => setCurrentAnswer('')}>
                    //                         <span className="mr-1"><Image src={clear} alt="clear" className="h-8 w-8" /></span>
                    //                     </button>
                    //                     <button onClick={handleAnswerSubmit} className="text-green-600 flex items-center">
                    //                         <span className="mr-1"><Image src={submit} alt="submit" className="h-10 w-10" /></span>
                    //                     </button>
                    //                 </div>
                    //             </div>

                    //             <div className="bg-white rounded-md mb-4">
                    //                 <h3 className="font-semibold text-black bg-[#E7E7E7] pl-2 py-1">Action</h3>
                    //                 {!showAnswer ? (
                    //                     <button
                    //                         className="text-[#67A76B] font-bold underline w-full px-10 py-6 border shadow-sm"
                    //                         onClick={handleRevealAnswer}
                    //                     >
                    //                         CLICK TO REVEAL ANSWER
                    //                     </button>
                    //                 ) : (
                    //                     <p className="text-black w-full font-bold text-center px-10 py-6 border shadow-sm">
                    //                         Answer: {task?.action}
                    //                     </p>
                    //                 )}
                    //             </div>

                    //             <div className="mt-12 text-center text-black">
                    //                 <p>
                    //                     Score: <input className="w-12 text-center border-2 border-gray-300 rounded-md" value={score ?? 0} readOnly /> /
                    //                     <input className="ml-1 w-12 text-center border-2 border-gray-300 rounded-md" value={totalQuestions} readOnly />
                    //                 </p>
                    //                 <p className="pt-4">Total Questions: <input className="w-12 text-center border-2 border-gray-300 rounded-md" value={totalQuestions} readOnly /></p>
                    //             </div>
                    //         </main>
                    //     </div>
                    // </div>

                    //V Start
                    
                    <div className="w-[40%] min-h-screen bg-white">
                    <div className="mt-20 h-[1px] w-full bg-gray-300"> 
                        
                        <header className="p-4 flex justify-center items-center bg-white">
                        <div className="text-xl text-black font-bold">Learning </div>
                        </header>
                        <section className="flex mb-6 justify-center">
                            <h2 className="text-lg text-black justify-center font-semibold underline cursor-pointer">Quiz</h2>
<div className="flex-col">
   
    <div className="flex items-center justify-center my-2">
        {/* <img alt="Star" loading="lazy" width="26" height="24" style="color: transparent;"> */}
    </div>
</div></section>
                    <Quizzes />
                   
                    </div>
                    </div>
                    //V End
                )}
            </div>
        </>
    );
};

export default TaskSharing;