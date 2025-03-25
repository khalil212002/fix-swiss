/*
  Warnings:

  - You are about to drop the column `avoid_str` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `receivedBye` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `seating_str` on the `Player` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rating" INTEGER NOT NULL DEFAULT 1200,
    "birth_year" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "attendant" BOOLEAN NOT NULL DEFAULT false,
    "game_id" INTEGER,
    CONSTRAINT "Player_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Player" ("attendant", "birth_year", "first_name", "game_id", "id", "last_name", "rating") SELECT "attendant", "birth_year", "first_name", "game_id", "id", "last_name", "rating" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
