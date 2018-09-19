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
calculator.displayDigitLimit = 12;

/* data */
// nuemric storage of input values
calculator.pendingOperand1 = null;
calculator.pendingOperand2 = null;

calculator.pendingOperator = null; // use element handle

// character array storage of input value
calculator.integralChars = [];
calculator.mantissaChars = [];

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
for (let label of calculator.labels) {
    calculator.getCalcElement(label);
}

/* get display element */
calculator.display = document.getElementById("calc-display");

// calculator methods

calculator.displayLimitCheck = function (numChars) {
    return this.integralChars.length + this.mantissaChars.length + numChars > this.displayDigitLimit;
};

// convert data into numeric form
calculator.convertInputToNumber = function () {
    if (this.integralChars.length == 0) {
        this.integralChars.push("0");
    }
    if (this.negativeFlag) {
        this.integralChars.unshift("-");
    }

    let array, value;
    if (this.decimalFlag) {
        array = this.integralChars.concat(this.mantissaChars).join("");
        value = parseFloat(array);
    } else {
        array = this.integralChars.join("");
        value = parseInt(array);
    }
    return value;
};

// useful for updating display
calculator.convertIntegralPartToNumber = function () {
    if (this.integralChars.length == 0) {
        this.integralChars.push("0");
    }
    if (this.negativeFlag) {
        this.integralChars.unshift("-");
    }

    let array = this.integralChars.join("");
    let value = parseInt(array);
    return value;
};

calculator.updateDisplay = function () {
    let displayText = calculator.convertIntegralPartToNumber().toLocaleString();
    if (this.decimalFlag) {
        displayText += ".";
    }
    displayText += calculator.mantissaChars.join("");
    calculator.display.textContent = displayText; 
};

// calculator event listeners
for (let i = 0; i < 10; ++i) {
    calculator[i].addEventListener("click", (e) => {
        if (calculator.displayLimitCheck(1)) {
            return;
        }
        if (!calculator.decimalFlag) {
            calculator.integralChars.push(e.target.textContent);
        } else {
            calculator.mantissaChars.unshift(e.target.textContent);
        }
        calculator.updateDisplay();
    });
}

calculator["decimal"].addEventListener("click", (e) => { 
    calculator.decimalFlag = true;
    calculator.updateDisplay();
});

// TODO
/*
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

    calculator.updateDisplay();
});
*/

calculator["plus-minus"].addEventListener("click", (e) => {
    calculator.negativeFlag = !calculator.negativeFlag;
    calculator.updateDisplay();
});

calculator["percent"].addEventListener("click", (e) => {
    if (calculator.displayLimitCheck(2)) {
        return;
    }

    for (let i = 0; i < 2; ++i) {
        let digit = calculator.integralChars.pop();
        if (digit === undefined) {
            digit = "0";
        }
        calculator.mantissaChars.unshift(digit);
        calculator.decimalFlag = true;
    }

    calculator.updateDisplay();
});