import React, { useState } from 'react';
import './sidebar.css';
import { assets } from '../assets/assets';

const Sidebar = ({ prevPrompts, onSelectPrompt }) => {
    const [extended, setExtended] = useState(false);

    return (
        <div className='sidebar'>
            <div className="top">
                <img onClick={() => setExtended(prev => !prev)} className="menu" src={assets.menu_icon} alt="menu" />
                {extended && (
                    <div className="recent">
                        <p className="recent-title">Recent</p>
                        {prevPrompts.map((item, index) => (
                            <div 
                                key={index} 
                                className="recent-entry" 
                                onClick={() => onSelectPrompt(item)} // Pass full item object
                            >
                                <img src={assets.message_icon} alt="message" />
                                <p>{item.text.slice(0, 20)}...</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
