const { User } = require('../models/user.model');
const { ServerError, exist } = require('../models/server-error.model');
const { checkObjectId } = require('../helpers/checkObjectId');

class FriendService {
    static async addFriend(idUser, idOther) {
        checkObjectId(idOther);
        if (idUser === idOther) {
            throw new ServerError('CANNOT_ADD_YOURSELF', 400);
        }
        const queryObjectUser = {
            _id: idUser,
            sentRequests: { $ne: idOther },
            friends: { $ne: idOther },
            incommingRequests: { $ne: idOther }
        }
        const updateObjectUser = { $push: { sentRequests: idOther } };
        const user = await User.findOneAndUpdate(queryObjectUser, updateObjectUser);
        exist(user, 'CANNOT_FIND_USER', 404);
        const queryObjectOther = {
            _id: idOther,
            sentRequests: { $ne: idUser },
            friends: { $ne: idUser },
            incommingRequests: { $ne: idUser }
        };
        const updateObjectOther = { $push: { incommingRequests: idUser } };
        const other = await User.findOneAndUpdate(queryObjectOther, updateObjectOther, { select: 'name email avatar' });
        exist(other, 'CANNOT_FIND_USER', 404);
        return other;
    }
    static async cancelRequest(idUser, idOther) {
        checkObjectId(idOther);
        if (idUser === idOther) {
            throw new ServerError('CANNOT_ADD_YOURSELF', 400);
        }
        const queryObjectUser = {
            _id: idUser,
            sentRequests: idOther,
            friends: { $ne: idOther },
            incommingRequests: { $ne: idOther }
        }
        const updateObjectUser = { $pull: { sentRequests: idOther } };
        const user = await User.findOneAndUpdate(queryObjectUser, updateObjectUser);
        exist(user, 'CANNOT_FIND_USER', 404);
        const queryObjectOther = {
            _id: idOther,
            sentRequests: { $ne: idUser },
            friends: { $ne: idUser },
            incommingRequests: idUser
        };
        const updateObjectOther = { $pull: { incommingRequests: idUser } };
        const other = await User.findOneAndUpdate(queryObjectOther, updateObjectOther, { select: 'name email avatar' });
        exist(other, 'CANNOT_FIND_USER', 404);
        return other;
    }
    static async acceptRequest(idUser, idOther) {
        checkObjectId(idOther);
        if (idUser === idOther) {
            throw new ServerError('CANNOT_ADD_YOURSELF', 400);
        }
        const queryObjectUser = {
            _id: idUser,
            sentRequests: { $ne: idOther },
            friends: { $ne: idOther },
            incommingRequests: idOther
        }
        const updateObjectUser = {
            $push: { friends: idOther },
            $pull: { incommingRequests: idOther }
        };
        const user = await User.findOneAndUpdate(queryObjectUser, updateObjectUser);
        exist(user, 'CANNOT_FIND_USER', 404);
        const queryObjectOther = {
            _id: idOther,
            sentRequests: idUser,
            friends: { $ne: idUser },
            incommingRequests: { $ne: idUser }
        };
        const updateObjectOther = {
            $pull: { sentRequests: idUser },
            $push: { friends: idUser },
        };
        const other = await User.findOneAndUpdate(queryObjectOther, updateObjectOther, { select: 'name email avatar' });
        exist(other, 'CANNOT_FIND_USER', 404);
        return other;
    }
    static async declineRequest(idUser, idOther) {
        checkObjectId(idOther);
        if (idUser === idOther) {
            throw new ServerError('CANNOT_ADD_YOURSELF', 400);
        }
        const queryObjectUser = {
            _id: idUser,
            sentRequests: { $ne: idOther },
            friends: { $ne: idOther },
            incommingRequests: idOther
        }
        const updateObjectUser = {
            $pull: { incommingRequests: idOther }
        };
        const user = await User.findOneAndUpdate(queryObjectUser, updateObjectUser);
        exist(user, 'CANNOT_FIND_USER', 404);
        const queryObjectOther = {
            _id: idOther,
            sentRequests: idUser,
            friends: { $ne: idUser },
            incommingRequests: { $ne: idUser }
        };
        const updateObjectOther = {
            $pull: { sentRequests: idUser },
        };
        const other = await User.findOneAndUpdate(queryObjectOther, updateObjectOther, { select: 'name email avatar' });
        exist(other, 'CANNOT_FIND_USER', 404);
        return other;
    }
    static async removeFriend(idUser, idOther) {
        checkObjectId(idOther);
        if (idUser === idOther) {
            throw new ServerError('CANNOT_ADD_YOURSELF', 400);
        }
        const queryObjectUser = {
            _id: idUser,
            sentRequests: { $ne: idOther },
            friends: idOther,
            incommingRequests: { $ne: idOther }
        }
        const updateObjectUser = {
            $pull: { friends: idOther }
        };
        const user = await User.findOneAndUpdate(queryObjectUser, updateObjectUser);
        exist(user, 'CANNOT_FIND_USER', 404);
        const queryObjectOther = {
            _id: idOther,
            sentRequests: { $ne: idUser },
            friends: idUser,
            incommingRequests: { $ne: idUser }
        };
        const updateObjectOther = {
            $pull: { friends: idUser },
        };
        const other = await User.findOneAndUpdate(queryObjectOther, updateObjectOther, { select: 'name email avatar' });
        exist(other, 'CANNOT_FIND_USER', 404);
        return other;
    }
}

module.exports = { FriendService };
