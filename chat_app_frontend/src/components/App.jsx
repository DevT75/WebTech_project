import { Route , Routes } from "react-router-dom";
import ChatPage from "./ChatPage";
import LoginPage from "./HomePage";
import SideBar from "./Sidebar";

const App = ()=>(
    <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/chats" element={<ChatPage/>}/>
    </Routes>
)

export default App;