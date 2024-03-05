import '../accueil.css'
import {Link} from "react-router-dom"
import {useNavigate} from "react-router-dom"
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import {useContext} from "react"

export default function Accueil() {
  const { authUser, setAuthUser } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <>
      <div>
      <button className='game'><Link to="/game">Héberger une partie</Link></button>
      <br/>
      <br/>
      <br/>
      
      <button className='game'><Link to="/game">Rejoindre une partie</Link></button>
      </div>
      {localStorage.getItem("authUser") ? (
        <div className='topright'>
          <button onClick={()=>
            {
              localStorage.removeItem("authUser");
              setAuthUser(null)
              toast.success("Deconnexion OK...");
              setTimeout(()=>navigate(0),1000);
            }} className='log'>Deconnexion</button>
        </div>
      ) :(
      <div className='topright'>
        <button className='log'><Link to="/login">Se connecter</Link></button>
        <button className='log'><Link to="/register">S'inscrire</Link></button>
      </div>)}

    </>
  )
}