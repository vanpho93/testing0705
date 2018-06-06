const { User } = require('../models/user.model');
const { Story } = require('../models/story.model');
const { ServerError, exist } = require('../models/server-error.model');

class StoryService {
    static async createStory(idUser, content) {
        exist(content, 'EMPTY_CONTENT', 400);
        const story = new Story({ content, author: idUser });
        await story.save();
        return story;
    }
}

module.exports = { StoryService };
