import React, { useState } from 'react';

const Requests = () => {

return (
<div className="w-full mx-auto p-4">
  <h2 className="text-center text-lg font-semibold mb-4">Follow Requests</h2>
  <ul className="space-y-4">
    {[...Array(10)].map((_, index) => (
      <li key={index} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
        <div>
          <p className="text-sm sn_1">Username,Job role</p>
        </div>
        <div className="flex space-x-2 mr1">
          <button className="bgco_2 text-white py-1 px-4 rounded-md hover:bg-green-600 transition duration-300">
            Accept
          </button>
          <button className="bgco_3 text-white py-1 px-4 rounded-md hover:bg-red-600 transition duration-300">
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