CREATE TABLE [dbo].[Email] (
    [Id]          INT            IDENTITY (1, 1) NOT NULL,
    [MailType]    VARCHAR (100)  NOT NULL,
    [MailSubject] VARCHAR (1000) NOT NULL,
    [MailMessage] TEXT           NOT NULL,
    [MailSender]  VARCHAR (100)  NULL,
    [MailTo]      VARCHAR (100)  NULL,
    CONSTRAINT [PK_Email] PRIMARY KEY CLUSTERED ([Id] ASC)
);

