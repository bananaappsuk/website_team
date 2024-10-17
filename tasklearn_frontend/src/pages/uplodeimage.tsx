import "../../src/app/globals.css";
import React from 'react';

const Modal = () => {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50  flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg  shadow-lg w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4 text-center">Customize Your Server</h2>
        <p className="mb-4 text-center">In order to help you with your setup, is your new server for just a few friends or a larger community? </p>
        <div className="w-full rounded-md py-8"> 
          <img src="assets/Ellipse_15.png" className="bg-no-repeat bg-center ml_v1"/>
          <img src="assets/mdi_camera.png" className="bg-center ml_v2"/>
          <img src="assets/Upload.png" className="bg-center ml_v3"/>
          </div>
          <div>
                <label className="block mb-1 text-black">Server Name </label>
                <input type="text" placeholder="" className="w-full input-field border border-gray p-1 rounded-md text-black ml_v6" required />
           </div>
         
          <div className="mt-6">Back<button type="button" className="w-[20%] btn-submit bg-[#68A86B] border border-[#68A86B] text-white py-1 px-7 rounded-lg hover:bg-green-100 hover:text-black transition duration-300 float-right">Create</button>
          </div>

      </div>
    </div>


  );
};

export default Modal;










