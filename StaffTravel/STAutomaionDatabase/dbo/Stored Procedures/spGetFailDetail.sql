/*exec [dbo].[spGetFailDetail]*/
CREATE proc [dbo].[spGetFailDetail]
as
select ENumber+' '+name+ ' [Reason to fail: '+Comment+']' faileddetail from employee_temp_error where convert(varchar(10),UpdateDate,110)=convert(varchar(10),getdate(),110)
