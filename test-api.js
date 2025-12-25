const axios = require('axios');

const API_URL = 'https://api.sofia-sahara.com/api/v1';

async function testLogin() {
    try {
        console.log('Testing POST to ' + API_URL + '/auth/guardian');
        const response = await axios.post(API_URL + '/auth/guardian', {
            cin: 'test',
            password: 'test',
            firebase_token: 'test'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
    } catch (error) {
        if (error.response) {
            console.log('Error status:', error.response.status);
            console.log('Error data:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    }
}

testLogin();
