import React, { useContext, useState, useRef, useEffect, useCallback } from "react";
import {
  BsPlus,
  BsFillLightningFill,
  BsGearFill,
  BsSearch,
  BsArchive,
} from "react-icons/bs";
import { FaFire, FaPoo, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { TbCircleDashed } from "react-icons/tb";
import {
  AiOutlineArrowLeft,
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineSearch,
} from "react-icons/ai";
import { CiUser } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { ChatContext } from "../context/ChatContext";
import { GoSignOut } from "react-icons/go";
import useComponentVisible from '../hooks/useComponentVisible';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserCard from "./UserCard";


const ShowAccount = React.forwardRef(({ isOpen,user}, ref) => {
  const navigate = useNavigate();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -100,y : 100,scale: 0 }}
          animate={{ x:30 ,y: -250,scale: 1 }}
          exit={{ x:-100, y : 100,scale:0 }}
          transition={{ type: "tween", duration: 0.25, stiffness: 100 }}
        >
            <div ref={ref} className="h-96 w-96 bg-zinc-900 p-2 rounded-md z-10 absolute shadow-lg flex flex-col justify-around items-center">
                <img src={user.pic} className="rounded-full w-40 h-40"/>
                <div className="w-full h-40 flex flex-col justify-around items-center">
                  <div className="text-[#ffea20] text-base flex flex-row justify-between items-start w-[80%]">
                    Your Name
                    <span className="text-white">{user.name}</span>
                  </div>
                  <div className="text-[#ffea20] text-base flex flex-row justify-between items-start w-[80%]">
                    Email
                    <span className="text-white">{user.email}</span>
                  </div>
                </div>
                <SideBarIcon icon={<FaSignOutAlt size="20" />} text="Log Out" onClick={()=>{
                  localStorage.removeItem("userInfo");
                  navigate('/');
                }}/>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

function useOutsideAlerter(ref,{setIsOpen,isOpen}) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
const ArrowIcon = ({ icon, onClick }) => {
  return (
    <div className="text-[#FFEA20] ml-3 hover:cursor-pointer" onClick={onClick}>
      {icon}
    </div>
  );
};


const SideBar = ({ toggle, setToggle,createGc,setCreateGc })=>{
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  useOutsideAlerter(ref,{isOpen,setIsOpen});
  const { user } = useContext(ChatContext);
  return (
    <div className="fixed flex flex-col justify-between items-center top-0 m-0 left-0 h-screen w-16 bg-zinc-900 text-white shadow-xl">
      <div className="mt-1">
        <SideBarIcon
          icon={<AiOutlineSearch size="24" />}
          text="Search"
          onClick={() => {
            if(!toggle) setToggle(true);
          }}
        />
        <SideBarIcon icon={<BsArchive size="20" />} text="Archived" />
        <SideBarIcon icon={<TbCircleDashed size="25" />} text="Status" />
        <SideBarIcon icon={<BsPlus size="32" />} text="New Group" onClick={()=>{
          if(!createGc) setCreateGc(true);
        }}/>
      </div>
      <div className="flex flex-row">
        <div className="mb-1">
          <SideBarIcon icon={<AiOutlineSetting size="25" />} text="Settings" />
          <SideBarIcon icon={<AiOutlineUser size="24" />} text="Profile" onClick={()=>{
              setIsOpen(!isOpen);
          }} isOpen={isOpen}/>
        </div>
        <ShowAccount isOpen={isOpen} user={user} ref={ref}/>
      </div>
    </div>
  );
}



function SideBarIcon({ icon, text = "Gomu Gomu No Bazooka", onClick,isOpen}) {
  return (
    <div className="sidebar-icon group" onClick={onClick}>
      {icon}
      {
        !isOpen && 
        <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
      }
    </div>
  );
}

export default SideBar;