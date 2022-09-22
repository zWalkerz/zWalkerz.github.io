const token = localStorage.getItem("token");
const urlArtists = "https://api.spotify.com/v1/search?type=artist";
const urlGenres = "https://api.spotify.com/v1/recommendations/available-genre-seeds"
var accounts;
var user;



//CHECK - Controllo che il profilo utente non sia già completo oppure che non gli sia scaduta la sessione

(function () {

    
    if(!window.localStorage.getItem("accounts")){

        accounts = '[{"token":"BQCfOiasBD_0fM2tWBTCSN38G0SjyFdWUSi-9jxpDsOKRzPzGxxxLycuneKDbepc21VvogdbeL3D79Qe34EinC7-ZGN44AyO0sszpWxTHwT7lmanL7U","expires_in":3600,"today":1662457970,"email":"ciccio@gmail.com","username":"ciccio","password":"ciccio22","artists":["Doja Cat","Jack Harlow","Don Toliver","Snoop Dogg"],"genres":["acoustic","afrobeat"],"playlists":[{"name":"Test","desc":"Test","tag":["#Test"],"songs":[{"name":"Beartooth - In Between","art":"https://i.scdn.co/image/ab67616d0000b2736b70e7bed9a831b79c28327f","release_date":"2014-06-10","explicit":false,"duration":"3:33"},{"name":"Lil Peep - nuts (feat. rainy bear)","art":"https://i.scdn.co/image/ab67616d0000b27309d54dc63b8d61cef9e977e5","release_date":"2021-12-17","explicit":true,"duration":"1:25"},{"name":"J. Cole - No Role Modelz","art":"https://i.scdn.co/image/ab67616d0000b273c6e0948bbb0681ff29cdbae8","release_date":"2014-12-09","explicit":true,"duration":"4:52"},{"name":"A Day To Remember - NJ Legion Iced Tea","art":"https://i.scdn.co/image/ab67616d0000b2730b02af77159866fe3e011c76","release_date":"2009-02-03","explicit":false,"duration":"3:31"}]},{"name":"Boh ","desc":"Boh","tag":["#Boh"],"songs":[{"name":"Drake - Jimmy Cooks (feat. 21 Savage)","art":"https://i.scdn.co/image/ab67616d0000b2738dc0d801766a5aa6a33cbe37","release_date":"2022-06-17","explicit":true,"duration":"3:38"},{"name":"Roc Marciano - JJ Flash","art":"https://i.scdn.co/image/ab67616d0000b2733768eb8e45753e145aefb437","release_date":"2022-08-26","explicit":true,"duration":"2:48"},{"name":"Chuck Berry - Johnny B. Goode","art":"https://i.scdn.co/image/ab67616d0000b273a496dc8c33ca6d10668b3157","release_date":"1959-07-01","explicit":false,"duration":"2:41"}]}],"shared":[{"name":"Test","desc":"Test","tag":["#Test"],"songs":[{"name":"Beartooth - In Between","art":"https://i.scdn.co/image/ab67616d0000b2736b70e7bed9a831b79c28327f","release_date":"2014-06-10","explicit":false,"duration":"3:33"},{"name":"Lil Peep - nuts (feat. rainy bear)","art":"https://i.scdn.co/image/ab67616d0000b27309d54dc63b8d61cef9e977e5","release_date":"2021-12-17","explicit":true,"duration":"1:25"},{"name":"J. Cole - No Role Modelz","art":"https://i.scdn.co/image/ab67616d0000b273c6e0948bbb0681ff29cdbae8","release_date":"2014-12-09","explicit":true,"duration":"4:52"},{"name":"A Day To Remember - NJ Legion Iced Tea","art":"https://i.scdn.co/image/ab67616d0000b2730b02af77159866fe3e011c76","release_date":"2009-02-03","explicit":false,"duration":"3:31"}]}],"completed":"yes"},{"token":"BQBJJB9YmRCb4SXEEpdHG1jjrBzlQZLklwmmqdNUPBD7Taf1JPDU7hJGxSxa2K2kCiiXSQpkbsrN4zuzt6ILLGNPY_143tvEa4KugXeTJRzQ7meKIDc","expires_in":3600,"today":1662458064,"email":"xkiller06@gmail.com","username":"xkiller06","password":"xkiller06","artists":["Halsey","Jack Harlow","Harry Styles"],"genres":["alt-rock","alternative","anime","bluegrass"],"playlists":[{"name":"Test","desc":"Test","tag":["#Test"],"songs":[{"name":"Lil Peep - nuts (feat. rainy bear)","art":"https://i.scdn.co/image/ab67616d0000b27309d54dc63b8d61cef9e977e5","release_date":"2021-12-17","explicit":true,"duration":"1:25"},{"name":"A Day To Remember - NJ Legion Iced Tea","art":"https://i.scdn.co/image/ab67616d0000b2730b02af77159866fe3e011c76","release_date":"2009-02-03","explicit":false,"duration":"3:31"}]},{"name":"Seconda playlist","desc":"Qualcosa ","tag":["#Boh"],"songs":[{"name":"Crywank - Jk","art":"https://i.scdn.co/image/ab67616d0000b273d79d25bc91c7d6fe4ad01732","release_date":"2019-03-18","explicit":false,"duration":"1:49"},{"name":"Steve Lacy - Dark Red","art":"https://i.scdn.co/image/ab67616d0000b273263886a4992c39704c601409","release_date":"2017-02-20","explicit":false,"duration":"2:53"},{"name":"Oxlade - DKT","art":"https://i.scdn.co/image/ab67616d0000b27324812dc5896bae1e079a66a8","release_date":"2020-09-04","explicit":false,"duration":"2:18"}]}],"shared":[{"name":"Seconda playlist","desc":"Qualcosa ","tag":["#Boh"],"songs":[{"name":"Crywank - Jk","art":"https://i.scdn.co/image/ab67616d0000b273d79d25bc91c7d6fe4ad01732","release_date":"2019-03-18","explicit":false,"duration":"1:49"},{"name":"Steve Lacy - Dark Red","art":"https://i.scdn.co/image/ab67616d0000b273263886a4992c39704c601409","release_date":"2017-02-20","explicit":false,"duration":"2:53"},{"name":"Oxlade - DKT","art":"https://i.scdn.co/image/ab67616d0000b27324812dc5896bae1e079a66a8","release_date":"2020-09-04","explicit":false,"duration":"2:18"}]}],"completed":"yes"}]';
        localStorage.setItem("accounts", accounts);

    }

    accounts = JSON.parse(window.localStorage.getItem("accounts"));
    user = accounts.find((e) => e.token == token);
    if ((Math.floor(Date.now() / 1000) - user.today) >= user.expires_in) {

        alert("Session expired. Login again.");
        window.location.replace("login.htm");

    } else if(user.completed == "yes"){

        alert("Your profile is already completed");
        window.location.replace("../index.htm");

    }


})();

