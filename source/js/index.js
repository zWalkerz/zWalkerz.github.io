const token = localStorage.getItem("token");
const urlTrack = "https://api.spotify.com/v1/search?type=track";
var accounts;
var user;
var song = {

    name: null,
    art: null,
    release_date: null,
    explicit: null

};

var playlist = {

    name : null,
    desc : null,
    tag : null

    };



//CHECK - Controllo che il token (la sessione dunque) non sia scaduta

(function () {


    if(!window.localStorage.getItem("accounts")){

        alert("Browser incompatibile");
        window.location.replace("signup/signup.htm");

    }

    accounts = JSON.parse(window.localStorage.getItem("accounts"));
    user = accounts.find((e) => e.token == token);

    if ((Math.floor(Date.now() / 1000) - user.today) >= user.expires_in) {

        alert("La tua sessione e' scaduta, effettuare nuovamente login");
        window.location.replace("login/login.htm");

    }

})();



//FETCH CONTINUO - Faccio un fetch ogni volta che si scrive qualcosa sull'elemento di input

var search = document.getElementById("form1");
search.addEventListener("keyup", e => {

    if(e.target.value.replace(/\s/g, "").length != 0){    //Uso una regular expression per togliere gli spazi ed evitare fetch a vuoto
    fetchTrack(e.target.value);
    }

});


//STAMPA - Creo una struttura json rappresentante l'elemento e poi la utilizzo per aggiornare la pagina. 

async function fetchTrack(track) {

    let response = await fetch(urlTrack + "&q=" + track + "&limit=1", {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    });

    let json = await response.json();
    
    if (json.tracks.items.length != 0) {
    song = {

        name: json.tracks.items[0].artists[0].name + " - " + json.tracks.items[0].name,
        art: json.tracks.items[0].album.images[0].url,
        release_date: json.tracks.items[0].album.release_date,
        explicit: json.tracks.items[0].explicit

    };

    document.getElementsByClassName("searched__art")[0].children[0].src = song.art;
    document.getElementsByClassName("searched__song__title")[0].innerHTML = song.name;
    document.getElementsByClassName("searched__song__date")[0].children[0].innerHTML = song.release_date;
    
    } else {

    alert("Il brano cercato non esiste");

    }
}

//ADD TRACK - Aggiorno la playlist inserendovi la track

function Add() {

    console.log(song);

}



function newPlaylist(){

    var playlist = {

    name : prompt("Inserisci il nome della playlist"),
    desc : prompt("Inserisci una descrizione della playlist"),
    tag : prompt("Inserisci una serie di tag per la playlist")

    };

    let block = document.createElement("div");
    block.setAttribute("class", 4)
    block.innerHTML = "<div class='track'> <div class='track__title'>" + playlist.name + "</div> <input type='text' class='label' value='" + playlist.desc + "' readonly spellcheck='false'><input type='text' class='label' value='" + playlist.tag + "' readonly spellcheck='false'><div class='controls'> <button onclick='editPlaylist(this);' class='btn btn-outline-success' type='submit'>Edit</button> <button onclick='deletePlaylist(this);' class='btn btn-outline-success' type='submit'>Delete</button> <button onclick='sharePlaylist(this);' class='btn btn-outline-success' type='submit'>Share</button></div></div>"
    let playlists = document.getElementById("2");
    playlists.appendChild(block)

    user.playlists.push(JSON.parse(JSON.stringify(playlist)));

    console.log(user);

}

function deletePlaylist(){




}

function editPlaylist(){




}

function sharePlaylist(){




}
