const Channel = require('./Channel');

module.exports = class Meter {
    constructor(options) {
        this.options = options;
        this.channels = {};

        this.setupChannels(this.options.channels);
    }

    setupChannels(channels) {
        const that = this;
        channels.forEach( (channelOptions) => {
            channelOptions.host = that.options.host;
            that.channels[channelOptions.uuid] = new Channel(channelOptions);
        });
    }

    processMessage(message) {
        if (this.channels.hasOwnProperty(message.uuid)) {
            // extract data from the vzlogger message
            const lastTuple = message.tuples[message.tuples.length-1];

            const reading = {
                timestamp: lastTuple[0],
                value: lastTuple[1]
            };

            this.channels[message.uuid].addReading(reading);
        }
    }
};
