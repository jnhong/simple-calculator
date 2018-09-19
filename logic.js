/*
Possible features:
scientific notation for overflow
commas between every three digits
*/
let calculator = {};

/* constants */
calculator.prefix = "calc-";

/* flags */
calculator.negativeFlag = false;
calculator.decimalFlag = false;
calculator.allClearFlag = false;
calculator.displayCharLimit = 15;

/* data */
// nuemric storage of input values
calculator.pendingOperand1 = null;
calculator.pendingOperand2 = null;

calculator.pendingOperator = null; // use element handle

// string storage of input value 
calculator.integralChars = "";
calculator.mantissaChars = "";

/* methods */
calculator.getCalcElement = function (label) {
    this[label] = document.getElementById(this.prefix + label);
}

/* enumerate unique parts of labels */
calculator.labels = ["clear", "plus-minus", "percent",
                     "divide", "multiply", "minus", "plus",
                     "decimal", "equals"];

/* insert numeric labels */
for (let i = 0; i < 10; ++i) {
    calculator.labels.push(i);
}

// get handles to all calculator
for (let label of labels) {
    calculator.getCalcElement(label);
}

/* get display element */
calculator.display = document.getElementById("calc-display");

for (let i = 0; i < 10; ++i) {
    calculator[i].addEventListener("click", digitUpdate);
}

function digitUpdate (e) {
    if (!calculator.decimalFlag) {
        calculator.integralChars += e.target.textContent;
    } else {
        calculator.mantissaChars += e.target.textContent;
    }
}

calculator["decimal"].addEventListener("click", (e) => { 
});

calculator["clear"].addEventListener("click", (e) => {
    // reset flags
    calculator.negativeFlag = false;
    calculator.decimalFlag = false;
    calculator.allClearFlag = false;

    // reset storage values
    calculator.integralChars = "";
    calculator.mantissaChars = "";

    // reste display
    display.textContent = "0";

    if (calculator.allClearFlag) {
        calculator.pendingOperand1 = null;
        calculator.pendingOperand2 = null;
        calculator.pendingOperator = null;
    }
});

calculator["plus-minus"].addEventListener("click", (e) => {
    calculator.negativeFlag = !calculator.negativeFlag;
});

calculator["percent"].addEventListener("click", (e) => {
});