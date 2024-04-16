import { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { SocketContext } from "../context/SocketContext";
import "./../accueil.css";
import CircularLayout from "../components/CircularLayout";
export default function Game() {
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const [message, setMessage] = useState({slot:"??"});
    const [modalFin,setModalFin] = useState(false);
    const [texteFin,setTexteFin] = useState("");
    const [JoueurMax, setJoueurMax] = useState({});
    const [ImgJoueur, setImgJoueur] = useState({});
    const [gameData, setGameData] = useState({round:1,timeSeconds:"??",state:"Nuit"});
    const stateStyle = gameData?.state==="Jour" ? "url(/images/village.jpg)" : "url(/images/villageNight.jpg)";
    const [players, setPlayers] = useState([]);
    const [role, setRole] = useState("");
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
            console.log("TEST JOIN1")
            const data = await fetch("/api/game/getPlayers", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uuid: localStorage.getItem("currentGame") })
            }
            );
            const reponse = await data.json();
            console.log("SET PLAYEr");
            setPlayers(JSON.parse(reponse));
            console.log(JSON.stringify(reponse))
        } catch (error) {
            console.log(error)
        }
    }
    
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };
    const closeModalFin = () => {
        setModalFin(false);
        navigate("/")
    };
    
    const vote = (e) => {
        console.log("vote"+gameData.state)
        if(e.target.closest(".username-div").style.opacity!="0.5")
        {
        let votecontre = e.target.closest(".username-div").childNodes[0].textContent;
        console.log(votecontre);
        if(localStorage.getItem("currentVote") === null)
        {
            localStorage.setItem("currentVote","")
        }
        if(localStorage.getItem("currentVote")!==votecontre)
        {
            if(localStorage.getItem("currentVote")==="")
            {
                localStorage.setItem("currentVote",votecontre)
                socket.emit("vote",{username:JSON.parse(localStorage.getItem("authUser")).username,who:e.target.closest(".username-div").childNodes[0].textContent,uuid:localStorage.getItem("currentGame"),type:"vote",role:role})
    
            }else{
                console.log("LA OU PAS")
                socket.emit("vote",{username:JSON.parse(localStorage.getItem("authUser")).username,who:localStorage.getItem("currentVote"),uuid:localStorage.getItem("currentGame"),type:"unvote",role:role})
                localStorage.setItem("currentVote",votecontre)
                socket.emit("vote",{username:JSON.parse(localStorage.getItem("authUser")).username,who:e.target.closest(".username-div").childNodes[0].textContent,uuid:localStorage.getItem("currentGame"),type:"vote",role:role})

            }
        }else{
            console.log("LA ?")
            socket.emit("vote",{username:JSON.parse(localStorage.getItem("authUser")).username,who:localStorage.getItem("currentVote"),uuid:localStorage.getItem("currentGame"),type:"unvote",role:role})
            localStorage.setItem("currentVote","")
        }
    }
        //socket.emit("joinGame", {uuid:gameList[Number(e.target.id)].uuid,username:authUser.username});
      }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const gameDataResponse = await fetch("/api/game/getGameData", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ uuid: localStorage.getItem("currentGame") })
                });
                const gameData = await gameDataResponse.json();
                setGameData(JSON.parse(gameData));
                const joueurMax = JSON.parse(gameData).slot;
                setJoueurMax(joueurMax);
                
                getPlayers();
                
                console.log("Fin des requêtes de données");
    
                  
            } catch (error) {
                console.log(error);
            }
        };
    
        fetchData();
    
        if (localStorage.getItem("authUser")) {
            socket.on("receive", (data) => {
                setMessageReceived(old => [...old, data.message])
            })
        }
        socket.on("time", (data) => {
            //console.log(data)
            if(gameData.state!==data.state)
            {
                localStorage.setItem("currentVote","")
            }
            setGameData(data)
        })
        socket.on("role", (data) => {
            setRole(data.role)
            console.log(JSON.stringify(data))
        })
        socket.on("updateCurrentGame", () => {
            getPlayers();
            console.log("TEST JOIN2")
        })
        socket.on("finGame",(data)=>{
            if(data)
            {
                setTexteFin(data)
                setModalFin(true)
            }
        })
        socket.on("onVote", (data) => {
            console.log("vote"+data)
            setPlayers(JSON.parse(data))
            /*
            if(gameData?.state==="Nuit" && role==="loup")
            {
                setPlayers(JSON.parse(data))
                //console.log(players)
            }
            if(gameData.state==="Jour")
            {
                setPlayers(JSON.parse(data))
                //console.log(players)
            }*/
            
        })

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
                                {modalFin && (
                                        <div className="modal">
                                            <div className="modal-content">
                                                <p>{texteFin}</p>
                                                <button className="close" onClick={closeModalFin}>Ok</button>
                                            </div>
                                        </div>
                                    )}
                                <div id="game" className={" absolute inset-y-0 left-0 w-3/4 transition bg-cover bg-center flex items-center justify-center"} style={{backgroundImage: stateStyle}}>
                                <CircularLayout usernames={players} vote={vote}/>
                                </div>
                                    <div className="absolute top-0 left-0 w-96 h-40 bg-cover bg-center" style={{ backgroundImage: `url(/images/planche.jpg)` }}>
                                        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
                                            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-white">
                                                <h1 className="text-2xl font-bold mb-2">{isNaN(gameData.timeSeconds) ? `En attente de joueurs...` : (gameData.round === 0 ? `Début de la partie dans ${formatTime(gameData.timeSeconds)}` : `TOUR ${gameData.round} Temps:${formatTime(gameData.timeSeconds)}`)}</h1>
                                                <h1>{gameData.state}</h1>
                                                <button onClick={()=>getPlayers()}>ICI</button>
                                                {/*players.map((player) => (
                                                    <div key={player[1]} onClick={() => getPlayers()}>
                                                        Joueur: {player[0]} ID: {player[1]}
                                                    </div>                                     
                                                ))*/}
                                            </div>
                                        </div>
                                {role!== "" ?
                                <div className="absolute inset bottom-0 left-0">
                                <button className="w-40" onClick={openModal}>Expliquer mon rôle</button>
                                    {modalOpen && (
                                        <div className="modal">
                                            <div className="modal-content">
                                                <span className="close" onClick={closeModal}>&times;</span>
                                                {data.role==="villageois" ? <p>Vous êtes un villageois vous devez identifier et éliminer les loups-garous</p> : <p>Vous êtes un loup-garou vous devez identifier et éliminer les villageois</p>}
                                            </div>
                                        </div>
                                    )}
                                    <img src={`/images/${role}.jpg`} className="w-40 h-40"></img>                             
                                </div>              
:null}
                                <div className="absolute flexbox inset-y-0 right-0 w-1/4 border">
                                    <div className="overflow-y-scroll flex flex-col-reverse h-5/6">
                                        {messageReceived.slice(0).reverse().map((m) => (
                                            <p className="bg-blue-700 rounded-lg p-2 mb-2 shadow-md overflow-wrap break-word" key={key++}>{m.username}: {m.message}</p>
                                        ))}
                                    </div>
                                        <div className="bottom-0 fixed w-1/4 h-1/6">
                                            <input className='w-full border border-[#646cff] h-1/2' onChange={(event) => setMessage({ message: event.target.value, username: JSON.parse(localStorage.getItem("authUser")).username })} placeholder="Message" />
                                            <button className='w-full text-blue-700 bg-sky-950 h-1/2' onClick={sendMessage}>Envoyer</button>
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