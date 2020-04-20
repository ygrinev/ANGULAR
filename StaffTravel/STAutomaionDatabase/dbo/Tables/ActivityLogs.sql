CREATE TABLE [dbo].[ActivityLogs] (
    [id]           INT            IDENTITY (1, 1) NOT NULL,
    [updateType]   INT            NOT NULL,
    [updatedOn]    DATETIME       NOT NULL,
    [empName]      NVARCHAR (100) NOT NULL,
    [empNumber]    NVARCHAR (50)  NOT NULL,
    [sectionType]  INT            NOT NULL,
    [userType]     INT            NOT NULL,
    [statusChange] INT            NULL,
    [text]         NVARCHAR (MAX) NULL,
    [foreignId]    INT            NOT NULL,
    [requestId]    INT            NOT NULL,
    CONSTRAINT [PK_ActivityLogs] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_ActivityLogs_Requests] FOREIGN KEY ([requestId]) REFERENCES [dbo].[Requests] ([id])
);

