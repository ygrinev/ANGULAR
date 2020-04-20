
CREATE PROCEDURE [dbo].[spImportFileToTable] 
AS
BEGIN

	--error check
	INSERT INTO employee_temp_error
	   SELECT *,'no employee number',getdate() FROM employee_temp 
	    WHERE ENumber=''

	INSERT INTO employee_temp_error
	   SELECT *,'no seniority date',getdate() FROM employee_temp 
	    WHERE SeniorityDate=''

    INSERT INTO employee_temp_error
	   SELECT *,'no eligibility',getdate() FROM employee_temp 
	    WHERE Eligibility=''

    INSERT INTO employee_temp_error
	   SELECT *,'no full-time info',getdate() FROM employee_temp 
	    WHERE IsFullTime=''
			
    INSERT INTO employee_temp_error
	   SELECT *,'no email address',getdate() FROM employee_temp 
	    WHERE Email=''
		
	DELETE employee_temp 
	   WHERE ENumber='' or SeniorityDate='' or Eligibility='' or IsFullTime='' or Email=''

	--update issending column with exist records
    UPDATE Employee
	   SET IsSending=0
	   WHERE empnumber in (SELECT EmpNumber FROM Employee a
				INNER JOIN employee_temp b on a.EmpNumber=b.ENumber
				WHERE a.Eligibility=0 and b.Eligibility='Yes')

	--update status=1 if records are existing both location(Ultipro file and employee table)
	UPDATE employee
	   SET [status]=1
	   WHERE EmpNumber in (
	      SELECT EmpNumber 
		    FROM employee a INNER JOIN employee_temp b ON a.EmpNumber=b.ENumber )
	
	--deleted records from ultipro file
	UPDATE employee
	   SET [status]=0
	   WHERE EmpNumber in (
	      SELECT EmpNumber 
		    FROM employee a LEFT JOIN employee_temp b ON a.EmpNumber=b.ENumber 
			WHERE b.ENumber IS NULL)

	--modify records :exist so update...	
	UPDATE a
	   SET a.email=b.email, a.ManagerEmpNumber=b.ManagerId, 
	     a.eligibility=CASE b.Eligibility WHEN 'Yes' THEN 1 WHEN 'No' THEN 0 END, 
		 a.updatedate=getdate(), a.SeniorityDate=b.SeniorityDate, a.Organization=b.OrgLv, a.CompanyCode=b.Company, a.[Language]=b.[Language]
    FROM employee a
    INNER JOIN employee_temp b ON a.EmpNumber=b.ENumber
	where [status]=1

	--new added : status=>true (1),  sending email=>false(0) (so that email console can pick up new records)
	INSERT INTO employee (EmpNumber, lastname, firstname, Email, ManagerEmpNumber, SeniorityDate, Organization, companycode,UpdateDate,Eligibility, IsFullTime, [Language], IsSending, [status])  
	 SELECT enumber, 
	   SUBSTRING(name,0,CHARINDEX(',',name)) as lastname,
	   SUBSTRING(name,CHARINDEX(',',name)+2,LEN(name)) as firstname, 
	   email, managerid, senioritydate, orglv,company,getdate(),
	   CASE Eligibility WHEN 'Yes' THEN 1 WHEN 'No' THEN 0 END AS eligibility,
	   CASE isfulltime WHEN 'Full Time' THEN 1 WHEN 'Part Time' THEN 0 END AS isfulltime,Language,0,1
	 FROM employee_temp WHERE ENumber in (SELECT b.ENumber FROM employee a
			RIGHT JOIN employee_temp b ON a.EmpNumber=b.ENumber 
			WHERE a.EmpNumber IS NULL)
END
