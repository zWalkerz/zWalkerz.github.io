const client_id = "7fcf34ffdc704d50b92443bc85a4b934";
const client_secret = "87c3d628813144069f4e56722529993f";
const url = "https://accounts.spotify.com/api/token";
var goOn = true;

async function signup() {

    accounts = window.localStorage.getItem('accounts')

    if (accounts == null) {
        accounts = '[{"token":"BQCfOiasBD_0fM2tWBTCSN38G0SjyFdWUSi-9jxpDsOKRzPzGxxxLycuneKDbepc21VvogdbeL3D79Qe34EinC7-ZGN44AyO0sszpWxTHwT7lmanL7U","expires_in":3600,"today":1662457970,"email":"ciccio@gmail.com","username":"ciccio","password":"ciccio22","artists":["Doja Cat","Jack Harlow","Don Toliver","Snoop Dogg"],"genres":["acoustic","afrobeat"],"playlists":[{"name":"Test","desc":"Test","tag":["#Test"],"songs":[{"name":"Beartooth - In Between","art":"https://i.scdn.co/image/ab67616d0000b2736b70e7bed9a831b79c28327f","release_date":"2014-06-10","explicit":false,"duration":"3:33"},{"name":"Lil Peep - nuts (feat. rainy bear)","art":"https://i.scdn.co/image/ab67616d0000b27309d54dc63b8d61cef9e977e5","release_date":"2021-12-17","explicit":true,"duration":"1:25"},{"name":"J. Cole - No Role Modelz","art":"https://i.scdn.co/image/ab67616d0000b273c6e0948bbb0681ff29cdbae8","release_date":"2014-12-09","explicit":true,"duration":"4:52"},{"name":"A Day To Remember - NJ Legion Iced Tea","art":"https://i.scdn.co/image/ab67616d0000b2730b02af77159866fe3e011c76","release_date":"2009-02-03","explicit":false,"duration":"3:31"}]},{"name":"Boh ","desc":"Boh","tag":["#Boh"],"songs":[{"name":"Drake - Jimmy Cooks (feat. 21 Savage)","art":"https://i.scdn.co/image/ab67616d0000b2738dc0d801766a5aa6a33cbe37","release_date":"2022-06-17","explicit":true,"duration":"3:38"},{"name":"Roc Marciano - JJ Flash","art":"https://i.scdn.co/image/ab67616d0000b2733768eb8e45753e145aefb437","release_date":"2022-08-26","explicit":true,"duration":"2:48"},{"name":"Chuck Berry - Johnny B. Goode","art":"https://i.scdn.co/image/ab67616d0000b273a496dc8c33ca6d10668b3157","release_date":"1959-07-01","explicit":false,"duration":"2:41"}]}],"shared":[{"name":"Test","desc":"Test","tag":["#Test"],"songs":[{"name":"Beartooth - In Between","art":"https://i.scdn.co/image/ab67616d0000b2736b70e7bed9a831b79c28327f","release_date":"2014-06-10","explicit":false,"duration":"3:33"},{"name":"Lil Peep - nuts (feat. rainy bear)","art":"https://i.scdn.co/image/ab67616d0000b27309d54dc63b8d61cef9e977e5","release_date":"2021-12-17","explicit":true,"duration":"1:25"},{"name":"J. Cole - No Role Modelz","art":"https://i.scdn.co/image/ab67616d0000b273c6e0948bbb0681ff29cdbae8","release_date":"2014-12-09","explicit":true,"duration":"4:52"},{"name":"A Day To Remember - NJ Legion Iced Tea","art":"https://i.scdn.co/image/ab67616d0000b2730b02af77159866fe3e011c76","release_date":"2009-02-03","explicit":false,"duration":"3:31"}]}],"completed":"yes"},{"token":"BQBJJB9YmRCb4SXEEpdHG1jjrBzlQZLklwmmqdNUPBD7Taf1JPDU7hJGxSxa2K2kCiiXSQpkbsrN4zuzt6ILLGNPY_143tvEa4KugXeTJRzQ7meKIDc","expires_in":3600,"today":1662458064,"email":"xkiller06@gmail.com","username":"xkiller06","password":"xkiller06","artists":["Halsey","Jack Harlow","Harry Styles"],"genres":["alt-rock","alternative","anime","bluegrass"],"playlists":[{"name":"Test","desc":"Test","tag":["#Test"],"songs":[{"name":"Lil Peep - nuts (feat. rainy bear)","art":"https://i.scdn.co/image/ab67616d0000b27309d54dc63b8d61cef9e977e5","release_date":"2021-12-17","explicit":true,"duration":"1:25"},{"name":"A Day To Remember - NJ Legion Iced Tea","art":"https://i.scdn.co/image/ab67616d0000b2730b02af77159866fe3e011c76","release_date":"2009-02-03","explicit":false,"duration":"3:31"}]},{"name":"Seconda playlist","desc":"Qualcosa ","tag":["#Boh"],"songs":[{"name":"Crywank - Jk","art":"https://i.scdn.co/image/ab67616d0000b273d79d25bc91c7d6fe4ad01732","release_date":"2019-03-18","explicit":false,"duration":"1:49"},{"name":"Steve Lacy - Dark Red","art":"https://i.scdn.co/image/ab67616d0000b273263886a4992c39704c601409","release_date":"2017-02-20","explicit":false,"duration":"2:53"},{"name":"Oxlade - DKT","art":"https://i.scdn.co/image/ab67616d0000b27324812dc5896bae1e079a66a8","release_date":"2020-09-04","explicit":false,"duration":"2:18"}]}],"shared":[{"name":"Seconda playlist","desc":"Qualcosa ","tag":["#Boh"],"songs":[{"name":"Crywank - Jk","art":"https://i.scdn.co/image/ab67616d0000b273d79d25bc91c7d6fe4ad01732","release_date":"2019-03-18","explicit":false,"duration":"1:49"},{"name":"Steve Lacy - Dark Red","art":"https://i.scdn.co/image/ab67616d0000b273263886a4992c39704c601409","release_date":"2017-02-20","explicit":false,"duration":"2:53"},{"name":"Oxlade - DKT","art":"https://i.scdn.co/image/ab67616d0000b27324812dc5896bae1e079a66a8","release_date":"2020-09-04","explicit":false,"duration":"2:18"}]}],"completed":"yes"}]';
        localStorage.setItem("accounts", accounts);
    } else {
        accounts = JSON.parse(accounts)
    }

    let response = await getToken();
    json = await response.json();
    user = {
        token: json.access_token,
        expires_in: json.expires_in,
        today: Math.floor(Date.now()/1000),
        email: document.getElementById("email").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        artists: [],
        genres: [],
        playlists: [],
        shared: [],
        completed: "no"

    }

    if (accounts.some(e => e.email == user.email)) {

        alert("Utente già registrato")

    } else {

        accounts.push(user);

    }


    localStorage.setItem("accounts", JSON.stringify(accounts));
    location.replace("../login/index.htm");


}



