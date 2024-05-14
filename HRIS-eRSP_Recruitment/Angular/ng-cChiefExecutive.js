

ng_eRSP_App.controller("cChiefExecutive_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript
    s.header_title = "APPLICANT LIST"
    s.item_position = ""
    s.firstGrid = true
    s.budget_year = []
    s.employment_type = "RE"
    s.position_code = ""
    s.btn_label_comment = "Submit Without Comment"
    s.rowLen = "5"
    s.year = []
    s.x_position = []
    s.yr = ""
    s.item_no = ""
    s.approval_status = "1"
    s.slideInnerText = []
    s.psbsched_item = []
    s.individual = {}
    s.item_group_by_hiring_period
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
    s.profile = {}
    s.um = {}

    s.year = cs.RetrieveYear()

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


    function changefa(full) {
        if (full.approval_status == "F") {
            return "fa-trophy"
        }
        else { 
            return "fa-check"
        }
       
    }

    var Init_PSB_item_Grid = function (par_data) {
        s.item_grid_List = par_data;
        s.item_Table = $('#Data_item_Grid').dataTable(
            {
                data: s.item_grid_List,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                //order: [[6, 'asc']],
                columns: [
                    {
                        "mData": "psb_ctrl_nbr",
                        "mRender": function (data, type, full, row) {
                            return "<button class='btn btn-warning'>" + data + " - " + full["psb_date"] + "</button>"
                        }
                    },

                    {
                        "mData": "item_no",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block text-default'><strong>" + data + " - " + full["position_long_title"] + "</strong></span>" +
                                "<span class='text-left btn-block text-success'>" + full["department_name1"] + "</span>"
                        }
                    },

                    {
                        "mData": "psb_status",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<center><div class="btn-group">' +
                                '<button style="padding-bottom:4px;"  type="button" class="btn btn-info" ng-click="indorseitem_applicant_list(' + row["row"] + ',4)">VIEW ENDORSED APPLICANTS</button ><br/>' +
                               // '<button  type="button" class="btn btn-info btn-sm action chkbox" ng-click="indorseitem_applicant_list(' + row["row"] + ')" ><i class="fa fa-info"></i></button >' +
                                //'<button  type="button" class="btn btn-success btn-sm action chkbox" ng-click="app_detail(' + row["row"] + ')" ><i class="fa fa-file-text"></i></button >' +
                                //'<button  type="button" class="btn btn-warning btn-sm action chkbox" ng-click="app_detail(' + row["row"] + ')" ><i class="fa fa-file"></i></button >' +
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
    var Init_PSBSCHED_Grid = function (par_data) {
        s.PSBSCHED_List = par_data;
        s.PSBSCHED_Table = $('#Data_psbsched_Grid').dataTable(
            {
                data: s.PSBSCHED_List,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                //order: [[6, 'asc']],
                columns: [
                   

                    {
                        "mData": "remarks_details",
                        "mRender": function (data, type, full, row) {
                            return "<div ng-click='getItemIndorse(" + row["row"] + ")'><h3 class='text-left btn-block text-success'><strong class='text-warning'>&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;Title</strong>:&ensp;<strong>" + data + "</strong></h3>" +
                                "<h3 class='text-left btn-block'><strong class='text-warning'>&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&nbsp;Date</strong>:&ensp;<span class='text-default'>" + full["psb_date"] + "</span></h3>" +
                                "<h3 class='text-left btn-block'><strong class='text-warning'>Hiring Period</strong>:&ensp;<span class='text-default'>" + full["active_dttm"] + " -- " + full["expiry_dttm"] + "</span></h3>" 
                        }
                    },
                    
                ],
                "createdRow": function (row, data, index) {
                    //$(row).addClass("dt-row");
                    $compile(row)($scope);  //add this to compile the DOM
                },

            });

        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }
    var Init_PSB_List_Grid = function (par_data) {
        s.Data_List = par_data;
        s.Data_Table = $('#Data_List_Grid').dataTable(
            {
                data: s.Data_List,
                sDom: 'rt<"bottom"p>',
                order: [[6, 'asc']],
                pageLength: 10,
                
                columns: [
                    {
                        "mData": "empl_photo_img",
                        "mRender": function (data, type, full, row) {
                            return "<span><img alt='image' class='img-circle grid-img' src='{{encode_idv(" + data + ")}}'></span>"
                        }
                    },
                    {
                        "mData": "last_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "first_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "qs_rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "cbi_rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "exam_rating",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "total_rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "applicant_rank",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "app_status",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center>' +
                                '<button ng-hide="' + hidebtnifapprovedx(full) + '" type="button" class="btn btn-danger" ng-click="remove_comparative(' + row["row"] + ')" ' + HSAD(full) +'><i class="fa fa-times"></i></button >' +
                                '<button ng-hide="' + hidebtnifapprovedc(full) + '" type="button" class="btn btn-info" ng-click="approved_comparative(' + row["row"] + ')" ' + HSAD(full)+'><i class="fa ' + changefa(full) + '"></i></button >' +
                                //'<button  type="button" class="btn btn-info btn-sm action chkbox" ng-click="app_detail(' + row["row"] + ')" ><i class="fa fa-edit"></i></button >' +
                                //'<label class="container  m-left-24 p-bot-10 p-top-10">' +
                                //   '<input type="checkbox" ng-click="check_box(' + row["row"] + ',' + data + ')" id="item' + row["row"] + '" ng-model="item' + row["row"] + '" ng-checked="' + full["selected_approved"] + '">' +
                                //   '<span class="m-top-4 educ' + row["row"] + ' checkmark chkbox"></span></label>' +
                                '</center>';

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

    function approved(data)
    {
        if(data == "5")
        {
            return true
        }
        else
        {
            return false
        }
    }

    function HSAD(full) { //IF ALREADY SELECTED ITEM DISABLE BUTTON
        //console.log(full)
        //console.log(full["selected_approved"])
        //console.log(full["approval_status"])      
        if (full.selected_approved == true) {

                var retval = ""

                if (full.approval_status == "F")
                {
                    retval = ""
                }
                else
                {
                    retval = "disabled"
                }

            console.log(retval)   

                return retval
             
        }
        else
        {
               console.log("no disable")   
               return ""
               
        }

        
       
    }

    function hidebtnifapprovedc(full) { //IF ALREADY SELECTED ITEM DISABLE BUTTON
     
        if (full.selected_approved == true) {

            var retval = false

            if (full.approval_status == "F") {
                retval = false
            }
            else {
                retval = true
            }
            return retval

        }
        else {
            return false

        }



    }
    function hidebtnifapprovedx(full) { //IF ALREADY SELECTED ITEM DISABLE BUTTON
        var retval = true

        if (full.selected_approved == true) {

            if (full.approval_status == "F") {
                retval = false
            }
            else {
                retval = true
            }

            return retval

        }
        else {
            return retval

        }



    }

    function HSADR(data) { //IF ALREADY SELECTED ITEM DISABLE NOT SELECTED BUTTON
        console.log(data)
        if (data == 5) {
            return ""
        }
        else if (data == 4) {
            return "disabled"
        }
    }

    function SetValue(id,value) {
        $("#" + id).val(value)
        s[id] = value
    }
    var Init_PSB_List_Grid2 = function (par_data) {
        s.Data_List2 = par_data;
        s.Data_Table2 = $('#Data_List_Grid2').dataTable(
            {
                data: s.Data_List2,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "last_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "first_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "qs_rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "cbi_rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "exam_rating",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "total_rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "applicant_rank",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-info btn-sm action" ng-click="rating_view(' + row["row"] + ')" ><i class="fa fa-edit"></i></button >' +
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

    var Init_PSB_List_Grid3 = function (par_data) {
        s.Data_List3 = par_data;
        s.Data_Table3 = $('#Data_List_Grid3').dataTable(
            {
                data: s.Data_List3,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "last_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "first_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "qs_rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "cbi_rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "exam_rating",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "total_rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "applicant_rank",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<button  type="button" class="btn btn-info btn-sm action" ng-click="rating_view(' + row["row"] + ')" ><i class="fa fa-edit"></i></button >' +
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

    var Init_panel_list = function (par_data) {
        s.Panel_List = par_data;
        s.Panel_Table = $('#Panel_Grid').dataTable(
            {
                data: s.Panel_List,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "psb_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "mbr_role_descr",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "agency",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "knowledge",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "skills",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "attitude",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "cbi_total",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
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


    var Init_item_list = function (par_data) {
        s.Item_List = par_data;
        s.Item_Table = $('#item_Grid').dataTable(
            {
                data: s.Item_List,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "item_no",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "position_long_title",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "department_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                            return '<center><div class="btn-group">' +
                                '<input  type="checkbox" id="chk_item' + row["row"] + '" ng-model="chk_item' + row["row"] + '" class="form-control" ng-click="select_item(' + row["row"] + ')" />' +
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

        //var d = new Date();
        //var y = d.getFullYear().toString();
        //var m = (d.getMonth() + 1).toString();

        //s.yr = y
        //s.mo = m > 9 ? m : '0' + m
        Init_PSB_item_Grid([])
        Init_panel_list([])
        Init_PSB_List_Grid([])
        Init_PSB_List_Grid2([])
        Init_PSB_List_Grid3([])
        Init_item_list([])
        Init_PSBSCHED_Grid([])
       
        cs.loading("show")
        h.post("../cChiefExecutive/Initialize", { employment_type: s.employment_type, approval_status: s.approval_status }).then(function (d) {
            if (d.data.icon == "success") {
               
                s.x_position = d.data.x_position
                s.psbschedule = d.data.psbschedule
                cs.loading("hide")
            } else {
                console.log(d.data.message)
                cs.loading("hide")
            }

        })

    }

    init()

    s.rating_view = function (row_id) {

        var app_ctrl_nbr = s.Data_List[row_id].app_ctrl_nbr;

        s.individual = s.Data_List[row_id]

        s.profile = s.individual

        h.post("../cComparativeAssessment/getPSBComparativeRating", { app_ctrl_nbr: app_ctrl_nbr }).then(function (d) {
            if (d.data.icon == "success") {
                s.slideInnerText = d.data.sp_slide_rating
                s.Panel_List = d.data.sp_panel_list_rating.refreshTable("Panel_Grid", "");
              
            }
            else {
                console.log(d.data.message)
            }
        })
        $("#applicant_rating_detail").modal("show")
    }



    s.selectFilter = function () {
        $("#Data_List_Grid").dataTable().fnClearTable();
        h.post("../cChiefExecutive/toBeApprovedPosition", { employment_type: s.employment_type, approval_status: s.approval_status }).then(function (d) {
            if (d.data.icon == "success") {
                s.x_position = d.data.x_position;
            }
            else {
                console.log(d.data.message)
            }
        })
    }

   

    s.getExcutiveList = function (position_code) {
        $("#Data_List_Grid").dataTable().fnClearTable();
        h.post("../cChiefExecutive/getExcutiveList", { item_no: s.item_no, psb_ctrl_nbr: s.psb_ctrl_nbr }).then(function (d) {
            if (d.data.icon == "success") {
                s.Data_List = d.data.executive_list.refreshTable("Data_List_Grid", "");
            }
            else {
                console.log(d.data.message)
            }
        })
    }



    s.add_item = function (row_id) {
        s.item_no = ""
        var dt = s.Data_List[row_id]
        s.app_ctrl_nbr = dt.app_ctrl_nbr
        s.fullname = dt.first_name + " " + dt.last_name
        s.position_code = dt.position_code
        var budget_code = dt.budget_code
        var employment_type = dt.employment_type
        h.post("../cChiefExecutive/getItemListInPosition", { position_code: s.position_code, budget_code: budget_code, employment_type: employment_type }).then(function (d) {
            if (d.data.icon == "success") {
                s.Item_List = d.data.item_list.refreshTable("item_Grid", "");
                $("#applicant_item").modal("show")
            }
        })
    }

    s.select_item = function (row_id) {

        var chk = s.Item_List[row_id]
        s.department_code = chk.department_code
        for (var x = 0; x < s.Item_List.length; x++) {
            if (x != row_id)
            {
                $("#chk_item" + row_id).prop("checked", false);
            }
            else
            {
                if ($("#chk_item" + row_id).is(":checked"))
                {
                    s.item_no = chk.item_no
                    cs.notrequired("item_no")
                }
                else
                {
                    s.item_no = ""
                }
            }
        }
    }
    s.selectPSBSchedApplicant = function (val) {

        h.post("../cChiefExecutive/set_Item_no", { item_no: val, psb_ctrl_nbr: s.psb_ctrl_nbr }).then(function (d) {
            if (d.data.icon == "success") {
                console.log(d.data.endorsed)
                s.Data_List = d.data.endorsed.refreshTable("Data_List_Grid", "")
            }

        })
    }

    s.getItemIndorse = function (row) {
        var dt = s.PSBSCHED_List[row]
       cs.loading("show")
        h.post("../cChiefExecutive/getItemIndorse",
            {
                psb_ctrl_nbr: dt.psb_ctrl_nbr,
            }).then(function (d) {
                if (d.data.icon == "success") {
                    console.log(d.data.getItemIndorse)
                    s.item_grid_List = d.data.getItemIndorse.refreshTable("Data_item_Grid", "")
                    cs.loading("hide")
                } else {
                    console.log(d.data.message)
                    cs.loading("hide")
                }
            })
    }


    s.selectPsb_date = function (val) {
        s.firstGrid = true
        cs.loading("show")
        if (!cs.elEmpty(val)) {
            var dt = s.psbschedule.filter(function (d) {
                return d.psb_ctrl_nbr == val
            })[0]
            s.psb_ctrl_nbr_toconcluded = val
            h.post("../cChiefExecutive/sp_hrmpsbscreening_item_list",
                {
                    year: val,
                }).then(function (d) {
                    if (d.data.icon == "success") {

                        //s.item_grid_List = d.data.sp_exec_2bapprovedlist.refreshTable("Data_item_Grid", "")
                       
                        //s.item_group_by_hiring_period = Object.groupBy()

                        s.PSBSCHED_List = d.data.sp_hrmps_sched_header_list.refreshTable("Data_psbsched_Grid","")

                    } else {
                        console.log(d.data.message)
                    }
                    cs.loading("hide")
                })
        }
    }


    Array.prototype.checkIfHasIfCheck = function (row_id) {
        var dt = this
        var l = dt.length
        var bol = 0
        for (var x = 0; x < l; x++) {
            if ($("#item" + x)[0].checked == true) {
                if (row_id != x)
                {
                    bol = bol + 1
                    $("#item" + row_id)[0].checked = false
                }
             }
        }
        return bol > 0 ? true : false;
    }

    Array.prototype.check = function(row_id)
    {
        var dt = this[row_id]
        var retval = false
        if (dt.selected_approved == true) {
            retval = true
        }
       
        return retval 
    }

    s.backtoFirstGrid = function () {
        s.firstGrid = true
    }

    


        s.approved_comparative = function (row_id) {
            var dt = s.Data_List
            if (dt[row_id].selected_approved == true) {
                return
            }
                    swal({
                        title: "Are you sure to approve this application?",
                        text: "",
                        buttons: true,
                        icon: "warning",
                        buttons: {
                            cancel: {
                                text: "Cancel",
                                value: null,
                                visible: true,
                                className: "",
                                closeModal: true,
                            },
                            confirm: {
                                text: "OK",
                                value: true,
                                visible: true,
                                className: "",
                                closeModal: false,
                            }
                        },

                    }).then(function (response) {
                        if (response) {
                            h.post("../cChiefExecutive/ApproveExec2", {
                                    data: dt[row_id],
                                    psb_ctrl_nbr: s.psb_ctrl_nbr,
                                    item_no: s.item_no
                            }).then(function (d) {
                                if (d.data.icon == "success") {
                                    s.Data_List = d.data.chiefexecutive_list.refreshTable("Data_List_Grid", "")
                                }
                                swal(d.data.message, { icon:d.data.icon })
                            })
                        }
                    });
    }

    s.remove_comparative = function (row_id) {
        var dt = s.Data_List
        swal({
                    title: "Are you sure to revert approved status of this application?",
                    text: "",
                    buttons: true,
                    icon: "warning",
                    buttons: {
                        cancel: {
                            text: "Cancel",
                            value: null,
                            visible: true,
                            className: "",
                            closeModal: true,
                        },
                        confirm: {
                            text: "OK",
                            value: true,
                            visible: true,
                            className: "",
                            closeModal: false,
                        }
                    },
                }).then(function (response) {
                    if (response) {
                        h.post("../cChiefExecutive/RevertApprove2", {
                                data: dt[row_id],
                                psb_ctrl_nbr: s.psb_ctrl_nbr,
                                item_no: s.item_no
                        }).then(function (d) {
                              
                                s.Data_List = d.data.chiefexecutive_list.refreshTable("Data_List_Grid", "")
                                swal("Successfully removed approved status", { icon: "warning" })
                            })
                    }
                   
                });
    }


    s.commentNotEmpty = function (val) {
        if (cs.elEmpty(val)) {
            s.btn_label_comment = "Submit Without Comment"
        }
        else {
            s.btn_label_comment = "Submit"
        }
    }

    Array.prototype.getCheckItem = function () {

        var data = this
        var dl = data.length
        for (var x = 0; x < dl; x++) {
            if ($("#item" + x)[0].checked == true) {
                data[x].item_isadded = true
            }
            else {
                data[x].item_isadded = false
            }
        }
        return data
    }

    Array.prototype.getCheckItemIndex = function () {
        var row_id = ""
        var data = this
        var dl = data.length
        for (var x = 0; x < dl; x++) {
            if (data[x].selected_approved == true) {
                row_id = x
            }
        }
        return row_id
    }

    //s.approveExec = function () {
    //    var dt = s.Data_List.getCheckItem()
    //    h.post("../cChiefExecutive/ApproveExec", { data: dt, comment: s.l1comment, psb_ctrl_nbr: s.psb_ctrl_nbr, item_no: s.item_no }).then(function (d) {
    //        if (d.data.icon == "success") {
    //            h.post("../cChiefExecutive/GET_LIST", { psb_ctrl_nbr: s.psb_ctrl_nbr, item_no: s.item_no }).then(function (f) {
    //                s.Data_List = f.data.endorsed.refreshTable("Data_List_Grid", "")
    //                $("#approveexec_comments").modal("hide");
    //                swal("Applicants successfully appointed!", { icon: f.data.icon })
    //            })
               
    //        }

    //    })
    //}
    s.indorseitem_applicant_list = function (row) {
        var dt = s.item_grid_List[row]
        s.item_position = dt.employment_type + " - " +dt.item_no + " - " + dt.position_long_title
        cs.loading("show")
        h.post("../cChiefExecutive/indorseitem_applicant_list",
            {
                psb_ctrl_nbr: dt.psb_ctrl_nbr
                , item_no: dt.item_no
             }).then(function (d) {
                 if (d.data.icon == "success") {
                     console.log(d.data.indorseitem_applicant_list)
                     s.Data_List = d.data.indorseitem_applicant_list.refreshTable("Data_List_Grid", "")
                     //$("#comparative_item_applicant").modal("show")
                     s.firstGrid = false
                     cs.loading("hide")
            }

        })
    }

    s.openExecCommentModal = function () {
        var da = s.Data_List.getCheckItem()
        var cnt = da.filter(function (d) {
            return d.item_isadded == true
        })
       
        if (cnt.length > 0) {
            $("#approveexec_comments").modal("show")
        }
        else {
            swal("No selected applicant to submit!", { icon: "error" })
        }
      
       

    }

    $('#applicant_item').on('hidden.bs.modal', function () {

        for (var x = 0; x < s.Item_List.length; x++) {
            $("#chk_item" + x).prop("checked", false);
        }
    })

    Array.prototype.dialKnobValue = function (form) {
        var data = this;
        for (var i = 0; i < data.length; i++) {

            $('#' + form + ' input.dial.m-r-sm.' + data[i].slide_id).trigger(
                           'configure',
                           {
                               "min": 0,
                               "max": data[i].sub_max_rate,
                               "cursor": false
                           }
                   );
            $('#' + form + ' input.dial.m-r-sm.' + data[i].slide_id).val(data[i].psb_pnl_rating).trigger('change');

        }
    }

    Array.prototype.formInnerText = function (obj) {
        var thisObject = obj
        var data = this[0];
        var i_key = Object.keys(obj)
        var f_key = Object.keys(data)
        var f_val = Object.keys(data).map(function (itm) { return data[itm]; });
        for (var i = 0; i < i_key.length; i++) {
            for (var f = 0; f < f_key.length; f++) {
                if (i_key[i] == f_key[f]) {
                    thisObject[i_key[i]] = f_val[f]
                }
            }
        }
        return thisObject
    }


    $('.dial').trigger('configure', {
        'change': function (v) {

        }
    });
})


