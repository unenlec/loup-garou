import '../accueil.css'
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from "../context/SocketContext";
import { useContext, useEffect, useState } from "react"
import Modal from '../components/modal';

export default function Accueil() {
  const socket = useContext(SocketContext);
  const [modal, setModal] = useState(false);
  const [name, setName] = useState("Partie de " + JSON.parse(localStorage.getItem("authUser")));
  const navigate = useNavigate();
  const [slots, setSlots] = useState(4);
  const hostHandler = () => {
    socket.emit("hostingame", { user: authUser.username });

  }
  const testHost = () => {
    setModal(true);
    //socket.emit("hostingame", { user: authUser.username });
  }
  const { authUser, setAuthUser } = useContext(AuthContext);
  const [gameList, setGameList] = useState([]);


  const joinGame = (e) => {
    console.log(e.target.id);
    socket.emit("joinGame", gameList[Number(e.target.id)].uuid);
  }
  useEffect(() => {
    async function getGameList() {
      try {
        const data = await fetch("/api/game/getGameList", {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        });

        const reponse = await data.json();
        setGameList(JSON.parse(reponse));
        console.log(gameList[1]);
      } catch (error) {
        console.log(error)
      }
    }
    if (gameList.length === 0) {
      getGameList();
    }
    socket.on("updateGame", () => {
      getGameList();
    })
    socket.on("joinStatus", (data) => {
      if (data.message == "OK") {
        localStorage.setItem("currentGame", data.uuid);
        console.log("CURRENT GAME: ", data)
        navigate("/game");
      }

    })
    socket.on("gameHosted", (data) => {
      if (data) {
        localStorage.setItem("currentGame", data);
        navigate("/game");
        setModal(false);
      }
      console.log("GAME HOSTED ??")

    })
  }, [socket])
  return (
    <div className="flex flex-col h-screen items-center justify-center w-screen">
      <Modal modalState={modal} setModalState={setModal} setSlots={setSlots} setName={setName} hostHandler={hostHandler} />
      <div className="absolute top-2 right-2 space-x-5">
        {(localStorage.getItem("authUser")) ?
          (<button onClick={() => { localStorage.removeItem("authUser"); navigate("/") }}><Link to="/login">Se déconnecter</Link></button>) :
          (<><button><Link to="/login">Se connecter</Link></button><button><Link to="/register">S'inscrire</Link></button></>)}
      </div>
      <div className="flex flex-col space-y-5 text-blue-700">
        <button onClick={() => testHost()} className="bg-sky-950">Héberger une partie</button>
        <button className="bg-sky-950">Rejoindre une partie</button>
      </div>
      <div className="flex overflow-y-scroll">
        <ul>
          {gameList.map((game, id) => (
            <li id={id} className="cursor-pointer" onClick={(e) => joinGame(e)} key={game._id}>ID:{game._id} Slot: {game.players?.length}/{game.slot}</li>
          ))}
        </ul>
      </div>

    </div>
  )
}