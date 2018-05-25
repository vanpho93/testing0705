const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/mean0705x', { useMongoClient: true })
.then(() => console.log('Database connect'))
.catch(error => {
    console.log('Cannot connect database', error);
    process.exit(1);
});
