


function pWord(){
    var capChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var lowChar = 'abcdefghijklmnopqrstuvwxyz'
    var num = '0123456789'
    var specChar = '~!@#$%^&*(){}][?><'
    var capCharresult = capChar.charAt(Math.floor(Math.random() * 26));
    var lowCharresult = lowChar.charAt(Math.floor(Math.random() * 26));
    var numresult = num.charAt(Math.floor(Math.random() * 10));
    var specCharresult = specChar.charAt(Math.floor(Math.random() * 18));;
    for ( var i = 0; i < 3; i++ ) {
        capCharresult += capChar.charAt(Math.floor(Math.random() * 26));
        lowCharresult += lowChar.charAt(Math.floor(Math.random() * 26));
        numresult += num.charAt(Math.floor(Math.random() * 10));
        specCharresult += specChar.charAt(Math.floor(Math.random() * 18));
    }
    var correct = Math.ceil(Math.random() * 4);
    var choice = "";
    let answer = "";
    if(correct === 1){
        choice = "numbers"
        answer = numresult;
        document.getElementById('opt1').innerHTML = numresult;
        document.getElementById('opt1').setAttribute('value', numresult);
        let fake1 = fakePW('0123456789', 10);
        document.getElementById('opt2').innerHTML = fake1;
        document.getElementById('opt2').setAttribute('value', fake1)
        let fake2 = fakePW('0123456789', 10);
        document.getElementById('opt3').innerHTML = fake2;
        document.getElementById('opt3').setAttribute('value', fake2)
        let fake3 = fakePW('0123456789', 10);
        document.getElementById('opt4').innerHTML = fake3;
        document.getElementById('opt4').setAttribute('value', fake3)
    } else if (correct === 2){
        choice = "capital letters"
        answer = capCharresult;
        let fake1 = fakePW('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26);
        document.getElementById('opt1').innerHTML = fake1;
        document.getElementById('opt1').setAttribute('value', fake1);
        document.getElementById('opt2').innerHTML = capCharresult;
        document.getElementById('opt2').setAttribute('value', capCharresult)
        let fake2 = fakePW('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26);
        document.getElementById('opt3').innerHTML = fake2;
        document.getElementById('opt3').setAttribute('value', fake2)
        let fake3 = fakePW('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 26);
        document.getElementById('opt4').innerHTML = fake3;
        document.getElementById('opt4').setAttribute('value', fake3)
    } else if (correct === 3){
        choice = "lowercase letters"
        answer = lowCharresult;
        let fake1 = fakePW('abcdefghijklmnopqrstuvwxyz', 26);
        document.getElementById('opt1').innerHTML = fake1;
        document.getElementById('opt1').setAttribute('value', fake1);
        document.getElementById('opt3').innerHTML = lowCharresult;
        document.getElementById('opt3').setAttribute('value', lowCharresult)
        let fake2 = fakePW('abcdefghijklmnopqrstuvwxyz', 26);
        document.getElementById('opt2').innerHTML = fake2;
        document.getElementById('opt2').setAttribute('value', fake2)
        let fake3 = fakePW('abcdefghijklmnopqrstuvwxyz', 26);
        document.getElementById('opt4').innerHTML = fake3;
        document.getElementById('opt4').setAttribute('value', fake3)
    }else if (correct === 4){
        choice = "special characters"
        answer = specCharresult;
        let fake1 = fakePW('~!@#$%^&*(){}][?><', 18);
        document.getElementById('opt1').innerHTML = fake1;
        document.getElementById('opt1').setAttribute('value', fake1);
        document.getElementById('opt4').innerHTML = specCharresult;
        document.getElementById('opt4').setAttribute('value', specCharresult)
        let fake2 = fakePW('~!@#$%^&*(){}][?><', 18);
        document.getElementById('opt2').innerHTML = fake2;
        document.getElementById('opt2').setAttribute('value', fake2)
        let fake3 = fakePW('~!@#$%^&*(){}][?><', 18);
        document.getElementById('opt3').innerHTML = fake3;
        document.getElementById('opt3').setAttribute('value', fake3)
    }
    //document.getElementById('keyDisplay').innerHTML = result;
    document.getElementById('clue').innerHTML = "Prove your humanity and match the correct " + choice +" " + answer;
    document.getElementById('passkey').setAttribute('value', answer)
}
pWord();

function fakePW(digits, randSize){
    let j = digits.charAt(Math.floor(Math.random() * randSize));;
    for ( var i = 0; i < 3; i++ ) {
        j += digits.charAt(Math.floor(Math.random() * randSize));
    }
    return j;
}
