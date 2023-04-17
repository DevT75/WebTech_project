import ParticlesBG from "./ParticlesBG";
import { useState, useEffect } from "react";
import Login from "./Authentication/Login";
import SignUp from "./Authentication/SignUp";
import { useNavigate } from "react-router-dom";
const LoginCard = ()=>{
    const [toggle,setToggle] = useState(true);
    return (
        <div className={`flex ${toggle ? "md:w-1/2 w-3/5 sm:h-[50%]" : "md:w-3/5 h-3/4 w-3/4"} h-auto rounded-lg bg-zinc-900 shadow-xl`}>
            <div className={`md:flex ${toggle ? "w-1/2" : "w-[55%]"} h-full hidden justify-center items-center`}>
                <img className= "rounded-tl-2xl rounded-bl-2xl w-full h-full" src="https://thumbs.dreamstime.com/b/black-chat-question-icon-isolated-yellow-background-help-speech-bubble-symbol-faq-sign-question-mark-sign-long-shadow-style-199325412.jpg" alt="chat"></img>
            </div>
            <div className="flex flex-1 my-0 flex-col ml-0 md:ml-2 px-4 sm:w-full justify-evenly">
                <div className = "flex flex-row px-6 mb-2 justify-around bg-zinc-900 rounded-xl shadow-xl mt-2">
                    <button className={`text-white mx-4 my-2 w-2/5 px-4 rounded-md hover:text-amber-400 p-2 text-base ${toggle && "text-amber-400"}`} onClick={()=>{
                        setToggle(true);
                    }}>Log In</button>
                    <button className={`text-white mx-4 my-2 w-2/5 px-4 rounded-md hover:text-amber-400 p-2 text-base ${!toggle && "text-amber-400"}`} onClick={()=>{
                        setToggle(false);
                    }}>Sign Up</button>
                </div>
                {
                    toggle ? <Login toggle={toggle}/> : <SignUp toggle={toggle}/>
                }
                {/* <div className="flex group justify-center shadow-xl bg-[#FFEA20] rounded-xl mt-2 hover:border-2 hover:border-slate-400">
                    <button className="text-black text-xl mx-4 my-1 w-2/5 px-4 rounded-md group-hover:shadow-xl p-2">Log In</button>
                </div> */}
            </div>
        </div>
    )
}


const LoginPage = () => {
    const navigate = useNavigate();
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if(user){
            navigate('/chats');
        }
    },[navigate]);
    return (
        <div className="flex justify-center items-center h-screen">
            <ParticlesBG/>
            <LoginCard/>
        </div>
    );
}
export default LoginPage;