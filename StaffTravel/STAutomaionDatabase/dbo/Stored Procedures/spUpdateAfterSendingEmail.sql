CREATE PROC [dbo].[spUpdateAfterSendingEmail]
 AS
 BEGIN
    --it requires to update records that are only true of eligibility and status 
	UPDATE Employee
	SET IsSending=1, UpdateDate=GETDATE()
	WHERE IsSending=0 and [status]=1 and Eligibility=1
 END

