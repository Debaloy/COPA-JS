// global function / utility function
function getElements() {
    let name = document.getElementById("name");
    let email = document.getElementById("email");
    let phn = document.getElementById("phn");

    return [name, email, phn];
}

// student data
let studentObjectArray = [];

// functions related to deleting a student record
function delRecord() {
    let [email, phn] = promptDetails();
    for (let i = 0; i < studentObjectArray.length; i++) {
        if (studentObjectArray[i].email == email || studentObjectArray[i].phn == phn) {
            delete studentObjectArray[i];
            studentObjectArray.length--;
            return alert("Record deleted successfully!");
        }
    }
    return alert("Record not found!");
}

function promptDetails() {
    alert("Please enter the email and/or phone number of the record you want to delete.");
    return [prompt("Enter Email"), prompt("Enter Phone Number")];
}

// functions related to showing data
function showDetails(flag) {
    if (!flag)
        return document.getElementById("target").style.display = 'none';

    if (studentObjectArray.length == 0)
        return alert("No records available to show!");
    
    let html = `
    <tr>
        <th>Last Name</th>
        <th>First Name</th>
        <th>Email</th>
        <th>Phone</th>
    </tr>
    `;

    for (let i = 0; i < studentObjectArray.length; i++) {
        html += `
        <tr>
            <td>${studentObjectArray[i].name.split(' ')[1]}</td>
            <td>${studentObjectArray[i].name.split(' ')[0]}</td>
            <td>${studentObjectArray[i].email}</td>
            <td>${studentObjectArray[i].phn}</td>
        </tr>
        `;
    }

    document.getElementById("target").innerHTML = html;
    document.getElementById("target").style.display = 'table-row';
}

// functions related to form reset
function resetForm() {
    let elements = getElements();
    for (let i = 0; i < elements.length; i++) {
        elements[i].value = '';
        elements[i].style.border = '';
    }
}

// functions related to form submission
function submitForm() {
    let elements = getElements();
    if (checkForm(elements) && saveData(elements)) {
        alert("Form Submitted!");
        resetForm();
    } else
        alert("Failed to submit. Fill the form correctly or make sure the data is not redundant")
}

function checkForm(elements) {
    let flag = elements.length;
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].value === '')
            elements[i].style.border = "2px solid red";
        else {
            elements[i].style.border = "2px solid green";
            flag--;
        }
    }
    return flag == 0;
}

function saveData(data) {
    let student = {};
    for (let i = 0; i < data.length; i++) {
        student[data[i].name] = data[i].value;
    }
    return checkDuplicate(student);
}

function checkDuplicate(stud) {
    for (let i = 0; i < studentObjectArray.length; i++) {
        if (studentObjectArray[i].phn == stud.phn || studentObjectArray[i].email == stud.email)
            return false;
    }
    studentObjectArray.push(stud);
    return true;
}