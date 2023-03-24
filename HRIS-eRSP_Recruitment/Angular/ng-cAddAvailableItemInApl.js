


ng_eRSP_App.controller("cAddAvailableItemInAPL_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript
    s.rowLen = "10"
    s.control_number = ""
    s.activecount = 0
    s.departments = []
    s.positions = []
    s.budgetyears = []
    s.checkeditem = []
    s.show_btn = true;
    s.item_exist_list = []
    s.item_no = ""
    s.item_id = ""
    s.ctrl_no = ""
    s.edit = false
    s.available_item_data_orig = []

    var init_available_item_hdr = function (par_data) {
        s.available_item_hdr = par_data;
        s.available_item__hdr_table = $('#online_item_hdr_grid').dataTable(
            {
                data: s.available_item_hdr,
                //stateSave: false,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "ctrl_no", "mRender": function (data, type, full, row) {
                            return "<div class='btn-block text-center'>" + data + "</div>";
                        },
                        //"searchable": false
                    },
                    {
                        "mData": "active_dttm", "mRender": function (data, type, full, row) {
                            return "<div class='btn-block text-center'>" + data + "</div>";
                        }
                    },
                    {
                        "mData": "expiry_dttm", "mRender": function (data, type, full, row) {
                            return "<div class='btn-block text-center'>" + data + "</div>";
                        }
                    },
                    {
                        "mData": "descr", "mRender": function (data, type, full, row) {
                            return "<div class='btn-block text-left'>" + data + "</div>";
                        },
                        //"searchable": false
                    },
                    {
                        "mData": null,
                        "mRender": function (data, type, full, row) {
                            return '<center><div class="btn-group action-btn">' +
                                '<button type="button" data="' + row["row"] + '" id="ctrl_edit' + row["row"] + '" class="btn btn-success btn-sm" ng-click="fn_addAPLItemHDR(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="Add items on Header">  <i class="fa fa-plus"></i></button >' +
                                '<button type="button" data="' + row["row"] + '" id="ctrl_edit' + row["row"] + '" class="btn btn-primary btn-sm" ng-click="fn_editAPLItemHDR(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="Deactivate/Remove items on header ">  <i class="fa fa-pencil"></i></button >' +
                                '<button ng-hide="' + full["active_status"] +'" type="button" data="' + row["row"] + '" id="ctrl_edit' + row["row"] + '" class="btn btn-danger btn-sm" ng-click="fn_deactiveAPLItemHDR(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="Deactivate all items in header">'+
                                    '<span>' +
                                        '<i class="fa fa-flash"></i>' +
                                        '<i class="fa-stack2x fa fa-ban" style="color:red"></i>' +
                                    '</span>' +
                                        '</button > ' +
                                '<button ng-show="' + full["active_status"] +'" type="button" data="' + row["row"] + '" id="ctrl_edit' + row["row"] + '" class="btn btn-danger btn-sm" ng-click="fn_deactiveAPLItemHDR(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="Deactivate all items in header">  <i class="fa fa-bolt"></i></button >' +

                                '<button ng-hide="' + full["active_forpsb"] +'" type="button" data="' + row["row"] + '" id="ctrl_activeforpsb' + row["row"] + '" class="btn btn-warning btn-sm" ng-click="fn_activeForPSB(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="Active For PSB">'+
                                    '<span>'+
                                        '<i class="fa fa-flash"></i>'+
                                        '<i class="fa-stack2x fa fa-ban" style="color:#EC4758"></i>'+
                                    '</span>'+
                                '</button > ' +
                                '<button ng-show="' + full["active_forpsb"] + '" type="button" data="' + row["row"] + '" id="ctrl_inactiveforpsb' + row["row"] + '" class="btn btn-warning btn-sm" ng-click="fn_inactiveForPSB(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="Active For PSB">  <i class="fa fa-flash"></i></button >' +

                                '<button type="button" data="' + row["row"] + '" id="deletebtn' + row["row"] + '" class="btn btn-danger btn-sm" ng-click="fn_deletebtn_click(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="Delete this data">  <i class="fa fa-trash"></i></button >' +
                                //'<button type="button" data="' + row["row"]+ '" id="ctrl_del' + row["row"] + '" class="btn btn-danger btn-sm deleteHdrItem" data-toggle="tooltip" data-placement="top" title="Delete">  <i class="fa fa-trash"></i></button >' +
                                //'<button type="button"  class="btn btn-success btn-sm action" data-toggle="tooltip" data-placement="top" title="Rate Quality Standards" ng-click="qs_btn_rate(' + row["row"] + ')" >  <i class="fa fa-star"></i></button >' +
                                //'<button type="button"  class="btn btn-info btn-sm action" data-toggle="tooltip" data-placement="top" title="Add Exam Result" ng-click="addOtherDetails(' + row["row"] + ')" >  <i class="fa fa-trophy"></i></button >' +
                                //'<button type="button"  class="btn btn-default btn-sm action" data-toggle="tooltip" data-placement="top" title="Add Exam Result" ng-click="ViewUploadeddocument(' + row["row"] + ')" >  <i class="fa fa-file"></i></button >' +
                                //'<button type="button"  class="btn btn-danger btn-sm action" data-toggle="tooltip" data-placement="top" title="Send email notification" ng-click="composeEmail(' + row["row"] + ')" >  <i class="fa fa-paper-plane"></i></button >' +
                                '</div></center>'
                        },
                        "searchable": false
                    },
                ],
                "createdRow": function (row, data, index) {
                    $(row).attr('id', index);
                    $compile(row)($scope);  //add this to compile the DOM
                }
            });

        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }

    var init_available_item = function (par_data) {
        s.available_item_data = par_data;
        s.available_item_table = $('#available_item_grid').dataTable(
            {
                data: s.available_item_data,
                //stateSave: false,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": null, "mRender": function (data, type, full, row) {
                            return "<i id='icn2" + row["row"]+"' class='text-info fa fa-check-circle hidden'></i>";
                        },
                    },
                    {
                        "mData": "item_no", "mRender": function (data, type, full, row) {
                            return "<div class='btn-block text-center'>" + data + "</div>";
                        },
                        //"searchable": false

                    },

                    {
                        "mData": "position_long_title", "mRender": function (data, type, full, row) {
                            return "<div class='btn-block text-left'>" + data + "</div>";
                        }
                    },
                    {
                        "mData": "department_name1", "mRender": function (data, type, full, row) {
                            return "<div class='btn-block text-left'>" + data + "</div>";
                        },
                        "searchable": false
                    },
                    {
                        "mData": "in_publication", "mRender": function (data, type, full, row) {
                            return "<div class='btn-block text-left'>" + s.fn_status2(data, full["inOnline"]) + "</div>";
                        },
                        "searchable": false
                    },
                    {
                        "mData": "in_publication",
                        "mRender": function (data, type, full, row)
                        {
                            return '<center>' +
                                
                                '<button id="btn1' + full["item_no"] + '" ng-show="' + s.fn_toggle_btn(data, full["inOnline"]) + ' == 1" item="' + full["item_no"] + '" data="' + row["row"] + '" type="button"  class="btn btn-default btn-sm" data-toggle="tooltip" data-placement="top" title="Deactivate/Remove items on header"><i id="icon1'+  row["row"] +'" class="text-success fa fa-check"></i></button >' +
                                '<button id="btn2' + full["item_no"] + '" ng-show="' + s.fn_toggle_btn(data, full["inOnline"]) + ' == 2" item="' + full["item_no"] + '" data="' + row["row"] + '" type="button"  class="btn btn-danger  btn-sm activateitem" data-toggle="tooltip" data-placement="top" title="Deactivate all items in header">   <i id="icon2'+  row["row"] +'" class="fa fa-toggle-off"></i></button >' +
                                '<button id="btn3' + full["item_no"] + '" ng-show="' + s.fn_toggle_btn(data, full["inOnline"]) + ' == 3" item="' + full["item_no"] + '" data="' + row["row"] + '" type="button"  class="btn btn-warning btn-sm selectedItem2" data-toggle="tooltip" data-placement="top" title="Add items on Header">              <i id="icon3' + row["row"] +'" class="fa fa-plus"></i></button>' +
                                '</center>'

                            //return '<label class="container">' +                                

                            //    '<input type="checkbox" data="' + full['item_no'] +'" class="selected selectedItem" id="item' + row["row"] + '" ng-model="item' + row["row"] + '">' +
                            //     '<span class="item' + row["row"] + ' checkmark"></span>' +
                            //     '</span > '+
                            //     '</label>'off
                        },
                        "searchable": false
                    },
                ],
                "createdRow": function (row, data, index) {
                    $(row).attr('id', index);
                    $compile(row)($scope);  //add this to compile the DOM
                }
            });
     
        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }

    

    var init_available_item_edit = function (par_data) {
        s.available_item_data_edit = par_data;
        s.available_item_table_edit = $('#available_item_grid_edit').dataTable(
            {
                data: s.available_item_data,
                //stateSave: false,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [

                    {
                        "mData": "item_no", "mRender": function (data, type, full, row) {
                            return "<div class='btn-block text-center'>" + data + "</div>";
                        },
                        //"searchable": false

                    },

                    {
                        "mData": "position_long_title", "mRender": function (data, type, full, row) {
                            return "<div class='btn-block text-left'>" + data + "</div>";
                        }
                    },
                    {
                        "mData": "department_name1", "mRender": function (data, type, full, row) {
                            return "<div class='btn-block text-left'>" + data + "</div>";
                        },
                        "searchable": false
                    },
                    {
                        "mData": "active_status", "mRender": function (data, type, full, row) {
                            return "<div class='btn-block text-left'>" + s.fn_status(data) + "</div>";
                        },
                        "searchable": false
                    },
                    {
                        "mData": null,
                        "mRender": function (data, type, full, row) {
                            return '<center><div class="btn-group action-btn">' +
                                '<button type="button" data="' + row["row"] + '" id="aplitemdeactive' + row["row"] + '" class="btn btn-warning btn-sm" ng-click="fn_aplitemdeactive(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="Deactivate">  <i class="fa fa-ban"></i></button >' +
                                '<button type="button" data="' + row["row"] + '" id="aplitemremove' + row["row"] + '" class="btn btn-danger btn-sm" ng-click="fn_aplitemremove(' + row["row"] + ')" data-toggle="tooltip" data-placement="top" title="Remove" ng-disabled="' + s.fn_disabled(full["active_status"]) +'">  <i class="fa fa-trash"></i></button >' +
                                '</div></center>'
                        },
                        "searchable": false
                    },
                ],
                "createdRow": function (row, data, index) {
                    $(row).attr('id', index);
                    $compile(row)($scope);  //add this to compile the DOM
                }
            });

        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }

    s.fn_disabled = function (value) {
        if (value) {
            return false
        }
        else {
            return true
        }
    }
    s.fn_status = function (value) {
        if (value) {
            return "Active"
        }
        else {
            return "In-active"
        }
    }
    s.fn_status2 = function (val1,val2) {
        if (val1 == true && val2 == true) {
            return "Active"
        }
        else if (val1 == false && val2 == true) {
            return "In-active"
        }
        else {
            return "Not added"
        }
    }
    s.fn_toggle_btn = function (val1, val2) {
        if (val1 == true && val2 == true) {
            return 1
        }
        else if (val1 == false && val2 == true) {

            return 2
        }
        else {
            return 3
        }
    }

    s.fn_replace_class = function (id, cls1, cls2) {
        $("#" + id).removeClass(cls1)
        $("#" + id).addClass(cls2)
    }
    
   


    var init_online_available_item = function (par_data) {
        s.online_available_item_data = par_data;
        s.online_available_item_table = $('#online_available_item_grid').dataTable(
            {
                data: s.online_available_item_data,
                //stateSave: false,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [

                    {
                        "mData": "item_no", "mRender": function (data, type, full, row) {
                            return "<div class='btn-block text-center'>" + data + "</div>";
                        },
                        //"searchable": false

                    },

                    {
                        "mData": "position_long_title", "mRender": function (data, type, full, row) {
                            return "<div class='btn-block text-left'>" + data + "</div>";
                        }
                    },
                    {
                        "mData": "department_name1", "mRender": function (data, type, full, row) {
                            return "<div class='btn-block text-left'>" + data + "</div>";
                        },
                        "searchable": false
                    },
                    {
                        "mData": null,
                        "mRender": function (data, type, full, row) {
                            return '<label class="container">' +
                                '<input type="checkbox" id="oitem' + row["row"] + '" ng-model="oitem' + row["row"] + '">' +
                                '<span class="oitem' + row["row"] + ' checkmark"></span>' +
                                '</span > ' +
                                '</label>'
                        },
                        "searchable": false
                    },
                ],


                "createdRow": function (row, data, index) {
                    $(row).attr('id', index);
                    $compile(row)($scope);  //add this to compile the DOM
                }
            });

        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }
    s.getCheckItem = function() {
        var data = []
        var item_count = s.available_item_data.length;
        for (var x = 0; x < item_count; x++) {
            if ($('#item' + x).prop('checked')) {
                data.push(s.available_item_data[x])
            }
        }

        return data
    }

    function getCheckItem2(){
        var data = []
        var item_count = s.online_available_item_data.length;
        for (var x = 0; x < item_count; x++) {
            if ($('#oitem' + x).prop('checked')) {
                data.push(s.online_available_item_data[x])
            }
        }
        return data
    }

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    function init()
    {
        cs.loading("show")
        s.rowLen = "10"
        init_available_item([])
        init_online_available_item([])
        init_available_item_hdr([])
        init_available_item_edit([])
        
        h.post("../cAddAvailableItemInAPL/Initialize").then(function (d) {
            if (d.data.icon == "success") {
                s.budget_code = d.data.budget_code
                $("#budget_code").val(d.data.budget_code)
                s.employment_type = d.data.employment_type
                $("#employment_type").val(d.data.employment_type)
                s.departments = d.data.departments
            
                s.available_item_hdr = d.data.data_items_hdr.refreshTable("online_item_hdr_grid", "")

               
                var unique = d.data.data_items.filter(onlyUnique);
                s.available_item_data = unique.refreshTable("available_item_grid", "")
                s.budgetyears = d.data.budgetyears
                s.online_available_item_data = d.data.available_item.refreshTable("online_available_item_grid", "")
                cs.loading("hide")
            }
        })

    }

    function addvalue(id, value) {
        $("#" + id).val(value)
        s[id] = value
    }


    init()
    s.tab_active = function (val) {
        if (val == 1) {
            s.show_btn = true
        }
        else {
            h.post("../cAddAvailableItemInAPL/getOnlineAvailableItem").then(function (d) {
                if (d.data.icon == "success") {
                    s.online_available_item_data = d.data.available_item.refreshTable("online_available_item_grid", "")
                }
            })
            s.show_btn = false
        }
    }
    s.openAddModal = function () {
        cs.notrequired2("post_date")
        cs.notrequired2("valid_until")
        cs.notrequired2("descr")
        s.department_code = ""
        s.edit = false;
        addvalue("employment_type_2",s.employment_type)
        addvalue("budget_code_2", s.budget_code)
        s.checkeditem = []
        if (!cs.Validate1Field("budget_code") || !cs.Validate1Field("employment_type")) {
            cs.loading("hide")
            return
        }
        var budget_code = $("#budget_code").val()
        var employment_type = $("#employment_type").val()
       
        
        h.post("../cAddAvailableItemInAPL/Open_Items", { budget_code: budget_code, employment_type: employment_type}).then(function (d) {
            if (d.data.icon == "success") {
                s.departments = fn_departments(d.data.data_items)
                s.available_item_data_orig = d.data.data_items.filter(onlyUnique);
                s.available_item_data = s.available_item_data_orig.refreshTable("available_item_grid", "")
                
               
                $("#onlineItemSetup").modal("show")
                $(".selected").prop("checked",false)
                $(".selected").prop("checked",false)
            }
            else {
                swal("Error Fetching Data", { icon:d.data.icon })
            }
        })
     
    }

    function fn_departments(data) {
        var datalen = data.length
        var dept_data = []
        for (var x = 0; x < datalen; x++) {
            var dept_object = {}
            dept_object = {
                 department_code: data[x].department_code
                ,department_name1: data[x].department_name1
            }
            dept_data.push(dept_object)
        }

        dept_data = dept_data.filter(onlyUnique)
        console.log(dept_data)
        return dept_data

    }

    s.ngF_departments = function (value) {
        h.post("../cAddAvailableItemInAPL/getPositions", { budget_code: s.budget_code, employment_type: s.employment_type, department_code: value }).then(function (d) {
            if (d.data.icon == "success") {
                s.positions = d.data.positions
            }

            if (value == "" || value == undefined) {
                s.available_item_data = s.available_item_data_orig.refreshTable("available_item_grid", "")

            }
            else {

                var dt = s.available_item_data_orig.filter(function (d) {
                    return d.department_code == value
                })
                s.available_item_data = dt.refreshTable("available_item_grid", "")
            }
           
        })

    }
    s.ngF_positions = function (value) {
        var dept_code = $("#department_code").val()
     
        if (value == "" || value == undefined) {
            s.available_item_data = s.available_item_data_orig.refreshTable("available_item_grid", "")
          
        }
        else {

            var dt = s.available_item_data_orig.filter(function (d) {
                return d.position_code == value && d.department_code == dept_code
            })

            s.available_item_data = dt.refreshTable("available_item_grid", "")
            

        }
      
    }
    

  
    s.remove_ItemsToOnline = function () {
        
        if (getCheckItem2().length == 0) {
            swal("No selected item!", { icon: "warning" })
        }
        else {

            h.post("../cAddAvailableItemInAPL/removeItemToOnlineRecruitment", { item_list: getCheckItem2() }).then(function (d) {
                if (d.data.icon == "success") {
                    swal(d.data.message, { icon: d.data.icon })
                    var unique = d.data.data_items.filter(onlyUnique);
                    s.available_item_data = unique.refreshTable("available_item_grid", "")
                   
                    s.online_available_item_data = d.data.available_item.refreshTable("online_available_item_grid", "")
                }
            })
        }
    }

    s.remove_AllItemsToOnline = function () {
        swal({
            title: "Are you sure you want to remove all items?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(function (willDelete) {
                if (willDelete) {
                    h.post("../cAddAvailableItemInAPL/removEAllItemToOnlineRecruitment", { budget_code: s.budget_code, employment_type: s.employment_type}).then(function (d) {
                        if (d.data.icon == "success") {
                            swal(d.data.message, { icon: d.data.icon })
                            var unique = d.data.data_items.filter(onlyUnique);
                            s.available_item_data = unique.refreshTable("available_item_grid", "")
                            s.online_available_item_data = d.data.available_item.refreshTable("online_available_item_grid", "")
                        }
                    })
                }
                
            });
    }
   

    s.ngF_Employment_type = function (value) {
        cs.loading("show");
        cs.notrequired2("employment_type")
        h.post("../cAddAvailableItemInAPL/Open_Items_Hdr", { budget_code: s.budget_code, employment_type: s.employment_type }).then(function (d) {
            if (d.data.icon == "success") {
                s.available_item_hdr = d.data.data_items_hdr.refreshTable("online_item_hdr_grid", "")
            }
            cs.loading("hide");
        })
       
    }

    s.ngF_Budget_code = function (value) {
        cs.notrequired2("budget_code")
        cs.loading("show");
        getOpen_Items_Hdr();
    }

    function getOpen_Items_Hdr() {
        var budget_code = s.budget_code
        var employment_type = s.employment_type
        h.post("../cAddAvailableItemInAPL/Open_Items_Hdr", { budget_code: budget_code, employment_type: employment_type }).then(function (d) {
            if (d.data.icon == "success") {
                s.available_item_hdr = d.data.data_items_hdr.refreshTable("online_item_hdr_grid", "")
            }
            cs.loading("hide");
        })
    }

    s.fn_editAPLItemHDR = function (row) {
        var dt = s.available_item_hdr[row]
        s.control_number = dt.ctrl_no
        s.edit = true;
        $("#post_date_disp2").val(dt.active_dttm)
        $("#valid_until_disp2").val(dt.expiry_dttm)
        $("#descr_disp2").val(dt.descr)

        h.post("../cAddAvailableItemInAPL/aplheaderdata", {ctrl_no: dt.ctrl_no }).then(function (d) {
            if (d.data.icon == "success") {
                s.available_item_data_edit = d.data.data_items_dtl.refreshTable("available_item_grid_edit", "")
                $("#onlineItemSetupEdit").modal("show")
            }
            cs.loading("hide");
        })
    }

    $('#onlineItemSetupEdit').on('hidden.bs.modal', function () {

        var dt = s.available_item_hdr.filter(function (d) {
            return d.ctrl_no == s.control_number
        })[0] 

        var employment_type = dt.employment_type
        var budget_code = dt.budget_code
        
        h.post("../cAddAvailableItemInAPL/fn_GetAvailableItem_HDR",
            {
                 ctrl_no: dt.ctrl_no
                , employment_type: employment_type
                , budget_code: budget_code 

            }).then(function (d) {
            if (d.data.icon == "success") {
                s.available_item_hdr = d.data.hdr.refreshTable("online_item_hdr_grid", dt.ctrl_no)
            }
                cs.loading("hide");
                s.activecount = 0
        })
        
    })
    
    s.fn_aplitemdeactive = function (row) {
        s.activecount = 0
        var dt = s.available_item_data_edit[row]
      
        if (dt.active_status == true) {
            swal({
                title: "Are you sure you want to deactivate this item?",
                text: "",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then(function (willDelete) {
                    if (willDelete) {
                       
                        h.post("../cAddAvailableItemInAPL/fn_aplitemdeactive", {
                            ctrl_no: dt.ctrl_no
                            , item_no: dt.item_no
                            , budget_code: dt.budget_code
                            , employment_type: dt.employment_type
                        }).then(function (d) {
                            if (d.data.icon == "success") {
                                s.available_item_data_edit = d.data.data_items_dtl.refreshTable("available_item_grid_edit", "")
                                s.activecount = d.data.activecount 
                                swal(d.data.message, { icon: "success",timer:2000})
                            }
                            else {
                                swal(d.data.message, { icon: "error" })
                            }
                            cs.loading("hide");
                        })
                    }
                    else {
                        //cs.spinnerRemove("#del_row" + row_id, "fa fa-trash")
                    }
                });
        }
        else {

            swal({
                title: "Are you sure you want to activate this item?",
                text: "",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then(function (willDelete) {
                    if (willDelete) {
                        h.post("../cAddAvailableItemInAPL/fn_aplitemdactivate", {
                            ctrl_no: dt.ctrl_no
                            , item_no: dt.item_no
                            , budget_code: dt.budget_code
                            , employment_type: dt.employment_type
                        }).then(function (d) {
                            if (d.data.icon == "success") {
                                s.available_item_data_edit = d.data.data_items_dtl.refreshTable("available_item_grid_edit", "")
                                s.activecount = d.data.activecount
                                swal(d.data.message, { icon: "success", timer: 2000 })
                            }
                            else {
                                swal(d.data.message, { icon: "error" })
                            }
                            cs.loading("hide");
                        })
                    }
                    else {
                        //cs.spinnerRemove("#del_row" + row_id, "fa fa-trash")
                    }
                });
        }
       
    }
    s.fn_aplitemremove = function (row) {
        var dt = s.available_item_data_edit[row]
        swal({
            title: "Are you sure you want to delete this record?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(function (willDelete) {
                if (willDelete) {
                    h.post("../cAddAvailableItemInAPL/fn_aplitemremove", {
                          ctrl_no: dt.ctrl_no
                        , item_no: dt.item_no
                        , budget_code: dt.budget_code
                        , employment_type: dt.employment_type
                    }).then(function (d) {
                        if (d.data.icon == "success") {
                            s.available_item_data_edit = d.data.data_items_dtl.refreshTable("available_item_grid_edit", "")
                            swal(d.data.message, { icon: "success", timer: 2000 })
                        }
                        cs.loading("hide");
                    })
                }
                
            });
       
    }
    s.fn_aplitemremove = function (row) {
        var dt = s.available_item_data_edit[row]
        swal({
            title: "Are you sure you want to delete this record?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(function (willDelete) {
                if (willDelete) {
                    h.post("../cAddAvailableItemInAPL/fn_aplitemremove", {
                        ctrl_no: dt.ctrl_no
                        , item_no: dt.item_no
                        , budget_code: dt.budget_code
                        , employment_type: dt.employment_type
                    }).then(function (d) {
                        if (d.data.icon == "success") {
                            s.available_item_data_edit = d.data.data_items_dtl.refreshTable("available_item_grid_edit", "")
                            swal(d.data.message, { icon: "success", timer: 2000 })
                        }
                        cs.loading("hide");
                    })
                }

            });
    }

    s.fn_addAPLItemHDR = function (row) {
        cs.loading("show")
        var dt = s.available_item_hdr[row]
       
        s.department_code = ""
        s.control_number = dt.ctrl_no

        s.edit = true;
        var ctrl_nbr = dt.ctrl_nbr

        $("#post_date_disp").val(dt.active_dttm)
        $("#valid_until_disp").val(dt.expiry_dttm)
        $("#descr_disp").val(dt.descr)

        s.checkeditem = []

        var budget_code = $("#budget_code").val()
        var employment_type = $("#employment_type").val()

        h.post("../cAddAvailableItemInAPL/Open_Items", { budget_code: budget_code, employment_type: employment_type, ctrl_no: s.control_number}).then(function (d) {
            if (d.data.icon == "success") {

                s.departments = fn_departments(d.data.data_items)
                s.available_item_data_orig = d.data.data_items.filter(onlyUnique);
                s.available_item_data = s.available_item_data_orig.refreshTable("available_item_grid", "")
               
                $("#onlineItemSetup").modal("show")
                $(".selected").prop("checked", false)
                $(".selected").prop("checked", false)
            }
            else {
                swal("Error Fetching Data", { icon: d.data.icon })
            }
            cs.loading("hide")
        })

    }

    s.fn_deactiveAPLItemHDR = function (row) {
       
        var dt = s.available_item_hdr[row]
        var ctrl_nbr = dt.ctrl_no
        var employment_type = dt.employment_type
        var budget_code = dt.budget_code
        swal({
            title: "Are you sure you want to deactivate all items under this header?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(function (willDelete) {
                if (willDelete) {
                    cs.loading("show")
                    h.post("../cAddAvailableItemInAPL/fn_deactiveAPLItemHDR", {
                          ctrl_no: ctrl_nbr
                        , employment_type: employment_type
                        , budget_code: budget_code 
                    }).then(function (d) {
                        if (d.data.icon == "success") {
                            s.available_item_hdr = d.data.hdr.refreshTable("online_item_hdr_grid", ctrl_nbr)
                            swal(d.data.message, { icon: "success", timer: 2000 })
                            cs.loading("hide")
                        }
                        else {

                            swal("Error Fetching Data", { icon: d.data.icon })
                            cs.loading("hide")

                        }
                    })
                } else {
                    cs.loading("hide")
                }
            });
    }

    s.fn_activeForPSB = function (row) {
        cs.loading("show")
        var dt = s.available_item_hdr[row]
        var ctrl_nbr = dt.ctrl_no
        var employment_type = dt.employment_type
        var budget_code = dt.budget_code
        h.post("../cAddAvailableItemInAPL/fn_activeForPSB", {
              ctrl_no : ctrl_nbr
            , employment_type: employment_type
            , budget_code: budget_code
        }).then(function (d) {
            if (d.data.icon == "success") {
                s.available_item_hdr = d.data.hdr.refreshTable("online_item_hdr_grid", ctrl_nbr)
                swal(d.data.message, { icon: "success", timer: 1000 })
                cs.loading("hide")
            }
            else {

                swal(d.data.message, { icon: d.data.icon })
                cs.loading("hide")

            }
        })
    }

    s.fn_inactiveForPSB = function (row) {
        cs.loading("show")
        var dt = s.available_item_hdr[row]
        var ctrl_nbr = dt.ctrl_no
        var employment_type = dt.employment_type
        var budget_code = dt.budget_code
        h.post("../cAddAvailableItemInAPL/fn_inactiveForPSB", {
            ctrl_no: ctrl_nbr
            , employment_type: employment_type
            , budget_code: budget_code
        }).then(function (d) {
            if (d.data.icon == "success") {
                s.available_item_hdr = d.data.hdr.refreshTable("online_item_hdr_grid", ctrl_nbr)
                swal(d.data.message, { icon: "success", timer: 1000 })
                cs.loading("hide")
            }
            else {

                swal(d.data.message, { icon: d.data.icon })
                cs.loading("hide")

            }
        })
    }


    s.fn_activatedallItem = function () {
        cs.loading("show")
        var ctrl_nbr = s.control_number 
        swal({
            title: "Are you sure you want to activate all items under this header?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(function (willDelete) {
                if (willDelete) {
                    h.post("../cAddAvailableItemInAPL/fn_activeallItemHDR", { ctrl_no: ctrl_nbr }).then(function (d) {
                        if (d.data.icon == "success") {
                            s.available_item_data_edit = d.data.data_items_dtl.refreshTable("available_item_grid_edit", "")
                            swal(d.data.message, { icon: "success", timer: 2000 })
                            cs.loading("hide")
                        }
                        else {

                            swal("Error Fetching Data", { icon: d.data.icon })
                            cs.loading("hide")

                        }
                    })
                } else {
                    cs.loading("hide")
                }


            });


    }

    s.fn_addItemsOnline = function () {
        var i_id = "submitItems_i"
        var submit_btn = "submitItems_btn"
        var cancel_btn = "cancel1_btn"
        submit_btn.disabled()
        cancel_btn.disabled()
        i_id.replaceClass("fa-thumbs-up","fa-spinner fa-spin")
    
        if (s.edit == true) {
           
            if (s.checkeditem.length == 0) {
                swal("No selected item!", { icon: "warning" })
                cs.loading("hide")
            }
            else {

                h.post("../cAddAvailableItemInAPL/addItemToAPLHDR", {
                    ctrl_no: s.control_number,
                    item_list: s.checkeditem
                }).then(function (d) {
                    if (d.data.icon == "success") {
                        //scope.available_item_hdr = d.data.data_items_hdr.refreshTable("online_item_hdr_grid", "")
                        swal(d.data.message, { icon: d.data.icon, timer: 2000 })
                        $("#onlineItemSetup").modal("hide")
                      
                        i_id.replaceClass("fa-spinner fa-spin", "fa-thumbs-up")
                        submit_btn.enabled()
                        cancel_btn.enabled()
                    }
                    else {
                        swal(d.data.message, { icon: d.data.icon })
                        i_id.replaceClass("fa-spinner fa-spin", "fa-thumbs-up")
                        submit_btn.enabled()
                        cancel_btn.enabled()
                    }

                    i_id.replaceClass("fa-spinner fa-spin", "fa-thumbs-up")
                    submit_btn.enabled()
                    cancel_btn.enabled()

                    cs.notrequired2("post_date")
                    cs.notrequired2("valid_until")
                    cs.notrequired2("descr")
                })
            }
        }
        else {
            var post_date = $("#post_date").val()
            var valid_until = $("#valid_until").val()
            var descr = $("#descr").val()
            var budget_code = $("#budget_code").val()
            var employment_type = $("#employment_type").val()

            if (!cs.Validate1Field("post_date") || !cs.Validate1Field("valid_until") || !cs.Validate1Field("descr")) {
              
                i_id.replaceClass("fa-spinner fa-spin", "fa-thumbs-up")
                submit_btn.enabled()
                cancel_btn.enabled()
                return
            }

            if (s.checkeditem.length == 0) {
                swal("No selected item!", { icon: "warning" })
               
                i_id.replaceClass("fa-spinner fa-spin", "fa-thumbs-up")
                submit_btn.enabled()
                cancel_btn.enabled()
            }
            else {

                h.post("../cAddAvailableItemInAPL/addItemToOnlineRecruitment", {
                    active_dttm: post_date,
                    expiry_dttm: valid_until,
                    descr: descr,
                    budget_code: budget_code,
                    employment_type: employment_type,
                    item_list: s.checkeditem
                }).then(function (d) {
                    if (d.data.icon == "success") {
                        s.available_item_hdr = d.data.data_items_hdr.refreshTable("online_item_hdr_grid", "")
                        swal(d.data.message, { icon: d.data.icon })
                        $("#onlineItemSetup").modal("hide")
                    }
                    else {
                        swal(d.data.message, { icon: d.data.icon })
                    }
                    i_id.replaceClass("fa-spinner fa-spin", "fa-thumbs-up")
                    cs.notrequired2("post_date")
                    cs.notrequired2("valid_until")
                    cs.notrequired2("descr")
                    submit_btn.enabled()
                    cancel_btn.enabled()
                })
            }
        }
    }

   
    s.fn_deletebtn_click = function (row) {
        cs.loading("show")
        var dt = s.available_item_hdr[row]
        var ctrl_no = dt.ctrl_no
        swal({
            title: "Are you sure you want to delete this data?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(function (willDelete) {
            if (willDelete) {

                h.post("../cAddAvailableItemInAPL/deleteItemHdr", {
                    ctrl_no: ctrl_no
                }).then(function (d) {
                    if (d.data.icon) {
                        getOpen_Items_Hdr()
                    }
                    swal(d.data.message, {icon:d.data.icon})
                })
            } else {
                cs.loading("hide")
            }
        });
    }
})



ng_eRSP_App.filter("InOnline", function () {
   
    return function (input) {
       
        if (input == 1) {
            return true
        }
        else {
            return false
        }
    };
});

ng_eRSP_App.directive("filterMultipleItem", ["commonScript", function (cs) {
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('keyup', function () {
                var list = []
                //cs.search_in_list(item2[i], attrs.tableref)
                var item = elem.val().split(",")
                var item2 = item.filter(function (d) {
                    return d.length > 3
                })
               
                var data = scope.available_item_data
              
                for (var i = 0; i < item2.length; i++) {
                    var dt = data.filter(function (d) {
                        return d.item_no == item2[i]
                    })[0]
                    if (dt !== undefined) {
                        list.push(dt)
                    }
                }
                if (elem.val().length > 0) {
                    list.refreshTable(attrs.tableref, "")
                }
                else {
                    scope.available_item_data.refreshTable(attrs.tableref, "")
                } 
               
            
    
            })
        }
    }
}])


