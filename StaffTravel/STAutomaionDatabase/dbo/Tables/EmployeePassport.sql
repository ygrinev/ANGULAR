CREATE TABLE [dbo].[EmployeePassport] (
    [ID]        INT           IDENTITY (1, 1) NOT NULL,
    [EmpNumber] VARCHAR (20)  NOT NULL,
    [FirstName] VARCHAR (50)  NOT NULL,
    [MidName]   VARCHAR (50)  NULL,
    [LastName]  VARCHAR (100) NOT NULL,
    CONSTRAINT [PK_EmployeePassport] PRIMARY KEY CLUSTERED ([ID] ASC)
);


GO
CREATE UNIQUE NONCLUSTERED INDEX [EmpNumber_EmployeePassport]
    ON [dbo].[EmployeePassport]([EmpNumber] ASC);

