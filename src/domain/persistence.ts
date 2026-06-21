import type { GameState } from './types';

const STORAGE_KEY = 'unofficial-journey-map-save-v1';
const SAVE_VERSION = 1;

type StoredSave = {
  version: number;
  state: GameState;
};

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function getStorage(): StorageLike | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.localStorage;
}

export function saveGameState(state: GameState, storage: StorageLike | undefined = getStorage()): void {
  if (!storage) return;
  const payload: StoredSave = { version: SAVE_VERSION, state };
  storage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadGameState(storage: StorageLike | undefined = getStorage()): GameState | undefined {
  if (!storage) return undefined;
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw) as StoredSave;
    if (parsed.version !== SAVE_VERSION || !parsed.state) return undefined;
    return {
      ...parsed.state,
      completedNodeIds: Array.isArray(parsed.state.completedNodeIds) ? parsed.state.completedNodeIds : [],
    };
  } catch {
    return undefined;
  }
}

export function clearGameState(storage: StorageLike | undefined = getStorage()): void {
  storage?.removeItem(STORAGE_KEY);
}
