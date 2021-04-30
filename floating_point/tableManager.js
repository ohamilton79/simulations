class Table {
    constructor(tableId, editable=false) {
        this.table = document.getElementById(tableId);

        this.editable = editable;
        this.headings = [];
        this.bits = [];
    }

    getBit(index) {
        const classQuery = "bitElement" + (index + 1).toString();
        return this.table.querySelector(`.${classQuery}`).innerHTML;
    }

    setBit(index, value) {
        const classQuery = "bitElement" + (index + 1).toString();
        this.table.querySelector(`.${classQuery}`).innerHTML = value;
    }

    //Get the binary representation of the mantissa
    getMantissa(mantissaSize) {
        const mantissaElementsArray = this.bits.slice(0, mantissaSize);
        const mantissaArray = mantissaElementsArray.map((value) => value.innerHTML);
        return mantissaArray;
    }

    //Get the binary representation of the exponent
    getExponent(exponentSize) {
        const exponentElementsArray = this.bits.slice((this.bits.length) - exponentSize, this.bits.length);
        const exponentArray = exponentElementsArray.map((value) => value.innerHTML);
        return exponentArray;
    }

    //Get the headings for the mantissa portion of the floating point number
    getMantissaHeadings(mantissaSize) {
        const mantissaHeadings = this.headings.slice(0, mantissaSize);
        //const mantissaHeadings = mantissaHeadingsElements.map((value) => value.innerHTML);
        return mantissaHeadings;
    }

    //Get the headings for the exponent portion of the floating point number
    getExponentHeadings(exponentSize) {
        //console.log(this.headings);
        const exponentHeadings = this.headings.slice((this.bits.length - exponentSize), this.bits.length);
        //const exponentHeadings = exponentHeadingsElements.map((value) => value.innerHTML);
        return exponentHeadings;
    }

    //Get the mantissa, exponent and matching headings packaged together
    /*getTableDetails() {
        return [this.getMantissa(), this.getExponent(), this.getMantissaHeadings()]
    }*/

    toggleBit(event) {
        //Get index of button sender
        const buttonIndex = this.bits.indexOf(event.currentTarget);
        //Flip bit of button sender
        this.setBit(buttonIndex, this.flipBit(this.getBit(buttonIndex)))

        /*If the clicked button is the first (MSB), the 2nd button value must be toggled as well
        (so that the number is normalised)
        */
        if (buttonIndex == 0) {
            const newBitValue =  this.flipBit(this.getBit(1));
            this.setBit(1, newBitValue);
        }

    /*If button id ends in a 2, the 1st button value must be toggled as well
        (so that the number is normalised)
        */
        else if (buttonIndex == 1) {
            const newBitValue =  this.flipBit(this.getBit(0));
            this.setBit(0, newBitValue);
        }
    }

    flipBit(inputBit) {
        return ((inputBit == "1") ? "0" : "1");
    }

    update(mantissaSize, exponentSize, headingValues=null, cellValues=null) {
        //Clear any rows if they already exist
        this.deleteRows();

        //Create table headings
        this.generateTableHead(this.table, mantissaSize, exponentSize, headingValues);

        //Create row where data can be entered
        let tbody = this.table.createTBody();
        let row = tbody.insertRow();

        //Create data input cells
        this.generateTableCells(row, mantissaSize + exponentSize, cellValues);
    
        /*shiftedNumberHeading = document.createElement("h2");
        shiftedNumberHeading.innerHTML = "Mantissa shifted by exponent";*/
    }

    generateTableCells(row, c, cellValues) {
        //Clear any previously stored values
        this.bits = [];
        //Add new cells and text inputs for each column in the table
        for (let i=1; i <= c; i++) {
            let td = document.createElement("td");
            let bitElement;
            //If the table is editable, the bit element should be a button
            if (this.editable) {
                bitElement = document.createElement("button");
                //Add event handler for when button clicked - bind current context so class methods can be called
                bitElement.onclick = this.toggleBit.bind(this);

            //Otherwise, the bit element should be a text element
            } else {
                bitElement = document.createElement("p");
            }

            if (cellValues != null) {
                bitElement.innerHTML = cellValues[i-1];
            
            } else {
                //Default value of bit is 1 if MSB (most significant bit), else 0
                bitElement.innerHTML = i==1 ? "1" : "0";
            }
            bitElement.className = "bitElement" + i.toString();

            //Append bit element to list attribute
            this.bits.push(bitElement);

            //Add elements to table row
            td.appendChild(bitElement);
            row.appendChild(td);
        }
    }

    generateTableHead(table, n, m, headingValues) {
        //Clear any previously stored values
        this.headings = [];
        //Setup row
        let thead = table.createTHead();
        let row = thead.insertRow();

        if (headingValues != null) {
            this.generateColumns(row, headingValues.length, Math.abs(headingValues[0]));
        } else {
            //Generate different numbers of columns for the mantissa and exponent
            this.generateColumns(row, n, 1);     //Mantissa starts with place value of -1
            this.generateColumns(row, m);
        }
    }

    generateColumns(row, c, startValue=null) {
        //Add column headings, starting at -2^(c-1) by default
        let sign = true;
        let absPlaceValue = startValue ?? 2 ** (c-1);

        //Create the requested number of columns
        for (let i=0; i < c; i++) {
            //Add a new table heading
            let th = document.createElement("th");
            //Generate place value with sign
            let placeValue = sign ? -1 * absPlaceValue : absPlaceValue;

            //Update sign
            if (sign) {
                sign = false;
            }
            //Add decimal representation of place value to list attribute
            this.headings.push(placeValue);

            //Generate text to add to table header
            let text = document.createTextNode(this.getColumnText(placeValue));
        
            //Add to HTML document
            th.appendChild(text);
            row.appendChild(th);

            //Update place value
            absPlaceValue = absPlaceValue / 2;
        }
    }

    getColumnText(placeValue) {
        //If the absolute value of the place value is greater than or equal to 1, return the string representation
        if (Math.abs(placeValue) >= 1) {
            return placeValue.toString();

        //If the place value is less than 1, get the reciprocal and return as a fraction
        } else {
            const reciprocal = 1 / placeValue;
            const sign = reciprocal > 0 ? "" : "-";
            return sign + "1/" + Math.abs(reciprocal).toString();
        }
    }

    //Clear any rows by deleting the tbody and thead
    deleteRows() {
        //If there is a tbody to delete
        if (this.table.tBodies.length > 0) {
            //Get the current table bodies and heads and remove them
            const currenTbody = this.table.tBodies[0];

            this.table.deleteTHead();
            this.table.removeChild(currenTbody);
        }
    }

    //Show the HTML table object
    show() {
        this.table.style.display = "table";
    }

    //Hide the HTML table object
    hide() {
        this.table.style.display = "none";
    }

}