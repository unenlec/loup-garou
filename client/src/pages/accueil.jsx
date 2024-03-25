import '../accueil.css'
import {Link} from "react-router-dom"
import {useNavigate} from "react-router-dom"
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from "../context/SocketContext";
import {useContext,useEffect,useState} from "react"


import sorciereImage from '/images/sorciere.jpg';
import loupImage from '/images/loup.jpg';
import villageoisImage from '/images/villageois.jpg';
import voyanteImage from '/images/voyante.jpg';
import petiteFilleImage from '/images/petiteFille.jpg';

export default function Accueil() {
  const socket = useContext(SocketContext);
  const testHost =()=>{
  socket.emit("hostingame",{user:authUser.username});
}
  const { authUser, setAuthUser } = useContext(AuthContext);
  const [gameList, setGameList] = useState([]);
  const navigate = useNavigate();
  
  document.addEventListener("DOMContentLoaded", function() {
    const rules = document.getElementById("rules");
  });

  const joinGame =(e)=>{
    console.log(e.target.id);
    socket.emit("joinGame",gameList[Number(e.target.id)].uuid);
  }
  useEffect(()=>{
    async function getGameList()
    {
      try{
        const data = await fetch("/api/game/getGameList",{
          method: "GET",
          headers:{
            'Content-Type': 'application/json'
          }
        });

        const reponse = await data.json();
        setGameList(JSON.parse(reponse));
        console.log(gameList[1]);
      }catch(error)
      {
        console.log(error)
      }
    }
    if(gameList.length===0)
    {
      getGameList();
    }
    socket.on("updateGame",()=>{
      getGameList();
  })
  socket.on("joinStatus",(data)=>{
    if(data.message=="OK")
    {
      localStorage.setItem("currentGame",data.uuid);
      console.log("CURRENT GAME: ",data)
      navigate("/game");
    }
    
})
socket.on("gameHosted",(data)=>{
  if(data)
  {
    localStorage.setItem("currentGame",data);
    navigate("/game");
  }
  
})

  },[socket])
  return (

    <div className="flex flex-col h-screen items-center justify-center w-screen">
      
    <div className="absolute w-1/3 h-screen left-0">
      <div id="rules" className="flex-box bg-slate-600 w-5/6 m-14 h-5/6 overflow-auto rounded-xl">
      <p className="text-2xl m-8">Déroulement du jeu : </p><br></br>

        <li className="text-xl m-4">Le jeu se déroule en plusieurs phases : la nuit et le jour, avec un cycle de nuit et de jour répété jusqu'à la fin de la partie.
        Pendant la nuit, tous les joueurs ferment les yeux sauf les loups-garous. Ces derniers se réveillent discrètement et décident ensemble d'une victime à éliminer.
        Certains personnages spéciaux, comme la Voyante ou la Sorcière, peuvent avoir des actions spécifiques pendant la nuit.</li> <br></br>
        <li className="text-xl m-4">Une fois les actions nocturnes terminées, c'est le jour. Les joueurs se réveillent et découvrent qui a été éliminé par les loups-garous.
        Pendant le jour, les joueurs discutent, échangent des accusations et tentent de découvrir les loups-garous parmi eux.
        À la fin du débat, les joueurs votent secrètement pour éliminer un joueur qu'ils soupçonnent d'être un loup-garou.
        Le joueur ayant reçu le plus de votes est éliminé et son rôle est révélé.</li><br></br>
        <li className="text-xl m-4"> Si un joueur possède un pouvoir spécial qui affecte la partie après sa mort, ce pouvoir peut être activé au moment approprié.
        Le cycle de nuit et de jour se répète jusqu'à ce que les conditions de victoire soient remplies.</li>

    </div>

    <div className="flex flex-col items-center">
      <div>
        <button className="" onClick={() => {
              rules.innerHTML = '';

              const p = document.createElement('p');
              p.textContent = "Déroulement du jeu : ";
              p.className = "text-2xl m-8";

              const li1 = document.createElement('li');
              li1.textContent = "  Le jeu se déroule en plusieurs phases : la nuit et le jour, avec un cycle de nuit et de jour répété jusqu'à la fin de la partie. Pendant la nuit, tous les joueurs ferment les yeux sauf les loups-garous. Ces derniers se réveillent discrètement et décident ensemble d'une victime à éliminer. Certains personnages spéciaux, comme la Voyante ou la Sorcière, peuvent avoir des actions spécifiques pendant la nuit.";
              li1.className = "text-xl m-4";

              const li2 = document.createElement('li');
              li2.textContent = "  Une fois les actions nocturnes terminées, c'est le jour. Les joueurs se réveillent et découvrent qui a été éliminé par les loups-garous. Pendant le jour, les joueurs discutent, échangent des accusations et tentent de découvrir les loups-garous parmi eux. À la fin du débat, les joueurs votent secrètement pour éliminer un joueur qu'ils soupçonnent d'être un loup-garou. Le joueur ayant reçu le plus de votes est éliminé et son rôle est révélé.";
              li2.className = "text-xl m-4";

              const li3 = document.createElement('li');
              li3.textContent = "Si un joueur possède un pouvoir spécial qui affecte la partie après sa mort, ce pouvoir peut être activé au moment approprié. Le cycle de nuit et de jour se répète jusqu'à ce que les conditions de victoire soient remplies.";
              li3.className = "text-xl m-4";
            

              rules.appendChild(p);
              rules.appendChild(li1);

              rules.appendChild(li2);

              rules.appendChild(li3);
            }}>Les règles :</button>

        <button onClick={() => {
          rules.innerHTML = '';

          const p = document.createElement('p');
          p.textContent = "Les rôles du jeu : ";
          p.className = "text-2xl m-8";

          rules.appendChild(p);

          const container1 = document.createElement('div');
          container1.className = "flex items-center";

          const img1 = document.createElement('img');
          img1.src = sorciereImage ;
          img1.className = "object-contain h-32 w-32 m-4";

          const role1 = document.createElement('p');
          role1.textContent = "La sorciere :  Elle a le pouvoir de sauver une personne de l'attaque des loups-garous ou d'éliminer un joueur, mais elle ne peut utiliser chaque potion (de guérison ou de poison) qu'une seule fois par partie."
          role1.className = "m-2";

          container1.appendChild(img1);
          container1.appendChild(role1);
          rules.appendChild(container1);


          const container2 = document.createElement('div');
          container2.className = "flex items-center";

          const img2 = document.createElement('img');
          img2.src = loupImage ;
          img2.className = "object-contain h-32 w-32 m-4";

          const role2 = document.createElement('p');
          role2.textContent = "Le Loup-garou : Ils sont des membres de la communauté secrètement choisis pour éliminer les villageois chaque nuit. Ils coopèrent ensemble pour décider qui éliminer sans se faire découvrir par les autres joueurs. Leur objectif est d'éliminer tous les villageois sans être découverts."
          role2.className = "m-2";

          container2.appendChild(img2);
          container2.appendChild(role2);
          rules.appendChild(container2);

          const container3 = document.createElement('div');
          container3.className = "flex items-center";

          const img3 = document.createElement('img');
          img3.src = villageoisImage ;
          img3.className = "object-contain h-32 w-32 m-4";

          const role3 = document.createElement('p');
          role3.textContent = "Le Villageois : Ils sont des membres de la communauté innocents qui doivent identifier et éliminer les loups-garous pour protéger leur village. Ils participent aux discussions pendant le jour pour discuter des événements de la nuit précédente et voter pour éliminer les joueurs suspects."
          role3.className = "m-2";

          container3.appendChild(img3);
          container3.appendChild(role3);
          rules.appendChild(container3);

          const container4 = document.createElement('div');
          container4.className = "flex items-center";

          const img4 = document.createElement('img');
          img4.src = voyanteImage ;
          img4.className = "object-contain h-32 w-32 m-4";

          const role4 = document.createElement('p');
          role4.textContent = "La Voyante : Elle a le pouvoir de découvrir le rôle d'un joueur chaque nuit. Ce pouvoir lui permet d'aider les villageois en identifiant les loups-garous potentiels, mais elle doit agir discrètement pour éviter d'être ciblée par les loups-garous ou de révéler son propre rôle."
          role4.className = "m-2";

          container4.appendChild(img4);
          container4.appendChild(role4);
          rules.appendChild(container4);

          const container5 = document.createElement('div');
          container5.className = "flex items-center";

          const img5 = document.createElement('img');
          img5.src = petiteFilleImage ;
          img5.className = "object-contain h-32 w-32 m-4";

          const role5 = document.createElement('p');
          role5.textContent = "La Petite Fille : Elle a le pouvoir de se réveiller discrètement pendant la phase de nuit pour espionner les loups-garous. Pour les espionner elle peut voir leur curseur se deplacer pendant la nuit. Son rôle est donc de recueillir des informations sur l'identité des loups-garous sans être découverte."
          role5.className = "m-2";

          container5.appendChild(img5);
          container5.appendChild(role5);
          rules.appendChild(container5);

          }}>Les rôles :</button>

      </div>
    </div>


  </div>
  <div className=" absolute left-1/3 h-screen w-2/3">
    <div className=" relative w-3/4 h-3/4 bg-slate-600 my-32 mx-8 rounded-xl">
          <div className="absolute w-5/6 h-16 m-10 bg-stone-500 rounded-xl text-center">
          <p className='text-xl'>Lobby Test</p>
          <p>X/8</p></div>
          <button className="absolute bottom-0 right-0 m-8 w-32 h-16">Create</button>
    </div>
  </div> 

  <div className="absolute top-2 right-2 space-x-5">
    {(localStorage.getItem("authUser")) ? 
    (<button onClick={()=>{localStorage.removeItem("authUser");navigate("/")}}><Link to="/login">Se déconnecter</Link></button>) :
    (<><button><Link to="/login">Se connecter</Link></button><button><Link to="/register">S'inscrire</Link></button></>)}
  </div>

  <div className='absolute top-2 right-64 space-x-4'> 
    <audio loop id="musique" src = "/sound/background.mp3" ></audio>
    <button onClick={()=>{let audio = document.getElementById("musique"); audio.play();}}>Play</button>
    <button onClick={()=>{let audio = document.getElementById("musique"); audio.pause(); audio.currentTime = 0;}}>Stop</button>
  </div>
</div>
  )
}

/*
      <div className="flex flex-col space-y-5 text-blue-700"> 
      <button onClick={()=>testHost()}className="bg-sky-950">Héberger une partie</button>
        <button className="bg-sky-950">Rejoindre une partie</button>
        </div>
        <div className="flex overflow-y-scroll">
          <ul>
            {gameList.map((game,id)=>(
              <li id={id} className="cursor-pointer" onClick={(e)=>joinGame(e)} key={game._id}>ID:{game._id} Slot: {game.players?.length}/{game.slot}</li>
            ))}
          </ul>
        </div>
        */