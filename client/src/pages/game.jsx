import { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
import { SocketContext } from "../context/SocketContext";
export default function Game() {
    const socket = useContext(SocketContext);
    const [message, setMessage] = useState({});
    const [gameData, setGameData] = useState({round:1,timeSeconds:"??",state:"Nuit"});
    const stateStyle = gameData?.state==="Jour" ? "bg-white" : "bg-black";
    const [players, setPlayers] = useState([]);
    const [messageReceived, setMessageReceived] = useState([]);
    const sendMessage = () => {
        socket.emit("message", { message: message, username: JSON.parse(localStorage.getItem("authUser")).username, uuid: localStorage.getItem("currentGame") })
        setMessageReceived(old => [...old, message])
        console.log(message);
        console.log(messageReceived)
    };
    const formatTime = (sec) =>{
        let min = Math.floor(sec/60);
        sec%=60;
        if(min<10)
        {
            min= "0"+min;
        }
        if(sec<10)
        {
            sec = "0"+sec;
        }
        return min+ ":"+ sec;
    }
    async function getPlayers() {
        try {
            const data = await fetch("/api/game/getPlayers", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uuid: localStorage.getItem("currentGame") })
            }
            );
            const reponse = await data.json();
            console.log(reponse);
            setPlayers(JSON.parse(reponse));
        } catch (error) {
            console.log(error)
        }
    }

    async function getGameData() {
        try {
            const data = await fetch("/api/game/getGameData", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uuid: localStorage.getItem("currentGame") })
            }
            );
            const reponse = await data.json();
            console.log(reponse);
            setPlayers(JSON.parse(reponse));
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPlayers();
        if (localStorage.getItem("authUser")) {
            socket.on("receive", (data) => {
                setMessageReceived(old => [...old, data.message])
            })
        }
        socket.on("time", (data) => {
            console.log(data)
            setGameData(data)
        })
        socket.on("updateCurrentGame", () => {
            getPlayers()
          })
        /* socket.on("receive",(data)=>{
             setMessageReceived(old => [...old,data.message])
             console.log(messageReceived)
         });*/
        return () => {
            if (socket) {
                socket.off(message);
            }
        }
    }, [socket])
    let key = 0;
    return (
        <div>
            {localStorage.getItem("authUser") ? (
                                <div className="flex">
                                <div className={stateStyle+" absolute inset-y-0 left-0 w-3/4 transition"}>
                                    <div className='absolute right-1/4 w-2/4 h-full'>
                                        <h1>TOUR {gameData.round} Temps:{formatTime(gameData.timeSeconds)}</h1>
                                        {players.map((player) => (
                                            <div key={player} onClick={() => getPlayers()}>
                                                Joueur: {player}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute inset-y-0 right-0 w-1/4 bg-white border">
                                        <div className="overflow-y-scroll h-full">
                                            {messageReceived.map((m) => (
                                                <p key={key++}>{m.username}{m.sid}: {m.message}</p>
                                            ))}
                                        </div>
                                        <div className="bottom-0 fixed">
                                        <input className='w-full border border-[#646cff]' onChange={(event) => setMessage({ message: event.target.value, username: JSON.parse(localStorage.getItem("authUser")).username })} placeholder="Message" />
                                        <button className='w-full text-blue-700 bg-sky-950' onClick={sendMessage}>Envoyer</button>
                                        </div>
                                </div>
                            </div>
            ) :
                <div>
                    <h1>NOT LOGGED</h1>
                    <Link to="/login">Se connecter</Link>
                </div>
            }
        </div>
    )
}