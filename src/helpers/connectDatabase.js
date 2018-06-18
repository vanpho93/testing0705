const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

function getDatabaseUri() {
    if (process.env.NODE_ENV === 'production') return 'mongodb://admin:abcd123@ds261440.mlab.com:61440/mean0705';
    if (process.env.NODE_ENV === 'test') return 'mongodb://localhost/mean0705x-test';
    return 'mongodb://localhost/mean0705x';
}

mongoose.connect(getDatabaseUri(), { useMongoClient: true })
.then(() => console.log('Database connect'))
.catch(error => {
    console.log('Cannot connect database', error);
    process.exit(1);
});
