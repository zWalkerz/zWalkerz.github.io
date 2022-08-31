const urlTrack = "https://api.spotify.com/v1/search?type=track";
const urlGenres = "https://api.spotify.com/v1/recommendations/available-genre-seeds"
const urlArtists = "https://api.spotify.com/v1/search?type=artist";


var accounts;
var user;
var token;


/* It's a self-invoking function that checks if the user is logged in and if the session is still
valid. If it's not, it redirects the user to the login page.  */

(function () {


    if (!window.localStorage.getItem("accounts")) {

        alert("Sign-up!");
        window.location.replace("signup/index.htm");

    } else if (!window.localStorage.getItem("token")) {

        alert("Log-in first!");
        window.location.replace("login/index.htm");

    }

    token = window.localStorage.getItem("token");
    accounts = JSON.parse(window.localStorage.getItem("accounts"));
    user = accounts.find((e) => e.token == token);

    if(user.completed == "no") {

        alert("Complete your profile");
        window.location.replace("complete/index.htm");


    }

    if ((Math.floor(Date.now() / 1000) - user.today) >= user.expires_in) {

        alert("Session is expired");
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
        block.innerHTML = "<div class='track__title'>" + e.name + "</div> <input type='text' class='label' value='" + e.desc + "' readonly spellcheck='false'><input type='text' class='label' value='" + e.tag.join() + "' readonly spellcheck='false'><div class ='controls'> <button onclick='editPlaylist(this);' class='btn btn-outline-success' type='submit'>Edit</button> <button onclick='deletePlaylist(this);' class='btn btn-outline-success' type='submit'>Delete</button> <button onclick='sharePlaylist(this);' class='btn btn-outline-success' type='submit'>Share</button></div>"
        let playlists = document.getElementById("two");
        playlists.appendChild(block);

    });


})();


/* The above code is creating a list of shared playlists. */
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

(function () {

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
search.addEventListener("input", e => {


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

        for (let i = 0; i < tracks.length; i++) {

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


            if (tracks[i].nextSibling.children.length != 0) {

                for (let j = 0; j < tracks[i].nextSibling.children.length && !flag; j++) {

                    if (tracks[i].nextSibling.children[j].getElementsByClassName("track__title")[0].innerHTML.toUpperCase().indexOf(filter) > -1) {

                        tracks[i].style.display = "";
                        tracks[i].nextSibling.style.display = "";
                        flag = true;
                    }


                }
            }

            if (!flag) {

                tracks[i].style.display = "none";
                tracks[i].nextSibling.style.display = "none";

            }


        }
    }
});
})();

(function () {

    let username = document.querySelector("#five > #username > input");
    let email = document.querySelector("#five > #email > input");
    let password = document.querySelector("#five > #password > input");

    username.value = user.username
    email.value = user.email 
    password.value = user.password;

})();

function editData(e) {

    let editing = e.parentNode.querySelector(".info_user").innerHTML.toLowerCase();
    editing = editing.substring(0, editing.length-1);
    let toEdit = e.parentNode.querySelector("input");
    let data = prompt("Enter a value for the " + editing);

    if(checkData(data, editing)) {
    toEdit.value = data;

    if(editing == "username") {

        user.username = data;

    } else if (editing == "password") {

        user.password = data;

    } else if (editing == "email") {

        user.email = data;

    }

    localStorage.setItem("accounts", JSON.stringify(accounts));
} else {

    alert("Wrong value")

}

}


function checkData(data, type) {

    const patterns = {
        username: /^[a-z\d]{5,12}$/i,
        password: /^[\d\w@-]{8,20}$/i,
        email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/i,
    };

        return patterns[type].test(data);

}


function zero(e) {

    if(e < 10) {

        return "0"+e;

    }
    return e;

}

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
            duration: Math.floor(json.tracks.items[0].duration_ms / 1000 / 60) + ":" + zero(Math.floor(json.tracks.items[0].duration_ms / 1000 % 60)),

        };

        document.getElementsByClassName("searched__art")[0].children[0].src = song.art;
        document.getElementsByClassName("searched__song__title")[0].innerHTML = song.name;
        document.getElementsByClassName("searched__song__date")[0].children[0].innerHTML = song.release_date;
        document.getElementsByClassName("searched__song__duration")[0].children[0].innerHTML = song.duration;

        return function () {

            Add(song);

        }

    } else {

        alert("The song you're searching doesn't exists");
        return

    }
}

