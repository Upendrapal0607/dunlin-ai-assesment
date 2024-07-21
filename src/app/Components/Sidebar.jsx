// "use client"
import React, { useEffect, useState } from 'react'
import { UseContextValue } from '../ContextProvide/ContextProvider'
import { GiHamburgerMenu } from "react-icons/gi";
// import {FetchAllHistory,CostomiseStrins} from "../Controller/controller.js"
import {FetchAllHistory,CostomiseString, DeleteHestory, FetchSingleHistory} from "../lib/utils"
// import axios from 'axios';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
} from '@chakra-ui/react'

export const Sidebar = ({userName,data,setData}) => {
    const {isVisibleSidebar,toggleSidebar} = UseContextValue()
    const [sideBarDisplay,setidebarDisplay] = useState(false);
    // const [ShowHistoryId,setShowHistoryId ] = useState([]);
    const {setShowHistoryId,ShowHistoryId} = UseContextValue();
    const [dislpayUserId,setDisplayedUserId] = useState(false);
    // useEffect(() => {
    //  userName.split("").filter((item,index)=>index=1?item:"")
    // },[userName])
    useEffect(() => {
      if(window.screen.width < 768){
        setidebarDisplay(true)
      }
        window.addEventListener("resize",() => {
            if(window.screen.width < 768){
                setidebarDisplay(true)
            }
            else{
                setidebarDisplay(false)
            }
          })
      },[window.screen.width]);


      const FeatchData = async() => {
        try {
          const Data = await FetchAllHistory(userName)
          const randerData = Data?.data?.map(item=>({id:item?._id,showText:CostomiseString(item?.data[0]?.question)}))
          console.log({Data,randerData});
          setShowHistoryId(randerData)
        } catch (error) {
          console.log({Error: error});
        }
      }
     
      useEffect(() =>{
      
        if(userName){

          FeatchData()
        }
      }, [userName,data])


const HandelDelete = async id => {
  try {
   const res =  await DeleteHestory(id)
  //  console.log({res});
  setData([])
   FeatchData()
   
  } catch (error) {
    console.log({Error: error});
  }
};
const HandleGetSpecialChat = async id => {
  try {
   const res =  await FetchSingleHistory(id)
   setData(res?.data?.data)
   
  } catch (error) {
    console.log({Error: error});
  }
};

const LogedOut =  () => {
  setShowHistoryId([])
};



  return (
 
 <div className={`${
        isVisibleSidebar ? 'visible' : 'hidden'
      } ${sideBarDisplay&&"fixed"} top-0 left-0 b-0 h-screen mt-0 mb-0 rounded-e-lg p-0 w-80 bg-black overflow-y-auto text-white z-50`} >
          {!userName?<><div className='flex justify-between items-center bg-gray-900'>
            {sideBarDisplay&&<GiHamburgerMenu onClick={toggleSidebar} className='text-white mt-3 ml-3 text-3xl'/>}
            <h1 className='text-white px-2 mr-6 py-4 mt-3 ml-3 text-2xl'>DUNLIN-AI</h1>
        
          </div>
          <div className= 'flex flex-col items-center content-center p-4 w-full'>
            <div>
            <p>
            Login for see you history 
            </p>
            <p>
   and update here. 
            </p>
            </div>
        
          </div>
          </>
          :<>
        <div className='flex justify-between flex-wrap items-center border-b-2 md:p-1 p-2 bg-gray-900 border-gray-400'>
       {sideBarDisplay&&<GiHamburgerMenu onClick={toggleSidebar} className='text-white mt-3 ml-3 text-3xl'/>}
      {userName&& <div  className=' text-white text-center md:flex-row flex-col mr-2 md:mb-2 p-3 md:gap-4 rounded-full w-auto bg-gray-400 flex items-center content-center mt-3 ml-3 text-xl'>
        <h1 onMouseEnter={()=>setDisplayedUserId(true)} onMouseLeave={()=>setDisplayedUserId(false)} className='cursor-pointer ml-[3px]'>{dislpayUserId?userName:userName.split("").filter((item,index)=>index<=1?item:"").join("").trim()}</h1>
       </div>}
        </div>
<div className='justify-evenly items-center'>
  {ShowHistoryId?.map(item => <div key={item.id} className='flex px-2 justify-between items-center'>
    <button onClick={()=>HandleGetSpecialChat(item?.id)} className='text-gray-400 block mt-3 ml-3 text-xl'>{item?.showText}</button>
    <Menu className = "">
  {({ isOpen }) => (
    // rightIcon={<ChevronDownIcon />}>
    <>
      <MenuButton isActive={isOpen} className='font-bold text-2xl text-white'>
       {"..."}
      </MenuButton>
      <MenuList>
        <MenuItem>Download</MenuItem>
        <MenuItem onClick={() => HandelDelete(item?.id)}>
        Delete
        </MenuItem>
      </MenuList>
    </>
  )}
</Menu>
  </div>
  )}
 
</div>
</>}
</div> 
  )
}

