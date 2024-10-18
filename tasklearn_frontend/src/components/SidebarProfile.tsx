import Image from "next/image";
import { FC } from "react";
import Profile from "../../src/assets/home/Ellipse 1.png";
import React from "react";

const SidebarProfile:FC = () => {
  return (
    <aside className="w-[7%] flex flex-col items-center space-y-4 bg-white min-h-screen border">
      <div className="pt-12 text-green-500 text-lg md:text-3xl font-bold">
        <a href="/Homepage">TL</a>
      </div>
      <div className="rounded-full overflow-hidden h-6 w-6 md:w-10 md:h-10 lg:w-12 lg:h-12">
        <Image src={Profile} alt="Profile Picture" width={64} height={64} />
      </div>

      <button className="flex items-center justify-center h-6 w-6 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gray-300 rounded-full text-3xl text-white">
        +
      </button>
    </aside>
  );
};

export default SidebarProfile;
