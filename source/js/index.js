const urlTrack = "https://api.spotify.com/v1/search?type=track";
var accounts;
var user;
var token;
var globalShared;

var song = {

    name: null,
    art: null,
    release_date: null,
    explicit: null

};

var playlist = {

    name: null,
    desc: null,
    tag: null

};




/* It's a self-invoking function that checks if the user is logged in and if the session is still
valid. If it's not, it redirects the user to the login page. */

(function () {


    if (!window.localStorage.getItem("accounts")) {

        alert("Registrarsi prima");
        window.location.replace("signup/index.htm");

    } else if (!window.localStorage.getItem("token")) {

        alert("Effettuare login");
        window.location.replace("login/index.htm");

    }

    token = window.localStorage.getItem("token");
    accounts = JSON.parse(window.localStorage.getItem("accounts"));
    user = accounts.find((e) => e.token == token);
    globalShared = JSON.parse(window.localStorage.getItem("globalShared"));

    if ((Math.floor(Date.now() / 1000) - user.today) >= user.expires_in) {

        alert("La tua sessione e' scaduta, effettuare nuovamente login");
        window.location.replace("login/index.htm");

    }




})();


/* A self-invoking function that creates a block for each playlist and adds it to the playlists
section of the page everytime the site is loaded. */

(function () {

    user.playlists.forEach(e => {

        let block = document.createElement("div");
        block.setAttribute("class", "track");
        block.innerHTML = "<div class='track__title'>" + e.name + "</div> <input type='text' class='label' value='" + e.desc + "' readonly spellcheck='false'><input type='text' class='label' value='" + e.tag + "' readonly spellcheck='false'><div class='controls'> <button onclick='editPlaylist(this);' class='btn btn-outline-success' type='submit'>Edit</button> <button onclick='deletePlaylist(this);' class='btn btn-outline-success' type='submit'>Delete</button> <button onclick='sharePlaylist(this);' class='btn btn-outline-success' type='submit'>Share</button></div>"
        let playlists = document.getElementById("2");
        playlists.appendChild(block);

    });


})();

/* A self-invoking function that creates a block for each shared playlist and adds it to the shared
section of the page everytime the site is loaded. */

(function () {

    user.shared.forEach(e => {

        let block = document.createElement("div");
        block.setAttribute("class", "track");
        block.innerHTML = "<div class='track__title'>" + e.name + "</div> <input type='text' class='label' value='" + e.desc + "' readonly spellcheck='false'><input type='text' class='label' value='" + e.tag + "' readonly spellcheck='false'><div class='controls'> <button onclick='noShare(this);' class='btn btn-outline-success' type='submit'>No share</button></div>"
        let sharedSection = document.getElementById("3");
        sharedSection.appendChild(block);

    });


})();





/* Adding an event listener to the search bar, so that when the user types something, the function
fetchTrack is called. */

var search = document.getElementById("form1");
search.addEventListener("keyup", e => {

    if (e.target.value.replace(/\s/g, "").length != 0) {    //Uso una regular expression per togliere gli spazi ed evitare fetch a vuoto
        fetchTrack(e.target.value);
    }

});


/**
 * It takes a track name as input, it fetches the track from the Spotify API, it creates a json object
 * with the track's name, album art, release date and explicit status, and it updates the page with the
 * new information
 * @param track - the name of the song you want to search for
 * @returns the song object.
 */

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

        console.log(json.tracks.items[0]);

        document.getElementsByClassName("searched__art")[0].children[0].src = song.art;
        document.getElementsByClassName("searched__song__title")[0].innerHTML = song.name;
        document.getElementsByClassName("searched__song__date")[0].children[0].innerHTML = song.release_date;

    } else {

        alert("Il brano cercato non esiste");
        return

    }
}

//ADD TRACK - Aggiorno la playlist inserendovi la track

function Add() {

    console.log(song);

}



/**
 * It creates a new playlist and adds it to the user's playlists section
 * @returns the value of the variable error.
 */
function newPlaylist() {

    playlist = {

        name: prompt("Inserisci il nome della playlist"),
        desc: prompt("Inserisci una descrizione della playlist"),
        tag: prompt("Inserisci una serie di tag per la playlist"),
        songs: []

    };

    if (playlist.name == null || playlist.desc == null) {

        error = true;
        alert("Nome e descrizione devono contenere almeno un valore")
        return

    } else if (checkTag(playlist.tag) == false) {

        error = true;
        alert("I tag devono succedere un cancelletto (#) e non possono iniziare con numeri o caratteri alfanumerici");
        return
    }

    if (user.playlists.some(e => e.name == playlist.name) == false) {
        let block = document.createElement("div");
        block.setAttribute("class", "track");
        block.innerHTML = "<div class='track__title'>" + playlist.name + "</div> <input type='text' class='label' value='" + playlist.desc + "' readonly spellcheck='false'><input type='text' class='label' value='" + playlist.tag.join() + "' readonly spellcheck='false'><div class='controls'> <button onclick='editPlaylist(this);' class='btn btn-outline-success' type='submit'>Edit</button> <button onclick='deletePlaylist(this);' class='btn btn-outline-success' type='submit'>Delete</button> <button onclick='sharePlaylist(this);' class='btn btn-outline-success' type='submit'>Share</button></div>"
        let playlists = document.getElementById("2");
        playlists.appendChild(block)

        user.playlists.push(JSON.parse(JSON.stringify(playlist)));
        localStorage.setItem("accounts", JSON.stringify(accounts));

        console.log(accounts);

    } else {

        alert("La playlist esiste già");

    }
}

