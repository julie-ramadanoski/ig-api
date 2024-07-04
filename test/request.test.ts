import IG from '../src';

const account = {
  apiKey: process.env.IG_API_KEY || '',
  isDemo: !!process.env.IS_DEMO,
  username: process.env.IG_USERNAME || '',
  password: process.env.IG_PASSWORD || '',
};

const PREFIX = 'ig api';
const EPIC_1 = 'CS.D.USDJPY.MINI.IP';
const EPIC_2 = 'CS.D.NZDJPY.MINI.IP';

const ig: IG = new IG(account.apiKey, account.isDemo);

const uniqueId = (
  length = 15,
  chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
): string =>
  Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');

const uniqueName = (): string => `${PREFIX} ${uniqueId(5)}`;

const createWatchlist = (): Promise<any> => {
  const fakeName = uniqueName();
  return ig.post('watchlists', 1, {
    name: fakeName,
    epics: [EPIC_1],
  });
};

const getWatchlists = (watchlistId: string): Promise<any> =>
  ig.get(`watchlists/${watchlistId}`, 1, {});
const updateWatchlist = (watchlistId: string, epic: string): Promise<any> =>
  ig.put(`watchlists/${watchlistId}`, 1, { epic });

const deleteWatchlist = (watchlistId: string): Promise<any> =>
  ig.delete(`watchlists/${watchlistId}`, 1, {});

const deleteWatchlists = (watchlists: any[]): Promise<any>[] =>
  watchlists.map((watchlist) => deleteWatchlist(watchlist.id));

const filterWatchlists = (watchlists: any[]): any[] =>
  watchlists.filter((watchlist) => watchlist.name.includes(PREFIX));

beforeAll(async () => {
  try {
    await ig.login(account.username, account.password);
  } catch (error) {
    console.error(error);
  }
});

interface IWatchList {
  watchlistId: string;
  name: string;
  epics: string[];
  activities: any[];
}

afterAll(async () => {
  try {
    const response = await ig.get('watchlists', 1, {});
    const watchLists: IWatchList[] = response.watchlists || [];
    const testWatchLists = filterWatchlists(watchLists);
    const promises = deleteWatchlists(testWatchLists);
    await Promise.all(promises);
  } catch (error: any) {
    console.error(error);
  }
});

test('get activity with query (get)', async () => {
  expect.hasAssertions();
  try {
    const result = await ig.get('history/activity', 3, { from: '2017-09-01' });
    expect(result).toHaveProperty('activities');
  } catch (error) {
    console.error(error);
  }
});

test('create watchlist (post)', async () => {
  expect.hasAssertions();
  try {
    const result = await createWatchlist();
    expect(result).toHaveProperty('watchlistId');
  } catch (error) {
    console.error(error);
  }
});

test('update watchlist (put)', async () => {
  expect.hasAssertions();
  try {
    const { watchlistId } = await createWatchlist();
    const result = await updateWatchlist(watchlistId, EPIC_2);
    expect(result).toHaveProperty('status');
    const updated = await getWatchlists(watchlistId);
    expect(updated).toHaveProperty('markets');
    expect(updated.markets[1].epic).toContain(EPIC_2);
  } catch (error) {
    console.error(error);
  }
});

test('delete watchlist (delete)', async () => {
  expect.hasAssertions();
  try {
    const { watchlistId } = await createWatchlist();
    const result = await deleteWatchlist(watchlistId);
    expect(result).toHaveProperty('status');
  } catch (error) {
    console.error(error);
  }
});
