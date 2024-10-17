import "../../src/app/globals.css";
import { useState } from 'react';
import Tellusmoreabout from '../pages/Tellusmoreabout';
import Link from "next/link";



const Modal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50  flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg  shadow-lg w-full max-w-xl">
      <div className="flex justify-end">
          <button onClick={onClose} className="">
           X
          </button>
        </div>
        <h2 className="text-xl font-bold mb-4 text-center" >Create your server</h2>
        <p className="mb-4 text-center">Your sever is where you and your friends hang out.</p>
        <div className="bg-gray-100 w-full rounded-md py-8"> 
          <img src="assets/image_3.png" className="float-left ml-5 min-h-1"/>
          <label className="font-bold  ml-5"><Link href="/Tellusmoreabout">Create My Own</Link></label>
          <img src="assets/Vector.png" className="float-right mr-6"/>
          </div>
          <div className="mt-6 ">Recently added</div>
          <div className="bg-gray-100 w-full rounded-md py-8 mt-6"> 
          <img src="assets/image_3.png" className="float-left ml-5 "/>
          <label className="font-bold  ml-5">Cardio</label>
          <img src="assets/Vector.png" className="float-right mr-6"/>
          </div>
          <div className="bg-gray-100 w-full rounded-md py-8 mt-6"> 
          <img src="assets/image_3.png" className="float-left ml-5 "/>
          <label className="font-bold  ml-5">General Medicine </label>
          <img src="assets/Vector.png" className="float-right mr-6"/>
          </div>
          <div className="bg-gray-100 w-full rounded-md py-8 mt-6"> 
          <img src="assets/image_3.png" className="float-left ml-5 "/>
          <label className="font-bold  ml-5">Friends </label>
          <img src="assets/Vector.png" className="float-right mr-6"/>
          </div>
       
      </div>
     
    </div>
//new window



  );
};

export default Modal;
