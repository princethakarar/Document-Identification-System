import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Plus } from "lucide-react";

const Sidebar = ({ prevPrompts, onSelectPrompt, onNewChat }) => {
  const [extended, setExtended] = useState(false);
  const [activeChat, setActiveChat] = useState(null);

  const handleSelectPrompt = (prompt) => {
    setActiveChat(prompt.text);
    onSelectPrompt(prompt);
  };

  return (
    <div
      className={`h-screen flex flex-col bg-gray-100 border-r border-gray-300 p-4 transition-all duration-300 ease-in-out shadow-md 
      ${extended ? "w-64" : "w-20"} overflow-hidden`}
    >
      {/* Sidebar Toggle */}
      <div className="flex items-center justify-between">
        <img
          onClick={() => setExtended((prev) => !prev)}
          className="w-8 h-8 cursor-pointer flex-shrink-0"
          src={assets.menu_icon}
          alt="menu"
        />
      </div>

      {/* New Chat Button */}
      <div
        className="flex items-center gap-2 mt-6 p-3 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition"
        onClick={onNewChat}
      >
        <Plus className="w-6 h-6 text-white" />
        <span
          className={`text-sm font-semibold transition-opacity ${
            extended ? "opacity-100" : "opacity-0 hidden"
          }`}
        >
          New Chat
        </span>
      </div>

      {/* Recent Prompts */}
      {extended && prevPrompts.length > 0 && (
        <div className="mt-6">
          <p className="text-gray-500 text-xs uppercase mb-2">Recent</p>
          <div className="space-y-2">
            {prevPrompts.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition 
                ${activeChat === item.text ? "bg-gray-300 font-bold" : "bg-gray-100 hover:bg-gray-200"}`}
                onClick={() => handleSelectPrompt(item)}
              >
                <img src={assets.message_icon} alt="message" className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm truncate w-40">{item.text.slice(0, 20)}...</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Menu */}
      <div className="mt-auto space-y-2">
        <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition">
          <img src={assets.question_icon} alt="help" className="w-5 h-5 flex-shrink-0" />
          {extended && <p className="text-sm">Help</p>}
        </div>
        <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition">
          <img src={assets.history_icon} alt="activity" className="w-5 h-5 flex-shrink-0" />
          {extended && <p className="text-sm">Activity</p>}
        </div>
        <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition">
          <img src={assets.setting_icon} alt="settings" className="w-5 h-5 flex-shrink-0" />
          {extended && <p className="text-sm">Settings</p>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
