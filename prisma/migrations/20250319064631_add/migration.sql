/*
  Warnings:

  - The primary key for the `Match` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "round" INTEGER NOT NULL,
    "match" INTEGER NOT NULL,
    "player1" INTEGER,
    "player2" INTEGER,
    "winner" INTEGER,
    "game_id" INTEGER NOT NULL,

    PRIMARY KEY ("round", "match", "game_id"),
    CONSTRAINT "Match_player1_fkey" FOREIGN KEY ("player1") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Match_player2_fkey" FOREIGN KEY ("player2") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Match_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Match" ("game_id", "match", "player1", "player2", "round", "winner") SELECT "game_id", "match", "player1", "player2", "round", "winner" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
