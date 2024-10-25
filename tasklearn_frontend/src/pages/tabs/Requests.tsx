import React, { useState } from 'react';

const Requests = () => {

return (
<div className="w-[55%] mx-auto p-4">
  <h2 className="text-center text-lg font-semibold mb-4">Follow Requests</h2>
  <ul className="space-y-4">
    {[...Array(10)].map((_, index) => (
      <li key={index} className="flex justify-between items-center p-4 bg-white border-b-2 pb-[8px] mt-0">
        <div>
          <p className="text-sm text-[#000000] font-bold">Username,Job role</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-[#67A76B] pl-[45px] pr-[45px] text-white py-1 px-4 rounded-md hover:bg-green-600 transition duration-300">
            Accept
          </button>
          <button className="bg-[#D26767] pl-[45px] pr-[45px] text-white py-1 px-4 rounded-md hover:bg-red-600 transition duration-300">
            Decline
          </button>
        </div>
      </li>
    ))}
  </ul>
</div>



);

};

export default Requests;