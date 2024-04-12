import { useEffect, useState, useContext } from "react"
import { Link } from "react-router-dom"
import { SocketContext } from "../context/SocketContext";
import "./../accueil.css";
export default function Game() {
    const socket = useContext(SocketContext);
    const [message, setMessage] = useState({slot:"??"});
    const [JoueurMax, setJoueurMax] = useState({});
    const [gameData, setGameData] = useState({round:1,timeSeconds:"??",state:"Nuit"});
    const stateStyle = gameData?.state==="Jour" ? "url(/images/villageNight.jpg)" : "url(/images/village.jpg)";
    const [players, setPlayers] = useState([]);
    const [messageReceived, setMessageReceived] = useState([]);

    function positionnerJoueurs(nbJoueurs, rayon) {
        const positions = [];
        const angleEntreJoueurs = (2 * Math.PI) / nbJoueurs;
    
        for (let i = 0; i < nbJoueurs; i++) {
            const angle = i * angleEntreJoueurs;
            const x = rayon * Math.cos(angle);
            const y = rayon * Math.sin(angle);
            positions.push({ x, y });
        }
    
        return positions;
    }

    function CreateCercle(nbJoueurs,milieu, usernames){
        console.log(`mid - Position : (${milieu.x}, ${milieu.y})`);
        console.log("Recup positions")
        console.log(nbJoueurs);
        console.log(milieu);
        const positionsJoueurs = positionnerJoueurs(nbJoueurs, 100);
        console.log("Fin Recup positions")
        console.log(positionsJoueurs);

        const game = document.getElementById('game');
        game.innerHTML = '';

        positionsJoueurs.forEach((position, index) => {
            
            console.log(`Joueur ${index + 1} - Position : (${position.x}, ${position.y})`);

            const container = document.createElement('div');
            
            container.id = `JoueurN ${index + 1}`;

            const carre = document.createElement('div');
                carre.style.left = position.x*3.8 + milieu.x + 'px';
                carre.style.top = position.y*3.8 + milieu.y + 'px';
                carre.style.position = 'absolute';
                carre.style.width = '50px';
                carre.style.height = '50px';
                carre.style.backgroundColor = 'blue';
            
            console.log(position.x + milieu.x)
            console.log(position.y + milieu.y)
            
            container.append(carre)

            const Name = document.createElement('p');

            let username ;
            if(usernames[index] != 0){
                 username = usernames[index];
            }else{
                console.log("naps"); console.log(usernames[index]); username = `Joueur ${index + 1}`;
            }

            Name.textContent = username ;
            Name.style.left = position.x*3.8 + milieu.x + 'px';
            Name.style.top = position.y*3.8 + milieu.y + 55 + 'px';
            Name.style.position = 'absolute';

            container.append(Name);
            game.append(container);

            console.log("create carre");
        });
    
    }
   
    function calculerMilieuElement(element) {
        const rect = element.getBoundingClientRect();
        
        const milieuX = rect.left + rect.width / 2;
        const milieuY = rect.top + rect.height / 2;
    
        return { x: milieuX, y: milieuY };
    }

    function TableauJoueur(){
        let TabJoueur = [] ;

        const playersCopy = [...players];

        for (let i = 0; i < JoueurMax; i++) {
            if (i < playersCopy.length) {
                TabJoueur.push(playersCopy[i]); 
            } else {
                TabJoueur.push(0); 
            }
        }

        return TabJoueur ;
    }

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
    
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

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
    
                // Calcul du milieu de l'élément du jeu
                const $game = document.getElementById('game')
                const milieu = calculerMilieuElement($game);
                
                console.log("PLAYERS");
                console.log(players);

                console.log("PLAYERS + 0 ");
                let tab = TableauJoueur(joueurMax);
                console.log(tab);


                // Création du cercle
                CreateCercle(joueurMax, milieu,players,tab);
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
            console.log(data)
            setGameData(data)
        })
        socket.on("updateCurrentGame", () => {
            getPlayers();
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
                                <div>
                                    <div id="game" className={" absolute inset-y-0 left-0 w-3/4 transition bg-cover bg-center"} style={{backgroundImage: stateStyle}}>

                                    </div>

                                    <div className="absolute top-0 left-0 w-96 h-40 bg-cover bg-center" style={{ backgroundImage: `url(/images/planche.jpg)` }}>
                                        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
                                            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-white">
                                                <h1 className="text-2xl font-bold mb-2">TOUR {gameData.round} Temps:{formatTime(gameData.timeSeconds)}</h1>
                                                {players.map((player) => (
                                                    <div key={player} onClick={() => getPlayers()}>
                                                        Joueur: {player}
                                                    </div>                                     
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                

                                <div className="absolute inset bottom-0 left-0">
                                <button className="w-40" onClick={openModal}>Expliquer mon rôle</button>
                                    {modalOpen && (
                                        <div className="modal">
                                            <div className="modal-content">
                                                <span className="close" onClick={closeModal}>&times;</span>
                                                <p>Texte explicatif sur le rôle.</p>
                                            </div>
                                        </div>
                                    )}
                                    <img src="/images/sorciere.jpg" className="w-40 h-40"></img>                             
                                </div>              

                                <div className="absolute inset-y-0 right-0 w-1/4 border">
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