//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace HRIS_eRSP_Recruitment.Models
{
    using System;
    
    public partial class sp_review_applicant_tbl_list3_Result
    {
        public string app_ctrl_nbr { get; set; }
        public string info_ctrl_nbr { get; set; }
        public string app_ctrl_nbr_disp { get; set; }
        public string app_address { get; set; }
        public string applied_dttm { get; set; }
        public string applied_year { get; set; }
        public string birth_date { get; set; }
        public Nullable<int> age { get; set; }
        public string gender { get; set; }
        public Nullable<bool> item_in_psb { get; set; }
        public Nullable<bool> psb_concluded { get; set; }
        public string last_name { get; set; }
        public string first_name { get; set; }
        public string lastname_start { get; set; }
        public string civil_status { get; set; }
        public string middle_name { get; set; }
        public string position_code { get; set; }
        public string position_long_title { get; set; }
        public string item_no { get; set; }
        public string applicant_name { get; set; }
        public string employment_type { get; set; }
        public string app_status { get; set; }
        public Nullable<bool> is_employee { get; set; }
        public string budget_code { get; set; }
        public string empl_id { get; set; }
        public string approval_id { get; set; }
        public string psb_ctrl_nbr { get; set; }
        public System.DateTime psb_date { get; set; }
        public string remarks_details { get; set; }
        public Nullable<bool> btn_disabled { get; set; }
        public string email_address { get; set; }
        public string department_name1 { get; set; }
        public string department_code { get; set; }
        public string qs_eduction { get; set; }
        public string qs_work_experience { get; set; }
        public string qs_training { get; set; }
        public string qs_eligibility { get; set; }
        public byte[] empl_photo_img { get; set; }
        public string mobile_number { get; set; }
        public string email_add { get; set; }
        public string i_psb_ctrl_nbr { get; set; }
        public string hiring_period { get; set; }
        public string exam_type { get; set; }
        public string exam_date { get; set; }
        public System.TimeSpan exam_time { get; set; }
        public string exam_status { get; set; }
        public string email_aknowldge_dttm { get; set; }
        public string email_aknowldge_regret_dttm { get; set; }
        public string email_noti_exam_dttm { get; set; }
        public string email_noti_hrmpsb_dttm { get; set; }
        public string email_notintop5_dttm { get; set; }
        public int applicant_type { get; set; }
        public string applicant_type_descr { get; set; }
        public Nullable<bool> quali_onlineexam { get; set; }
        public Nullable<bool> quali_hrmpsb { get; set; }
        public Nullable<bool> top5examinees { get; set; }
        public Nullable<bool> congratulatory { get; set; }
        public double score_rendered { get; set; }
    }
}
