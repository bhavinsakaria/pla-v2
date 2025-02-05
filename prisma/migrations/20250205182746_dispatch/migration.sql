/*
  Warnings:

  - A unique constraint covering the columns `[challanNo]` on the table `Dispatch` will be added. If there are existing duplicate values, this will fail.
  - Made the column `challanNo` on table `dispatch` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `dispatch` MODIFY `challanNo` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Dispatch_challanNo_key` ON `Dispatch`(`challanNo`);
