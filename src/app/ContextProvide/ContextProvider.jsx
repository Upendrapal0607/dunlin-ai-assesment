"use client"
import React, { createContext, useContext, useState } from 'react'
export const AllContextProvider = createContext();

export const ContextProvider = ({children}) => {
    const [isVisibleSidebar,setIsVisibleSide] = useState(true);
    const [isAuth, setIsAuth] = useState(false);
    const [userName, seUserName] = useState("");
    const [sideBarDisplay,setidebarDisplay] = useState(false);
    const toggleSidebar = () => setIsVisibleSide(!isVisibleSidebar);
    const [ShowHistoryId,setShowHistoryId ] = useState([]);
    const toggleSidebarBaseOnScreen = (isTrue) => setIsVisibleSide(isTrue);

  return (
    <AllContextProvider.Provider value={{sideBarDisplay,setidebarDisplay,setShowHistoryId,ShowHistoryId,isAuth,setIsAuth,seUserName,userName,toggleSidebar,isVisibleSidebar,toggleSidebarBaseOnScreen}}>
        {children}
    </AllContextProvider.Provider >
  )
}

export const UseContextValue = () => {
return useContext(AllContextProvider);
};