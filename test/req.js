const axios = require('axios');

const sendData = async () => {
  try {
    const response = await axios.post('http://localhost:8080/api/companies/delete', {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWQzOWZiMTE5MzBhMzZjNTUyMWVjM2MiLCJ1c2VybmFtZSI6ImF0ZWVidGhlcHJvIiwicGFzc3dvcmQiOiJNaW5lY3JhZnRnbzA5MjEiLCJpYXQiOjE3MDg0Mjc0NjF9.mU9oF2N9cPGnLlTC2XbrRurKdudRp7Vg7si3-6C7ULg',
      cr: "a",
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

sendData();
