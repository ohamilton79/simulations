class FloatingPointManager {

    constructor() {
        //const drawnShiftedTable = document.getElementById("shiftedMantissaTable");
        //this.shiftedMantissaTable = new Table(drawnShiftedTable);
        this.binaryManager = new BinaryArithmeticManager();

        //this.buttons = [];
        //this.placeValues = [];
    }

    //Shift the place values by the value of the exponent
    shiftPlaceValues(placeValues, exponent) {
        //const denaryExponent = this.getDenaryExponent();

        //Multiply each place value by 2^exponent
        let scaledPlaceValues = placeValues.map(value => Math.abs(value) * (2 ** exponent));
        //The first place value should be negative
        scaledPlaceValues[0] = -1 * scaledPlaceValues[0];
        return scaledPlaceValues;
    }

    padPlaceValues(placeValues, newColumns, direction="L") {
        //Create a new list of place values that are all positive
        let newPlaceValues = placeValues.map(value => Math.abs(value));
        //Get the number of additional columns
        //const newColumns = exponent < 0 ? -1 * exponent : 0;

        //Add new columns in the specified direction
        let currentValue = newPlaceValues[0] * 2;

        for (let i=0; i < newColumns; i++) {
            if (direction == "L") {
                newPlaceValues.unshift(currentValue);
            } else if (direction == "R") {
                newPlaceValues.push(currentValue);
            }

            //Update value for next place value heading to the left
            currentValue = currentValue * 2;
        }

        //Make the initial place value negative again
        newPlaceValues[0] = -1 * newPlaceValues[0];

        //Return the updated place values
        return newPlaceValues;
    }

    /*padPlaceValues(placeValues, exponent) {
        //Get the number of additional columns
        const newColumns = exponent < 0 ? -1 * exponent : 0;

        if (newColumns != 0) {
            //Make the initial place value positive again
            placeValues[0] = Math.abs(placeValues[0]);
        }
        //Add new columns to the left
        let currentValue = Math.abs(placeValues[0] * 2);
        let sign;
        for (let i=0; i < newColumns; i++) {
            //Set the sign so that only the last column to be added is negative
            sign = i == newColumns - 1 ? -1 : 1;
            placeValues.unshift(sign * currentValue);

            //Update value for next place value heading to the left
            currentValue = currentValue * 2;
        }

        //Make the initial place vlaue negative again
        //placeValues[0] = -1 * placeValues[0];

        //Return the updated place values
        return placeValues;
    }*/

    padMantissa(mantissa, placeValues) {
        //Pad the mantissa with how many digits differ between the lengths of the mantissa and place values
        const padWidth = placeValues.length - mantissa.length;

        //The value to pad with is the value of the most significant mantissa bit
        const paddingDigit = mantissa[0];
        for (let i=0; i < padWidth; i++) {
            //Prepend the padding digit to the mantissa
            mantissa.unshift(paddingDigit);
        }

        //Return the padded mantissa
        return mantissa;
    }

    getValuesToSum(binary, headings) {
        const valuesToSum = headings.filter((currentValue, index) => binary[index] == "1");
        if (valuesToSum.length > 0) {
            return valuesToSum;
        } else {
            return ["0"];
        }
        /*let valuesToSum = [];
        //Get the denary values that make up the binary number
        for (let i=0; i < this.binary; i++) {
            //Get button text
            let buttonText = this.buttons[i].innerHTML;

            //If the button text is a 1, add its shifted place value to the list of values to sum
            if (buttonText == "1") {
                valuesToSum.push(this.shiftedPlaceValues[i]);
            }
        }
        //Return the list of values to sum
        return valuesToSum;*/
    }

    sumHeadings(headings) {
        //Sum the values in the array
        const sum = headings.reduce((previousValue, currentValue) => previousValue + currentValue);
        return sum;
    }

    binaryToDenary(mantissa, exponent, mantissaHeadings, exponentHeadings) {
        //Delete any existing rows from the shifted mantissa table
        //this.shiftedMantissaTable.deleteRows();
        
        //Get a list of denary values to sum to give the value of the exponent
        const exponentComponents = this.getValuesToSum(exponent, exponentHeadings);

        //Display components of exponent on screen as a sum
        //document.getElementById("exponentCalculationsText").innerHTML = (exponentComponents.join(" + ") + " =");

        //Get exponent in denary and display
        const denaryExponent = this.sumHeadings(exponentComponents);
        //document.getElementById("exponentResultText").innerHTML = denaryExponent.toString();

        //Shift the headings of the mantissa by the denary value of the exponent
        const shiftedPlaceValues = this.shiftPlaceValues(mantissaHeadings, denaryExponent);

        //Display shifted place values, padded for display purposes, along with the mantissa in a new table
        const paddedPlaceValues = this.padPlaceValues(shiftedPlaceValues, (denaryExponent < 0 ? -1 * denaryExponent : 0));
        const paddedMantissa = this.padMantissa(mantissa, paddedPlaceValues);

        //this.shiftedMantissaTable.generateTable(paddedMantissa.length, 0, paddedPlaceValues, paddedMantissa);

        //Get a list of denary values to sum to give the final value of the floating-point number
        const mantissaComponents = this.getValuesToSum(paddedMantissa, paddedPlaceValues);
        //Display components of mantissa on screen as a sum
        //document.getElementById("mantissaCalculationsText").innerHTML = (mantissaComponents.join(" + ") + " =");

        //Get final result in denary and display
        const denaryResult = this.sumHeadings(mantissaComponents);
        //document.getElementById("mantissaResultText").innerHTML = denaryResult.toString();

        //Package the results, returning the denary exponent, padded place values and mantissa, denary components of the mantissa and the final denary result
        return [exponentComponents, denaryExponent, 
            paddedPlaceValues, paddedMantissa, 
            mantissaComponents, denaryResult
        ];
    }

    denaryToBinary(denaryInput, mantissaSize, exponentSize) {
        //Delete any existing rows from the shifted mantissa table
        //this.shiftedMantissaTable.deleteRows();

        //Convert the denary number into an unnormalised positive floating point number
        const [unnormalisedMantissa, unnormalisedHeadings] = this.binaryManager.intToTwosComplement(Math.abs(denaryInput), mantissaSize + 2 ** exponentSize);
        console.log(unnormalisedMantissa, unnormalisedHeadings);
        //Negate the mantissa if the denary number is negative
        const negatedMantissa = (denaryInput < 0) ? this.binaryManager.negateTwosComplement(unnormalisedMantissa, unnormalisedHeadings) : null;

        //console.log(unnormalisedMantissa, unnormalisedHeadings);
        //this.displayFloatingPoint(unnormalisedMantissa, unnormalisedHeadings);


        //Normalise the number, and get the exponent
        const [normalisedMantissa, normalisedHeadings, denaryExponent] = this.normalise(negatedMantissa ?? unnormalisedMantissa, unnormalisedHeadings, mantissaSize);
        

        //this.shiftedMantissaTable.generateTable(normalisedMantissa.length, 0, normalisedHeadings, normalisedMantissa);

        //Convert the exponent to two's complement
        const [exponentBinary, exponentHeadings] = this.binaryManager.intToTwosComplement(denaryExponent, exponentSize, exponentSize, 0);

        //Package the results, returning the unnormalised result, normalised mantissa, exponent, and two's complement exponent
        return [unnormalisedMantissa, negatedMantissa, unnormalisedHeadings, 
                        normalisedMantissa, normalisedHeadings, 
                        denaryExponent, exponentBinary, exponentHeadings
        ];
    }

    //Normalise a mantissa
    normalise(mantissa, headers, mantissaSize) {
        //Copy the arrays passed as arguments
        let normalisedMantissa = [...mantissa];
        let newHeaders = [...headers];
        //Get the type of leading digit to remove based on the sign of the mantissa: 1 if negative, 0 if positive
        const leadingDigit = mantissa[0] == 1 ? 1 : 0;
        //const secondDigit = mantissa[0] == 1 ? 0 : 1;
        //Get the index of the digit before the binary point
        //console.log(binaryPointIndex);
        //console.log(binaryPointIndex);
        //let currentIndex = 0;

        //While two of the leading digit to be removed are either side of the binary point...
        while (normalisedMantissa[0] == leadingDigit && normalisedMantissa[1] == leadingDigit) {
            //Remove the left-most digit
            normalisedMantissa.shift();
            //Update headers
            newHeaders.shift();
            newHeaders[0] = newHeaders[0] * -1;
            //currentIndex += 1;
        }

        const binaryPointIndex = Math.log2(-1 * newHeaders[0]);
        //const firstDigitIndex = currentIndex  - 1;
        //const secondDigitIndex = currentIndex;

        const nOfShifts = -1 * binaryPointIndex;
        const exponent = -1 * nOfShifts;

        /*for (let i=0; i < nOfShifts; i++) {
            //Update the mantissa by removing the MSB and appending a 0
            normalisedMantissa.shift();
            newHeaders.pop();
            //normalisedMantissa.push(0);
        }*/
        //Pad the mantissa and headings
        while (normalisedMantissa.length < mantissaSize) {
            normalisedMantissa.push(0);
            newHeaders = this.padPlaceValues(newHeaders, 1, "R");
        }
        //Update headers
        newHeaders = this.shiftPlaceValues(newHeaders, nOfShifts);
        //If the number can't be represented within the mantissa size constraint
        console.log(normalisedMantissa);
        if (normalisedMantissa.length > mantissaSize) {
            throw new Error(`The denary number entered is outside the range of values that can be accurately represented`);
        }

        //Return the updated mantissa and headers, as well as the exponent needed to return the number to its original value
        return [normalisedMantissa, newHeaders, exponent];
    }
}

/*
//Remove the MSB, and add a 0 to the end
            normalisedMantissa.shift();
            normalisedMantissa.push(0);
            //Update headers
            newHeaders = this.shiftPlaceValues(newHeaders, -1);
            //Update exponent
            exponent -= 1;
            */