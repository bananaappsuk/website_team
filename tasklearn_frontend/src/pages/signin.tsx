/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import "../app/globals.css";
import { ToastContainer } from "react-toastify";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import BgImage from "../../public/assets/Rectangle68.png";
import { getDocs, collection, query, where } from "firebase/firestore";

const SignIn: React.FC = () => {
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });
    const [isUsername, setIsUsername] = useState<boolean>(false);
    const identifierRef = useRef<HTMLInputElement>(null);
    const [emailError, setEmailError] = useState(false);
    const [userNameExists, setUserNameExists] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Redirect if already logged in
        onAuthStateChanged(auth, (user) => {
            if (user) {
                router.replace("/Homepage");  // Prevent going back to sign-in
            }
        });
    }, [router]);

    useEffect(() => {
        if (identifierRef.current) {
            setIsUsername(!identifierRef.current.value.includes("@"));
        }

        const userName = async () => {
            setUserNameExists(false);
            if (isUsername) {
                const q = query(
                    collection(db, "users"),
                    where("userName", "==", formData.identifier)
                );
                const queryDoc = await getDocs(q);

                if (queryDoc.empty) {
                    console.log(queryDoc);

                    setUserNameExists(true);
                }
                if (!queryDoc.empty) {
                    setUserNameExists(false);
                }
            }
            else {
                setUserNameExists(false)
            }
        };


        if (isUsername) {
            userName();
        }
    }, [formData.identifier]);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };


    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // Update the form data
        const { name, value } = e.target;
        // Store cursor position
        const cursorPosition = e.currentTarget.selectionStart;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "identifier") {
            setEmailError(false);
            setIsUsername(!value.includes("@"));
            if (value.includes("@") && !value.split("@")[1]) {
                setEmailError(true);
                return;
            }
            else {
                setUserNameExists(false)
            }
        }

        // Restore cursor position
        requestAnimationFrame(() => {
            if (identifierRef.current) {
                identifierRef.current.setSelectionRange(cursorPosition, cursorPosition);
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError(false);
        try {
            if (
                formData.identifier.includes("@") &&
                !formData.identifier.split("@")[1]
            ) {
                toast.error("Invalid email format");
                setEmailError(true);
                return;
            }
            if (isUsername) {
                const q = query(
                    collection(db, "users"),
                    where("userName", "==", formData.identifier)
                );
                const queryDoc = await getDocs(q);

                if (queryDoc.empty) {
                    toast.error("Username not found");
                    setUserNameExists(true);
                } else {
                    setUserNameExists(false);
                    const userDoc = queryDoc.docs[0].data().email;
                    await signInWithEmailAndPassword(auth, userDoc, formData.password);
                    toast.success("Login successful!");
                    setTimeout(() => {
                        // Retrieve the serverId from localStorage
                        const serverId = localStorage.getItem("serverId");

                        if (serverId) {
                            router.push(`/join/${serverId}`); // Redirect to the server join page
                        } else {
                            router.push("/Homepage"); // Redirect to homepage if no serverId
                        }
                    }, 500);
                }
            }
            if (!isUsername && !emailError) {
                await signInWithEmailAndPassword(
                    auth,
                    formData.identifier,
                    formData.password
                );
                setTimeout(() => {
                    // Retrieve the serverId from localStorage
                    const serverId = localStorage.getItem("serverId");
                    // Redirect to the appropriate page
                    if (serverId) {
                        router.push(`/join/${serverId}`); // Redirect to the server join page
                    } else {
                        router.push("/Homepage"); // Redirect to homepage if no serverId
                    }
                }, 500);
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Firebase Auth Error:", error); // Log the entire error object
            const errorCode = error.code || ""; // Access the error code
            const errorMessage = getFirebaseAuthErrorMessage(errorCode);
            toast.error(errorMessage);
        }
    };

    const getFirebaseAuthErrorMessage = (errorCode: string) => {
        if (errorCode === "auth/user-not-found") {
            return "User not found. Please check your email or sign up.";
        } else if (errorCode === "auth/wrong-password") {
            return "Incorrect Email or Password. Please try again.";
        } else if (errorCode === "auth/invalid-credential" && !isUsername) {
            return "Incorrect Email or Password. Please try again.";
        } else if (errorCode === "auth/invalid-credential" && isUsername) {
            return "Incorrect Username or Password. Please try again.";
        } else if (errorCode === "auth/too-many-requests") {
            return "Too many login attempts. Please try again later.";
        } else if (errorCode === "auth/network-request-failed") {
            return "Network error. Please check your connection.";
        } else {
            return "Login failed. Please try again.";
        }
    };

    return (
        <>
            <ToastContainer />
            <div
                className="min-h-screen flex flex-col w-full bg-center bg-cover"
                style={{ backgroundImage: `url(${BgImage.src})` }}
            >
                <div className="mt-8 sm:mt-12 flex flex-col items-center px-4 sm:px-8">
                    <div className="bg-white shadow-lg rounded-lg pt-8 sm:pt-12 px-6 sm:px-12 pb-12 sm:pb-24 w-full sm:w-[60%] mt-4">
                        <h1 className="text-5xl sm:text-5xl font-normal text-center text-[#68A86B] mb-0">
                            T-askLearn
                        </h1>
                        <p className="text-center text-xs sm:text-xs text-[#68A86B] font-normal mb-8 sm:mb-16">
                            Collaborate to Learn, Learn to Collaborate
                        </p>
                        <form onSubmit={handleSubmit} className="w-90">
                            <div className="flex-col items-center sm:flex-row px-4 md:px-4 lg:px-20 xl:px-40 mb-6">
                                <label
                                    htmlFor="identifier"
                                    className="sm:w-[50%] mb-2 sm:mb-0 text-[#646161]"
                                >
                                    Username or Devlopme email address
                                </label>
                                <input
                                    type="text"
                                    name="identifier"
                                    id="identifier"
                                    ref={identifierRef}
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 mt-2 border border-black rounded-lg text-black"
                                />
                            </div>
                            <div className="mb-4">
                                <div className="flex-col items-center px-4 md:px-4 lg:px-20 xl:px-40 sm:flex-row mb-4">
                                    <label
                                        htmlFor="password"
                                        className="sm:w-[50%] mb-2 sm:mb-0 text-[#646161]"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={passwordVisible ? "text" : "password"}
                                            name="password"
                                            id="password"
                                            value={formData.password}
                                            required={!emailError && !userNameExists}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 mt-2 border border-black rounded-lg text-black"
                                        />
                                        <div
                                            className="absolute right-2 top-[20px] text-gray-700 cursor-pointer"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {passwordVisible ? (
                                                <>
                                                    <div className='flex'>
                                                        <AiFillEyeInvisible className="mr-1" size={19} />
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className='flex'>
                                                        <AiFillEye className="mr-1" size={19} />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="px-4 md:px-4 lg:px-20 xl:px-40 cursor-pointer"
                                onClick={() => router.push("/ForgetPassword")}
                            >
                                <p className="text-[#A0A0A0]">Forgot Password?</p>
                            </div>
                            <div className="flex flex-col mt-[1.5rem] justify-center items-center gap-[0.5rem]">
                                <button
                                    type="submit"
                                    className="w-[25%] lg:w-[12%] bg-[#68A86B] border border-[#68A86B] font-semibold text-white py-1 rounded-lg hover:bg-green-100 hover:text-black transition duration-300"
                                >
                                    Login
                                </button>
                                <p className="text-[#969696]">Or</p>
                                <button
                                    type="button"
                                    onClick={() => router.push("/signup")}
                                    className="w-[54%] lg:w-[20%] bg-[#68A86B] border font-semibold border-[#68A86B] py-1 text-white rounded-lg hover:bg-green-100 hover:text-black transition duration-300"
                                >
                                    Create account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignIn;
