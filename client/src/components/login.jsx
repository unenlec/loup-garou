import { useState } from 'react'
import '../login.css'

function LOGIN() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <button className='game'>Héberger une partie</button>
      <br/>
      <br/>
      <br/>
      
      <button className='game'>Rejoindre une partie</button>
      </div>

      <div className='topright'>
        <button className='log' >S'inscrire</button>
        <button className='log'>S'inscrire</button>
      </div>

    </>
  )
}

export default LOGIN