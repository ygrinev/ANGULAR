CREATE TABLE [dbo].[employee_temp] (
    [Name]          VARCHAR (100) NOT NULL,
    [ENumber]       VARCHAR (50)  NOT NULL,
    [Email]         VARCHAR (100) NOT NULL,
    [SeniorityDate] VARCHAR (50)  NULL,
    [ManagerId]     VARCHAR (50)  NOT NULL,
    [OrgLv]         VARCHAR (100) NULL,
    [Company]       VARCHAR (20)  NULL,
    [Eligibility]   VARCHAR (10)  NOT NULL,
    [IsFullTime]    VARCHAR (20)  NOT NULL,
    [CreationDate]  VARCHAR (50)  CONSTRAINT [DF_employee_temp] DEFAULT (getdate()) NULL,
    [Language]      VARCHAR (10)  NULL
);

