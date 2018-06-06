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

    static async removeStory(idUser, idStory) {
        const story = await Story.findOneAndRemove({ _id: idStory, author: idUser });
        exist(story, 'CANNOT_FIND_STORY', 404);
        return story;
    }

    static async updateStory(idUser, idStory, content) {
        exist(content, 'EMPTY_CONTENT', 400);
        const query = { _id: idStory, author: idUser };
        const story = await Story.findOneAndUpdate(query, { content }, { new: true });
        exist(story, 'CANNOT_FIND_STORY', 404);
        return story;
    }
}

module.exports = { StoryService };