ng_eRSP_App.directive("filterMultipleItem2", ["commonScript", function (cs) {
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('keyup', function () {
                var list = []
                //cs.search_in_list(item2[i], attrs.tableref)
                var item = elem.val().split(",")
                var item2 = item.filter(function (d) {
                    return d.length > 3
                })

                var data = scope.online_available_item_data
             
                for (var i = 0; i < item2.length; i++) {
                    var dt = data.filter(function (d) {
                        return d.item_no == item2[i]
                    })[0]
                    if (dt !== undefined) {
                        list.push(dt)
                    }
                }
               
                if (elem.val().length > 0) {

                    list.refreshTable(attrs.tableref, "")
                }
                else {
                    scope.online_available_item_data.refreshTable(attrs.tableref, "")
                }

            })
        }
    }
}])


ng_eRSP_App.directive("addItemsOnline", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                cs.loading("show")
                if (scope.edit == true) {
                    if (scope.checkeditem.length == 0) {
                        swal("No selected item!", { icon: "warning" })
                        cs.loading("hide")
                    }
                    else {

                        h.post("../cAddAvailableItemInAPL/addItemToAPLHDR", {
                            ctrl_no: scope.control_number,
                            item_list: scope.checkeditem
                        }).then(function (d) {
                            if (d.data.icon == "success") {
                                //scope.available_item_hdr = d.data.data_items_hdr.refreshTable("online_item_hdr_grid", "")
                                swal(d.data.message, { icon: d.data.icon,timer:2000 })
                                $("#onlineItemSetup").modal("hide")
                                cs.loading("hide")
                            }
                            else {
                                swal(d.data.message, { icon: d.data.icon })
                                cs.loading("hide")
                            }
                            angular.forEach(scope.checkeditem, function (v, k) {
                           
                                $('#' + v.row_id).prop('checked', false)
                            })
                            cs.notrequired2("post_date")
                            cs.notrequired2("valid_until")
                            cs.notrequired2("descr")
                        })
                    }
                }
                else {
                    //var post_date = $("#post_date").val()
                    //var valid_until = $("#valid_until").val()
                    //var descr = $("#descr").val()
                    //var budget_code = $("#budget_code").val()
                    //var employment_type = $("#employment_type").val()
                    
                   //if (!cs.Validate1Field("post_date") || !cs.Validate1Field("valid_until") || !cs.Validate1Field("descr")) {
                   //    cs.loading("hide")
                   //    return
                   //}

                    if (scope.checkeditem.length == 0) {
                        swal("No selected item!", { icon: "warning" })
                        cs.loading("hide")
                    }
                    else {

                        h.post("../cAddAvailableItemInAPL/addItemToOnlineRecruitment", {
                            active_dttm: post_date,
                            expiry_dttm: valid_until,
                            descr: descr,
                            budget_code: budget_code,
                            employment_type: employment_type,
                            item_list: scope.checkeditem
                        }).then(function (d) {
                            if (d.data.icon == "success") {
                                scope.available_item_hdr = d.data.data_items_hdr.refreshTable("online_item_hdr_grid", "")
                                swal(d.data.message, { icon: d.data.icon })
                                $("#onlineItemSetup").modal("hide")
                            }
                            else {
                                swal(d.data.message, { icon: d.data.icon })
                            }
                            cs.loading("hide")
                         
                        })
                    }
                }
            })
        }
    }
}])

