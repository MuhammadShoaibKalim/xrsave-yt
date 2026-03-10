import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),

      setAccessToken: (accessToken) =>
        set({ accessToken }),

      setUser: (user) =>
        set({ user }),

      logout: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: 'xrsave-yt-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // Don't persist accessToken - it expires quickly
      }),
    }
  )
);

export const useDownloadStore = create((set, get) => ({
  activeDownloads: {},
  downloadHistory: [],

  addDownload: (id, info) =>
    set((state) => ({
      activeDownloads: { ...state.activeDownloads, [id]: { ...info, progress: 0, status: 'starting' } },
    })),

  updateProgress: (id, progress) =>
    set((state) => ({
      activeDownloads: {
        ...state.activeDownloads,
        [id]: { ...state.activeDownloads[id], progress },
      },
    })),

  completeDownload: (id) =>
    set((state) => {
      const { [id]: removed, ...rest } = state.activeDownloads;
      return { activeDownloads: rest };
    }),

  failDownload: (id, error) =>
    set((state) => ({
      activeDownloads: {
        ...state.activeDownloads,
        [id]: { ...state.activeDownloads[id], status: 'failed', error },
      },
    })),
}));

export const useThemeStore = create(
  persist(
    (set) => ({
      isDark: true,
      toggle: () => set((state) => ({ isDark: !state.isDark })),
    }),
    { name: 'xrsave-yt-theme' }
  )
);
