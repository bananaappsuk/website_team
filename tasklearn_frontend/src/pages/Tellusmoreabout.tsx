import "../../src/app/globals.css";
import React, { useState } from 'react';
import Link from "next/link";
import Createyourserver from "@/components/Createyourserver";

const Modal = () => {
  const [showModal2, setShowModal2] = useState(false);

  const openModal2 = () => setShowModal2(true);
  const closeModal2 = () => setShowModal2(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <div className="flex justify-end">
          <Link href="/Homepage">
            X
          </Link>
        </div>
        <h2 className="text-xl font-bold mb-4 text-center">
          Tell us more about your server
        </h2>
        <p className="mb-4 text-center pn_1">
          In order to help you with your setup, is your new server for just a few friends or a larger community?
        </p>

        <div className="bg-gray-100 w-full rounded-md py-8">
          <img src="assets/image_3.png" className="float-left ml-5 min-h-1 Co_2" />
          <label className="font-bold ml-5">
            <Link href="/uplodeimage">For me and my friends</Link>
          </label>
          <img src="assets/Vector.png" className="float-right mr-6" />
        </div>

        <div className="bg-gray-100 w-full rounded-md py-8 mt-6">
          <img src="assets/image_3.png" className="float-left ml-5 Co_2" />
          <label className="font-bold ml-5"><Link href="/uplodeimage">For a club or community</Link></label>
          <img src="assets/Vector.png" className="float-right mr-6" />
        </div>

        <div className="mt-6 text-center pn_1">
          Not sure? You can <Link href="/uplodeimage" className="Co_1">skip this question</Link> for now.
        </div>

        {/* Trigger for opening the modal */}
        <div onClick={openModal2} className="mt-6 cursor-pointer fo_22">
          Back
        </div>
      </div>

      {/* Conditional rendering of the modal */}
      {showModal2 && (
        <Createyourserver show={true} onClose={closeModal2} />
      )}
    </div>
  );
};

export default Modal;
