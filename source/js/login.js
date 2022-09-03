const client_id = "7fcf34ffdc704d50b92443bc85a4b934";
const client_secret = "87c3d628813144069f4e56722529993f";
const url = "https://accounts.spotify.com/api/token";
var goOn = true;
var accounts = window.localStorage.getItem('accounts');
accounts = JSON.parse(accounts);

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

