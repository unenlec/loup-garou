import io from 'socket.io-client'
import {useEffect,useState,useContext} from "react"
import {Link} from "react-router-dom"
import { SocketContext } from "../context/SocketContext";
export default function Game()
{
    const socket = useContext(SocketContext);
    const [message,setMessage] = useState({});
    const [players,setPlayers] = useState([]);
    const [messageReceived,setMessageReceived] = useState([]);
    const sendMessage = ()=>{
        socket.emit("message",{message:message,username:JSON.parse(localStorage.getItem("authUser")).username,uuid:localStorage.getItem("currentGame")})
        setMessageReceived(old => [...old,message])
        console.log(message);
        console.log(messageReceived)
    };

    async function getPlayers()
    {
      try{
        const data = await fetch("/api/game/getPlayers",{
          method: "POST",
          headers:{
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({uuid:localStorage.getItem("currentGame")})
        }
        );
        const reponse = await data.json();
        console.log(reponse);
        setPlayers(JSON.parse(reponse));
      }catch(error)
      {
        console.log(error)
      }
    }
    useEffect(()=>{
        getPlayers();
        if(localStorage.getItem("authUser"))
        {
            socket.on("receive",(data)=>{
                setMessageReceived(old => [...old,data.message])
            })
        }
        socket.on("receive",(data)=>{
            setMessageReceived(old => [...old,data.message])
            console.log(messageReceived)
        });
        return() =>{
            if(socket)
            {
                socket.off(message);
            }
        }
    },[socket])
    let key =0;
    return(
        <div>
            {localStorage.getItem("authUser") ? (
                <div className="flex">
                        <div className="absolute inset-y-0 left-0 bg-red-400 w-3/4">
                            <div className='absolute right-1/4 w-2/4 h-full'>
                                {players.map((player)=>(
                                    <div onClick={()=>getPlayers()}>
                                        Joueur: {player}
                                    </div>
                                ))}
                            </div>
                        </div>
                    <div className="absolute inset-y-0 right-0 bg-lime-700 w-1/4">
                        <div className='absolute bottom-0 right-0 w-full'>
                            <div className="flex flex-col">
                            {messageReceived.map((m)=>(
                                    <p key={key++}>{m.username}{m.sid}: {m.message}</p>
                                ))}
                            </div>
                            <input className='w-full' onChange={(event)=>setMessage({message:event.target.value,username:JSON.parse(localStorage.getItem("authUser")).username})}placeholder="Message"/>
                        <button className='w-full' onClick={sendMessage}>Envoyer</button>
                        </div>
                    </div>
                </div>
            ): 
            <div>
                <h1>NOT LOGGED</h1>
                <Link to="/login">Se connecter</Link>
            </div>
            }
        </div>
    )
}