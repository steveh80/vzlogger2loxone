const dgram = require('dgram');

module.exports = class Channel {

    constructor(options) {
        this.uuid = options.uuid;
        this.options = options;
        this.readings = [];
    }

    /**
     * gets readings of timestamp and absolute value of meter
     * @param reading
     */
    addReading(reading) {
        // add reading to internal reading memory
        this.readings.push(reading);
        if ( this.readings.length > this.options.amountOfReadings ) {
            this.readings = this.readings.slice(this.options.amountOfReadings * -1);
        }

        // process configured push channels
        this.options.push.forEach( (target) => {

            if (target.type == 'abs') {
                this.notifyMiniserver(target.port, reading.value);
            }

            if (target.type == 'avg') {
                this.notifyMiniserver(target.port, this.getCurrentWattage());
            }
        });
    }

    notifyMiniserver(port, value) {
        console.log('sending message to port', port, 'content:', value);

        const message = Buffer.from(value.toString());

        const client = dgram.createSocket('udp4');
        client.send(message, port, this.options.host, (err) => {
            client.close();
        });
    }

    /**
     * returns current wattage, calculated from last x meter readings (configurable in options)
     */
    getCurrentWattage() {
        let avgConsumption = 0;

        if (this.readings.length > 1) {
            const first = this.readings[0];
            const last = this.readings[this.readings.length-1];

            const kWh = last.value - first.value; // consumption between first and last reading
            const Wh = kWh * 1000;
            const Ws = Wh * 3600; // watt seconds

            const timeGap = (last.timestamp - first.timestamp) / 1000; // in seconds

            avgConsumption = Ws/timeGap;
            avgConsumption = avgConsumption / 1000; // kW
        }

        return avgConsumption;
    }
};
