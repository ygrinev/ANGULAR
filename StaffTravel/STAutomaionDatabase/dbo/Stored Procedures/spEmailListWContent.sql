
/**exec spEmailListWContent 'RequestRegister' **/
CREATE PROC [dbo].[spEmailListWContent] 
   @mailType as Varchar(20)
 AS
 BEGIN
  --only new added records should be in this list
	SELECT EmpNumber, FirstName, LastName, a.email, b.MailSubject, b.MailMessage
	FROM employee a, email b
	WHERE IsSending=0 and [Status]=1 and a.Eligibility=1 and b.MailType=@mailType
 END


