import "../../src/app/globals.css";
import React from 'react';

const Modal = () => {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50  flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg  shadow-lg w-full max-w-xl">
     
        <h2 className="text-xl font-bold mb-4 text-center">Tell us more about your sever </h2>
        <p className="mb-4 text-center">In order to help you with your setup, is your new server for just a few friends or a larger community?</p>
        <div className="bg-gray-100 w-full rounded-md py-8"> 
          <img src="assets/image_3.png" className="float-left ml-5 min-h-1"/>
          <label className="font-bold  ml-5">For me and my friends</label>
          <img src="assets/Vector.png" className="float-right mr-6"/>
          </div>
          
          <div className="bg-gray-100 w-full rounded-md py-8 mt-6"> 
          <img src="assets/image_3.png" className="float-left ml-5 "/>
          <label className="font-bold  ml-5">For a club or community</label>
          <img src="assets/Vector.png" className="float-right mr-6"/>
          </div>
          <div className="mt-6 text-center" >Not sure? you can <a href="" className="Co_1">skip this question </a> for now.</div>
          <div className="mt-6 ">Back</div>
      </div>
    </div>


  );
};

export default Modal;










