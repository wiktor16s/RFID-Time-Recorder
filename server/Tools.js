class Tools {
    constructor() {
        this.rfidChild = null;
        this.clientChild = null;
    }

    cleanup() {
        let callback = this.cleaner;


        process.on('exit', function () {
            callback();
        });

        process.on('SIGINT', function () {
            console.log('Ctrl-C...');
            callback();
            process.exit(2);
        });

        process.on('uncaughtException', function (e) {
            console.log('Uncaught Exception...');
            console.log(e.stack);
        })
    }

    cleaner() {
        console.log("THIS IS A CLEANER CALLBACK");
    }
}

module.exports = new Tools();