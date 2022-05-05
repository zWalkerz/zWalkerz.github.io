const token = localStorage.getItem("token");
const urlArtists = "https://api.spotify.com/v1/search?type=artist";
const urlGenres = "https://api.spotify.com/v1/recommendations/available-genre-seeds"
var accounts = JSON.parse(window.localStorage.getItem("accounts"));



//CHECK - Controllo che il profilo utente non sia già completo oppure che non gli sia scaduta la sessione

(function () {

    let user = accounts.find((e) => e.token == token);
    if ((Math.floor(Date.now() / 1000) - user.today) >= user.expires_in) {

        alert("La tua sessione e' scaduta, effettuare nuovamente login");
        window.location.replace("login.htm");

    } else if(user.completed == "yes"){

        alert("Il tuo profilo e' gia' stato completato");
        window.location.replace("../complete/index.htm");

    }

})();

/* Adding an event listener to the artist input field. */
artist = document.getElementById("artist");
artist.addEventListener('keyup', e => {
    if(e.target.value.replace(/\s/g, "").length != 0){
    fetchingArtists(e.target.value);
    }

});

//STAMPA FETCH - Aggiungo in modo dinamico gli elementi trovati da fetch 

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


        block = block + "<div class='artist'> <div class='overlayer' onclick='addInfo(event)'> </div> <img src='" + element.images[0].url + "' alt=''> <small>" + element.name + "</small> </div>";
        document.getElementsByClassName("artists")[0].innerHTML = block;

    });

    document.getElementsByClassName("artists")[0].style.visibility = "visible";

}

//UPDATE DEL PROFILO - Inserisco le informazioni sul profilo e stampo un avviso

function addInfo(e) {

    let user = accounts.find(e => e.token == token);

    if(!user.artists.some(element => e.target.parentNode.childNodes[5].innerHTML == element )) {

        user.artists.push(e.target.parentNode.childNodes[5].innerHTML);
        window.localStorage.setItem('accounts', JSON.stringify(accounts));
        msg = document.getElementById("alert");
        msg.style.opacity = "100%";
        setTimeout(function(){

            msg.style.opacity = "0%";

        }, 2000);

    
    }

}

//FETCH GENERI - Faccio un fetch dei generi ed inserisco dinamicamente un blocco HTML nel select, poi inizializzo il plugin di select

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

//UPDATE PROFILO - Prendo i dati nel div del select, li suddivido e salvo, dopodichè completo il profilo

function send(){

    let list = document.getElementsByClassName("filter-option-inner-inner")[0].innerHTML;
    let user = accounts.find(e => e.token == token);
    if(list != "Scegli almeno un genere"){
    list = list.replace(/\s/g, "");  // / \s / e' per ricercare un pattern (gli spazi \s), g è per una ricerca globale
    let subs = list.split(",");
    subs.forEach(e => {

        user.genres.push(e);

    });

}

checkData(user);

}

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

        alert("Profilo completo!");
        window.location.replace("index.htm");

    }
}

