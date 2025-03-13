-- CreateTable
CREATE TABLE "Game" (
    "round" INTEGER NOT NULL,
    "match" INTEGER NOT NULL,
    "player1" INTEGER NOT NULL,
    "player2" INTEGER NOT NULL,
    "winner" INTEGER,

    PRIMARY KEY ("round", "match"),
    CONSTRAINT "Game_player1_fkey" FOREIGN KEY ("player1") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Game_player2_fkey" FOREIGN KEY ("player2") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
