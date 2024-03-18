import '../accueil.css'
import {Link} from "react-router-dom"
import {useNavigate} from "react-router-dom"
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import {useContext} from "react"

export default function Accueil() {
  const { authUser, setAuthUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const gamecontainer = document.getElementById("games-container")

  const player = {
    roomId : null,
    username : "",
    socketId : "",
  }
  return (
    <>
      <div>
        <div id='games-container' className='flex-box absolute right-1/4 top-1/4 bg-red-400 w-8/12 h-4/6 rounded-lg'>
          <p className='flex-box w-40 h-8 m-3 rounded-lg bg-green-600 text-center text-xl'>Liste des parties</p>
          <button className='absolute bottom-0 right-0 m-3' onClick={()=>{  
            const li = document.createElement("div");
            li.className = "bg-green-600 m-8"
            li.textContent= 'test'
            const button = document.createElement("button");
            button.textContent = "join"
            button.className = "absolute right-0 rounded-lg"
 
            const buttonSupp = document.createElement("button");
            buttonSupp.textContent = "supprimer"
            buttonSupp.className = "absolute right-16 rounded-lg"

            li.appendChild(buttonSupp)
            li.appendChild(button)
            gamecontainer.append(li)
            toast.success("Lobby créé")

          }}> Créer une Partie</button>
        </div>

      </div>
      {localStorage.getItem("authUser") ? (
        <div className='topright'>
          <button onClick={()=>
            {
              localStorage.removeItem("authUser");
              setAuthUser(null)
              toast.success("Deconnexion OK...");
              setTimeout(()=>navigate(0),1000);
            }} className='log'>Deconnexion</button>
        </div>
      ) :(
      <div className='topright'>
        <button className='log'><Link to="/login">Se connecter</Link></button>
        <button className='log'><Link to="/register">S'inscrire</Link></button>
      </div>)}

    </>
  )
}