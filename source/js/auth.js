const client_id = "7fcf34ffdc704d50b92443bc85a4b934";
const client_secret = "87c3d628813144069f4e56722529993f";
const url = "https://accounts.spotify.com/api/token";
var goOn = true;

async function signup() {

    accounts = window.localStorage.getItem('accounts')

    if (accounts == null) {
        accounts = []
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

