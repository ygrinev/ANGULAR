CREATE TABLE [dbo].[PassesBonus] (
    [employeeNumber] VARCHAR (20) NOT NULL,
    [howmanybonus]   INT          NOT NULL,
    [ExpiryDate]     DATETIME     NOT NULL,
    CONSTRAINT [PK_PassesBonus] PRIMARY KEY CLUSTERED ([employeeNumber], [ExpiryDate])
);

/*
---for production database (yyztdcintsql1.sunwing.local)

ALTER TABLE PassesBonus
DROP CONSTRAINT PK_PassesBonus;

ALTER TABLE PassesBonus
ADD CONSTRAINT PK_PassesBonus PRIMARY KEY ([employeeNumber], [ExpiryDate]);

*/