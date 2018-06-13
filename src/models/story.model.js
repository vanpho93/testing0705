const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    content: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    fans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Story = mongoose.model('Story', storySchema);

module.exports = { Story };
