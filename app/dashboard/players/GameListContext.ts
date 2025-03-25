import { Game } from "@prisma/client";
import { createContext } from "react";

export const GamesListContext = createContext<{
  gameList: Partial<Game>[];
  setGameList: (gameList: Partial<Game>[]) => void;
}>({ gameList: [], setGameList: () => {} });
