document.addEventListener('DOMContentLoaded', (event) => {
    var form = document.getElementById("subscribeForm");
    var message = document.getElementById("subscribeMessage");

    const successMessages = [
        "Ahoy! Welcome aboard matey!",
        "Yo ho ho! A new shipmate has joined the crew!",
        "Avast ye! Ye've successfully signed on for adventure!",
        "Shiver me timbers with joy! Ye're now part of the crew!",
        "Arr! Welcome to the treasure trove of emails, ye lucky buccaneer!"
    ];

    const errorMessages = [
        "Yarr! There be a problem with yer submission, try again ye brave soul!",
        "Blasted! The sea be rough, give it another go, persistent pirate!",
        "Avast ye! Somethin' went wrong, but don't abandon ship yet!",
        "Shiver me timbers! The kraken intercepted yer submission. Once more!",
        "Arrr! Ye hit a reef, but keep sailin' and try again!"
    ];
 
    function getRandomMessage(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        var data = new FormData(form);
        fetch(form.action, {
            method: form.method,
            body: data,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                message.textContent = getRandomMessage(successMessages);
                form.reset();
            } else {
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        message.textContent = data["errors"].map(error => error["message"]).join(", ");
                    } else {
                        message.textContent = getRandomMessage(errorMessages);
                    }
                })
            }
        }).catch(error => {
            message.textContent = getRandomMessage(errorMessages);
        });
    });
});