/**
 * It takes the client_id and client_secret and uses them to get an access token from the Spotify API.
 * @returns A promise.
 */

async function getToken() {
    let response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: "Basic " +
                btoa(`${client_id}:${client_secret}`),
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ grant_type: "client_credentials" }),
    });
    return response;


}

/**
 * It prevents the default action of the form, then it loops through each input and validates it
 * against the appropriate pattern. If all the inputs are valid, it returns the signup function,
 * otherwise it returns false.
 * @param event - the event object
 * @returns the result of the function signup() if the variable goOn is true. If goOn is false, the
 * function returns false.
 */

function checkData(event) {

    event.preventDefault();
    goOn = true;

    const inputs = document.querySelectorAll('input');

    const patterns = {
        /* A regular expression that checks if the username is between 5 and 12 characters long and if
        it contains only letters and numbers. */
        username: /^[a-z\d]{5,12}$/i,
        /* A regular expression that checks if the password contains at least one number, one lowercase
        letter, one uppercase letter and one special character. */
        password: /^(?=. * \d)(?=. * [a-z])(?=. * [A-Z])(?=.*[a-zA-Z]).{8,20}$/i,
        /* A regular expression that checks if the email is valid. */
        email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/i,
    };

    inputs.forEach((input) => {

        validate(input, patterns[input.attributes.id.value]);

    });

    if (goOn) {

        return signup();

    } else {

        return false;

    }

}

function validate(field, regex) {
    if (regex.test(field.value)) {
        field.className = 'form-control valid';
    } else {
        field.className = 'form-control invalid';
        goOn = false;
    }
}

