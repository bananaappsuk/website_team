// // components/Layout.tsx

// import { useState } from 'react';
// import { FiPlus } from 'react-icons/fi'; // for the "+" icon
// import { HiChevronRight } from 'react-icons/hi'; // for the chevron icon

// const Layout = () => {
//     const [search, setSearch] = useState('');

//     return (
//         <div className="flex h-screen">
//             {/* Sidebar */}
//             <div className="w-full bg-white space-y-1">
//                 {/* Logo Section */}
//                 <div className="p-4 text-center">
//                     <h1 className="text-3xl font-bold text-[#68A86B]">T-askLearn</h1>
//                     <p className="text-[8px] text-[#68A86B]">Collaborate to Learn, Learn to Collaborate</p>
//                 </div>
//                 <div className="mt-4 h-[1px] w-full bg-gray-300" />

//                 {/* Add Task Button */}
//                 <div className='p-8 flex justify-center'>
//                     <button className="w-[80%] border hover:border-[#BFBFBF] bg-[#68A86B] hover:bg-white text-white hover:text-[#BFBFBF] font-bold py-2 px-2 rounded-lg flex justify-center items-center">
//                         Task <FiPlus className="ml-2" />
//                     </button>
//                 </div>

//                 {/* Search Bar */}
//                 <div className="p-2 relative">
//                     <input
//                         type="text"
//                         placeholder="Search @ User, Patient ID..."
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                         className="w-full p-1 border border-gray-300 bg-gray-100 text-[#BEBEBE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BEBEBE]"
//                     />
//                 </div>

//                 {/* Menu Items */}
//                 <ul className="p-4 space-y-4">
//                     {[
//                         'All Task',
//                         'Pending Task',
//                         'Completed Task',
//                         'Deleted Task',
//                         'Learning',
//                     ].map((item) => (
//                         <li key={item} className="flex justify-between items-center text-gray-600 hover:text-black cursor-pointer">
//                             {item}
//                             <HiChevronRight />
//                         </li>
//                     ))}
//                     {/* User Information */}
//                     <li className="flex justify-between items-center text-gray-600 hover:text-black cursor-pointer">
//                         Anne Smith,
//                     </li>
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default Layout;
