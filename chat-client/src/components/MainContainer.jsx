import React, { createContext, useState } from 'react'
import './myStyles.css'
import Sidebar from './Sidebar'

import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';

export const myContext = createContext();

const MainContainer = () => {
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  const [refresh, setRefresh] = useState(true);

  const triggerRefresh = () => {
    setRefresh(true);
  };
  
  
  return (
    <div className={"main-container" + (lightTheme ? "" : " dark")}>
      <myContext.Provider value={{ refresh: refresh, setRefresh: setRefresh, triggerRefresh: triggerRefresh }}>
      <Sidebar />
      <Outlet />
      </myContext.Provider>
        
        {/* <ChatArea props={consverations[0]}/> */}
        {/* <Welcome /> */}
        {/* <CreateGroups /> */}
        {/* <Users /> */}
        {/* <Groups /> */}
        
       
      
    </div>
  )
}

export default MainContainer
