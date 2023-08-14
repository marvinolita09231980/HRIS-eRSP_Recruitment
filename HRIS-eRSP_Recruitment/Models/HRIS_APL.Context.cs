﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    
    public partial class HRIS_APLEntities : DbContext
    {
        public HRIS_APLEntities()
            : base("name=HRIS_APLEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<personnel_children_tbl> personnel_children_tbl { get; set; }
        public virtual DbSet<personnel_conflict_tbl> personnel_conflict_tbl { get; set; }
        public virtual DbSet<personnel_contact_id_tbl> personnel_contact_id_tbl { get; set; }
        public virtual DbSet<personnel_csceligibilty_tbl> personnel_csceligibilty_tbl { get; set; }
        public virtual DbSet<personnel_educ_tbl> personnel_educ_tbl { get; set; }
        public virtual DbSet<personnel_learnanddevt_tbl> personnel_learnanddevt_tbl { get; set; }
        public virtual DbSet<personnel_register_tbl> personnel_register_tbl { get; set; }
        public virtual DbSet<personnel_tbl> personnel_tbl { get; set; }
        public virtual DbSet<personnel_usersprofile_tbl> personnel_usersprofile_tbl { get; set; }
        public virtual DbSet<personnel_voluntarywork_tbl> personnel_voluntarywork_tbl { get; set; }
        public virtual DbSet<personnel_workexprnce_tbl> personnel_workexprnce_tbl { get; set; }
        public virtual DbSet<personneladdresses_tbl> personneladdresses_tbl { get; set; }
        public virtual DbSet<personnelnames_tbl> personnelnames_tbl { get; set; }
        public virtual DbSet<available_item_hdr_tbl> available_item_hdr_tbl { get; set; }
        public virtual DbSet<available_item_tbl> available_item_tbl { get; set; }
        public virtual DbSet<adds_images_tbl> adds_images_tbl { get; set; }
        public virtual DbSet<onlineApplicants_register_tbl> onlineApplicants_register_tbl { get; set; }
    
        public virtual int sp_remove_availableitemhdrdtlapl(string p_ctrl_no)
        {
            var p_ctrl_noParameter = p_ctrl_no != null ?
                new ObjectParameter("p_ctrl_no", p_ctrl_no) :
                new ObjectParameter("p_ctrl_no", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_remove_availableitemhdrdtlapl", p_ctrl_noParameter);
        }
    
        public virtual int sp_activate_availableitemapl_all(string p_ctrl_no)
        {
            var p_ctrl_noParameter = p_ctrl_no != null ?
                new ObjectParameter("p_ctrl_no", p_ctrl_no) :
                new ObjectParameter("p_ctrl_no", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_activate_availableitemapl_all", p_ctrl_noParameter);
        }
    
        public virtual int sp_deactive_availableitemaplall(string p_ctrl_no)
        {
            var p_ctrl_noParameter = p_ctrl_no != null ?
                new ObjectParameter("p_ctrl_no", p_ctrl_no) :
                new ObjectParameter("p_ctrl_no", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_deactive_availableitemaplall", p_ctrl_noParameter);
        }
    
        public virtual int sp_remove_availableitemapl(string p_ctrl_no, string p_item_no, string p_budget_code, string p_employment_type)
        {
            var p_ctrl_noParameter = p_ctrl_no != null ?
                new ObjectParameter("p_ctrl_no", p_ctrl_no) :
                new ObjectParameter("p_ctrl_no", typeof(string));
    
            var p_item_noParameter = p_item_no != null ?
                new ObjectParameter("p_item_no", p_item_no) :
                new ObjectParameter("p_item_no", typeof(string));
    
            var p_budget_codeParameter = p_budget_code != null ?
                new ObjectParameter("p_budget_code", p_budget_code) :
                new ObjectParameter("p_budget_code", typeof(string));
    
            var p_employment_typeParameter = p_employment_type != null ?
                new ObjectParameter("p_employment_type", p_employment_type) :
                new ObjectParameter("p_employment_type", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_remove_availableitemapl", p_ctrl_noParameter, p_item_noParameter, p_budget_codeParameter, p_employment_typeParameter);
        }
    
        public virtual int sp_deactive_availableitemapl(string p_ctrl_no, string p_item_no, string p_budget_code, string p_employment_type)
        {
            var p_ctrl_noParameter = p_ctrl_no != null ?
                new ObjectParameter("p_ctrl_no", p_ctrl_no) :
                new ObjectParameter("p_ctrl_no", typeof(string));
    
            var p_item_noParameter = p_item_no != null ?
                new ObjectParameter("p_item_no", p_item_no) :
                new ObjectParameter("p_item_no", typeof(string));
    
            var p_budget_codeParameter = p_budget_code != null ?
                new ObjectParameter("p_budget_code", p_budget_code) :
                new ObjectParameter("p_budget_code", typeof(string));
    
            var p_employment_typeParameter = p_employment_type != null ?
                new ObjectParameter("p_employment_type", p_employment_type) :
                new ObjectParameter("p_employment_type", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_deactive_availableitemapl", p_ctrl_noParameter, p_item_noParameter, p_budget_codeParameter, p_employment_typeParameter);
        }
    
        public virtual int sp_activate_availableitemapl(string p_ctrl_no, string p_item_no, string p_budget_code, string p_employment_type)
        {
            var p_ctrl_noParameter = p_ctrl_no != null ?
                new ObjectParameter("p_ctrl_no", p_ctrl_no) :
                new ObjectParameter("p_ctrl_no", typeof(string));
    
            var p_item_noParameter = p_item_no != null ?
                new ObjectParameter("p_item_no", p_item_no) :
                new ObjectParameter("p_item_no", typeof(string));
    
            var p_budget_codeParameter = p_budget_code != null ?
                new ObjectParameter("p_budget_code", p_budget_code) :
                new ObjectParameter("p_budget_code", typeof(string));
    
            var p_employment_typeParameter = p_employment_type != null ?
                new ObjectParameter("p_employment_type", p_employment_type) :
                new ObjectParameter("p_employment_type", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_activate_availableitemapl", p_ctrl_noParameter, p_item_noParameter, p_budget_codeParameter, p_employment_typeParameter);
        }
    }
}
