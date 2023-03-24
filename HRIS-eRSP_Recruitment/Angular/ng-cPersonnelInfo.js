/*
 * Script created By:       Vincent Jade H. Alivio
 * Script created On:       03/11/2020
 * Purpose of this Script:  Personnel Information Page
 *                          
 */
ng_eSMIS_App.controller("cPersonnelInfo_ctrl", function (commonScript,$scope, Upload, $timeout, $compile, $http, $filter) {
    var s = $scope;
    var h = $http;
    var cs = commonScript;
    s.rowLen = "10";
    s.datalistgrid      = null;
    s.upload_img        = "";
    s.ddl_status        = "true";
    s.um = [];

    s.ddl_gender       = "";
    s.ddl_civil_status = "";
    s.ddl_religion     = "";
    s.ddl_citizenship  = "";
    s.ddl_designation  = "";
    s.ddl_province     = "";
    s.ddl_municipality = "";
    s.ddl_barangay     = "";

    s.religionlist = [];
    s.citizenlist  = [];
    s.desiglist    = [];
    s.provlist     = [];
    s.munilist     = [];
    s.baranlist    = [];
    s.btn_label = "Save"
    s.isShowCreate = false
    // ******************************************
    // * VJA - 03/11/2020 - Initialized page
    // ****************************************** 
    function init() {
        
        
        h.post("../cPersonnelInfo/InitializePage").then(function (d) {


                s.religionlist = d.data.religionlist
                s.citizenlist  = d.data.citizenlist 
                s.desiglist    = d.data.desiglist   
                s.provlist     = d.data.provlist    
                s.munilist     = d.data.munilist    
                s.baranlist    = d.data.baranlist   
                s.um = d.data.um;
            
                if (d.data.listgrid != null && d.data.listgrid.length > 0) 
                {
                    s.datalistgrid = d.data.listgrid;
                    init_table_data(s.datalistgrid);
                }
                else init_table_data([]);

            //$("#modal_loading").modal('hide');
            cs.loading('hide');
            });
    }

    init()

    var init_table_data = function (par_data) {
        s.datalistgrid = par_data;
        s.oTable = $('#datalist_grid').dataTable(
            {
                data: s.datalistgrid,
                sDom: 'rt<"bottom"ip>',
                pageLength:10,
                columns: [
                    { "mData": "empl_id", "mRender": function (data, type, full, row) { return "<span class='text-center btn-block'>" + data + "</span>" } },
                    { "mData": "last_name", "mRender": function (data, type, full, row) { return   "<span class='text-left' style='padding-left:10px'> " + data + "</span>" } },
                    { "mData": "first_name", "mRender": function (data, type, full, row) { return  "<span class='text-left' style='padding-left:10px'> " + data + "</span>" } },
                    { "mData": "middle_name", "mRender": function (data, type, full, row) { return "<span class='text-left' style='padding-left:10px'>" + (data == null ? "" : data) + "</span>" } },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row)
                        {
                            var send_email = "";
                            if (full["email_address"] != "" && full["email_address"] != null)
                            {
                                send_email = '<button type="button" class="btn btn-warning btn-sm" ng-click="btn_send_email_to_all(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="Send">  <i class="fa fa-send"></i></button >';
                            }
                            else
                            {
                                send_email = '<button type="button" class="btn btn-warning btn-sm" ng-disabled="true" data-toggle="tooltip" data-placement="top" title="Send">  <i class="fa fa-send"></i></button >';
                            }
                            return '<center><div class="btn-group">'
                                + '<button type="button" class="btn btn-success btn-sm" ng-show="um.allow_edit    == 1" ng-click="btn_edit_action(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="Edit">  <i class="fa fa-edit"></i></button >' +
                                '<button type="button" class="btn btn-danger btn-sm"  ng-show="um.allow_delete  == 1" ng-click="btn_delete_row(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="Delete"><i class="fa fa-trash"></i></button>' +
                                send_email + '' +
                                '</div></center>';
                        }
                    }

                ],
                "createdRow": function (row, data, index) {
                    $compile(row)($scope);  //add this to compile the DOM
                }
            });
        //$("#modal_loading").modal('hide');
    }

    // ******************************************
    // * VJA - 03/11/2020 - Search Functionality
    // ****************************************** 
    s.search_in_list = function (value, table) {
        $("#" + table).DataTable().search(value).draw();
    }
    // ******************************************
    // * VJA - 03/11/2020 - Set the Number of Row
    // ****************************************** 
    s.setNumOfRow = function (value, table) {
        $("#" + table).DataTable().page.len(value).draw();
    }
    function show_date() {
        $('.datepicker').datepicker({ format: 'yyyy-mm-dd' });
    }

    function CheckUserProfileButton(value) {

        h.post("../cPersonnelInfo/CheckUserProfile",
            {
                par_empl_id: value
            }).then(function (d) {
                if (d.data.message == "success") {
                    s.isShowCreate = true
                }

                else {
                    s.isShowCreate = false
                }
            })
    }

    //***********************************************************//
    //*** VJA - 03/11/2020 - Occure when add button is clicke
    //                      d and initialize the objects
    //***********************************************************// 
    s.btn_add_click = function ()
    {
        $('#i_save').addClass('fa-save');
        $('#i_save').removeClass('fa-spinner fa-spin');
        ClearEntry();
        s.isShowCreate = false
        ValidationResultColor("ALL", false);
        s.ModalTitle = "Add New Record"
        s.btn_label = "Save"
        s.ADDEDITMODE = "ADD";
        s.isdisabled = true

        h.post("../cPersonnelInfo/GetLastRow").then(function (d) {

            s.txtb_empl_id = "P"+d.data.return_val.key_value;
            $('#main_modal').modal({ keyboard: false, backdrop: "static" });
        })
    }

    s.btn_create_click = function (value) {
        h.post("../cPersonnelInfo/GetSessionId",
            {
                par_empl_id: value
            }).then(function (d) {

                if (d.data.message == "success") {
                    var url = "../cCreateAccount/"
                    window.location.href = url
                }

            })
    }
    //***********************************************************//
    //*** VJA - 03/11/2020 - Edit Action Occurred function click
    //***********************************************************// 
    s.btn_edit_action = function (row_index) {
        ClearEntry();
        $('#btn_save').attr('ngx-data', row_index);
        ValidationResultColor("ALL", false);
        s.ADDEDITMODE = "EDIT";
        s.ModalTitle = "Edit Record";
        s.isdisabled = true
        s.ModalTitle = "Edit Existing Record"
        s.btn_label = "Save Edit"
        CheckUserProfileButton(s.datalistgrid[row_index].empl_id)
        h.post("../cPersonnelInfo/RetrieveImage", { p_empl_id: s.datalistgrid[row_index].empl_id}).then(function (d) {

            s.img_p                 = d.data.imgDataURL;
            s.txtb_empl_id          = s.datalistgrid[row_index].empl_id
            s.txtb_last_name        = s.datalistgrid[row_index].last_name
            s.txtb_first_name       = s.datalistgrid[row_index].first_name
            s.txtb_middle_name      = s.datalistgrid[row_index].middle_name
            s.txtb_suffix_name      = s.datalistgrid[row_index].suffix_name
            s.txtb_courtisy_title   = s.datalistgrid[row_index].courtisy_title

            s.ddl_gender           = s.datalistgrid[row_index].gender
            s.ddl_civil_status     = s.datalistgrid[row_index].civil_status
            s.ddl_designation      = s.datalistgrid[row_index].f_desig_code
            s.txtb_current_address = s.datalistgrid[row_index].current_address
            s.ddl_province         = s.datalistgrid[row_index].prov_code
            s.ddl_municipality     = s.datalistgrid[row_index].city_code
            s.ddl_barangay         = s.datalistgrid[row_index].brgy_code
            s.ddl_religion         = s.datalistgrid[row_index].reli_code
            s.ddl_citizenship      = s.datalistgrid[row_index].citz_code
            s.txtb_contact_nbr     = s.datalistgrid[row_index].contact_nbrs
            s.txtb_email_add       = s.datalistgrid[row_index].email_address
            s.txtb_educ_atmnt      = s.datalistgrid[row_index].educ_attainment
            s.txtb_bdate           = s.datalistgrid[row_index].f_dateofbirth
            s.txtb_user_id         = s.datalistgrid[row_index].user_id
            
            $('#main_modal').modal({ keyboard: false, backdrop: "static" });
        })
        

    }
    //***********************************************************//
    //*** VJA - 03/11/2020 -  Edit Action Occurred function click
    //***********************************************************// 
    s.btn_delete_row = function (id_ss) {
        var dt = null;
        dt = s.datalistgrid[id_ss]
        swal({
            title: "Are you sure to delete this record?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            buttons: ["No", "Yes"],
            dangerMode: true,
           

        })
            .then(function (willDelete) {
                if (willDelete) {
                    h.post("../cPersonnelInfo/DeleteFromDatabase",
                        {
                            p_empl_id: s.datalistgrid[id_ss].empl_id

                        }).then(function (d) {

                            if (d.data.message == "success") {
                                s.datalistgrid = s.datalistgrid.remove(s.datalistgrid[id_ss].empl_id, "empl_id");
                                if (s.datalistgrid.length != 0) {
                                    s.oTable.fnClearTable();
                                    s.oTable.fnAddData(s.datalistgrid);
                                } else {
                                    s.oTable.fnClearTable();
                                }
                                swal("Your Record has been Deleted Successfully!", { icon: "success", });
                            }
                            else {
                                swal(d.data.message, "Data not deleted", "error");
                            }

                        })
                }
            });
    }
    //***********************************************************//
    //*** VJA - 03/11/2020 - Convert date to String from 1 to 01 if less than 10
    //***********************************************************// 
    function datestring(d) {
        var date_val = ""
        if (d < 10) {
            date_val = '0' + d
        } else {
            date_val = d
        }
        return date_val
    }

    //***********************************************************//
    //*** VJA - 03/11/2020 - Occure when save button is clicked and save/edit data
    //***********************************************************// 
    s.btn_save_click = function () {
        if (ValidateFields())
        {
            var data =
            {
                empl_id             : s.txtb_empl_id
               ,last_name           : s.txtb_last_name
               ,first_name          : s.txtb_first_name
               ,middle_name         : s.txtb_middle_name
               ,suffix_name         : s.txtb_suffix_name
               ,courtisy_title      : s.txtb_courtisy_title
               ,gender              : s.ddl_gender
               ,civil_status        : s.ddl_civil_status
               ,f_desig_code        : s.ddl_designation
               ,current_address     : s.txtb_current_address
               ,prov_code           : s.ddl_province
               ,city_code           : s.ddl_municipality
               ,brgy_code           : s.ddl_barangay
               ,reli_code           : s.ddl_religion
               ,citz_code           : s.ddl_citizenship
               ,contact_nbrs        : s.txtb_contact_nbr
               ,email_address       : s.txtb_email_add
               ,educ_attainment     : s.txtb_educ_atmnt
               ,f_dateofbirth       : $('#txtb_bdate').val()
               
            };

            if (s.ADDEDITMODE == "ADD") {
                $('#i_save').removeClass('fa-save');
                $('#i_save').addClass('fa-spinner fa-spin');
                h.post("../cPersonnelInfo/SaveFromDatabase", { data: data }).then(function (d) {
                    if (d.data.message == "success") {
                        
                        s.datalistgrid.push(data)
                        s.oTable.fnClearTable();
                        s.oTable.fnAddData(s.datalistgrid);

                        for (var x = 1; x <= $('#datalist_grid').DataTable().page.info().pages; x++) {
                            if (get_page(s.txtb_empl_id) == false) {
                                s.oTable.fnPageChange(x);
                            }
                            else {
                                break;
                            }
                        }

                        CheckUserProfile(data.empl_id)
                    }
                    else {
                        swal(d.data.message, { icon: "error", });
                    }

                    $('#i_save').addClass('fa-save');
                    $('#i_save').removeClass('fa-spinner fa-spin');
                });
            }
            else if (s.ADDEDITMODE == "EDIT") {
                $('#i_save').removeClass('fa-save');
                $('#i_save').addClass('fa-spinner fa-spin');

                h.post("../cPersonnelInfo/UpdateFromDatabase", { data: data }).then(function (d) {
                    if (d.data.message == "success") {
                        
                        var index_of_row = $('#btn_save').attr('ngx-data');
                        s.datalistgrid[index_of_row].empl_id                = s.txtb_empl_id
                        s.datalistgrid[index_of_row].last_name              = s.txtb_last_name
                        s.datalistgrid[index_of_row].first_name             = s.txtb_first_name
                        s.datalistgrid[index_of_row].middle_name            = s.txtb_middle_name
                        s.datalistgrid[index_of_row].suffix_name            = s.txtb_suffix_name
                        s.datalistgrid[index_of_row].courtisy_title         = s.txtb_courtisy_title
                        s.datalistgrid[index_of_row].gender                 = s.ddl_gender
                        s.datalistgrid[index_of_row].civil_status           = s.ddl_civil_status
                        s.datalistgrid[index_of_row].f_desig_code           = s.ddl_designation
                        s.datalistgrid[index_of_row].current_address        = s.txtb_current_address
                        s.datalistgrid[index_of_row].prov_code              = s.ddl_province
                        s.datalistgrid[index_of_row].city_code              = s.ddl_municipality
                        s.datalistgrid[index_of_row].brgy_code              = s.ddl_barangay
                        s.datalistgrid[index_of_row].reli_code              = s.ddl_religion
                        s.datalistgrid[index_of_row].citz_code              = s.ddl_citizenship
                        s.datalistgrid[index_of_row].contact_nbrs           = s.txtb_contact_nbr
                        s.datalistgrid[index_of_row].email_address          = s.txtb_email_add
                        s.datalistgrid[index_of_row].educ_attainment        = s.txtb_educ_atmnt
                        s.datalistgrid[index_of_row].f_dateofbirth          = $('#txtb_bdate').val()
                        
                        s.oTable.fnClearTable();
                        s.oTable.fnAddData(s.datalistgrid);

                        for (var x = 1; x <= $('#datalist_grid').DataTable().page.info().pages; x++) {
                            if (get_page(s.txtb_empl_id) == false) {
                                s.oTable.fnPageChange(x);
                            }
                            else {
                                break;
                            }
                        }

                        CheckUserProfile(s.datalistgrid[index_of_row].empl_id)

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

    function CheckUserProfile(value) {
       
        h.post("../cPersonnelInfo/CheckUserProfile",
            {
                par_empl_id: value
            }).then(function (d) {
                if (d.data.message == "success") {
                    swal({
                        title: "Would you like to create user profile for this personnel?",
                        text: "This personnel doesn't have an existing account.",
                        icon: "warning",
                        buttons: true,
                        buttons:["No","Yes"],
                        dangerMode: true,

                    }).then(function (willDelete) {
                        if (willDelete)
                        {
                            h.post("../cPersonnelInfo/GetSessionId",
                                {
                                    par_empl_id: value
                                }).then(function (d) {

                                    if (d.data.message == "success")
                                    {
                                        var url = "../cCreateAccount/"
                                        window.location.href = url
                                    }

                                })

                            $('#main_modal').modal("hide");
                            
                        }

                        else
                        {
                            $('#main_modal').modal("hide");
                            if (s.ADDEDITMODE == "ADD") {
                                swal("Successfully Added!", "New Record has been Successfully Added!, ID Nbr. Is : " + value + "!", { icon: "success", });
                            }

                            else if (s.ADDEDITMODE == "EDIT") {
                                swal("Successfully Updated!", "Existing Record Successfully Updated!, ID Nbr. Is : " + value + "!", { icon: "success", });
                            }
                        }

                    })
                }

                else
                {
                    $('#main_modal').modal("hide");
                    if (s.ADDEDITMODE == "ADD") {
                        swal("Successfully Added!", "New Record has been Successfully Added!, ID Nbr. Is : " + value + "!", { icon: "success", });
                    }

                    else if (s.ADDEDITMODE == "EDIT") {
                        swal("Successfully Updated!", "Existing Record Successfully Updated!, ID Nbr. Is : " + value + "!", { icon: "success", });
                    }
                }
            })
    }
    //***********************************************************//
    //*** VJA - 03/11/2020 - Get Page Row
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
    //*** VJA - 03/11/2020 - Clear All Textboxes and Dropdownlist
    //***********************************************************// 
    function ClearEntry()
    {
        s.txtb_empl_id         = "";
        s.txtb_last_name       = "";
        s.txtb_first_name      = "";
        s.txtb_middle_name     = "";
        s.txtb_suffix_name     = "";
        s.txtb_courtisy_title = "";
        
        s.img_p      = "";
        s.img_p      = "../ResourcesImages/upload_profile.png";
        s.upload_img = "";

        s.ddl_gender           = "";
        s.ddl_civil_status     = "";
        s.ddl_designation      = "";
        s.txtb_current_address = "";
        s.ddl_province         = "";
        s.ddl_municipality     = "";
        s.ddl_barangay         = "";
        s.ddl_religion         = "";
        s.ddl_citizenship      = "";
        s.txtb_contact_nbr     = "";
        s.txtb_email_add       = "";
        s.txtb_educ_atmnt      = "";
        s.txtb_bdate           = "";
        s.txtb_user_id         = "";
    }

    //***********************************************************//
    //***VJA - 03/11/2020 -  Field validation everytime generation 
    //                          button is click ***//
    //***********************************************************// 
    function ValidateFields() {
        var return_val = true;
        ValidationResultColor("ALL", false);
        if ($('#txtb_empl_id').val() == "" && s.ADDEDITMODE == "ADD") {
            ValidationResultColor("txtb_empl_id", true);
            return_val = false;
        }
        if ($('#txtb_last_name').val() == "") {
            ValidationResultColor("txtb_last_name", true);
            return_val = false;
        } 
        if ($('#txtb_first_name').val() == "") {
            ValidationResultColor("txtb_first_name", true);
            return_val = false;
        } 

        //if ($('#txtb_middle_name').val() == "") {
        //    ValidationResultColor("txtb_middle_name", true);
        //    return_val = false;
        //}

        if ($('#txtb_current_address').val() == "") {
            ValidationResultColor("txtb_current_address", true);
            return_val = false;
        } 
        if ($('#ddl_province').val() == "") {
            ValidationResultColor("ddl_province", true);
            return_val = false;
        } 
        if ($('#ddl_municipality').val() == "") {
            ValidationResultColor("ddl_municipality", true);
            return_val = false;
        } 
        if ($('#ddl_barangay').val() == "") {
            ValidationResultColor("ddl_barangay", true);
            return_val = false;
        } 

        if ($('#ddl_gender').val() == "") {
            ValidationResultColor("ddl_gender", true);
            return_val = false;
        }
        if ($('#ddl_civil_status').val() == "") {
            ValidationResultColor("ddl_civil_status", true);
            return_val = false;
        }
        if ($('#ddl_designation').val() == "") {
            ValidationResultColor("ddl_designation", true);
            return_val = false;
        }
        if ($('#txtb_bdate').val() == "") {
            ValidationResultColor("txtb_bdate", true);
            return_val = false;
        }
        return return_val;
    }


    //***********************************************************//
    //***VJA - 03/11/2020 - Field validation everytime generation 
    //                      button is click ***//
    //***********************************************************// 
    function ValidationResultColor(par_object_id, par_v_result) {
        if (par_v_result) {
            //Add class to the obect that need to focus as a required..
            $("#" + par_object_id).addClass("required");
            $("#lbl_" + par_object_id + "_req").text("Required Field");
        }
        else {
            //remove of refresh the object form being required
            $("#txtb_empl_id").removeClass("required");
            $("#lbl_txtb_empl_id_req").text("");

            $("#txtb_last_name").removeClass("required");
            $("#lbl_txtb_last_name_req").text("");

            $("#txtb_first_name").removeClass("required");
            $("#lbl_txtb_first_name_req").text("");

            $("#txtb_middle_name").removeClass("required");
            $("#lbl_txtb_middle_name_req").text("");

            $("#txtb_suffix_name").removeClass("required");
            $("#lbl_txtb_suffix_name_req").text("");

            $("#txtb_courtisy_title").removeClass("required");
            $("#lbl_txtb_courtisy_title_req").text("");

            $("#error_img_msg").removeClass("required");
            $("#error_img_msg").text("");

            $("#ddl_gender").removeClass("required");
            $("#lbl_ddl_gender_req").text("");
            
            $("#ddl_civil_status").removeClass("required");
            $("#lbl_ddl_civil_status_req").text("");
            
            $("#ddl_designation").removeClass("required");
            $("#lbl_ddl_designation_req").text("");
            
            $("#txtb_current_address").removeClass("required");
            $("#lbl_txtb_current_address_req").text("");
            
            $("#ddl_province").removeClass("required");
            $("#lbl_ddl_province_req").text("");
            
            $("#ddl_municipality").removeClass("required");
            $("#lbl_ddl_municipality_req").text("");
            
            $("#ddl_barangay").removeClass("required");
            $("#lbl_ddl_barangay_req").text("");
            
            $("#txtb_bdate").removeClass("required");
            $("#lbl_txtb_bdate_req").text("");

        }
    }
    Array.prototype.delete = function (code) {
        return this.filter(function (d, k) {
            return k != code
        })
    }
    //***********************************************************//
    //***VJA - 03/11/2020 - Convert The Currency to 0,000,000.00 format
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
    //***VJA - 03/11/2020 - Remove Function****//
    //***********************************// 
    Array.prototype.remove = function (code, prop) {
        return this.filter(function (d) {
            return d[prop] != code
        })
    }
    //************************************************//
    //***VJA - 03/11/2020 - Validation for Nunber****//
    //**********************************************//
    function checkisvalidnumber(i) {
        var regex_spchar = /[^a-zA-Z0-9\s]/;
        var regex_upper = /[A-Z]/;
        var regex_lower = /[a-z]/;
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
    //***********************************************************//
    //*** VJA - 03/11/2020 - Upload Image for Internet Explorer
    //***********************************************************// 
    s.InternetExplorer = function () {
        var fileUpload  = $('#input_file_upload').get(0);
        var files       = fileUpload.files;
        var test        = new FormData();
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
                url: '../cPersonnelInfo/Upload_IE',
                headers: { 'Content-Type': 'multipart/form-data' },
                data: test
            }).then(function (d) {

               $('#btn_update_image').addClass("fa-save");
               $('#btn_update_image').removeClass("fa-spinner spin");

                if (d.data.success)
                {
                    swal(d.data.error_message, { icon: "success" })
                    
                    h.post("../cPersonnelInfo/RetrieveImage", { p_empl_id: s.txtb_empl_id }).then(function (d) {

                        s.img_p         = d.data.imgDataURL;
                        $('#upload_modal').modal('hide');
                    })

                    //$("#upload_body").html("<div class='row'> <div class='col-sm-12' style='padding:20px;'><center><h1>" + d.data.error_message + "</h1><button class='btn btn-primary' onclick=' location.href = \"../cChangePassword/\";'>RELOAD PAGE</button></center></div></div>");
                }
                else
                {
                    swal("Uploading Error!", d.data.error_message, { icon: "error" })
                }
            });
        }

    }
    //***********************************************************//
    //*** VJA - 03/11/2020 - Upload Image for Firefox
    //***********************************************************// 
    s.FireFoxUploader = function () {
        var fileUpload = $('#input_file_upload').get(0);
        var files = fileUpload.files;
        s.SelectedFiles = files;
        if (s.par_allow_to_save_image) {
            //$('#i_save').removeClass("fa-save");
            //$('#i_save').addClass("fa-spinner spin");
            if ($scope.SelectedFiles && $scope.SelectedFiles.length) {
                Upload.upload({
                    url: '/cPersonnelInfo/Upload_Firefox/',
                    data: { files: $scope.SelectedFiles }
                }).then(function (response) {
                    //$('#i_save').addClass("fa-save");
                    //$('#i_save').removeClass("fa-spinner spin");
                    $timeout(function () {
                        if (response.data.split('|')[0] == "Success") {
                            swal("Successfully Uploaded!", response.data.split('|')[1], { icon: "success" })
                            h.post("../cPersonnelInfo/RetrieveImage", { p_empl_id: s.txtb_empl_id }).then(function (d) {

                                s.img_p = d.data.imgDataURL;
                                $('#upload_modal').modal('hide');
                            })

                            // $("#upload_body").html("<div class='row'> <div class='col-sm-12' style='padding:20px;'><center><h1>SUCCESSFULLY UPLOADED!</h1><button class='btn btn-primary' onclick=' location.href = \"../cChangePassword/\";'>RELOAD PAGE</button></center></div></div>");
                        } else {
                            swal("Uploading Error!", "Data not Uploaded", { icon: "error" })
                        }
                    });
                }, function (response) {
                    if (response.status > 0) {
                        var errorMsg = response.status + ': ' + response.data;
                        alert(errorMsg);
                    }
                }, function (evt) {
                    var element = angular.element(document.querySelector('#dvProgress'));
                    $scope.Progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    element.html('<div style="width: ' + $scope.Progress + '%; height:100%;" >' + $scope.Progress + '%</div>');
                });
            }

        }
    }
    s.btn_send_email_to_all = function (par_x)
    {
        if (s.datalistgrid.length > 0)
        {
        swal("Send Email to Personnel!", {
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
            switch (d)
            {
                case "sendEmail":
                    {
                        
                        var empl_id = par_x == "A" ? "" : s.datalistgrid[par_x].empl_id;
                        $("#loading_msg_send").html("SENDING");
                        $("#modal_loading").modal({ keyboard: false, backdrop: "static" });
                        h.post("../cPersonnelInfo/SendEmailToAll",
                            {
                                data: s.ddl_status,
                                par_empl_id: empl_id
                            }
                        ).then(function (dx)
                        {
                            if (dx.data.message == "success")
                            {
                                var no_emailx = "!";
                                if (dx.data.no_email > 0)
                                {
                                    no_emailx = " Personnel. "+dx.data.no_email+" of this doesn't provide email address";
                                }
                                else
                                {
                                    no_emailx = " Personnel!";
                                }
                                if (par_x == "A") {
                                    swal("Email Successfully Sent To " + dx.data.having_email + "/" + (dx.data.having_email + dx.data.no_email) + "" + no_emailx, { icon: "success", });
                                }
                                else
                                {
                                    swal("Email Successfully Sent!", { icon: "success", });
                                }
                            }
                            else {
                                swal(dx.data.message, { icon: "warning", });
                            }
                            $("#modal_loading").modal("hide");
                        });
                        break;
                    }
                }
            });
        }
        else {
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
        if (navigator.sayswho == "IE")
        {
            s.InternetExplorer();
        }
        else
        {
            s.FireFoxUploader();
        }
        // For Image Upload
    }
    //***********************************************************//
    //*** VJA - 03/11/2020 - Retrieve 
    //***********************************************************//
    s.RetrieveGrid = function ()
    {
        h.post("../cPersonnelInfo/RetrieveGrid",
            {
                par_status      : s.ddl_status
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

        });

    }
    //***********************************************************//
    //*** VJA - 03/11/2020 - Retrieve 
    //***********************************************************//
    s.btn_change_profile = function ()
    {
        if (s.ADDEDITMODE == "ADD") {
            swal("Save the Current Data and Update the Image !", { icon: "warning" });
        } else if (s.ADDEDITMODE == "EDIT") {
            h.post("../cPersonnelInfo/RetrieveImage", { p_empl_id: s.txtb_empl_id }).then(function (d) {

                s.img_p_only = d.data.imgDataURL;
                $("#upload_modal").modal();
            })
        }
    }

    s.RemoveClass = function (value, field) {
        if (value != "") {
            $("#" + field).removeClass("required");
            $("#lbl_" + field + "_req").text("");
        }
    }

});