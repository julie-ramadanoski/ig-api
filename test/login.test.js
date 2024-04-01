import IG from '../src';

const account = {
  apiKey: process.env.IG_API_KEY,
  isDemo: !!process.env.IS_DEMO,
  username: process.env.IG_USERNAME,
  password: process.env.IG_PASSWORD,
};
test('login to account', async () => {
  expect.hasAssertions();
  try {
    const ig = new IG(account.apiKey, account.isDemo);
    const result = await ig.login(account.username, account.password);
    expect(result).toHaveProperty('oauthToken');
  } catch (error) {
    console.error(error);
  }
});

test('login failed trow execption', async () => {
  expect.hasAssertions();
  try {
    const ig = new IG(account.apiKey, account.isDemo);
    await ig.login('username', 'password');
  } catch (error) {
    expect(error).toHaveProperty('message');
  }
});

test('logout from account', async () => {
  expect.hasAssertions();
  try {
    const ig = new IG(account.apiKey, account.isDemo);
    await ig.login(account.username, account.password);
    const result = await ig.logout();
    expect(result).toBe('');
  } catch (error) {
    console.error(error);
  }
});
