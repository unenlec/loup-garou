import '../accueil.css'
import {Link} from "react-router-dom"

export default function Accueil() {
  return (
    <>
      <div>
      <button className='game'><Link to="/game">Héberger une partie</Link></button>
      <br/>
      <br/>
      <br/>
      
      <button className='game'><Link to="/game">Rejoindre une partie</Link></button>
      </div>

      <div className='topright'>
        <button className='log'><Link to="/login">Se connecter</Link></button>
        <button className='log'><Link to="/register">S'inscrire</Link></button>
      </div>

    </>
  )
}