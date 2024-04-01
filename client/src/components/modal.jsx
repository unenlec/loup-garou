export default function Modal({ modalState, setModalState, setSlots, setName, hostHandler }) {
    const hiddenOrNot = modalState ? "block" : "hidden";
    return (
        <div className={hiddenOrNot + " absolute h-full w-full flex justify-center items-center z-50 bg-black/40"}
            onClick={() => { setModalState(false) }}>
            <div className={"absolute  mx-auto bg-slate-100 p-4 rounded-lg flex flex-col space-y-2"} onClick={(e) => e.stopPropagation()}>
                <h1>
                    Création de partie
                </h1>
                <label>Nom de la partie: </label>
                <input onChange={(e) => setName(e.target.value)} placeholder={"Partie de " + JSON.parse(localStorage.getItem("authUser"))?.username}></input>
                <label>Nombre de joueurs: </label>
                <input onChange={(e) => setSlots(e.target.value)} placeholder="4"></input>
                <div className="flex">
                    <label>Temps Discussion: </label>
                    <input className="w-full"></input>
                    <label>Temps Nuit: </label>
                    <input className="w-full"></input>
                </div>
                <button onClick={() => hostHandler()}>
                    Créer
                </button>

            </div >
        </div>
    )
}