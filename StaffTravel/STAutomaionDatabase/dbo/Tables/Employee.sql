CREATE TABLE [dbo].[Employee] (
    [EmpNumber]        VARCHAR (20)  NOT NULL,
    [FirstName]        VARCHAR (50)  NOT NULL,
    [LastName]         VARCHAR (50)  NOT NULL,
    [Email]            VARCHAR (100) NOT NULL,
    [ManagerEmpNumber] VARCHAR (20)  NULL,
    [SeniorityDate]    DATETIME      NOT NULL,
    [Organization]     VARCHAR (100) NULL,
    [CompanyCode]      VARCHAR (20)  NULL,
    [CreationDate]     DATETIME      CONSTRAINT [DF_employee] DEFAULT (getdate()) NULL,
    [UpdateDate]       DATETIME      NULL,
    [RegisterDate]     DATETIME      NULL,
    [Eligibility]      INT           NOT NULL,
    [IsFullTime]       INT           NOT NULL,
    [IsSending]        INT           CONSTRAINT [DF_employee_IsSending] DEFAULT ((0)) NOT NULL,
    [Status]           INT           CONSTRAINT [DF_employee_status] DEFAULT ((0)) NOT NULL,
    [Language]         VARCHAR (10)  NULL,
    CONSTRAINT [PK_Employee] PRIMARY KEY CLUSTERED ([EmpNumber] ASC)
);