/* Fetching the genres from the API and adding them to the selectpicker. */
(async function () {

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

        block = block + "<option>" + e + "</option>";

    });

    genre.innerHTML = block;
    $('#genre').selectpicker('refresh') ? addSelectedGenres() : console.log("Error");


})();


/**
 * It selects the genres that the user has previously selected
 */
function addSelectedGenres() {

    let toSelect = document.getElementById("genres").getElementsByClassName("text");
    let selected = user.genres;

    for (let i = 0; i < toSelect.length; i++) {

        selected.some(e => e == toSelect[i].innerHTML) ? toSelect[i].parentNode.click() : null;

    }

}


/**
 * It takes a string as an argument, and returns a fetch request to the Spotify API with the string as
 * a search parameter
 * @param searched - the artist name that the user searched for
 * @returns the fetch request.
 */
function artistFetch(searched) {

    return fetch(urlArtists + "&q=" + searched + "&limit=3", {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    });

}

/* The above code is a function that is called when the user selects an artist from the dropdown menu.
It then adds the artist from a dropdown to another related to the user's list of artists. */
(function () {

    var selected = [];

    $('#artist').selectpicker('refresh');

    $("#artists select").on("changed.bs.select",
        function () {

            $('#artist').selectpicker('refresh');

            let artistsSelected = document.getElementById("selectedArtists");
            let block = "";
            
            let actuallySelected = $("#artists select").val();

            user.artists = [...new Set(user.artists.concat(selected.concat(actuallySelected)))];

            

            user.artists.forEach(e => {

            block += "<li><a class = 'dropdown-item' href='#'>" + e + "</a> <a href = '#'><i class='bi bi-dash-lg' onclick='removeArtist(this)' ></i></a></li>"

            });


            artistsSelected.innerHTML = block;
            
        });


    $('#artists .form-control').on('input', async function (e) {

        let artist = document.getElementById("artist");
        let block;

        let response = await artistFetch(e.target.value);
        let json = await response.json();
        if(json.artists != undefined) {
        json.artists.items.forEach(e => {

            block = block + "<option>" + e.name + "</option>";

        });

        artist.innerHTML = block;

        $('#artist').selectpicker('refresh');

    }

    });

})();

/* The above code selects on page load all the artists previously selected by the user. */
(function() {

    let artistsSelected = document.getElementById("selectedArtists");
    let toAdd = user.artists; 
    let block = "";

    toAdd.forEach(e => {

        block += "<li><a class = 'dropdown-item' href='#'>" + e + "</a> <a href = '#'><i class='bi bi-dash-lg' onclick='removeArtist(this)' ></i></a></li>"

    })

    artistsSelected.innerHTML = block;


})();

/**
 * It removes the artist from the user's list of artists
 */
function removeArtist(e) {

    let parent = e.closest("li");
    let toDelete = parent.children[0].innerHTML;
    parent.remove();

    user.artists.forEach(function (e, index) {

        if (e == toDelete) {

            user.artists.splice(index, 1);

        }

    })
    

}

/**
 * It takes the selected genres and artists from the dropdown menus and saves them in the user object
 */
function send() {

    let artist_flag = false;
    let genre_flag = false;

    let genre_list = document.getElementsByClassName("filter-option-inner-inner")[0].innerHTML;
    let artist_list = document.getElementById("selectedArtists");

    if (genre_list != "Scegli almeno un genere") {
        let newGenres = [];
        genre_list = genre_list.replace(/\s/g, "");  // / \s / e' per ricercare un pattern (gli spazi \s), g è per una ricerca globale
        let subs = genre_list.split(",");
        subs.forEach(e => {

            newGenres.push(e);

        });

        user.genres = newGenres;

        genre_flag = true;

        window.localStorage.setItem("accounts", JSON.stringify(accounts));

    }

    if (artist_list.childElementCount > 0) {

        artist_list = [...artist_list.querySelectorAll(".dropdown-item")].map(e => e.innerHTML)

        user.artists = artist_list;
        artist_flag = true;

        window.localStorage.setItem("accounts", JSON.stringify(accounts));


    }

    message(genre_flag, artist_flag);
}


