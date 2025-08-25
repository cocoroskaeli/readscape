import { persist } from "zustand/middleware";
import { create } from "zustand";

type ShelfStatus = "want" | "reading" | "finished";

interface Book {
  key: string;
  title: string;
  author: string;
  year?: number;
  coverId?: number;
}

interface ShelfStore {
  shelf: Record<ShelfStatus, Book[]>;
  addBook: (status: ShelfStatus, book: Book) => void;
  removeBook: (status: ShelfStatus, key: string) => void;
}

export const useShelfStore = create<ShelfStore>()(
  persist(
    (set) => ({
      shelf: { want: [], reading: [], finished: [] },

      addBook: (status, book) =>
        set((state) => ({
          shelf: {
            ...state.shelf,
            [status]: [...state.shelf[status], book],
          },
        })),

      removeBook: (status, key) =>
        set((state) => ({
          shelf: {
            ...state.shelf,
            [status]: state.shelf[status].filter((b) => b.key !== key),
          },
        })),
    }),
    { name: "myshelf-storage" }
  )
);