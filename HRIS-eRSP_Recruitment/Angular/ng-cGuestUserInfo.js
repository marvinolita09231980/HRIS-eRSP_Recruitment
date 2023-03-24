


ng_eRSP_App.controller("cGuestUserInfo_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript
    s.header_title = "APPLICANT LIST"
    s.modal = 1
    s.rowLen = ""
    s.doc_type = ""
    s.start_with = ""
    s.pageTitle = "Applicant List"
    s.civil_status = []
    s.DATA = {}
    s.um = {}
    s.gu = {
        g_user_id: ""
         , last_name: ""
         , first_name: ""
         , middle_name: ""
         , civil_status: ""
         , gender: ""
         , birth_date: ""
         , g_address: ""
         , agency: ""
         , position: ""

    }
   
    s.alphabet_list = [
       { alpha_name: 'A' }, { alpha_name: 'B' }, { alpha_name: 'C' }, { alpha_name: 'D' }, { alpha_name: 'E' }, { alpha_name: 'F' },
       { alpha_name: 'G' }, { alpha_name: 'H' }, { alpha_name: 'I' }, { alpha_name: 'J' }, { alpha_name: 'K' }, { alpha_name: 'L' },
       { alpha_name: 'M' }, { alpha_name: 'N' }, { alpha_name: 'O' }, { alpha_name: 'P' }, { alpha_name: 'Q' }, { alpha_name: 'R' },
       { alpha_name: 'S' }, { alpha_name: 'T' }, { alpha_name: 'U' }, { alpha_name: 'V' }, { alpha_name: 'W' }, { alpha_name: 'X' },
       { alpha_name: 'Y' }, { alpha_name: 'Z' }
    ]
  
    var Init_Guest_User_List_Grid = function (par_data) {
        s.Guest_User_List_Data = par_data;
        s.Guest_User_List_Table = $('#Guest_Users').dataTable(
            {
                data: s.Applicant_List_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "g_user_id",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "guest_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "agency",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "position",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                  
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-success btn-sm action" data-toggle="tab" href="#tab-7" ng-click="showGuestInfo(' + row["row"] + ')" >  <i class="fa fa-eye"></i></button >' +
                                '<button  type="button" class="btn btn-info btn-sm action" data-toggle="tab" href="#tab-7" ng-click="main_btn_edit(' + row["row"] + ')" >  <i class="fa fa-edit"></i></button >' +
                                '<button  type="button" class="btn btn-danger btn-sm action" ng-click="btn_del_row_main_grid(' + row["row"] + ')">   <i id="del_row' + row["row"] + '" class="fa fa-trash"></i></button>' +
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

    Init_Guest_User_List_Grid([])

    function init() {
        s.rowLen = "10"
        h.post("../cGuestUserInfo/Initialize", { start_with: s.start_with }).then(function (d) {
            if (d.data.icon == "success") {
                s.civil_status = d.data.civil_status
                s.Guest_User_List_Data = d.data.guest_users.refreshTable("Guest_Users", "")
            }
        })
    }

    init()
    s.AddGuestUser = function () {
        location.href = "cGuestUserInfo/AddGuestUser";
    }

    s.BackToGrid = function () {
      location.href = "cGuestUserInfo/Index";
    }
    //$('.i-checks').iCheck({
    //    checkboxClass: 'icheckbox_square-green',
    //    radioClass: 'iradio_square-green',
    //});

    //$('#data_1 .input-group.date').datepicker({
    //    todayBtn: "linked",
    //    keyboardNavigation: false,
    //    forceParse: false,
    //    calendarWeeks: true,
    //    autoclose: true,
    //    format: "yyyy/mm/dd"
    //});

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


    s.selectStartWith = function (start_with) {
        h.post("../cGuestUserInfo/getUsers", { start_with: start_with }).then(function (d) {
            s.Guest_User_List_Data = d.data.guest_users.refreshTable("Guest_Users", "")
        })
    }

    s.btn_del_row_main_grid = function (row_id) {
        var dt = s.Guest_User_List_Data[row_id]
     

        var start_with = $("#start_with").val()
        var g_user_id = dt.g_user_id;
        if (dt.hasChild == true) {
            swal("You cannot delete this application because it is already added to Review List for screening", { icon: "warning" });
            return
        }
       
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
                          h.post("../cGuestUserInfo/DeleteGuestUser", {
                              g_user_id: g_user_id,
                              start_with: start_with
                          }).then(function (d) {
                              if (d.data.icon == "success") {
                                  s.Guest_User_List_Data = d.data.guest_users.refreshTable("Guest_Users", "")
                                  swal(d.data.message, { icon: d.data.icon });
                              }
                              else {
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

    s.main_btn_edit = function (row_id) {
        var g_user_id = s.Guest_User_List_Data[row_id].g_user_id
        h.post("../cGuestUserInfo/editGuestUsers", { g_user_id: g_user_id }).then(function (d) {
            if(d.data.icon == "success")
            {
                location.href = "cGuestUserInfo/AddGuestUser";
            }
        })
    }
   
    s.showGuestInfo = function (row_id) {
        var dt = [s.Guest_User_List_Data[row_id]]
        dt.populateFields(s.gu, 0);
        $("#showGuestUserInfo").modal("show");
    }

})


