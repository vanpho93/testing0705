const mongoose = require('mongoose');
const faker = require('faker');

const storyScheme = new mongoose.Schema({
    content: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Story = mongoose.model('Story', storyScheme);

module.exports = { Story };
