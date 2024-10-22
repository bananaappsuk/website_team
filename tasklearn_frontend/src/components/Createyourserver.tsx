import "../../src/app/globals.css";
import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/router';

const Modal = ({ show, onClose }) => {
  const router = useRouter();

  if (!show) return null;

  const handleNavigation = () => {
    onClose(); // Close modal when navigating
    router.push('/Tellusmoreabout'); // Programmatically navigate to the page
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <div className="flex justify-end">
          <button onClick={onClose} className="">
            X
          </button>
        </div>
        <h2 className="text-xl font-bold mb-4 text-center">Create your server</h2>
        <p className="mb-4 text-center">Your server is where you and your friends hang out.</p>
        
        {/* Modal Content */}
        <div className="bg-gray-100 w-full rounded-md py-8">
          <img src="/assets/image_3.png" className="float-left ml-5 min-h-1 Co_2" />
          {/* Link that navigates to another page */}
          <label className="font-bold ml-5 cursor-pointer" onClick={handleNavigation}>
            Create My Own
          </label>
          <img src="/assets/Vector.png" className="float-right mr-6" />
        </div>

        {/* Recently added sections */}
        <div className="mt-6">Recently added</div>
        <div className="bg-gray-100 w-full rounded-md py-8 mt-6">
          <img src="/assets/image_3.png" className="float-left ml-5 Co_2" />
          <label className="font-bold ml-5">Cardio</label>
          <img src="/assets/Vector.png" className="float-right mr-6" />
        </div>
        <div className="bg-gray-100 w-full rounded-md py-8 mt-6">
          <img src="/assets/image_3.png" className="float-left ml-5 Co_2" />
          <label className="font-bold ml-5">General Medicine</label>
          <img src="/assets/Vector.png" className="float-right mr-6" />
        </div>
        <div className="bg-gray-100 w-full rounded-md py-8 mt-6">
          <img src="/assets/image_3.png" className="float-left ml-5 Co_2" />
          <label className="font-bold ml-5">Friends</label>
          <img src="/assets/Vector.png" className="float-right mr-6" />
        </div>
      </div>
    </div>
  );
};

export default Modal;
