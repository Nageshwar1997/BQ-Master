// @vitest-environment jsdom
import { onlineStatusStore } from '@beautinique/frontend-hooks';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';

import useToastStore from '@/stores/toast.store';
import { mount, unmountAll } from '@/test-utils/react';

import NetworkStatusToaster from './NetworkStatusToaster';

let navigatorOnline: MockInstance<() => boolean>;

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

// What the pretend internet answers to the store's check.
let reachable = true;

const settle = async (ms = 0) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
};

const toasts = () => useToastStore.getState().toasts;
const titles = () => toasts().map((toast) => toast.title);

describe('NetworkStatusToaster', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigatorOnline = vi.spyOn(window.navigator, 'onLine', 'get');
    setNavigatorOnline(true);
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
    reachable = true;
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        reachable
          ? Promise.resolve(new Response(null, { status: 200 }))
          : Promise.reject(new TypeError('Failed to fetch')),
      ),
    );
    useToastStore.setState({ toasts: [] });
  });

  afterEach(() => {
    unmountAll();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.replaceChildren();
    useToastStore.setState({ toasts: [] });
  });

  it('shows nothing while the user is simply online', () => {
    const view = mount(<NetworkStatusToaster />);

    expect(toasts()).toEqual([]);

    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(toasts()).toEqual([]);
    view.unmount();
  });

  it('renders nothing of its own', () => {
    const view = mount(<NetworkStatusToaster />);

    expect(view.container.innerHTML).toBe('');
    view.unmount();
  });

  it('says "You\'re offline" when the network goes, and keeps saying it', async () => {
    const view = mount(<NetworkStatusToaster />);

    goOffline();

    expect(toasts()).toHaveLength(1);
    expect(toasts()[0]).toMatchObject({
      type: 'warning',
      title: "You're offline",
      autoClose: false,
      isClosable: false,
    });

    await settle(60_000);
    expect(titles()).toEqual(["You're offline"]);
    view.unmount();
  });

  it('says it too when the page is opened without a network', () => {
    setNavigatorOnline(false);

    const view = mount(<NetworkStatusToaster />);

    expect(titles()).toEqual(["You're offline"]);
    view.unmount();
  });

  it('swaps it for "Connecting to internet..." when the network is back but nothing answers', async () => {
    const view = mount(<NetworkStatusToaster />);
    goOffline();
    reachable = false;

    goOnline();
    await settle();

    expect(toasts()).toHaveLength(1);
    expect(toasts()[0]).toMatchObject({ type: 'loading', title: 'Connecting to internet...' });
    view.unmount();
  });

  it('swaps that for "Back online" once the internet answers, and that one goes away by itself', async () => {
    const view = mount(<NetworkStatusToaster />);
    goOffline();
    reachable = false;
    goOnline();
    await settle();

    reachable = true;
    await settle(500); // the retry

    expect(toasts()).toHaveLength(1);
    expect(toasts()[0]).toMatchObject({ type: 'success', title: 'Back online', closeTimer: 3000 });
    expect(toasts()[0]?.autoClose).not.toBe(false); // it closes itself after `closeTimer`
    view.unmount();
  });

  it('goes straight from offline to "Back online" when the first check already answers', async () => {
    const view = mount(<NetworkStatusToaster />);
    goOffline();

    goOnline();
    await settle();

    expect(titles()).toEqual(['Back online']);
    view.unmount();
  });

  it('shows the whole story again the next time the network drops', async () => {
    const view = mount(<NetworkStatusToaster />);

    for (let round = 0; round < 3; round += 1) {
      goOffline();
      expect(titles()).toEqual(["You're offline"]);

      goOnline();
      await settle();
      expect(titles()).toEqual(['Back online']);
    }
    view.unmount();
  });

  it('shows the offline message again when the network drops while connecting', async () => {
    const view = mount(<NetworkStatusToaster />);
    goOffline();
    reachable = false;
    goOnline();
    await settle();
    expect(titles()).toEqual(['Connecting to internet...']);

    goOffline();

    expect(titles()).toEqual(["You're offline"]);
    view.unmount();
  });

  it('replaces "Back online" at once when the network drops before it has gone away', async () => {
    const view = mount(<NetworkStatusToaster />);
    goOffline();
    goOnline();
    await settle();
    expect(titles()).toEqual(['Back online']);

    goOffline();

    expect(titles()).toEqual(["You're offline"]);
    view.unmount();
  });

  it('does not touch the toasts that belong to somebody else', async () => {
    useToastStore.setState({
      toasts: [{ id: 'other', type: 'success', title: 'Saved' }],
    });
    const view = mount(<NetworkStatusToaster />);

    goOffline();
    expect(titles()).toEqual(['Saved', "You're offline"]);

    goOnline();
    await settle();
    expect(titles()).toEqual(['Saved', 'Back online']);
    view.unmount();
  });

  it('says "You\'re offline" and then "Back online" when a recheck finds the internet gone and then back', async () => {
    const view = mount(<NetworkStatusToaster />);
    reachable = false;

    act(() => {
      onlineStatusStore.recheck();
    });
    await settle();
    expect(titles()).toEqual([]); // the first failure could be a blip

    await settle(500);
    expect(titles()).toEqual(["You're offline"]);

    reachable = true;
    await settle(1000);
    expect(titles()).toEqual(['Back online']);
    view.unmount();
  });

  it('notices Wi-Fi without internet on its own, says offline, and says back online when it returns', async () => {
    const view = mount(<NetworkStatusToaster />);
    expect(navigator.onLine).toBe(true);
    reachable = false; // e.g. the phone that shares its connection switched its data off

    await settle(15_000);
    expect(titles()).toEqual([]);
    await settle(500);
    expect(titles()).toEqual(["You're offline"]);
    expect(toasts()[0]).toMatchObject({ type: 'warning', autoClose: false });

    await settle(60_000);
    expect(titles()).toEqual(["You're offline"]); // one toast, however long it lasts

    reachable = true;
    await settle(3000); // the longest wait between two tries
    expect(titles()).toEqual(['Back online']);
    view.unmount();
  });

  it('says nothing when a single check fails and the next one answers', async () => {
    const view = mount(<NetworkStatusToaster />);
    reachable = false;

    await settle(15_000);
    reachable = true;
    await settle(500);

    expect(titles()).toEqual([]);
    view.unmount();
  });

  it('shows exactly one toast under StrictMode, which runs effects twice on mount', () => {
    setNavigatorOnline(false);

    const view = mount(<NetworkStatusToaster />, { strict: true });

    expect(titles()).toEqual(["You're offline"]);
    view.unmount();
  });

  it('shows exactly one toast per change under StrictMode', async () => {
    const view = mount(<NetworkStatusToaster />, { strict: true });

    goOffline();
    expect(titles()).toEqual(["You're offline"]);

    goOnline();
    await settle();
    expect(titles()).toEqual(['Back online']);
    view.unmount();
  });

  it('takes its toast away and stops listening when it is unmounted', () => {
    const view = mount(<NetworkStatusToaster />);
    goOffline();
    expect(toasts()).toHaveLength(1);

    view.unmount();

    expect(toasts()).toEqual([]);
    expect(vi.getTimerCount()).toBe(0);
  });
});
