-- CreateTable
CREATE TABLE `acbal` (
    `ID` INTEGER NOT NULL,
    `CompanyID` INTEGER NULL,
    `AID` VARCHAR(255) NOT NULL,
    `Opening` VARCHAR(255) NULL,
    `Balance` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `acbal_ID_key`(`ID`),
    PRIMARY KEY (`AID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account` (
    `ID` INTEGER NOT NULL,
    `CompanyID` INTEGER NULL,
    `Voucher` INTEGER NULL,
    `Date` DATETIME(3) NULL,
    `Code` VARCHAR(10) NULL,
    `Amount` INTEGER NULL,
    `Book` CHAR(1) NULL,
    `Code1` VARCHAR(10) NULL,
    `GCode` VARCHAR(10) NULL,
    `Remark` VARCHAR(255) NULL,
    `AddField` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `acgroup` (
    `ID` INTEGER NOT NULL,
    `CompanyID` INTEGER NULL,
    `AID` VARCHAR(10) NOT NULL,
    `Name` VARCHAR(255) NULL,
    `Under` VARCHAR(10) NULL,
    `AddField` VARCHAR(35) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `acgroup_ID_key`(`ID`),
    PRIMARY KEY (`AID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dis` (
    `ID` BIGINT NOT NULL,
    `CompanyID` INTEGER NULL,
    `Voucher` INTEGER NULL,
    `Type` CHAR(1) NULL,
    `VCN` VARCHAR(35) NULL,
    `Date` DATETIME(3) NULL,
    `CID` VARCHAR(10) NULL,
    `PID` VARCHAR(10) NULL,
    `GCode` VARCHAR(10) NULL,
    `Batch` VARCHAR(35) NULL,
    `BatDet` VARCHAR(35) NULL,
    `Qty` INTEGER NULL,
    `Free` INTEGER NULL,
    `MRP` DECIMAL(20, 2) NULL,
    `Rate` DECIMAL(20, 2) NULL,
    `Discount` DECIMAL(20, 2) NULL,
    `Amount` DECIMAL(30, 2) NULL,
    `GST` INTEGER NULL,
    `GSTAmount` DECIMAL(30, 2) NULL,
    `AddField` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `masters` (
    `ID` INTEGER NOT NULL,
    `CompanyID` INTEGER NULL,
    `Code` VARCHAR(10) NULL,
    `Name` VARCHAR(35) NULL,
    `StoreID` VARCHAR(35) NULL,
    `Licence` INTEGER NULL,
    `Branch` VARCHAR(50) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mdis` (
    `ID` BIGINT NOT NULL,
    `CompanyID` INTEGER NULL,
    `Voucher` INTEGER NOT NULL,
    `Type` CHAR(1) NULL,
    `VCN` VARCHAR(35) NULL,
    `Date` DATETIME(3) NULL,
    `CID` VARCHAR(10) NULL,
    `Final` DECIMAL(20, 0) NULL,
    `Cash` DECIMAL(20, 0) NULL,
    `Others` DECIMAL(20, 0) NULL,
    `Salun` VARCHAR(10) NULL,
    `MR` VARCHAR(10) NULL,
    `Rout` VARCHAR(10) NULL,
    `Area` VARCHAR(10) NULL,
    `ORN` VARCHAR(50) NULL,
    `AddField` VARCHAR(255) NULL,
    `ODate` DATETIME(0) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `mdis_ID_key`(`ID`),
    PRIMARY KEY (`Voucher`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `metaData` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Index` INTEGER NULL,
    `ApiName` VARCHAR(255) NULL,
    `Datastatus` VARCHAR(255) NULL,
    `Status` VARCHAR(255) NULL,
    `DateTime` DATETIME(0) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `outstanding` (
    `ID` INTEGER NOT NULL,
    `CompanyID` INTEGER NULL,
    `ORD` VARCHAR(255) NULL,
    `Date` DATETIME(3) NULL,
    `VCN` VARCHAR(35) NULL,
    `Days` INTEGER NULL,
    `Final` DECIMAL(20, 2) NULL,
    `Balance` DECIMAL(20, 2) NULL,
    `PdLess` DECIMAL(20, 2) NULL,
    `Group` VARCHAR(5) NULL,
    `Voucher` INTEGER NOT NULL,
    `SVoucher` INTEGER NULL,
    `AddField` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `outstanding_ID_key`(`ID`),
    PRIMARY KEY (`Voucher`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `partyc` (
    `ID` INTEGER NOT NULL,
    `CompanyID` INTEGER NULL,
    `GSTNo` VARCHAR(15) NULL,
    `Rout` VARCHAR(10) NULL,
    `Area` VARCHAR(10) NULL,
    `MR` VARCHAR(10) NULL,
    `SCode` VARCHAR(5) NULL,
    `CID` VARCHAR(10) NOT NULL,
    `ParNam` VARCHAR(255) NULL,
    `ParAdd1` VARCHAR(255) NULL,
    `ParAdd2` VARCHAR(255) NULL,
    `Rate` CHAR(1) NULL,
    `Phone1` VARCHAR(15) NULL,
    `Phone2` VARCHAR(15) NULL,
    `Phone3` VARCHAR(15) NULL,
    `Phone4` VARCHAR(15) NULL,
    `Credit` INTEGER NULL,
    `CRDays` INTEGER NULL,
    `CRBills` VARCHAR(50) NULL,
    `CRStatus` VARCHAR(5) NULL,
    `MargCode` VARCHAR(50) NULL,
    `AddField` VARCHAR(50) NULL,
    `DlNo` VARCHAR(50) NULL,
    `Pin` CHAR(6) NULL,
    `Lat` VARCHAR(10) NULL,
    `Lng` VARCHAR(10) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `partyc_ID_key`(`ID`),
    PRIMARY KEY (`CID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `partym` (
    `rid` INTEGER NOT NULL,
    `area` VARCHAR(10) NULL,
    `code` VARCHAR(10) NULL,
    `address` VARCHAR(255) NULL,
    `name` VARCHAR(255) NULL,
    `balance` DECIMAL(20, 2) NULL,
    `pdc` DECIMAL(20, 2) NULL,
    `gcode` VARCHAR(5) NULL,
    `opening` DECIMAL(20, 2) NULL,
    `Is_Deleted` BOOLEAN NULL DEFAULT false,
    `phone1` VARCHAR(15) NULL,
    `phone2` VARCHAR(15) NULL,
    `phone3` VARCHAR(15) NULL,
    `phone4` VARCHAR(15) NULL,
    `email1` VARCHAR(255) NULL,
    `email2` VARCHAR(255) NULL,
    `email3` VARCHAR(255) NULL,
    `bank` VARCHAR(50) NULL,
    `branch` VARCHAR(50) NULL,
    `MargCode` VARCHAR(50) NULL,
    `GSTIN` VARCHAR(50) NULL,
    `DlNo` VARCHAR(50) NULL,
    `LedgerCode` VARCHAR(15) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`rid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pbal` (
    `ID` INTEGER NOT NULL,
    `CompanyID` INTEGER NULL,
    `CID` VARCHAR(10) NULL,
    `Opening` DECIMAL(20, 2) NULL,
    `Balance` DECIMAL(20, 2) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pro_n` (
    `rid` INTEGER NOT NULL,
    `catcode` VARCHAR(15) NULL,
    `code` INTEGER NULL,
    `name` VARCHAR(100) NULL,
    `stock` INTEGER NULL,
    `remark` VARCHAR(100) NULL,
    `company` VARCHAR(50) NULL,
    `shopcode` VARCHAR(20) NULL,
    `MRP` DECIMAL(20, 2) NULL,
    `Rate` DECIMAL(10, 2) NULL,
    `Deal` INTEGER NULL,
    `Free` INTEGER NULL,
    `PRate` DECIMAL(10, 2) NULL,
    `Is_Deleted` BOOLEAN NOT NULL,
    `curbatch` VARCHAR(50) NULL,
    `exp` DATETIME(3) NULL,
    `gcode` VARCHAR(10) NULL,
    `MargCode` VARCHAR(20) NULL,
    `Conversion` INTEGER NULL,
    `Salt` VARCHAR(20) NULL,
    `ENCODE` VARCHAR(20) NULL,
    `remarks` VARCHAR(255) NULL,
    `Gcode6` VARCHAR(10) NULL,
    `ProductCode` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`rid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pro_r` (
    `code` INTEGER NOT NULL,
    `stock` INTEGER NOT NULL,
    `MRP` DECIMAL(20, 2) NULL,
    `Rate` DECIMAL(10, 2) NULL,
    `Deal` INTEGER NULL,
    `Free` INTEGER NULL,
    `PRate` DECIMAL(10, 2) NULL,
    `ProductCode` VARCHAR(255) NULL,
    `Curbatch` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pro_s` (
    `code` VARCHAR(255) NOT NULL,
    `stock` VARCHAR(255) NULL,
    `ProductCode` VARCHAR(50) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pro_u` (
    `rid` INTEGER NOT NULL,
    `catcode` VARCHAR(15) NULL,
    `code` INTEGER NULL,
    `name` VARCHAR(100) NULL,
    `stock` INTEGER NULL,
    `remark` VARCHAR(100) NULL,
    `company` VARCHAR(50) NULL,
    `shopcode` VARCHAR(50) NULL,
    `MRP` DECIMAL(10, 2) NULL,
    `Rate` DECIMAL(10, 2) NULL,
    `Deal` INTEGER NULL,
    `Free` INTEGER NULL,
    `PRate` DECIMAL(10, 2) NULL,
    `Is_Deleted` BOOLEAN NOT NULL,
    `curbatch` VARCHAR(50) NULL,
    `exp` DATETIME(3) NULL,
    `gcode` VARCHAR(10) NULL,
    `MargCode` VARCHAR(20) NULL,
    `Conversion` INTEGER NULL,
    `Salt` VARCHAR(10) NULL,
    `ENCODE` VARCHAR(255) NULL,
    `remarks` VARCHAR(255) NULL,
    `Gcode6` VARCHAR(10) NULL,
    `ProductCode` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`rid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `ID` INTEGER NOT NULL,
    `CompanyID` INTEGER NULL,
    `PID` INTEGER NOT NULL,
    `Code` VARCHAR(50) NULL,
    `Name` VARCHAR(255) NULL,
    `Unit` VARCHAR(255) NULL,
    `Pack` INTEGER NULL,
    `GCode` VARCHAR(10) NULL,
    `GCode3` VARCHAR(10) NULL,
    `GCode5` VARCHAR(10) NULL,
    `GCode6` VARCHAR(10) NULL,
    `GST` INTEGER NULL,
    `MargCode` VARCHAR(20) NULL,
    `AddField` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `product_ID_key`(`ID`),
    PRIMARY KEY (`PID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `saletype` (
    `ID` INTEGER NOT NULL,
    `CompanyID` INTEGER NULL,
    `SGCode` VARCHAR(20) NULL,
    `SCode` VARCHAR(20) NULL,
    `Name` VARCHAR(255) NULL,
    `Main` VARCHAR(10) NULL,
    `MargCode` VARCHAR(50) NULL,
    `AddField` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stock` (
    `ID` INTEGER NOT NULL,
    `CompanyID` INTEGER NULL,
    `PID` INTEGER NULL,
    `GCode` VARCHAR(10) NULL,
    `Batch` VARCHAR(50) NULL,
    `BatDate` DATETIME(3) NULL,
    `BatDet` VARCHAR(100) NULL,
    `Expiry` DATETIME(3) NULL,
    `SupInvo` VARCHAR(20) NULL,
    `SupDate` DATETIME(3) NULL,
    `SupCode` VARCHAR(255) NULL,
    `Opening` INTEGER NULL,
    `Stock` INTEGER NULL,
    `BrkStock` INTEGER NULL,
    `LPRate` DECIMAL(10, 2) NULL,
    `PRate` DECIMAL(10, 2) NULL,
    `MRP` DECIMAL(20, 2) NULL,
    `RateA` DECIMAL(10, 2) NULL,
    `RateB` DECIMAL(10, 2) NULL,
    `RateC` DECIMAL(10, 2) NULL,
    `AddField` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `stype` (
    `rid` INTEGER NOT NULL,
    `sgcode` VARCHAR(10) NULL,
    `scode` VARCHAR(10) NULL,
    `name` VARCHAR(255) NULL,
    `Is_Deleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`rid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `RowID` INTEGER NOT NULL,
    `UserID` VARCHAR(255) NULL,
    `Name` VARCHAR(255) NULL,
    `Address1` VARCHAR(255) NULL,
    `Address2` VARCHAR(255) NULL,
    `Address3` VARCHAR(255) NULL,
    `Phone` VARCHAR(255) NULL,
    `Mobile` VARCHAR(255) NULL,
    `Email` VARCHAR(255) NULL,
    `Is_Deleted` BOOLEAN NOT NULL DEFAULT false,
    `Type` VARCHAR(5) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`RowID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dispatch` (
    `id` VARCHAR(191) NOT NULL,
    `challanNo` VARCHAR(191) NOT NULL,
    `challanDate` DATETIME(3) NULL,
    `partyCode` VARCHAR(191) NULL,
    `partyName` VARCHAR(191) NOT NULL,
    `partyPlace` VARCHAR(191) NULL,
    `orderAmt` DOUBLE NULL,
    `transportName` VARCHAR(191) NULL,
    `lrNo` VARCHAR(191) NULL,
    `lrDate` DATETIME(3) NULL,
    `numberofCases` INTEGER NULL,
    `salesRep` VARCHAR(191) NULL,
    `invoiceNo` VARCHAR(191) NULL,
    `invoiceDate` DATETIME(3) NULL,
    `totalItems` INTEGER NULL,
    `totalQty` INTEGER NULL,
    `packingTime` DATETIME(3) NULL,
    `orderStatus` VARCHAR(191) NULL,
    `remarks` VARCHAR(191) NULL,
    `tags` JSON NULL,
    `Voucher` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Dispatch_challanNo_key`(`challanNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `authProviderId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
