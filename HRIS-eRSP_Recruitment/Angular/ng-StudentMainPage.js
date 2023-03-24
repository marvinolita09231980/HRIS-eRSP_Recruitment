/*
 * Script created By:       Vincent Jade H. Alivio
 * Script created On:       02/27/2020
 * Purpose of this Script:  
 *                          
 */
ng_eSMIS_App.controller("StudentMainPage_ctrlr", function (commonScript,$scope, $compile, $http, $filter) {
    var s                       = $scope;
    var h = $http;
    var cs = commonScript
    s.rowLen                    = "10";
    s.datalistgrid              = null;
    s.datalistgrid_info         = null;
    s.subject_title_list        = null;
    s.datalistgridExam          = null;
    tname = "datalist_grid"
    //s.nav_color1 = "color:#1ab394;";
    //s.nav_color2 = "color:#1ab394;";
    //s.nav_color3 = "color:#1ab394;";
    s.gender_info =
        [
        { code: '',  gender_descr: '' },
        { code: 'M', gender_descr: 'Female' },
        { code: 'F', gender_descr: 'Male' }
     ]


    $("<style id='myStyle' type='text/css'> .top-navigation .nav > li.active > a {  color: #fff;background: #1c84c6;border: none;} </style>").appendTo("head");
    // ******************************************
    // * VJA - 02/27/2020 - Initialized page
    // ****************************************** 
   
    function init()
    {
        $("#common_loading_modal").modal('show');
        
        window.location.hash = "no-back-button";
        window.location.hash = "Again-No-back-button";//again because google chrome don't insert first hash into history
        window.onhashchange = function () { window.location.hash = "no-back-button"; }

        //$('.nav-tabs a[href="#tabref-1"]').tab('show');
        //$(".inner").prepend("<p>Test</p>");
        //var progressBar = $('#progress-bar-materials');
        //progressNumber = 0;
        //setInterval(function () {
        //    progressNumber++;
        //    progressBar.css('width', progressNumber + '%')
        //    //progressBar.attr('aria-valuemax', progressNumber)
        //}, 500)
     
       
        h.post("../StudentMainPage/InitializeData").then(function (d) {

            if (d.data.message == "success")
            {

               

                s.f_student_name_format2    = d.data.student_info.f_student_name
                s.f_student_id              = d.data.student_info.f_student_id
                s.f_student_lrn             = d.data.student_info.f_student_lrn
                s.f_contactnbrs             = d.data.student_info.f_contactnbrs
                s.f_currentaddress          = d.data.student_info.f_currentaddress
                s.f_class_section_descr     = d.data.student_info.f_class_section_descr
                s.imgDataURL                = d.data.imgDataURL
              
                $("#ddl_status_header").val(d.data.s_par_status.toString())
                s.ddl_month                 = d.data.s_par_month == 0 ? MonthFormat((new Date().getMonth() + 1)) : MonthFormat(d.data.s_par_month)

                $('#profile').error(function () {
                    $('#profile').attr('src', "../ResourcesImages/upload_profile.png");
                });

                s.txtb_calendar_year = d.data.vw_schoolcalendar_tbl.f_calendar_descr
                s.datalistgrid_info         = d.data.vw_studentinfo_tbl_list

                s.txtb_student_id           = d.data.vw_studentinfo_tbl_list.f_student_id
                s.txtb_student_lrn          = d.data.vw_studentinfo_tbl_list.f_student_lrn
                s.txtb_student_status       = d.data.vw_studentinfo_tbl_list.f_stud_status_descr
                s.txtb_student_lname        = d.data.vw_studentinfo_tbl_list.f_last_name
                s.txtb_student_fname        = d.data.vw_studentinfo_tbl_list.f_first_name
                s.txtb_student_mname        = d.data.vw_studentinfo_tbl_list.f_middle_name
                s.txtb_student_sname        = d.data.vw_studentinfo_tbl_list.f_suffix_name
                s.txtb_courtisy             = d.data.vw_studentinfo_tbl_list.f_courtisy_title
                s.txtb_gender               = s.gender_info.select(d.data.vw_studentinfo_tbl_list.f_gender, "code").gender_descr
                s.txtb_bdate                = d.data.vw_studentinfo_tbl_list.f_dateofbirth
                s.txtb_civil                = d.data.vw_studentinfo_tbl_list.civil_status_descr
                s.txtb_citizenship          = d.data.vw_studentinfo_tbl_list.citz_name
                s.txtb_religion             = d.data.vw_studentinfo_tbl_list.reli_name
                s.txtb_current_add          = d.data.vw_studentinfo_tbl_list.f_currentaddress
                s.txtb_province             = d.data.vw_studentinfo_tbl_list.prov_name
                s.txtb_municipality         = d.data.vw_studentinfo_tbl_list.city_name
                s.txtb_brgy                 = d.data.vw_studentinfo_tbl_list.brgy_name
                s.txtb_contact_nbr          = d.data.vw_studentinfo_tbl_list.f_contactnbrs
                s.f_emailaddr               = d.data.vw_studentinfo_tbl_list.f_emailaddr
                s.txtb_father_name          = d.data.vw_studentinfo_tbl_list.f_fathername
                s.txtb_father_occupation    = d.data.vw_studentinfo_tbl_list.f_fatheroccupation
                s.txtb_mother_name          = d.data.vw_studentinfo_tbl_list.f_mothername
                s.txtb_mother_occupation    = d.data.vw_studentinfo_tbl_list.f_motheroccupation
                s.txtb_guardian_name        = d.data.vw_studentinfo_tbl_list.f_guardianname
                s.txtb_guardian_occupation  = d.data.vw_studentinfo_tbl_list.f_guardianoccupation
                s.txtb_emergency_name       = d.data.vw_studentinfo_tbl_list.f_emergencycname
                s.txtb_emergency_nbr        = d.data.vw_studentinfo_tbl_list.f_emergencycnbrs

                s.subject_title_list = d.data.vw_subject_list_per_student_list
                s.ddl_subject_title = d.data.s_par_subject
                $("#ddl_subject_title").val(d.data.s_par_subject)
                if (d.data.listgrid.length > 0) {
                    s.datalistgrid = d.data.listgrid;
                    init_table_data(s.datalistgrid);
                }
                else init_table_data([]);
                
                if (d.data.listgrid2.length > 0)
                {
                    s.datalistgridExam = d.data.listgrid2;
                    init_table_data2(s.datalistgridExam);
                }
                else init_table_data2([]);
               
                if (d.data.s_par_table == "datalist_grid")
                {
                    $('.nav-pills a[href="#tabref-1"]').tab('show');
                    tname = "datalist_grid"
                }

                else if (d.data.s_par_table == "datalist_gridExam")
                {
                    $('.nav-pills a[href="#tabref-2"]').tab('show');
                    tname = "datalist_gridExam"
                }

                

                $("#name_format").removeClass('hidden');
                $("#lrn_format").removeClass('hidden');
                $("#section_format").removeClass('hidden');
                $("#address_format").removeClass('hidden');
                $("#contact_format").removeClass('hidden');
                $("#ddl_subject_title").removeClass('hidden');
                
            }

            else
            {
                swal({
                    title: "This student is not yet enrolled!",
                    text: "Please contact the assigned personnel!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,

                })
                    .then(function (willDelete) {
                        if (willDelete)
                        {
                            location.href = "/Login/Index"
                        }

                        else
                        {
                            location.href = "/Login/Index"
                        }
                    });
          
            }
            $("#common_loading_modal").modal('hide');
            
        });
    }

    function MonthFormat(number)
    {
        return (number < 10 ? '0' : '') + number
    }

    init()

    var init_table_data = function (par_data) {
        s.datalistgrid = par_data;
        s.oTable = $('#datalist_grid').dataTable(
            {
                data: s.datalistgrid,
                sDom: 'rt<"bottom"ip><"toolbar">',
                pageLength: 10,
                bAutoWidth:false,
                columns: [
                  

                    {
                        "mData": "f_mtrl_purpose",
                        "width": "70%",
                        "mRender": function (data, type, full, row) { return "<span class='text-left btn-block' style='padding-left:10px'>" + data + "</span>" }
                    },
                   
                    
                    {
                        "mData": "f_mtrl_priority",
                        "width": "20%",
                        "mRender": function (data, type, full, row)
                        {
                            var class_style;
                            if (data == 'Normal') {
                                class_style = "class='badge badge-primary'"
                            }

                            else if (data == 'Over Due') {
                                class_style = "class='badge badge-warning'"
                            }

                            else if (data == 'Very High') {
                                class_style = "class='badge badge-warning' style ='background-color:red;'"
                            }

                            else if (data == 'High') {
                                class_style = "class='badge badge-danger'"
                            }

                            else if (data == 'Medium') {
                                class_style = "class='badge badge-warning' style ='background-color:violet;'"
                               
                            }

                            else if (data == 'Low')
                            {
                                class_style = "class='badge badge-success'"
                            }
                           
                          
                           
                            
                            return "<center><span " + class_style +">&nbsp;&nbsp;&nbsp;" + data + "&nbsp;&nbsp;&nbsp;</span></center>"
                        }
                    },
                   
                    {
                        "mData": null,
                        "bSortable": false,
                        "width": "10%",
                        "mRender": function (data, type, full, row)
                        {
                            
                            return '<center><div class="btn-group">' +
                                '<button type="button" class="btn btn-sm btn-success" ng-click="btn_show_action(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="View Materials">  <i class="fa fa-bars"></i></button >' +
                                '<button type="button" class="btn btn-sm btn-primary" ng-click="btn_check_action(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="Show Materials"><i class="fa fa-archive"></i></button>' +
                                '</div></center>';
                        }
                    }

                ],
                "createdRow": function (row, data, index) {
                    $compile(row)($scope);  //add this to compile the DOM
                }
            });
    }


    var init_table_data2 = function (par_data) {
        s.datalistgridExam = par_data;
        s.oTableExam = $('#datalist_gridExam').dataTable(
            {
                data: s.datalistgridExam,
                sDom: 'rt<"bottom"ip><"toolbar">',
                pageLength: 10,
                bAutoWidth: false,
                columns: [


                    {
                        "mData": "f_exam_purpose",
                        "width": "70%",
                        "mRender": function (data, type, full, row) { return "<span class='text-left btn-block' style='padding-left:10px'>" + data + "</span>" }
                    },


                    {
                        "mData": "f_exam_priority",
                        "width": "20%",
                        "mRender": function (data, type, full, row) {
                            var class_style;
                            if (data == 'Normal') {
                                class_style = "class='badge badge-primary'"
                            }

                            else if (data == 'Over Due') {
                                class_style = "class='badge badge-warning'"
                            }

                            else if (data == 'Very High' || data == 'Missed')
                            {
                                class_style = "class='badge badge-warning' style ='background-color:red;'"
                            }

                            else if (data == 'High') {
                                class_style = "class='badge badge-danger'"
                            }

                            else if (data == 'Medium') {
                                class_style = "class='badge badge-warning' style ='background-color:violet;'"

                            }

                            else if (data == 'Low') {
                                class_style = "class='badge badge-success'"
                            }




                            return "<center><span " + class_style + ">&nbsp;&nbsp;&nbsp;" + data + "&nbsp;&nbsp;&nbsp;</span></center>"
                        }
                    },

                    {
                        "mData": null,
                        "bSortable": false,
                        "width": "10%",
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button type="button" class="btn btn-sm btn-success"  ng-click="btn_show_action_exam(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="View Exam">  <i class="fa fa-gamepad"></i></button >' +
                                
                                '</div></center>';
                        }
                    }

                ],
                "createdRow": function (row, data, index) {
                    $compile(row)($scope);  //add this to compile the DOM
                }
            });
    }

    s.FilterGrid = function ()
    {
        h.post("../StudentMainPage/FilterGrid", {
             par_month: $("#ddl_month").val()
            ,par_status: $("#ddl_status_header").val()
            ,par_subject: $("#ddl_subject_title").val()
        }).then(function (d)
        {

            if (d.data.listgrid.length > 0)
            {
                
                s.datalistgrid = d.data.listgrid;
                s.oTable.fnClearTable();
                s.oTable.fnAddData(s.datalistgrid)
            }
            else
            {
                s.oTable.fnClearTable();
            }

            if (d.data.listgrid2.length > 0) {

                s.datalistgridExam = d.data.listgrid2;
                s.oTableExam.fnClearTable();
                s.oTableExam.fnAddData(s.datalistgridExam)
            }
            else
            {
                s.oTableExam.fnClearTable();
            }
         })
    }

    s.ForNavigation = function (value)
    {
        //$("#modalLabelSmall").trigger("click");
        //alert("AWW")

        //if (value == 1 || value == "1")
        //{
        //    s.nav_color1 = "color:#1ab394;";
        //    s.nav_color2 = "color:#1ab394;";
        //    s.nav_color3 = "color:#1ab394;";
        //}

        //else if (value == 2 || value == "2") {
        //    s.nav_color1 = "color:#1ab394;";
        //    s.nav_color2 = "color:#1ab394;";
        //    s.nav_color3 = "color:#1ab394;";
        //}
        
    }

    s.btn_student_info = function ()
    {
        $('#student_modal').modal({ backdrop: 'static', keyboard: false });
        $("#student_modal").modal('show');
    }

    s.btn_subject_info = function ()
    {
        $('#subject_modal').modal({ backdrop: 'static', keyboard: false });
        $("#subject_modal").modal('show');
    }

    s.btn_exam_info = function ()
    {
        $('#myModal4').modal({ backdrop: 'static', keyboard: false });
        $("#myModal4").modal('show');
    }

    s.getTab = function (value)
    {

        if (value == 0 || value == "0") {
            tname = "datalist_grid"
        }

        else if (value == 1 || value == "1")
        {
            tname = "datalist_gridExam"
        }
    }


    
    // ******************************************
    // * VJA - 02/27/2020 - Search
    // ****************************************** 
    s.search_in_list = function (value, table) {
        
        table = tname
        $("#" + table).DataTable().search(value).draw();
    }
    // ******************************************
    // * VJA - 02/27/2020 - Set the Number of Row
    // ****************************************** 
    s.setNumOfRow = function (value, table)
    {
        table = tname
        $("#" + table).DataTable().page.len(value).draw();
    }

    Array.prototype.select = function (code, prop) {
        var value = this.filter(function (d) {
            return d[prop] == code
        })[0]

        if (value == undefined || value == null || value == "")
            value = ""

        return value
    }

    //***********************************************************//
    //*** VJA - 02/27/2020 - Occure when add button is clicke
    //                      d and initialize the objects
    //***********************************************************// 
 
     s.btn_show_action = function (row_index) {
         h.post("../StudentMainPage/GetMtrlNbr", {
             par_mtrl_nbr: s.datalistgrid[row_index].f_mtrl_nbr
             ,par_month: $("#ddl_month").val()
             ,par_status_header: $("#ddl_status_header").val()
             ,par_subject_title: $("#ddl_subject_title").val()
             , par_table: "datalist_grid"
         }).then(function (d)
         {
             if (d.data.message == "success") {
                 var url = "../cMaterialsLink/"
                 window.location.href = url
             }

             else
             {
                 swal("No Data Available!", "Please Try Again", "error");
             }
             
         })
    }



    //***********************************************************//
    //*** VJA - 02/27/2020 - Occure when add button is clicke
    //                      d and initialize the objects
    //***********************************************************// 

    s.btn_show_action_exam = function (row_index)
    {

        h.post("../StudentMainPage/GetExamNbr", {
             par_exam_nbr : s.datalistgridExam[row_index].f_exam_nbr
            ,par_exam_status: s.datalistgridExam[row_index].f_taken_exam_status
            ,par_month: $("#ddl_month").val()
            ,par_status_header: $("#ddl_status_header").val()
            ,par_subject_title: $("#ddl_subject_title").val()
            ,par_table: "datalist_gridExam"
            ,par_priority: s.datalistgridExam[row_index].f_exam_priority
            , par_view_type: s.datalistgridExam[row_index].f_exam_view_type
        }).then(function (d) {

            if (d.data.message == "success") {
                var url = "../cExamLink/"
                window.location.href = url
            }
            else if (d.data.message == "fail") {
                swal("You can no longer take this exam!", "Please contact the assigned personnel", "warning");
            }
            else {
                swal("You have been idle for too long!", "Please refresh the page.", "warning");
            }

        })
        

        
    }



    s.btn_check_action = function (row_index)
    {
        $('#main_modal').modal({ backdrop: 'static', keyboard: false });
        s.ModalTitle = "View Details"
        if (s.datalistgrid[row_index].viewed_flag == true || s.datalistgrid[row_index].viewed_flag == 1) {
            s.viewed_flag = "Completed"
            s.progress_flag = "success"
        }

        else {
            s.viewed_flag = "Incomplete"
            s.progress_flag = "danger"
        }
        
        if (s.datalistgrid[row_index].f_mtrl_priority == 'Normal')
        {
            $("#progress_level").addClass("progress-bar progress-bar-primary")
        }

        else if (s.datalistgrid[row_index].f_mtrl_priority == 'Over Due') {
            $("#progress_level").addClass("progress-bar progress-bar-warning")
        }

        else if (s.datalistgrid[row_index].f_mtrl_priority == 'Very High')
        {
            $("#progress_level").addClass("progress-bar progress-bar-danger")
            $("#progress_level").css("background-color", "red");
            
        }

        else if (s.datalistgrid[row_index].f_mtrl_priority == 'High') {
            $("#progress_level").addClass("progress-bar progress-bar-danger")
        }

        else if (s.datalistgrid[row_index].f_mtrl_priority == 'Medium') {
            $("#progress_level").addClass("progress-bar progress-bar-warning")
            $("#progress_level").css("background-color", "violet");

        }

        else if (s.datalistgrid[row_index].f_mtrl_priority == 'Low') {
            $("#progress_level").addClass("progress-bar progress-bar-success")
        }

        s.priority_descr = s.datalistgrid[row_index].f_mtrl_priority 
       
        s.txtb_subject_title = s.datalistgrid[row_index].f_subject_title
        s.txtb_purpose = s.datalistgrid[row_index].f_mtrl_purpose

        if (s.datalistgrid[row_index].f_mtrl_completion_dttm_student == '1900-01-01 12:00:00') {
            s.txtb_activity_date = ''
        }

        else
        {
            s.txtb_activity_date = s.datalistgrid[row_index].f_mtrl_completion_dttm_student
        }
        $("#main_modal").modal('show');

    }
 
    //***********************************************************//
    //*** VJA - 02/27/2020 - Reject or Check if Date
    //***********************************************************// 
    function checkisdate(d)
    {
        // Regex 1 - This will match yyyy-mm-dd and also yyyy-m-d:
        var regex1 = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
        // Regex 2 - If you're looking for an exact match for yyyy-mm-dd then try this
        var regex2 = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
        // Regex 3 - or use this one if you need to find a date inside a string like The date is 2017-11-30
        var regex3 = /\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])*/;

        var istrue = false;
        if (regex1.test(d) == true ||
            regex2.test(d) == true ||
            regex3.test(d) == true)
        {
            istrue = true;
        } else
        {
            istrue = false;
        }
        return istrue;

    }
    //************************************************//
    //***VJA - 02/29/2020 - Validation for Nunber****//
    //**********************************************//
    function checkisvalidnumber(i) {
        var regex_spchar = /[^a-zA-Z0-9\s]/;
        var regex_upper  = /[A-Z]/;
        var regex_lower  = /[a-z]/;
        var istrue = false;

        if (regex_upper.test(i) == true ||
            regex_lower.test(i) == true ||
            regex_spchar.test(i) == true) {
            istrue = false
        } else {
            istrue = true
        }
        return istrue
    }
});

