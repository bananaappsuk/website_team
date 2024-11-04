import { FC, useEffect, useState } from "react";
import React from "react";
import Link from "next/link";
import CreateServerPopup from "../pages/server/CreateServerPopup";
import { useRouter } from "next/router";

interface Server {
  _id: string;
  channelName: string;
  channelImage: string;
  channelType: string;
  createdByUserId: string;
  memberList: string;
}

const SidebarProfile: FC<{ userId: string }> = ({ userId }) => {
  // Make sure to define userId in props
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [servers, setServers] = useState<Server[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isOpenServer, setIsOpenServer] = useState<boolean>(false);
  const { openServer } = router.query;

  useEffect(() => {
    if (openServer !== undefined) {
      const shouldOpenServer = openServer === "true";
      setIsOpenServer(shouldOpenServer);
      if (shouldOpenServer) {
        router.replace(
          {
            pathname: router.pathname,
            query: { ...router.query, openServer: "false" },
          },
          undefined,
          { shallow: true }
        );
      }
    }
  }, [openServer]);

  useEffect(() => {
    if (isOpenServer) {
      setTimeout(() => {
        setIsPopupOpen(true);
        setIsOpenServer(false);
      }, 1000);
    }
  }, [isOpenServer]);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/servers`
        );
        const data = await response.json();
        const userServers = data.filter(
          (server: Server) =>
            server.createdByUserId === userId ||
            server.memberList.includes(userId)
        );
        setServers(userServers); // Set the fetched server data to state
      } catch (error) {
        console.error("Error fetching servers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, [userId]);

  return (
    <aside className="w-[7%] flex flex-col items-center space-y-4 bg-white min-h-screen border">
      <div className="pt-12 text-green-500 text-lg md:text-3xl font-bold">
        <Link href="/Homepage">TL</Link>
      </div>
      {/* <div className="rounded-full overflow-hidden h-6 w-6 md:w-10 md:h-10 lg:w-12 lg:h-12">
                <Image src={Profile} alt="Profile Picture" width={64} height={64} />
            </div> */}
      <div className="flex flex-col space-y-4">
        {servers.map((server) => (
          <div
            key={server._id}
            className="rounded-full overflow-hidden h-6 w-6 md:w-10 md:h-10 lg:w-16 lg:h-16 cursor-pointer"
            onClick={() => router.push(`/server/${server._id}`)}
          >
            <img
              src={server.channelImage}
              alt="serverPic"
              className="bg-cover object-cover w-full h-full rounded-full"
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => setIsPopupOpen(true)}
        className="flex items-center justify-center h-6 w-6 md:w-10 md:h-10 lg:w-16 lg:h-16 bg-gray-300 rounded-full text-3xl text-white"
      >
        +
      </button>
      {isPopupOpen && (
        <CreateServerPopup
          onClose={() => setIsPopupOpen(false)}
          userId={userId}
        /> // Pass userId here
      )}
    </aside>
  );
};

export default SidebarProfile;
