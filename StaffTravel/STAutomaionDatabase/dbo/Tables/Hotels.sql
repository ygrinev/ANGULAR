CREATE TABLE [dbo].[Hotels] (
    [id]             INT             IDENTITY (1, 1) NOT NULL,
    [checkInDate]    DATETIME        NULL,
    [duration]       INT             NULL,
    [destination]    NVARCHAR (50)   NULL,
    [name]           NVARCHAR (50)   NULL,
    [roomType]       NVARCHAR (50)   NULL,
    [status]         INT             NULL,
    [approvalStatus] INT             NULL,
    [price]          DECIMAL (18, 2) NULL,
    [requestId]      INT             NOT NULL,
    CONSTRAINT [PK_Hotels] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_Hotels_Requests] FOREIGN KEY ([requestId]) REFERENCES [dbo].[Requests] ([id])
);

