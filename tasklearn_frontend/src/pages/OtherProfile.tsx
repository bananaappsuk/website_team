import React, { useState } from 'react';
import "../app/globals.css";

const OtherProfile = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [link, setLink] = useState("");

  const closeModal = () => setModalOpen(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
    closeModal();
  };

  return (
    <div className="w-full flex gap-2 bg-gray-100">
      <div className="flex flex-col lg:flex-row w-full">
        {/* Sidebar */}
        <div className="w-full lg:w-[7%] flex lg:flex-col items-center bg-white p-4">
          <div className="pt-4 text-green-500 text-lg md:text-3xl font-bold">
            <a href="/Homepage">TL</a>
          </div>
          <div className="hidden lg:block rounded-full overflow-hidden h-12 w-12 mt-4">
            <img src="assets/Ellipse_1.png" alt="Profile" />
          </div>
          <button className="mt-4 h-10 w-10 bg-gray-300 rounded-full text-3xl text-white">
            +
          </button>
        </div>

        {/* Main Content Area */}
        <div className="w-full lg:w-[100%] bg-white shadow-md p-4">
          {/* Header */}
          <div className="p-4 flex justify-between">
            <div className="text-start">
              <h1 className="text-[10px] sm:text-md md:text-md lg:text-2xl xl:text-3xl font-bold text-[#68A86B]">
                <a href="/Homepage">T-askLearn</a>
              </h1>
              <p className="text-[2px] sm:text-[4px] lg:text-[6px] xl:text-[8px] text-[#68A86B]">
                <a href="/Homepage">Collaborate to Learn, Learn to Collaborate</a>
              </p>
            </div>
            <div className="px-4 text-black font-bold items-center flex justify-end gap-2">
              <a href="/Homepage">H</a>
              <a href="/UserProfile">P</a>
            </div>
          </div>
          <div className="h-[1px] w-full bg-gray-300"></div>
          {/* User Info */}
          <div className="flex flex-col lg:flex-row mt-4">
            <div className="w-full lg:w-1/3 p-4">
              <img src="assets/Ellipse_2.png" className="ml-10" alt="Profile" />
              <p className="text-lg font-bold">Username, Job Role</p>
            </div>
            <div className="ml-auto flex items-center">
              {/* Step 3: Add onClick handler to open modal */}
              <button 
                onClick={() => setModalOpen(true)} 
                className="mb-20 pl-8 pr-8 bg-[#67A76B] rounded-md text-white px-4 py-2 rounded">
                Follow
              </button>
            </div>
          </div>

          {/* Main Quiz Section */}
          <div className="p-4 lg:w-[40%] float-left">
            {/* Quiz Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-lg font-bold underline">Quiz</h1>
              <span className="font-bold">12/08/2024</span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search key words"
                  className="border rounded-md px-3 pl-10 py-1 bg-gray-50"
                />
                <img
                  src="assets/Group_2.png" // Replace with the actual path for search icon
                  alt="Search Icon"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                />
              </div>
            </div>

            {/* Key Learning Points */}
            <div className="bg-white rounded-md p-4 mb-4">
              <h2 className="font-bold bg-gray-200 py-2 px-4 rounded-t-md">Key Learning Points</h2>
              <p className="text-center font-bold py-6 border">Ajith</p>

              {/* Action Section */}
              <h2 className="font-bold bg-gray-200 py-2 px-4 mt-4">Action</h2>
              <input
                type="text"
                placeholder="Enter Answer"
                className="w-full px-10 py-6 placeholder:text-green-800 text-center border rounded-md mt-2"
              />
            </div>

            {/* Icons Section */}
            <div className="flex justify-center mt-4 gap-8">
              <button className="text-red-600 flex items-center">
                <img src="assets/image_2.png" alt="Cross" className="h-8 w-8" />
              </button>
              <button className="text-green-600 flex items-center">
                <img src="assets/image_1.png" alt="Check" className="h-8 w-8" />
              </button>
            </div>

            {/* Another Action Section */}
            <div className="p-4 mt-4">
              <h2 className="font-bold bg-gray-200 py-2 px-4">Action</h2>
              <button className="text-[#67A76B] font-bold underline w-full px-10 py-6 border shadow-sm">
                CLICK TO REVEAL ANSWER
              </button>
            </div>

            {/* Icons Section */}
            <div className="flex justify-center mt-4 gap-8">
              <button className="text-red-600 flex items-center">
                <img src="assets/Vector_1.png" alt="Clear" className="h-8 w-8" />
              </button>
              <button className="text-green-600 flex items-center">
                <img src="assets/Vector_2.png" alt="Submit" className="h-8 w-8" />
              </button>
            </div>

            {/* Score Section */}
            <div className="mt-12 text-black flex flex-col items-center">
              <div className="flex justify-center items-center font-bold mb-4">
                <span className="w-48 text-right mr-4">Score:</span>
                <input className="w-12 text-center border rounded-md" readOnly /> /
                <input className="w-12 text-center border rounded-md ml-2" value="1" readOnly />
              </div>
              <div className="flex justify-center items-center font-bold">
                <span className="w-48 text-right mr-4">Total Questions:</span>
                <input className="w-12 text-center border rounded-md" readOnly />
              </div>
            </div>
          </div>

          <div className="p-4 border-2 rounded-lg p-8">
            {/* Tabs: Followers, Following, Career */}
            <div className="flex justify-around border-b mb-4 P1_2 fo_22">
              <button className="text-center flex-1 py-2 border-gray-400">
                Followers
              </button>
              <button className="text-center flex-1 py-2 border-gray-400">
                Following
              </button>
              <button className="text-center flex-1 py-2 border-gray-400">
                Career
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-center">
              {/* Followers Section */}
              <div className="bg-white p-4 shadow-md rounded-md">
                <h3 className="text-lg font-bold border-b pb-2 mb-4">List of Followers</h3>
                <ul className="space-y-2">
                  <li className="border-b pb-2">Follower 1</li>
                  <li className="border-b pb-2">Follower 2</li>
                  <li className="border-b pb-2">Follower 3</li>
                  {/* Add more followers here */}
                </ul>
              </div>

              {/* Following Section */}
              <div className="bg-white p-4 shadow-md rounded-md">
                <h3 className="text-lg font-bold border-b pb-2 mb-4">Following List</h3>
                <ul className="space-y-2">
                  <li className="border-b pb-2">Following 1</li>
                  <li className="border-b pb-2">Following 2</li>
                  <li className="border-b pb-2">Following 3</li>
                  {/* Add more following here */}
                </ul>
              </div>

              {/* Career Section */}
              <div className="bg-white p-4 shadow-md rounded-md">
                <h3 className="text-lg font-bold border-b pb-2 mb-4">Qualifications</h3>
                <textarea
                  className="border mb-4 p-2 h-24 w-full resize-none" // Fixed height, full width, no resize
                ></textarea>

                <h3 className="text-lg font-bold border-b pb-2 mb-4">Career Aspirations</h3>
                <textarea
                  className="border p-2 h-24 w-full resize-none" // Fixed height, full width, no resize
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg shadow-lg relative w-full max-w-xl md:max-w-2xl pb-[100px]">
          {/* Header Section with Title and Close Button */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Invite friends to Tia’s Server</h2>
            <button 
              onClick={closeModal} 
              className="focus:outline-none text-2xl"
            >
              X
            </button>
          </div>
          <p>Share this link with others to grant access to your server!</p>
          
          <div className="flex items-center  w-full p-2 bg-gray-200 rounded-md mt-4">
            <input 
              type="text" 
              value="https://tasklearn/Tia’s Server" 
              readOnly 
              className="flex-grow px-4 py-2 bg-gray-200 text-gray-800 border-none rounded-l-md focus:outline-none"
            />
      
            <button 
              className="px-8 py-2 text-white bg-[#67A76B] rounded-r-md focus:outline-none rounded-[3px]"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
      
      
      
      )}
    </div>
  );
};

export default OtherProfile;
