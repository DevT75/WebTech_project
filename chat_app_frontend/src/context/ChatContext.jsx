import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState({});
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [notification, setNotification] = useState([]);
  const [fetchMessageAgain, setFetchMessageAgain] = useState(false);
  const handleOpen = () => setProfileOpen(true);
  const handleClose = () => setProfileOpen(false);
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        profileOpen,
        handleOpen,
        handleClose,
        setProfileOpen,
        fetchAgain,
        setFetchAgain,
        fetchMessageAgain,
        setFetchMessageAgain,
        notification,
        setNotification
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
