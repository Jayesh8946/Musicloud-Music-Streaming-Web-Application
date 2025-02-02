// console.log("Lets write javascript!");

let currentSong = new Audio();
let songs;
let currFolder;

const slider = document.getElementById('volume-slider');

// Function to update the background when the slider is being dragged
function updateSliderBackground() {
    const value = slider.value; // Get current slider value (0 to 100)
    const max = slider.max;
    const percentage = (value / max) * 100; // Calculate percentage of completion

    // Set background gradient: orange up to the percentage, then rgb(160, 160, 160)
    slider.style.background = `linear-gradient(to right, orange ${percentage}%, rgb(160, 160, 160) ${percentage}%)`;
}

// Set initial background gradient
updateSliderBackground();

// Update the gradient as the user drags the slider
slider.addEventListener('input', updateSliderBackground);



function secondsToMinutesSeconds(seconds) {

       // Check if the input is a valid number and non-negative
       if (isNaN(seconds) || seconds < 0) {
        return "00:00"; // Return "00:00" for invalid input
    }

    // Calculate minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds to be always two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){

    currFolder = folder;
    let a = await fetch(`/${folder}/`);   //http://127.0.0.1:3000
    let response = await a.text();
    // console.log(response);
    // console.log(a); 

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    // console.log(as);
    songs = [];
    for(let i=0; i<as.length; i++){
        const element = as[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }


     //Show all the songs in the playlist-------------
     let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
     songUL.innerHTML = "";
     for (const song of songs) {
         songUL.innerHTML = songUL.innerHTML + 
                         `<li>
                             <i class="ri-music-2-line" style="color: rgb(160, 160, 160); font-size: 26px;" onMouseOver="this.style.color='white'" onMouseOut="this.style.color='rgb(160, 160, 160)'"></i> 
                             <div class="info">
                                 <div>${song.replaceAll("%20", " ")}</div>
                                 <div></div>
                             </div>
                             <div class="playnow">
                                 <span style="color: rgb(160, 160, 160);" onMouseOver="this.style.color='white'" onMouseOut="this.style.color='rgb(160, 160, 160)'">Play Now</span>
                                 <i class="ri-play-circle-line" style="color: rgb(160, 160, 160); font-size: 26px;" onMouseOver="this.style.color='white'" onMouseOut="this.style.color='rgb(160, 160, 160)'"></i>
                             </div>
                         </li>`;
     }
 
     //Attach an event listener to all the songs-----------
     Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e =>{
         // console.log(e.target); //this will print undefined
         // console.log(e.getElementsByTagName("div")[0]);
         e.addEventListener("click", element=>{
             console.log(e.querySelector(".info").firstElementChild.innerHTML);
             playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
         })
     })

    return songs;

}



const playMusic = (track, pause=false)=>{
    // let audio = new Audio("/songs/" + track);

    currentSong.src = `/${currFolder}/` + track

    if(!pause){
        currentSong.play();
        // Update the button to show the pause icon (since the song is playing)
    document.getElementById("play").style.display = "none";  // Hide play icon
    document.getElementById("pause").style.display = "inline";  // Show pause icon
    }
    

    

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}


