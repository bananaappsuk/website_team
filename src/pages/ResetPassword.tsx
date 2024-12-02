/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef, useState } from "react";
import BgImage from "../../public/assets/Rectangle68.png";
import "../app/globals.css";
import backArrow from "../../src/assets/home/arrow_back.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaInfoCircle } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../firebase";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";


interface FormData {
    newPassword: string;
    confirmNewPassword: string;
}

const ResetPassword: React.FC = () => {
    const router = useRouter();
    const [showInstructions, setShowInstructions] = useState(false);
    const instructionsRef = useRef<HTMLDivElement>(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [oobCode, setOobCode] = useState<string | null>(null);

    const [formInputs, setFormInputs] = useState<FormData>({
        newPassword: "",
        confirmNewPassword: "",
    });

    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        hasUppercase: false,
        hasNumber: false,
        hasSymbol: false,
    });

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            instructionsRef.current &&
            !instructionsRef.current.contains(event.target as Node)
        ) {
            setShowInstructions(false);
        }
    };

    const validateNewPassword = (password: string) => {
        setPasswordRequirements({
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormInputs({ ...formInputs, [name]: value });

        if (name === "newPassword") {
            validateNewPassword(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
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

            if (formInputs.newPassword !== formInputs.confirmNewPassword) {
                toast.error("Passwords do not match!");
            }

            if (!oobCode) {
                toast.error("Invalid password reset link.");
                return;
            }
            if (formInputs.newPassword === formInputs.confirmNewPassword) {
                await confirmPasswordReset(auth, oobCode, formInputs.newPassword);
                setFormInputs({
                    newPassword: "",
                    confirmNewPassword: "",
                });
                toast.success("Password reset successfully.", { autoClose: 2000 });
                setTimeout(() => {
                    router.push("/signin");
                }, 2000);
                return;
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

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

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const code = query.get("oobCode");
        if (code) {
            setOobCode(code);
        }
        if (!code) {
            router.push("/signin");
        }
    }, []);

    return (
        <>
            <ToastContainer />
            <div
                className="min-h-screen flex flex-col w-full bg-center bg-cover"
                style={{ backgroundImage: `url(${BgImage.src})` }}
            >
                <div className="mt-[6rem]  flex flex-col items-center px-4 sm:px-8">
                    <div className="bg-white shadow-lg rounded-lg pt-8 sm:pt-12 px-6 sm:px-12 pb-12 sm:pb-24 w-full sm:w-[60%] mt-4 min-h[500px]">
                        <h1 className="text-5xl sm:text-5xl font-normal text-center text-[#68A86B] mb-0">
                            T-askLearn
                        </h1>
                        <p className="text-center text-xs sm:text-xs text-[#68A86B] font-normal mb-6 sm:mb-10">
                            Collaborate to Learn, Learn to Collaborate
                        </p>
                        <div
                            className="pl-3 sm:pl-3 lg:pl-20 xl:pl-40 flex gap-x-1 items-center cursor-pointer text-[#67A76B] mb-4 w-[50%]"
                            onClick={() => router.push("/signin")}
                        >
                            <Image
                                src={backArrow}
                                alt="back"
                                width={16}
                                height={16}
                                className=" object-contain -[#67A76B]"
                            />
                            <p className="ml-2 text-[14px]">Back to Sign in</p>
                        </div>
                        <form onSubmit={handleSubmit} className="px-4 md:px-4 lg:px-20 xl:px-40">
                            <div className="flex-col items-center sm:flex-row mb-6 relative">
                                <div className="flex justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-[#646161] mb-3 sm:mb-4 xl:mb-5 text-sm sm:text-[16.5px]"
                                    >
                                        Enter your new password here
                                    </label>
                                    {
                                        <div className="relative">
                                            <FaInfoCircle
                                                className="mr-[0.8rem] mt-[0.1rem] md:mt-1 text-gray-700 cursor-pointer"
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
                                    name="newPassword"
                                    placeholder="New password"
                                    id="newPassword"
                                    value={formInputs.newPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-black text-black rounded-lg"
                                />
                                <div className="top-[40px] flex items-center">
                                    <div
                                        className="absolute right-2 text-gray-700 top-[42px] sm:top-[47px] xl:top-[52px] text-[#666666CC] cursor-pointer"
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
                            <div className="flex-col items-center sm:flex-row mb-6">
                                <div className="relative flex justify-between">
                                    <div
                                        className="absolute right-2 text-gray-700 top-[11px] text-[#666666CC] cursor-pointer"
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
                                    name="confirmNewPassword"
                                    id="confirmNewPassword"
                                    placeholder="Re-enter password"
                                    value={formInputs.confirmNewPassword}
                                    onChange={handleChange}
                                    required={
                                        passwordRequirements.hasNumber &&
                                        passwordRequirements.hasSymbol &&
                                        passwordRequirements.hasUppercase &&
                                        passwordRequirements.minLength
                                    } className="w-full px-4 py-2 border border-black text-black rounded-lg"
                                />
                            </div>
                            <div className="flex justify-center mt-[2.5rem]">
                                <button
                                    type="submit"
                                    className="w-[35%] lg:w-[25%] font-semibold bg-[#68A86B] border border-[#68A86B] text-white py-1 rounded-lg hover:bg-green-100 hover:text-black transition duration-300"
                                >
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResetPassword;