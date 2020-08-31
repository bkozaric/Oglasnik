import React, { useState, useEffect } from 'react';

import "./Profile.css";

const TabPicker = (props) => {

    const [currentTab, setCurrentTab] = useState(props.currentTab);

    const sendNewTabToParent = (newTabId) => {
        props.changeTab(newTabId);
        setCurrentTab(newTabId);
    }



    return (
        <div className="tab-picker">
            <div onClick={() => sendNewTabToParent(0)} className={currentTab === 0 ? "tab-pick-ads highlight-tab" : "tab-pick-ads"}><p>My Ads</p></div>
            <div onClick={() => sendNewTabToParent(1)} className={currentTab === 1 ? "tab-pick-orders highlight-tab" : "tab-pick-orders"}><p>My Orders</p></div>
            <div onClick={() => sendNewTabToParent(2)} className={currentTab === 2 ? "tab-pick-settings highlight-tab" : "tab-pick-settings"}><p>Profile Settings</p></div>
        </div>

    )




}

export default TabPicker;
