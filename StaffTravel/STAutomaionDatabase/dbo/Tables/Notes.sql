CREATE TABLE [dbo].[Notes] (
    [id]        INT            IDENTITY (1, 1) NOT NULL,
    [enteredBy] NVARCHAR (50)  NULL,
    [enteredOn] DATETIME       NULL,
    [text]      NVARCHAR (MAX) NULL,
    [sectionId] INT            NULL,
    [typeId]    INT            NULL,
    [requestId] INT            NOT NULL,
    CONSTRAINT [PK_Notes] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_Notes_Requests] FOREIGN KEY ([requestId]) REFERENCES [dbo].[Requests] ([id])
);