/**
 * It displays a message to the user depending on the success of the save request
 * @param genre_flag - a boolean that is true if the genres were updated successfully
 * @param artist_flag - a boolean that is true if the artist was updated successfully
 */
function message(genre_flag, artist_flag) {

    if (genre_flag && artist_flag) {

        msg = document.getElementById("alert");
        msg.innerHTML = "Genres and artists updated";
        msg.style.opacity = "100%";
        setTimeout(function () {

            msg.style.opacity = "0%";

        }, 2000);

    } else if (genre_flag) {

        msg = document.getElementById("alert");
        msg.innerHTML = "Genres updated";

        let no_artist = function () {

            msg.style.opacity = "100%";
            msg.classlist.remove("alert-success");
            msg.classlist.add("alert-danger");
            msg.innerHTML = "Artists not updated, something went wrong";

            setTimeout(function () {

                msg.style.opacity = "0%";

            }, 2000);

        }

        setTimeout(function () {

            msg.style.opacity = "0%";
            no_artist();

        }, 2000);

    } else if (artist_flag) {

        msg = document.getElementById("alert");
        msg.innerHTML = "Artist updated";

        let no_genres = function () {

            msg.style.opacity = "100%";
            msg.classlist.remove("alert-success");
            msg.classlist.add("alert-danger");
            msg.innerHTML = "Genres not updated, something went wrong";

            setTimeout(function () {

                msg.style.opacity = "0%";

            }, 2000);

        }

        setTimeout(function () {

            msg.style.opacity = "0%";
            no_genres();

        }, 2000);

    }


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

    let playlist = {

        name: prompt("Enter the name of the playlist"),
        desc: prompt("Enter the description of the playlist"),
        tag: prompt("Enter some tags starting with #"),
        songs: []

    };

    let tagTest = checkTag(playlist.tag);

    if (playlist.name == "" || playlist.desc == "") {

        alert("Name and description must contain a value")
        return

    } else if (tagTest == false) {

        alert("Tags must follow an hashtag '#' and cannot start with a number or an alphanumeric value");
        return
    }

    if (user.playlists.some(e => e.name == playlist.name) == false) {

        playlist.tag = tagTest[1];
        let block = document.createElement("div");
        block.setAttribute("class", "track");
        block.innerHTML = "<div class='track__title'>" + playlist.name + "</div> <input type='text' class='label' value='" + playlist.desc + "' readonly spellcheck='false'><input type='text' class='label' value='" + playlist.tag.join() + "' readonly spellcheck='false'><div class = 'controls'> <button onclick='editPlaylist(this);' class='btn btn-outline-success' type='submit'>Edit</button> <button onclick='deletePlaylist(this);' class='btn btn-outline-success' type='submit'>Delete</button> <button onclick='sharePlaylist(this);' class='btn btn-outline-success' type='submit'>Share</button></div>"
        let playlists = document.getElementById("two");
        playlists.appendChild(block)

        user.playlists.push(JSON.parse(JSON.stringify(playlist)));
        localStorage.setItem("accounts", JSON.stringify(accounts));

    } else {

        alert("Playlist already exists!");

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

        let result = [true, e];
        return result

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
        /* Checking if the user is not trying to share two playlists with the same name */
        user.playlists.forEach(function (e) {

            if (e.name == toShare) {

                shared = e;

            }

        })

        let alreadyShared = JSON.parse(sessionStorage.getItem("globalShared"));

        if(alreadyShared.some(e => e.name == shared.name)) {

            alert("A playlist with the same name is already shared");

        } else{

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
    let sharedPlaylists = JSON.parse(sessionStorage.getItem("globalShared"));

    sharedPlaylists.forEach(playlist => {

        if(playlist.name == toAdd) {

            toAdd = playlist;
            
            if(user.playlists.some(e => e.name.trim() != toAdd.name.trim()) || user.playlists.length == 0) {

                user.playlists.push(toAdd);
                user.playlists.forEach(e => {

                    let block = document.createElement("div");
                    block.setAttribute("class", "track");
                    block.innerHTML = "<div class='track__title'>" + e.name + "</div> <input type='text' class='label' value='" + e.desc + "' readonly spellcheck='false'><input type='text' class='label' value='" + e.tag + "' readonly spellcheck='false'><div class ='controls'> <button onclick='editPlaylist(this);' class='btn btn-outline-success' type='submit'>Edit</button> <button onclick='deletePlaylist(this);' class='btn btn-outline-success' type='submit'>Delete</button> <button onclick='sharePlaylist(this);' class='btn btn-outline-success' type='submit'>Share</button></div>"
                    let playlists = document.getElementById("two");
                    playlists.appendChild(block);
            
                });
        

            } else {

                alert("You already have a playlist with the same name!")

            }

            }

        });


    window.localStorage.setItem("accounts", JSON.stringify(accounts));

}

/**
 * It takes the name of the playlist that the user clicked on, and then it finds the playlist in the
 * accounts array, and then it fills the next sibling of the playlist(a space dedicated for a dropdown menu) with the songs in the playlist
 * @param e - the object that triggered the function
 */
function viewShared(e) {

    let parent = e.closest(".track");
    let toFill = parent.nextSibling;
    let toView = parent.getElementsByClassName("track__title")[0].innerHTML;

    accounts.forEach(person => {

        if (person.shared.some(e => e.name == toView)) {

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

        }

    });
}

/**
 * It takes the shared playlists from all the accounts and displays them on the page
 */
function globalShared() {

    let updated;
    let block;
    let section = document.getElementById("four");

    updated = JSON.parse(sessionStorage.getItem("globalShared"));
    accounts.forEach(e => {

        e.shared.forEach(el => {


            /* Checking if the element is already in the array. */
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
    for (let i = 1; i < list.length; i++) {

        if (list[i].firstChild.textContent == e) {

            toDelete = list[i];
            break;

        }

    }

    section.removeChild(toDelete.nextSibling);
    section.removeChild(toDelete);
    window.sessionStorage.setItem("globalShared", JSON.stringify(updated));

}

/**
 * It finds the playlist that the user wants to edit, and then sends it to the editing page
 * @param e - the event that was triggered
 */
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

/**
 * It displays the songs in the playlist that is currently being edited
 */
function editing() {

    let currentPlaylist = JSON.parse(window.sessionStorage.getItem("editing"));

    let section = document.getElementById("one");
    let title = document.querySelectorAll("#manage-playlist .section-title")[1];

    if (currentPlaylist == null) {

        title.innerHTML = "No playlist is selected";
        section.innerHTML = "<div class='track'><span class = 'label'>No songs</span></div>";

    }
    else if (currentPlaylist.songs.length == 0) {

        title.innerHTML = "Current playlist: " + currentPlaylist.name + "<a href = '#'><i class='bi bi-pencil' onclick = 'editDetails();'></i></a>";
        section.innerHTML = "<div class='track'><span class = 'label'>No songs</span></div>";

    }
    else {

        let block = "";
        title.innerHTML = "Current playlist: " + currentPlaylist.name + "<a href = '#'><i class='bi bi-pencil' onclick = 'editDetails();'></i></a>";
        currentPlaylist.songs.forEach(e => {

            block += "<div class = 'track' ><div class='track__art'> <img src= " + e.art + "></div><div class='track__title'>" + e.name + "</div><div class='label track__release_date'><span>" + e.release_date + "</span></div><div class='label track__duration'><span>" + e.duration + "</span> </div><a href = '#'> <i class='bi bi-dash-lg' onclick='removeSong(this)' ></i></a></div> ";
        }

        );

        section.innerHTML = block;
    }



}


/**
 * It edits the details of a playlist.
 */
function editDetails() {

    let actuallyEditing = JSON.parse(sessionStorage.getItem("editing"));

    let choose = prompt("What are you editing? Write: \n - Name; \n - Description; \n - Tags;")
    if(choose.trim().toLowerCase() == "name") {

        let title = prompt("Playlist's new name: ");
        if(title == ""){

            alert("It must contains a value;")
            return;

        } else {
        user.playlists.forEach(e => {

            if(e.name == actuallyEditing.name) {

                let list1 = document.getElementById("three").querySelectorAll(".track__title");

                list1.forEach(names => {

                    if(names.innerHTML == e.name) {

                        names.parentNode.querySelector(".controls").children[0].click();

                    }

                })

                e.name = title;
                actuallyEditing.name = title;

            }

        })
    }

    } else if (choose.trim().toLowerCase() == "description") {

        let desc = prompt("Playlist's new description: ");
        if(desc == "") {

            alert("It must contain a value");
            return;

        } else {
        user.playlists.forEach(e => {

            if(e.name == actuallyEditing.name) {


                let list1 = document.getElementById("three").querySelectorAll(".track__title");

                list1.forEach(names => {

                    if(names.innerHTML == e.name) {

                        names.parentNode.querySelector(".controls").children[0].click();

                    }

                })

                e.desc = desc;
                actuallyEditing.desc = desc;

            }

        })
    }

    } else if(choose.trim().toLowerCase() == "tags") {

        let tags = prompt("Playlist's new tags. They must start with a #");
        let tagTest = checkTag(tags);

        if(tagTest == false){

            alert("Tags must follow an hashtag '#' and cannot start with a number or an alphanumeric value");

        } else {

            user.playlists.forEach(e => {

                if(e.name == actuallyEditing.name) {

                    let list1 = document.getElementById("three").querySelectorAll(".track__title");
    
                    list1.forEach(names => {
    
                        if(names.innerHTML == e.name) {
    
                            names.parentNode.querySelector(".controls").children[0].click();
    
                        }
    
                    })
    
                    e.tag = tagTest[1];
                    actuallyEditing.tag = tagTest[1];
    
                }
    
            })


        }


    }


    localStorage.setItem("accounts", JSON.stringify(accounts));
    sessionStorage.setItem("editing", JSON.stringify(actuallyEditing));
    let block = "";

    user.playlists.forEach(e => {

        block += "<div class = 'track '><div class='track__title'>" + e.name + "</div> <input type='text' class='label' value='" + e.desc + "' readonly spellcheck='false'><input type='text' class='label' value='" + e.tag.join() + "' readonly spellcheck='false'><div class = 'controls'> <button onclick='editPlaylist(this);' class='btn btn-outline-success' type='submit'>Edit</button> <button onclick='deletePlaylist(this);' class='btn btn-outline-success' type='submit'>Delete</button> <button onclick='sharePlaylist(this);' class='btn btn-outline-success' type='submit'>Share</button></div> </div>";
    });

    let playlists = document.getElementById("two");
    playlists.innerHTML = block;
    editing();

    let list2 = document.getElementById("two").querySelectorAll(".track__title");

    list2.forEach(names => {
    
        if(names.innerHTML == actuallyEditing.name) {

            names.parentNode.querySelector(".controls").children[2].click();

        }

    })



}

/**
 * It removes a song from the playlist
 * @param e - the element that was clicked
 */
function removeSong(e) {

    let parent = e.closest(".track");
    let toDelete = parent.children[1].innerHTML;
    let playlist = JSON.parse(sessionStorage.getItem("editing"));
    parent.remove();

    user.playlists.forEach(e => {

        if(e.name == playlist.name) {

    e.songs.forEach(function (song, index) {

        if (song.name == toDelete) {

            e.songs.splice(index, 1);

        }

    })}
    });

    playlist.songs.forEach(function (song, index) {

        if (song.name == toDelete) {

            playlist.songs.splice(index, 1);

        }

    })
    
    window.localStorage.setItem("accounts", JSON.stringify(accounts));
    window.sessionStorage.setItem("editing", JSON.stringify(playlist));

}

/**
 * It removes the token from the local storage and clears the session storage, then redirects the user
 * to the login page
 */
function logout() {

    if (confirm("You're going to logout. Click 'Ok' for going on.")) {
        window.localStorage.removeItem("token");
        window.sessionStorage.clear();
        window.location.replace("login/index.htm")
    }

    return false;

}




