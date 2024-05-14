-- 
--ALTER TABLE insider_outsider_applicant_tbl
--DROP CONSTRAINT PK_insider_outsider_applicant_tbl;
-- 
--ALTER TABLE insider_outsider_applicant_tbl
--ALTER COLUMN hiring_period VARCHAR(15) NOT NULL;
-- 
--ALTER TABLE insider_outsider_applicant_tbl
--ADD PRIMARY KEY(info_ctrl_nbr, hiring_period);


INSERT INTO insider_outsider_applicant_tbl
select DISTINCT
A.info_ctrl_nbr
    , 1
    , 'Insider'
    , A.created_dttm
    , A.info_ctrl_nbr
    , ''
    , ''
    , A.hiring_period
from HRIS_APL.DBO.onlineAppliedItem_tbl A
inner join HRIS_APL.DBO.personnelnames_tbl B
on B.empl_id = A.info_ctrl_nbr
left join HRIS_PAY.dbo.personnelnames_tbl C
on C.first_name = B.first_name
AND C.last_name = B.last_name
where budget_code = '2023-2'
AND CONVERT(DATE, A.created_dttm) > CONVERT(DATE, C.effective_date)
