import React, { useState, useContext, useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import { ChatContext } from "../context/ChatContext";
import useComponentVisible from "../hooks/useComponentVisible";
import { AnimatePresence, motion } from "framer-motion";
import UserBadge from "./UserBadge";
import axios from "axios";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function useOutsideAlerter(ref, handleClose) {
  useEffect(() => {
    function handleClickOutside(event) {
      // console.log(ref);
      if (ref.current && !ref.current.contains(event.target)) {
        handleClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

const ProfileModal = () => {
  const ref = useRef(null);
  const { profileOpen, handleClose, selectedChat, user, setSelectedChat,fetchAgain,setFetchAgain,fetchMessageAgain,setFetchMessageAgain } =
    useContext(ChatContext);
  useOutsideAlerter(ref, handleClose);
  const getImage = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
  };
  const getName = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };
  const getEmail = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].email : users[0].email;
  };
  const getDate = (loggedUser, users) => {
    if (users[0]._id === loggedUser._id) {
      const dateString = users[1].createdAt;
      const dateObject = new Date(dateString);
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = dateObject.toLocaleDateString("en-US", options);
      return formattedDate;
    } else {
      const dateString = users[0].createdAt;
      const dateObject = new Date(dateString);
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = dateObject.toLocaleDateString("en-US", options);
      return formattedDate;
    }
  };
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const handleChange = async (e) => {
    const { value } = e.target;
    setSearch(value);

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`http://13.127.80.208:5000/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };
  const handleNameChange = (e)=>{
    const { value } = e.target;
    setGroupChatName(value);
  }
  const handleRename = async() => {
    if(!groupChatName) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.put("http://13.127.80.208:5000/api/chat/rename",{
        chatId: selectedChat._id,
        chatName: groupChatName,
      },config);

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);

    } catch (error) {
      console.log("Error Occurred!!!");
      setGroupChatName("");
    }
  };
  const handleAddUser = async (user1) => {
    if(selectedChat.users.find((u) => u._id === user1._id)){
      console.log("User already in the group");
      return;
    }
    if(selectedChat.groupAdmin._id !== user._id){
      console.log("You don't have the Authority");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.put("http://13.127.80.208:5000/api/chat/groupadd",{
        chatId: selectedChat._id,
        userId: user1._id,
      },config);

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);

    } catch (error) {
      console.log("Error adding in group!!!");
    }
  };
  const handleRemove = async (user1) => {
    if(selectedChat.groupAdmin._id !== user._id){
      console.log("Only admins can remove someone!!!");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.put("http://13.127.80.208:5000/api/chat/groupremove",{
        chatId: selectedChat._id,
        userId: user1._id,
      },config);

      user1._id === user._id ? setSelectedChat(data) : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setFetchMessageAgain(!fetchMessageAgain);
    } catch (error) {
      console.log("Error adding in group!!!");
    }
  };

  return (
    profileOpen && (
          <div className="z-10 w-full h-full fixed flex justify-center items-center backdrop-blur">
            {selectedChat.isGroupChat ? (
              <div
                className="w-[40%] h-[80%] bg-zinc-700 rounded-sm flex flex-col justify-start items-start text-[#ffea20] -mt-16"
                ref={ref}
              >
                <div className="flex flex-col justify-start items-start w-full h-[50%]">
                  <div className="flex justify-center bg-black blur-[1px] w-full h-full">
                    <img
                      src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                      alt="img"
                      className="h-auto"
                    />
                  </div>
                  <label className="text-3xl text-white font-semibold shadow-lg pl-4 -mt-16 z-10">{`${selectedChat.chatName}`}</label>
                </div>

                <div className="flex flex-col justify-start items-start w-full h-[40%]">
                  <div className="flex flex-col items-start w-full mt-4 p-2">
                    <label className="text-lg mb-1 pl-2 text-zinc-200">
                      Participants
                    </label>
                    <div className="flex flex-row justify-start w-full overflow-x-auto invisibleScrollBar">
                      {selectedChat.users.map((u) => (
                        <UserBadge
                          user={u}
                          handleFunction={()=>handleRemove(u)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="w-full flex flex-row justify-around items-center px-2 pb-1">
                    <input
                      type="text"
                      value={groupChatName}
                      placeholder="It's Your group name"
                      className="w-[80%] py-6 rounded-md mx-2 mr-4 h-10 px-6 bg-zinc-900 outline-none text-white placeholder:text-md placeholder:text-zinc-500 focus:bg-zinc-800"
                      onChange={handleNameChange}
                    />
                    <button
                      className="text-black my-2 border border-black bg-[#FFEA20] shadow-md hover:border hover:border-[#FFEA20] hover:bg-black active:bg-black focus:outline-none focus:ring-2 focus:bg-black focus:text-[#FFEA20] focus:ring-[#FFEA20] px-4 py-2 hover:text-[#FFEA20] rounded-lg mr-3"
                      onClick={handleRename}
                    >
                      Update
                    </button>
                  </div>
                  <div className="w-full">
                    <div className="w-full flex flex-row justify-around items-center px-2 pb-1">
                      <input
                        type="text"
                        value={search}
                        placeholder="Add Participants"
                        className="w-[80%] py-6 rounded-md mx-2 mr-4 h-10 px-6 bg-zinc-900 outline-none text-white placeholder:text-md placeholder:text-zinc-500 focus:bg-zinc-800"
                        onChange={handleChange}
                      />
                      <button
                        className="text-black my-2 px-7 border border-black bg-[#FFEA20] shadow-md hover:border hover:border-[#FFEA20] hover:bg-black active:bg-black focus:outline-none focus:ring-2 focus:bg-black focus:text-[#FFEA20] focus:ring-[#FFEA20] py-2 hover:text-[#FFEA20] rounded-lg mr-3"
                        onClick={() => console.log("New Name")}
                      >
                        Add
                      </button>
                    </div>
                    <div className="w-full flex flex-row justify-start items-center">
                      {searchResult
                        .map((u) => (
                          <UserBadge
                            user={u}
                            handleFunction={()=>handleAddUser(u)}
                            key={`${u._id}${!u.isGroupChat ? "0" : "1"}`}
                          />
                        ))}
                    </div>
                    <div className="flex flex-row justify-start items-center pl-4">
                    <button
                      className="text-black my-2 border border-black bg-[#FFEA20] shadow-md hover:border hover:border-[#FFEA20] hover:bg-black active:bg-black focus:outline-none focus:ring-2 focus:bg-black focus:text-[#FFEA20] focus:ring-[#FFEA20] px-4 py-2 hover:text-[#FFEA20] rounded-lg mr-3"
                      onClick={() => console.log("New Name")}
                    >
                      Leave Group
                    </button>
                    </div>

                  </div>
                </div>
              </div>
            ) : (
              <div
                className="w-[40%] h-[70%] bg-zinc-700 rounded-sm flex flex-col justify-start items-start text-[#ffea20] -mt-20 pb-2"
                ref={ref}
              >
                <div className="w-full h-[60%] flex justify-center bg-black blur-[1px]">
                  <img
                    src={`${getImage(user, selectedChat.users)}`}
                    alt="img"
                    className="h-auto"
                  />
                </div>
                <div className="flex flex-col  items-center w-full h-full">
                  <div className="flex flex-row justify-start items-center w-full h-10 pl-4">
                    <span className="text-lg font-semibold">Account</span>
                  </div>
                  <div className="flex flex-col justify-center items-start w-full pl-4">
                    <div className="flex flex-col justify-start items-start py-1">
                      <span className="text-lg">{`${capitalizeFirstLetter(
                        getName(user, selectedChat.users)
                      )}`}</span>
                      <label className="text-sm text-zinc-300">Username</label>
                    </div>
                    <div className="flex flex-col justify-start items-start py-1">
                      <span className="text-lg">{`${getEmail(
                        user,
                        selectedChat.users
                      )}`}</span>
                      <label className="text-sm text-zinc-300">Email</label>
                    </div>
                    <div className="flex flex-col justify-start items-start py-1">
                      <span className="text-lg">{`${getDate(
                        user,
                        selectedChat.users
                      )}`}</span>
                      <label className="text-sm text-zinc-300">
                        Active Since
                      </label>
                    </div>
                    {/* <label className="text-sm text-zinc-300">Username</label><span>{`${getName(user,selectedChat.users)}`}</span> */}
                    {/* <label className="text-sm text-zinc-300">Email</label><span>{`${getEmail(user,selectedChat.users)}`}</span> */}
                    {/* <label className="text-sm text-zinc-300">Active Since</label><span>{`${getDate(user,selectedChat.users)}`}</span> */}
                  </div>
                </div>
              </div>
            )}
          </div>
      )
  );
};

export default ProfileModal;
