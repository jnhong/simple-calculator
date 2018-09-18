
let buttons = {};

buttons.prefix = "calc-";
buttons.getCalcElement = function (label) {
    this[label] = document.getElementById(this.prefix + label);
}

// enumerate unique parts of labels
let labels = ["clear", "plus-minus", "percent",
              "divide", "multiply", "minus", "plus",
              "decimal", "equals"];

for (int i = 0; i < 10; ++i) {
    labels.push(i);
}

// get handles to all buttons
for (let label of labels) {
    buttons.getCalcElement(label);
}

let display = document.getElementById("calc-display");
let pendingValue;

for (int i = 0; i < 10; ++i) {
    buttons[i] = addEventListener("click", updateDisplay);
}

function updateDisplay () {

}
