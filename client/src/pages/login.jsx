import { useState, useContext } from 'react'
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import {useNavigate} from "react-router-dom"

export default function Login()
{
    const navigate = useNavigate();
    const { authUser, setAuthUser } = useContext(AuthContext);
    const [data, setData] = useState(
        {
            username: '',
            password: ''
        }
    );

    const handleSubmit = async () => {
        const { username, password } = data;
        console.log(username);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            })
            const data = await res.json();
            console.log(data);
            if (data.error) {
                throw new Error(data.error)
            }
            localStorage.setItem("authUser", JSON.stringify(data))
            setAuthUser(data);
            toast.success("Connexion OK, redirection...")
            setTimeout(()=>navigate("/"),2000);
            
        } catch (error) {
            toast.error(error.message)
        }
        console.log(data)
    }

    return(
        <div className="flex flex-col gap-3">
            <button onClick={()=>navigate("/")}>Retour</button>
                <h1>Se Connecter</h1>
                <label htmlFor="username">Nom utilisateur: </label>
                <input value={data.username} onChange={(e) => setData({ ...data, username: e.target.value })} required id="username" name="username" className="border border-black" type="text"/>
                <label htmlFor="password">Mot de passe: </label>
                <input value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} required id="password" name="password" className="border border-black" type="password"/>
                <button onClick={(e) => handleSubmit(e)}>Valider</button>
        </div>
    )
}