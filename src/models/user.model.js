const mongoose = require('mongoose');
const faker = require('faker');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    avatar: { type: String, required: true, trim: true, default: faker.image.avatar },
    stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    incommingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const User = mongoose.model('User', userSchema);

module.exports = { User };
