const express = require('express');
const bodyParser = require('body-parser');
const dgram = require('dgram');

const app = express();
app.use(bodyParser.json());

const miniserverIp = "192.168.1.202";

const channelMapping = {
	"57acbef0-88a9-11e4-934f-6b0f9ecd9180": {
		"targetPort": 1180
	},
	"57acbef0-88a9-11e4-934f-6b0f9ecd9280": {
		"targetPort": 1280
	}
};


app.get('/', function (request, response) {
	response.send('vzlogger2loxone up and running!');
});

app.post('/', function (request, response) {
    // console.log(request.body);
	request.body.data.forEach( function(message) {

		if (channelMapping.hasOwnProperty(message.uuid)) {
			const lastTuple = message.tuples[message.tuples.length-1];
			const lastValue = lastTuple[lastTuple.length-1];

			const port = channelMapping[message.uuid].targetPort;

			console.log(port, lastValue);

			const udpMessage = Buffer.from(lastValue.toString());
			const client = dgram.createSocket('udp4');
			client.send(udpMessage, port, miniserverIp, (err) => {
				console.log(err);
				client.close();
			});
		}
	})

});


app.listen(3000, function () {
  console.log('vzlogger2loxone listening on port 3000!');
});
