import '../accueil.css'

export default function Accueil() {

  function RedirectionRegister(){
    document.location.href="./register"
  }

  function RedirectionGame(){
    document.location.href="./game"
  }

  function RedirectionLogin(){
    document.location.href="./login"
  }

  return (
    <>
      <div>
      <button className='game' onClick={RedirectionGame}>Héberger une partie</button>
      <br/>
      <br/>
      <br/>
      
      <button className='game' onClick={RedirectionGame}>Rejoindre une partie</button>
      </div>

      <div className='topright'>
        <button className='log' onClick={RedirectionLogin}>Se connecter</button>
        <button className='log' onClick={RedirectionRegister}>S'inscrire</button>
      </div>

    </>
  )
}