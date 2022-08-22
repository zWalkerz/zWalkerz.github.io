const urlTrack = "https://api.spotify.com/v1/search?type=track";
const urlGenres = "https://api.spotify.com/v1/recommendations/available-genre-seeds"
const urlArtists = "https://api.spotify.com/v1/search?type=artist";


var accounts;
var user;
var token;

var playlist = {

    name: null,
    desc: null,
    tag: null

};




/* It's a self-invoking function that checks if the user is logged in and if the session is still
valid. If it's not, it redirects the user to the login page.  */

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

    if ((Math.floor(Date.now() / 1000) - user.today) >= user.expires_in) {

        alert("La tua sessione e' scaduta, effettuare nuovamente login");
        window.location.replace("login/index.htm");

    }




})();


/* Calling the function editing() */
(function () {

    editing();


})();


/* Creating a div element for each playlist in the user's playlist array. */

(function () {

    user.playlists.forEach(e => {

        let block = document.createElement("div");
        block.setAttribute("class", "track");
        block.innerHTML = "<div class='track__title'>" + e.name + "</div> <input type='text' class='label' value='" + e.desc + "' readonly spellcheck='false'><input type='text' class='label' value='" + e.tag + "' readonly spellcheck='false'><div class ='controls'> <button onclick='editPlaylist(this);' class='btn btn-outline-success' type='submit'>Edit</button> <button onclick='deletePlaylist(this);' class='btn btn-outline-success' type='submit'>Delete</button> <button onclick='sharePlaylist(this);' class='btn btn-outline-success' type='submit'>Share</button></div>"
        let playlists = document.getElementById("two");
        playlists.appendChild(block);

    });


})();





/* Creating a div element for each element in the array. */

var count = 0;

(function () {

    let updated = [];
    let section = document.getElementById("four");

    accounts.forEach(e => {
        e.shared.forEach(el => {

            count++;

            let block = document.createElement("div");
            block.setAttribute("class", "track");
            block.innerHTML = "<div class='track__title'>" + el.name + "</div> <input type='text' class='label' value='" + el.desc + "' readonly spellcheck='false'><input type='text' class='label' value='" + el.tag.join() + "' readonly spellcheck='false'> <div class='controls'> <button onclick='addShared(this);' class='btn btn-outline-success' type='submit'>Add</button><button onclick='viewShared(this);' class='btn btn-outline-success' type='submit' data-bs-toggle='collapse' data-bs-target = '#viewPlaylist" + count + "'>View</button></div>";
            section.appendChild(block);
            let menu = document.createElement("div");
            menu.setAttribute("id", "viewPlaylist" + count);
            menu.setAttribute("class", "collapse");
            section.appendChild(menu);
            updated.push(el);
        })
    })

    window.sessionStorage.setItem("globalShared", JSON.stringify(updated));

})();


/* Creating a div element with the class track and appending it to the sharedSection. */
(function () {

    user.shared.forEach(e => {

        let block = document.createElement("div");
        block.setAttribute("class", "track");
        block.innerHTML = "<div class='track__title'>" + e.name + "</div> <input type='text' class='label' value='" + e.desc + "' readonly spellcheck='false'><input type='text' class='label' value='" + e.tag + "' readonly spellcheck='false'><div class ='controls'> <button onclick='noShare(this);' class='btn btn-outline-success' type='submit'>No share</button></div>"
        let sharedSection = document.getElementById("three");
        sharedSection.appendChild(block);

    });


})();


/* Adding an event listener to each tab. When a tab is clicked, it checks the id of the tab and changes
the placeholder of the search bar accordingly. */
tabs = document.querySelectorAll(".nav-link");
tabs.forEach(tab => {

    tab.addEventListener("click", e => {

        if (e.target.id == "manage") {

            search.style.display = "";
            search.placeholder = "Seach a song";

        } else if (e.target.id == "playlist") {

            search.style.display = "none";

        } else if (e.target.id == "shared") {

            search.style.display = "";
            search.placeholder = "Search a playlist";

        } else if (e.target.id == "profile") {

            search.style.display = "none";

        }
    });

});



/* Adding an event listener to the search input. When the user types something, it checks if the active
tab is the "manage-playlist" one. If it is, it calls the fetchTrack function and passes the value of
the input as a parameter. If it is not, it filters the tracks in the "shared-ones" tab. */

