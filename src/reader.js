
const Reader = class Reader {
    recipient
    message
    read(request) {
        const data = request.body.entry[0].messaging[0];
        this.recipient = data.sender.id;
        if (data.message.hasOwnProperty('quick_reply')) {
            this.message = data.message.quick_reply.payload
        } else {
            this.message = data.message.text;
        }

        return {
            message: this.message,
            recipient: this.recipient
        }
    }
}

module.exports = Reader;