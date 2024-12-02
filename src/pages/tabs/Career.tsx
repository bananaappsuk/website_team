/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast, ToastContainer } from "react-toastify";

type UserData = {
    uid: any;
    email: string;
    userName: string;
    jobRole: string;
    profilePicUrl: string | undefined;
    jobsAndDescriptions?: string;
    careerAspirations?: string;
};

type Props = {
    userData: UserData | null;
};

const Career: React.FC<Props> = ({ userData }) => {

    const [user, setUser] = useState<UserData | null>(null);
    const [buttonText, setButtonText] = useState("Save");
    const fetchUserDocumentById = async (uid: string) => {
        try {
            const userDocRef = doc(db, "users", uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                return userDocSnap.data() as UserData;
            } else {
                console.error("No such document!");
                return null;
            }
        } catch (error) {
            console.error("Error fetching user document: ", error);
            return null;
        }
    };

    useEffect(() => {
        const getUserData = async () => {
            if (userData?.uid) {
                const data = await fetchUserDocumentById(userData.uid);
                setUser(data);
            }
        };
        getUserData();

    }, [userData?.uid]);


    const [formData, setFormData] = useState({
        careerAspirations: "",
        jobs_Descriptions: "",
    });

    useEffect(() => {
        if (user) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                careerAspirations: user.careerAspirations || "",
                jobs_Descriptions: user.jobsAndDescriptions || "",
            }));
            setButtonText("Save");
        }
    }, [user])


    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userRef = doc(db, "users", userData?.uid);
            await updateDoc(userRef, {
                jobsAndDescriptions: formData.jobs_Descriptions,
                careerAspirations: formData.careerAspirations,
            });
            toast.success("Updated successfully");
            setButtonText("Saved");
        } catch (error) {
            console.error("Error updating user profile: ", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (buttonText !== "Save Changes") {
            setButtonText("Save Changes");
        }
    };

    console.log(user);

    return (
        <>
            <ToastContainer />

            <div className="w-full mx-auto p-4 bg-white rounded-md relative">
                <form action="">
                    <div className="mb-4">
                        <div className="bg-white rounded-md">
                            <h3 className="font-semibold text-black bg-[#E7E7E7] pt-[10px] pb-[10px] pl-2">
                                Job role and description
                            </h3>
                            <p className="w-full p-[5px] border font-bold text-center shadow-sm text-black">
                                <textarea
                                    name="jobs_Descriptions"
                                    value={formData.jobs_Descriptions}
                                    onChange={handleChange}
                                    className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-100"
                                ></textarea>
                            </p>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="bg-white rounded-md">
                            <h3 className="font-semibold text-black bg-[#E7E7E7] pt-[10px] pb-[10px] pl-2">
                                Career Aspirations
                            </h3>
                            <p className="w-full p-[5px] border font-bold text-center shadow-sm text-black">
                                <textarea
                                    name="careerAspirations"
                                    value={formData.careerAspirations}
                                    onChange={handleChange}
                                    className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 bg-gray-100"
                                ></textarea>
                            </p>
                        </div>
                    </div>
                    <button
                        className=" absolute right-4 bg-[#67A76B] text-white hover:bg-green-600 rounded-md p-1 px-6"
                        onClick={handleSave}
                    >
                        {buttonText}
                    </button>
                </form>
            </div>
        </>
    );
};

export default Career;