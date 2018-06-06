const { verify } = require('../helpers/jwt');

const mustBeUser = (req, res, next) => {
    verify(req.headers.token)
    .then(obj => {
        req.idUser = obj._id;
        next();
    })
    .catch(() => res.status(400).send({ success: false, message: 'INVALID_TOKEN' }))
};

module.exports = { mustBeUser };