let search = document.getElementById("form1");
search.addEventListener("keyup", e => {


    let tab = document.querySelector(".tab-pane.active");
    if (tab.id == "manage-playlist") {

        if (e.target.value.replace(/\s/g, "").length != 0) {  // Checking if the input is not empty

            /* Fetching the track from the API and returning a wrap ready to use */

            (async () => { addWrap = await fetchTrack(e.target.value); })();
        }
    } else if (tab.id == "shared-ones") {
        
        /* Searching for the tracks in the playlist and if it finds the track it will display it. */

        let flag
        let filter, tracks, title, i, txtValue;
        filter = e.target.value.toUpperCase();
        tracks = document.getElementById("four").querySelectorAll(".tracks>.track");

        for (i = 0; i < tracks.length; i++) {

            flag = false;
            title = tracks[i].getElementsByClassName("track__title")[0];
            txtValue = title.innerHTML;

            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                
                tracks[i].style.display = "";
                tracks[i].nextSibling.style.display = "";
                flag = true;
            }

            if (tracks[i].getElementsByTagName("input")[1].value.toUpperCase().indexOf(filter) > -1) {
                
                tracks[i].style.display = "";
                tracks[i].nextSibling.style.display = "";
                flag = true;
            }


            if(tracks[i].nextSibling.children.length != 0){

            for(j = 0; j < tracks[i].nextSibling.children.length && !flag; j++){

                if(tracks[i].nextSibling.children[j].getElementsByClassName("track__title")[0].innerHTML.toUpperCase().indexOf(filter) > -1){

                    tracks[i].style.display = "";
                    tracks[i].nextSibling.style.display = "";
                    flag = true;
                }


            }
        }

            if(!flag){

                tracks[i].style.display = "none";
                tracks[i].nextSibling.style.display = "none";

            }
        

        }
    }
});


/**
 * It takes a track name as input, it fetches the track from the Spotify API, it creates a json object
 * with the track's name, album art, release date and explicit status, and it updates the page with the
 * new information
 * @param track - the name of the song you want to search for
 * @returns a function with the song in it as input
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

        let song = {

            name: json.tracks.items[0].artists[0].name + " - " + json.tracks.items[0].name,
            art: json.tracks.items[0].album.images[0].url,
            release_date: json.tracks.items[0].album.release_date,
            explicit: json.tracks.items[0].explicit,
            duration: Math.floor(json.tracks.items[0].duration_ms / 1000 / 60) + ":" + Math.floor(json.tracks.items[0].duration_ms / 1000 % 60),

        };

        document.getElementsByClassName("searched__art")[0].children[0].src = song.art;
        document.getElementsByClassName("searched__song__title")[0].innerHTML = song.name;
        document.getElementsByClassName("searched__song__date")[0].children[0].innerHTML = song.release_date;
        document.getElementsByClassName("searched__song__duration")[0].children[0].innerHTML = song.duration;

        return function () {

            Add(song);

        }

    } else {

        alert("Il brano cercato non esiste");
        return

    }
}

(async function(){

    let genre = document.getElementById("genre");
    let block = "";

    let response = await fetch(urlGenres, {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    });

    let json = await response.json();

    json.genres.forEach(e => {

        block = block + "<option>"+e+"</option>";

    });

    genre.innerHTML = block;
    $('#genre').selectpicker('refresh') ? addSelectedGenres() : console.log("Error");

 


})();


function addSelectedGenres() {

    let toSelect = document.getElementById("genres").getElementsByClassName("text");
    let selected = user.genres;

    for(i = 0; i < toSelect.length; i++) {

        selected.some(e => e == toSelect[i].innerHTML) ? toSelect[i].parentNode.click() : null;

    }

}


    searched = document.getElementById("artist");
    searched.addEventListener("input", async e => {

        let data = document.getElementById("artist_data");
        let block = "";
        let response = await fetch(urlArtists + "&q=" + e.target.value + "&limit=3", {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        });
    
        let json = await response.json();
    
        json.artists.items.forEach(artist_name => {
    
            block = block + "<option value = '" + artist_name.name + "'/>";
    
        });
    
        data.innerHTML = block;    
    
    });


(function () {

    let searched = document.getElementById("artist");
    searched.value = "";
    let selected = user.artists;

    for (i = 0; i < selected.length; i++) {

        searched.value = searched.value + selected[i] + ", ";

    }

})();

function send(){

    let artist_flag = false;
    let genre_flag = false;

    let genre_list = document.getElementsByClassName("filter-option-inner-inner")[0].innerHTML;
    let artist_list = document.getElementById("artist").value;

    if(genre_list != "Scegli almeno un genere" || genre_list != ""){
        genre_list = genre_list.replace(/\s/g, "");  // / \s / e' per ricercare un pattern (gli spazi \s), g è per una ricerca globale
        let subs = genre_list.split(",");
        subs.forEach(e => {
    
            user.genres.push(e);
    
        });

        genre_flag = true;
    
    }

    if(checkArtist(artist_list)){

        artist_list = artist_list.replace(/\s/g, "");  // / \s / e' per ricercare un pattern (gli spazi \s), g è per una ricerca globale
        let subs = artist_list.split(",");
        subs.forEach(e => {
    
            user.artists.push(e);
    
        });

        artist_list = true;

    }

    message(genre_flag, artist_list);
}

function checkArtist(list) {

    


}

/**
 * It adds a song to the playlist that is currently being edited.
 * @param song - {name: "song name", artist: "artist name", album: "album name", duration: "duration",
 * url: "url"}
 */
