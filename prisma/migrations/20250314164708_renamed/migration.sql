/*
  Warnings:

  - You are about to drop the `Game` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Game";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Match" (
    "round" INTEGER NOT NULL,
    "match" INTEGER NOT NULL,
    "player1" INTEGER NOT NULL,
    "player2" INTEGER NOT NULL,
    "winner" INTEGER,

    PRIMARY KEY ("round", "match"),
    CONSTRAINT "Match_player1_fkey" FOREIGN KEY ("player1") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Match_player2_fkey" FOREIGN KEY ("player2") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
