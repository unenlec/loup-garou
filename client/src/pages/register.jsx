import { useState, useContext } from 'react'
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import {useNavigate} from "react-router-dom"

export default function Register() {
    const navigate = useNavigate();
    const { authUser, setAuthUser } = useContext(AuthContext);
    const [data, setData] = useState(
        {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
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
        if (!username || !email || !password || !confirmPassword) {
            toast.error("Merci de remplir tous les champs ")
            return false
        }
        if (password !== confirmPassword) {
            toast.error("MDP DIFF")
            return false
        }
        return true
    }
    const handleSubmit = async () => {
        const formData = new FormData()
        
        const so = handleInputErrors(data)
        const { username, email, password, confirmPassword } = data;
        if (!so) return;
        try {
            formData.append("avatar",file)
            formData.append("username",username);
            formData.append("email",email);
            formData.append("password",password);
            formData.append("confirmPassword",confirmPassword);
            const res = await fetch("/api/auth/register", {
                method: "POST",
                body: formData
            })
            const data = await res.json();
            if (data.error) {
                throw new Error(data.error)
            }
            localStorage.setItem("authUser", JSON.stringify(data))
            setAuthUser(data);
            toast.success("Inscription OK, redirection...")
            setTimeout(()=>navigate("/"),2000);
            
        } catch (error) {
            toast.error(error.message)
        }
        console.log(data)
    }
    const handleNavigate = (e) =>{
        toast.success("SUCCESS")
        
    }
    const [file,setFile] = useState();
    const upload = async ()=>{
        const formData = new FormData()
        formData.append("avatar",file)
        try{
            const data = await fetch("/api/auth/register",{
            method:"POST",
            body:formData
            })
            const reponse = data.json()
            console.log("FORM DATA",reponse);
        }catch(error)
        {
            console.log(error)
        }

    }
    return (
        <div className="flex flex-col gap-3">
            <button onClick={()=>navigate("/")}>Retour</button>
            <h1>Inscription</h1>
            <label htmlFor="avatar">Photo avatar: </label>
            <input accept='image/jpeg, image/png' type="file" name="avatar" onChange={(e)=>setFile(e.target.files[0])}/>
            <label htmlFor="username">Nom utilisateur: </label>
            <input value={data.username} onChange={(e) => setData({ ...data, username: e.target.value })} type="text" required/>
            <label htmlFor="username">Email: </label>
            <input value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} type="text" required/>
            <label htmlFor="username">Mot de passe: </label>
            <input value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} type="password" required/>
            <label htmlFor="username">Confirmation mot de passe: </label>
            <input value={data.confirmPassword} onChange={(e) => setData({ ...data, confirmPassword: e.target.value })} type="password" required/>
            <button onClick={(e) => handleSubmit(e)}>Valider</button>
        </div>
    )
}