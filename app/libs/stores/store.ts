import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Store } from "../types/store-type";
import { createBoardSlice } from "./board-slice";
import { createExampleSlice } from "./example-slice";

export const useAppStore = create<Store>()(
  devtools(
    persist(
      immer((set, get, store) => ({
        ...createExampleSlice(set, get, store),
        ...createBoardSlice(set, get, store),
      })),
      {
        name: "deluxe-llama-store",
      },
    ),
    { name: "deluxe-llama-store-devtools" },
  ),
);
