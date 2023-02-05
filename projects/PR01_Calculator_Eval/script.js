let result = "",
  answer;

function renderResult(flag = true) {
  document.getElementById("result").value = flag ? result : "Syntax Error";
}

function keyPressed(key) {
  if (key === "po") result += "(";
  if (key === "pc") result += ")";
  result += key;

  renderResult();
}

function clearResult() {
  result = "";
  renderResult();
}

function calcResult() {
  try {
    answer = eval(result);
  } catch {
    return renderResult(false);
  }
  result = answer;
  renderResult();
}

function getPrevResult() {
  result += answer;
  renderResult();
}

document.onkeydown = (e) => {
  if (e.key === "Backspace") {
    if (result.length === 0) return;
    result = result.substring(0, result.length - 1);
    renderResult();
  }
};
