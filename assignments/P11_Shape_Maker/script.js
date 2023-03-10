function draw() {
    let shapeElement = document.getElementById('shape');
    let colorElement = document.getElementById('color');

    let shape = shapeElement.options[shapeElement.selectedIndex].value;
    let color = colorElement.options[colorElement.selectedIndex].value;
    
    if ([shape, color].includes('null')) return alert('Please select all the options');

    let html = `<div class="border ${shape} ${color}"></div>`;

    document.getElementById('result').innerHTML = html;
}