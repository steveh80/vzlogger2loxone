const express = require('express');
const bodyParser = require('body-parser');
const Meter = require('./src/Meter');


const app = express();
app.use(bodyParser.json());

const options = {
    host: "192.168.1.202", // hostname or ip of miniserver
    channels: [
        {
            uuid: "57acbef0-88a9-11e4-934f-6b0f9ecd9180", // id of 1.8.0
            amountOfReadings: 5, // amount of readings to take into calculation of current consumption
            push: [
                {
                    port: 1180, // the udp port of the miniserver the messages should go to
                    type: 'abs' // push the absolute value of the channel
                },
                {
                    port: 1181,
                    type: 'avg' // current average consumption
                }
            ]
        },
        {
            uuid: "57acbef0-88a9-11e4-934f-6b0f9ecd9280", // id of 2.8.0
            amountOfReadings: 5, // amount of readings to take into calculation of current consumption
            push: [
                {
                    port: 1280,
                    type: 'abs'
                },
                {
                    port: 1281,
                    type: 'avg' // current average consumption
                }
            ]
        }
    ]
};

const meter = new Meter(options);

app.get('/', function (request, response) {
	response.send('vzlogger2loxone up and running!');
});

app.post('/', function (request, response) {
	request.body.data.forEach( function(message) {
        // console.log(message);
        meter.processMessage(message);
	});
});

app.listen(3000, function () {
  console.log('vzlogger2loxone listening on port 3000!');
});
