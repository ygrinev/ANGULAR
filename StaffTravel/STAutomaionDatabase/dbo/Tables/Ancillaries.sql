CREATE TABLE [dbo].[Ancillaries] (
    [id]                   INT             IDENTITY (1, 1) NOT NULL,
    [ancillaryProductType] INT             NULL,
    [destination]          NVARCHAR (50)   NULL,
    [status]               INT             NULL,
    [excursionDate]        DATE            NULL,
    [excursionName]        NVARCHAR (50)   NULL,
    [transferType]         INT             NULL,
    [insuranceType]        INT             NULL,
    [passengerNumber]      INT             NULL,
    [approvalStatus]       INT             NULL,
    [quantity]             NUMERIC (18)    NULL,
    [price]                DECIMAL (18, 2) NULL,
    [requestId]            INT             NOT NULL,
    CONSTRAINT [PK_Ancillaries] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_Ancillaries_Requests] FOREIGN KEY ([requestId]) REFERENCES [dbo].[Requests] ([id])
);

