
//**********************************************************************************
// PROJECT NAME     :   HRIS - eComval
// VERSION/RELEASE  :   HRIS Release #1
// PURPOSE          :   Code Behind for User Profile And Access
//**********************************************************************************
// REVISION HISTORY
//**********************************************************************************
// AUTHOR                    DATE            PURPOSE
//----------------------------------------------------------------------------------
// Joseph M. Tombo Jr       03/10/2020      Code Creation
//----------------------------------------------------------------------------------
ng_eSMIS_App.controller("cUserProfile_ctrlr", function (commonScript,$scope, $compile, $http, $filter) {
    var s       = $scope
    var h       = $http
    var cs = commonScript;
    var userid      = "";
    var tout        = "";
    s.rowLen        = "10";
    s.year          = [];
    s.current_year  = "";
    s.datalistgrid  = [];
    s.list_of_no_account    = [];
    s.list_of_roles         = [];
    s.list_of_roles_min     = [];
    s.isAdd                 = true;

    function init() {

        //RetrieveYear();
        //var ddate = new Date();
        //s.ddl_month = str_pad(ddate.getMonth() + 1);
        //s.ddl_year = ddate.getFullYear().toString();
        //$("#modal_generating_remittance").modal();
        //**********************************************
        //**********************************************
        // Initialize data during page loads
        //**********************************************
        h.post("../cUserProfile/InitializeData").then(function (d)
        {
            if (d.data.message == "success")
            {
                if (d.data.listgrid.length > 0)
                {
                    init_table_data(d.data.listgrid);
                }
                else
                {
                    init_table_data([]);
                }
               
                ////**********************************************
                ////  Show/Hide ADD, EDIT, DELETE button 
                ////**********************************************
                s.allowAdd        = d.data.um.allow_add
                s.allowDelete     = d.data.um.allow_delete
                s.allowEdit       = d.data.um.allow_edit
                s.allowView       = d.data.um.allow_view
                //$("#modal_generating_remittance").modal("hide");
            }
            else {
                swal(d.data.message, { icon: "warning", });
            }

            cs.loading("hide");
        });
    }
    init()

    //*************************************//
    //Add Leading Zero to Control Number
    //*************************************// 
    function lead_zero2(n) {
        return String("00000" + n).slice(-5);
    }

    function RetrieveYear()
    {

        var currentYear = new Date().getFullYear();

        var prev_year = currentYear - 5;
        for (var i = 1; i <= 8; i++) {
            var data = { "year": prev_year }
            s.year.push(data)
            prev_year++;
        }

    }

    var init_table_data = function (par_data)
    {
        s.datalistgrid = par_data;
        s.oTable = $('#datalist_grid').dataTable(
            {
                data: s.datalistgrid,
                sDom: 'rt<"bottom"ip>',
                pageLength: 10,
                columns: [
                    { "mData": "user_id", "mRender": function (data, type, full, row) { return "<span class='text-center btn-block'>" + data + "</span>" } },
                    {
                        "mData": "personnel_name", "mRender": function (data, type, full, row)
                        { return "<span class='text-left btn-block'>&nbsp;" + data + "</span>" }
                    },
                    {
                        "mData": "locked_account", "mRender": function (data, type, full, row)
                        {
                            var locked_descr = "";
                            var locke_color = "";
                            if (data == 0) {
                                locked_descr = "NO";
                                locke_color = "text-success";
                            }
                            else {
                                locked_descr = "YES";
                                locke_color = "text-danger";
                            }
                            return "<span class='text-center " + locke_color +" btn-block'>" + locked_descr + "</span>"
                        }
                    },
                    {
                        "mData": "user_status", "mRender": function (data, type, full, row)
                        {
                            var locked_descr = "";
                            var locke_color = "";
                            if (data == 0) {
                                locked_descr = "INACTIVE";
                                locke_color = "text-danger";
                            }
                            else {
                                locked_descr = "ACTIVE";
                                locke_color = "text-success";
                            }
                            return "<span class='text-center  " + locke_color + " btn-block'>" + locked_descr + "</span>"
                        }
                    },

                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row)
                        {
                         
                            var allow_send_to_email = "";
                            allow_send_to_email = (full["email_address"] == "" || full["email_address"] == null) ? '<button type="button" ng-disabled="true" class="btn btn-warning btn-sm"  data-toggle="tooltip" data-placement="top" title="Send To Email">  <i id="email_' + full["user_id"] + '" class="fa fa-send"></i></button >' : '<button type="button" ng-disabled="false" class="btn btn-warning btn-sm" ng-click="btn_sendEmail(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="Send To Email">  <i id="email_' + full["user_id"] +'" class="fa fa-send"></i></button >';
                            

                            return '<center><div class="btn-group">' +
                                '<button type="button" ng-show="allowEdit" class="btn btn-success btn-sm" ng-click="btn_edit_action(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="Edit">  <i class="fa fa-edit"></i></button >' +
                                allow_send_to_email+
                                '<button type="button" ng-show="allowDelete" class="btn btn-danger btn-sm" ng-click="btn_del_row(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="Delete"><i class="fa fa-trash"></i></button>' +
                                '<button type="button" ng-show="allowDelete" class="btn btn-primary btn-sm" ng-click="btn_print(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="Print"><i class="fa fa-print"></i></button>' +
                                '</div></center>';
                        }
                    }
                ],
                "createdRow": function (row, data, index) {
                    $compile(row)($scope);  //add this to compile the DOM
                },
            });
    }

    s.search_in_list = function (value, table) {
        try {
            $("#" + table).DataTable().search(value).draw();
        }
        catch (err) {
            alert(err.message)
        }
    }
    s.setNumOfRow = function (value, table) {
        try {
            $("#" + table).DataTable().page.len(value).draw();
        }
        catch (err) {
            alert(err.message)
        }
    }

    s.clear_time_out = function () {
        clearTimeout(tout)
    }
    //************************************//
    //***       Open Add Modal        ****//
    //************************************//
    s.btn_add_click = function ()
    {
        
           
        clearentry();
        ValidationResultColor("ALL", false);
        s.isAdd = true;
        s.ModalTitle = "Add New Record";
        btn = document.getElementById('add');
        btn.innerHTML = '<i class = "fa fa-spinner fa-spin"></i> Add';  
        h.post("../cUserProfile/initAddEdit",
            {
                password:""
            }).then(function (d) {
            if (d.data.message == "success")
            {
                s.list_of_no_account = d.data.empl_no_account;
                s.list_of_roles         = d.data.roles_list;
                s.list_of_roles_min     = d.data.roles_list;
                $('#chck_status').closest('div').addClass("checked");
                $('#chck_status').prop('checked', true);
                $('#chck_change_pass').closest('div').addClass("checked");
                $('#chck_change_pass').prop('checked', true);
                btn.innerHTML = '<i class="fa fa-plus-circle"> </i> Add';
                $('#main_modal').modal({ backdrop: 'static', keyboard: false });
            }
            else {
                $('#main_modal').modal({ backdrop: 'static', keyboard: false });
            }
        });
        
    }

    //*********************************************//
    //*** Filter Page Grid
    //********************************************// 
    s.FilterPageGrid = function () {
        if ($('#ddl_module option:selected').val() != "" && $('#ddl_year option:selected').val() != "" && $('#ddl_month option:selected').val() != "" && $('#ddl_status option:selected').val() != "") {
            h.post("../rSSTickets/FilterPageGrid", {
                par_module_id: $('#ddl_module option:selected').val(),
                par_year: $('#ddl_year option:selected').val(),
                par_month: $('#ddl_month option:selected').val(),
                par_status: $('#ddl_status option:selected').val()
            }).then(function (d) {
                if (d.data.message == "success") {
                    s.vwAssigned = d.data.vwAssigned;
                    s.oTable.fnClearTable();
                    s.datalistgrid = d.data.filteredGrid;
                    if (d.data.filteredGrid.length > 0) {
                        s.oTable.fnAddData(d.data.filteredGrid);
                    }
                }
            })
        }
    }

    //************************************// 
    //*** Save New Record              
    //**********************************// 
    s.btn_save_click = function ()
    {
        if (ValidateFields("A"))
        {
            btn = document.getElementById('addFinal');
            btn.innerHTML = '<i class = "fa fa-spinner fa-spin"></i> Save';
            var row_index = $('#ddl_personnel_name option:selected').attr('ngx-data');
            s.list_of_no_account[row_index]
            var data = {
                user_id         :s.txtb_user_id
              , user_password   :s.txtb_current_pass
              , empl_id         :s.ddl_personnel_name
              , user_status     :($("#chck_status").is(':checked') == true ? 1 :0)
              , locked_account  :($("#chck_change_lock").is(':checked') == true ? 1 : 0)
              , change_password :($("#chck_change_pass").is(':checked') == true ? 1 : 0)
              , created_dttm    :moment(new Date())
              , created_by      :""
              , updated_dttm    :""
              , updated_by      :""
              , expirydate      : $('#txtb_expiry_date').val()
              , account_type    : s.list_of_no_account[row_index].account_type
            }
            var role_data =
            {
                user_id: s.txtb_user_id
                ,role_id:s.ddl_user_roles
            }
            h.post("../cUserProfile/Save",
                {
                     data: data
                    ,role_data:role_data
                }).then(function (d)
                {
                    if (d.data.message == "success")
                    {
                        data.personnel_name_format2 = $('#ddl_personnel_name option:selected').html();
                        data.user_password          = d.data.data.user_password;
                        data.role_id                = s.ddl_user_roles;
                        s.datalistgrid.push(data)
                        s.oTable.fnClearTable();
                        s.oTable.fnAddData(s.datalistgrid);
                        for (var x = 1; x <= $('#datalist_grid').DataTable().page.info().pages; x++) {
                            if (get_page(s.user_id) == false) {
                                s.oTable.fnPageChange(x);
                            }
                            else {
                                break;
                            }
                        }
                        $('#main_modal').modal("hide");
                        swal("Your record has been saved!", { icon: "success", });
                        btn.innerHTML = '<i class="fa fa-save"> </i> Save';
                        clearTimeout(tout)
                    }
                    else {
                        swal(d.data.message, { icon: "warning", });
                    }
            })
        }
    }
    //***********************************************************//
    //***Field validation for remittance type before opening add modal
    //***********************************************************// 
    function ValidateFields(action_mode)
    {
        //Action modes are A for adding data, E for Editing data
        var return_val      = true;
        ValidationResultColor("ALL", false);
        //if (action_mode == "A") {
            if ($("#ddl_personnel_name").val().trim() == "" && action_mode == "A")
            {
                ValidationResultColor("ddl_personnel_name", true);
                return_val = false;
            }

            if ($("#txtb_current_pass").val().trim() == "") {
                ValidationResultColor("txtb_current_pass", true);
                return_val = false;
            }
            else if (s.validateNewPass() == false)
            {
                return_val = false;
            }
            else if ($("#txtb_confirm_password").val().trim() == "")
            {
                ValidationResultColor("txtb_confirm_password", true);
                return_val = false;
            }
            else if (s.validateConfirmNP() == false) {
                return_val = false;
            }

        if ($('#ddl_user_roles').val() == "")
            {
                ValidationResultColor("ddl_user_roles", true);
                    return_val = false;
            }

            
        //}
        //else if (action_mode == "E")
        //{
        //    if ($("#ddl_personnel_name").val().trim() == "") {
        //        ValidationResultColor("ddl_personnel_name", true);
        //    }
        //    if ($("#txtb_current_pass").val().trim() == "") {
        //        ValidationResultColor("txtb_current_pass", true);
        //    }
        //    if ($("#txtb_confirm_passwordword").val().trim() == "") {
        //        ValidationResultColor("txtb_confirm_passwordword", true);
        //    }
        //    if ($("#ddl_user_roles").val().trim() == "") {
        //        ValidationResultColor("ddl_user_roles", true);
        //    } 
        //}
       
        return return_val;
    }
    //***********************************************************//
    //***Field validation for remittance type before opening add modal
    //***********************************************************// 
    function ValidationResultColor(par_object_id, par_v_result) {
        if (par_v_result) {
            //Add class to the obect that need to focus as a required..
            $("#" + par_object_id).addClass("required");
            $("#lbl_" + par_object_id + "_req").text("Required Field");
        }
        else
        {
            //remove of refresh the object form being required

            $("#ddl_personnel_name").removeClass("required");
            $("#lbl_ddl_personnel_name_req").text("");

            $("#ddl_user_roles").removeClass("required");
            $("#lbl_ddl_user_roles_req").text("");

            $("#txtb_current_pass").removeClass("required");
            $("#lbl_txtb_current_pass_req").text("");

            $("#txtb_confirm_password").removeClass("required");
            $("#lbl_txtb_confirm_password_req").text("");

        }
    }

    s.validateCurrentPass = function ()
    {
        var invalid_password = false;
        if (s.txtb_current_pass.trim() == "") {
            $("#txtb_current_pass").removeClass("required");
            //s.aShow = false;
            //s.spnrCPShow = false;
        }
        else
        {
            $("#txtb_current_pass").addClass("required");
            $("#lbl_txtb_current_pass_req").text("Not ok");
        }
    }

    s.validateNewPass = function ()
    {
        var regex_number    = /\d+/g;
        var regex_upper     = /[A-Z]/;
        var regex_lower     = /[a-z]/;
        var regex_spchar    = /[^a-zA-Z0-9\s]/;
        var valid_pass      = true;
        if ((regex_number.test($("#txtb_current_pass").val().trim()) == false
            || regex_upper.test($("#txtb_current_pass").val().trim()) == false
            || regex_lower.test($("#txtb_current_pass").val().trim()) == false
            || regex_spchar.test($("#txtb_current_pass").val().trim()) == false))
        {
            $("#lbl_txtb_current_pass_req").text("New Password require's combination of uppercase, lowercase, and number including atleast 1 special character.");
            valid_pass = false;

        }
        else {
            
            $("#lbl_txtb_current_pass_req").text("");
            valid_pass = true;
        }
        return valid_pass;
    }

    s.validateConfirmNP = function ()
    {
        var confirm = true;
        if (s.txtb_current_pass == s.txtb_confirm_password && s.txtb_confirm_password != "")
        {
            confirm = true;
            $("#lbl_txtb_confirm_password_req").text("");
            $("#txtb_txtb_confirm_password_pass").removeClass("required");

        }
        else {
            $("#lbl_txtb_confirm_password_req").text("Password not match!");
            $("#txtb_txtb_confirm_password_pass").addClass("required");
            confirm = false;
        }
        return confirm;
    }


    function get_page(empl_id) {
        var nakit_an = false;
        var rowx = 0;
        $('#datalist_grid tr').each(function () {
            $.each(this.cells, function (cells) {
                if (cells == 0)
                {
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
    //************************************// 
    //*** Open Edit Modal         
    //**********************************// 
    s.btn_edit_action = function (row_id) {
        clearentry();
        
        //s.ddl_personnel_name    = s.datalistgrid[row_id].empl_id;
       

        h.post("../cUserProfile/initAddEdit",{
            password: s.datalistgrid[row_id].user_password
        }).then(function (d) {
            if (d.data.message == "success")
            {
                s.list_of_no_account    = d.data.empl_no_account;
                s.list_of_roles         = d.data.roles_list;

                s.txtb_personnel_name   = s.datalistgrid[row_id].personnel_name_format2;
                s.txtb_user_id          = s.datalistgrid[row_id].user_id;
                s.ddl_user_roles        = s.datalistgrid[row_id].role_id;
                s.txtb_current_pass     = d.data.password;
                s.txtb_confirm_password = d.data.password;
                s.txtb_expiry_date      = s.datalistgrid[row_id].expirydate;
                s.txtb_email            = s.datalistgrid[row_id].email_address;
                //$('#txtb_expiry_date').val( s.datalistgrid[row_id].expirydate);

                if (s.datalistgrid[row_id].user_status == true)
                {
                    $('#chck_status').closest('div').addClass("checked");
                    $('#chck_status').prop('checked',true);

                }
                if (s.datalistgrid[row_id].locked_account == true) {
                    $('#chck_change_lock').closest('div').addClass("checked");
                    $('#chck_change_lock').prop('checked', true);
                }
                if (s.datalistgrid[row_id].change_password == true)
                {
                    $('#chck_change_pass').closest('div').addClass("checked");
                    $('#chck_change_pass').prop('checked', true);
                }


                s.isAdd         = false;
                s.ModalTitle    = "Edit Existing Record";
                $('#main_modal').modal({ backdrop: 'static', keyboard: false });
                $('#edit').attr('ngx-data', row_id);
            }
            else {
                $('#main_modal').modal({ backdrop: 'static', keyboard: false });
            }
        });
    }

    //***********************************// 
    //*** Update Existing Record         
    //**********************************// 
    s.SaveEdit = function () {
        if (ValidateFields("E")) {
            var row_edited = $('#edit').attr("ngx-data");
            btn = document.getElementById('edit');
            btn.innerHTML = '<i class = "fa fa-spinner fa-spin"></i> Saving';

            var data = {
                user_id:            s.datalistgrid[row_edited].user_id
                , user_password:    s.txtb_current_pass
                , empl_id:          s.datalistgrid[row_edited].empl_id
                , user_status:      ($("#chck_status").is(':checked') == true ? 1 : 0)
                , locked_account:   ($("#chck_change_lock").is(':checked') == true ? 1 : 0)
                , change_password:  ($("#chck_change_pass").is(':checked') == true ? 1 : 0)
                , created_dttm      : ""
                , created_by        : ""
                , updated_dttm: moment(new Date())
                , expirydate: $('#txtb_expiry_date').val()
                , updated_by: ""
            }

            var role_data =
            {
                 user_id: s.datalistgrid[row_edited].user_id
                ,role_id: s.ddl_user_roles
            }
            h.post("../cUserProfile/SaveEdit",
                {
                    data: data,
                    role_data: role_data
                }).then(function (d)
            {
                if (d.data.message == "success")
                {
                    s.datalistgrid[row_edited].user_password = d.data.encrypted_password;
                    s.datalistgrid[row_edited].role_id      = s.ddl_user_roles;
                    s.datalistgrid[row_edited].empl_id      = s.ddl_personnel_name
                    s.datalistgrid[row_edited].user_status       = ($("#chck_status").is(':checked') == true ? 1 : 0)
                    s.datalistgrid[row_edited].locked_account    = ($("#chck_change_lock").is(':checked') == true ? 1 : 0)
                    s.datalistgrid[row_edited].change_password   = ($("#chck_change_pass").is(':checked') == true ? 1 : 0)

      
                    s.oTable.fnClearTable();
                    s.oTable.fnAddData(s.datalistgrid);

                    for (var x = 1; x <= $('#datalist_grid').DataTable().page.info().pages; x++) {
                        if (get_page(s.datalistgrid[row_edited].user_id) == false) {
                            s.oTable.fnPageChange(x);
                        }
                        else {
                            break;
                        }
                    }
                    btn.innerHTML = '<i class="fa fa-save"> </i> Save Edit';
                    $('#main_modal').modal("hide");
                    swal("Your record successfully updated!", { icon: "success", });
                }
                else {
                    swal(d.data.message, { icon: "warning", });
                }
            });
        }
    }

    //************************************// 
    //*** Delete Record              
    //**********************************// 
    s.btn_print = function (row_index)
    {
         var controller  = "Reports";
        var action      = "Index";
        var ReportName  = "";
        var SaveName    = "Crystal_Report";
        var ReportType  = "inline";
        var ReportPath  = "~/Reports/cryAccountInfo/";
        var sp          = "";

        ReportName  = "cryAccountInfo";
        ReportPath  = ReportPath + "" + ReportName + ".rpt";
        sp          = "sp_account_info_report,Acount";
        $('#modal_generating_report').modal("hide");
        h.post("../cUserProfile/SetHistoryPage",
            {
                empl_id: s.datalistgrid[row_index].empl_id,
                username: s.datalistgrid[row_index].user_id,
                password: s.datalistgrid[row_index].user_password,
                account_type: s.datalistgrid[row_index].user_mode

            }).then(function (d)
        {
            location.href = "../" + controller + "/" + action + "?ReportName=" + ReportName
                + "&SaveName=" + SaveName
                + "&ReportType=" + ReportType
                + "&ReportPath=" + ReportPath
                + "&Sp=" + sp
        });
    }


    s.btn_sendEmail = function (row_id)
    {
        $("#email_" + s.datalistgrid[row_id].user_id).removeClass("fa fa-send");
        $("#email_" + s.datalistgrid[row_id].user_id).addClass("fa fa-spinner fa-spin");
        h.post("../cUserProfile/SendToEmail",
            {
                email_to    : s.datalistgrid[row_id].email_address
                , data      : s.datalistgrid[row_id]
            }).then(function (dx)
            {
                if (dx.data.message == "success")
                {
                    swal("Email successfully Sent", { icon: "success", });
                }

                $("#email_" + s.datalistgrid[row_id].user_id).removeClass("fa fa-spinner fa-spin");
                $("#email_" + s.datalistgrid[row_id].user_id).addClass("fa fa-send");
            });
    }
    //************************************// 
    //*** Delete Record              
    //**********************************// 
    s.btn_del_row = function (row_index) {
        swal({
            title: "Are you sure to delete this record?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            buttons: ["No", "Yes"],
            closeOnClickOutside: false,
            dangerMode: true,
        })
            .then(function (willDelete) {
                if (willDelete) {
                    h.post("../cUserProfile/Delete",
                    {
                        user_id: s.datalistgrid[row_index].user_id
                        ,role_id: s.datalistgrid[row_index].role_id
                    }).then(function (d) {
                        if (d.data.message == "success")
                        {
                            s.datalistgrid = s.datalistgrid.delete(row_index);
                            s.oTable.fnClearTable();
                            if (s.datalistgrid.length != 0) {
                                s.oTable.fnAddData(s.datalistgrid);
                            }
                            swal("Your record has been deleted!", { icon: "success", });
                        }
                        else
                        {
                            swal("Data already deleted by other user/s!", { icon: "warning", });
                            s.datalistgrid = s.datalistgrid.delete(row_index);
                            s.oTable.fnClearTable();
                            if (s.datalistgrid.length != 0) {
                                s.oTable.fnAddData(s.datalistgrid);
                            }
                        }
                    })
                }
            });
    }

    Array.prototype.select = function (code, prop)
    {
        return this.filter(function (d) { return d[prop] == code});
    }

    Array.prototype.DeleteX = function (code, prop) {
        return this.filter(function (d) {
            return d[prop] != code
        }) != null ? this.filter(function (d) {
            return d[prop] != code
        }) : "";
    }

    Array.prototype.delete = function (code) {
        return this.filter(function (d, k) {
            return k != code
        })
    }

    s.ddl_personnel_change = function (var_empl_id)
    {
        var row_index = $('#ddl_personnel_name option:selected').attr('ngx-data');
        
        h.post("../cUserProfile/GenerateUsername",
            {
                firstname       : s.list_of_no_account[row_index].first_name
                , lastname      : s.list_of_no_account[row_index].last_name
                , middlename    : s.list_of_no_account[row_index].middle_name
                , empl_id       : var_empl_id
                ,account_type   : s.list_of_no_account[row_index].account_type
            }).then(function (d) {
                if (d.data.message == "success")
                {
                    if (s.list_of_no_account[row_index].account_type == "S")
                    {
                        s.list_of_roles = s.list_of_roles_min;
                        s.list_of_roles = s.list_of_roles.select("901", "role_id");
                        s.ddl_user_roles = "901";
                    }
                    else
                    {
                        s.list_of_roles = s.list_of_roles_min;
                        s.list_of_roles = s.list_of_roles.DeleteX("901", "role_id");
                    }
                    
                    s.txtb_user_id  = d.data.gen_result.username;
                    s.txtb_email    = s.list_of_no_account[row_index].email_address;
                }
            })

    }

    function clearentry() {
        s.txtb_module_name      = "";
        s.txtb_user_id          = "";
        s.ddl_personnel_name    = "";
        s.ddl_user_roles        = "";
        s.txtb_current_pass     = "";
        s.txtb_confirm_password = "";
        s.txtb_expiry_date      = "";
        $('#txtb_expiry_date').val("");
        $('#chck_status').closest('div').removeClass("checked");
        $('#chck_change_lock').closest('div').removeClass("checked");
        $('#chck_change_pass').closest('div').removeClass("checked");
    }
})