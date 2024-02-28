const axios = require('axios');
const fs = require('fs');

const sendData = async () => {
  try {
    const userObject = {
      cr: 'abcd',
      companyCr: 'abcd',
      name: 'abcd',
      id: 'abcd',
      address: 'abcd',
      contact: {
        person: 'abcd',
        number: 'abcd'
      },
      attachment: 'abcd',
      contracts: []
    };

    const requestBody = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWQzOWZiMTE5MzBhMzZjNTUyMWVjM2MiLCJ1c2VybmFtZSI6ImF0ZWVidGhlcHJvIiwicGFzc3dvcmQiOiJNaW5lY3JhZnRnbzA5MjEiLCJpYXQiOjE3MDg1NDUxMjd9.jZejnij9dwKMf-hRcDKhIhoTXlQ2U05M7N-uYGtwxHo',
      client: userObject
    };

    const response = await axios.post('http://localhost:8080/api/clients/create', requestBody, {
      headers: {
        'Content-Type': 'application/json', // Change content type if needed
        // Add any other headers if needed
      },
    });

    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

sendData();
