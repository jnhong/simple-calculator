let calculator = {};

/* constants */
calculator.prefix = "calc-";
calculator.displayDigitLimit = 12;

/* flags */
calculator.negativeFlag = false;
calculator.decimalFlag = false;
calculator.allClearFlag = true;
calculator.newInput = false;

calculator.currentOperand = 1;

/* data */
// nuemric storage of input values
calculator.operands = [];
calculator.operator = null; // use element handle

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

calculator.setClear = function () {
    if (this.allClearFlag) {
        this.allClearFlag = false;
        this["clear"].textContent = "C";
    } 
}

calculator.setAllClear = function () {
    if (!this.allClearFlag) {
        this.allClearFlag = true;
        this["clear"].textContent = "AC";
    } 
}

calculator.clearInput = function () {
    this.negativeFlag = false;
    this.decimalFlag = false;
    this.integralChars = [];
    this.mantissaChars = [];
}

calculator.displayLimitCheck = function (numChars) {
    return this.integralChars.length + this.mantissaChars.length + numChars > this.displayDigitLimit;
};

// convert input data into numeric form
calculator.convertInputToNumber = function () {
    if (this.integralChars.length == 0) {
        this.integralChars.push("0");
    }
    if (this.negativeFlag) {
        this.integralChars.unshift("-");
    }

    let array, value;
    if (this.decimalFlag) {
        array = this.integralChars.push(".");
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

    let array = this.integralChars.join("");
    let value = parseInt(array);
    return value;
};

calculator.updateDisplay = function () {
    let displayText = (this.negativeFlag ? "-" : "") + this.convertIntegralPartToNumber().toLocaleString();
    if (this.decimalFlag) {
        displayText += ".";
    }
    displayText += this.mantissaChars.join("");
    this.display.textContent = displayText; 
};

// calculator event listeners
for (let i = 0; i < 10; ++i) {
    calculator[i].addEventListener("click", (e) => {
        calculator.setClear();
        calculator.newInput = true;

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
    calculator.setClear();
    calculator.updateDisplay();
});

calculator.operand1ToInput = function () {
    let str = this.operand[1].toString();
    if (str[0] == "-") {
        this.negativeFlag = true;
    }
    let i = 1;
    while (i < str.length && str[i] != ".") {
        this.integralChars.push(str[i]);
        ++i;
    }
    if (i < str.length) {
        this.decimalFlag = true;
    }
    while (i < str.length) {
        this.mantissaChars.unshift(str[i]);
        ++i;
    }
    this.newInput = true;
}

calculator["plus-minus"].addEventListener("click", (e) => {
    if (calculator.newInput == false) {
        calculator.operand1ToInput();
    }
    calculator.negativeFlag = !calculator.negativeFlag;
    calculator.updateDisplay();
});

calculator["percent"].addEventListener("click", (e) => {
    if (calculator.newInput == false) {
        calculator.operand1ToInput();
    }
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


for (let button of ["divide", "multiply", "minus", "plus"]) {
    calculator[button].addEventListener("click", (e) => {
        switch (calculator.currentOperand) {
            case 1:
                if (calculator.newInput) {
                    calculator.operands[1] = calculator.convertInputToNumber();
                }
                calculator.currentOperand = 2;
                break;
            case 2:
                calculator.operands[2] = calculator.convertInputToNumber();
                calculator.calculate();
                break;
            default:
                break;
        }
        calculator.clearInput();
        calculator.operator = e.target;
    });
}

calculator["equals"].addEventListener("click", (e) => {
    if (calculator.newInput === true) {
        calculator.operands[calculator.currentOperand] = calculator.convertInputToNumber();
        calculator.currentOperand = calculator.currentOperand % 2 + 1;
    }

    calculator.calculate();
    calculator.clearInput();
    calculator.newInput = false;
});

calculator.calculate = function () {
    // if no operands, do nothing
    if (!this.operands[1] && !this.operands[2]) {
        return;
    }
    // if only operands[1], use operands[1] as operands[2] 
    if (!this.operands[2]) {
        this.operands[2] = this.operands[1];
    }
    // compute and store result in operands[1]
    switch (this.operator.textContent) {
        case "%":
            this.operands[1] /= this.operands[2];
            break;
        case "×":
            this.operands[1] *= this.operands[2];
            break;
        case "-":
            this.operands[1] -= this.operands[2];
            break;
        case "+":
            this.operands[1] += this.operands[2];
            break;
        default:
            break;
    }
    // display result (convert number to string, truncate? and display)
    this.display.textContent = this.operands[1].toLocaleString();
};

calculator["clear"].addEventListener("click", (e) => {
    calculator.clearInput();

    if (calculator.allClearFlag) {
        calculator.operands = [];
        calculator.operator = null;
        calculator.currentOperand = 1;
    }
    calculator.setAllClear();

    calculator.updateDisplay();
});