import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useContext,
} from "react";
import UserCard from "./UserCard";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { AiOutlineArrowLeft } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GiCancel } from "react-icons/gi";
import { ChatContext } from "../context/ChatContext";

const searchStyle =
  "w-[80%] py-6 rounded-md mx-2 mr-4 h-10 px-6 bg-zinc-900 outline-none text-white placeholder:text-md placeholder:text-zinc-500 focus:bg-zinc-800";

const SearchBar = React.forwardRef(
  ({ toggle, setToggle, searchResult, setSearchResult, accessChat }, ref) => {
    const callbackRef = useCallback((inputElement) => {
      if (inputElement) {
        inputElement.focus();
      }
    }, []);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useContext(ChatContext);
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
    return (
      <AnimatePresence>
        {toggle && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: "tween", duration: 0.25, stiffness: 200 }}
            className="w-full m-0"
          >
            <div className="w-full" ref={ref}>
              <div
                ref={ref}
                className="w-full h-20 m-0 flex flex-column justify-around items-center bg-zinc-900"
              >
                {/* <AiOutlineArrowLeft /> */}
                <ArrowIcon
                  icon={<AiOutlineArrowLeft size={20} />}
                  onClick={() => {
                    setToggle((toggle) => !toggle);
                  }}
                />
                <input
                  type="text"
                  value={search}
                  placeholder="Search or Start New Chat"
                  className={searchStyle}
                  onChange={handleChange}
                  ref={callbackRef}
                  // autoFocus={`${toggle && "autoFocus"}`}
                  onFocus={(e) => e.currentTarget.select()}
                />
              </div>
              <div className="w-full h-[400px] overflow-y-scroll customScroll">
                <div className="w-full py-4">
                  <span className="text-[#ffea20] w-full ml-5 mt-5 text-lg">
                    {`Search Results: ${searchResult.length} Results`}
                  </span>
                </div>
                {searchResult.map((u) => (
                  <UserCard
                    imgSrc={u.pic}
                    name={u.name}
                    onClick={() => accessChat(u._id)}
                    userId={u._id}
                    key={`${u._id}${!u.isGroupChat ? "0" : "1"}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      // toggle && (
      //       <div className="w-full" ref={ref}>
      //         <div
      //           ref={ref}
      //           className="w-full h-20 m-0 flex flex-column justify-around items-center bg-zinc-900"
      //         >
      //           {/* <AiOutlineArrowLeft /> */}
      //           <ArrowIcon
      //             icon={<AiOutlineArrowLeft size={20} />}
      //             onClick={() => {
      //               setToggle((toggle) => !toggle);
      //             }}
      //           />
      //           <input
      //             type="text"
      //             value={search}
      //             placeholder="Search or Start New Chat"
      //             className={searchStyle}
      //             onChange={handleChange}
      //             ref={callbackRef}
      //             // autoFocus={`${toggle && "autoFocus"}`}
      //             onFocus={(e) => e.currentTarget.select()}
      //           />
      //         </div>
      //         <div className="w-full h-[400px] overflow-y-scroll customScroll">
      //           <div className="w-full py-4">
      //             <span className="text-[#ffea20] w-full ml-5 mt-5 text-lg">
      //               {`Search Results: ${searchResult.length} Results`}
      //             </span>
      //           </div>
      //           {searchResult.map((u) => (
      //             <UserCard
      //               imgSrc={u.pic}
      //               name={u.name}
      //               onClick={() => accessChat(u._id)}
      //               userId={u._id}
      //               key={`${u._id}${!u.isGroupChat? "0" : "1"}`}
      //             />
      //           ))}
      //         </div>
      //       </div>
      //   )
    );
  }
);

const ArrowIcon = ({ icon, onClick }) => {
  return (
    <div className="text-[#FFEA20] ml-3 hover:cursor-pointer" onClick={onClick}>
      {icon}
    </div>
  );
};

function useOutsideAlerter(ref, { setToggle }) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setToggle(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [ref]);
}
function useOutsideAlerterGroup(gref, { setCreateGc }) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (gref.current && !gref.current.contains(event.target)) {
        setCreateGc(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [gref]);
}

const SearchResults = ({ searchResult, accessChat, toggle }) => {
  return (
    <AnimatePresence>
      {toggle && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ type: "tween", duration: 0.25, stiffness: 100 }}
          className="w-full"
        >
          <div className="w-full h-64 overflow-y-scroll">
            {searchResult.map((u) => (
              <UserCard
                imgSrc={u.pic}
                name={u.name}
                accessChat={accessChat}
                userId={u._id}
                key={u._id}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const RecentChats = () => {
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const { user, selectedChat, setSelectedChat, chats, setChats, fetchAgain } =
    useContext(ChatContext);
  // console.log(chats);
  const fetchChats = async () => {
    setChats([]);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${loggedUser.token}`,
        },
      };
      const { data } = await axios.get("http://13.127.80.208:5000/api/chat", config);
      console.log(data);
      if (!chats.find((c) => c._id === data._id))
        setChats((prev) => [...data, ...prev]);
      // setChats((prev)=>[...data,...prev]);
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // console.log(chats);
  }, [fetchAgain]);
  // console.log(chats);
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
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: "tween", duration: 0.25, stiffness: 200 }}
        className="w-full m-0"
      >
        <div className="w-full max-h-screen flex flex-col justify-start items-center overflow-y-scroll customScroll">
          <div className="w-full py-4">
            <span className="text-[#ffea20] w-full md:ml-5 lg:ml-5 mt-5 lg:text-lg md:text-lg text-sm ml-0">
              {`${chats ? "Recent Chats" : "Search User to Start Chat"}`}
            </span>
          </div>
          {chats ? (
            <div className="w-full h-full">
              {chats.map((c) => (
                <UserCard
                  imgSrc={
                    !c.isGroupChat
                      ? getImage(loggedUser, c.users)
                      : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                  }
                  // imgSrc={getImage(loggedUser, c.users , c.isGroupChat)}
                  name={
                    !c.isGroupChat ? getName(loggedUser, c.users) : c.chatName
                  }
                  userId={c._id}
                  key={`${c._id}${!c.isGroupChat ? "0" : "1"}`}
                  onMouseDown={() => {
                    setSelectedChat({ ...c });
                    // console.log(selectedChat);
                  }}
                />
              ))}
            </div>
          ) : (
            <div>Bruhh!!!</div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
    /* <div className="w-full h-[800px] flex flex-col justify-start items-center">
      <div className="w-full py-4">
        <span className="text-[#ffea20] w-full ml-5 mt-5 text-lg">
          {`${chats ? "Recent Chats" : "Search User to Start Chat"}`}
        </span>
      </div>
      {chats ? (
        <div className="w-full h-full">
          {chats.map((c) => (
            <UserCard
              imgSrc={
                !c.isGroupChat
                  ? getImage(loggedUser, c.users)
                  : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
              }
              // imgSrc={getImage(loggedUser, c.users , c.isGroupChat)}
              name={!c.isGroupChat ? getName(loggedUser, c.users) : c.chatName}
              userId={c._id}
              key={`${c._id}${!c.isGroupChat ? "0" : "1"}`}
              onMouseDown={() => {
                setSelectedChat({ ...c });
                // console.log(selectedChat);
              }}
            />
          ))}
        </div>
      ) : (
        <div>Bruhh!!!</div>
      )}
    </div> */
  );
};

