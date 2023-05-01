const palindrome = (x) => {
    x = "" + x;
    x = x.split("");
    let i = 0, j = x.length - 1;
    while (i < j) {
        if (x[i] !== x[j]) return false;
        i++;
        j++;
    }
    return true;
};

const validate = (s) => {
    let array = [];
    for (const c of s) {
        if (c === "(" || c === "{" || c === "[") {
            array.push(c);
        } else {
            
        }
    }
};