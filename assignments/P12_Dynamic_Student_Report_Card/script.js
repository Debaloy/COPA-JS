const fieldContainer = document.getElementById("field-container");
let no_of_fields = 0;

function setFields() {
	no_of_fields = document.getElementById("subs").value;
	drawFields();
}

function drawFields() {
	let html = `
		<tr>
			<th>Subjects</th>
			<th colspan="2">Marks</th>
		</tr>
	`;
	for (let i = 0; i < no_of_fields; i++) {
		html += `
			<tr>
				<td>Subject ${i+1}: </td>
				<td colspan="2"><input type="text" class="marks"></td>
			</tr>
		`;
	}
	
	let toCalArray = ["Total", "Percentage"];
	
	for (let i = 0; i < toCalArray.length; i++) {
		let iter = toCalArray[i];
		
		html += `
			<tr>
				<th>${iter}: </th>
				<td><input type="text" id="${iter}" disabled></td>
				<td><button onclick="cal${iter}()">Calculate</button></td>
			</tr>
		`;
	}
	
	fieldContainer.innerHTML = html;
}

function getSum() {
	const marks = document.getElementsByClassName("marks");
	let sum = 0;
	
	for (let i = 0; i < marks.length; i++) {
		sum += Number(marks[i].value);
	}
	
	return {
		total: sum,
		no_of_sub: marks.length
	};
}

function calTotal() {
	if (!validate()) return alert("Marks out of range [0,100]");
	
	const total = getSum();
	document.getElementById("Total").value = total.total;
}

function calPercentage() {
	if (!validate()) return alert("Marks out of range [0,100]");

	const total = getSum();
	document.getElementById("Percentage").value = (total.total / total.no_of_sub).toPrecision(5);
}

function validate() {
	let marks = document.getElementsByClassName("marks");
	
	for (mark of marks) {
		if (mark.value > 100 || mark.value < 0)
			return false;
	}
	
	return true;
}