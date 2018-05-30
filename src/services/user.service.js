const { hash, compare } = require('bcrypt');
const { User } = require('../models/user.model');
const { sign, verify } = require('../helpers/jwt');

class UserService {
    static async signUp(name, email, password) {
        const encrypted = await hash(password, 8);
        const user = new User({ name, email, password: encrypted });
        await user.save();
        user.password = undefined;
        return user;
    }

    static async signIn(email, password) {
        const user = await User.findOne({ email }).select('_id name email');
        if (!user) throw new Error('CANNOT_FIND_USER');
        const same = await compare(password, user.password);
        if (!same) throw new Error('CANNOT_FIND_USER');
        const token = await sign({ _id: user._id });
        const userInfo = user.toObject();
        userInfo.token = token;
        return userInfo;
    }

    static async checkToken(token) {
        const { _id } = await verify(token);
        const user = await User.findById(_id).select('_id name email');
        if (!user) throw new Error('CANNOT_FIND_USER');
        const newToken = await sign({ _id: user._id });
        const userInfo = user.toObject();
        userInfo.token = newToken;
        return userInfo;
    }
}

module.exports = { UserService };
