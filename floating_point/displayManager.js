class DisplayManager {
    constructor() {
        this.fpManager = new FloatingPointManager();
    }
    /*updateCalculationsText(valuesToSum) {
        //Convert array to string, separated by addition symbols, and display
        document.getElementById("calculationsText").innerHTML = valuesToSum.join(" + ");
    }

    updateResultText(valuesToSum) {     
        sum = this.sumHeadings(valuesToSum);
        document.getElementById("resultText").innerHTML = sum.toString();
    }*/

    /*setupBinaryToDenary() {
        //Create the floating point table where the user can enter their floating point number
        const drawnFPTable = document.getElementById("floatingPointTable");
        //const cellClickCallback = this.toggleBit.bind(this)  //Bind the reference to the class so class methods can still be called
        this.floatingPointTable = new Table(drawnFPTable)
        this.floatingPointTable.generateTable(this.mantissaSize, this.exponentSize);
    }*/

    /*updateTable(id, binary, headings, mantissaSize, exponentSize) {
        const drawnTable = document.getElementById(id);
        const tableObject = new Table(drawnTable);
        tableObject.generateTable(mantissaSize, exponentSize, headings, binary);
    }*/

    setupBinaryToDenary() {
        this.toDenaryElements = {
            "floatingPointTable": new Table("floatingPointTable", true),
            "exponentCalculationsText": document.getElementById("exponentCalculationsText"),
            "exponentResultText": document.getElementById("exponentResultText"),
            "shiftedMantissaTable": new Table("shiftedMantissaTable"),
            "mantissaCalculationsText": document.getElementById("mantissaCalculationsText"),
            "mantissaResultText": document.getElementById("mantissaResultText")
        };

        //Display the table where the user can enter their floating point number
        this.toDenaryElements["floatingPointTable"].update(5, 3);
    }

    setupDenaryToBinary() {
        this.toBinaryElements = {
            "denaryInput": document.getElementById("denaryInput"),
            "positiveMantissaTable": new Table("positiveMantissaTable"),
            "negativeMantissaTable": new Table("negativeMantissaTable"),
            "shiftedMantissaTable": new Table("shiftedMantissaTable"),
            "exponentResultText": document.getElementById("exponentResultText"),
            "exponentTable": new Table("exponentTable"),
            "floatingPointTable": new Table("floatingPointTable")      
        };
    }

    displayBinaryToDenary() {
        //Get table properties
        const results = this.fpManager.binaryToDenary(this.toDenaryElements["floatingPointTable"].getMantissa(5),
                                                                this.toDenaryElements["floatingPointTable"].getExponent(3),
                                                                this.toDenaryElements["floatingPointTable"].getMantissaHeadings(5),
                                                                this.toDenaryElements["floatingPointTable"].getExponentHeadings(3)
        );
        //console.log(this.toDenaryElements["floatingPointTable"].getExponentHeadings(3));
        //Unpackage results from floating point manipulations
        let exponentComponents, denaryExponent, paddedPlaceValues, paddedMantissa, mantissaComponents, denaryResult;
        [exponentComponents, denaryExponent, paddedPlaceValues, paddedMantissa, mantissaComponents, denaryResult] = results;

        //Update elements on screen
        this.toDenaryElements["exponentCalculationsText"].innerHTML = (exponentComponents.join(" + ") + " =");
        this.toDenaryElements["exponentResultText"].innerHTML = denaryExponent.toString();
        this.toDenaryElements["shiftedMantissaTable"].update(paddedMantissa.length, 0, paddedPlaceValues, paddedMantissa);
        this.toDenaryElements["mantissaCalculationsText"].innerHTML = (mantissaComponents.join(" + ") + " =");
        this.toDenaryElements["mantissaResultText"].innerHTML = denaryResult.toString();
    }

    displayDenaryToBinary(mantissaSize, exponentSize) {
        //Get the denary input from the user
        const denaryInput = Number(this.toBinaryElements["denaryInput"].value);
        //console.log(denaryInput);

        const results = this.fpManager.denaryToBinary(denaryInput, mantissaSize, exponentSize);

        //Unpackage
        let positiveMantissa, negativeMantissa, unnormalisedHeadings, normalisedMantissa, normalisedHeadings, denaryExponent, exponentBinary, exponentHeadings;
        [positiveMantissa, negativeMantissa, unnormalisedHeadings, normalisedMantissa, normalisedHeadings, denaryExponent, exponentBinary, exponentHeadings] = results;

        console.log("H", unnormalisedHeadings);
        //Update elements on screen
        this.toBinaryElements["positiveMantissaTable"].update(positiveMantissa.length, 0, unnormalisedHeadings, positiveMantissa);
        if (negativeMantissa) {
            this.toBinaryElements["negativeMantissaTable"].show();
            this.toBinaryElements["negativeMantissaTable"].update(negativeMantissa.length, 0, unnormalisedHeadings, negativeMantissa)
        } else {
            this.toBinaryElements["negativeMantissaTable"].hide();
        }

        //console.log(normalisedHeadings);
        this.toBinaryElements["shiftedMantissaTable"].update(normalisedMantissa.length, 0, normalisedHeadings, normalisedMantissa);
        this.toBinaryElements["exponentResultText"].innerHTML = denaryExponent;
        
        this.toBinaryElements["exponentTable"].update(0, exponentBinary.length, exponentHeadings, exponentBinary);
        this.toBinaryElements["floatingPointTable"].update(normalisedMantissa.length, exponentBinary.length, null, normalisedMantissa.concat(exponentBinary));
    }
}


    /*displayFloatingPoint(binary, headings) {
        //If the number is positive, display only one table
        if (binary[0] == 0) {
            const drawnPositiveTable = document.getElementById("positiveMantissaTable");
            const positiveMantissaTable = new Table(drawnPositiveTable);
            positiveMantissaTable.generateTable(this.mantissaSize, 0, headings, binary);

            //Hide the negative table
            document.getElementById("negativeMantissaTable").style.display = "none";
        }

        //If the number is negative, display two tables - one for the positive representation and one for the negative number
        else {
            console.log("hello");
            const drawnPositiveTable = document.getElementById("positiveMantissaTable");
            const positiveMantissaTable = new Table(drawnPositiveTable);
            positiveMantissaTable.generateTable(this.mantissaSize, 0, headings, binary);

            //Display the negative table
            const drawnNegativeTable = document.getElementById("negativeMantissaTable");
            const negativeMantissaTable = new Table(drawnNegativeTable);
            negativeMantissaTable.generateTable(this.mantissaSize, 0, headings, this.negateTwosComplement(binary, headings));

            //Show the negative table
            document.getElementById("negativeMantissaTable").style.display = "block";
        }
    }*/