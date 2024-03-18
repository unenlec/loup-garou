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
  )
}