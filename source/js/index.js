var token;
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

        alert("Registrarsi prima");
        window.location.replace("signup/index.htm");

    } else if(!window.localStorage.getItem("token")){

        alert("Effettuare login");
        window.location.replace("login/index.htm");

    }

    token = window.localStorage.getItem("token");
    accounts = JSON.parse(window.localStorage.getItem("accounts"));
    user = accounts.find((e) => e.token == token);

    if ((Math.floor(Date.now() / 1000) - user.today) >= user.expires_in) {

        alert("La tua sessione e' scaduta, effettuare nuovamente login");
        window.location.replace("login/index.htm");

    }

    

})();


(function() {

    user.playlists.forEach(e => {

        let block = document.createElement("div");
        block.setAttribute("class", "track");
        block.innerHTML = "<div class='track__title'>" + e.name + "</div> <input type='text' class='label' value='" + e.desc + "' readonly spellcheck='false'><input type='text' class='label' value='" + e.tag + "' readonly spellcheck='false'><div class='controls'> <button onclick='editPlaylist(this);' class='btn btn-outline-success' type='submit'>Edit</button> <button onclick='deletePlaylist(this);' class='btn btn-outline-success' type='submit'>Delete</button> <button onclick='sharePlaylist(this);' class='btn btn-outline-success' type='submit'>Share</button></div>"
        let playlists = document.getElementById("2");
        playlists.appendChild(block);

    });


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

    let error;

    do{

        error = false;

    playlist = {

    name : prompt("Inserisci il nome della playlist"),
    desc : prompt("Inserisci una descrizione della playlist"),
    tag : prompt("Inserisci una serie di tag per la playlist")

    };

    if(playlist.name == null || playlist.desc == null) {

        error = true;
        alert("Nome e descrizione devono contenere almeno un valore")

    } else if(checkTag(playlist.tag) == false){

        error = true;
        alert("I tag devono succedere un cancelletto (#) e non possono iniziare con numeri o caratteri alfanumerici");

    }

} while(error);

    let block = document.createElement("div");
    block.setAttribute("class", "track");
    block.innerHTML = "<div class='track__title'>" + playlist.name + "</div> <input type='text' class='label' value='" + playlist.desc + "' readonly spellcheck='false'><input type='text' class='label' value='" + playlist.tag + "' readonly spellcheck='false'><div class='controls'> <button onclick='editPlaylist(this);' class='btn btn-outline-success' type='submit'>Edit</button> <button onclick='deletePlaylist(this);' class='btn btn-outline-success' type='submit'>Delete</button> <button onclick='sharePlaylist(this);' class='btn btn-outline-success' type='submit'>Share</button></div>"
    let playlists = document.getElementById("2");
    playlists.appendChild(block)

    user.playlists.push(JSON.parse(JSON.stringify(playlist)));
    localStorage.setItem("accounts", JSON.stringify(accounts));

    console.log(accounts);

}

function deletePlaylist(e){

    let parent = e.closest(".track");
    let toDelete = parent.getElementsByClassName("track__title")[0].innerHTML;
    parent.remove();

    user.playlists.forEach(function(e, index) {

        if(e.name == toDelete) {

            user.playlists.splice(index, 1);
            
        }

    })
    
    console.log(user.playlists[0].name, toDelete);
    window.localStorage.setItem("accounts",JSON.stringify(accounts));

}

function editPlaylist(){




}

function sharePlaylist(){




}

function checkTag(e) {

    let errPattern = /.*?(#\w+)|.+/i;
    e = e.match();
    console.log(e)

    if(e.length > 0){

        playlist.tag = e;
        return true

    } else {

        return false

    }



}
