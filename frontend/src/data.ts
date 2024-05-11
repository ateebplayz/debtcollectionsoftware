export const logoUri = 'https://i.imgur.com/cYK7U1B.png'
export const serverUri = 'http://localhost:9091'

export function generateCustomString(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
  
    for (let i = 0; i < 21; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  
    return result;
  }
export function getFormattedDate() {
  // Create a new Date object
  let currentDate = new Date();

  // Define an array to map day numbers to their string representation
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Extract day, month, and year components
  let dayOfWeek = daysOfWeek[currentDate.getDay()];
  let day: number = currentDate.getDate();
  let month: number = currentDate.getMonth() + 1; // Months are zero-indexed, so we add 1
  let year: number = currentDate.getFullYear();

  // Format day and month to have leading zeros if needed
  let formattedDay: string = (day < 10) ? '0' + day : String(day);
  let formattedMonth: string = (month < 10) ? '0' + month : String(month);

  // Construct the date string in the format you want
  let formattedDate = dayOfWeek + ', ' + formattedDay + '/' + formattedMonth + '/' + year;

  return formattedDate;
}