/**
 * It deletes the playlist from the DOM and from the user's account
 * @param e - the event that was triggered
 */
function deletePlaylist(e) {

    let parent = e.closest(".track");
    let toDelete = parent.getElementsByClassName("track__title")[0].innerHTML;
    parent.remove();

    user.playlists.forEach(function (e, index) {

        if (e.name == toDelete) {

            user.playlists.splice(index, 1);

        }

    })

    window.localStorage.setItem("accounts", JSON.stringify(accounts));

}

function editPlaylist(e) {

    let edited;

    let parent = e.closest(".track");
    let toEdit = parent.getElementsByClassName("track__title")[0].innerHTML;
    if(user.playlists.some(e => e.name == toEdit)) {

        user.playlists.forEach(e => {

            if (e.name == toEdit){
            window.localStorage.setItem("editing", JSON.stringify(e));
            }
        })


    }

    editing();

}

/**
 * It takes the playlist that the user wants to share, and adds it to the shared section of the page.
 * @param e - the element that was clicked
 */
function sharePlaylist(e) {

    let shared;

    let parent = e.closest(".track");
    let toShare = parent.getElementsByClassName("track__title")[0].innerHTML;
    if (user.shared.some(e => e.name == toShare) == false) {
        user.playlists.forEach(function (e) {

            if (e.name == toShare) {

                shared = e;

            }

        })

        let block = document.createElement("div");
        block.setAttribute("class", "track");
        block.innerHTML = "<div class='track__title'>" + shared.name + "</div> <input type='text' class='label' value='" + shared.desc + "' readonly spellcheck='false'><input type='text' class='label' value='" + shared.tag.join() + "' readonly spellcheck='false'><div class='controls'> <button onclick='noShare(this);' class='btn btn-outline-success' type='submit'>No share</button></div>"
        let sharedSection = document.getElementById("3");
        sharedSection.appendChild(block)

        user.shared.push(shared);
        window.localStorage.setItem("accounts", JSON.stringify(accounts))

    }

    updateShared()

}


/**
 * It removes the track from the shared list and deletes it from the local storage
 * @param e - the event that was triggered
 */
function noShare(e) {

    let parent = e.closest(".track");
    let toDelete = parent.getElementsByClassName("track__title")[0].innerHTML;
    parent.remove();

    user.shared.forEach(function (e, index) {

        if (e.name == toDelete) {

            user.shared.splice(index, 1);

        }

    })

    window.localStorage.setItem("accounts", JSON.stringify(accounts));
    deleteUpdatedShare(toDelete);



}

/**
 * It takes a string, checks if it contains a hashtag, and if it does, it returns the hashtag
 * @param e - the string to be checked
 * @returns a boolean value.
 */
function checkTag(e) {

    let errPattern = /(#\w+)/gm;
    e = e.match(errPattern);

    if (e != null) {

        playlist.tag = e;
        return true

    } else {

        return false

    }



}

/**
 * It updates the shared playlists page
 */
function updateShared() {

    var block;
    var section = document.getElementById("4");
    accounts.forEach(e => {

        e.shared.forEach(el => {

            if (!globalShared.some(ell => ell == el)) {
                block = document.createElement("div");
                block.setAttribute("class", "track");
                block.innerHTML = "<div class='track__title'>" + el.name + "</div> <input type='text' class='label' value='" + el.desc + "' readonly spellcheck='false'><input type='text' class='label' value='" + el.tag.join() + "' readonly spellcheck='false'>"
                section.appendChild(block);
                globalShared.push(el)

            }
        })


    })

    window.localStorage.setItem("globalShared", JSON.stringify(globalShared));

}



/**
 * It deletes the shared playlists from the list of shares in the "Shared playlist" section of the page
 * @param e - the name of the playlist to be deleted
 */

function deleteUpdatedShare(e) {

/* It's filtering the globalShared array, and returning only the elements that are in the user's shared
array. */

    globalShared = globalShared.filter(e => {

        if (user.shared.some(el => el == e)) {

            return true

        }

        return false

    })

    let toDelete;
    let section = document.getElementById("4");
    let list = section.childNodes;
    for (var i = 1; i < list.length; i++) {

        if (list[i].firstChild.textContent == e) {

            console.log("Eureka")
            toDelete = list[i];
            break;

        }

    }

    section.removeChild(toDelete);
    window.localStorage.setItem("globalShared", JSON.stringify(globalShared));

}

function editing() {

    let section = document.getElementById("1");
    let currentPlaylist = JSON.parse(localStorage.getItem("editing"));

    if(currentPlaylist.songs.length == 0) {

        section.innerHTML = "<span class = 'label'>No songs </span>";

    }
    else {

        block = document.createElement("div");
        block.setAttribute("class", "track");
        block.innerHTML = "<div class='track__art'> <img src= " + song.art + "></div><div class='track__title'>" + song.name;
        section.appendChild(block);


    }



}


