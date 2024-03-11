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
                <div className="flex">
                        <div className="absolute inset-y-0 left-0 bg-red-400 w-3/4">
                            <div className='absolute right-1/4 w-2/4 h-full'>
                                <div className='absolute top-0 right-0 w-32 h-32 bg-cyan-400 m-20'>
                                Joueur x
                                </div>
                                <div className='absolute top-0 left-0 w-32 h-32 bg-cyan-400 m-20'>
                                Joueur x
                                </div>
                                <div className='absolute bottom-0 right-0 w-32 h-32 bg-cyan-400 m-20'>
                                Joueur x
                                </div>
                                <div className='absolute bottom-0 left-0 w-32 h-32 bg-cyan-400 m-20'>
                                Joueur x
                                </div>
                            </div>

                            <div className='absolute bottom-1/4 h-2/4 w-full'>
                                <div className='absolute top-0 right-0 w-32 h-32 bg-cyan-400 m-20'>
                                Joueur x
                                </div>
                                <div className='absolute top-0 left-0 w-32 h-32 bg-cyan-400 m-20'>
                                Joueur x
                                </div>
                                <div className='absolute bottom-0 right-0 w-32 h-32 bg-cyan-400 m-20'>
                                Joueur x
                                </div>
                                <div className='absolute bottom-0 left-0 w-32 h-32 bg-cyan-400 m-20'>
                                Joueur x
                                </div>
                            </div>

                        </div>

                    <div className="absolute inset-y-0 right-0 bg-lime-700 w-1/4">
                        <div className='absolute bottom-0 right-0 w-full'>
                            <div className="flex flex-col">
                            {messageReceived.map((m)=>(
                                    <p key={key++}>{m.username}: {m.message}</p>
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