const Numbers = require("../models/Numbers");


const CheckNumber = async (req, res, next) => {
    const { number } = req.body;
console.log("num",number)
    try {
        // Search for the number in the database
        const numberRecord = await Numbers.findOne({ number: number });

        // Check if the number was found
        if (numberRecord) {
            // Check if the number has already been minted
            if (numberRecord.minted) {
                res.status(200).json({ message: "Number has already been minted." });
            } else {
                res.status(201).json({ message: "Number is available for minting." });
            }
        } else {
            res.status(203).json({ message: "Number does not exist in the database." });
        }
    } catch (error) {
        console.error("Database query failed:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const SetMinted = async (req, res, next) => {
    const { number } = req.body;

    console.log(number)
    try {

        const numberRecorddb = await Numbers.findOne({ number: number });

        if(numberRecorddb){
            res.status(201).json({ message: "Number has been set as minted." });
return;
        }

else{
          // Create a new number record in the database
          const numberRecord = new Numbers({ number: number, minted: true });
          await numberRecord.save();
          res.status(200).json({ message: "Number has been set as minted." });
}
    } catch (error) {
        console.error("Database query failed:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const generateSimilarNumbers = async (originalNumber) => {
    let similarNumbers = [];
  
    // Convert the number to a string to access each digit
    let numberStr = originalNumber.toString();
    
    // Only proceed if the number is a 5-digit number
    if (numberStr.length !== 5) {
      throw new Error("The number must be a 5-digit number.");
    }
  
    // Generate similar numbers by incrementing each digit by 1 (except if the digit is 9)
    for (let i = 0; i < numberStr.length; i++) {
      // Only increment if digit is less than 9
      if (numberStr[i] !== '9') {
        // Generate a new number by incrementing the current digit
        let newNumberStr = 
          numberStr.substring(0, i) + 
          (parseInt(numberStr[i], 10) + 1) + 
          numberStr.substring(i + 1);
  
        similarNumbers.push(parseInt(newNumberStr, 10));
      }
    }
  
    // Filter out numbers that already exist in the database
    const uniqueSimilarNumbers = [];
    for (let num of similarNumbers) {
      // Check if this number is in the database
      const exists = await Numbers.findOne({ number: num.toString() });
      if (!exists) {
        uniqueSimilarNumbers.push(num);
      }
    }
  
    return uniqueSimilarNumbers;
  };


//   router.post('/generate-similar-numbers', async (req, res) => {
  
//   });


  const GenerateNumbers = async (req, res, next) => {

    const { number } = req.body;

    console.log("num",number)

    try {
        const originalNumber = number;
        const similarNumbers = await generateSimilarNumbers(originalNumber);
        res.status(200).json({ similarNumbers });
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
};

module.exports = {CheckNumber, GenerateNumbers,SetMinted}