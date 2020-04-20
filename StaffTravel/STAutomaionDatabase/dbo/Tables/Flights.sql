CREATE TABLE [dbo].[Flights] (
    [id]             INT             IDENTITY (1, 1) NOT NULL,
    [departDate]     DATETIME        NULL,
    [departFrom]     NVARCHAR (50)   NULL,
    [departTo]       NVARCHAR (50)   NULL,
    [departFlight]   NVARCHAR (50)   NULL,
    [returnDate]     DATETIME        NULL,
    [returnFrom]     NVARCHAR (50)   NULL,
    [returnTo]       NVARCHAR (50)   NULL,
    [returnFlight]   NVARCHAR (50)   NULL,
    [status]         INT             NULL,
    [approvalStatus] INT             NULL,
    [price]          DECIMAL (18, 2) NULL,
    [requestId]      INT             NOT NULL,
    CONSTRAINT [PK_Flights] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_Flights_Requests] FOREIGN KEY ([requestId]) REFERENCES [dbo].[Requests] ([id])
);