ng_eRSP_App.directive("selectedItem", ["commonScript","$http", function (cs,h) {
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
              
                var item = attrs.data
                scope.item_no = attrs.data
                scope.item_id = attrs.id

                var checked = $("#" + attrs.id).is(":checked") 
                var budget_code = $("#budget_code").val()
                var employment_type = $("#employment_type").val()
                if (checked) {
                    scope.checkeditem = scope.checkeditem.filter(function (d) {
                        return d.item_no != item
                    })
                    h.post("../cAddAvailableItemInAPL/CheckItemOnline", {
                        budget_code: budget_code,
                        employment_type: employment_type,
                        item_no: item
                    }).then(function (d) {
                        if (d.data.item_online_count > 0) {
                            scope.item_exist_list = d.data.item_online
                            $("#item_exist").modal("show")
                        }
                        else {
                            var data = scope.available_item_data.filter(function (d) {
                                return d.item_no === item && d.budget_code === budget_code && d.employment_type === employment_type
                            })[0]
                            if (elem[0].checked) {
                                scope.checkeditem.push(
                                    {
                                        row_id: scope.item_id
                                        , item_no: item
                                        , budget_code: budget_code
                                        , employment_type: employment_type
                                        , position_code: data.position_code
                                        , position_title1: data.position_title1
                                        , position_long_title: data.position_long_title
                                        , department_code: data.department_code
                                        , department_name1: data.department_name1
                                    }
                                )
                            }
                        }
                    })
                }
                else {

                    var dt = scope.checkeditem.filter(function (d) {
                        return d.item_no != item
                    })
                    scope.checkeditem = dt
                }
            })
        }
    }
}])

