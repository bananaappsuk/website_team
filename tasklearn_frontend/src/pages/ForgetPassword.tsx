import React, { useState } from "react";
import BgImage from "../../public/assets/Rectangle68.png";
import "../app/globals.css";
import backArrow from "../../src/assets/home/arrow_back.png";
import Image from "next/image";
import { useRouter } from "next/router";
import { getDocs, where, collection, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { FirebaseError } from "firebase/app";
import { sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer } from "react-toastify";

const ForgetPassword: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");

  //check email exists or not

  const checkEmailExists = async (email: any) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const data = await getDocs(q);

    if (data.empty) {
      toast.error("User not found");
    } else {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent");
      setEmail("");
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      checkEmailExists(email);
    } catch (error) {
      if ((error as FirebaseError).code === "auth/user-not-found") {
        toast.error("User not found");
      }
    }
  };
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
            <p className="text-center text-xs sm:text-xs text-[#68A86B] font-normal mb-6 sm:mb-16">
              Collaborate to Learn, Learn to Collaborate
            </p>
            <div
              className="flex gap-x-1 items-center cursor-pointer text-[#67A76B] mb-4 w-[17%]"
              onClick={() => router.push("/signin")}
            >
              <Image
                src={backArrow}
                alt="back"
                width={24}
                height={24}
                className=" object-contain -[#67A76B]"
              />
              <p className=" text-[14px]">Back to Sign in</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-[#646161] mb-7 text-xl sm:text-base"
                >
                  Forgot password, Enter your email ID
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="w-full px-4 py-3 border-black border text-black rounded-lg"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div className=" flex justify-center mt-[3rem]">
                <button
                  type="submit"
                  className="w-[25%] lg:w-[40%] bg-[#68A86B] border border-[#68A86B] text-white py-2 rounded-lg hover:bg-green-100 hover:text-black transition duration-300"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
