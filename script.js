console.log("Lets write js")

async function getsongs(){   // i am using this because there is no any Api its just a clint side project so we need to get songs from folder thats why this function which fetch song from folder

    let a =  await fetch("http://127.0.0.1:3000/songs/") 
    let response = await a.text();
    let div = document.createElement("div") 
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
        
    }
    return songs;

}

async function main(){
    // Get the list of all the songs
    let songs = await getsongs()
    console.log(songs)
    
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> ${song.replaceAll("%20"," ")} </li>`;
        
    }

    // Play the frist song
    var audio = new Audio(songs[0]);
    // audio.play();

    audio.addEventListener("loadeddata",()=>{
    
        console.log(audio.duration , audio.currentSrc, audio.currentTime)
    })
}

main()
