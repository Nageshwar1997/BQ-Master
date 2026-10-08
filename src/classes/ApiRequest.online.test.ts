// @vitest-environment jsdom
import {
  AxiosError,
  type AxiosResponse,
  CanceledError,
  type InternalAxiosRequestConfig,
} from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiRequest } from './ApiRequest';

const { recheck, confirmOnline } = vi.hoisted(() => ({
  recheck: vi.fn(),
  confirmOnline: vi.fn(),
}));

vi.mock('@beautinique/frontend-hooks', () => ({
  onlineStatusStore: { recheck, confirmOnline },
}));

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

const failWithoutAnswer = (code: string, message: string): TAdapter => {
  return (config) => Promise.reject(new AxiosError(message, code, config));
};

// An answer from the server, whatever it says, proves that the internet works. No answer at all is
// the sign that it may not: the user may have lost it without the browser noticing (Wi-Fi without
// internet), so the online status is asked to look. A request cancelled on purpose says nothing.
describe('ApiRequest and the online status', () => {
  let api: TestApi;

  beforeEach(() => {
    recheck.mockClear();
    confirmOnline.mockClear();
    api = new TestApi();
  });

  describe('no answer at all', () => {
    it('asks the online status to check when there is no connection', async () => {
      api.answerWith(failWithoutAnswer('ERR_NETWORK', 'Network Error'));

      await expect(api.send()).rejects.toThrow();

      expect(recheck).toHaveBeenCalledTimes(1);
      expect(confirmOnline).not.toHaveBeenCalled();
    });

    it('asks it too when the request times out', async () => {
      api.answerWith(failWithoutAnswer('ECONNABORTED', 'timeout of 5000ms exceeded'));

      await expect(api.send()).rejects.toThrow();

      expect(recheck).toHaveBeenCalledTimes(1);
      expect(confirmOnline).not.toHaveBeenCalled();
    });

    it('still fails the request in the same way', async () => {
      api.answerWith(failWithoutAnswer('ERR_NETWORK', 'Network Error'));

      await expect(api.send()).rejects.toMatchObject({ message: 'API Error occurred' });
    });
  });

  describe('a request that was cancelled', () => {
    it('is no reason to look at the connection, and no proof of it either', async () => {
      api.answerWith((config) => Promise.reject(new CanceledError('canceled', config)));

      await expect(api.send()).rejects.toThrow();

      expect(recheck).not.toHaveBeenCalled();
      expect(confirmOnline).not.toHaveBeenCalled();
    });
  });

  describe('the server answered', () => {
    it('confirms the internet when the request works', async () => {
      api.answerWith((config) => Promise.resolve(reply(config, 200, { data: 'ok' })));

      await api.send();

      expect(confirmOnline).toHaveBeenCalledTimes(1);
      expect(recheck).not.toHaveBeenCalled();
    });

    it('confirms it too when the answer is an error, because the internet works', async () => {
      api.answerWith((config) =>
        Promise.reject(
          new AxiosError(
            'Request failed',
            'ERR_BAD_RESPONSE',
            config,
            null,
            reply(config, 500, { message: 'Server error' }),
          ),
        ),
      );

      await expect(api.send()).rejects.toThrow('Server error');

      expect(confirmOnline).toHaveBeenCalledTimes(1);
      expect(recheck).not.toHaveBeenCalled();
    });

    it('confirms it for a 404 as well', async () => {
      api.answerWith((config) =>
        Promise.reject(
          new AxiosError(
            'Not found',
            'ERR_BAD_REQUEST',
            config,
            null,
            reply(config, 404, { message: 'Missing' }),
          ),
        ),
      );

      await expect(api.send()).rejects.toThrow('Missing');

      expect(confirmOnline).toHaveBeenCalledTimes(1);
    });

    it('still gives the same answer back', async () => {
      api.answerWith((config) => Promise.resolve(reply(config, 200, { data: 'ok' })));

      await expect(api.send()).resolves.toEqual({ data: 'ok' });
    });
  });

  it('leaves errors that are not the network at all alone', async () => {
    api.answerWith(() => Promise.reject(new Error('something else')));

    await expect(api.send()).rejects.toThrow('something else');

    expect(recheck).not.toHaveBeenCalled();
    expect(confirmOnline).not.toHaveBeenCalled();
  });
});