function Add(song) {

    /* Checking if the song is already in the playlist. */
    let flag = true;
    let editing_storage = JSON.parse(window.sessionStorage.getItem("editing"));
    editing_storage.songs.forEach(e => {

        if (e.name == song.name) {

            flag = false;

        }

    })

    if (flag) {
        let ind;
        editing_storage.songs.push(song);
        user.playlists.forEach((e, index) => {

            if (e.name == editing_storage.name) {

                ind = index;

            }

        });

        user.playlists[ind] = editing_storage;
    }
    window.sessionStorage.setItem("editing", JSON.stringify(editing_storage));
    window.localStorage.setItem("accounts", JSON.stringify(accounts));

    editing();

}

/**
 * It creates a new playlist and adds it to the user's playlists section
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
        block.innerHTML = "<div class='track__title'>" + playlist.name + "</div> <input type='text' class='label' value='" + playlist.desc + "' readonly spellcheck='false'><input type='text' class='label' value='" + playlist.tag.join() + "' readonly spellcheck='false'><div class = 'controls'> <button onclick='editPlaylist(this);' class='btn btn-outline-success' type='submit'>Edit</button> <button onclick='deletePlaylist(this);' class='btn btn-outline-success' type='submit'>Delete</button> <button onclick='sharePlaylist(this);' class='btn btn-outline-success' type='submit'>Share</button></div>"
        let playlists = document.getElementById("two");
        playlists.appendChild(block)

        user.playlists.push(JSON.parse(JSON.stringify(playlist)));
        localStorage.setItem("accounts", JSON.stringify(accounts));

        console.log(accounts);

    } else {

        alert("La playlist esiste già");

    }
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
 * It deletes a playlist from the user's account, and then deletes the playlist from the page (every section).
 * @param e - the element that was clicked
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

    let list = document.querySelectorAll("#three  .track");
    for (let i = 0; i < list.length; i++) {

        if (list[i].getElementsByClassName("track__title")[0].innerHTML == toDelete) {

            list[i].getElementsByClassName("controls")[0].children[0].click();

        }

    }


    window.localStorage.setItem("accounts", JSON.stringify(accounts));
    window.sessionStorage.removeItem("editing");

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
    if (user.shared.some(e => e.name.trim() == toShare.trim()) == false) {
        /* Checking if the playlist name is the same as the one to share. */
        user.playlists.forEach(function (e) {

            if (e.name == toShare) {

                shared = e;

            }

        })

        let block = document.createElement("div");
        block.setAttribute("class", "track");
        block.innerHTML = "<div class='track__title'>" + shared.name + "</div> <input type='text' class='label' value='" + shared.desc + "' readonly spellcheck='false'><input type='text' class='label' value='" + shared.tag.join() + "' readonly spellcheck='false'><div class ='controls'> <button onclick='noShare(this);' class='btn btn-outline-success' type='submit'>No share</button></div>"
        let sharedSection = document.getElementById("three");
        sharedSection.appendChild(block)

        user.shared.push(shared);
        window.localStorage.setItem("accounts", JSON.stringify(accounts))

    }

    globalShared()

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
    deleteGlobalShared(toDelete);

}

function addShared(e) {

    let parent = e.closest(".track");
    let toAdd = parent.getElementsByClassName("track__title")[0].innerHTML;

    accounts.forEach(person => {

            person.playlists.forEach(e => {

                if (e.name == toAdd) {

                /* Checking if the playlist name is already in the user's playlist. If it is not, it will add it to the
                user's playlist. */
                    if(user.playlists.some(playlist => playlist.name == toAdd) == false){

                    user.playlists.push(toAdd)
                    window.localStorage.setItem("accounts", JSON.stringify(accounts));
                    }

                }

            })

    });

    window.localStorage.setItem("accounts", JSON.stringify(accounts));
    globalShared();

}

