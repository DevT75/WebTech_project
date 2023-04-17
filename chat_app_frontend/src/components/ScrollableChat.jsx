import React, { useContext } from "react";
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
const ScrollableChat = ({ messages }) => {
  const { user, selectedChat } = useContext(ChatContext);
  const getName = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  };
  const getImage = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
  };
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div className="flex w-32 h-12 p-2 ml-2" key={m._id}>
            { !(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
                <img
                  src={m.sender.pic}
                  className="rounded-full w-12 h-12 "
                  alt="img"
                />
              )}
            <span className={`${m.sender._id === user._id ? "bg-[#ffea20] text-black" : "bg-zinc-800 text-[#ffea20]"}`}>
                {
                    m.content
                }
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
