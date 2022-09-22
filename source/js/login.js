const client_id = "7fcf34ffdc704d50b92443bc85a4b934";
const client_secret = "87c3d628813144069f4e56722529993f";
const url = "https://accounts.spotify.com/api/token";
var goOn = true;
var accounts = window.localStorage.getItem('accounts');

if (accounts == null) {
    accounts = '[{"token":"BQCfOiasBD_0fM2tWBTCSN38G0SjyFdWUSi-9jxpDsOKRzPzGxxxLycuneKDbepc21VvogdbeL3D79Qe34EinC7-ZGN44AyO0sszpWxTHwT7lmanL7U","expires_in":3600,"today":1662457970,"email":"ciccio@gmail.com","username":"ciccio","password":"ciccio22","artists":["Doja Cat","Jack Harlow","Don Toliver","Snoop Dogg"],"genres":["acoustic","afrobeat"],"playlists":[{"name":"Test","desc":"Test","tag":["#Test"],"songs":[{"name":"Beartooth - In Between","art":"https://i.scdn.co/image/ab67616d0000b2736b70e7bed9a831b79c28327f","release_date":"2014-06-10","explicit":false,"duration":"3:33"},{"name":"Lil Peep - nuts (feat. rainy bear)","art":"https://i.scdn.co/image/ab67616d0000b27309d54dc63b8d61cef9e977e5","release_date":"2021-12-17","explicit":true,"duration":"1:25"},{"name":"J. Cole - No Role Modelz","art":"https://i.scdn.co/image/ab67616d0000b273c6e0948bbb0681ff29cdbae8","release_date":"2014-12-09","explicit":true,"duration":"4:52"},{"name":"A Day To Remember - NJ Legion Iced Tea","art":"https://i.scdn.co/image/ab67616d0000b2730b02af77159866fe3e011c76","release_date":"2009-02-03","explicit":false,"duration":"3:31"}]},{"name":"Boh ","desc":"Boh","tag":["#Boh"],"songs":[{"name":"Drake - Jimmy Cooks (feat. 21 Savage)","art":"https://i.scdn.co/image/ab67616d0000b2738dc0d801766a5aa6a33cbe37","release_date":"2022-06-17","explicit":true,"duration":"3:38"},{"name":"Roc Marciano - JJ Flash","art":"https://i.scdn.co/image/ab67616d0000b2733768eb8e45753e145aefb437","release_date":"2022-08-26","explicit":true,"duration":"2:48"},{"name":"Chuck Berry - Johnny B. Goode","art":"https://i.scdn.co/image/ab67616d0000b273a496dc8c33ca6d10668b3157","release_date":"1959-07-01","explicit":false,"duration":"2:41"}]}],"shared":[{"name":"Test","desc":"Test","tag":["#Test"],"songs":[{"name":"Beartooth - In Between","art":"https://i.scdn.co/image/ab67616d0000b2736b70e7bed9a831b79c28327f","release_date":"2014-06-10","explicit":false,"duration":"3:33"},{"name":"Lil Peep - nuts (feat. rainy bear)","art":"https://i.scdn.co/image/ab67616d0000b27309d54dc63b8d61cef9e977e5","release_date":"2021-12-17","explicit":true,"duration":"1:25"},{"name":"J. Cole - No Role Modelz","art":"https://i.scdn.co/image/ab67616d0000b273c6e0948bbb0681ff29cdbae8","release_date":"2014-12-09","explicit":true,"duration":"4:52"},{"name":"A Day To Remember - NJ Legion Iced Tea","art":"https://i.scdn.co/image/ab67616d0000b2730b02af77159866fe3e011c76","release_date":"2009-02-03","explicit":false,"duration":"3:31"}]}],"completed":"yes"},{"token":"BQBJJB9YmRCb4SXEEpdHG1jjrBzlQZLklwmmqdNUPBD7Taf1JPDU7hJGxSxa2K2kCiiXSQpkbsrN4zuzt6ILLGNPY_143tvEa4KugXeTJRzQ7meKIDc","expires_in":3600,"today":1662458064,"email":"xkiller06@gmail.com","username":"xkiller06","password":"xkiller06","artists":["Halsey","Jack Harlow","Harry Styles"],"genres":["alt-rock","alternative","anime","bluegrass"],"playlists":[{"name":"Test","desc":"Test","tag":["#Test"],"songs":[{"name":"Lil Peep - nuts (feat. rainy bear)","art":"https://i.scdn.co/image/ab67616d0000b27309d54dc63b8d61cef9e977e5","release_date":"2021-12-17","explicit":true,"duration":"1:25"},{"name":"A Day To Remember - NJ Legion Iced Tea","art":"https://i.scdn.co/image/ab67616d0000b2730b02af77159866fe3e011c76","release_date":"2009-02-03","explicit":false,"duration":"3:31"}]},{"name":"Seconda playlist","desc":"Qualcosa ","tag":["#Boh"],"songs":[{"name":"Crywank - Jk","art":"https://i.scdn.co/image/ab67616d0000b273d79d25bc91c7d6fe4ad01732","release_date":"2019-03-18","explicit":false,"duration":"1:49"},{"name":"Steve Lacy - Dark Red","art":"https://i.scdn.co/image/ab67616d0000b273263886a4992c39704c601409","release_date":"2017-02-20","explicit":false,"duration":"2:53"},{"name":"Oxlade - DKT","art":"https://i.scdn.co/image/ab67616d0000b27324812dc5896bae1e079a66a8","release_date":"2020-09-04","explicit":false,"duration":"2:18"}]}],"shared":[{"name":"Seconda playlist","desc":"Qualcosa ","tag":["#Boh"],"songs":[{"name":"Crywank - Jk","art":"https://i.scdn.co/image/ab67616d0000b273d79d25bc91c7d6fe4ad01732","release_date":"2019-03-18","explicit":false,"duration":"1:49"},{"name":"Steve Lacy - Dark Red","art":"https://i.scdn.co/image/ab67616d0000b273263886a4992c39704c601409","release_date":"2017-02-20","explicit":false,"duration":"2:53"},{"name":"Oxlade - DKT","art":"https://i.scdn.co/image/ab67616d0000b27324812dc5896bae1e079a66a8","release_date":"2020-09-04","explicit":false,"duration":"2:18"}]}],"completed":"yes"}]';
    localStorage.setItem("accounts", accounts);
} else {
    accounts = JSON.parse(accounts);
}

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

