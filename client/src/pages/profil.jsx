import { useState, useContext,useEffect } from 'react'
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import {useNavigate} from "react-router-dom"

export default function Profil() {
    const navigate = useNavigate();
    const { authUser, setAuthUser } = useContext(AuthContext);
    const [data, setData] = useState(
        {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            profilePicture:''
        }
    );
    const handleInputErrors = ({ username, email, password, confirmPassword }) => {
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
    useEffect(()=>{
        localStorage.setItem("currentVote","");
        getProfil()
        

    },[])
    return (
        <div className="flex flex-col gap-3">
            <h1>Page de Profil</h1>
            <img src={data.profilePicture==="" ? "/images/ppBase.jpg" : "http://localhost:4000/api/auth/getimg/"+data.profilePicture} className="w-40 h-40"></img>
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