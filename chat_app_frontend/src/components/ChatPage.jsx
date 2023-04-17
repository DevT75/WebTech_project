import axios from 'axios';
import { useEffect,useState,useContext } from 'react';
import SideBar from './Sidebar';
import Users from "./Users";
import ChatInterface from "./ChatInterface";
import { ChatContext } from "../context/ChatContext";
import ProfileModal from './ProfileModal';

const ChatPage = ()=>{
    const [toggle,setToggle] = useState(false);
    const [createGc, setCreateGc] = useState(false);
    // const [, set] = useState(initialState)
    return(
        <div className='flex flex-row justify-between w-screen bg-zinc-900 h-screen'>
            <SideBar toggle={toggle} setToggle={setToggle} createGc={createGc} setCreateGc={setCreateGc}/>
            <Users toggle={toggle} setToggle={setToggle} createGc={createGc} setCreateGc={setCreateGc}/>
            <ChatInterface/>
            <ProfileModal/>
        </div> 
    ) 
}
export default ChatPage;