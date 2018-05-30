const { hash, compare } = require('bcrypt');
const { User } = require('../models/user.model');

class UserService {
    static async signUp(name, email, password) {
        const encrypted = await hash(password, 8);
        const user = new User({ name, email, password: encrypted });
        await user.save();
        return user;
    }

    static async signIn(email, password) {
        const user = await User.findOne({ email });
        if (!user) throw new Error('CANNOT_FIND_USER');
        const same = await compare(password, user.password);
        if (!same) throw new Error('CANNOT_FIND_USER');
        return user;
    }
}

module.exports = { UserService };
