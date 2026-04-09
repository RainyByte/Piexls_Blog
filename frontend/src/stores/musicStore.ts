import { create } from "zustand";
import { MusicTrack } from "@/types";

type RepeatMode = "none" | "all" | "one";

interface MusicState {
  playlist: MusicTrack[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  repeatMode: RepeatMode;
  setPlaylist: (tracks: MusicTrack[]) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (dur: number) => void;
  cycleRepeat: () => void;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  playlist: [],
  currentIndex: 0,
  isPlaying: false,
  volume: 70,
  currentTime: 0,
  duration: 0,
  repeatMode: "none",
  setPlaylist: (tracks) => set({ playlist: tracks }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
  next: () => {
    const { playlist, currentIndex, repeatMode } = get();
    if (playlist.length === 0) return;
    if (repeatMode === "one") {
      set({ currentTime: 0 });
      return;
    }
    const nextIndex = (currentIndex + 1) % playlist.length;
    if (nextIndex === 0 && repeatMode === "none") {
      set({ isPlaying: false, currentIndex: 0, currentTime: 0 });
    } else {
      set({ currentIndex: nextIndex, currentTime: 0 });
    }
  },
  prev: () => {
    const { playlist, currentIndex } = get();
    if (playlist.length === 0) return;
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    set({ currentIndex: prevIndex, currentTime: 0 });
  },
  seek: (time) => set({ currentTime: time }),
  setVolume: (vol) => set({ volume: vol }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (dur) => set({ duration: dur }),
  cycleRepeat: () =>
    set((s) => {
      const modes: RepeatMode[] = ["none", "all", "one"];
      const idx = modes.indexOf(s.repeatMode);
      return { repeatMode: modes[(idx + 1) % modes.length] };
    }),
}));
