CREATE TABLE [dbo].[Requests] (
    [id]             INT           IDENTITY (1, 1) NOT NULL,
    [employeeNumber] NVARCHAR (50) NOT NULL,
    [requestDate]    DATETIME      NOT NULL,
    [status]         INT           NOT NULL,
    [reviewer]       NVARCHAR (50) NULL,
    [bookingNumber]  NUMERIC (18)  NULL,
    CONSTRAINT [PK_Requests] PRIMARY KEY CLUSTERED ([id] ASC)
);

