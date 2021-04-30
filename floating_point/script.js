function convertBinaryToDenary() {
    //Hide the div used for showing the steps and result
    document.getElementById("resultDiv").style.display = "none";
    displayManager.displayBinaryToDenary();
    //Show the div used for showing the steps and result
    document.getElementById("resultDiv").style.display = "block";
}

function convertDenaryToBinary() {
    //Clear error text
    document.getElementById("errorText").innerHTML = "";

    //Get the size of the mantissa and exponent
    let mantissaSize, exponentSize;
    if (document.getElementById("smallerSize").checked) {
        mantissaSize = 5;
        exponentSize = 3;
    } else {
        mantissaSize = 8;
        exponentSize = 4;
    }

    try {
        //Hide the div used for showing the steps and result
        document.getElementById("resultDiv").style.display = "none";
        displayManager.displayDenaryToBinary(mantissaSize, exponentSize);
        //Show the div used for showing the steps and result
        document.getElementById("resultDiv").style.display = "block";
    } catch (e) {
        document.getElementById("errorText").innerHTML = e.message;
    }
    
    
}