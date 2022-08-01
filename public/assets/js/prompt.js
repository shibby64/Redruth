updatePrompt();

function updatePrompt() {
    const showP = document.getElementById('showPrompt');
    const promptInput = document.getElementById('prompt');
    fetch('/prompt', { method: 'GET' })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            try {
                showP.innerHTML = res;
            } catch (error) {
                console.error(error);
            }
            promptInput.value = res;
        });
}

