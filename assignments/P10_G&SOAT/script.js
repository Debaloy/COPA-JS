function getResult() {
    let a = document.getElementById('a').value;
    let b = document.getElementById('b').value;
    let c = document.getElementById('c').value;

    let max, min;

    if (a > b) {
        if (a > c)  max = a;
        else        max = c;
    } else {
        if (b > c)  max = b;
        else        max = c;
    }

    if (a < b) {
        if (a < c)  min = a;
        else        min = c;
    } else {
        if (b < c)  min = b;
        else        min = c;
    }

    document.getElementById('max').value = max;
    document.getElementById('min').value = min;
}

function resetFields() {
    let ele = ['a', 'b', 'c', 'max', 'min'];

    for (let i = 0; i < ele.length; i++)
        document.getElementById(ele[i]).value = "";
}