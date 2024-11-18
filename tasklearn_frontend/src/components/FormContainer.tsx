import React from "react";
import { useTask } from "../components/TaskContext";

type Props = {
    selectedTask: boolean;
    handleShare: (e: React.FormEvent) => Promise<void>;
    handleComplete: (e: React.FormEvent) => Promise<void>;
};
interface TaskSectionProps {
  server: { serverId: string; serverName: string } | null;
}

type combinedProps = TaskSectionProps & Props;

const FormContainer: React.FC<combinedProps> = ({
  server,
  selectedTask,
  handleShare,
  handleComplete,
}) => {
  const { task, setTask, patientIdLoading } = useTask();

console.log("all task" + " " +task.patientId);



  return (
    <div>
      {server  ? (
        <form className="p-4 rounded">
          <div className="flex flex-col gap-4">
            <div className=" relative">
              <div className="flex items-center border border-gray p-1 rounded-md">
                <label className="whitespace-nowrap mr-2 text-[#666666]">
                  Patient ID:
                </label>
                <input
                  type="text"
                  className={`flex-1 outline-none text-black ${"cursor-default"}`}
                  value={task.patientId}
                  required
                  readOnly
                />
              </div>
            </div>
            <div className="relative">
              <div className="flex items-center border border-gray p-1 rounded-md">
                <label className="whitespace-nowrap mr-2 text-[#666666]">
                  Created by:
                </label>
                <input
                  type="text"
                  placeholder="@ Username"
                  className={`flex-1 outline-none text-black ${
                    selectedTask ? "cursor-default" : ""
                  }`}
                  value={task.createdBy}
                  onChange={(e) =>
                    setTask({ ...task, createdBy: e.target.value })
                  }
                  required
                  readOnly={selectedTask}
                />
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center border border-gray p-1 rounded-md">
                <label className="whitespace-nowrap mr-2 text-[#666666]">
                  Tag staff for help / Completion :
                </label>
                <input
                  type="text"
                  placeholder="@ Username"
                  className={`flex-1 outline-none text-black ${
                    selectedTask ? "cursor-default" : ""
                  }`}
                  value={task.taggedStaff}
                  onChange={(e) =>
                    setTask({ ...task, taggedStaff: e.target.value })
                  }
                  required
                  readOnly={selectedTask}
                />
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center border border-gray p-1 rounded-md">
                <label className="whitespace-nowrap mr-2 text-[#666666]">
                  Contributing Staff:
                </label>
                <input
                  type="text"
                  placeholder="@ Username"
                  className={`flex-1 outline-none  text-black ${
                    selectedTask ? "cursor-default" : ""
                  }`}
                  value={task.contributingStaff}
                  onChange={(e) =>
                    setTask({
                      ...task,
                      contributingStaff: e.target.value,
                    })
                  }
                  required
                  readOnly={selectedTask}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-[#666666]">
                {" "}
                Task Name/Instructions
              </label>
              <input
                type="text"
                placeholder=""
                className={`w-full input-field border border-gray p-1 rounded-md text-black ${
                  selectedTask ? "outline-none cursor-default" : ""
                }`}
                value={task.taskName}
                onChange={(e) => setTask({ ...task, taskName: e.target.value })}
                required
                readOnly={selectedTask}
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1 text-[#666666]">History</label>
              <textarea
                placeholder=""
                className={`w-full input-field border border-gray p-1 rounded-md text-black ${
                  selectedTask ? "outline-none cursor-default" : ""
                }`}
                value={task.history}
                onChange={(e) => setTask({ ...task, history: e.target.value })}
                required
                readOnly={selectedTask}
              />
            </div>
            <div className="flex gap-4 w-full">
              <div className="flex-1">
                <label className="block mb-1 text-[#666666]">Examination</label>
                <textarea
                  placeholder=""
                  className={`w-full border border-gray p-1 rounded-md text-black ${
                    selectedTask ? "outline-none cursor-default" : ""
                  }`}
                  value={task.examination}
                  onChange={(e) =>
                    setTask({ ...task, examination: e.target.value })
                  }
                  required
                  readOnly={selectedTask}
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-[#666666]">Diagnosis</label>
                <textarea
                  placeholder=""
                  className={`w-full border border-gray p-1 rounded-md text-black ${
                    selectedTask ? "outline-none cursor-default" : ""
                  }`}
                  value={task.diagnosis}
                  onChange={(e) =>
                    setTask({ ...task, diagnosis: e.target.value })
                  }
                  required
                  readOnly={selectedTask}
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block mb-1 text-[#666666]">Plan</label>
              <textarea
                placeholder=""
                className={`w-full input-field border border-gray p-1 rounded-md text-black ${
                  selectedTask ? "outline-none cursor-default" : ""
                }`}
                value={task.plan}
                onChange={(e) => setTask({ ...task, plan: e.target.value })}
                required
                readOnly={selectedTask}
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1 text-[#666666]">Follow Up</label>
              <textarea
                placeholder=""
                className={`w-full input-field border border-gray p-1 rounded-md text-black ${
                  selectedTask ? "outline-none cursor-default" : ""
                }`}
                value={task.followUp}
                onChange={(e) => setTask({ ...task, followUp: e.target.value })}
                required
                readOnly={selectedTask}
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1 text-[#666666]">
                Post Consultation
              </label>
              <textarea
                placeholder=""
                className={`w-full input-field border border-gray p-1 rounded-md text-black ${
                  selectedTask ? "outline-none cursor-default" : ""
                }`}
                value={task.postConsultation}
                onChange={(e) =>
                  setTask({ ...task, postConsultation: e.target.value })
                }
                required
                readOnly={selectedTask}
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1 text-[#666666]">Feedback</label>
              <textarea
                placeholder=""
                className={`w-full input-field border border-gray p-1 rounded-md text-black ${
                  selectedTask ? "outline-none cursor-default" : ""
                }`}
                value={task.feedback}
                onChange={(e) => setTask({ ...task, feedback: e.target.value })}
                required
                readOnly={selectedTask}
              />
            </div>
            <div className="flex gap-4 w-full">
              <div className="flex-1">
                <label className="block mb-1 text-[#666666]">
                  Key Learning Points
                </label>
                <textarea
                  placeholder="Enter why this task is being done"
                  className={`w-full border border-gray py-10 px-2 text-center rounded-md text-black ${
                    selectedTask ? "outline-none cursor-default" : ""
                  }`}
                  value={task.keyLearningPoint}
                  onChange={(e) =>
                    setTask({ ...task, keyLearningPoint: e.target.value })
                  }
                  readOnly={selectedTask}
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-[#666666]">Action</label>
                <textarea
                  placeholder="Enter how this task should be done"
                  className={`w-full border border-gray py-10 px-2 text-center rounded-md text-black ${
                    selectedTask ? "outline-none cursor-default" : ""
                  }`}
                  value={task.action}
                  onChange={(e) => setTask({ ...task, action: e.target.value })}
                  readOnly={selectedTask}
                />
              </div>
            </div>
          </div>

          <div
            className={`flex mt-4 relative ${
              task?.isShared || task?.isCompleted || task?.isDeleted
                ? "justify-center"
                : "justify-between"
            }`}
          >
            <button
              type="submit"
              onClick={handleShare}
              className={`btn-submit bg-[#68A86B] border border-[#68A86B] text-white py-1 px-7 rounded-lg hover:bg-green-100 hover:text-black transition duration-300 ${
                task?.isShared || task?.isCompleted || task?.isDeleted
                  ? "hidden"
                  : "block"
              }`}
            >
              Share
            </button>
            <label className="block mb-2 text-black font-bold">
              <input
                type="checkbox"
                className={`mr-2 appearance-none h-4 w-4 border rounded-sm checked:bg-[#68A86B] checked:border-transparent focus:outline-none transition duration-200  relative checked:before:content-['✔'] checked:before:text-white checked:before:absolute checked:before:left-0 checked:before:top-[-5px] ${
                  selectedTask ? "cursor-default" : "cursor-pointer"
                }`}
                checked={task.Library}
                onChange={(e) =>
                  setTask({ ...task, Library: e.target.checked })
                }
                disabled={selectedTask}
              />
              Library
            </label>
            <label
              className={`block mb-2 text-black font-bold ${
                task?.isShared || task?.isCompleted || task?.isDeleted
                  ? "absolute right-0"
                  : ""
              }`}
            >
              <input
                type="checkbox"
                className={`mr-2 appearance-none h-4 w-4 border rounded-sm checked:bg-[#68A86B] checked:border-transparent focus:outline-none transition duration-200 relative checked:before:content-['✔'] checked:before:text-white checked:before:absolute checked:before:left-0 checked:before:top-[-5px] ${
                  selectedTask ? "cursor-default" : "cursor-pointer "
                }`}
                checked={task.Learn}
                onChange={(e) => setTask({ ...task, Learn: e.target.checked })}
                disabled={selectedTask}
              />
              Learn
            </label>
          </div>
          <div className="flex mt-2 justify-center">
            <p className="text-[#797878]">
              messages about task during supervision/collaboration
            </p>
          </div>
          <div className="flex mt-4 justify-center">
            <button
              type="button"
              onClick={handleComplete}
              className={`w-[20%] btn-submit bg-[#68A86B] border border-[#68A86B] text-white py-1 px-7 rounded-lg hover:bg-green-100 hover:text-black transition duration-300 ${
                task?.isCompleted || task?.isDeleted ? "hidden" : "block"
              }`}
            >
              Complete
            </button>
          </div>
        </form>
      ) : (
        <div className="flex items-center justify-between px-4 py-1 text-black">
          {" "}
          Select a server
        </div>
      )}
    </div>
  );
};

export default FormContainer;