function viewShared(e) {

    let parent = e.closest(".track");
    let toFill = parent.nextSibling;
    let toView = parent.getElementsByClassName("track__title")[0].innerHTML;

    accounts.forEach(person => {

            person.playlists.forEach(e => {

                if (e.name == toView) {

                    let block = document.createElement("div");
                    e.songs.forEach(song => {

                        block.innerHTML += "<div class = 'track'> <div class='track__art'> <img src= " + song.art + "></div><div class='track__title'>" + song.name + "</div><div class='label track__release_date'><span>" + song.release_date + "</span></div><div class='label track__explicit'><span>" + song.duration + "</span> </div></div>";
                    }

                    );


                    toFill.innerHTML = block.innerHTML;


                }

        });

    });
}
/**
 * It updates the globally shared playlists page
 */


function globalShared() {

    let updated;
    let block;
    let section = document.getElementById("four");

    updated = JSON.parse(sessionStorage.getItem("globalShared"));
    accounts.forEach(e => {

        e.shared.forEach(el => {

            if (!updated.some(ell => JSON.stringify(ell) == JSON.stringify(el))) {

                count++;
                block = document.createElement("div");
                block.setAttribute("class", "track");
                block.innerHTML = "<div class='track__title'>" + el.name + "</div> <input type='text' class='label' value='" + el.desc + "' readonly spellcheck='false'><input type='text' class='label' value='" + el.tag.join() + "' readonly spellcheck='false'> <div class='controls'> <button onclick='addShared(this);' class='btn btn-outline-success' type='submit'>Add</button><button onclick='viewShared(this);' class='btn btn-outline-success' type='submit' data-bs-toggle='collapse' data-bs-target = '#viewPlaylist" + count + "'>View</button></div>";
                section.appendChild(block);
                let menu = document.createElement("div");
                menu.setAttribute("id", "viewPlaylist" + count);
                menu.setAttribute("class", "collapse");
                section.appendChild(menu);
                updated.push(el)

            }
        })


    })

    window.sessionStorage.setItem("globalShared", JSON.stringify(updated));

}



/**
 * It deletes the shared playlists from the list of shares in the "Shared playlist" section of the page
 * @param e - the name of the playlist to be deleted
 */

function deleteGlobalShared(e) {

    /* It's filtering the globalShared array, and returning only the elements that are in the user's shared
    array. */

    let updated = JSON.parse(window.sessionStorage.getItem("globalShared"));

    updated = updated.filter(e => {

        if (user.shared.some(el => JSON.stringify(el) == JSON.stringify(e))) {

            return true

        }

        return false

    })

    let toDelete;
    let section = document.getElementById("four");
    let list = section.childNodes;
    for (var i = 1; i < list.length; i++) {

        if (list[i].firstChild.textContent == e) {

            toDelete = list[i];
            break;

        }

    }

    section.removeChild(toDelete.nextSibling);
    section.removeChild(toDelete);
    window.sessionStorage.setItem("globalShared", JSON.stringify(updated));

}

function editPlaylist(e) {

    let parent = e.closest(".track");
    let toEdit = parent.getElementsByClassName("track__title")[0].innerHTML;
    user.playlists.forEach(e => {

        if (e.name == toEdit) {
            window.sessionStorage.setItem("editing", JSON.stringify(e));
        }
    });

    editing();

}

function editing() {

    let currentPlaylist = JSON.parse(window.sessionStorage.getItem("editing"));

    let section = document.getElementById("one");
    let title = document.querySelectorAll("#manage-playlist .section-title")[1];

    if (currentPlaylist == null) {

        title.innerHTML = "No playlist is selected";
        section.innerHTML = "<div class='track'><span class = 'label'>No songs</span></div>";

    }
    else if (currentPlaylist.songs.length == 0) {

        title.innerHTML = "Current playlist: " + currentPlaylist.name;
        section.innerHTML = "<div class='track'><span class = 'label'>No songs</span></div>";

    }
    else {

        title.innerHTML = "Current playlist: " + currentPlaylist.name;
        let block = document.createElement("div");
        block.setAttribute("class", "track");
        currentPlaylist.songs.forEach(e => {

            block.innerHTML += "<div class = 'track'> <div class='track__art'> <img src= " + e.art + "></div><div class='track__title'>" + e.name + "</div><div class='label track__release_date'><span>" + e.release_date + "</span></div><div class='label track__duration'><span>" + e.duration + "</span> </div></div>";
        }

        );

        section.innerHTML = block.innerHTML;
    }



}

function logout() {

    if (confirm("You're going to logout. Click 'Ok' for going on.")) {
        window.localStorage.removeItem("token");
        window.sessionStorage.clear();
        window.location.replace("login/index.htm")
    }

    return false;

}




