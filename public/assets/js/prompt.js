updatePrompt();

function updatePrompt() {
    var queryStr = window.location.search;
    const showP = document.getElementsByClassName('showPrompt');
    const promptInput = document.getElementById('prompt');
    fetch('/prompt' + queryStr, {  method: 'GET' })
        .then(res => res.json())
        .then(res => {
            console.log(res.prompt);
            try {
                Array.from(showP).forEach(element => {
                    element.innerText = res.prompt;
                });
            } catch (error) {
                console.error(error);
            }
            promptInput.value = res.prompt_id;
        });
}

