function pWord(){
    var result = ""
    var capChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var lowChar = 'abcdefghijklmnopqrstuvwxyz'
    var num = '0123456789'
    var specChar = '~!@#$%^&*(){}][?><'
    var capCharresult = capChar.charAt(Math.floor(Math.random() * 26));
    var lowCharresult = lowChar.charAt(Math.floor(Math.random() * 26));
    var numresult = num.charAt(Math.floor(Math.random() * 10));
    var specCharresult = specChar.charAt(Math.floor(Math.random() * 18));;
    for ( var i = 0; i < 4; i++ ) {
        capCharresult += capChar.charAt(Math.floor(Math.random() * 26));
        lowCharresult += lowChar.charAt(Math.floor(Math.random() * 26));
        numresult += num.charAt(Math.floor(Math.random() * 10));
        specCharresult += specChar.charAt(Math.floor(Math.random() * 18));
        result += capCharresult.charAt(i) + lowCharresult.charAt(i) + numresult.charAt(i) + specCharresult.charAt(i);
    }
    const password = document.createElement('p');
    password.setAttribute('id', 'pWordSelect');
    const pWordNode = document.createTextNode("" + result);
    password.appendChild(pWordNode);
    const pWordElement = document.getElementById('password');
    pWordElement.appendChild(password);
}
//pWord();