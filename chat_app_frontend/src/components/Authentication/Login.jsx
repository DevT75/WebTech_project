import React,{useState} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const InputField = ({name,placeholder,value,type,onChange})=>(
    <input type={type} name={name} placeholder={placeholder} value={value}
        className = "p-4 mx-3 my-2 rounded-md border-[#FFEA20] border bg-black text-white placeholder:text-md placeholder:text-gray-500"
     onChange={onChange}/>
);
const Login = () => {
    const navigate = useNavigate();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [isLoading,setIsLoading] = useState(false);
    const toastIt = (str) => toast.error(`${str}`);
    const handleChange = (e)=>{
        const { name,value } = e.target;
        switch (name) {
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            default:
                break;
        }
    }
    const handleSubmit = async ()=>{
        setIsLoading(true);
        console.log({email,password});
        if(!email || !password){
            toastIt("Please Fill all the fields");
            setIsLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            // console.log(dp);
            const { data } = await axios.post('https://web-tech-project-api.vercel.app/api/user/login', { email, password },config);
            toastIt("Succesful Registration!!");
            localStorage.setItem('userInfo',JSON.stringify(data));
            setIsLoading(false);
            navigate('/chats');
        } catch (error) {
            toastIt("Error Occured!!");
            setIsLoading(false);
            return;
        }
    }
  return (
    <div className=''>
            <div className="flex flex-col justify-start mt-0">
                <InputField
                type="text"
                    placeholder="Enter Name"
                    onChange={handleChange}
                    name="email"
                    value={email}
                />
                <InputField
                type="password"
                    placeholder="Enter Password"
                    onChange={handleChange}
                    name="password"
                    value={password}
                />
            </div>
            <div className="group flex flex-row-reverse mt-2 mb-4 p-2 mr-1.5">
                <a href="#">
                <p className="text-[#FFEA20] hover:text-white text-sm hover:shadow">
                    Reset Password
                </p></a>   
            </div>
            <div className='w-full flex flex-row justify-between'>
                <button className="mb-2 border border-black w-1/3 bg-[#FFEA20] shadow-lg hover:border hover:border-[#FFEA20] hover:bg-black active:bg-black focus:outline-none focus:ring-2 focus:bg-black focus:text-[#FFEA20] focus:ring-[#FFEA20] p-4 hover:text-[#FFEA20] rounded-xl ml-3" onClick={handleSubmit}>Log In</button>
                <button className="mb-2 border border-black w-1/2 bg-[#FFEA20] shadow-lg hover:border hover:border-[#FFEA20] hover:bg-black active:bg-black focus:outline-none focus:ring-2 focus:bg-black focus:text-[#FFEA20] focus:ring-[#FFEA20] p-4 hover:text-[#FFEA20] rounded-xl mr-3">Login as Guest</button>
            </div>
            <ToastContainer></ToastContainer>
    </div>
  )
}

export default Login
