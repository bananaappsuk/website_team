import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Tracking = () => {
  const [tasksList, setTasksList] = useState<[]>([]);

  //useEffect for fetch tasks

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`
      );
      if (response.data) {
        setTasksList(response.data);
      }
    } catch (error) {
      toast.error("Error on fetch tasks");
    }
  };
  return (
    <div className="flex flex-col items-center">
      <h1 className=" font-bold text-[20px]">Team</h1>
      <div className="grid grid-cols-2 gap-[3.2rem] font-bold gap-x-[9rem] mt-[2.5rem]">
        <p>Number of pending tasks</p>
        <p className="w-[95px] h-[25px] border border-[#848181] flex justify-center">
          {
            tasksList.filter((task: any) => task.isShared && !task.isDeleted)
              .length
          }
        </p>
        <p>Number of completed tasks</p>
        <p className="w-[95px] h-[25px] border border-[#848181] flex justify-center">
          {
            tasksList.filter((task: any) => task.isCompleted && !task.isDeleted)
              .length
          }
        </p>
        <p>Number of learning tasks</p>
        <p className="w-[95px] h-[25px] border border-[#848181] flex justify-center">
          {" "}
          {
            tasksList.filter((task: any) => task.Learn && !task.isDeleted)
              .length
          }
        </p>
      </div>
    </div>
  );
};

export default Tracking;
