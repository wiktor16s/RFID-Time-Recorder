class ErrorHandler {
    constructor() {}

    init(){
        process.on('uncaughtException', (error) => {
            console.error(`uncaughtException ${error.message}`);
        });
        
        process.on('unhandledRejection', (reason) => {
            console.error(`unhandledRejection ${reason}`);
        });
    }
}


module.exports = new ErrorHandler();