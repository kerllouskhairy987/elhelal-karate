/*
  Warnings:

  - Added the required column `contractenddate` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractstartdate` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerclass` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "contractenddate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "contractstartdate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "playerclass" TEXT NOT NULL;