ng_eRSP_App.directive("selectedItem2", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {

                var row = attrs.data
                var id = "icn2"+row
                scope.item_no = attrs.data
                scope.item_id = attrs.id
              
                var dt = scope.available_item_data.filter(function (d) {
                    return d.item_no == attrs.item
                })[0]
               
                var budget_code = $("#budget_code").val()
                var employment_type = $("#employment_type").val()
                
                if (id.hasClass("hidden")) {
                   
                    id.removeClass("hidden")
                  
                        scope.checkeditem.push(
                            {
                                  row_id: row
                                , item_no: dt.item_no
                                , budget_code: dt.budget_code
                                , employment_type: dt.employment_type
                                , position_code: dt.position_code
                                , position_title1: dt.position_title1
                                , position_long_title: dt.position_long_title
                                , department_code: dt.department_code
                                , department_name1: dt.department_name1
                            }
                        )
                    
                  
                }
                else {
                    console.log("dddd")
                    id.addClass("hidden")
                    var dt = scope.checkeditem.filter(function (d) {
                        return d.item_no != dt.item_no
                    })
                    scope.checkeditem = dt
                  
                }
            })
        }
    }
}])
ng_eRSP_App.directive("activateitem", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                cs.loading("show")
                var row = attrs.data
                var itm = attrs.item
                var btn2 = "btn2" + itm 
                var btn3 = "btn3" + itm 
                var id = "icn2" + row

             
                var dt = scope.available_item_data[row]
                h.post("../cAddAvailableItemInAPL/activateitem", {
                    data: dt
                    
                }).then(function (d) {
                    if (d.data.icon == "success") {
                        //scope.available_item_data[row].in_publication = true;
                        $('#available_item_grid').dataTable().fnUpdate(true, row, 4,false);
                        $('#available_item_grid').dataTable().fnUpdate(true, row, 5,false);
                        btn2.addClass("hidden")
                        btn3.addClass("hidden")
                      
                    }
                    cs.loading("hide")
                    swal(d.data.message, { icon: d.data.icon, timer: 2000 })
                    
                })
              



            })
        }
    }
}])

