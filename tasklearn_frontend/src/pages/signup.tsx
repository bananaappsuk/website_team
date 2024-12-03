/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import "../app/globals.css";
import { useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaInfoCircle } from "react-icons/fa";
import BgImage from "../../public/assets/Rectangle68.png";
import { doc, setDoc, getDocs, collection, query, getDoc } from "firebase/firestore";
import { useTask } from "../components/TaskContext";
import Link from "next/link";
import { getAuth } from 'firebase/auth';


interface FormData {
    email: string;
    userName: string;
    password: string;
    confirmPassword: string;
    jobRole: string;
    profilePic: File | null;
}

const SignUp: React.FC = () => {
    const { jobRoleLists } = useTask();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        email: "",
        userName: "",
        password: "",
        confirmPassword: "",
        jobRole: "",
        profilePic: null,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [passwordVisible, setPasswordVisible] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const instructionsRef = useRef<HTMLDivElement>(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [openServer, setOpenServer] = useState<boolean>(false);
    const [isUsernameTaken, setIsUsernameTaken] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        hasUppercase: false,
        hasNumber: false,
        hasSymbol: false,
    });

    const allRequirementsMet = Object.values(passwordRequirements).every(
        (value) => value === true
    );

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            instructionsRef.current &&
            !instructionsRef.current.contains(event.target as Node)
        ) {
            setShowInstructions(false);
        }
    };

    useEffect(() => {
        // Redirect if already logged in
        onAuthStateChanged(auth, (user) => {
            if (user) {
                router.replace("/Homepage");  // Prevent going back to sign-in
            }
        });
    }, [router]);

    useEffect(() => {
        if (showInstructions) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showInstructions]);

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
    };
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const validatePassword = (password: string) => {
        setPasswordRequirements({
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        });
    };

    const debounce = (func: any, delay: any) => {
        let timeout: any;
        return (...args: any) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    //check username exists

    const checkAllUsernames = async () => {
        const usersRef = collection(db, "users");
        const q = query(usersRef);

        const allData = await getDocs(q);
        const usernames = allData.docs.map((doc) => doc.data().userName);
        return usernames;
    };

    const checkUsernameExists = async (userName: any) => {
        const usernames = await checkAllUsernames();
        return usernames.includes(userName);
    };

    const debouncedCheckUsername = debounce(async (userName: any) => {
        if (userName) {
            const usernameExists = await checkUsernameExists(userName);
            if (usernameExists) {
                setIsUsernameTaken(true);
                toast.error("Username is already taken.", { autoClose: 1500 });
            } else {
                setIsUsernameTaken(false);
            }
        }
    }, 500);

    const handleChange = async (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        let maxSize = 5 * 1024 * 1024;
        const { name, value, type } = e.target as
            | HTMLInputElement
            | HTMLSelectElement;
        const { files } = e.target as HTMLInputElement;

        if (name === "termsAccepted") {
            const { checked } = e.target as HTMLInputElement;
            setTermsAccepted(checked);
        }
        if (type === "file" && files) {
            if (!files[0].type.startsWith("image/")) {
                toast.error("Please upload an image file.");
            } else if (files[0].type.startsWith("image/")) {

                //check image file size

                if (files[0].size > maxSize) {
                    toast.error("File size is too large. Maximum size is 5MB.");
                    return;
                } else {
                    setFormData({ ...formData, [name]: files[0] });
                }
            }
        } else {
            setFormData({ ...formData, [name]: value });
            if (name === "password") {
                validatePassword(value);
            }
        }
    };

    useEffect(() => {
        debouncedCheckUsername(formData.userName);
    }, [formData.userName]);

    const profilePicUpload = async (profilePic: any) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                return;
            }

            const token = await user.getIdToken();
            const profile = new FormData();
            profile.append("profilePic", profilePic);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/upload/profile`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: profile,
                }
            );
            if (response.ok) {
                const data = await response.json();
                return data;
            }
        } catch (error: any) {
            toast.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isUsernameTaken) {
            toast.error("Username is already taken.");
            return;
        }

        if (
            !(
                passwordRequirements.minLength &&
                passwordRequirements.hasUppercase &&
                passwordRequirements.hasNumber &&
                passwordRequirements.hasSymbol
            )
        ) {
            toast.error("Password does not meet all the requirements.");
            setShowInstructions(true);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }
        // if (!formData.profilePic) {
        //     toast.error("Please upload a profile picture.");
        //     return;
        // }

        if (!termsAccepted) {
            toast.error("You must accept the Terms of Use and Privacy Policy.");
            return;
        }
        try {
            const signupResponse = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            let profilePicUrl = "";

            if (formData.profilePic) {
                const profilePicData = await profilePicUpload(formData.profilePic);
                profilePicUrl = profilePicData?.profilePicUrl || "";
            }
            const user = signupResponse.user;
            await setDoc(doc(db, "users", user.uid), {
                email: formData.email,
                userName: formData.userName,
                jobRole: formData.jobRole,
                profilePicUrl,
            });
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                toast.success("Account created successfully!", { autoClose: 1000 });
                setOpenServer(true);
                setTimeout(() => {
                    router.push({
                        pathname: "/Homepage",
                        query: { openServer: true.toString() },
                    } as unknown as string);
                }, 1000);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                switch (error.message) {
                    case "Firebase: Error (auth/email-already-in-use).":
                        toast.error("Email already exists. Please use a different email.");
                        break;
                    case "Firebase: Error (auth/invalid-email).":
                        toast.error("Invalid email format. Please enter a valid email.");
                        break;
                    case "Firebase: Error (auth/weak-password).":
                        toast.error("Weak password. Please use a stronger password.");
                        break;
                    default:
                        toast.error(`Failed to create account: ${error.message}`);
                        break;
                }
            } else {
                toast.error("Failed to create account.");
            }
        }
    };

    return (
        <>
            <ToastContainer />
            <div
                className="min-h-screen flex flex-col w-full bg-center bg-cover "
                style={{ backgroundImage: `url(${BgImage.src})` }}
            >
                <div className="mt-1 lg:mt-1 flex items-center justify-center px-4">
                    <div className="bg-white shadow-lg rounded-2xl px-6 py-2 sm:px-8 w-full sm:w-[60%] lg:w-[40%] mt-4">
                        <h1 className="text-4xl sm:text-4xl font-normal text-center text-[#68A86B] mb-0">
                            T-askLearn
                        </h1>
                        <p className="text-center text-xs sm:text-xs text-[#68A86B] font-normal mb-2 sm:mb-2">
                            Collaborate to Learn, Learn to Collaborate
                        </p>
                        <h2 className="text-2xl sm:text-2xl font-Poppins font-medium text-center text-black mb-3">
                            Create an account
                        </h2>
                        <form onSubmit={handleSubmit} className="font-Poppins">
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 mb-1 text-sm sm:text-base"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border text-black rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 mb-1 text-sm sm:text-base"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={(e) => {
                                        // This regex allows either only letters or a combination of letters and numbers, but not just numbers or special characters
                                        const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])|^[a-zA-Z]+$/;
                                        const value = e.target.value;

                                        // Check for allowed characters (letters and numbers only)
                                        if (/^[a-zA-Z0-9]*$/.test(value) && (regex.test(value) || value === '')) {
                                            handleChange(e); // Update form data if it meets the criteria
                                        }
                                    }}
                                    required
                                    className="w-full px-4 py-2 border text-black rounded-lg"
                                    minLength={3}
                                    maxLength={12}
                                />
                            </div>
                            <div className="mb-4 relative">
                                <div className="flex justify-between">
                                    <label
                                        className="block text-gray-700 mb-1 text-sm sm:text-base"
                                    >
                                        Password
                                    </label>
                                    {
                                        <div className="relative">
                                            <FaInfoCircle
                                                className="mr-[0.8rem] text-gray-700 cursor-pointer"
                                                onClick={toggleInstructions}
                                            />
                                            {showInstructions && (
                                                <div
                                                    ref={instructionsRef}
                                                    className="z-40 absolute right-0 top-full bg-white mt-2 w-64 p-2 border border-gray-300 rounded-lg shadow-lg"
                                                >
                                                    <p
                                                        className={`text-start text-xs ${passwordRequirements.minLength
                                                            ? "text-[#68A86B]"
                                                            : "text-red-500"
                                                            }`}
                                                    >
                                                        Use 8 or more characters
                                                    </p>
                                                    <p
                                                        className={`text-start text-xs ${passwordRequirements.hasUppercase
                                                            ? "text-[#68A86B]"
                                                            : "text-red-500"
                                                            }`}
                                                    >
                                                        Use upper and lower case letters (e.g. Aa)
                                                    </p>
                                                    <p
                                                        className={`text-start text-xs ${passwordRequirements.hasNumber
                                                            ? "text-[#68A86B]"
                                                            : "text-red-500"
                                                            }`}
                                                    >
                                                        Use a number (e.g. 1234)
                                                    </p>
                                                    <p
                                                        className={`text-start text-xs ${passwordRequirements.hasSymbol
                                                            ? "text-[#68A86B]"
                                                            : "text-red-500"
                                                            }`}
                                                    >
                                                        Use a symbol (e.g. !@#$)
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    }
                                </div>
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border text-black rounded-lg"
                                />
                                <div className="top-[40px] flex items-center">
                                    <div
                                        className="absolute right-2 text-gray-700 top-[40px] text-[#666666CC] cursor-pointer"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {passwordVisible ? (
                                            <>
                                                <div className="flex gap-x-1 items-center font-Poppins">
                                                    <AiFillEyeInvisible size={19} />
                                                    <span className="text-[15px]"></span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex gap-x-1 items-center font-Poppins">
                                                    <AiFillEye size={19} />
                                                    <span className="text-[15px]"></span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="relative flex justify-between">
                                    <label
                                        className="block text-gray-700 mb-1 text-sm sm:text-base"
                                    >
                                        Confirm Password
                                    </label>
                                    <div
                                        className="absolute right-2 text-gray-700 top-[40px] text-[#666666CC] cursor-pointer"
                                        onClick={toggleConfirmPasswordVisibility}
                                    >
                                        {confirmPasswordVisible ? (
                                            <>
                                                <div className="flex gap-x-1 items-center font-Poppins">
                                                    <AiFillEyeInvisible className="" size={19} />
                                                    <span className="text-[15px]"></span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex gap-x-1 items-center font-Poppins">
                                                    <AiFillEye className="" size={19} />
                                                    <span className="text-[15px]"></span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <input
                                    type={confirmPasswordVisible ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required={allRequirementsMet}
                                    className="w-full px-4 py-2 border text-black rounded-lg"
                                />
                            </div>

                            <div className="mb-5">
                                <div className="flex justify-between">
                                    <label
                                        htmlFor="jobRole"
                                        className="block text-gray-700 mb-1 text-sm sm:text-base"
                                    >
                                        Job Role
                                    </label>
                                </div>
                                <select
                                    className="w-full py-3 border text-black rounded-lg  "
                                    name="jobRole"
                                    value={formData.jobRole}
                                    onChange={handleChange}
                                    required={
                                        allRequirementsMet &&
                                        formData.password === formData.confirmPassword
                                    }
                                >
                                    <option value="" disabled>
                                        Select a Job Role
                                    </option>
                                    {jobRoleLists.map((role, index) => (
                                        <option key={index} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-5">
                                <label className="block text-gray-700 mb-1 text-sm sm:text-base">
                                    Upload Profile Picture (Optional)
                                </label>
                                <div className="mt-2 flex gap-x-2 text-black items-center">
                                    <label
                                        htmlFor="fileInput"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {formData.profilePic
                                            ? formData.profilePic.name
                                            : "Choose File "}
                                    </label>
                                    <p
                                        className="border border-[#EAEAEA] bg-[#EAEAEA] px-2 w-[108px] flex justify-center items-center cursor-pointer rounded-[5px]"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        Upload
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleChange}
                                    style={{ display: "none" }}
                                    name="profilePic"
                                    accept="image/*"
                                />
                            </div>
                            <div className="mb-4 flex items-center">
                                <input
                                    type="checkbox"
                                    name="termsAccepted"
                                    id="termsAccepted"
                                    checked={termsAccepted}
                                    onChange={handleChange}
                                    className="mr-2 appearance-none h-4 w-4 border border-black rounded-sm checked:bg-[#68A86B] checked:border-transparent focus:outline-none transition duration-200 cursor-pointer relative checked:before:content-['✔'] checked:before:text-white checked:before:absolute checked:before:left-0 checked:before:top-[-5px]"
                                />
                                <label
                                    htmlFor="termsAccepted"
                                    className="text-sm text-gray-600 font-Poppins"
                                >
                                    <a href="#" className="text-[#111111] underline">
                                        Terms of Use
                                    </a>{" "}
                                    and{" "}
                                    <a href="#" className=" text-[#111111] underline">
                                        Privacy Policy
                                    </a>
                                    .
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="mt-1 w-full py-2 rounded-3xl bg-[#68A86B] border border-[#68A86B] text-white hover:bg-green-100 hover:text-black transition duration-300 font-Poppins"
                            >
                                Sign Up
                            </button>
                            <div className="mt-2 text-center">
                                <Link href="/signin"
                                    className="text-black"
                                >
                                    Already have an account? <span className="underline text-[#68A86B]">Login</span>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;