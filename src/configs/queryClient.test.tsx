// @vitest-environment jsdom
import { onlineManager, QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';

import type { queryClient as AppQueryClient } from './queryClient';

// React Query decides whether to fetch from the browser's online/offline events alone. These tests
// check that it is given the real status instead: while there is no internet (or it is only
// connecting) queries and mutations wait rather than fail, and they carry on when it is back.
let navigatorOnline: MockInstance<() => boolean>;
let reachable = true;
let queryClient: typeof AppQueryClient;

const setNavigatorOnline = (value: boolean) => {
  navigatorOnline.mockReturnValue(value);
};

const goOffline = () => {
  act(() => {
    setNavigatorOnline(false);
    window.dispatchEvent(new Event('offline'));
  });
};

const goOnline = () => {
  act(() => {
    setNavigatorOnline(true);
    window.dispatchEvent(new Event('online'));
  });
};

const settle = async (ms = 0) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
};

const QueryProbe = ({ fetchData }: { fetchData: () => Promise<string> }) => {
  const query = useQuery({ queryKey: ['probe'], queryFn: fetchData });

  return (
    <span data-status={query.fetchStatus} data-data={query.data ?? ''}>
      probe
    </span>
  );
};

const MutationProbe = ({ save }: { save: () => Promise<string> }) => {
  const mutation = useMutation({ mutationFn: save });

  return (
    <button
      data-paused={String(mutation.isPaused)}
      data-data={mutation.data ?? ''}
      onClick={() => {
        mutation.mutate();
      }}
    >
      save
    </button>
  );
};

const readQuery = (container: HTMLElement) => {
  const span = container.querySelector('span');

  return { status: span?.getAttribute('data-status'), data: span?.getAttribute('data-data') };
};

describe('React Query and the online status', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    navigatorOnline = vi.spyOn(window.navigator, 'onLine', 'get');
    setNavigatorOnline(true);
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
    reachable = true;
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        reachable
          ? Promise.resolve(new Response(null, { status: 204 }))
          : Promise.reject(new TypeError('Failed to fetch')),
      ),
    );
    // a fresh copy of the app's own modules (and so of its one online status), the same React Query
    vi.resetModules();
    ({ queryClient } = await import('./queryClient'));
  });

  afterEach(() => {
    unmountAll();
    queryClient.clear();
    onlineManager.setEventListener(() => undefined); // lets go of the status
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.replaceChildren();
  });

  it('knows the status of the internet, not only the events of the browser', async () => {
    expect(onlineManager.isOnline()).toBe(true);

    goOffline();
    expect(onlineManager.isOnline()).toBe(false);

    reachable = false;
    goOnline(); // the browser says online, the internet has not answered
    await settle();
    expect(onlineManager.isOnline()).toBe(false);

    reachable = true;
    await settle(500);
    expect(onlineManager.isOnline()).toBe(true);
  });

  it('knows when the internet went away with the Wi-Fi still joined', async () => {
    reachable = false;

    await settle(15_000);
    await settle(500);

    expect(navigator.onLine).toBe(true);
    expect(onlineManager.isOnline()).toBe(false);

    reachable = true;
    await settle(1000);
    expect(onlineManager.isOnline()).toBe(true);
  });

  it('is told straight away when the page opens without a network', async () => {
    vi.resetModules();
    setNavigatorOnline(false);

    ({ queryClient } = await import('./queryClient'));

    expect(onlineManager.isOnline()).toBe(false);
  });

  describe('queries', () => {
    it('go on as usual while online', async () => {
      const fetchData = vi.fn(() => Promise.resolve('hello'));
      const view = mount(
        <QueryClientProvider client={queryClient}>
          <QueryProbe fetchData={fetchData} />
        </QueryClientProvider>,
      );
      await settle();

      expect(fetchData).toHaveBeenCalledTimes(1);
      expect(readQuery(view.container)).toEqual({ status: 'idle', data: 'hello' });
    });

    it('wait while there is no internet, instead of failing, and run when it is back', async () => {
      goOffline();
      const fetchData = vi.fn(() => Promise.resolve('hello'));
      const view = mount(
        <QueryClientProvider client={queryClient}>
          <QueryProbe fetchData={fetchData} />
        </QueryClientProvider>,
      );
      await settle(60_000);

      expect(fetchData).not.toHaveBeenCalled();
      expect(readQuery(view.container).status).toBe('paused');

      goOnline();
      await settle();

      expect(fetchData).toHaveBeenCalledTimes(1);
      expect(readQuery(view.container)).toEqual({ status: 'idle', data: 'hello' });
    });

    it('keep waiting while the network is back but the internet has not answered yet', async () => {
      goOffline();
      const fetchData = vi.fn(() => Promise.resolve('hello'));
      const view = mount(
        <QueryClientProvider client={queryClient}>
          <QueryProbe fetchData={fetchData} />
        </QueryClientProvider>,
      );
      reachable = false;

      goOnline();
      await settle(500);
      expect(fetchData).not.toHaveBeenCalled();
      expect(readQuery(view.container).status).toBe('paused');

      reachable = true;
      await settle(3000); // the longest wait between two tries
      expect(fetchData).toHaveBeenCalledTimes(1);
      expect(readQuery(view.container).data).toBe('hello');
    });

    it('wait when the internet went away with the Wi-Fi still joined', async () => {
      reachable = false;
      await settle(15_000);
      await settle(500); // offline now, and the browser never said so
      const fetchData = vi.fn(() => Promise.resolve('hello'));

      const view = mount(
        <QueryClientProvider client={queryClient}>
          <QueryProbe fetchData={fetchData} />
        </QueryClientProvider>,
      );
      await settle(1000);
      expect(fetchData).not.toHaveBeenCalled();
      expect(readQuery(view.container).status).toBe('paused');

      reachable = true;
      await settle(3000);
      expect(fetchData).toHaveBeenCalledTimes(1);
      expect(readQuery(view.container).data).toBe('hello');
    });
  });

  describe('mutations', () => {
    it('wait while there is no internet, and run once when it is back', async () => {
      const save = vi.fn(() => Promise.resolve('saved'));
      const view = mount(
        <QueryClientProvider client={queryClient}>
          <MutationProbe save={save} />
        </QueryClientProvider>,
      );
      goOffline();

      act(() => {
        view.container.querySelector('button')?.click();
      });
      await settle(60_000);

      expect(save).not.toHaveBeenCalled();
      expect(view.container.querySelector('button')?.getAttribute('data-paused')).toBe('true');

      goOnline();
      await settle();

      expect(save).toHaveBeenCalledTimes(1);
      expect(view.container.querySelector('button')?.getAttribute('data-data')).toBe('saved');
    });
  });

  it('keeps the options the client always had', () => {
    const { queries, mutations } = queryClient.getDefaultOptions();

    expect(queries?.refetchOnWindowFocus).toBe(false);
    expect(mutations?.retry).toBe(false);
    const retry = queries?.retry as (failureCount: number) => boolean;
    expect([retry(0), retry(2), retry(3)]).toEqual([true, true, false]);
  });
});
