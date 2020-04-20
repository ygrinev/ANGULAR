create proc [dbo].[spGetFailCount]
as
select count(name) failcount from employee_temp_error where convert(varchar(10),UpdateDate,110)=convert(varchar(10),getdate(),110)

