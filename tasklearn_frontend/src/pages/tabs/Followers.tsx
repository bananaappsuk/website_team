import React, { useState } from 'react';

const Followers = () => {

return (
<div className="w-full mx-auto p-4">
  <h2 className="text-center text-lg font-semibold mb-4">List of followers</h2>
  <ul className="space-y-4">
    {[...Array(10)].map((_, index) => (
      <li key={index} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md">
        <div>
          <p className="text-sm sn_1">Username,Job role</p>
        </div>
        <button className="bgco_1 text-white py-1 px-4 rounded-md hover:bg-green-600 transition duration-300">
          Follow
        </button>
      </li>
    ))}
  </ul>
</div>


);

};

export default Followers;