const UserBadge = ({ user, handleFunction }) => {
  return (
    <div className="w-auto my-2 mx-2 h-8 bg-[#ffea20] flex flex-row rounded-lg">
      <span className="flex justify-center items-center p-2 text-base font-semibold">
        {user.name}
      </span>
      <span
        className="group flex items-center w-auto p-2"
        onClick={() => handleFunction(user)}
      >
        <GiCancel size="20" className="group-hover:cursor-pointer" />
      </span>
    </div>
  );
};
const CreateGroup = React.forwardRef(
  ({ createGc, setCreateGc, searchResult, setSearchResult }, ref) => {
    const callbackRef = useCallback((inputElement) => {
      if (inputElement) {
        inputElement.focus();
      }
    }, []);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const { user, chats, setChats } = useContext(ChatContext);
    const [groupName, setGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const handleNameChange = (e) => {
      const { value } = e.target;
      setGroupName(value);
    };
    const handleGroupName = async () => {
      if (!groupName || !selectedUsers) {
        console.log("Please provide all the details");
        return;
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "http://13.127.80.208:5000/api/chat/group",
          {
            name: groupName,
            users: JSON.stringify(selectedUsers.map((u) => u._id)),
          },
          config
        );
        setChats([data, ...chats]);
        console.log("Success!!!");
      } catch (error) {
        console.log(`${error.message}`);
      }
    };
    const handleGroup = (userToAdd) => {
      if (selectedUsers.includes(userToAdd)) {
        console.log("User already added");
        return;
      }
      setSelectedUsers([...selectedUsers, userToAdd]);
    };
    const handleDelete = (user) => {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    };
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
    return (
      <AnimatePresence>
        {createGc && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            transition={{ type: "tween", duration: 0.25, stiffness: 200 }}
            className="w-full m-0"
          >
            <div className="w-full" ref={ref}>
              <div
                ref={ref}
                className="w-full flex flex-col justify-start items-center bg-zinc-900 overflow-x-visible"
              >
                <div className="w-full h-20 m-0 flex flex-row justify-around items-center bg-zinc-900">
                  {/* <AiOutlineArrowLeft /> */}
                  <ArrowIcon
                    icon={<AiOutlineArrowLeft size={20} />}
                    onClick={() => {
                      setCreateGc((toggle) => !toggle);
                    }}
                  />
                  <input
                    type="text"
                    value={search}
                    placeholder="Add Users in Your Group"
                    className={searchStyle}
                    onChange={handleChange}
                    ref={callbackRef}
                    // autoFocus={`${toggle && "autoFocus"}`}
                    onFocus={(e) => e.currentTarget.select()}
                  />
                </div>
                <div className="flex-col justify-start items-center w-full">
                  <div className="w-full">
                    <div className="w-full flex flex-row justify-around items-center p-2">
                      <input
                        type="text"
                        value={groupName}
                        placeholder="It's Your group name"
                        className={searchStyle}
                        onChange={handleNameChange}
                      />
                      <button
                        className="my-2 border border-black bg-[#FFEA20] shadow-md hover:border hover:border-[#FFEA20] hover:bg-black active:bg-black focus:outline-none focus:ring-2 focus:bg-black focus:text-[#FFEA20] focus:ring-[#FFEA20] px-4 py-2 hover:text-[#FFEA20] rounded-lg mr-3"
                        onClick={handleGroupName}
                      >
                        Create
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col grow w-full"></div>
                </div>
                <div className="flex flex-row items-center justify-start w-full overflow-x-auto customScroll">
                  {selectedUsers.map((user) => (
                    <UserBadge
                      key={user._id}
                      user={user}
                      handleFunction={handleDelete}
                    />
                  ))}
                </div>
              </div>

              <div className="w-full h-[400px] overflow-y-scroll customScroll">
                <div className="w-full py-4">
                  <span className="text-[#ffea20] w-full ml-5 mt-5 text-lg">
                    {`Search Results: ${searchResult.length} Results`}
                  </span>
                </div>
                {searchResult.map((u) => (
                  <UserCard
                    imgSrc={u.pic}
                    name={u.name}
                    onClick={() => handleGroup(u)}
                    userId={u._id}
                    key={`${u._id}${!u.isGroupChat ? "0" : "1"}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      // createGc && (
      // <div className="w-full" ref={ref}>
      //   <div
      //     ref={ref}
      //     className="w-full flex flex-col justify-start items-center bg-zinc-900 overflow-x-visible"
      //   >
      //     <div className="w-full h-20 m-0 flex flex-row justify-around items-center bg-zinc-900">
      //       {/* <AiOutlineArrowLeft /> */}
      //       <ArrowIcon
      //         icon={<AiOutlineArrowLeft size={20} />}
      //         onClick={() => {
      //           setCreateGc((toggle) => !toggle);
      //         }}
      //       />
      //       <input
      //         type="text"
      //         value={search}
      //         placeholder="Add Users in Your Group"
      //         className={searchStyle}
      //         onChange={handleChange}
      //         ref={callbackRef}
      //         // autoFocus={`${toggle && "autoFocus"}`}
      //         onFocus={(e) => e.currentTarget.select()}
      //       />
      //     </div>
      //     <div className="flex-col justify-start items-center w-full">
      //       <div className="w-full">
      //         <div className="w-full flex flex-row justify-around items-center p-2">
      //           <input
      //             type="text"
      //             value={groupName}
      //             placeholder="It's Your group name"
      //             className={searchStyle}
      //             onChange={handleNameChange}
      //           />
      //           <button
      //             className="my-2 border border-black bg-[#FFEA20] shadow-md hover:border hover:border-[#FFEA20] hover:bg-black active:bg-black focus:outline-none focus:ring-2 focus:bg-black focus:text-[#FFEA20] focus:ring-[#FFEA20] px-4 py-2 hover:text-[#FFEA20] rounded-lg mr-3"
      //             onClick={handleGroupName}
      //           >
      //             Create
      //           </button>
      //         </div>
      //       </div>
      //       <div className="flex flex-col grow w-full"></div>
      //     </div>
      //     <div className="flex flex-row items-center justify-start w-full overflow-x-auto customScroll">
      //       {selectedUsers.map((user) => (
      //         <UserBadge
      //           key={user._id}
      //           user={user}
      //           handleFunction={handleDelete}
      //         />
      //       ))}
      //     </div>
      //   </div>

      //   <div className="w-full h-[400px] overflow-y-scroll customScroll">
      //     <div className="w-full py-4">
      //       <span className="text-[#ffea20] w-full ml-5 mt-5 text-lg">
      //         {`Search Results: ${searchResult.length} Results`}
      //       </span>
      //     </div>
      //     {searchResult.map((u) => (
      //       <UserCard
      //         imgSrc={u.pic}
      //         name={u.name}
      //         onClick={() => handleGroup(u)}
      //         userId={u._id}
      //         key={`${u._id}${!u.isGroupChat ? "0" : "1"}`}
      //       />
      //     ))}
      //   </div>
      // </div>
      // )
    );
  }
);
const Users = ({ toggle, setToggle, createGc, setCreateGc }) => {
  const [searchResult, setSearchResult] = useState([]);
  const { user, setSelectedChat, chats, setChats } = useContext(ChatContext);
  const [loadingChat, setLoadingChat] = useState(false);
  const ref = useRef(null);
  const gref = useRef(null);
  useOutsideAlerter(ref, { setToggle });
  useOutsideAlerterGroup(gref, { setCreateGc });

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log(userId);
      const { data } = await axios.post("http://13.127.80.208:5000/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id))
        setChats((prev) => [data, ...prev]);

      // console.log(chats);
      setSelectedChat({ ...data });
      setLoadingChat(false);
      return;
    } catch (error) {
      console.log(`Error: ${error.message}`);
      return;
    }
  };

  return (
    <div className="h-full bg-zinc-800 lg:w-[26rem] md:w-[10rem] sm:w-[5rem] ml-[70px] flex flex-col items-center overflow-y-clip">
      <SearchBar
        toggle={toggle}
        setToggle={setToggle}
        ref={ref}
        searchResult={searchResult}
        setSearchResult={setSearchResult}
        accessChat={accessChat}
      />
      <CreateGroup
        createGc={createGc}
        setCreateGc={setCreateGc}
        ref={gref}
        searchResult={searchResult}
        setSearchResult={setSearchResult}
      />
      <RecentChats />
    </div>
  );
};

export default Users;
