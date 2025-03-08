const { get } = require('https');
const axios = require("axios");

require('dotenv').config();

doCheck();

setInterval(() => {
    doCheck();
}, 3600 * 1000);


function doCheck() {

    let dateTime = new Date();

    // Format time as HH:mm:ss in Dubai time zone
    let time = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Dubai",
        hour12: false,
    }).format(dateTime);

    // Format date as DD Mon YYYY in Dubai time zone and remove comma
    let date = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Dubai",
    }).format(dateTime).replace(",", ""); // Removes the comma, if present

    get(process.env.SERVER_ENDPOINT || "", ({ statusCode: sCode }) => {
        if (sCode !== 200) {
            let message = `${process.env.WHATSAPP_MESSAGE} at ${time} ${date}`;
            console.log(message);
            notifyByWhatsapp(process.env.RECIPIENT || "", message)
        } else {
            notifyByWhatsapp(process.env.RECIPIENT || "", `Community Server is online 👍`)
        }
    }).on('error', (err) => {
        console.error(`Error: ${err.message}`);
    });
}

async function notifyByWhatsapp(recipient, message) {
    let payload = {
        clientId: process.env.CLIENT_ID || "_1",
        recipient: recipient,
        text: message
    };

    try {
        let { data } = await axios.post(process.env.WHATSAPP_ENDPOINT, payload)
        console.log(data);
    } catch ({ request, response, message }) {

        if (response) {
            console.log(response.data);
        } else if (request) {
            console.log("No response received:", request);
        } else {
            console.log("Exception:", message);
        }
    }
}
