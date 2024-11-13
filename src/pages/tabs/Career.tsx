import React from 'react';

const Career = () => {
    return (
        <div className="w-full mx-auto p-4 bg-white rounded-md">
            <div className="mb-4 mb-[5px]">
                <div className="bg-white rounded-md">
                    <h3 className="font-semibold text-black bg-[#E7E7E7] pt-[10px] pb-[10px] pl-2">Jobs & Descriptions</h3>
                    <p className="w-full p-[5px] border font-bold text-center shadow-sm text-black">
                        <textarea
                            className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-100"

                        ></textarea>
                    </p>
                </div>

            </div>
            <div className="mb-4">
                <div className="bg-white rounded-md">
                    <h3 className="font-semibold text-black bg-[#E7E7E7] pt-[10px] pb-[10px] pl-2">Career Aspirations</h3>
                    <p className="w-full p-[5px] border font-bold text-center shadow-sm text-black">
                        <textarea
                            className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-100"
                        >
                        </textarea>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Career;