ng_eRSP_App.directive("addItem", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                var item = scope.item_no
                var budget_code = $("#budget_code").val()
                var employment_type = $("#employment_type").val()

                scope.checkeditem = scope.checkeditem.filter(function (d) {
                    return d.item_no != item
                })

                var data = scope.available_item_data.filter(function (d) {
                    return d.item_no === item && d.budget_code === budget_code && d.employment_type === employment_type
                })[0]
                
                scope.checkeditem.push(
                    {
                          row_id: scope.item_id
                        , item_no : item
                        , budget_code: budget_code
                        , employment_type: employment_type
                        , position_code: data.position_code
                        , position_title1: data.position_title1
                        , position_long_title: data.position_long_title
                        , department_code: data.department_code
                        , department_name1: data.department_name1
                    }
                )
               
                $("#item_exist").modal("hide")
            })
        }
    }
}])


ng_eRSP_App.directive("cancelItem", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                $('#' + scope.item_id).attr('checked', false);
            })
        }
    }
}])


ng_eRSP_App.directive("editHdrItem", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                h.post("../cAddAvailableItemInAPL/editAPLItem", {
                    data: dobj,
                    ctrl_no: scope.ctrl_no
                }).then(function (d) {
                    if (d.data.icon == "success") {
                        scope.available_item_data_edit = d.data.items_ctrlno.refreshTable("edit_available_item_grid", "")
                    }
                    cs.faIconLoaderHide(row_id, "fa-pencil")
                })
                $("#onlineItemSetup").modal("show")
            })
        }
    }
}])

