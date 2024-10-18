import React from "react";
import Image from "next/image";
import { HiChevronRight } from "react-icons/hi";
import deleteIcon from "../assets/Quiz/Vector.png";
import { HiChevronDown } from "react-icons/hi";
import { useTask } from "../components/TaskContext";
import axios from "axios";
import { toast } from "react-toastify";

type Props = {
  selectedTask: boolean;
  setselectedTask: React.Dispatch<React.SetStateAction<boolean>>;
  taskCategories: string[];
  filteredTasks: any[];
  dropdownVisible: boolean[];
  setDropdownVisible: React.Dispatch<React.SetStateAction<boolean[]>>;
  handleTasksClick: (arg: string) => void;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  filter: string;
  fetchTasks: (args: string) => void;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
};

const TaskSection: React.FC<Props> = ({
  setselectedTask,
  selectedTask,
  taskCategories,
  filteredTasks,
  dropdownVisible,
  setDropdownVisible,
  handleTasksClick,
  setShowForm,
  filter,
  setFilter,
  fetchTasks,
}) => {
  const { task, setTask } = useTask();
  const handleDropdown = (index: any) => {
    setselectedTask(false);
    const newDropdownVisible = dropdownVisible.map((isVisible, i) =>
      i === index ? !isVisible : isVisible
    );
    setDropdownVisible(newDropdownVisible);
  };

  const fetchTaskById = async (taskId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/task/${taskId}`
      );

      if (response) {
        setTask(response.data);

        if (response.data._id === taskId) {
          setselectedTask(true);
          setShowForm(true);
        } else {
          setselectedTask(false);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteTask = async (id: String, filter: any) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setFilter((prevFilter) => {
          if (prevFilter === "Pending Task") {
            return "Pending Task";
          } else if (prevFilter === "Completed Task") {
            return "Completed Task";
          } else if (prevFilter === "Learning") {
            return "Learning";
          } else {
            return "All Task";
          }
        });
        fetchTasks(filter);
        fetchTasks("Deleted Task");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  //delete the task from dB

  const handleDeletedTask = async (taskId: String) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${taskId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        fetchTasks(filter);
        fetchTasks("Deleted Task");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = (newItem: any, filter: any) => {
    if (!newItem.isDeleted) {
      handleDeleteTask(newItem._id, filter);
    }
    if (newItem.isDeleted) {
      handleDeletedTask(newItem._id);
    }
  };

  console.log(filter);

  return (
    <div>
      <ul className="p-4 space-y-4">
        {taskCategories.map((item: any, index: any) => (
          <>
            <li
              key={item}
              onClick={() => {
                handleTasksClick(item);
                handleDropdown(index);
              }}
              className="flex justify-between items-center text-gray-600 hover:text-black hover:font-semibold cursor-pointer"
            >
              {item}
              {dropdownVisible[index] ? <HiChevronDown /> : <HiChevronRight />}
            </li>
            {dropdownVisible[index] &&
              filteredTasks[item]?.map((newItem: any, index: any) => {
                return (
                  <div
                    key={index}
                    className={`text-black justify-between flex `}
                  >
                    <p
                      className={`cursor-pointer hover:text-[#68A86B] ${
                        selectedTask && newItem._id === task?._id
                          ? "text-[#68A86B]"
                          : ""
                      }`}
                      onClick={() => fetchTaskById(newItem._id)}
                    >
                      {newItem?.taskName}
                    </p>
                    <Image
                      className=" object-contain w-[16px] cursor-pointer"
                      src={deleteIcon}
                      alt="delete"
                      onClick={() => handleDelete(newItem, item)}
                    />
                  </div>
                );
              })}
          </>
        ))}
      </ul>
    </div>
  );
};

export default TaskSection;
