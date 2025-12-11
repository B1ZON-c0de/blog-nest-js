/*
  Warnings:

  - Changed the type of `published` on the `posts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "published",
ADD COLUMN     "published" BOOLEAN NOT NULL;
