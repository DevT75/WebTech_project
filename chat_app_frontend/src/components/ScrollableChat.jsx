import React, { useContext, useEffect, useRef } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatContext } from "../context/ChatContext";

const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};
const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

const isSameSenderMargin = (messages,m,i,userId)=>{
  if(m.sender._id === userId) return "lg:ml-[77%] md:ml-[60%] sm:ml-[50%]";
  else return "lg:ml-2 md:ml-1 sm:ml-1";
  // if(
  //   i < messages.length - 1 &&
  //   (messages[i + 1].sender._id !== m.sender._id ||
  //     messages[i + 1].sender._id === undefined) &&
  //   messages[i].sender._id === userId
  // ){
  //   return "lg:ml-[77%] md:ml-[70%] sm:ml-[60%]";
  // }
  // else if((i < messages.length - 1 && messages[i + 1].sender._id !== m.sender._id && messages[i].sender._id !== userId) || (
  //   i === messages.length - 1 && messages[i].sender._id !== userId
  // )){
  //   return "ml-2";
  // }
}

const isSameUser = (messages,m,i)=>{
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
}

const ScrollableChat = ({ messages }) => {
  const bottomRef = useRef(null);
  const { user, selectedChat } = useContext(ChatContext);
  const getName = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };
  const getImage = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [messages]);

  return <>
    {
      messages &&
        messages.map((m, i) => (
          <div id={`${i === messages.length && "latestMessage"}`} className={`flex w-full h-12 p-2 justify-start items-center ${isSameSenderMargin(messages,m,i,user._id)} ${isSameUser(messages,m,i,user._id) ? "mt-1" : "mt-2" }`} key={m._id}>
            { (selectedChat.isGroupChat && (isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id))) && (
                <img
                  src={m.sender.pic}
                  className="rounded-full w-12 h-12 "
                  alt="img"
                />
              )}
            <span className={`${m.sender._id === user._id ? "bg-[#ffea20] text-black" : "bg-zinc-800 text-[#ffea20]"} rounded-tl-lg rounded-br-lg px-2 py-1 ml-2 break-normal flex max-w-[150px] ${isSameUser(messages,m,i,user._id) ? "mt-0" : "mt-2" }`}>
                {
                    m.content
                }
            </span>
          </div>
        ))
    }
    <div ref={bottomRef}/>
  </>
    
};

export default ScrollableChat;
