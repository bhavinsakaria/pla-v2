/*
  Warnings:

  - You are about to alter the column `remarks` on the `dispatch` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `dispatch` MODIFY `remarks` JSON NULL;
