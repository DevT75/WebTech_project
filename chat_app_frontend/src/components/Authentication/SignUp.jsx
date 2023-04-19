import React,{useState} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const inputClass = "w-full p-4 my-1.5 rounded-md border-[#FFEA20] border bg-black text-white placeholder:text-md placeholder:text-gray-500 focus:outline-none active:bg-black";
const passClass = "w-4/5 p-4 h-full rounded-md bg-black placeholder:text-md placeholder:text-gray-500 focus:outline-none"
const InputField = ({name,placeholder,value,type,className,onChange})=>(
    <input type={type} name={name} placeholder={placeholder} value={value}
        className = {className} onChange = {onChange}
    />
);
const SignUp = () => {
    // const [profile, setProfile] = useState({
    //     name : "",
    //     email : "",
    //     password : "",
    //     confirmPassword : ""
    // });
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);
    const [pic,setPic] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();
    const handleChange = (e)=>{
        const {value,name} = e.target;
        switch (name) {
            case "name":
                setName(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "password":
                setPassword(value);
                break;
            case "confirmPassword":
                setConfirmPassword(value);
                break;
            default:
                break;
        }
    }

    const toastIt = (str) => toast.error(`${str}`);
    const postDetails = (pics)=>{
        setIsLoading(true);
        if(pics === undefined){
            // toast.error("Please Select an Image!!");
            toastIt("Please select an Image!!");
            setIsLoading(false);
            return;
        }
        if(pics.type === 'image/jpeg' || pics.type === 'image/png'){
            const data = new FormData();
            data.append('file',pics);
            data.append('upload_preset','mern_chat_app');
            data.append('cloud_name','dwwgxkid5');
            fetch('https://api.cloudinary.com/v1_1/dwwgxkid5/image/upload',{
                method: 'post',
                body: data,
            }).then((res)=>res.json())
            .then((d)=>{
                setPic(d.url.toString());
                // console.log(d.url.toString());
                setIsLoading(false);
            }).catch((err)=>{
                console.log(err);
                setIsLoading(false);
            })
        }
        else{
            toastIt("Please Select an Image!!");
            // toastIt();
            setIsLoading(false);
            return;
        }

    }
    const handleSubmit = async ()=>{
        // console.log({
        //     name,email,password,pic
        // });
        setIsLoading(true);

        if(!name || !email || !password || !confirmPassword){
            toastIt("Please fill all the Fields");
            setIsLoading(false);
            return;
        }
        if(password !== confirmPassword){
            toastIt("Password doesn't match!!");
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            // console.log(pic);
            const { data } = await axios.post('/api/user', { name, email, password, pic },config);
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
    <div className='h-full flex flex-col justify-evenly items-center px-4'>
            <InputField name="name" placeholder="Enter Name" value={name} className={inputClass} onChange={handleChange}/>
            <InputField name="email" placeholder="Email Address" value={email} className={inputClass} onChange={handleChange}/>
            <div className={`w-full flex flex-row justify-between ${inputClass} p-0`}>
                <InputField name = "password" type={`${showPassword ? "text":"password"}`} placeholder="Password" className={`${passClass}`} value={password} onChange={handleChange}/>
                <button className='w-1/5' onClick={()=>{
                    setShowPassword(!showPassword);
                }}>Show</button>
            </div>
            <div className={`w-full flex flex-row justify-between ${inputClass} p-0`}>
                <InputField name = "confirmPassword" type={`${showConfirmPassword ? "text":"password"}`} placeholder="Confirm Password" className={`${passClass}`} value={confirmPassword} onChange={handleChange}/>
                <button className='w-1/5' onClick={()=>{
                    setShowConfirmPassword(!showConfirmPassword);
                }}>Show</button>
            </div>
            <InputField name="name" type="file" placeholder="Upload Image" className={`border-dashed ${inputClass}`} onChange = {(e)=> postDetails(e.target.files[0])}/>
            <div className='w-full flex flex-row-reverse'>
                <button className='mt-2 mb-3 border border-black w-1/3 bg-[#FFEA20] shadow-lg hover:border hover:border-[#FFEA20] hover:bg-black active:bg-black focus:outline-none focus:ring-2 focus:bg-black focus:text-[#FFEA20] focus:ring-[#FFEA20] py-3 px-4 hover:text-[#FFEA20] rounded-xl ml-3}' onClick={handleSubmit}>Sign Up</button>
            </div>
            <ToastContainer></ToastContainer>
    </div>
  )
}

export default SignUp;
