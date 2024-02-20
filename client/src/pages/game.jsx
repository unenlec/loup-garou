import io from 'socket.io-client'
import {useEffect,useState} from "react"
const socket = io.connect("localhost:4000")
export default function Game()
{
    const [message,setMessage] = useState("");
    const [messageReceived,setMessageReceived] = useState([]);
    const sendMessage = ()=>{
        socket.emit("message",{message:message})
        setMessageReceived(old => [...old,message])
    };
    useEffect(()=>{
        socket.on("receive",(data)=>{
            setMessageReceived(old => [...old,data.message])
        })
    },[socket])
    return(
        <div>
            <h1>GAME</h1>
            <div className="flex flex-col">
                {messageReceived.map((m)=>(
                    <p>{m}</p>
                ))}
            </div>
            <input onChange={(event)=>setMessage(event.target.value)}placeholder="Message"/>
            <button onClick={sendMessage}>Envoyer</button>
            
        </div>
    )
}