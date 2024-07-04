import IG from '../src';
import * as axiosModule from '../src/axios';

jest.mock('../src/axios', () => ({
  ...jest.requireActual('../src/axios'),
  setHeaderTokens: jest.fn(),
}));

describe('Login method', () => {
  test('flush headers tokens before call login with expired tokens', async () => {
    const ig = new IG('test_api_key', true);
    const loginResponse = {
      accountId: 'test_account',
      oauthToken: { access_token: 'test_token', token_type: 'Bearer' },
    };

    // Mock the post method to return the login response
    jest.spyOn(ig, 'post').mockResolvedValue(loginResponse);

    await ig.login('test_username', 'test_password');

    // First call with empty values
    expect(axiosModule.setHeaderTokens).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      {
        accountId: '',
        oauthToken: { access_token: '', token_type: '' },
      },
    );

    // Second call with login response
    expect(axiosModule.setHeaderTokens).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      loginResponse,
    );
  });
});
