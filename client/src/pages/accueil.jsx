import '../accueil.css'
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from "../context/SocketContext";
import { useContext, useEffect, useState } from "react"
import Modal from '../components/modal';


import sorciereImage from '/images/sorciere.jpg';
import loupImage from '/images/loup.jpg';
import villageoisImage from '/images/ppBase.jpg';
import voyanteImage from '/images/voyante.jpg';
import petiteFilleImage from '/images/petiteFille.jpg';
import mediumImage from '/images/medium.jpg';

export default function Accueil() {
  const socket = useContext(SocketContext);
  const [modal, setModal] = useState(false);
  const [dayTime,setDayTime] = useState(60);
  const [nightTime,setNightTime] = useState(60);
  const [name, setName] = useState("Partie de " + JSON.parse(localStorage.getItem("authUser"))?.username);
  const navigate = useNavigate();
  const [slots, setSlots] = useState(4);
  const { authUser, setAuthUser } = useContext(AuthContext);
  const [gameList, setGameList] = useState([]);


  const hostHandler = async () => {
    console.log(name,slots,"Time",dayTime,"Night",nightTime)
    //
    try {
      const res = await fetch("/api/game/createGame", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username:authUser.username,name:name,slots:slots,dayTime:dayTime,nightTime:nightTime,socket:socket.id })
      })
      const data = await res.json();
      if(data.status==="gameOK")
      {
        socket.emit("hostingame", { uuid:data.uuid });
      }
      console.log(data);     
  } catch (error) {
      toast.error(error.message)
  }

  }
  const testHost = () => {
    setModal(true);
    //socket.emit("hostingame", { user: authUser.username });
  }
 


  const joinGame = (e) => {
    console.log(e.target.id);
    socket.emit("joinGame", {uuid:gameList[Number(e.target.id)].uuid,username:authUser.username});
  }
  useEffect(() => {
    localStorage.setItem("currentVote","");
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

  document.addEventListener("DOMContentLoaded", function() {
    const rules = document.getElementById("rules");
  });
  return (

    <div className="flex flex-col h-screen items-center justify-center w-screen">
      <Modal modalState={modal} setModalState={setModal} setSlots={setSlots} setName={setName} hostHandler={hostHandler} setDayTime={setDayTime} setNightTime={setNightTime}/>
    <div className="absolute w-1/3 h-screen left-0">
      <div id="rules" className="flex-box bg-slate-600 w-5/6 m-14 h-5/6 overflow-auto rounded-xl">
      <p className="font-serif font-bold text-4xl m-8 underline">Déroulement du jeu : </p><br></br>

        <li className="font-serif text-xl m-4">Le jeu se déroule en plusieurs phases : la nuit et le jour, avec un cycle de nuit et de jour répété jusqu'à la fin de la partie.
        Pendant la nuit, tous les joueurs ferment les yeux sauf les loups-garous. Ces derniers se réveillent discrètement et décident ensemble d'une victime à éliminer.
        Certains personnages spéciaux, comme la Voyante ou la Sorcière, peuvent avoir des actions spécifiques pendant la nuit.</li> <br></br>
        <li className="font-serif text-xl m-4">Une fois les actions nocturnes terminées, les joueurs se réveillent et découvrent qui a été éliminé par les loups-garous.
        Pendant le jour, les joueurs discutent, échangent des accusations et tentent de découvrir les loups-garous parmi eux.
        À la fin du débat, les joueurs votent secrètement pour éliminer un joueur qu'ils soupçonnent d'être un loup-garou.
        Le joueur ayant reçu le plus de votes est éliminé.</li><br></br>
        <li className="font-serif text-xl m-4"> Si un joueur possède un pouvoir spécial qui affecte la partie après sa mort, ce pouvoir peut être activé au moment approprié.
        Le cycle de nuit et de jour se répète jusqu'à ce que les conditions de victoire soient remplies.</li>

    </div>

    <div className="flex flex-col items-center absolute bottom-12 left-1/3">
      <div>
        <button className="" onClick={() => {
              rules.innerHTML = '';

              const p = document.createElement('p');
              p.textContent = "Déroulement du jeu : ";
              p.className = "font-serif font-bold text-4xl m-8 underline";

              const li1 = document.createElement('li');
              li1.textContent = "  Le jeu se déroule en plusieurs phases : la nuit et le jour, avec un cycle de nuit et de jour répété jusqu'à la fin de la partie. Pendant la nuit, tous les joueurs ferment les yeux sauf les loups-garous. Ces derniers se réveillent discrètement et décident ensemble d'une victime à éliminer. Certains personnages spéciaux, comme la Voyante ou la Sorcière, peuvent avoir des actions spécifiques pendant la nuit.";
              li1.className = " font-serif text-xl m-4";

              const li2 = document.createElement('li');
              li2.textContent = "  Une fois les actions nocturnes terminées, les joueurs se réveillent et découvrent qui a été éliminé par les loups-garous. Pendant le jour, les joueurs discutent, échangent des accusations et tentent de découvrir les loups-garous parmi eux. À la fin du débat, les joueurs votent secrètement pour éliminer un joueur qu'ils soupçonnent d'être un loup-garou. Le joueur ayant reçu le plus de votes est éliminé et son rôle est révélé.";
              li2.className = "font-serif text-xl m-4";

              const li3 = document.createElement('li');
              li3.textContent = "Si un joueur possède un pouvoir spécial qui affecte la partie après sa mort, ce pouvoir peut être activé au moment approprié. Le cycle de nuit et de jour se répète jusqu'à ce que les conditions de victoire soient remplies.";
              li3.className = "font-serif text-xl m-4";
            

              rules.appendChild(p);
              rules.appendChild(li1);

              rules.appendChild(li2);

              rules.appendChild(li3);
            }}>Les règles :</button>

<button onClick={() => {
    rules.innerHTML = '';

    const p = document.createElement('p');
    p.textContent = "Les rôles du jeu : ";
    p.className = "font-serif font-bold text-4xl m-8 underline";
    rules.appendChild(p);

    const roles = [
        { img: loupImage, description: "Le Loup-garou : Ils sont des membres de la communauté secrètement choisis pour éliminer les villageois chaque nuit. Ils coopèrent ensemble pour décider qui éliminer sans se faire découvrir par les autres joueurs. Leur objectif est d'éliminer tous les villageois sans être découverts." },
        { img: villageoisImage, description: "Le Villageois : Ils sont des membres de la communauté innocents qui doivent identifier et éliminer les loups-garous pour protéger leur village. Ils participent aux discussions pendant le jour pour discuter des événements de la nuit précédente et voter pour éliminer les joueurs suspects." },
        { img: sorciereImage, description: "La sorcière : Elle a le pouvoir de sauver une personne de l'attaque des loups-garous ou d'éliminer un joueur, mais elle ne peut utiliser chaque potion (de guérison ou de poison) qu'une seule fois par partie." },
        { img: voyanteImage, description: "La Voyante : Elle a le pouvoir de découvrir le rôle d'un joueur chaque nuit. Ce pouvoir lui permet d'aider les villageois en identifiant les loups-garous potentiels, mais elle doit agir discrètement pour éviter d'être ciblée par les loups-garous ou de révéler son propre rôle." },
        { img: mediumImage, description: "Le Medium : Il a le pouvoir de parler avec les mort pendant n'importe quelle phase pour obtenir des informations. Malheureusement son pouvoir n'est pas sans faille et il peut lire seulement des bribes d'informations : J'ai █n█ inf█rm█ti█n █rucial█ [...] Je n'arrivais pas à cr█ir█ ce que me█ ye█x v█ya█ent, mais je su█s c█nvaincu qu█ c'éta█t █rthur, n█tre cher voisin," },
        { img: petiteFilleImage, description: "La Petite Fille : Elle a le pouvoir de se réveiller discrètement pendant la phase de nuit pour espionner les loups-garous. Après avoir cliqué sur un joueur pendant la, elle l'espionne pendant 3 tour avant de percer son identité au grand jour" }
    ];

    roles.forEach((role, index) => {
        const container = document.createElement('div');
        container.className = "flex items-center";

        const img = document.createElement('img');
        img.src = role.img;
        img.className = "object-contain h-32 w-32 m-4";

        const roleDescription = document.createElement('p');
        roleDescription.textContent = role.description;
        roleDescription.className = "m-2 font-serif";

        container.appendChild(img);
        container.appendChild(roleDescription);
        rules.appendChild(container);

        if (index < roles.length - 1) {
            const hr = document.createElement('hr');
            hr.className = "my-4";
            rules.appendChild(hr);
        }
    });
}}>Les rôles :</button>


      </div>
    </div>


  </div>
  <div className="absolute left-1/3 h-screen w-2/3">
  <div className="relative w-3/4 h-3/4 bg-slate-600 my-32 mx-8 rounded-xl flex flex-col p-2 space-y-5 overflow-auto">
    {gameList.map((game, id) => (
      <div className="bg-stone-500 rounded-xl text-center p-2" key={game._id}>
        <p id={id} className="cursor-pointer text-xl" onClick={(e) => joinGame(e)}>ID:{game.name} Slot: {game.players?.length}/{game.slot}</p>
      </div>
    ))}
  </div>
  <button onClick={() => testHost()} className="fixed bottom-16 right-64 mb-8 mr-8 w-32 h-24 text-2xl">Create</button>
</div>


  <div className="absolute top-2 right-2 space-x-5">
  {(localStorage.getItem("authUser")) ?
          (<><button><Link to="/profil">Mon Profil</Link></button><button onClick={() => { localStorage.removeItem("authUser"); navigate("/") }}><Link to="/login">Se déconnecter</Link></button></>) :
          (<><button><Link to="/login">Se connecter</Link></button><button><Link to="/register">S'inscrire</Link></button></>)}
      </div>

  <div className='absolute top-2 right-54 space-x-4'> 
    <audio loop id="musique" src = "/sound/background.mp3" ></audio>
    <button onClick={()=>{let audio = document.getElementById("musique"); audio.play();}}>Play</button>
    <button onClick={()=>{let audio = document.getElementById("musique"); audio.pause(); audio.currentTime = 0;}}>Stop</button>
  </div>
</div>
  )
}
