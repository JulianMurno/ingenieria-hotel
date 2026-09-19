-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "tarifa" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'DISPONIBLE',
    "capacidad" INTEGER NOT NULL DEFAULT 1,
    "descripcion" TEXT,
    "comodidades" TEXT,
    "fotos" TEXT
);
INSERT INTO "new_Room" ("createdAt", "id", "numero", "tarifa", "tipo") SELECT "createdAt", "id", "numero", "tarifa", "tipo" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE UNIQUE INDEX "Room_numero_key" ON "Room"("numero");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
