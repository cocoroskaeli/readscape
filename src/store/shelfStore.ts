import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Book {
  key: string;
  title: string;
  author: string;
  year?: number;
  coverId?: number;
}

interface Shelf {
  want: Book[];
  reading: Book[];
  finished: Book[];
}

interface ShelfStore {
  shelf: Shelf;
  lastAction?: "added" | "exists";
  addBook: (status: keyof Shelf, book: Book) => void;
  removeBook: (status: keyof Shelf, key: string) => void;
}

export const useShelfStore = create<ShelfStore>()(
  persist(
    (set, get) => ({
      shelf: { want: [], reading: [], finished: [] },
      lastAction: undefined,
      addBook: (status, book) => {
        const shelf = get().shelf;
        const alreadyInShelf = Object.values(shelf)
          .flat()
          .some((b) => b.key === book.key);
        if (alreadyInShelf) {
          set({ lastAction: "exists" });
          return;
        }
        set((state) => ({
          shelf: {
            ...state.shelf,
            [status]: [...state.shelf[status], book],
          },
          lastAction: "added",
        }));
      },
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
