const axios = require('axios');
const fs = require('fs');

const sendData = async () => {
  try {
    // Read the file 'package.json'
    const fileContent = fs.readFileSync('package.json');

    // Convert file content to a Blob
    const fileBlob = new Blob([fileContent], { type: 'application/json' });

    // Construct form data with the file Blob
    const formData = new FormData();
    formData.append('file', fileBlob, 'package.json'); // Ensure the field name is 'file'

    // Make a POST request to upload the file
    const response = await axios.post('http://localhost:8080/api/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // Add any other headers if needed
      },
    });

    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

sendData();
