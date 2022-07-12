const showP = document.getElementById('showPrompt');
let newPrompt = '';

function updatePrompt() {
    fetch('/prompt', { method: 'GET' })
        .then(res => {
            console.log(res);
            newPrompt = res;
        });
}

showP.innerHTML = 'Hello'
console.log(newPrompt);