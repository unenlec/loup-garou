import io from 'socket.io-client'
import {useEffect,useState} from "react"
import {Link} from "react-router-dom"
const socket = io.connect("localhost:4001")
export default function Game()
{
    const [message,setMessage] = useState({});
    const [messageReceived,setMessageReceived] = useState([]);
    const sendMessage = ()=>{
        socket.emit("message",{message:message,username:JSON.parse(localStorage.getItem("authUser")).username})
        setMessageReceived(old => [...old,message])
        console.log(message);
        console.log(messageReceived)
    };
    useEffect(()=>{
        if(localStorage.getItem("authUser"))
        {
            socket.on("receive",(data)=>{
                setMessageReceived(old => [...old,data.message])
            })
        }
    },[socket])
    let key =0;
    return(
        <div>
            {localStorage.getItem("authUser") ? (
                <div className="flex flex-row h-screen w-[100%]">
                        <div className="flex-[5] bg-red-400">
                            <h1>GAME</h1>
                        </div>
                    <div className="bg-lime-700 flex-[2]">
                        <div className="flex flex-col">
                        {messageReceived.map((m)=>(
                                <p key={key++}>{m.username}: {m.message}</p>
                            ))}
                        </div>
                        <input onChange={(event)=>setMessage({message:event.target.value,username:JSON.parse(localStorage.getItem("authUser")).username})}placeholder="Message"/>
                    <button onClick={sendMessage}>Envoyer</button>
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