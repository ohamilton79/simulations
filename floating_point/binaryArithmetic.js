class BinaryArithmeticManager {
    //Convert an integer - positive or negative - to two's complement
    intToTwosComplement(num, size, integerSize=null, fractionSize=null) {
        //Define parameters for representation in two's complement
        /*if (!integerSize || !fractionSize) {
            integerSize = Math.floor(size / 2);
            fractionSize = size - integerSize;
        }*/
        console.log("N", num);
        if (integerSize == null || fractionSize == null) {
            //If the number is greater than or equal to 1
            if (num >= 1) {
                integerSize = Math.floor(Math.log2(num)) + 2;
            
            //If the number is between 1 and -1
            } else if (num > -1 && num < 1) {
                //Only keep the initial -1
                integerSize = 1;

            //If the number is less than -1
            } else {
                integerSize = Math.floor(Math.log2(-1 * num)) + 2;
                console.log("HELLO");
            }

            fractionSize = size - integerSize;
            console.log(integerSize, fractionSize);
            console.log(Math.floor(Math.log2(8)));
        }
        
        //If the number is positive, use the positiveToTwosComplement() function
        if (num >= 0) {
            return this.positiveToTwosComplement(num, integerSize, fractionSize);

        //If the number is negative, get the positive representation and negate it
        } else {
            
            const tempResult = this.positiveToTwosComplement(-1 * num, integerSize, fractionSize);
            const positiveMantissa = tempResult[0];
            const headings = tempResult[1];
            const negativeMantissa = this.negateTwosComplement(positiveMantissa, headings);
            //console.log("B", positiveMantissa, negativeMantissa);
            return [negativeMantissa, headings];
        }
    }

    //Convert a positive denary number to two's complement, where the binary point is in the centre
    positiveToTwosComplement(denaryNum, integerSize, fractionSize) {
        console.log("New conversion: ", denaryNum, " of size ", integerSize, " and fraction size ", fractionSize);
        let target = denaryNum;
        /*let bits = [];
        let headings = []*/
        //First bit value is zero
        let bits = [0];
        //The leading heading is -2^(integerSize - 1)
        let headings = [-1 * 2 ** (integerSize - 1)];
        
        let currentHeading = 2 ** (integerSize - 2);

        //Add remaining bits
        while (bits.length < (integerSize + fractionSize)) {
            if (currentHeading <= target) {
                //Update target
                target = target - currentHeading;
                console.log("New target: ", target);
                //Update bits
                bits.push(1);
                

            //Update bits
            } else {
                bits.push(0);
            }

            //Update headings
            headings.push(currentHeading);
            currentHeading /= 2;    
        }
        
        //Remove any excess zeros
        let index = bits.length - 1;
        while (bits[index] == 0 && index >= (integerSize)) {
            bits.pop();
            headings.pop();
            index -= 1;
        }
        //If the number couldn't be represented entirely accurately
        if (target != 0) {
            throw new Error(`The denary number entered is outside the range of values that can be accurately represented. Error of ${target}`);
        }
        console.log(bits, headings);
        //Return the bits and headings
        return [bits, headings];
    }

    //Convert a positive number represented in two's complement to its negative, or vice versa
    negateTwosComplement(bits, headings) {
        let negatedBits = [];
        let currentIndex = bits.length - 1;
        let flipFlag = false;

        //console.log("A", bits);

        while (currentIndex >= 0) {
            //Flip the bits after the first 1
            if (!flipFlag && bits[currentIndex] == 1) {
                flipFlag = true;
                negatedBits.unshift(bits[currentIndex]);
            
            //If the flip flag is set, flip the bit
            } else if (flipFlag) {
                negatedBits.unshift((bits[currentIndex] == 1) ? 0 : 1);

            } else {
                negatedBits.unshift(bits[currentIndex]);
            }

            //console.log(flipFlag);

            currentIndex -= 1;
        }
        //Return the updated bits
        //console.log("N", bits);
        console.log(negatedBits, headings);
        return negatedBits;
    }
}