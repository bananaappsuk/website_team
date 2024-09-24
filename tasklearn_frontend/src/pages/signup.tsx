import React, { useRef, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import "../app/globals.css";
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
// import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FaInfoCircle } from 'react-icons/fa';
import BgImage from "../../public/assets/Rectangle68.png";

const SignUp: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [passwordVisible, setPasswordVisible] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const instructionsRef = useRef<HTMLDivElement>(null);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        hasUppercase: false,
        hasNumber: false,
        hasSymbol: false,
    });

    // const togglePasswordVisibility = () => {
    //     setPasswordVisible(!passwordVisible);
    // };

    // const toggleConfirmPasswordVisibility = () => {
    //     setConfirmPasswordVisible(!confirmPasswordVisible);
    // };

    const handleClickOutside = (event: MouseEvent) => {
        if (instructionsRef.current && !instructionsRef.current.contains(event.target as Node)) {
            setShowInstructions(false);
        }
    };

    useEffect(() => {
        if (showInstructions) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showInstructions]);

    const toggleInstructions = () => {
        setShowInstructions(!showInstructions);
    };

    const validatePassword = (password: string) => {
        setPasswordRequirements({
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked } = e.target;

        if (name === 'phone') {
            // Allow only digits and limit to 10 digits
            if (/^\+?\d*$/.test(value) && value.length <= 13) {
                setFormData({ ...formData, [name]: value });
            }
        } else if (name === 'termsAccepted') {
            setTermsAccepted(checked);
        } else {
            setFormData({ ...formData, [name]: value });

            if (name === 'password') {
                validatePassword(value);
            }
        }

    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!termsAccepted) {
            toast.error('You must accept the Terms of Use and Privacy Policy.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        if (!(
            passwordRequirements.minLength &&
            passwordRequirements.hasUppercase &&
            passwordRequirements.hasNumber &&
            passwordRequirements.hasSymbol
        )) {
            toast.error('Password does not meet all the requirements.');
            setShowInstructions(true);
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            toast.success('Account created successfully!', { autoClose: 3000 });
            setTimeout(() => {
                router.push('/signin');
            }, 3000);
        } catch (error) {
            if (error instanceof Error) {
                switch (error.message) {
                    case 'Firebase: Error (auth/email-already-in-use).':
                        toast.error('Email already exists. Please use a different email.');
                        break;
                    case 'Firebase: Error (auth/invalid-email).':
                        toast.error('Invalid email format. Please enter a valid email.');
                        break;
                    case 'Firebase: Error (auth/weak-password).':
                        toast.error('Weak password. Please use a stronger password.');
                        break;
                    default:
                        toast.error(`Failed to create account: ${error.message}`);
                        break;
                }
            } else {
                toast.error('Failed to create account.');
            }
        }
    };

    return (
        <>
            <ToastContainer />
            <div
                className="min-h-screen flex flex-col w-full bg-center"
                style={{ backgroundImage: `url(${BgImage.src})` }}>
                <div className='bg-[#E7E7E7] h-12 flex justify-center text-black font-bold text-xl sm:text-2xl items-end'>
                    <p>Affinity</p>
                </div>
                <div className="mt-4 lg:mt-4 flex items-center justify-center px-4">
                    <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full sm:w-[60%] lg:w-[40%]">
                        <h1 className="text-5xl sm:text-5xl font-normal text-center text-[#68A86B] mb-0">T-askLearn</h1>
                        <p className="text-center text-xs sm:text-xs text-[#68A86B] font-normal mb-4 sm:mb-8">Collaborate to Learn, Learn to Collaborate</p>
                        <h2 className="text-xl sm:text-2xl font-semibold text-center text-black mb-4">Create an account</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 mb-1 text-sm sm:text-base">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border text-black rounded-lg"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="phone" className="block text-gray-700 mb-1 text-sm sm:text-base">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border text-black rounded-lg"
                                />
                                <p className="text-xs sm:text-xs text-gray-500 mt-2">
                                    We strongly recommend adding a phone number. This will help verify your account and keep it safe.
                                </p>
                            </div>
                            <div className="mb-4 relative">
                                <div className='flex justify-between'>
                                    <label htmlFor="password" className="block text-gray-700 mb-1 text-sm sm:text-base">
                                        Password
                                    </label>
                                    {/* <div
                                    className="right-3 top-[40px] text-gray-700 cursor-pointer"
                                    onClick={togglePasswordVisibility}
                                >
                                    {passwordVisible ? (
                                        <>
                                            <div className='flex'>
                                                <AiFillEyeInvisible className="mr-1" />
                                                <span className='text-xs'>Hide</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className='flex'>
                                                <AiFillEye className="mr-1" />
                                                <span className='text-xs'>Show</span>
                                            </div>
                                        </>
                                    )}
                                </div> */}
                                </div>
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border text-black rounded-lg"
                                />
                                <div
                                    className="absolute right-0 top-[40px] flex items-center">
                                    <div className="relative">
                                        <FaInfoCircle
                                            className="mr-3 text-black cursor-pointer"
                                            onClick={toggleInstructions}
                                        />
                                        {showInstructions && (
                                            <div
                                                ref={instructionsRef}
                                                className='z-40 absolute right-0 top-full bg-white mt-2 w-64 p-2 border border-gray-300 rounded-lg shadow-lg'>
                                                <p className={`text-start text-xs ${passwordRequirements.minLength ? 'text-[#68A86B]' : 'text-red-500'}`}>
                                                    Use 8 or more characters
                                                </p>
                                                <p className={`text-start text-xs ${passwordRequirements.hasUppercase ? 'text-[#68A86B]' : 'text-red-500'}`}>
                                                    Use upper and lower case letters (e.g. Aa)
                                                </p>
                                                <p className={`text-start text-xs ${passwordRequirements.hasNumber ? 'text-[#68A86B]' : 'text-red-500'}`}>
                                                    Use a number (e.g. 1234)
                                                </p>
                                                <p className={`text-start text-xs ${passwordRequirements.hasSymbol ? 'text-[#68A86B]' : 'text-red-500'}`}>
                                                    Use a symbol (e.g. !@#$)
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className='flex justify-between'>
                                    <label htmlFor="confirmPassword" className="block text-gray-700 mb-1 text-sm sm:text-base">
                                        Confirm Password
                                    </label>
                                    {/* <div
                                    className="right-3 top-[40px] text-gray-700 cursor-pointer"
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    {confirmPasswordVisible ? (
                                        <>
                                            <div className='flex'>
                                                <AiFillEyeInvisible className="mr-1" />
                                                <span className='text-xs'>Hide</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className='flex'>
                                                <AiFillEye className="mr-1" />
                                                <span className='text-xs'>Show</span>
                                            </div>
                                        </>
                                    )}
                                </div> */}
                                </div>
                                <input
                                    type={confirmPasswordVisible ? "text" : "password"}
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border text-black rounded-lg"
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
                                <label htmlFor="termsAccepted" className="text-sm text-gray-600">
                                    I accept the{' '}
                                    <a href="#" className="text-[#68A86B] underline">
                                        Terms of Use
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-[#68A86B] underline">
                                        Privacy Policy
                                    </a>.
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="mt-2 w-full py-2 rounded-3xl bg-[#68A86B] border border-[#68A86B] text-white hover:bg-green-100 hover:text-black transition duration-300"
                            >
                                Sign Up
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUp;
