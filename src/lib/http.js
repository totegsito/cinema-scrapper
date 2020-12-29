const axios = require('axios');
const http = require("http");

module.exports = axios.create({
    headers: {
        // 'Content-Type': 'text/html',
        'Accept': '*/*'
    },
    // httpAgent: new http.Agent({ keepAlive: true })
})
