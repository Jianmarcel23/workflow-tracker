const logger = {
    requestInfo: (req) => {
        console.log('\n=== Request Info ===');
        console.log('Method:', req.method);
        console.log('Path: ', req.path);
        console.log('Query Parameters: ', req.query);
        console.log('Request Body', req.body);
        console.log('===================\n');
        },

    databaseOperation:(operation, data) => {
        console.log(`\n=== Database Operation ===`);
        console.log('Operation: ', operation);
        console.log('Data: ', JSON.stringify(data, null, 2));
        console.log('========================\n');
        },
    
    error: (context, error) => {
        console.error('\n=== Error Occured ===');
        console.error('Context:', context);
        console.error('Error Message:', error.message);
        console.error('Stack', error.stack);
        console.error('====================\n');
    }
};
module.exports = logger;