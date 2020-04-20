CREATE TABLE [dbo].[PassesBalance] (
    [employeeNumber] VARCHAR (20) NOT NULL,
    [type]           VARCHAR (10) NOT NULL,
    [used]           INT          NOT NULL,
    [updateDate]     DATETIME     NOT NULL,
    [status]         VARCHAR (10) NULL,
    [year]           VARCHAR (10) NOT NULL,
    CONSTRAINT [PK_PassesBalance] PRIMARY KEY CLUSTERED ([employeeNumber] ASC, [type] ASC, [year] ASC)
);



