import React, { useState } from 'react';
import './sidebar.css';
import { assets } from '../assets/assets';

const Sidebar = ({ prevPrompts }) => {
    const [extended, setExtended] = useState(false);

    return (
        <div className='sidebar'>
            <div className="top">
                <img onClick={() => setExtended(prev => !prev)} className="menu" src={assets.menu_icon} alt="menu" />
                <div className="new-chat">
                    <img src={assets.plus_icon} alt="new chat" />
                    {extended ? <p>New Chat</p> : null}
                </div>
                {extended && (
                    <div className="recent">
                        <p className="recent-title">Recent</p>
                        {prevPrompts.map((item, index) => (
                            <div key={index} className="recent-entry">
                                <img src={assets.message_icon} alt="message" />
                                <p>{item.slice(0, 20)}...</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="bottom">
                <div className="bottom-item recent-entry">
                    <img src={assets.question_icon} alt="help" />
                    {extended ? <p>Help</p> : null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.history_icon} alt="activity" />
                    {extended ? <p>Activity</p> : null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.setting_icon} alt="settings" />
                    {extended ? <p>Settings</p> : null}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