ng_eRSP_App.directive("addEditItem", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                var row_id = attrs.data
                cs.faIconLoaderShow(row_id,"fa-pencil")
                var dobj = scope.available_item_data_edit[row_id]
                h.post("../cAddAvailableItemInAPL/addSingleItem", {
                    data: dobj,
                    ctrl_no: scope.ctrl_no
                }).then(function (d) {
                    if (d.data.icon == "success") {
                        scope.available_item_data_edit = d.data.items_ctrlno.refreshTable("edit_available_item_grid", "")
                    }
                    cs.faIconLoaderHide(row_id, "fa-pencil")
                })
            })
        }

    }
}])
ng_eRSP_App.directive("deleteEditItem", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                var row_id = attrs.data
                cs.faIconLoaderShow(row_id, "fa-pencil")
                var dobj = scope.available_item_data_edit[row_id]
                h.post("../cAddAvailableItemInAPL/deleteSingleItem", {
                    data: dobj,
                    ctrl_no: scope.ctrl_no
                }).then(function (d) {
                    if (d.data.icon == "success") {
                        scope.available_item_data_edit = d.data.items_ctrlno.refreshTable("edit_available_item_grid", "")
                    }
                    cs.faIconLoaderHide(row_id, "fa-pencil")
                })
            })
        }

    }
}])

ng_eRSP_App.directive("deleteHdrItem", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                var budget_code = $("#budget_code").val()
                var employment_type = $("#employment_type").val()
                var row_id = attrs.data
                var dobj = scope.available_item_hdr[row_id]
                scope.ctrl_no = dobj.ctrl_no

                swal({
                    title: "Are you sure to delete this record?",
                    text: "Once deleted, you will not be able to recover this record!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                    .then(function (willDelete) {
                        if (willDelete) {
                            h.post("../cAddAvailableItemInAPL/deleteItemHdr", {
                                budget_code: budget_code,
                                employment_type: employment_type,
                                ctrl_no: dobj.ctrl_no
                            }).then(function (d) {
                                if (d.data.icon == "success") {
                                    scope.available_item_hdr = d.data.data_items_hdr.refreshTable("online_item_hdr_grid", "")
                                }
                            })
                        }
                        else {
                            //cs.spinnerRemove("#del_row" + row_id, "fa fa-trash")
                        }
                    });
              
            })
        }
    }
}])