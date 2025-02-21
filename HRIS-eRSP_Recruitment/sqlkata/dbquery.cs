using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HRIS_eRSP_Recruitment.sqlkata
{
    public class appl
    {
        public string item_no                {get;set;} 
        public string department_code        {get;set;}
        public string department_name1       {get;set;}
        public string subdepartment_name1 { get; set; }
        public string division_name1         { get; set; }
        public string section_name1 { get; set; }


    }
    public class dbquery
    {

        public dbquery()
        {
           
        }

        public L DisplayInfo()
        {
            Console.WriteLine($"Name: {name}, Age: {age}");
        }

    }
}