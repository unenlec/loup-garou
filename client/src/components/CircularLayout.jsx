import React,{useEffect,useRef} from 'react';



const CircularLayout = ({usernames,vote})=>{

    const containerRef = useRef(null);

    useEffect(()=>{

        const container = containerRef.current;

        container.innerHTML = '';
    
        const numUsernames = usernames.length;
    
        const radius = Math.min(container.offsetWidth, container.offsetHeight) / 2 * 1.5;
    
        for (let i = 0; i < numUsernames; i++) {
            const div = document.createElement('div');
            div.classList.add('username-div');
            const imgContainer = document.createElement('div');
            const img = document.createElement('img');
            const div2 = document.createElement('div');
            const p = document.createElement('p');
             
            
            const angle = (i / numUsernames) * 2 * Math.PI;
            let x = Math.cos(angle) * radius + container.offsetWidth / 2;
            const y = Math.sin(angle) * radius + container.offsetHeight / 2;
    
            p.textContent = usernames[i][0];
            p.className = "text-xl truncate text-white"
            if(usernames[i][0] == JSON.parse(localStorage.getItem("authUser")).username){
                p.className = "font-bold text-red-500 text-2xl";
           }
            imgContainer.className = "w-24 h-24 absolute bottom-10";
    
            div2.className = "absolute bottom-2";
    
            //img.src = "/images/ppBase.jpg";
            img.src = usernames[i][4]==="" ? "/images/ppBase.jpg" : "http://localhost:4000/api/auth/getimg/"+usernames[i][4];
            imgContainer.appendChild(img);
    
            div2.textContent = usernames[i][2];
            div2.style.fontSize = "1.5rem"; // Tailwind classe "text-lg"
            div2.style.fontWeight = "bold"; // Tailwind classe "font-bold"
            div2.style.color = "red"; // Tailwind classe "text-red-600"
    
            div.style.backgroundImage = `url(/images/planche.jpg)`;
            div.style.backgroundSize = "cover";
            div.style.backgroundPosition = "center";
            div.style.position = 'absolute';
            div.style.left = `${x-50}px`;
            div.style.top = `${y-100}px`;
            div.style.cursor = "pointer";
            div.style.border = "1px solid #ccc";
            div.style.borderRadius = "0.25rem";
            div.style.overflow = "hidden";
            div.style.width = "8rem";
            div.style.height = "10.5rem"; 
            div.style.display = "flex";
            div.style.justifyContent = "center";
            if(usernames[i][3])
            {
                div.style.opacity ="0.5"
            }
            div.appendChild(p);
            div.appendChild(imgContainer);
            
            div.appendChild(div2);
    
            div.onclick = (e) => vote(e);
            container.appendChild(div);
        }
    
    },[usernames])

    return(
        <div id="container" ref={containerRef} className="top-6 w-full h-[300px] relative">
            
        </div>
    )
}
export default CircularLayout;