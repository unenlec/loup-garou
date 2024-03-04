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
        <div className="flexbox">
            <div className = "w-3/4 bg-red-400 absolute inset-y-0 left-0 ">
                
                <div className="fixed top-0 right-2/3">
                    Joueur 1
                    <div className="flexbox bg-blue-400 w-20 h-20"></div>
                </div>

                <div className="fixed top-1/4">
                    Joueur 2
                    <div className="flexbox bg-blue-400 w-20 h-20"></div>
                </div>

                <div className="fixed  bottom-1/4  right-2/3">
                    Joueur 3
                    <div className="flexbox bg-blue-400 w-20 h-20"></div>
                </div>

                <div className="fixed top-2/4 left-2/4">
                    Joueur 4
                    <div className="flexbox bg-blue-400 w-20 h-20"></div>
                </div>

                <div className="relative  top-2/4 left-3/4">
                    Joueur 5
                    <div className="flexbox bg-blue-400 w-20 h-20"></div>
                </div>


            </div>

            <div className = "w-1/4 bg-lime-500 absolute inset-y-0 right-0">
            <div className = "absolute bottom-0 right-0 w-full">
            <div className="flex flex-col bg-blue-500">
                    {messageReceived.map((m)=>(
                        <p>{m}</p>
                    ))}
                </div>
                <input className = "w-full" onChange={(event)=>setMessage(event.target.value)}placeholder="Message"/>
                <button className = "w-full" onClick={sendMessage}>Envoyer</button>
            </div></div>
        </div>
    )
}