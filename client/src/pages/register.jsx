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
        const so = handleInputErrors(data)
        const { username, email, password, confirmPassword } = data;
        if (!so) return;
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password, confirmPassword })
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
    return (
        <div className="flex flex-col gap-3">
            <h1>Inscription</h1>
            <label htmlFor="username">Nom utilisateur: </label>
            <input value={data.username} onChange={(e) => setData({ ...data, username: e.target.value })} type="text" />
            <label htmlFor="username">Email: </label>
            <input value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} type="text" />
            <label htmlFor="username">Mot de passe: </label>
            <input value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} type="password" />
            <label htmlFor="username">Confirmation mot de passe: </label>
            <input value={data.confirmPassword} onChange={(e) => setData({ ...data, confirmPassword: e.target.value })} type="password" />
            <button onClick={(e) => handleSubmit(e)}>Valider</button>
        </div>
    )
}