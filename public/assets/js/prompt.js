function updatePrompt() {
    fetch('/prompt', { method: 'GET' })
        .then(res => res.json())
        .then(res => {
            //document.getElementById('showPrompt').innerHTML = res;
            console.log(res);
            return res;
        });
}