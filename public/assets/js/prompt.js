updatePrompt();

function updatePrompt() {
    const showP = document.getElementsByClassName('showPrompt');
    const promptInput = document.getElementById('prompt');
    fetch('/prompt', { method: 'GET' })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            try {
                Array.from(showP).forEach(element => {
                    element.innerText = res;
                });
            } catch (error) {
                console.error(error);
            }
            promptInput.value = res;
        });
}

