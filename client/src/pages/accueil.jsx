import '../accueil.css'
import {Link} from "react-router-dom"
import {useNavigate} from "react-router-dom"
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import {useContext,useEffect,useState} from "react"
import io from 'socket.io-client'

const socket = io.connect("localhost:4001")

export default function Accueil() {
  
  const testHost =()=>{
    socket.emit("hostingame",{user:authUser.username})
  }
  
  const { authUser, setAuthUser } = useContext(AuthContext);
  const [gameList, setGameList] = useState([]);
  const navigate = useNavigate();
  const gamecontainer = document.getElementById("games-container")

  const joinGame =(e)=>{
    console.log(e.target.id);
    socket.emit("joinGame",gameList[Number(e.target.id)].uuid);
  }
  useEffect(()=>{
    async function getGameList()
    {
      try{
        const data = await fetch("/api/game/getGameList",{
          method: "GET",
          headers:{
            'Content-Type': 'application/json'
          }
        });

        const reponse = await data.json();
        setGameList(JSON.parse(reponse));
        console.log(gameList[1]);
      }catch(error)
      {
        console.log(error)
      }
    }
    if(gameList.length===0)
    {
      getGameList();
    }
    socket.on("updateGame",()=>{
      getGameList();
  })
  },[socket])

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