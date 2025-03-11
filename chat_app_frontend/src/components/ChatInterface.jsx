import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { ChatContext } from "../context/ChatContext";
import { GoKebabVertical } from "react-icons/go";
import { AiOutlineSend } from "react-icons/ai";
import { ImAttachment } from "react-icons/im";
import ProfileModal from "./ProfileModal";
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client';

const ENDPOINT = "http://13.127.80.208:5000";
var socket, selectedChatCompare;

const Dropdown = () => {
  const { handleOpen } = useContext(ChatContext);
  return (
    <div className="absolute flex flex-col items-center w-[10%] mr-24 mt-48 bg-zinc-800 rounded-sm">
      <div
        className="flex justify-center items-center py-4 w-full hover:bg-[#ffea20] hover:text-black"
        onClick={handleOpen}
      >
        Group Info
      </div>
      <div className="flex justify-center items-center pt-2 pb-4 w-full hover:bg-[#ffea20] hover:text-black">
        Exit Group
      </div>
    </div>
  );
};

const ChatPage = ({ selectedChat }) => {
  const [userLogged, setUserLogged] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const { fetchAgin, setFetchAgain, user, fetchMessageAgain, notification, setNotification } = useContext(ChatContext);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const getName = (loggedUser, users) => {
    if (!Array.isArray(users) || users.length < 2) return "Unknown";
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };
  const getImage = (loggedUser, users) => {
    if (!Array.isArray(users) || users.length < 2) {
      return "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
    }
    return users[0]._id === loggedUser._id ? users[1].pic ? users[1].pic : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
      : users[0].pic ? users[0].pic : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  };
  useEffect(() => {
    setUserLogged(JSON.parse(localStorage.getItem("userInfo")));
  }, []);
  useEffect(() => {
    // console.log(selectedChat);
  }, [selectedChat]);
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);
  const handleNewMessage = (e) => {
    const { value } = e.target;
    setNewMessage(value);
    if (!socketConnected) return;
    if (!typing) {
      socket.emit("typing", selectedChat._id);
      setTyping(true);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  const sendViaClick = async () => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://13.127.80.208:5000/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        throw new Error(error.message);
      }
    }
  };
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://13.127.80.208:5000/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        console.log(data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        throw new Error(error.message);
      }
    }
  };
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const { data } = await axios.get(`http://13.127.80.208:5000/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);

    } catch (error) {
      throw new Error(error.message);
    }
  }
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat, fetchMessageAgain]);

  useEffect(() => {
    console.log(notification);
  }, [notification]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgin);
        }
      }
      else {
        setMessages([...messages, newMessageReceived]);
      }
    })
  })

  return (
    <div className="bg-white flex flex-col justify-start items-center w-full h-full">
      <div className="w-full h-20 bg-zinc-700 flex flex-row justify-between">
        <div className="w-[93%] bg-zinc-800 flex flex-row justify-start items-center">
          <div className="h-full w-[10%] flex justify-center items-center pl-2">
            <img
              src={`${
                !selectedChat.isGroupChat
                  ? getImage(userLogged, selectedChat.users)
                  : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
              }`}
              className="rounded-full w-12 h-12"
              alt="img"
            />
          </div>
          <div className="flex flex-col justify-between items-center w-[90%] h-full">
            <div className="w-full grow text-[#ffea20] flex justify-start items-center text-lg font-semibold pl-5">
              {!selectedChat.isGroupChat
                ? getName(userLogged, selectedChat.users)
                : selectedChat.chatName}
            </div>
            <div className="w-full flex flex-row justify-start items-center text-sm pl-3 pb-2 text-zinc-100">
              {selectedChat.isGroupChat
                ? selectedChat.users.map((u, i, { length }) => {
                    if (length - 1 === i) {
                      return (
                        <span className=" text-zinc-100 pl-2">{u.name}</span>
                      );
                    } else {
                      return (
                        <span className=" text-zinc-100 pl-2">{u.name},</span>
                      );
                    }
                  })
                : "Click here for contact info"}
            </div>
          </div>
        </div>
        <div
          className={`w-[7%] ${
            open ? "bg-[#ffea20]" : "bg-zinc-900"
          } text-[#ffea20] flex justify-center items-center hover:bg-[#ffea20] hover:shadow-2xl hover:cursor-pointer group`}
          onClick={() => {
            setOpen(!open);
          }}
        >
          <GoKebabVertical
            size="25"
            className={`${
              open && "text-black"
            } group-hover:bg-[#ffea20] group-hover:text-black`}
          />
          {open && <Dropdown />}
        </div>
      </div>
      <div className="chatBg w-full flex flex-col justify-between h-full overflow-y-hidden">
        <div className="w-full text-white h-[100%] overflow-y-scroll invisibleScrollBar overflow-x-hidden">
          <ScrollableChat messages={messages}/>
        </div>
        <div className="w-full h-15 bottom-0 flex flex-row justify-around items-center p-2">
          <ImAttachment
            className="hover:cursor-pointer text-[#ffea20]"
            size={25}
          />

          <input
            type="text"
            className=" lg:w-[90%] md:w-[80%] py-4 h-full px-6 bg-zinc-800 rounded-md outline-none text-white placeholder:text-md placeholder:text-zinc-500 focus:bg-zinc-800 shadow-xl w-[70%] transition-all"
            value={newMessage}
            placeholder="Type your Message"
            onKeyDown={sendMessage}
            onChange={handleNewMessage}
          />
          <AiOutlineSend
            size={25}
            onClick={sendViaClick}
            className="text-[#ffea20] hover:cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

const ChatInterface = () => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = useContext(ChatContext);
  return (
    <div className="w-[70%] h-full bg-zinc-900 flex flex-col justify-center items-center">
      {Object.keys(selectedChat).length !== 0 ? (
        <ChatPage selectedChat={selectedChat} />
      ) : (
        <div className="text-white flex justify-center items-center text-lg">
          Select a Chat to get Started
        </div>
      )}
    </div>
  );
};

export default ChatInterface;