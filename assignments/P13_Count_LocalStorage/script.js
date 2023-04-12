let count = 0;

function decreaseCount() {
    count--;
    updateCount();
}

function increaseCount() {
    count++;
    updateCount();
}

function updateCount() {
    document.getElementById("count").textContent = count;
    updateLocalStorage();
}

function updateLocalStorage() {
    localStorage.setItem("count", count);
}

function checkLocalStorage() {
    let prevCount = localStorage.getItem("count");

    if (prevCount) {
        count = prevCount;
    } else {
        localStorage.setItem("count", count);
    }
}

checkLocalStorage();
updateCount();