/* Adding an event listener to the artist input field. */

(function () {
artist = document.getElementById("artist");
artist.addEventListener('input', e => {
    if(e.target.value.replace(/\s/g, "").length != 0){
    fetchingArtists(e.target.value);
    }

});

})();

/**
 * It fetches the data from the API and displays it on the page
 * @param artist - The name of the artist you want to search for.
 */
async function fetchingArtists(artist) {

    let response = await fetch(urlArtists + "&q=" + artist + "&limit=3", {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    });

    let json = await response.json();
    let block = "";

    json.artists.items.forEach(element => {

        if(element.images.length > 0){
        block = block + "<div class='artist'> <div class='overlayer' onclick='addInfo(this)'> </div> <img src='" + element.images[0].url + "' alt=''> <small>" + element.name + "</small> </div>";
        document.getElementsByClassName("artists")[0].innerHTML = block;
        }
    });

    document.getElementsByClassName("artists")[0].style.visibility = "visible";

}


/**
 * It adds the artist to the user's list of artists
 * @param e - The event object
 */
function addInfo(e) {

    if(!user.artists.some(element => e.parentNode.querySelector("small").innerHTML == element )) {

        user.artists.push(e.parentNode.querySelector("small").innerHTML);
        window.localStorage.setItem('accounts', JSON.stringify(accounts));
        
        /* A function that shows a message for 2 seconds. */
        border = e.parentNode;
        border.style.border = "2px solid rgba(44, 255, 0, 1)";
        setTimeout(function(){

            border.style.border = "2px solid rgba(44, 255, 0, 0)";

        }, 1000);

    
    }

}

/* It's an IIFE (Immediately Invoked Function Expression) that fetches the genres from the API and adds
them to the select. */
(async function(){

    let genre = document.getElementById("genre");
    let block = "";

    let response = await fetch(urlGenres, {

        headers:{
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        },
    });

    let json = await response.json();
    json.genres.forEach(e => {

        block = block + "<option>"+e+"</option>";

    })

    genre.innerHTML=block;
    $('.my-select').selectpicker();

})();

/**
 * It takes the selected genres from the dropdown menu and adds them to the user's genres array
 */
function send(){

    let list = document.getElementsByClassName("filter-option-inner-inner")[0].innerHTML;
    let user = accounts.find(e => e.token == token);
    if(list != "Select at least one genre"){
    list = list.replace(/\s/g, "");  // / \s / e' per ricercare un pattern (gli spazi \s), g è per una ricerca globale
    let subs = list.split(",");
    subs.forEach(e => {

        user.genres.push(e);

    });

}

checkData(user);

}

/**
 * It checks if the user has filled the form, if so it sets the user's completed property to "yes" and
 * redirects him to the index page.
 * @param user - the user object
 */
function checkData(user) {

    let flag = true

    if(user.artists == ""){

        document.getElementsByTagName("small")[0].classList.add("invalid")     //C'è una transizione nel foglio CSS per lo small
        flag = false;

    }
    if(user.genres == ""){

        document.getElementsByTagName("small")[1].classList.add("invalid")
        flag = false;

    }

    if(flag){

        user.completed = "yes";
        window.localStorage.setItem("accounts", JSON.stringify(accounts));

        alert("Profile completed!");
        window.location.replace("../index.htm");

    }
}

