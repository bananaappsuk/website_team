import React, { useRef, useState } from 'react';
import "../../src/app/globals.css";

const Modal = () => {
  const fileInputRef = useRef(null); // Reference for the file input
  const [selectedImage, setSelectedImage] = useState(null); // State for storing selected image

  // Function to handle image click and trigger file input click
  const handleImageClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input when image is clicked
  };

  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file); // Create a preview URL for the image
      setSelectedImage(fileURL); // Set selected image for preview
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4 text-center">Customize Your Server</h2>
        <p className="mb-4 text-center pn_1">In order to help you with your setup, is your new server for just a few friends or a larger community?</p>
        
        {/* Image that triggers the file upload */}
        <div className="w-full rounded-md py-8 cursor-pointer" onClick={handleImageClick}>
          {selectedImage ? (
            <img src={selectedImage} alt="Uploaded Preview" className="bg-center bg-no-repeat w-32 h-32 object-cover rounded-md mx-auto" />
          ) : (
            <img src="assets/Group_4.png" alt="Upload" className="bg-center bg-no-repeat w-32 h-32 object-cover rounded-md mx-auto" />
          )}
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept="image/*" // Accept only image files
        />

        <div>
          <label className="block mb-1 text-black sn_1">Server Name</label>
          <input type="text" placeholder="" className="w-full input-field border border-gray p-1 rounded-md text-black ml_v6" required />
        </div>

        <div className="fo_1">
          <div className="fo_2">
            <label className="fo_22">
              <a href="/Tellusmoreabout">Back</a>
            </label>
          </div>
          <div className="fo_3">
            <button type="button" className="fo_4 w-[20%] btn-submit bg-[#68A86B] border border-[#68A86B] text-white py-1 px-7 rounded-lg hover:bg-green-100 hover:text-black transition duration-300 float-right">
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
