const { User } = require('../models/user.model');
const { Story } = require('../models/story.model');
const { Comment } = require('../models/comment.model');
const { exist } = require('../models/server-error.model');
const { checkObjectId } = require('../helpers/checkObjectId');

class CommentService {
    static async createComment(idUser, idStory, content) {
        checkObjectId(idStory);
        exist(content, 'EMPTY_CONTENT', 400);
        const comment = new Comment({ content, story: idStory, author: idUser });
        const updateObject = { $push: { comments: comment._id } };
        const story = await Story.findByIdAndUpdate(idStory, updateObject);
        exist(story, 'CANNOT_FIND_STORY', 404);
        await comment.save();
        return comment;
    }

    static async removeComment(idUser, idComment) {
        checkObjectId(idComment);
        const queryObject = { author: idUser, _id: idComment};
        const comment = await Comment.findOneAndRemove(queryObject);
        exist(comment, 'CANNOT_FIND_COMMENT', 404);
        const updateObject = { $pull: { comments: comment._id } };
        await Story.findByIdAndUpdate(comment.story, updateObject);
        return comment;
    }

    static async updateComment(idUser, idComment, content) {
        checkObjectId(idComment);
        exist(content, 'EMPTY_CONTENT', 400);
        const queryObject = { author: idUser, _id: idComment};
        const comment = await Comment.findOneAndUpdate(queryObject, { content }, { new: true });
        exist(comment, 'CANNOT_FIND_COMMENT', 404);
        return comment;
    }
}

module.exports = { CommentService };
