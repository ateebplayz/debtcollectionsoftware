export function generateTenDigitString() {
    const randomNumber = () => Math.floor(Math.random() * 10); // Generate a random number between 0 and 9
    const randomNumberString = () => String(randomNumber()); // Convert random number to string
    
    // Generate the string in the format 'XX-XXX-XXX'
    const tenDigitString = `${randomNumberString()}${randomNumberString()}-` + 
                           `${randomNumberString()}${randomNumberString()}${randomNumberString()}-` +
                           `${randomNumberString()}${randomNumberString()}${randomNumberString()}`;
  
    return tenDigitString;
  }