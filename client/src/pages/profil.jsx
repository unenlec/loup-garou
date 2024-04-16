import { useState, useContext,useEffect } from 'react'
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import {useNavigate} from "react-router-dom"

export default function Profil() {
    const navigate = useNavigate();
    const { authUser, setAuthUser } = useContext(AuthContext);

    const [imageFile,setImageFile] = useState(null);
    const [imageUrl,setImageUrl] = useState("");

    const handleFileInputChange = (e)=>{
        const file = e.target.files;
        setImageFile(file[0]);
        setImageUrl(URL.createObjectURL(file[0]));
    }
    
    const [data, setData] = useState(
        {
            username: '',
            email: '',
            password: '',
            profilePicture:''
        }
    );
    const handleInputErrors = ({ username, email, password, confirmPassword }) => {
        const validateEmail = (email) => {
            return String(email)
              .toLowerCase()
              .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              );
          };
          
        if(validateEmail(email)===null)
        {
            toast.error("Ce n'est pas une email valide ")
            return false
        }          

        return true
    }
    
    const getProfil = async () => {
        try {
            console.log(JSON.parse(localStorage.getItem("authUser")).username)
            const res = await fetch("/api/auth/profil", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({username:JSON.parse(localStorage.getItem("authUser")).username})
            })
            const data = await res.json();
            setData({
                username:data.username,
                email:data.email,
                profilePicture:data.profilePicture
            })
            console.log(data)
            if (data.error) {
                throw new Error(data.error)
            }
            toast.success("Profil OK...")
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleSubmit = async () => {
        const formData = new FormData()
        
        const so = handleInputErrors(data)
        const { username, email, password } = data;
        if (!so) return;
        try {
            formData.append("avatar",imageFile)
            formData.append("username",username);
            formData.append("email",email);
            formData.append("password",password);
            const res = await fetch("/api/auth/changement", {
                method: "POST",
                body: formData
            })
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error)
            }
            localStorage.setItem("authUser", JSON.stringify(data))
            setAuthUser(data);
            getProfil();
            toast.success("Changement OK, redirection...")
            setTimeout(()=>navigate("/"),2000);
            
        } catch (error) {
            toast.error(error.message)
        }
        console.log(data)
    }


    useEffect(()=>{
        localStorage.setItem("currentVote","");
        getProfil()
        setImageUrl(data.profilePicture==="" ? "/images/ppBase.jpg" : "http://localhost:4000/api/auth/getimg/"+data.profilePicture)
        console.log(data)

    },[])
    return (
        <div className="flex flex-col gap-3">
            <h1>Page de Profil</h1>
            <img style={{backgroundImage: `url(${imageUrl})`,backgroundSize:'contain', backgroundPosition: 'center'}} className="w-40 h-40"></img>
            <input name="avatar" type="file" onChange={handleFileInputChange}/>
            <label htmlFor="username">Nom utilisateur: </label>
            <input placeholder={data.username} onChange={(e) => setData({ ...data, username: e.target.value })} type="text" />
            <label htmlFor="username">Email: </label>
            <input placeholder={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} type="text" />
            <label htmlFor="username">Nouveau Mot de passe: </label>
            <input placeholder={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} type="password" />
            <button onClick={(e) => handleSubmit(e)}>Valider</button>
        </div>
    )
}