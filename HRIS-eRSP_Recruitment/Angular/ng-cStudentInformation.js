/*
 * Script created By:       Vincent Jade H. Alivio
 * Script created On:       02/27/2020
 * Purpose of this Script:  
 *                          
 */
ng_eSMIS_App.controller("cStudentInformation_ctrlr", function (commonScript,$scope, Upload, $timeout, $compile, $http, $filter) {
    var s = $scope;
    var h = $http;
    var cs = commonScript;
    s.rowLen = "10";
    s.um = [];
    s.datalistgrid = null;
    s.religionlist = []
    s.citizenlist = []
    s.provlist = []
    s.municitylist = []
    s.brgylist = []
    s.ddl_last_name = "A"
    s.btn_label = "Save"
    s.isShowCreate = false
    // ******************************************
    // * VJA - 02/27/2020 - Initialized page
    // ****************************************** 
    function init() {
        //$('#loading_msg').html("LOADING");
        //$("#modal_loading").modal();
        h.post("../cStudentInformation/InitializeData").then(function (d) {
            s.religionlist = d.data.religionlist
            s.citizenlist = d.data.citizenlist
            s.provlist = d.data.provlist
            s.municitylist = d.data.citymunilist
            s.brgylist = d.data.brgylist
            s.um = d.data.um;
            if (d.data.listgrid != null && d.data.listgrid.length > 0) {
                s.datalistgrid = d.data.listgrid;
                init_table_data(s.datalistgrid);
            }
            else init_table_data([]);

            cs.loading("hide");
        });
    }
    init()

    var init_table_data = function (par_data) {
        s.datalistgrid = par_data;
        s.oTable = $('#datalist_grid').dataTable(
            {
                data: s.datalistgrid,
                sDom: 'rt<"bottom"ip><"toolbar">',
                pageLength: 10,
                columns: [
                    { "mData": "f_student_id", "mRender": function (data, type, full, row) { return "<span class='text-center btn-block'>" + data + "</span>" } },
                    { "mData": "f_student_lrn", "mRender": function (data, type, full, row) { return "<span class='text-center btn-block'>" + (data == null ? "":data) + "</span>" } },
                    { "mData": "f_last_name", "mRender": function (data, type, full, row) { return "<span class='text-left btn-block'   style='padding-left:5px'>" + data + "</span>" } },
                    { "mData": "f_first_name", "mRender": function (data, type, full, row) { return "<span class='text-left btn-block'  style='padding-left:5px'>" + data + "</span>" } },
                    { "mData": "f_middle_name", "mRender": function (data, type, full, row) { return "<span class='text-left btn-block' style='padding-left:5px'>" + (data == null ? "" : data) + "</span>" } },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            var send_email = "";
                            if (full["f_emailaddr"] != "" && full["f_emailaddr"] != null)
                            {
                                send_email = '<button type="button" class="btn btn-warning btn-sm" ng-click="btn_send_email_to_all(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="Send">  <i class="fa fa-send"></i></button >';
                            }
                            else
                            {
                                send_email = '<button type="button" class="btn btn-warning btn-sm" ng-disabled="true" data-toggle="tooltip" data-placement="top" title="Send">  <i class="fa fa-send"></i></button >';
                            }

                            return '<center><div class="btn-group">'
                                + '<button type="button" class="btn btn-success btn-sm" ng-show="um.allow_edit    == 1"  ng-click="btn_edit_action(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="Edit">  <i class="fa fa-edit" id="i_edit' + row["row"] + '"></i></button >'
                                +'<button type="button" class="btn btn-danger btn-sm"  ng-show="um.allow_delete  == 1"  ng-click="btn_delete_row(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="Delete"><i class="fa fa-trash" id="i_delete"></i></button>' 
                                + send_email + '' +
                                '</div></center>';
                        }
                    }

                ],
                "createdRow": function (row, data, index) {
                    $compile(row)($scope);  //add this to compile the DOM
                }
            });
        $("#modal_loading").modal('hide');
    }

    // ******************************************
    // * VJA - 02/27/2020 - Search
    // ****************************************** 
    s.search_in_list = function (value, table) {
        $("#" + table).DataTable().search(value).draw();
    }
    // ******************************************
    // * VJA - 02/27/2020 - Set the Number of Row
    // ****************************************** 
    s.setNumOfRow = function (value, table) {
        $("#" + table).DataTable().page.len(value).draw();
    }
    function show_date() {
        $('.datepicker').datepicker({ format: 'yyyy-mm-dd' });
    }

    //***********************************************************//
    //*** VJA - 02/27/2020 - Occure when add button is clicke
    //                      d and initialize the objects
    //***********************************************************// 
    s.btn_add_click = function () {
        ClearEntry();
        s.isShowCreate = false
        ValidationResultColor("ALL", false);
        $('#i_save').addClass('fa-save');
        $('#i_save').removeClass('fa-spinner fa-spin');

        $('#main_modal').on('shown.bs.modal', function () {

            $('.nav-tabs a[href="#tab-1"]').tab('show');

        });
        //LAST

        $('#ddl_student_status').val("A").trigger('change');
        s.ddl_student_status = "A";
        s.ADDEDITMODE = "ADD";
        s.ModalTitle = "Add New Record";
        s.btn_label = "Save"
        s.isdisabled = true;
        s.img_p = "../ResourcesImages/upload_profile.png"
        s.img_p_only = "../ResourcesImages/upload_profile.png"

        h.post("../cStudentInformation/GetLastRow").then(function (d) {

            s.txtb_student_id = d.data.return_val.key_value;
            $('#main_modal').modal({ keyboard: false, backdrop: "static" });
        })

    }

    //***********************************************************//
    //*** VJA - 02/27/2020 - Edit Action Occurred function click
    //***********************************************************// 
    s.btn_edit_action = function (row_index) {
        ClearEntry();
        $('#btn_save').attr('ngx-data', row_index);
        ValidationResultColor("ALL", false);
        s.ADDEDITMODE = "EDIT";
        s.ModalTitle = "Edit Existing Record";
        s.isdisabled = true
        s.btn_label = "Save Edit"
        //$("#modal_loading").modal();

        CheckUserProfileButton(s.datalistgrid[row_index].f_student_id)

        $('#i_edit' + row_index).removeClass('fa-edit');
        $('#i_edit' + row_index).addClass('fa-spinner fa-spin');
        h.post("../cStudentInformation/RetrieveImage", { params1: s.datalistgrid[row_index].f_student_id }).then(function (d) {

            s.img_p = d.data.imgDataURL;
            s.txtb_student_id           = s.datalistgrid[row_index].f_student_id;
            s.txtb_user_id              = s.datalistgrid[row_index].user_id;
            s.txtb_student_lrn          = s.datalistgrid[row_index].f_student_lrn;
            s.txtb_student_lname        = s.datalistgrid[row_index].f_last_name;
            s.txtb_student_fname        = s.datalistgrid[row_index].f_first_name;
            s.txtb_student_mname        = s.datalistgrid[row_index].f_middle_name;
            s.txtb_student_sname        = s.datalistgrid[row_index].f_suffix_name;
            s.txtb_courtisy             = s.datalistgrid[row_index].f_courtisy_title;
            s.ddl_gender                = s.datalistgrid[row_index].f_gender;
            s.ddl_civil_status          = s.datalistgrid[row_index].f_civilstatus;
            s.txtb_bdate                = s.datalistgrid[row_index].f_dateofbirth;
            s.ddl_citizenship           = s.datalistgrid[row_index].f_reli_code;
            s.ddl_religion              = s.datalistgrid[row_index].f_citz_code;
            s.txtb_current_add          = s.datalistgrid[row_index].f_currentaddress;
            s.ddl_province              = s.datalistgrid[row_index].f_prov_code;
            s.ddl_municipality          = s.datalistgrid[row_index].f_city_code;
            s.ddl_brgy                  = s.datalistgrid[row_index].f_brgy_code;
            s.txtb_contact_nbr          = s.datalistgrid[row_index].f_contactnbrs;
            s.txtb_email_add            = s.datalistgrid[row_index].f_emailaddr;
            s.txtb_father_name          = s.datalistgrid[row_index].f_fathername;
            s.txtb_mother_name          = s.datalistgrid[row_index].f_mothername;
            s.txtb_guardian_name        = s.datalistgrid[row_index].f_guardianname;
            s.txtb_emergency_name       = s.datalistgrid[row_index].f_emergencycname;
            s.txtb_emergency_nbr        = s.datalistgrid[row_index].f_emergencycnbrs;
            s.ddl_student_status        = s.datalistgrid[row_index].f_stud_status;
            s.txtb_father_occupation    = s.datalistgrid[row_index].f_fatheroccupation;
            s.txtb_mother_occupation    = s.datalistgrid[row_index].f_motheroccupation;
            s.txtb_guardian_occupation  = s.datalistgrid[row_index].f_guardianoccupation;
            //$("#modal_loading").modal('hide');
            $('#i_edit' + row_index).addClass('fa-edit');
            $('#i_edit' + row_index).removeClass('fa-spinner fa-spin');
            $('#main_modal').on('shown.bs.modal', function () {

                $('.nav-tabs a[href="#tab-1"]').tab('show');

            });
            $('#main_modal').modal({ keyboard: false, backdrop: "static" });

        })

    }
    function CheckUserProfileButton(value) {

        h.post("../cStudentInformation/CheckUserProfile",
            {
                par_f_student_id: value
            }).then(function (d)
            {
                if (d.data.message == "success")
                {
                    s.isShowCreate = true
                }

                else
                {
                    s.isShowCreate = false
                }
            })
    }

    function CheckUserProfile(value)
    {
       
        h.post("../cStudentInformation/CheckUserProfile",
            {
                par_f_student_id: value
            }).then(function (d)
            {
                if (d.data.message == "success")
                {
                    swal({
                        title: "Would you like to create user profile for this student?",
                        text: "This student doesn't have an existing account.",
                        icon: "warning",
                        buttons: true,
                        buttons: ["No", "Yes"],
                        dangerMode: true,

                    }).then(function (willDelete)
                    {
                        if (willDelete) {
                            h.post("../cStudentInformation/GetSessionId",
                                {
                                    par_f_student_id: value
                                }).then(function (d) {

                                    if (d.data.message == "success") {
                                        var url = "../cCreateAccount/"
                                        window.location.href = url
                                    }

                                })

                            $('#main_modal').modal("hide");
                            
                            swal("Your record has been saved, Student ID Nbr. Is : " + value + "!", { icon: "success", });
                        }

                        else
                        {
                            $('#main_modal').modal("hide");
                            if (s.ADDEDITMODE == "ADD") {
                                swal("Successfully Added!", "New Record has been Successfully Added!, Student ID Nbr. Is : " + value + "!", { icon: "success", });
                            }

                            else if (s.ADDEDITMODE == "EDIT") {
                                swal("Successfully Updated!", "Existing Record Successfully Updated!, Student ID Nbr. Is : " + value + "!", { icon: "success", });
                            }
                           
                        }

                        })
                }

                else
                {
                    $('#main_modal').modal("hide");

                    if (s.ADDEDITMODE == "ADD")
                    {
                        swal("Successfully Added!", "New Record has been Successfully Added!, Student ID Nbr. Is : " + value + "!", { icon: "success", });
                    }

                    else if (s.ADDEDITMODE == "EDIT")
                    {
                        swal("Successfully Updated!", "Existing Record Successfully Updated!, Student ID Nbr. Is : " + value + "!", { icon: "success", });
                    }
                }
            })
    }

    s.btn_create_click = function (value)
    {
        h.post("../cStudentInformation/GetSessionId",
            {
                par_f_student_id: value
            }).then(function (d) {

                if (d.data.message == "success") {
                    var url = "../cCreateAccount/"
                    window.location.href = url
                }

            })
    }

    //***********************************************************//
    //*** VJA - 02/27/2020 -  Edit Action Occurred function click
    //***********************************************************// 
    s.btn_delete_row = function (id_ss) {
        var dt = null;
        dt = s.datalistgrid[id_ss]
        swal({
            title: "Are you sure to delete this record?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,

        })
            .then(function (willDelete) {
                if (willDelete) {
                    h.post("../cStudentInformation/DeleteFromDatabase",
                        {
                            par_f_student_id: s.datalistgrid[id_ss].f_student_id
                        }).then(function (d) {

                            if (d.data.message == "success")
                            {
                                s.datalistgrid = s.datalistgrid.remove(s.datalistgrid[id_ss].f_student_id, "f_student_id");
                                swal("Your record has been deleted!", { icon: "success", });
                            }
                            else
                            {
                                swal(d.data.message, "Data not deleted", "error");
                            }
                            
                            if (s.datalistgrid.length != 0) {
                                s.oTable.fnClearTable();
                                s.oTable.fnAddData(s.datalistgrid);
                            } else {
                                s.oTable.fnClearTable();
                            }
                        })
                }
            });

        $(".swal-button.swal-button--cancel")[0].innerHTML = "No"
        $(".swal-button.swal-button--confirm")[0].innerHTML = "Yes"
    }
    //***********************************************************//
    //*** VJA - 02/27/2020 - Convert date to String from 1 to 01 if less than 10
    //***********************************************************// 
    function datestring(d)
    {
        var date_val = ""
        if (d < 10) {
            date_val= '0' + d
        } else {
            date_val = d
        } 
        return date_val
    }

    //***********************************************************//
    //*** VJA - 02/27/2020 - Occure when save button is clicked and save/edit data
    //***********************************************************// 
    s.btn_save_click = function () {
        
        if (ValidateFields()) {
            var data =
            {
                 f_student_id         : s.txtb_student_id       
                ,f_student_lrn        : s.txtb_student_lrn      
                ,f_last_name          : s.txtb_student_lname    
                ,f_first_name         : s.txtb_student_fname    
                ,f_middle_name        : s.txtb_student_mname    
                ,f_suffix_name        : s.txtb_student_sname    
                ,f_courtisy_title     : s.txtb_courtisy         
                ,f_gender             : s.ddl_gender            
                ,f_civilstatus        : s.ddl_civil_status            
                ,f_dateofbirth        : $('#txtb_bdate').val()      
                ,f_reli_code          : s.ddl_citizenship       
                ,f_citz_code          : s.ddl_religion          
                ,f_currentaddress     : s.txtb_current_add      
                ,f_prov_code          : s.ddl_province          
                ,f_city_code          : s.ddl_municipality      
                ,f_brgy_code          : s.ddl_brgy              
                ,f_contactnbrs        : s.txtb_contact_nbr      
                ,f_emailaddr          : s.txtb_email_add        
                ,f_fathername         : s.txtb_father_name      
                ,f_mothername         : s.txtb_mother_name      
                ,f_guardianname       : s.txtb_guardian_name    
                ,f_emergencycname     : s.txtb_emergency_name   
                ,f_emergencycnbrs     : s.txtb_emergency_nbr    
                ,f_stud_status        : s.ddl_student_status
                ,f_fatheroccupation   : s.txtb_father_occupation
                ,f_motheroccupation   : s.txtb_mother_occupation
                ,f_guardianoccupation : s.txtb_guardian_occupation
            };
            
            if (s.ADDEDITMODE == "ADD") {
                $('#i_save').removeClass('fa-save');
                $('#i_save').addClass('fa-spinner fa-spin');
                h.post("../cStudentInformation/SaveFromDatabase", {data : data}).then(function (d) {
                    if (d.data.message == "success")
                    {
                        h.post("../cStudentInformation/RetrieveGrid", {
                            par_ddl_last_name: $('#txtb_student_lname').val().trim().substring(0, 1).toUpperCase()
                        }
                        ).then(function (d) {
                            if (d.data.listgrid.length > 0) {
                                s.datalistgrid = d.data.listgrid;
                                s.oTable.fnClearTable();
                                s.oTable.fnAddData(d.data.listgrid)
                            }
                            else
                            {
                                s.oTable.fnClearTable();
                            }
                            s.ddl_last_name = $('#txtb_student_lname').val().trim().substring(0, 1).toUpperCase();

                            s.datalistgrid.push(data)

                            for (var x = 1; x <= $('#datalist_grid').DataTable().page.info().pages; x++) {
                                if (get_page(s.txtb_student_id) == false) {
                                    s.oTable.fnPageChange(x);
                                }
                                else {
                                    break;
                                }
                            }

                            CheckUserProfile(data.f_student_id)
                            //$('#main_modal').modal("hide");
                            //swal("Your record has been saved!", { icon: "success", });
                        })
 
                    }
                    else
                    {
                        swal(d.data.message, { icon: "error", });
                    }

                    $('#i_save').addClass('fa-save');
                    $('#i_save').removeClass('fa-spinner fa-spin');
                });
            }
            else if (s.ADDEDITMODE == "EDIT") {
                $('#i_save').removeClass('fa-save');
                $('#i_save').addClass('fa-spinner fa-spin');

                h.post("../cStudentInformation/UpdateFromDatabase", { data: data }).then(function (d) {
                    if (d.data.message == "success") {
                        
                        var index_of_row = $('#btn_save').attr('ngx-data');
                        
                        s.datalistgrid[index_of_row].f_student_id           = s.txtb_student_id
                        s.datalistgrid[index_of_row].f_student_lrn          = s.txtb_student_lrn
                        s.datalistgrid[index_of_row].f_last_name            = s.txtb_student_lname
                        s.datalistgrid[index_of_row].f_first_name           = s.txtb_student_fname
                        s.datalistgrid[index_of_row].f_middle_name          = s.txtb_student_mname
                        s.datalistgrid[index_of_row].f_suffix_name          = s.txtb_student_sname
                        s.datalistgrid[index_of_row].f_courtisy_title       = s.txtb_courtisy
                        s.datalistgrid[index_of_row].f_gender               = s.ddl_gender
                        s.datalistgrid[index_of_row].f_civilstatus          = s.ddl_civil_status
                        s.datalistgrid[index_of_row].f_dateofbirth          = s.txtb_bdate
                        s.datalistgrid[index_of_row].f_reli_code            = s.ddl_citizenship
                        s.datalistgrid[index_of_row].f_citz_code            = s.ddl_religion
                        s.datalistgrid[index_of_row].f_currentaddress       = s.txtb_current_add
                        s.datalistgrid[index_of_row].f_prov_code            = s.ddl_province
                        s.datalistgrid[index_of_row].f_city_code            = s.ddl_municipality
                        s.datalistgrid[index_of_row].f_brgy_code            = s.ddl_brgy
                        s.datalistgrid[index_of_row].f_contactnbrs          = s.txtb_contact_nbr
                        s.datalistgrid[index_of_row].f_emailaddr            = s.txtb_email_add
                        s.datalistgrid[index_of_row].f_fathername           = s.txtb_father_name
                        s.datalistgrid[index_of_row].f_mothername           = s.txtb_mother_name
                        s.datalistgrid[index_of_row].f_guardianname         = s.txtb_guardian_name
                        s.datalistgrid[index_of_row].f_emergencycname       = s.txtb_emergency_name
                        s.datalistgrid[index_of_row].f_emergencycnbrs       = s.txtb_emergency_nbr
                        s.datalistgrid[index_of_row].f_stud_status          = s.ddl_student_status
                        s.datalistgrid[index_of_row].f_fatheroccupation     = s.txtb_father_occupation
                        s.datalistgrid[index_of_row].f_motheroccupation     = s.txtb_mother_occupation
                        s.datalistgrid[index_of_row].f_guardianoccupation   = s.txtb_guardian_occupation
                        
                        h.post("../cStudentInformation/RetrieveGrid",
                        {
                            par_ddl_last_name: $('#txtb_student_lname').val().trim().substring(0, 1).toUpperCase()
                        }
                        ).then(function (d) {
                            if (d.data.listgrid.length > 0) {
                                s.datalistgrid = d.data.listgrid;
                                s.oTable.fnClearTable();
                                s.oTable.fnAddData(d.data.listgrid)
                            }
                            else {
                                s.oTable.fnClearTable();
                            }
                            s.ddl_last_name = $('#txtb_student_lname').val().trim().substring(0, 1).toUpperCase();

                            s.oTable.fnClearTable();
                            s.oTable.fnAddData(s.datalistgrid);

                            for (var x = 1; x <= $('#datalist_grid').DataTable().page.info().pages; x++) {
                                if (get_page(s.txtb_student_id) == false)
                                {
                                    s.oTable.fnPageChange(x);
                                }
                                else
                                {
                                    break;
                                }
                            }

                            CheckUserProfile(s.datalistgrid[index_of_row].f_student_id)

                            
                        })
                        
                    }
                    else {
                        swal(d.data.message, { icon: "error", });
                    }

                    $('#i_save').addClass('fa-save');
                    $('#i_save').removeClass('fa-spinner fa-spin');
                });
            }
        }

    }

    //***********************************************************//
    //*** VJA - 02/27/2020 - Get Page Row
    //***********************************************************// 
    function get_page(empl_id) {
        var nakit_an = false;
        var rowx = 0;
        $('#datalist_grid tr').each(function () {
            $.each(this.cells, function (cells) {
                if (cells == 0) {
                    if ($(this).text() == empl_id) {
                        nakit_an = true;
                        return false;
                    }
                }
            });
            if (nakit_an) {
                $(this).addClass("selected");
                return false;
            }
            rowx++;
        });
        return nakit_an;
    }
    
    //***********************************************************//
    //*** VJA - 02/27/2020 - Clear All Textboxes and Dropdownlist
    //***********************************************************// 
    function ClearEntry()
    {
        s.txtb_student_id           = "";
        s.txtb_student_lrn          = "";
        s.txtb_student_lname        = "";
        s.txtb_student_fname        = "";
        s.txtb_student_mname        = "";
        s.txtb_student_sname        = "";
        s.txtb_courtisy             = "";
        s.ddl_gender                = "";
        s.txtb_bdate                = "";
        s.ddl_civil_status          = "";
        s.ddl_citizenship           = "";
        s.ddl_religion              = "";
        s.txtb_current_add          = "";
        s.ddl_province              = "";
        s.ddl_municipality          = "";
        s.ddl_brgy                  = "";
        s.txtb_contact_nbr          = "";
        s.txtb_email_add            = "";
        s.txtb_father_name          = "";
        s.txtb_mother_name          = "";
        s.txtb_guardian_name        = "";
        s.txtb_emergency_name       = "";
        s.txtb_emergency_nbr        = "";
        s.ddl_student_status        = "";
        s.txtb_father_occupation    = "";
        s.txtb_mother_occupation    = "";
        s.txtb_guardian_occupation    = "";

    }
    //***********************************************************//
    //***VJA - 02/27/2020 -  Field validation everytime generation 
    //                          button is click ***//
    //***********************************************************// 
    function ValidateFields() {
        var return_val = true;
        ValidationResultColor("ALL", false);
        var tab_click = 1;
        if ($('#txtb_current_add').val().trim() == "") {
            ValidationResultColor("txtb_current_add", true);
            var tab_click = 2;
            return_val = false;
        }
        if ($('#ddl_province').val() == "") {
            ValidationResultColor("ddl_province", true);
            var tab_click = 2;
            return_val = false;
        }
        if ($('#ddl_municipality').val() == "") {
            ValidationResultColor("ddl_municipality", true);
            var tab_click = 2;
            return_val = false;
        }
        if ($('#ddl_brgy').val() == "") {
            ValidationResultColor("ddl_brgy", true);
            var tab_click = 2;
            return_val = false;
        }
        if ($('#txtb_contact_nbr').val().trim() == "") {
            ValidationResultColor("txtb_contact_nbr", true);
            var tab_click = 2;
            return_val = false;
        }
        //if ($('#txtb_email_add').val().trim() == "") {
        //    ValidationResultColor("txtb_email_add", true);
        //    var tab_click = 2;
        //    return_val = false;
        //}
        //if ($('#txtb_father_name').val().trim() == "") {
        //    ValidationResultColor("txtb_father_name", true);
        //    var tab_click = 3;
        //    return_val = false;
        //}
        //if ($('#txtb_mother_name').val().trim() == "") {
        //    ValidationResultColor("txtb_mother_name", true);
        //    var tab_click = 3;
        //    return_val = false;
        //}
        //if ($('#txtb_guardian_name').val().trim() == "") {
        //    ValidationResultColor("txtb_guardian_name", true);
        //    var tab_click = 3;
        //    return_val = false;
        //}
        //if ($('#txtb_emergency_name').val().trim() == "") {
        //    ValidationResultColor("txtb_emergency_name", true);
        //    var tab_click = 3;
        //    return_val = false;
        //}
        //if ($('#txtb_emergency_nbr').val().trim() == "") {
        //    ValidationResultColor("txtb_emergency_nbr", true);
        //    var tab_click = 3;
        //    return_val = false;
        //}
        //if ($('#ddl_student_status').val().trim() == "") {
        //    ValidationResultColor("ddl_student_status", true);
        //    var tab_click = 3;
        //    return_val = false;
        //}

        if ($('#txtb_student_id').val().trim() == "" && s.ADDEDITMODE == "ADD") {
            ValidationResultColor("txtb_student_id", true);
            var tab_click = 1;
            return_val = false;
        }
        if ($('#txtb_student_lrn').val().trim() == "") {
            ValidationResultColor("txtb_student_lrn", true);
            var tab_click = 1;
            return_val = false;
        }
        if ($('#txtb_student_lname').val().trim() == "") {
            ValidationResultColor("txtb_student_lname", true);
            var tab_click = 1;
            return_val = false;
        } else if (checkischaracter($('#txtb_student_lname').val().trim()) == false) {
            ValidationResultColor("txtb_student_lname", true);
            $("#txtb_student_lname").addClass("required");
            $("#lbl_txtb_student_lname_req").text("Invalid Character");
            var tab_click = 1;
            return_val = false;
        }
        if ($('#txtb_student_fname').val().trim() == "") {
            ValidationResultColor("txtb_student_fname", true);
            var tab_click = 1;
            return_val = false;
        }
        // if ($('#txtb_student_mname').val().trim() == "") {
        //     ValidationResultColor("txtb_student_mname", true);
        //     var tab_click = 1;
        //     return_val = false;
        // }
        //if ($('#txtb_student_sname').val().trim() == "") {
        //    ValidationResultColor("txtb_student_sname", true);
        //    var tab_click = 1;
        //    return_val = false;
        //}
        //if ($('#txtb_courtisy').val().trim() == "") {
        //    ValidationResultColor("txtb_courtisy", true);
        //    var tab_click = 1;
        //    return_val = false;
        //}
        if ($('#ddl_gender').val() == "") {
            ValidationResultColor("ddl_gender", true);
            var tab_click = 1;
            return_val = false;
        }
        if ($('#txtb_bdate').val().trim() == "") {
            ValidationResultColor("txtb_bdate", true);
            var tab_click = 1;
            return_val = false;
        } else if (checkisdate($('#txtb_bdate').val().trim()) == false)
        {
            ValidationResultColor("txtb_bdate", true);
            $("#txtb_bdate").addClass("required");
            $("#lbl_txtb_bdate_req").text("Invalid Date Format");
            var tab_click = 1;
            return_val = false;
        }

        if ($('#ddl_civil_status').val() == "")
        {
            ValidationResultColor("ddl_civil_status", true);
            var tab_click = 1;
            return_val = false;
        }

        //if ($('#ddl_citizenship').val() == "") {
        //    ValidationResultColor("ddl_citizenship", true);
        //    var tab_click = 1;
        //    return_val = false;
        //}
        //if ($('#ddl_religion').val() == "") {
        //    ValidationResultColor("ddl_religion", true);
        //    var tab_click = 1;
        //    return_val = false;
        //}
        
        $('#tab' + tab_click).click();
        return return_val;
    }

    //***********************************************************//
    //***VJA - 02/27/2020 - Field validation everytime generation 
    //                      button is click ***//
    //***********************************************************// 
    function ValidationResultColor(par_object_id, par_v_result) {
        if (par_v_result) {
            //Add class to the obect that need to focus as a required..
            $("#" + par_object_id).addClass("required");
            $("#lbl_" + par_object_id + "_req").text("Required Field");
            document.getElementById(par_object_id).focus(); 
        }
        else {
            //remove of refresh the object form being required
            $("#txtb_student_id").removeClass("required");
            $("#lbl_txtb_student_id_req").text("");

            $("#txtb_student_lrn").removeClass("required");
            $("#txtb_student_lrn").attr("focus");
            $("#lbl_txtb_student_lrn_req").text("");

            $("#txtb_student_lname").removeClass("required");
            $("#lbl_txtb_student_lname_req").text("");

            $("#txtb_student_fname").removeClass("required");
            $("#lbl_txtb_student_fname_req").text("");

            $("#txtb_student_mname").removeClass("required");
            $("#lbl_txtb_student_mname_req").text("");

            $("#txtb_student_sname").removeClass("required");
            $("#lbl_txtb_student_sname_req").text("");

            $("#txtb_courtisy").removeClass("required");
            $("#lbl_txtb_courtisy_req").text("");

            $("#ddl_gender").removeClass("required");
            $("#lbl_ddl_gender_req").text("");

            $("#txtb_bdate").removeClass("required");
            $("#lbl_txtb_bdate_req").text("");

            $("#ddl_civil_status").removeClass("required");
            $("#lbl_ddl_civil_status_req").text("");

            $("#ddl_citizenship").removeClass("required");
            $("#lbl_ddl_citizenship_req").text("");

            $("#ddl_religion").removeClass("required");
            $("#lbl_ddl_religion_req").text("");
            
            $("#txtb_current_add").removeClass("required");
            $("#lbl_txtb_current_add_req").text("");
            
            $("#ddl_province").removeClass("required");
            $("#lbl_ddl_province_req").text("");
            
            $("#ddl_municipality").removeClass("required");
            $("#lbl_ddl_municipality_req").text("");
            
            $("#ddl_brgy").removeClass("required");
            $("#lbl_ddl_brgy_req").text("");
            
            $("#txtb_contact_nbr").removeClass("required");
            $("#lbl_txtb_contact_nbr_req").text("");
            
            $("#txtb_email_add").removeClass("required");
            $("#lbl_txtb_email_add_req").text("");
            
            $("#txtb_father_name").removeClass("required");
            $("#lbl_txtb_father_name_req").text("");
            
            $("#txtb_mother_name").removeClass("required");
            $("#lbl_txtb_mother_name_req").text("");
            
            $("#txtb_guardian_name").removeClass("required");
            $("#lbl_txtb_guardian_name_req").text("");
            
            $("#txtb_emergency_name").removeClass("required");
            $("#lbl_txtb_emergency_name_req").text("");
            
            $("#txtb_emergency_nbr").removeClass("required");
            $("#lbl_txtb_emergency_nbr_req").text("");
            
            $("#ddl_student_status").removeClass("required");
            $("#lbl_ddl_student_status_req").text("");
            
        }
    }
    Array.prototype.delete = function (code) {
        return this.filter(function (d, k) {
            return k != code
        })
    }
    //***********************************************************//
    //***VJA - 02/27/2020 - Occure when value change
    //***********************************************************// 
    //s.set_empl_name_index = function (par_voucher_index) {
    //    if (par_voucher_index != "")
    //    {
    //        s.txtb_empl_id          = s.emplist[par_voucher_index].empl_id;
    //        s.txtb_department_name  = s.emplist[par_voucher_index].department_name1;
    //        s.txtb_position         = s.emplist[par_voucher_index].position_long_title;
    //        s.lbl_rate_descr        = s.emplist[par_voucher_index].salary_rate_descr;
    //        s.txtb_rate_amount      = currency(s.emplist[par_voucher_index].salary_rate_amt);
    //    }
    //    else
    //    {
    //        s.txtb_empl_id            = "";
    //        s.txtb_department_name    = "";
    //        s.txtb_position           = "";
    //        s.lbl_rate_descr          = "Rate Amount";
    //        s.txtb_rate_amount        = "0.00";
    //    }
    //}
    //***********************************************************//
    //***VJA - 02/27/2020 - Convert The Currency to 0,000,000.00 format
    //***********************************************************// 
    function currency(d) {

        var retdata = ""
        if (d == null || d == "" || d == undefined) {
            return retdata = "0.00"
        }
        else {
            retdata = parseFloat(d).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')

            return retdata

        }
    }
    //***********************************//
    //***VJA - 02/27/2020 - Remove Function****//
    //***********************************// 
    Array.prototype.remove = function (code, prop) {
        return this.filter(function (d) {
            return d[prop] != code
        })
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
    //************************************************//
    //***VJA - 02/29/2020 - Validation for Nunber****//
    //**********************************************//
    function checkischaracter(i) {
        var regex_upper = /[0-9]/;
        var istrue = false;

        if (regex_upper.test(i) == true) {
            istrue = false
        } else {
            istrue = true
        }
        return istrue
    }
    //*********************************************************//
    //***VJA - 02/29/2020 - Retrieve Grid When Select Value***//
    //*******************************************************//
    s.RetrieveGrid = function () {
        h.post("../cStudentInformation/RetrieveGrid", {
            par_ddl_last_name: s.ddl_last_name
        }
        ).then(function (d)
        {
            if (d.data.listgrid.length > 0) {
                s.datalistgrid = d.data.listgrid;
                s.oTable.fnClearTable();
                s.oTable.fnAddData(d.data.listgrid)
            }
            else {
                s.oTable.fnClearTable();
            }
        })
    }
    //***********************************************************//
    //*** VJA - 03/11/2020 - Retrieve 
    //***********************************************************//
    s.btn_change_profile = function () {
        if (s.ADDEDITMODE == "ADD")
        {
            swal("Save the Current Data and Update the Image !", {icon:"warning"});
        }
        else if (s.ADDEDITMODE == "EDIT")
        {
            //if (ValidateFields()) {
            h.post("../cStudentInformation/RetrieveImage", { params1: s.txtb_student_id }).then(function (d) {

                s.img_p_only = d.data.imgDataURL;
                $("#upload_modal").modal();
            })
            //}
        }
        
    }
    //***********************************************************//
    //*** VJA - 03/11/2020 - Upload Image for Internet Explorer
    //***********************************************************// 
    s.InternetExplorer = function () {
        var fileUpload = $('#input_file_upload').get(0);
        var files = fileUpload.files;
        var test = new FormData();
        s.SelectedFiles = files;

        for (var i = 0; i < files.length; i++) {
            test.append('par_file', files[i]);
        }

        if (s.par_allow_to_save_image) {

            $('#btn_update_image').removeClass("fa-save");
            $('#btn_update_image').addClass("fa-spinner spin");

            //TRY
            $http({
                method: 'POST',
                url: '../cStudentInformation/Upload_IE',
                headers: { 'Content-Type': 'multipart/form-data' },
                data: test
            }).then(function (d) {

                $('#btn_update_image').addClass("fa-save");
                $('#btn_update_image').removeClass("fa-spinner spin");

                if (d.data.success) {
                    
                    h.post("../cStudentInformation/RetrieveImage", { params1: s.txtb_student_id }).then(function (d) {

                        s.img_p = d.data.imgDataURL;
                        $('#upload_modal').modal('hide');
                        swal("Successfully Uploaded","Student Image Successfully Uploaded!",{ icon: "success" })
                    })

                    //$("#upload_body").html("<div class='row'> <div class='col-sm-12' style='padding:20px;'><center><h1>" + d.data.error_message + "</h1><button class='btn btn-primary' onclick=' location.href = \"../cChangePassword/\";'>RELOAD PAGE</button></center></div></div>");
                }
                else {
                    swal(d.data.error_message, { icon: "warning" })
                }
            });
        }

    }
    //***********************************************************//
    //*** VJA - 03/11/2020 - Upload Image for Firefox
    //***********************************************************// 
    s.FireFoxUploader = function ()
    {
        var fileUpload = $('#input_file_upload').get(0);
        var files = fileUpload.files;
        s.SelectedFiles = files;
        if (s.par_allow_to_save_image) {
            $('#btn_update_image').removeClass("fa-save");
            $('#btn_update_image').addClass("fa-spinner spin");
            if ($scope.SelectedFiles && $scope.SelectedFiles.length) {
                Upload.upload({
                    url: '/cStudentInformation/Upload_Firefox/',
                    data: { files: $scope.SelectedFiles }
                }).then(function (response) {
                    $('#btn_update_image').addClass("fa-save");
                    $('#btn_update_image').removeClass("fa-spinner spin");
                    
                    $timeout(function () {
                        if (response.data.split('|')[0] == "Success")
                        {

                            h.post("../cStudentInformation/RetrieveImage", { params1: s.txtb_student_id }).then(function (d) {
                               
                                s.img_p = d.data.imgDataURL;
                                $('#upload_modal').modal('hide');
                                swal("Successfully Uploaded","Student Image Successfully Uploaded!", {icon : "success"})
                            })
                            // $("#upload_body").html("<div class='row'> <div class='col-sm-12' style='padding:20px;'><center><h1>SUCCESSFULLY UPLOADED!</h1><button class='btn btn-primary' onclick=' location.href = \"../cChangePassword/\";'>RELOAD PAGE</button></center></div></div>");
                        }
                    });
                }, function (response) {
                    if (response.status > 0) {
                        var errorMsg = response.status + ': ' + response.data;
                        //(errorMsg);
                    }
                }, function (evt) {
                    var element = angular.element(document.querySelector('#dvProgress'));
                    $scope.Progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    element.html('<div style="width: ' + $scope.Progress + '%; height:100%;" >' + $scope.Progress + '%</div>');
                });
            }

        }
    }

     //***********************************************************//
    //*** Joseph - 07/31/2020 - Send Email
    //***********************************************************// 
    s.btn_send_email_to_all = function (par_x)
    {
        if (s.datalistgrid.length > 0)
        {
            swal("Send Informations to Student email!",
                {
                    title: "EMAIL NOTIFICATION",
                    icon: "warning",
                    buttons: true,
                    buttons:
                    {

                        sendEmail: {
                            text: "Send To Email",
                            className: "btn-warning"
                        },
                        cancel: {
                            text: "Close",
                            value: null,
                            visible: true,
                            className: "",
                            closeModal: true,
                        }
                    },
                    closeOnClickOutside: false
                }).then(function (d) {
                    switch (d) {
                        case "sendEmail":
                            {
                                var f_student_id = par_x == "A" ? "" : s.datalistgrid[par_x].f_student_id;
                                 $("#modal_loading").modal({ keyboard: false, backdrop: "static" });
                                h.post("../cStudentInformation/SendEmailToAll",
                                    {
                                        data            :s.ddl_last_name
                                        ,par_student_id : f_student_id
                                    }
                                ).then(function (dx) {
                                    if (dx.data.message == "success")
                                    {
                                        var no_emailx = "!";
                                        if (dx.data.no_email > 0) {
                                            no_emailx = " Student. " + dx.data.no_email + " of this doesn't provide email address";
                                        }
                                        else {
                                            no_emailx = " Student!";
                                        }
                                        if (par_x == "A") {
                                            swal("Email Successfully Sent To " + dx.data.having_email + "/" + (dx.data.having_email + dx.data.no_email) + "" + no_emailx, { icon: "success", });
                                        }
                                        else {
                                            swal("Email Successfully Sent!", { icon: "success", });
                                        }
                                    }
                                    else
                                    {
                                        swal(dx.data.message, { icon: "warning", });
                                    }
                                    $("#modal_loading").modal("hide");
                                });
                                break;
                            }
                    }
                });
        }
        else
        {
            swal("No data on the grid to be send!", { icon: "warning", });
        }
    }
    //***********************************************************//
    //*** VJA - 03/11/2020 - Check What Browser 
    //***********************************************************// 
    navigator.sayswho = (function () {
        var ua = navigator.userAgent, tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE';
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge?)\/(\d+)/);
            if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera').replace('Edg ', 'Edge ');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    })();
    //***********************************************************//
    //*** VJA - 03/11/2020 - Set Image to Array or Byte 
    //***********************************************************// 
    s.SetImageArray = function (par_array, par_allow_to_save_image_x) {
        s.upload_img = par_array;
        s.par_allow_to_save_image = par_allow_to_save_image_x;
    }
    //***********************************************************//
    //*** VJA - 03/11/2020 - Update The Image When Edit MOde
    //***********************************************************//
    s.btn_update_image = function ()
    {
        // For Image Upload
        if (navigator.sayswho == "IE") {
            s.InternetExplorer();
        }
        else {
            s.FireFoxUploader();
        }
        // For Image Upload
    }

    s.RemoveClass = function (value,field)
    {
        if (value != "")
        {
            $("#" + field).removeClass("required");
            $("#lbl_" + field+"_req").text("");
        }
    }

});