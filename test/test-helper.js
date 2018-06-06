process.env.NODE_ENV = 'test';
const { User } = require('../src/models/user.model');
const { Story } = require('../src/models/story.model');
require('../src/helpers/connectDatabase');

beforeEach('Remove database before each test case', async () => {
    await User.remove({});
    await Story.remove({});
});