function checkData(event) {

    event.preventDefault();

    goOn = true;

    const inputs = document.querySelectorAll('input');

    const patterns = {
        password: /^[\d\w@-]{8,20}$/i,
        email: /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/,
    };

    inputs.forEach((input) => {

        validate(input, patterns[input.attributes.id.value]);

    });

    if (goOn) {

        return login();

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

/**
 * It checks if the user exists in the database, if it does, it checks if the token is expired, if it
 * is, it refreshes it, if it isn't, it sets the token in the local storage and redirects the user to
 * the index.htm page
 */
async function login() {  

    user = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    }

    if (accounts == null) {
        accounts = []
    } 

    if (accounts.find(u => u.email == user.email && u.password == user.password) == undefined) {
        alert("Wrong username and password ")
    } else {
        foundUser = accounts.find(u => u.email == user.email && u.password == user.password);
        if (await refresh(foundUser) == true) {

            console.log("Refresh del token..");

        } else {

            window.localStorage.setItem('token', foundUser.token);

        }

        if(foundUser.completed == "yes"){

            location.replace("../index.htm");

        } else {

            location.replace("../complete/index.htm");

        }

    }

}


async function refresh(user) {

        if ((Math.floor(Date.now() / 1000) - user.today) >= user.expires_in) {

            console.log("Token scaduto");
            let getNewToken = await getToken();
            let token = await getNewToken.json();
            user.token = token.access_token;
            user.today = Math.floor(Date.now()/1000);
            window.localStorage.setItem('accounts', JSON.stringify(accounts));
            window.localStorage.setItem('token', token.access_token);
            return true;
        }

        return false;

}

