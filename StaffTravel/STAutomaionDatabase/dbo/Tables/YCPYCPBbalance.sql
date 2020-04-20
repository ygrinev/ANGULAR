CREATE TABLE [dbo].[YCPYCPBbalance] (
    [Employee Name (Last Suffix, First MI)] NVARCHAR (255) NULL,
    [Employee Number]                       NVARCHAR (255) NULL,
    [Email]                                 NVARCHAR (255) NULL,
    [Seniority Date]                        DATETIME       NULL,
    [Manager ID]                            NVARCHAR (255) NULL,
    [Org Level 3]                           NVARCHAR (255) NULL,
    [Company Code]                          NVARCHAR (255) NULL,
    [Full/Part Time]                        NVARCHAR (255) NULL,
    [Accrual Code]                          NVARCHAR (255) NULL,
    [Accrual Option Code]                   NVARCHAR (255) NULL,
    [Allowed (Current Balance)]             FLOAT (53)     NULL,
    [Pending]                               FLOAT (53)     NULL,
    [Taken]                                 FLOAT (53)     NULL,
    [Available Balance]                     FLOAT (53)     NULL
);

