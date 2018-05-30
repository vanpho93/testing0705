const jwt = require('jsonwebtoken');

const SECRET_KEY = 'ai3q08feqdcjc34qe';

function sign(obj) {
    return new Promise((resolve, reject) => {
        jwt.sign(obj, SECRET_KEY, { expiresIn: '10d' }, (error, token) => {
            if (error) return reject(error);
            resolve(token);
        });
    });
}

function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, (error, obj) => {
            if (error) return reject(error);
            delete obj.iat;
            delete obj.exp;
            resolve(obj);
        });
    });
}

module.exports = { sign, verify };

// sign({ _id: 'abcd' })
// .then(token => console.log(token));

// verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiJhYmNkIiwiaWF0IjoxNTI3Njg3OTY0LCJleHAiOjE1Mjg1NTE5NjR9.4YkyLHWh3gYFMEvVB50WJDUcNqpua-P1N2LSh_WzPiE')
// .then(obj => console.log(obj));
