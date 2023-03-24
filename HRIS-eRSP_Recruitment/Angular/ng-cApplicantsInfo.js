
ng_eRSP_App.controller("cApplicantsInfo_Ctrlr", function (commonScript,$scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript
    s.search_name = ""
    s.header_title = "APPLICANT LIST"
    s.modal = 1
    s.rowLen = ""
    s.doc_type = ""
    s.pay = false
    s.apl = false
    s.present = false
    s.pageTitle = "Applicant Information"
    s.main_edit = false
    s.dtl_edit = false
    s.dropzone = false
    s.editonly = false
    s.adddetails = false
    s.hidesave = false
    s.allow_type_id = true;
    s.applicantinfo = true
    s.attach = "active"
    s.employment_type = ""
    s.budget_year = []
    s.budget_code = ""
    s.next_infoctrlnbr = ""
    s.hasdetails = false
    s.info_ctrl_nbr = ""
    s.savebtn = "save"
    s.year = []
    s.items = []
    s.res_data = []
    s.hiring_period = []
    s.applicants_data = []
    s.DATA = {}
    s.um = {}
    s.apl_info_nbr =""
    s.filter_show = false
    s.toggle_data_btn = false;
    s.empl_id = ""
    s.empl_id_added = false
    s.addapplicanttitle = ""
    s.last_name= ""
    s.fd = {
         app_ctrl_nbr        : ""
        ,app_ctrl_nbr_disp   : ""
        ,last_name           : ""
        ,first_name          : ""
        ,middle_name         : ""
        ,birth_date          : ""
        ,gender              : ""
        ,civil_status        : ""
        ,app_address         : ""
        ,appointment_type    : ""
        ,applied_dttm        : ""
        ,applied_year        : ""
        ,applicant_name      : ""
        ,applicant_type      : ""
        ,app_status          : ""
        ,empl_id             : ""  
        ,appl_date_applied   : ""
        ,appl_birth_date: ""
    }

    s.encode_idv = function (d, a, e, b, c, f) {

        c = "";
        try {

            for (a = e = b = 0; a < 4 * d.length / 3; f = b >> 2 * (++a & 3) & 63, c += String.fromCharCode(f + 71 - (f < 26 ? 6 : f < 52 ? 0 : f < 62 ? 75 : f ^ 63 ? 90 : 87)) + (75 == (a - 1) % 76 ? "\r\n" : ""))a & 3 ^ 3 && (b = b << 8 ^ d[e++]); for (; a++ & 3;)c += "=";
           
            if (c.toString().trim() == "") {
                c = "../ResourcesImages/149071.png";
            }
            else {
                c = "data:image/png;base64," + c;
            }
        } catch (e) {
            
            c = "../ResourcesImages/149071.png";
           
        }
        return c;
    }
    

    s.itm = {
         employment_type: ""
       , budget_code: ""
       , item_no: ""
       , ctrl_nbr: ""
       , position_code: ""
       , department_code: ""
       , department_name1: ""
    }

    s.wx = {}
    s.ld = {}
    s.el = {}
    s.ed = {}

    s.docname = []
    var appl = []
    var educ = []
    var lnd = []
    
    var wexp = []
    var elig = []
    s.Applicant_List_Data2_orig = []
    s.month = [
        { id: "01", text: "January" },
        { id: "02", text: "February" },
        { id: "03", text: "March" },
        { id: "04", text: "April" },
        { id: "05", text: "May" },
        { id: "06", text: "June" },
        { id: "07", text: "July" },
        { id: "08", text: "August" },
        { id: "09", text: "September" },
        { id: "10", text: "October" },
        { id: "11", text: "November" },
        { id: "12", text: "December" },
    ]
    s.year = cs.RetrieveYear()
    s.fd.app_type = 'N'
     
    s.status = [
        { id: '', text: '' },
        {id: 'RC', text: 'Received'},
        {id: 'WS', text: 'Waiting List'},
        {id: 'SL', text: 'Short List'},
        {id: 'PS', text: 'PSB Screened'},
        {id: 'AP', text: 'Approved'}]
    s.AT = [
         { id: '', text: '' },
         { id: 'JO', text: 'Job Order' },
        { id: 'RE', text: 'Permanent' },
         { id: 'CE', text: 'CASUAL' }]
    s.alphabet_list = [
       {  alpha_name: 'A' }, {  alpha_name: 'B' }, {  alpha_name: 'C' }, {  alpha_name: 'D' }, { alpha_name: 'E' }, {  alpha_name: 'F' },
       {  alpha_name: 'G' }, {  alpha_name: 'H' }, {  alpha_name: 'I' }, {  alpha_name: 'J' }, { alpha_name: 'K' }, {  alpha_name: 'L' },
       {  alpha_name: 'M' }, {  alpha_name: 'N' }, {  alpha_name: 'O' }, {  alpha_name: 'P' }, { alpha_name: 'Q' }, {  alpha_name: 'R' },
       {  alpha_name: 'S' }, {  alpha_name: 'T' }, {  alpha_name: 'U' }, {  alpha_name: 'V' }, { alpha_name: 'W' }, {  alpha_name: 'X' },
       {  alpha_name: 'Y' }, {  alpha_name: 'Z' }
    ]

    s.svc = [{ id:false, text: 'No' }, { id: true, text: 'Yes' }]
   
    s.Applicant_List_Data_Orig = []
    var Init_Applicant_List_Grid = function (par_data) {
        s.Applicant_List_Data = par_data;
        s.Applicant_List_Table = $('#Applicant_List_Grid').dataTable(
            {
                data: s.Applicant_List_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                initComplete: function () {
                    cs.loading("hide")
                },
                drawCallback: function () {
                    cs.loading("hide")
                },
                columns: [
                    {
                        
                        "mData": "info_ctrl_nbr_disp",
                        "mRender": function (data, type, full, row)
                        {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "applicant_name",
                        "mRender": function (data, type, full, row) {
                            //return "<span><img alt='image'  class='img-circle grid-img' src='" + s.encode_idv(full["empl_photo_img"]) + "'></span>&nbsp;&nbsp;<span class='text-left'>" + data + "</span>"
                            return "<span class='text-left'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "applied_dttm",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "gender_descr",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "age",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "civil_status_descr",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "enabled",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-success btn-sm action" data-toggle="tab" href="#tab-7" ng-click="add_to_review(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Add To Review">  <i class="fa fa-plus"></i></button >' +
                                '<button  type="button" class="btn btn-info btn-sm action" data-toggle="tab" href="#tab-7" ng-click="btn_edit(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Edit">  <i class="fa fa-edit"></i></button >' +
                                '<button  type="button" class="btn btn-warning btn-sm action" ng-click="btn_to_details(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Qualification">   <i id="det_row' + row["row"] + '" class="fa fa-bars"></i></button>' +
                                '<button  type="button" class="btn btn-danger btn-sm action" ng-click="btn_del_row_main_grid(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Delete">   <i class="del_row' + row["row"] + ' fa fa-trash"></i></button>' +
                                '</div></center>';
                        }
                    }
                     //data-toggle="tab" href="#tab-7"
                ],
                "createdRow": function (row, data, index) {
                    //$(row).addClass("dt-row");
                    $compile(row)($scope);  //add this to compile the DOM
                },

            });

        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }

   
   
    s.ddl_educ_type = []
 
    s.ed = {
        educ_type: ""
       , school_name: ""
       , basic_educ_deg: ""
       , period_from: ""
       , period_to: ""
       , highest_lvl_earned: ""
       , year_graduated: ""
       , schlr_acdmic_rcvd: ""
    }

    var Init_Education_List_Grid = function (par_data) {
        s.Education_List_Data = par_data;
        s.Education_List_Table = $('#appl_edu_grid').dataTable(
            {
                data: s.Education_List_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "school_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "basic_educ_deg",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "period_from",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "period_to",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "year_graduated",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-info btn-sm action" ng-click="educ_edit_action(' + row["row"] + ')" >  <i class="fa fa-edit"></i></button >' +
                                '<button  type="button" class="btn btn-danger btn-sm action" ng-click="educ_del_row(' + row["row"] + ')">   <i id="educ_del_row' + row["row"] + '" class="fa fa-trash"></i></button>' +
                                '</div></center>';
                        }
                    }

                ],
                "createdRow": function (row, data, index) {
                    //$(row).addClass("dt-row");
                    $compile(row)($scope);  //add this to compile the DOM
                },

            });

        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }



   
    s.el = {
         cscsrvc_ra1080 : ""
       , rating : ""
       , examination_date   : ""
       , examination_place  : ""
       , number : ""
       , validity_date  : ""
    }

    var Init_Eligibility_List_Grid = function (par_data) {
        s.Eligibility_List_Data = par_data;
        s.Eligibility_List_Table = $('#appl_elegib_grid').dataTable(
            {
                data: s.Eligibility_List_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "number",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "cscsrvc_ra1080",
                        "mRender": function (data, type, full, row) { return "<span class='text-center btn-block'>" + data + "</span>" }
                    },

                    {
                        "mData": "rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "validity_date",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-info btn-sm action" ng-click="elig_edit_action(' + row["row"] + ')" >  <i class="fa fa-edit"></i></button >' +
                                '<button  type="button" class="btn btn-danger btn-sm action" ng-click="elig_del_row(' + row["row"] + ')">   <i id="elig_del_row' + row["row"] + '" class="fa fa-trash"></i></button>' +
                                '</div></center>';
                        }
                    }

                ],
                "createdRow": function (row, data, index) {
                    //$(row).addClass("dt-row");
                    $compile(row)($scope);  //add this to compile the DOM
                },

            });

        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }

    var Init_select_applicant_Grid = function (par_data) {
        s.select_applicant_Data = par_data;
        s.select_applicant_Table = $('#select_id_employee_grid').dataTable(
            {
                data: s.select_applicant_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "empl_id",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "last_name",
                        "mRender": function (data, type, full, row) { return "<span class='text-center btn-block'>" + data + "</span>" }
                    },

                    {
                        "mData": "first_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "birth_date",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-success btn-sm action" ng-click="select_applicant_btn(' + row["row"] + ')" >  <i class="fa fa-plus"></i>&nbsp;&nbsp;Update</button >' +
                                '</div></center>';
                        }
                    }

                ],
                "createdRow": function (row, data, index) {
                    //$(row).addClass("dt-row");
                    $compile(row)($scope);  //add this to compile the DOM
                },

            });

        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }

    var Init_select_applicant_APL_Grid = function (par_data) {
        s.select_applicant_APL_Data = par_data;
        s.select_applicant_APL_Table = $('#select_id_employee_APL_grid').dataTable(
            {
                data: s.select_applicant_APL_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "empl_id",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "last_name",
                        "mRender": function (data, type, full, row) { return "<span class='text-center btn-block'>" + data + "</span>" }
                    },

                    {
                        "mData": "first_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "birth_date",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                  
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-success btn-sm action" ng-click="select_applicant_btn2(' + row["row"] + ')" >  <i class="fa fa-plus"></i>&nbsp;&nbsp;Add</button >' +
                                '</div></center>';
                        }
                    }

                ],
                "createdRow": function (row, data, index) {
                    //$(row).addClass("dt-row");
                    $compile(row)($scope);  //add this to compile the DOM
                },

            });

        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }

    var Init_select_applicant_APL_Grid = function (par_data) {
        s.select_applicant_PDS_Data = par_data;
        s.select_applicant_PDS_Table = $('#select_id_employee_PDS_grid').dataTable(
            {
                data: s.select_applicant_PDS_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "empl_id",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "last_name",
                        "mRender": function (data, type, full, row) { return "<span class='text-center btn-block'>" + data + "</span>" }
                    },

                    {
                        "mData": "first_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "birth_date",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-success btn-sm action" ng-click="updatefrompds(' + row["row"] + ')" >  <i class="fa fa-plus"></i>&nbsp;&nbsp;Update</button >' +
                                '</div></center>';
                        }
                    }

                ],
                "createdRow": function (row, data, index) {
                    //$(row).addClass("dt-row");
                    $compile(row)($scope);  //add this to compile the DOM
                },

            });

        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }
    var Init_select_applicant_QS_Grid = function (par_data) {
        s.select_applicant_QS_Data = par_data;
        s.select_applicant_QS_Table = $('#select_id_employee_QS_grid').dataTable(
            {
                data: s.select_applicant_QS_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "empl_id",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "last_name",
                        "mRender": function (data, type, full, row) { return "<span class='text-center btn-block'>" + data + "</span>" }
                    },

                    {
                        "mData": "first_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "birth_date",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-success btn-sm action" ng-click="updatefromqspds(' + row["row"] + ')" >  <i class="fa fa-plus"></i>&nbsp;&nbsp;Update</button >' +
                                '</div></center>';
                        }
                    }

                ],
                "createdRow": function (row, data, index) {
                    //$(row).addClass("dt-row");
                    $compile(row)($scope);  //add this to compile the DOM
                },

            });

        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }

    s.salgrade = []
    s.wx = {
        workexp_from: ""
            , workexp_to: ""
            , position_title: ""
            , dept_agncy_offc_co: ""
            , monthly_salary: ""
            , salary_job_grade: ""
            , appt_status: ""
            , gov_srvc: ""
    }
    var Init_Workexp_List_Grid = function (par_data) {
        s.Workexp_List_Data = par_data;
        s.Workexp_List_Table = $('#appl_workexp_grid').dataTable(
            {
                data: s.Workexp_List_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "workexp_from",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "workexp_to",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "position_title",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "dept_agncy_offc_co",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "gov_srvc",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-left btn-block'>" + serv(data) + "</span>"
                        }
                    },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-info btn-sm action" ng-click="exp_edit_action(' + row["row"] + ')" >  <i class="fa fa-edit"></i></button >' +
                                '<button  type="button" class="btn btn-danger btn-sm action" ng-click="exp_del_row(' + row["row"] + ')">   <i id="exp_del_row' + row["row"] + '" class="fa fa-trash"></i></button>' +
                                '</div></center>';
                        }
                    }

                ],
                "createdRow": function (row, data, index) {
                    //$(row).addClass("dt-row");
                    $compile(row)($scope);  //add this to compile the DOM
                },

            });

        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }


    s.ld = {
          learn_devt_title: ""
        , learn_devt_from: ""
        , learn_devt_to: ""
        , no_of_hrs: ""
        , learn_devt_type: ""
        , conducted_by: ""
    }

    var Init_LnD_List_Grid = function (par_data) {
        s.LnD_List_Data = par_data;
        s.LnD_List_Table = $('#appl_lnd_grid').dataTable(
            {
                data: s.LnD_List_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "learn_devt_title",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "learn_devt_from",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "learn_devt_to",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "no_of_hrs",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "learn_devt_type",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "conducted_by",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-info btn-sm action" ng-click="lnd_edit_action(' + row["row"] + ')" >  <i class="fa fa-edit"></i></button >' +
                                '<button  type="button" class="btn btn-danger btn-sm action" ng-click="lnd_del_row(' + row["row"] + ')">   <i id="lnd_del_row' + row["row"] + '" class="fa fa-trash"></i></button>' +
                                '</div></center>';
                        }
                    }

                ],
                "createdRow": function (row, data, index) {
                    //$(row).addClass("dt-row");
                    $compile(row)($scope);  //add this to compile the DOM
                },

            });

        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }


    function init() {

        $("#item_no").select2().on('change', function (e) {
            s.selectItem()
        });

       //cs.loading("show")
        var date = new Date();

        s.mo = cs.leadingZeroMonth(date.getMonth());
        s.yr = date.getFullYear().toString();
        s.dy = cs.leadingZeroDate(date.getDate());
       
        s.rowLen = "10"
        //h.post("../cApplicantsInfo/Initialize", { year: s.yr, month: s.mo }).then(function (d) {
       
        //    if (d.data.icon == "success") {
             
        //       // s.Applicant_List_Data = d.data.list.refreshTable("Applicant_List_Grid", "")

               
        //        s.um = d.data.um
        //        cs.loading("hide")
        //    }
        //})
    }

    Init_Applicant_List_Grid([])
    Init_Education_List_Grid([]);
    Init_Eligibility_List_Grid([]);
    Init_Workexp_List_Grid([]);
    Init_LnD_List_Grid([]);
    Init_select_applicant_Grid([]);
    Init_select_applicant_APL_Grid([]);
    Init_select_applicant_QS_Grid([]);
    init()

    s.AddApplicant = function () {
        s.toggle_data_btn = false;
        s.addapplicanttitle = "Add Applicant Information"
        s.savebtn = "save"
        cs.clearFields(s.fd)

        h.post("../cApplicantsInfo/GetApplicationNbr").then(function (d) {
            s.fd.info_ctrl_nbr_disp = cs.currentyear() + "-" + d.data.info_ctrl_nbr;
            s.info_ctrl_nbr = d.data.info_ctrl_nbr;
            $("#addApplicants").modal("show")
            $("#applied_dttm").val(s.yr + "-" + s.mo + "-" + s.dy);
        })
       
        //location.href = "cAddApplicants/Index";
    }
         
    s.Select_ApplType = function (val) {

        if (val == 1) {
            h.post("../cApplicantsInfo/getNewInfoCtrlNbr").then(function (d) {
                s.info_ctrl_nbr = d.data.next_infoctrlnbr
                s.fd.info_ctrl_nbr_disp = cs.currentyear() + "-" + d.data.next_infoctrlnbr;
                    cs.DisabledField("savebtn")
                    cs.DisabledAllFields(s.fd);
                    s.current_employee_name = ""
                    $("#choose_applicanttype").modal("show")
                    s.current_empl_id = ""
                    s.is_employee = val
                    cs.clearFields(s.fd)
                })
                
            }
            else if(val == 2)
            {
                location.href = "../cOnlineApplicantsList/Index";
            }
            else {
                cs.clearFields(s.fd)
                cs.EnabledField("savebtn")
                cs.EnabledAllFields(s.fd)
                $("#Applicant_List_Grid").dataTable().fnClearTable();
                s.current_empl_id = ""
                s.allow_type_id = false;
                s.is_employee = val
                s.fd.app_status = "RC"
            }
    }
    

    s.identifyidPDS = function () {
        var updateprofilebtn = "updateprofilebtn"
        var updateqsbtn = "updateqsbtn"
        var savebtn = "savebtn"
        var updateproficon = "updateproficon"
        var closebtn1 = "closebtn1"

        updateproficon.replaceClass("fa-caret-down", "fa-spinner fa-spin")
        updateprofilebtn.disabled()
        updateqsbtn.disabled()
        savebtn.disabled()
        closebtn1.disabled()
      
        var dt = s.applicants_data
      
        s.info_ctrl_nbr = dt.info_ctrl_nbr
       
        h.post("../cApplicantsInfo/getApplicantFromPDS", {
              first_name   : dt.first_name
            , last_name    : dt.last_name 
            , birth_date   : dt.birth_date
            , gender       : dt.gender    
        }).then(function (d) {
            if (d.data.apl_list.length > 0) {
                s.select_applicant_PDS_Data = d.data.apl_list.refreshTable("select_id_employee_PDS_grid", "")
                $("#select_id_employee_PDS").modal("show")
            }
            else {
                swal("No data found!", { icon: "warning", timer: 2000 })
            }
            updateproficon.replaceClass("fa-spinner fa-spin", "fa-caret-down")
            updateprofilebtn.enabled()
            updateqsbtn.enabled()
            savebtn.enabled()
            closebtn1.enabled()
           
        })
        
    }

    s.identifyidQS = function () {
        var updateqsicon = "updateqsicon"
        var updateprofilebtn = "updateprofilebtn"
        var updateqsbtn = "updateqsbtn"
        var savebtn = "savebtn"
        var closebtn1 = "closebtn1"

        updateqsicon.replaceClass("fa-caret-down", "fa-spinner fa-spin")
        updateprofilebtn.disabled()
        updateqsbtn.disabled()
        savebtn.disabled()
        closebtn1.disabled()

        var dt = s.applicants_data
      
        s.info_ctrl_nbr = dt.info_ctrl_nbr
        
        h.post("../cApplicantsInfo/getApplicantFromPDS", {
             first_name: dt.first_name
            , last_name: dt.last_name
            , birth_date: dt.birth_date
            , gender: dt.gender
        }).then(function (d) {
            if (d.data.apl_list.length > 0) {
                s.select_applicant_QS_Data = d.data.apl_list.refreshTable("select_id_employee_QS_grid", "")
                $("#select_id_employee_QS").modal("show")
            }
            else {
                swal("No data found!", { icon: "warning", timer: 2000 })
            }
            updateqsicon.replaceClass("fa-spinner fa-spin", "fa-caret-down")
            updateprofilebtn.enabled()
            updateqsbtn.enabled()
            savebtn.enabled()
            closebtn1.enabled()
        })
        
    }


    s.updateDataFrom = function (val) {
        var updateprofilebtn = "updateprofilebtn"
        var updateqsbtn = "updateqsbtn"
        var savebtn = "savebtn"
        var updateproficon = "updateproficon"
        var closebtn1 = "closebtn1"

        updateproficon.replaceClass("fa-caret-down","fa-spinner fa-spin")
        updateprofilebtn.disabled()
        updateqsbtn.disabled()
        savebtn.disabled()
        closebtn1.disabled()
        if (val == 1) {

            h.post("../cApplicantsInfo/UpdateDataFrom", {
                 info_ctrl_nbr : s.info_ctrl_nbr
                ,empl_id: s.empl_id
                , source: "PAY"
                , year: s.yr
                , month: s.mo
            }).then(function (d) {
               
                s.Applicant_List_Data = d.data.list.refreshTable("Applicant_List_Grid", "")
                if (d.data.returnUpdate == "Succesfully fetch applicant info from HRIS data") {
                    swal(d.data.returnUpdate, { icon: d.data.icon, timer: 2000})
                }
                else
                {
                    swal(d.data.returnUpdate, { icon: "error"})
                }
                updateproficon.replaceClass("fa-spinner fa-spin","fa-caret-down")
                updateprofilebtn.enabled()
                updateqsbtn.enabled()
                savebtn.enabled()
                closebtn1.enabled()
            })

        }
        else if (val == 2) {


            h.post("../cApplicantsInfo/UpdateDataFrom", {
                info_ctrl_nbr: s.info_ctrl_nbr
                ,empl_id: s.empl_id
                ,source: "APL"
                , year: s.yr
                , month: s.mo
            }).then(function (d) {
                s.Applicant_List_Data = d.data.list.refreshTable("Applicant_List_Grid", "")
                if (d.data.returnUpdate == "Succesfully fetch applicant info from Online Application data" ) {
                    swal(d.data.returnUpdate, { icon: d.data.icon,timer:2000})
                }
                else{
                    swal(d.data.returnUpdate, { icon: "error"})
                }
                updateproficon.replaceClass("fa-spinner fa-spin", "fa-caret-down")
                updateprofilebtn.enabled()
                updateqsbtn.enabled()
                savebtn.enabled()
                closebtn1.enabled()
              
            })
        }
    }

    s.updatefrompds = function (row) {
        var updateprofilebtn = "updateprofilebtn"
        var updateqsbtn = "updateqsbtn"
        var savebtn = "savebtn"
        var updateproficon = "updateproficon"
        var closebtn1 = "closebtn1"

        updateproficon.replaceClass("fa-caret-down", "fa-spinner fa-spin")
        updateprofilebtn.disabled()
        updateqsbtn.disabled()
        savebtn.disabled()
        closebtn1.disabled()

        var l = s.select_applicant_PDS_Data[row]
        $("#select_id_employee_PDS").modal("hide")
        h.post("../cApplicantsInfo/UpdateDataFrom2", {
            info_ctrl_nbr: s.info_ctrl_nbr
            , empl_id: l.empl_id
            , source: "PAY"
            , year: s.yr
            , month: s.mo
        }).then(function (d) {
            s.Applicant_List_Data = d.data.list.refreshTable("Applicant_List_Grid", "")
            swal(d.data.returnUpdate, { icon: d.data.icon })
           
            $("#addApplicants").modal("hide")
            updateproficon.replaceClass("fa-spinner fa-spin", "fa-caret-down")
            updateprofilebtn.enabled()
            updateqsbtn.enabled()
            savebtn.enabled()
            closebtn1.enabled()
        })
    }
    s.updatefromqspds = function (row) {
        var updateqsicon = "updateqsicon"
        var updateprofilebtn = "updateprofilebtn"
        var updateqsbtn = "updateqsbtn"
        var savebtn = "savebtn"
        var closebtn1 = "closebtn1"

        updateqsicon.replaceClass("fa-caret-down", "fa-spinner fa-spin")
        updateprofilebtn.disabled()
        updateqsbtn.disabled()
        savebtn.disabled()
        closebtn1.disabled()

        var l = s.select_applicant_QS_Data[row]
        $("#select_id_employee_QS").modal("hide")
        h.post("../cApplicantsReview/Updatefrompds", {
              info_ctrl_nbr: s.info_ctrl_nbr
            , empl_id: l.empl_id

        }).then(function (d) {
            swal(d.data.updatepds.output_message, { icon: d.data.icon })
            updateqsicon.replaceClass("fa-spinner fa-spin", "fa-caret-down")
            updateprofilebtn.enabled()
            updateqsbtn.enabled()
            savebtn.enabled()
            closebtn1.enabled()
        })
    }
    s.updatefromqsapl = function (row) {
        var updateqsicon = "updateqsicon"
        var updateprofilebtn = "updateprofilebtn"
        var updateqsbtn = "updateqsbtn"
        var savebtn = "savebtn"
        var closebtn1 = "closebtn1"

        updateqsicon.replaceClass("fa-caret-down", "fa-spinner fa-spin")
        updateprofilebtn.disabled()
        updateqsbtn.disabled()
        savebtn.disabled()
        closebtn1.disabled()

        var l = s.applicants_data
       
        if (l.empl_id.charAt(0) == "A") {
            h.post("../cApplicantsReview/Updatefromapl", {
                info_ctrl_nbr: l.info_ctrl_nbr
                , empl_id: l.empl_id

            }).then(function (d) {
                swal(d.data.updateapl.output_message, { icon: d.data.icon })
                
                updateqsicon.replaceClass("fa-spinner fa-spin", "fa-caret-down")
                updateprofilebtn.enabled()
                updateqsbtn.enabled()
                savebtn.enabled()
                closebtn1.enabled()
            })
        }
        else {

            swal({ title: "Cannot Fetch Data From Online Application", text: "This application did not come from online application", icon: "error" })
            updateqsicon.replaceClass("fa-spinner fa-spin", "fa-caret-down")
            updateprofilebtn.enabled()
            updateqsbtn.enabled()
            savebtn.enabled()
            closebtn1.enabled()
        }

    }
    s.getDataFrom = function (val) {
        var l = s.applicants_data

        if (val == 1) {
           
            h.post("../cApplicantsReview/Updatefrompds", {
                info_ctrl_nbr: l.info_ctrl_nbr
                , empl_id: l.empl_id

            }).then(function (d) {
                swal(d.data.updatepds.output_message, { icon: d.data.icon })
                cs.loading("hide")
            })
        }
        else if (val == 2) {

            var emplid = s.apl_info_nbr
            h.post("../cApplicantsReview/Updatefromapl", {
                info_ctrl_nbr: l.info_ctrl_nbr
                , empl_id: l.empl_id

            }).then(function (d) {
                swal(d.data.updateapl.output_message, { icon: d.data.icon })
                cs.loading("hide")
            })

        }
    }

    s.select_applicant_btn = function (row) {
        $("#select_id_employee").modal("hide")
        var data = s.select_applicant_Data[row]
        s.current_empl_id2 = data.empl_id
        s.current_employee_name2 = data.first_name + " " + data.last_name
        s.info_ctrl_nbr2
       $("#choose_applicanttype2").modal("show")
    }

    s.select_applicant_btn2 = function (row) {

        $("#select_id_employee").modal("hide")
        var data = s.select_applicant_Data[row]
        s.current_empl_id2 = data.empl_id
        s.current_employee_name2 = data.first_name + " " + data.last_name
        s.info_ctrl_nbr2
        $("#choose_applicanttype2").modal("show")
    }
   
    s.FindPersonnel = function (val) {
        var icon_spinner1 = "icon_spinner1"
        var current_empl_id = "current_empl_id"
       
        if (val.length >= 4) {
            icon_spinner1.removeClass("hidden")
            current_empl_id.disabled()
            h.post("../cApplicantsInfo/FindPersonnel", { empl_id: val }).then(function (d) {
                
                if ( d.data.icon == "success") {
                    if (d.data.person.is_added == 0) {
                        s.empl_id_added = false
                        s.person_warning = true
                        cs.required2("current_empl_id", d.data.person.descr)
                        s.current_employee_name = ""
                    }
                    else if (d.data.person.is_added == 1) {
                        s.empl_id_added = true
                        cs.required2("current_empl_id", d.data.person.descr)
                        s.current_employee_name = d.data.person.employee_name

                    }
                    else if (d.data.person.is_added == 2) {
                        s.empl_id_added = false
                        s.current_employee_name = d.data.person.employee_name
                    }

                    icon_spinner1.addClass("hidden")
                    current_empl_id.enabled()
                }
                else {
                    icon_spinner1.addClass("hidden")
                    current_empl_id.enabled()
                    s.empl_id_added = false
                    s.current_employee_name = ""
                    cs.required2("current_empl_id", "Employee id not found!")
                }
              


            })
            cs.notrequired2("current_empl_id")
        }
        else if (val.length == 0) {
            icon_spinner1.addClass("hidden")
            current_empl_id.enabled()
            s.empl_id_added = false
            s.current_employee_name = ""
            cs.notrequired2("current_empl_id")
           
        }
        else {
            icon_spinner1.addClass("hidden")
            current_empl_id.enabled()
            s.empl_id_added = false
            s.current_employee_name = ""
            cs.required2("current_empl_id", "Employee id not found!")
        }
    }

    s.cancelfetch = function () {
        s.allow_type_id = false;
        s.current_empl_id = ""
        $("#choose_applicanttype").modal("hide")
    }

    function GetHiringPeriod() {
        var employment_type = s.itm.employment_type 
        var budget_code = s.itm.budget_code 
        h.post("../cApplicantsInfo/getHiringPeriod", { employment_type: employment_type, budget_code: budget_code}).then(function (d) {
            s.hiring_period = d.data.hiring_period
        })
    }
    s.fetchfromPDS = function () {
        var fetchbtncancel = "fetchbtncancel"
        var iconfetchpds = "iconfetchpds"
        var fetchbtn = "fetchbtn"
        fetchbtncancel.disabled()
        fetchbtn.disabled()
        iconfetchpds.replaceClass("fa-save","fa-spinner fa-spin")
        //s.app_ctrl_nbr
        var id = s.current_empl_id
        var infoctrlnbr = s.info_ctrl_nbr
        h.post("../cApplicantsInfo/FetchFromPDS", { empl_id: id, info_ctrl_nbr: s.info_ctrl_nbr }).then(function (d) {
         
            if (d.data.DatafrmPDS[0] == "Data successfully inserted") {
                
                    h.post("../cApplicantsInfo/getApplicantList", { month: s.mo, year: s.yr }).then(function (d) {
                        if (d.data.icon == "success") {
                            var dt = d.data.list.select(infoctrlnbr, "info_ctrl_nbr")
                            dt.populateFields(s.fd, 0)
                            s.Applicant_List_Data = d.data.list.refreshTable("Applicant_List_Grid", "")
                            swal("Data from PDS successfully inserted", { icon: "info" })
                            iconfetchpds.replaceClass("fa-spinner fa-spin","fa-save")
                            fetchbtn.enabled()
                            fetchbtncancel.enabled()
                            $("#choose_applicanttype").modal("hide")
                        }
                        else {
                            console.log(d.data.message)
                            iconfetchpds.replaceClass("fa-spinner fa-spin", "fa-save")
                            fetchbtn.enabled()
                            fetchbtncancel.enabled()
                            $("#choose_applicanttype").modal("hide")
                        }
                    })
                

            }
            else {
                swal("Data from PDS not successfully fetch", { icon: "error" })
                iconfetchpds.replaceClass("fa-spinner fa-spin", "fa-save")
                fetchbtn.enabled()
                fetchbtncancel.enabled()
                $("#choose_applicanttype").modal("hide")
            }
        })
      
    }
    s.fetchfromPDS2 = function () {
        
        var id = s.current_empl_id2
        var infoctrlnbr = s.info_ctrl_nbr
        h.post("../cApplicantsInfo/FetchFromPDS2", { empl_id: id, info_ctrl_nbr: s.info_ctrl_nbr }).then(function (d) {

            if (d.data.DatafrmPDS[0] == "Data successfully inserted") {

                h.post("../cApplicantsInfo/getApplicantList", { month: s.mo, year: s.yr }).then(function (d) {
                    if (d.data.icon == "success") {
                      
                        var dt = d.data.list.select(infoctrlnbr, "info_ctrl_nbr")
                        dt.populateFields(s.fd, 0)
                        s.Applicant_List_Data = d.data.list.refreshTable("Applicant_List_Grid", "")
                        swal("Data from PDS successfully inserted", { icon: "info" })
                    }
                    else {
                        console.log(d.data.message)
                    }
                    $("#select_id_employee").modal("hide")
                    $("#choose_applicanttype2").modal("hide")
                })

              
            }
            else {
                swal("Data from PDS not successfully fetch", { icon: "error" })
            }
        })
        $("#choose_applicanttype").modal("hide")
    }

    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    $('#data_1 .input-group.date').datepicker({
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true,
        format: "yyyy/mm/dd"
    });

    //header search box to search row in Main Applicant list
    s.search_in_list = function (value, table) {
        if (!elEmpty(value)) {
          
        }

        $("#" + table).DataTable().search(value).draw();
    }


    //set the number of rows to show in grid
    s.setNumOfRow = function (value, table) {
        $("#" + table).DataTable().page.len(s.rowLen).draw();
    }

    s.Select_Doc_Type = function (val) {
        s.doc_type = val
    }

    s.btn_del_row_main_grid = function (row_id) {
        var dt = s.Applicant_List_Data[row_id]
   
        if (dt.hasChild == true)
        {
            swal("You cannot delete this application because it is already added to Review List for screening", { icon: "warning" });
            return
        }
        var info_ctrl_nbr = dt.info_ctrl_nbr;
        cs.spinnerAdd("del_row" + row_id, "fa fa-trash")
        swal({
            title: "Are you sure to delete this record?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
                  .then(function (willDelete) {
                      if (willDelete) {
                          h.post("../cApplicantsInfo/DeleteApplicants", {
                              info_ctrl_nbr: info_ctrl_nbr,
                              year: s.yr,
                              month: s.mo
                          }).then(function (d) {
                              if(d.data.icon == "success")
                              {
                                  s.Applicant_List_Data = d.data.returndata.refreshTable("Applicant_List_Grid", "")
                                  swal(d.data.message, { icon: d.data.icon });
                              }
                              else
                              {
                                  swal(d.data.message, { icon: d.data.icon });
                              }
                              cs.spinnerRemove("del_row" + row_id, "fa fa-trash")
                          })
                      }
                      else {
                          cs.spinnerRemove("del_row" + row_id, "fa fa-trash")
                      }
                  });
    }

  
    s.btn_edit = function (row_id) {
        s.toggle_data_btn = true;
        s.addapplicanttitle = "Edit Applicant Information"
        s.savebtn = "edit"
        cs.EnabledField("savebtn")
        cs.clearFields(s.fd)
        cs.EnabledAllFields(s.fd)
        
        var dt = s.Applicant_List_Data[row_id]
        s.applicants_data = s.Applicant_List_Data[row_id]
       
        s.empl_id = dt.empl_id
        s.info_ctrl_nbr = dt.info_ctrl_nbr
        if (dt.empl_id.charAt(0) == "A") {
            s.pay = false
            s.apl = true
        }
        else {
            s.pay = true
            s.apl = false
        }
        s.apl_info_nbr = dt.empl_id
        s.info_ctrl_nbr = dt.info_ctrl_nbr;
        s.Applicant_List_Data.populateFields(s.fd, row_id)
        s.fd.info_ctrl_nbr_disp = cs.currentyear() + "-" + s.info_ctrl_nbr;
        $("#addApplicants").modal("show")
       
    }

   
    s.selectDate = function () {
        cs.loading("show")
        s.search_name = ""

        if (s.search_name == "") {
            h.post("../cApplicantsInfo/getApplicantList", { month: s.mo, year: s.yr }).then(function (d) {
                if (d.data.icon == "success") {
                    s.Applicant_List_Data = d.data.list.refreshTable("Applicant_List_Grid", "")
                    cs.loading("hide")
                }
                else {
                    console.log(d.data.message)
                }
            })
        }
        else {
            
        }
    }

    s.Select_filterType = function (val) {
        if (val == 0) {
            s.filter_show = false
            h.post("../cApplicantsInfo/getApplicantList", { month: s.mo, year: s.yr }).then(function (d) {
                if (d.data.icon == "success") {

                    s.Applicant_List_Data = d.data.list.refreshTable("Applicant_List_Grid", "")

                    $('#Applicant_List_Grid').on('draw.dt', function () {
                        $('#Applicant_List_Grid tr:eq(0) th:eq(2)').text("ITEM NUMBER");
                    }); 
                }
                else {
                    console.log(d.data.message)
                }
            })
           
        }
        else {
          
            s.filter_show = true
           
            //h.post("../cApplicantsInfo/getApplicantList", { month: '00', year: s.yr }).then(function (d) {
            //    if (d.data.icon == "success") {
            //        s.Applicant_List_Data2_orig = d.data.list
            //        s.Applicant_List_Data = s.Applicant_List_Data2_orig.refreshTable("Applicant_List_Grid", "")
            //        $('#Applicant_List_Grid').on('draw.dt', function () {
            //            $('#Applicant_List_Grid tr:eq(0) th:eq(2)').text("DATE APPLIED");
            //        }); 
            //    }
            //    else {
            //        console.log(d.data.message)
            //    }
            //})
        }
    }
    s.filterByItem = function (val) {
        var data = []
        var item = $("#fltr_item_no").val()
        data = s.Applicant_List_Data2_orig.select(item, "applied_dttm")
        s.Applicant_List_Data = data.refreshTable("Applicant_List_Grid", "")
    }
    s.selectItem = function (item_no) {
        
        var itemnumber = $("#item_no").val()
        s.itm.item_no = $("#item_no").val()
        if (cs.elEmpty(itemnumber)) {
            s.itm.department_name1 = ""
            s.itm.position_code = ""
            s.itm.department_code = ""
        }
        else {
            var data = s.items.filter(function (d) {
                return d.item_no == itemnumber
            })[0]
           // console.log(data)

            s.itm.department_name1 = data.department_name1
            s.itm.position_code = data.position_code
            s.itm.department_code = data.department_code
            $("#department_name1").val(data.department_name1)
            $("#position_code").val(data.position_code)
            $("#department_code").val(data.department_code)

        }

    }
    //s.selectItem = function (item_no) {
    //    if (cs.elEmpty(item_no))
    //    {
    //        s.itm.department_name1 = ""
    //        s.itm.position_code = ""
    //        s.itm.department_code = ""
    //    }
    //    else
    //    {
    //        var data = s.items.filter(function (d) {
    //            return d.item_no == item_no
    //        })[0]
          
    //        s.itm.department_name1 = data.department_name1
    //        s.itm.position_code = data.position_code
    //        s.itm.department_code = data.department_code
    //    }
        
    //}

    s.selectEmploymentType = function (employment_type) {
        var empltype = "employment_type"
        var icon_spinner2 = "icon_spinner2"
        empltype.disabled()
        icon_spinner2.removeClass("hidden")
        s.budget_year = []
        s.items = []
        s.itm.department_name1 = ""
        s.itm.position_code = ""
        s.itm.department_code = ""
        s.employment_type = employment_type;
        h.post("../cApplicantsInfo/getBudgetYear", { employment_type: employment_type }).then(function (d) {
            s.budget_year = d.data.budget_year;
            empltype.enabled()
            icon_spinner2.addClass("hidden")
        })
    }

    s.selectBudgetYear = function (budget_code) {
        s.items = []
        s.itm.department_name1 = ""
        s.itm.position_code = ""
        s.itm.department_code = ""
        GetHiringPeriod()
        
    }

    function GetItems() {
        var ctrl_nbr = s.itm.ctrl_nbr
        h.post("../cApplicantsInfo/getItems", { ctrl_nbr: ctrl_nbr}).then(function (d) {
            s.items = d.data.items
        })
    }

    s.selectHiringPeriod = function (ctrl_nbr) {
        cs.novalidate("itm")
        h.post("../cApplicantsInfo/getItems", { ctrl_nbr: ctrl_nbr }).then(function (d) {
            s.items = d.data.items
            h.post("../cApplicantsInfo/checkApplicantsReview", {
                  info_ctrl_nbr: s.DATA.info_ctrl_nbr
                , ctrl_nbr: ctrl_nbr
            }).then(function (d) {
                if (d.data.icon == 'success') {
                    if (d.data.data_exist.length > 0) {

                        $("#item_no").val(d.data.data_exist[0].item_no).change()
                        s.itm.item_no = d.data.data_exist[0].item_no
                        swal("This applicant has an existing application for item:" + d.data.data_exist[0].item_no
                            + " under review, only one item is allowed per applicant"
                            , { icon: "error" })
                        $("#item_no").prop("disabled", true)
                        $("#btnsavetoreview").prop("disabled", true)
                    }
                    else {
                        $("#item_no").prop("disabled", false)
                        $("#btnsavetoreview").prop("disabled", false)
                        $("#item_no").val("").change()
                    }
                }
                else {
                    swal(d.data.message, { icon: d.data.icon })
                }
            })
        })
    }

    s.add_to_review = function (row_id) {
         cs.novalidate("itm")
         s.DATA = s.Applicant_List_Data[row_id]
         $("#addItemNo").modal("show");
    }

    
    s.addItem = function (itm) {
        var btncancelsavetoreview = "btncancelsavetoreview"
        var btnsavetoreview = "btnsavetoreview"
        var icnsavetoreview = "icnsavetoreview"
        var employment_type = "employment_type"
        var budget_code = "budget_code"
        var item_no = "item_no"
        var department_name1 = "department_name1"

        icnsavetoreview.replaceClass("fa-save", "fa-spinner fa-spin")
        btnsavetoreview.disabled()
        employment_type.disabled()
        budget_code.disabled()
        item_no.disabled()
        btncancelsavetoreview.disabled()
        department_name1.disabled()
        var employment_type = "employment_type"

        if (cs.validatesubmit("itm")) {

            h.post("../cApplicantsInfo/addToReviewTable", {
                info_ctrl_nbr: s.DATA.info_ctrl_nbr
                , item: itm
            }).then(function (d) {

                if (d.data.icn == "success") {
                    swal(d.data.message, { icon: d.data.icn });
                    $("#addItemNo").modal("hide");
                    cs.clearFields(s.itm)
                }
                else {
                    swal(d.data.message, { icon: d.data.icn });
                }

                icnsavetoreview.replaceClass("fa-spinner fa-spin", "fa-save")
                btnsavetoreview.enabled()
                employment_type.enabled()
                budget_code.enabled()
                item_no.enabled()
                btncancelsavetoreview.enabled()
              //  department_name1.enabled()

            })
        }
        else {

            icnsavetoreview.replaceClass("fa-spinner fa-spin", "fa-save")
            btnsavetoreview.enabled()
            employment_type.enabled()
            budget_code.enabled()
            item_no.enabled()
            btncancelsavetoreview.enabled()
            //department_name1.enabled()
        }
    }


    s.Save_Application = function () {

        s.fd.birth_date = $("#birth_date").val()
        s.fd.applied_dttm = $("#applied_dttm").val()
        
        if (cs.ValidateFields(s.fd)) {
            h.post("../cApplicantsInfo/Save_Application", {
                mo: s.mo,
                yr: s.yr,
                savebtn: s.savebtn,
                app: s.fd,
                info_ctrl_nbr_disp: s.fd.info_ctrl_nbr_disp,
            }).then(function (d) {

                if (d.data.icon == "success") {
                    swal(d.data.message, { icon: d.data.icon });
                    s.Applicant_List_Data = d.data.list.refreshTable("Applicant_List_Grid", "")
                }
                else {
                    swal(d.data.message, { icon: d.data.icon });
                }
            })
        }
       
    }

    s.btn_to_details = function (row_id) {
        var dt = s.Applicant_List_Data[row_id]
        s.info_ctrl_nbr = dt.info_ctrl_nbr
        h.post("../cApplicantsInfo/InitializeDetails", { info_ctrl_nbr: s.info_ctrl_nbr }).then(function (d) {
            s.ddl_educ_type = d.data.educ_type
            s.salgrade = d.data.salgrade
            s.Education_List_Data = d.data.education.refreshTable("appl_edu_grid", "");
            s.Eligibility_List_Data = d.data.eligibility.refreshTable("appl_elegib_grid", "");
            s.Workexp_List_Data = d.data.experience.refreshTable("appl_workexp_grid", "");
            s.LnD_List_Data = d.data.training.refreshTable("appl_lnd_grid", "");
            $("#applicantsDetails").modal("show")

        })
        
       
    }

    s.show_add_modal = function (modal) {
        s.editMode = false;
        $("#" + modal).modal("show");
    }





    //EDUCATION DETAILS*******************************START
    s.educ_edit_action = function (row) {
        s.info_ctrl_nbr = s.Education_List_Data[row].info_ctrl_nbr;
        s.seq_no = s.Education_List_Data[row].seq_no;
        s.Education_List_Data.populateFields(s.ed, row)
        s.editMode = true;
        $("#educ_dtl_modal").modal("show");
    }

    $('#educ_dtl_modal').on('hidden.bs.modal', function () {

        cs.clearFields(s.ed)
        cs.removeFormReq(s.ed)
        s.editMode = false;
    });

    s.edu_btn_add = function (ed) {

        if (cs.ValidateFields(s.ed)) {
            if (s.editMode) {

                h.post("../cApplicantsInfo/EditEduc", { ed: s.ed, info_ctrl_nbr: s.info_ctrl_nbr, seq_no: s.seq_no }).then(function (d) {
                    if (d.data.icon = "success") {
                        s.Education_List_Data = d.data.returndata.refreshTable("appl_edu_grid", "");
                        swal(d.data.message, { icon: d.data.icon })
                    }
                    else {
                        swal(d.data.message, { icon: d.data.icon })
                    }
                })
            }
            else {
                h.post("../cApplicantsInfo/AddEduc", { ed: s.ed, info_ctrl_nbr: s.info_ctrl_nbr }).then(function (d) {
                    if (d.data.icon = "success") {
                        s.Education_List_Data = d.data.returndata.refreshTable("appl_edu_grid", "");
                        swal(d.data.message, { icon: d.data.icon })
                    }
                    else {
                        swal(d.data.message, { icon: d.data.icon })
                    }
                })
            }



        }
    }
    s.educ_del_row = function (row_id) {

        cs.spinnerAdd("educ_del_row" + row_id, "fa fa-trash")
        s.app_ctrl_nbr = s.Education_List_Data[row_id].app_ctrl_nbr;
        s.seq_no = s.Education_List_Data[row_id].seq_no;

        swal({
            title: "Are you sure to delete this record?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(function (willDelete) {
            if (willDelete) {
                h.post("../cApplicantsInfo/DeleteEduc", {
                    info_ctrl_nbr : s.info_ctrl_nbr,
                    seq_no : s.seq_no,
                }).then(function (d) {
                    if (d.data.icon = "success") {
                        s.Education_List_Data = d.data.returndata.refreshTable("appl_edu_grid", "");
                        swal(d.data.message, { icon : d.data.icon })
                    }
                    else {
                        swal(d.data.message, { icon : d.data.icon })
                    }
                    cs.spinnerRemove("educ_del_row" + row_id, "fa fa-trash")
                })
            }
            else {
                cs.spinnerRemove("educ_del_row" + row_id, "fa fa-trash")
            }
        });

    }
    //EDUCATION DETAILS*******************************END





    //ELIGIBILITY DETAILS*******************************START
    s.elig_btn_add = function (el) {
       
        if (cs.ValidateFields(s.el)) {
            if (s.editMode) {
                h.post("../cApplicantsInfo/EditElig", { el: s.el, info_ctrl_nbr: s.info_ctrl_nbr, seq_no: s.seq_no }).then(function (d) {
                    if (d.data.icon = "success") {
                        s.Eligibility_List_Data = d.data.returndata.refreshTable("appl_elegib_grid", "");
                        swal(d.data.message, { icon: d.data.icon })
                    }
                    else {
                        swal(d.data.message, { icon: d.data.icon })
                    }
                })
            }
            else {
                h.post("../cApplicantsInfo/AddElig", { el: s.el, info_ctrl_nbr: s.info_ctrl_nbr }).then(function (d) {
                    if (d.data.icon = "success") {
                        s.Eligibility_List_Data = d.data.returndata.refreshTable("appl_elegib_grid", "");
                        swal(d.data.message, { icon: d.data.icon })
                    }
                    else {
                        swal(d.data.message, { icon: d.data.icon })
                    }
                })
            }



        }
    }

    s.elig_edit_action = function (row) {
        s.info_ctrl_nbr = s.Eligibility_List_Data[row].info_ctrl_nbr;
        s.seq_no = s.Eligibility_List_Data[row].seq_no;
        s.Eligibility_List_Data.populateFields(s.el, row)
        s.editMode = true;
        $("#eligib_dtl_modal").modal("show");
    }

    $('#eligib_dtl_modal').on('hidden.bs.modal', function () {
        cs.clearFields(s.el)
        cs.removeFormReq(s.el)
        s.editMode = false;
    });


    //toggle between Main grid and Details grid

    s.elig_del_row = function (row_id) {

        cs.spinnerAdd("elig_del_row" + row_id, "fa fa-trash")
        s.info_ctrl_nbr = s.Eligibility_List_Data[row_id].info_ctrl_nbr;
        s.seq_no = s.Eligibility_List_Data[row_id].seq_no;

        swal({
            title: "Are you sure to delete this record?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(function (willDelete) {
            if (willDelete) {
                h.post("../cApplicantsInfo/DeleteElig", {
                    info_ctrl_nbr: s.info_ctrl_nbr,
                    seq_no: s.seq_no,
                }).then(function (d) {
                    if (d.data.icon = "success") {
                        s.Eligibility_List_Data = d.data.returndata.refreshTable("appl_elegib_grid", "");
                        swal(d.data.message, { icon: d.data.icon })

                    }
                    else {
                        swal(d.data.message, { icon: d.data.icon })
                    }
                    cs.spinnerRemove("elig_del_row" + row_id, "fa fa-trash")
                })
            }
            else {
                cs.spinnerRemove("elig_del_row" + row_id, "fa fa-trash")
            }
        });

    }

    //ELIGIBILITY DETAILS*******************************END






    //EXPERIENCE DETAILS********************************START


    s.exp_btn_add = function (wx) {
       
        if (wx.gov_srvc == "1") 
        {
             gov = true
        }
        else {
            gov = false
        }
      
        if (cs.ValidateFields(s.wx)) {
            if (s.editMode) {
                h.post("../cApplicantsInfo/EditWexp", { wx: s.wx, info_ctrl_nbr: s.info_ctrl_nbr, seq_no: s.seq_no,gov:gov}).then(function (d) {
                    if (d.data.icon = "success") {
                        s.Workexp_List_Data = d.data.returndata.refreshTable("appl_workexp_grid", "");
                        swal(d.data.message, { icon: d.data.icon })
                    }
                    else {
                        swal(d.data.message, { icon: d.data.icon })
                    }
                    $("#workexp_dtl_modal").modal("hide");
                })
            }
            else {
                h.post("../cApplicantsInfo/AddWexp", { wx: s.wx, info_ctrl_nbr: s.info_ctrl_nbr, gov:gov}).then(function (d) {
                    if (d.data.icon = "success") {
                        s.Workexp_List_Data = d.data.returndata.refreshTable("appl_workexp_grid", "");
                        swal(d.data.message, { icon: d.data.icon })
                    }
                    else {
                        swal(d.data.message, { icon: d.data.icon })
                    }
                    $("#workexp_dtl_modal").modal("hide");
                })
            }



        }
    }

    s.exp_edit_action = function (row) {
        var dt = s.Workexp_List_Data[row]
     
        s.info_ctrl_nbr = dt.info_ctrl_nbr;
        s.seq_no = dt.seq_no;
        s.Workexp_List_Data.populateFields(s.wx, row)
        if (dt.gov_srvc)
        {
            s.wx.gov_srvc = "1"
        }
        else
        {
            s.wx.gov_srvc = "0"
        }
        s.editMode = true;
        $("#workexp_dtl_modal").modal("show");
    }

    $('#workexp_dtl_modal').on('hidden.bs.modal', function () {
        cs.clearFields(s.wx)
        cs.removeFormReq(s.wx)
        s.editMode = false;
    });


    //toggle between Main grid and Details grid

    s.exp_del_row = function (row_id) {

        cs.spinnerAdd("exp_del_row" + row_id, "fa fa-trash")
        s.info_ctrl_nbr = s.Workexp_List_Data[row_id].info_ctrl_nbr;
        s.seq_no = s.Workexp_List_Data[row_id].seq_no;

        swal({
            title: "Are you sure to delete this record?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(function (willDelete) {
            if (willDelete) {
                h.post("../cApplicantsInfo/DeleteWexp", {
                    info_ctrl_nbr: s.info_ctrl_nbr,
                    seq_no: s.seq_no,
                }).then(function (d) {
                    if (d.data.icon = "success") {
                        s.Workexp_List_Data = d.data.returndata.refreshTable("appl_workexp_grid", "");
                        swal(d.data.message, { icon: d.data.icon })

                    }
                    else {
                        swal(d.data.message, { icon: d.data.icon })
                    }
                    cs.spinnerRemove("exp_del_row" + row_id, "fa fa-trash")
                })
            }
            else {
                cs.spinnerRemove("exp_del_row" + row_id, "fa fa-trash")
            }
        });

    }

    function serv(id) {
        if (id) {
            return "Government"
        }
        else if (id == false) {
            return "Private"
        }
        else {
            return ""
        }

    }
        
    //EXPERIENCE DETAILS********************************END





    //TRAINING DETAILS**********************************START


    s.lnd_btn_add = function (ld) {
        s.ld.learn_devt_from = $("#learn_devt_from").val()
        s.ld.learn_devt_to = $("#learn_devt_to").val()
        
        if (cs.ValidateFields(s.ld)) {
            if (s.editMode) {
                h.post("../cApplicantsInfo/EditLnD", { ld: s.ld, info_ctrl_nbr: s.info_ctrl_nbr, seq_no: s.seq_no }).then(function (d) {
                    if (d.data.icon = "success") {
                        s.LnD_List_Data = d.data.returndata.refreshTable("appl_lnd_grid", "");
                        swal(d.data.message, { icon: d.data.icon })
                    }
                    else {
                        swal(d.data.message, { icon: d.data.icon })
                    }
                })
            }
            else {
                h.post("../cApplicantsInfo/AddLnD", { ld: s.ld, info_ctrl_nbr: s.info_ctrl_nbr }).then(function (d) {
                    if (d.data.icon = "success") {
                        s.LnD_List_Data = d.data.returndata.refreshTable("appl_lnd_grid", "");
                        swal(d.data.message, { icon: d.data.icon })
                    }
                    else {
                        swal(d.data.message, { icon: d.data.icon })
                    }
                })
            }



        }
    }

    s.lnd_edit_action = function (row) {
        var dt = s.LnD_List_Data[row]
       
        s.info_ctrl_nbr = dt.info_ctrl_nbr;
        $("#period_from").val(dt.period_from)
        $("#period_to").val(dt.period_to)
       
        s.seq_no = dt.seq_no;
        s.LnD_List_Data.populateFields(s.ld, row)
        s.editMode = true;
        $("#lnd_dtl_modal").modal("show");
    }

    $('#lnd_dtl_modal').on('hidden.bs.modal', function () {
        cs.clearFields(s.ld)
        cs.removeFormReq(s.ld)
        s.editMode = false;
    });


    //toggle between Main grid and Details grid

    s.lnd_del_row = function (row_id) {

        cs.spinnerAdd("lnd_del_row" + row_id, "fa fa-trash")
        s.info_ctrl_nbr = s.LnD_List_Data[row_id].info_ctrl_nbr;
        s.seq_no = s.LnD_List_Data[row_id].seq_no;

        swal({
            title: "Are you sure to delete this record?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(function (willDelete) {
            if (willDelete) {
                h.post("../cApplicantsInfo/DeleteLnD", {
                    info_ctrl_nbr: s.info_ctrl_nbr,
                    seq_no: s.seq_no,
                }).then(function (d) {
                    if (d.data.icon = "success") {
                        s.LnD_List_Data = d.data.returndata.refreshTable("appl_lnd_grid", "");
                        swal(d.data.message, { icon: d.data.icon })

                    }
                    else {
                        swal(d.data.message, { icon: d.data.icon })
                    }
                    cs.spinnerRemove("lnd_del_row" + row_id, "fa fa-trash")
                })
            }
            else {
                cs.spinnerRemove("lnd_del_row" + row_id, "fa fa-trash")
            }
        });

    }
    //TRAINING DETAILS**********************************END

    s.func_ifPresent = function (d) {
      
        if (s.wx.workexp_to.toUpperCase().trim() == "PRESENT") {
           
            s.workexp_to_str = s.wx.workexp_to
            s.present = true
        }
        else {
            s.present = false
        }
    }

    s.search_applicant = function () {
       
        if (s.search_name != "") {
          
            h.post("../cApplicantsInfo/search_applicant", {
                 search_name: s.search_name
                ,search_option: "LASTNAME"
            }).then(function (d) {
                if (d.data.icon == "success") {
                   
                    s.Applicant_List_Data = d.data.search_applicant_list.refreshTable("Applicant_List_Grid", "")
                }
            })
        }
    }
    s.searchByLastname = function () {
        if (cs.Validate1Field("last_name")) {
            var lastname = s.last_name
            h.post("../cApplicantsInfo/searchByLastname", {
                lastname: lastname
            }).then(function (d) {
                if (d.data.icon == "success") {
                    s.Applicant_List_Data = d.data.list.refreshTable("Applicant_List_Grid", "")

                }
            })
        }
    }
    s.searchByid = function (id) {
        if (cs.Validate1Field("current_empl_id")) {
            var current_empl_id = s.current_empl_id
            h.post("../cApplicantsInfo/searchByid", {
                id: current_empl_id
            }).then(function (d) {
                if (d.data.icon == "success") {
                    s.Applicant_List_Data = d.data.list.refreshTable("Applicant_List_Grid", "")
                    $("#choose_applicanttype").modal("hide")
                }
            })
        }
    }
    
})

ng_eRSP_App.filter("filterdate", function () {

    var re = /\/Date\(([0-9]*)\)\//;
    return function (x) {
        var m = x.match(re);
        if (m) return new Date(parseInt(m[1]));
        else return null;
    };
});

