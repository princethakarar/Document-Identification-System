import React, { useState } from 'react';
import { assets } from '../assets/assets';

const Sidebar = ({ prevPrompts, onSelectPrompt }) => {
    const [extended, setExtended] = useState(false);

    return (
        <div className="min-h-screen flex flex-col justify-between bg-gray-100 p-6">
            <div className="flex flex-col">
                <img 
                    onClick={() => setExtended(prev => !prev)} 
                    className="w-5 cursor-pointer mb-4" 
                    src={assets.menu_icon} 
                    alt="menu" 
                />

                {extended && (
                    <div className="flex flex-col">
                        <p className="mt-6 mb-4 text-gray-600 font-semibold">Recent</p>
                        {prevPrompts.map((item, index) => (
                            <div 
                                key={index} 
                                className="flex items-start gap-3 p-3 pr-12 rounded-full text-gray-800 cursor-pointer hover:bg-gray-200 transition"
                                onClick={() => onSelectPrompt(item)}
                            >
                                <img className="w-5" src={assets.message_icon} alt="message" />
                                <p className="truncate">{item.text.slice(0, 20)}...</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
