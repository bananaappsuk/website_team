import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import "../app/globals.css";
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';

const SignUp: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: '',
    });

    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        hasUppercase: false,
        hasNumber: false,
        hasSymbol: false,
    });

    const validatePassword = (password: string) => {
        setPasswordRequirements({
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'password') {
            validatePassword(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Check if password meets all criteria
        if (!(
            passwordRequirements.minLength &&
            passwordRequirements.hasUppercase &&
            passwordRequirements.hasNumber &&
            passwordRequirements.hasSymbol
        )) {
            toast.error('Password does not meet all the requirements.');
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

    const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        // Only allow digits and ensure the length is 10
        const validValue = value.replace(/[^0-9]/g, '');
        
        if (validValue.length <= 10) {
            setFormData({ ...formData, phone: validValue });
        }
    };

    return (
        <>
            <ToastContainer />
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
                                type="text"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleNumberInput}
                                required
                                maxLength="10"
                                className="w-full px-4 py-2 border text-black rounded-lg"
                            />
                            <p className="text-xs sm:text-xs text-gray-500 mt-2">
                                Please enter a 10-digit phone number.
                            </p>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 mb-1 text-sm sm:text-base">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border text-black rounded-lg"
                            />
                            <div className='mt-2'>
                                <div className='flex flex-col xl:flex-row justify-between'>
                                    <p className={`text-start text-xs mt-2 ${passwordRequirements.minLength ? 'text-green-500' : 'text-gray-600'}`}>
                                        Use 8 or more characters
                                    </p>
                                    <p className={`text-start text-xs mt-4 xl:mt-2 ${passwordRequirements.hasUppercase ? 'text-green-500' : 'text-gray-600'}`}>
                                        Use upper and lower case letters (e.g. Aa)
                                    </p>
                                </div>
                                <div className='flex flex-col xl:flex-row gap-4 xl:gap-[177px]'>
                                    <p className={`text-start text-xs mt-4 ${passwordRequirements.hasNumber ? 'text-green-500' : 'text-gray-600'}`}>
                                        Use a number (e.g. 1234)
                                    </p>
                                    <p className={`text-start text-xs xl:mt-4 ${passwordRequirements.hasSymbol ? 'text-green-500' : 'text-gray-600'}`}>
                                        Use a symbol (e.g. !@#$)
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="mt-4 w-full py-2 rounded-3xl bg-[#68A86B] border border-[#68A86B] text-white hover:bg-green-100 hover:text-black transition duration-300"
                        >
                            Sign Up
                        </button>
                        <p className="text-sm text-gray-600 text-center mt-4">
                            By creating an account, you agree to the{' '}
                            <a href="#" className="text-[#68A86B] hover:underline">
                                Terms of Use
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-[#68A86B] hover:underline">
                                Privacy Policy
                            </a>.
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SignUp;
