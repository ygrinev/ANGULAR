CREATE TABLE [dbo].[Passengers] (
    [id]              INT           IDENTITY (1, 1) NOT NULL,
    [firstName]       NVARCHAR (50) NULL,
    [middleName]      NVARCHAR (50) NULL,
    [lastName]        NVARCHAR (50) NULL,
    [DOB]             DATE          NULL,
    [typeOfPass]      INT           NULL,
    [phoneNumber]     NVARCHAR(50)  NULL,
    [email]           NVARCHAR (50) NULL,
    [passengerNumber] INT           NULL,
    [status]          INT           NULL,
    [approvalStatus]  INT           NULL,
    [requestId]       INT           NOT NULL,
    CONSTRAINT [PK_Passengers] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_Passengers_Requests] FOREIGN KEY ([requestId]) REFERENCES [dbo].[Requests] ([id])
);