async function displayAlbums(){
    let a = await fetch(`/songs/`);    //http://127.0.0.1:3000
    let response = await a.text();
    // console.log(response);
    // console.log(a); 

    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");

   let array =  Array.from(anchors);
        for(let index=0; index < array.length; index++){
            const e = array[index];

        // console.log(e.href);
        if(e.href.includes("/songs") && !e.href.includes(".htaccess")){
            // console.log(e.href.split("/").slice(-2)[0]);
            let folder = e.href.split("/").slice(-2)[0];
            //Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`);    //http://127.0.0.1:3000
            let response = await a.json();
            console.log(response);

            
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <i class="ri-play-fill"></i>
                        </div>
        
                        <img src="/songs/${folder}/cover.jpeg" alt="cover image of folder">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`
        }
    }
    
    // console.log(div);

   //Load the playlist from the folder whenever card is clicked--------------
   Array.from(document.getElementsByClassName("card")).forEach(e=>{
    // console.log(e);
    e.addEventListener("click", async item=>{
        // console.log(item.target, item.currentTarget.dataset);
        
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        playMusic(songs[0]);
    })
    })

    
}

async function main(){

    //Get the list of all the songs-----
    await getSongs("songs/Funky_English_Hits");
    playMusic(songs[0], true)  //set 
    // console.log(songs);

    currentSong.volume = 0.1;  // Set the volume to 30%
    document.querySelector(".range").getElementsByTagName("input")[0].value = 10;  // Set the volume slider to 30%



   //Display all the albums on the page-----------------
   displayAlbums();
   

    //Attach an event listener to play next and previous----------
    playButton.addEventListener("click", () => {
        const playIcon = document.getElementById("play");
        const pauseIcon = document.getElementById("pause");
        
        if (currentSong.paused) {
            currentSong.play();
            playIcon.style.display = "none";  // Hide the play icon
            pauseIcon.style.display = "inline";  // Show the pause icon
        } else {
            currentSong.pause();
            playIcon.style.display = "inline";  // Show the play icon
            pauseIcon.style.display = "none";  // Hide the pause icon
        }
    });
    

    //Attach an event listener for timeupdate event-------------
    currentSong.addEventListener("timeupdate", ()=>{
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Attach an event listener for seekbar----------
    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

        document.querySelector(".circle").style.left = percent + "%";

        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })


    //Attach an event listener for hamburger----------
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0";
    })

    //Attach an event listener for close----------
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%"
    })


    //Attach an event listener for previous and next----------
    previous.addEventListener("click", ()=>{
        // console.log("Previous clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);

        // Ensure we don't go below the first song
        if((index-1) >=0){
            playMusic(songs[index-1]);  // Play the previous song 
        }else {
            // Optionally, loop back to the last song if at the beginning
            playMusic(songs[songs.length - 1]); 
        }
        
    })

    next.addEventListener("click", ()=>{
        // console.log("next clicked");
        // console.log(currentSong);
        // console.log(currentSong.src);
        // console.log(currentSong.src.split("/"));
        // console.log(currentSong.src.split("/").slice(-1));
        // console.log(currentSong.src.split("/").slice(-1)[0]);

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        // console.log(index);
           
           currentSong.pause();
           // Ensure we don't exceed the playlist length
           if ((index + 1) < songs.length) {
             playMusic(songs[index + 1]); // Play the next song in the list
           } else {
           // Optionally, loop back to the first song if at the end
            playMusic(songs[0]); 
           }
        
        // console.log(songs); 
    })

    //Attach an event listener for volume----------
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        // console.log(e, e.target, e.target.value);
        // console.log("setting volume to", e.target.value, "/100");
        
        const noisyIcon = document.getElementById("noisy");
        const muteIcon = document.getElementById("mute");
        
        currentSong.volume = parseInt(e.target.value) / 100;
        if(currentSong.volume > 0){
            noisyIcon.style.display = "inline";  // Show the noisy icon
            muteIcon.style.display = "none";  // Hide the mute icon
        }
        
    })

 
    // //Play the first song-----
    // var audio = new Audio(songs[0]);
    // // audio.play();

    // audio.addEventListener("loadeddata", () => {
    //     // let duration = audio.duration; 
    //     console.log(audio.duration, audio.currentSrc, audio.currentTime);
        
    //     // The duration variable now holds the duration (in seconds) of the audio clip
    //   });



    //Add An event listener to mute the song-----
    // document.querySelector(".volume>i").addEventListener("click", e=>{
    //     console.log(e.target);
        
    // })

    let previousVolume = currentSong.volume;  // Store the last volume before muting

    document.querySelector(".volume").addEventListener("click", () => {
        const noisyIcon = document.getElementById("noisy");
        const muteIcon = document.getElementById("mute");
        const volumeSlider = document.querySelector(".range").getElementsByTagName("input")[0];
    
        if (noisyIcon.style.display !== "none") {
            // Mute the song
            previousVolume = currentSong.volume;  // Save the current volume before muting
            currentSong.volume = 0;  // Mute the song
            noisyIcon.style.display = "none";  // Hide the noisy icon
            muteIcon.style.display = "inline";  // Show the mute icon
            volumeSlider.value = 0;  // Set the seekbar to 0 (muted)
        } else {
            // Unmute the song and restore the last volume
            currentSong.volume = previousVolume;  // Restore the volume
            noisyIcon.style.display = "inline";  // Show the noisy icon
            muteIcon.style.display = "none";  // Hide the mute icon
            volumeSlider.value = previousVolume * 100;  // Set seekbar to the previous volume
        }
    });
    
    // Update volume dynamically when the seekbar is moved
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("input", (e) => {
        const volume = e.target.value / 100;  // Convert seekbar value (0-100) to volume (0-1)
        currentSong.volume = volume;  // Set the current song volume
        previousVolume = volume;  // Update the last volume
    });
    
}

main();


