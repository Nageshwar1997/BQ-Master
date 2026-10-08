// @vitest-environment jsdom
import { onlineStatusStore } from '@beautinique/frontend-hooks';
import {
  AxiosError,
  type AxiosResponse,
  CanceledError,
  type InternalAxiosRequestConfig,
} from 'axios';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';

import { ApiRequest } from './ApiRequest';

// The same as `ApiRequest.online.test.ts`, but with the real online status behind it instead of a
// stand-in: what the API client reports has to end up in the status the user sees.
type TAdapter = (config: InternalAxiosRequestConfig) => Promise<AxiosResponse>;

class TestApi extends ApiRequest {
  answerWith = (adapter: TAdapter) => {
    this.instance.defaults.adapter = adapter;
  };

  send = () => this.request({ url: '/anything' });
}

const reply = (
  config: InternalAxiosRequestConfig,
  status: number,
  data: unknown,
): AxiosResponse => ({
  config,
  status,
  statusText: String(status),
  headers: {},
  data,
});

const settle = async (ms = 0) => {
  await vi.advanceTimersByTimeAsync(ms);
};

describe('ApiRequest with the real online status', () => {
  let navigatorOnline: MockInstance<() => boolean>;
  let reachable = true;
  let fetchMock: ReturnType<typeof vi.fn>;
  let api: TestApi;
  let unsubscribe: () => void;

  /** The Wi-Fi is joined, the browser says online, but nothing answers (a hotspot with its data off). */
  const loseTheInternet = async () => {
    reachable = false;
    await settle(15_000); // the regular check
    await settle(500); // and its repeat
    expect(onlineStatusStore.getStatus()).toBe('offline');
    expect(navigator.onLine).toBe(true);
  };

  beforeEach(() => {
    vi.useFakeTimers();
    navigatorOnline = vi.spyOn(window.navigator, 'onLine', 'get');
    navigatorOnline.mockReturnValue(true);
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
    reachable = true;
    fetchMock = vi.fn(() =>
      reachable
        ? Promise.resolve(new Response(null, { status: 204 }))
        : Promise.reject(new TypeError('Failed to fetch')),
    );
    vi.stubGlobal('fetch', fetchMock);
    unsubscribe = onlineStatusStore.subscribe(() => undefined); // the page has the status running
    api = new TestApi();
  });

  afterEach(() => {
    unsubscribe();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('is online again at once when a request works, although the checks still get no answer', async () => {
    await loseTheInternet();
    api.answerWith((config) => Promise.resolve(reply(config, 200, { data: 'ok' })));

    await api.send();

    expect(onlineStatusStore.getStatus()).toBe('online'); // not waiting for the next check
    const checksBefore = fetchMock.mock.calls.length;
    await settle(60);
    expect(fetchMock.mock.calls.length).toBe(checksBefore); // and no check is running any more
  });

  it('is online again when the server answers with an error, because the internet works', async () => {
    await loseTheInternet();
    api.answerWith((config) =>
      Promise.reject(
        new AxiosError(
          'Failed',
          'ERR_BAD_RESPONSE',
          config,
          null,
          reply(config, 503, { message: 'Down' }),
        ),
      ),
    );

    await expect(api.send()).rejects.toThrow('Down');

    expect(onlineStatusStore.getStatus()).toBe('online');
  });

  it('turns connecting into online at once', async () => {
    navigatorOnline.mockReturnValue(false);
    window.dispatchEvent(new Event('offline'));
    reachable = false;
    navigatorOnline.mockReturnValue(true);
    window.dispatchEvent(new Event('online'));
    expect(onlineStatusStore.getStatus()).toBe('connecting');
    api.answerWith((config) => Promise.resolve(reply(config, 200, { data: 'ok' })));

    await api.send();

    expect(onlineStatusStore.getStatus()).toBe('online');
  });

  it('keeps the regular check away while requests keep working', async () => {
    api.answerWith((config) => Promise.resolve(reply(config, 200, { data: 'ok' })));

    for (let round = 0; round < 6; round += 1) {
      await settle(10_000); // a request every 10s: the 15s check never gets its turn
      await api.send();
    }

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('looks at the internet when a request gets no answer, and says offline when it still does not', async () => {
    reachable = false;
    api.answerWith((config) =>
      Promise.reject(new AxiosError('Network Error', 'ERR_NETWORK', config)),
    );

    await expect(api.send()).rejects.toThrow();
    expect(fetchMock).toHaveBeenCalled(); // it went to look at once
    expect(onlineStatusStore.getStatus()).toBe('online'); // once could be a blip

    await settle(500);

    expect(onlineStatusStore.getStatus()).toBe('offline');
  });

  it('stays online when a request gets no answer but the internet does answer (a server that is down)', async () => {
    api.answerWith((config) =>
      Promise.reject(new AxiosError('Network Error', 'ERR_NETWORK', config)),
    );

    await expect(api.send()).rejects.toThrow();
    await settle(2000);

    expect(onlineStatusStore.getStatus()).toBe('online');
  });

  it('does not look when a request was cancelled on purpose', async () => {
    reachable = false;
    api.answerWith((config) => Promise.reject(new CanceledError('canceled', config)));

    await expect(api.send()).rejects.toThrow();
    await settle(2000);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(onlineStatusStore.getStatus()).toBe('online');
  });
});
