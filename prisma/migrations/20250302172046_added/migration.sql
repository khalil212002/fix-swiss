-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "score" INTEGER NOT NULL DEFAULT 0,
    "receivedBye" BOOLEAN NOT NULL DEFAULT false,
    "avoid" TEXT NOT NULL DEFAULT '',
    "seating" TEXT NOT NULL DEFAULT '',
    "rating" INTEGER NOT NULL DEFAULT 1200,
    "birth_year" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "attendant" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Player" ("avoid", "birth_year", "first_name", "id", "last_name", "rating", "receivedBye", "score", "seating") SELECT "avoid", "birth_year", "first_name", "id", "last_name", "rating", "receivedBye", "score", "seating" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
