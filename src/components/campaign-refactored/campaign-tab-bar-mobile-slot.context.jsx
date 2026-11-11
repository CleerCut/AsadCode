"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";

const CampaignTabBarSlotApiContext = createContext(null);

function createSlotStore() {
  let mobileSlot = null;
  let rightSlot = null;
  const listeners = new Set();

  const emit = () => {
    listeners.forEach((listener) => listener());
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getMobileSlot() {
      return mobileSlot;
    },
    getRightSlot() {
      return rightSlot;
    },
    setMobileSlot(node) {
      if (mobileSlot === node) return;
      mobileSlot = node;
      emit();
    },
    setRightSlot(node) {
      if (rightSlot === node) return;
      rightSlot = node;
      emit();
    },
  };
}

export function CampaignTabBarMobileSlotProvider({ children }) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createSlotStore();
  }
  const store = storeRef.current;

  const registerMobileSlot = useCallback((node) => {
    store.setMobileSlot(node);
  }, [store]);

  const clearMobileSlot = useCallback(() => {
    store.setMobileSlot(null);
  }, [store]);

  const registerRightSlot = useCallback((node) => {
    store.setRightSlot(node);
  }, [store]);

  const clearRightSlot = useCallback(() => {
    store.setRightSlot(null);
  }, [store]);

  const api = useMemo(
    () => ({
      registerMobileSlot,
      clearMobileSlot,
      registerRightSlot,
      clearRightSlot,
      store,
    }),
    [registerMobileSlot, clearMobileSlot, registerRightSlot, clearRightSlot, store]
  );

  return (
    <CampaignTabBarSlotApiContext.Provider value={api}>
      {children}
    </CampaignTabBarSlotApiContext.Provider>
  );
}

export function useCampaignTabBarMobileSlot() {
  const api = useContext(CampaignTabBarSlotApiContext);
  const mobileSlot = useSyncExternalStore(
    api?.store?.subscribe ?? (() => () => {}),
    api?.store?.getMobileSlot ?? (() => null),
    api?.store?.getMobileSlot ?? (() => null)
  );
  const rightSlot = useSyncExternalStore(
    api?.store?.subscribe ?? (() => () => {}),
    api?.store?.getRightSlot ?? (() => null),
    api?.store?.getRightSlot ?? (() => null)
  );

  return useMemo(() => {
    if (!api) return null;
    return {
      mobileSlot,
      rightSlot,
      registerMobileSlot: api.registerMobileSlot,
      clearMobileSlot: api.clearMobileSlot,
      registerRightSlot: api.registerRightSlot,
      clearRightSlot: api.clearRightSlot,
    };
  }, [api, mobileSlot, rightSlot]);
}

export function useCampaignTabBarSlotRegistration() {
  const api = useContext(CampaignTabBarSlotApiContext);
  return useMemo(() => {
    if (!api) return null;
    return {
      registerMobileSlot: api.registerMobileSlot,
      clearMobileSlot: api.clearMobileSlot,
      registerRightSlot: api.registerRightSlot,
      clearRightSlot: api.clearRightSlot,
    };
  }, [api]);
}
