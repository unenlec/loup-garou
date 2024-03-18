<<<<<<< HEAD
import '../accueil.css'
=======
>>>>>>> 4e0eddb17f818bab640d255a88f44c5024648c5e
import {Link} from "react-router-dom"
import {useNavigate} from "react-router-dom"
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
<<<<<<< HEAD
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
=======
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
    <div className="flex flex-col h-screen items-center justify-center w-screen">
      <div className="absolute top-2 right-2 space-x-5">
        <button><Link to="/login">Se connecter</Link></button>
        <button><Link to="/register">S'inscrire</Link></button>
      </div>
      <div className="flex flex-col space-y-5 text-blue-700">
      <Link to="/game"><button onClick={()=>testHost()}className="bg-sky-950">Héberger une partie</button></Link>
        <button className="bg-sky-950">Rejoindre une partie</button>
        </div>
        <div className="flex overflow-y-scroll">
          <ul>
            {gameList.map((game,id)=>(
              <li id={id} className="cursor-pointer" onClick={(e)=>joinGame(e)} key={game._id}>ID:{game._id} Slot: {game.players.length}/{game.slot}</li>
            ))}
          </ul>
        </div>
      
    </div>
>>>>>>> 4e0eddb17f818bab640d255a88f44c5024648c5e
  )
}