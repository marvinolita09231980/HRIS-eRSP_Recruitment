
ng_eRSP_App.controller("cHRMPSBScreening_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript

    

    s.sritemno = ""
    s.r_app_ctrl_nbr = ""
    s.r_psb_ctrl_nbr = ""
    s.r_data_grid = []
    s.rt_err_ntf = []
    s.header_title = "APPLICANT LIST"
    s.psbsched_item = []
    s.psbschedule = []
    s.budget_year = []
    s.total_rating = []
    s.sp_slide_rating = []
    s.slideInnerText = []
    s.included_list = []
    s.panels = []
    s.psb_status = 0
    s.csc_level = ""
    s.employment_type = ""
    s.budget_code = ""
    s.psb_ctrl_nbr = ""
    s.app_ctrl_nbr = ""
    s.rowLen = "5"
    s.is_panel = false;
    s.btn_text3 = "PSB Concluded"
    s.Data_List_RAW = []
    s.ToComparativeTempList = []
    s.psb_ctrl_nbr_toconcluded = ""
    s.profile_img = ""
    s.reactivate = false
    s.btn_disabled = false
    s.um = {}
    s.profile = {
        applicant_name: ""
       , position_long_title: ""
       , app_address: ""
       , birth_date: ""
       , appointment_descr: ""
       , gender_descr: ""
       , budget_description: ""
       , civil_status_descr: ""
       , department_name: ""
    }
    s.dial = {
        qs001: ""
      , qs002: ""
      , qs003: ""
      , qs004: ""
      , cb005: ""
      , cb006: ""
      , cb007: ""
    }
    s.rating = {

    }

    s.psb_action_btn = []


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

    

    s.disabled_ReportsBtn = function () {
        var f = $("#item_no").val()
        if (cs.elEmpty(f)) {
            $("#reports_btn").prop('disabled', true)
        }
        else {
            $("#reports_btn").prop('disabled', false)
        }
    }

    function removeValue(arr) {
        for (var x = 0; x < arr.length; x++) {
            addvalue(arr[x], "")
        }
    }
    function removeValueArray(arr) {
        for (var x = 0; x < arr.length; x++) {
            s[arr[x]] = []
        }
    }


    var Init_PSB_List_Grid = function (par_data) {
        s.Data_List = par_data;
        s.Data_Table = $('#Data_List_Grid').dataTable(
            {
                data: s.Data_List,
                sDom: 'rt<"bottom"p>',
                order: [[2, "asc"]],
                pageLength: 10,
                columns: [
                    {
                        "mData": "department_name",
                        "mRender": function (data, type, full, row) {
                            return "<h3 class='text-left btn-block tabtxt'>" + data + "</h3>" +
                                "<span class='text-left btn-block tabtxt'>" + full["position_long_title"] + "</span>" 
                        }
                    },

                    {
                        "mData": "item_no",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block tabtxt'>" + data + "</span>"
                        }
                    },
                    {
                        sortable:false,
                        "mData": "applicant_name",
                        "mRender": function (data, type, full, row) {
                            return "<h3 class='text-left btn-block tabtxt'>" + data + "</h3>" 
                        }
                    },
                    {
                        "mData": "exam_100perc",
                        "mRender": function (data, type, full, row) {
                            return "<span class='tabtxt'>&nbsp;&nbsp;&nbsp;&nbsp;" + percent25(data) + "</span>"
                        }
                    },
                    {
                        "mData": "qs_total_100perc",
                        "mRender": function (data, type, full, row) {
                            return "<span class='tabtxt'>&nbsp;&nbsp;&nbsp;&nbsp;" + percent50(data) + "</span>"
                        }
                    },
                    {
                        "mData": "cbi_100rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='tabtxt'>&nbsp;&nbsp;&nbsp;&nbsp;" +  percent25(data) + "</span>"
                        }
                    },
                    {
                        "mData": "total_rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='tabtxt'>&nbsp;&nbsp;&nbsp;&nbsp;" + data + "</span>"
                        }
                    },
                    {
                        "mData": "app_status",
                        "mRender": function (data, type, full, row) {
                            return "<span class='tabtxt'>&nbsp;&nbsp;&nbsp;&nbsp;" + changelabel_2(data) + "</span>"
                        }
                    },
                    {
                        "mData": "app_status",
                        "mRender": function (data, type, full, row) {
                            return '<input ng-disabled="' + caAdded(data) + '" id="toComparativeCbRow' + row["row"] + '"  type="checkbox" class="form-control" ng-click="addToComparativeCB(' + row["row"] + ')"  ng-checked="' + caAdded(data) + '"/> '
                        }
                    },
                    {
                        "mData": "app_status",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {

                           return   '<div>' +
                                       '<button  type="button" class="btn btn-info btn-sm btn-grid" ng-click="psbrating_view(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Show Panel Ratings" ' + HSAD(full["hasSelected_approved"]) +'>RATE</button>' +
                               '<button  type="button"  class="btn ' + changeColorClass(data)+' btn-sm btn-grid" ng-click="pass_check_box(' + row["row"] + ',' + caAdded(data) + ')" data-toggle="tooltip" data-placement="left" title="Submit For Comparative">' +
                                       ''+ changelabel(data) + '' +
                                       '</button > '+
                                    '</div>'
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



    function changefa(val) {
        if (parseInt(val) >= 3) {
            return "fa-check"
        }
        else if (parseInt(val) < 3) {
            return "fa-plus"
        }
    }
    function changeColorClass(val) {
        if (parseInt(val) >= 3) {
            return "btn-danger"
        }
        else if (parseInt(val) < 3) {
            return "btn-success"
        }
    }
    function changelabel(val) {
        if (parseInt(val) >= 3) {
            return "Remove"
        }
        else if (parseInt(val) < 3) {
            return "Submit"
        }
    }
    function changelabel_2(val) {
        if (parseInt(val) >= 3) {
            return "In comparative"
        }
        else if (parseInt(val) < 3) {
            return "Not in comparative"
        }
    }
    function caAdded(val) {
        if (parseInt(val) == 3) {
            return true
        }
        else if (parseInt(val) < 3) {
            return false
        }
    }

    var Init_PSB_Rating_Grid = function (par_data) {
        s.PSBRate_Data_List = par_data;
        s.PSBRate_Data_Table = $('#psbrating_table_Grid').dataTable(
            {
                data: s.PSBRate_Data_List,
                sDom: 'rt<"bottom"p>',
                bAutoWidth: false,
                pageLength: 10,
                //order: [[6, 'asc']],
                columns: [
                    {
                        "mData": "panel_user_id",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "psb_name",
                        "mRender": function (data, type, full, row) {
                            return "&nbsp;&nbsp;<span class=''>" + data + "</span>"
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
                        "mData": null,
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'><strong>" + totalscore(full) + "</strong></span>"
                        }
                    },
                    {
                        "mData": "app_status",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<div class="btn-group action-btn">' +
                                '<button  type="button" class="btn btn-info btn-sm action" ng-click="rating_view_manual(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Rate Panel" disabled><i class="fa fa-edit"></i></button>' +
                                '</label>'
                            '</div>'
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

 
    function totalscore(full) {
        var total = 0
        var skills = parseInt(full["skills"])
        var knowledge = parseInt(full["knowledge"])
        var attitude = parseInt(full["attitude"])
        total = skills + knowledge + attitude
        return total
    }

    function pass(data) {
        if (data == "3") {
            return true;
        }
        else {
            return false;
        } 
    }

    function psbstarted(data) {
        if (data == "1") {
            return false;
        }
        else {
            return true;
        }
    }

    function booleanReverse(data)
    {
        var retval = true
        if(data == true)
        {
            retval = false
        }
        else {
            retval = true
        }
        return retval
    }

   function percent25(val1)
    {
         var perc = parseFloat(val1 * 0.25).toFixed(2)
       
        return perc  
   }
    function percent50(val1)
    {
        var perc = parseFloat(val1 * 0.50).toFixed(2)
       
        return perc  
    }
    function init() {
        cs.loading("show")
        $("#item_no").select2().on('change', function (e) {
            s.selectPSBSchedApplicant()
        });
        
        s.disabled_ReportsBtn()
        $(".dial").knob();
        Init_PSB_List_Grid([])
        Init_PSB_Rating_Grid([])

        


        if (localStorage.getItem('budget_year2') == null || localStorage.getItem('budget_year2') == "undefined") {
            s.budget_year = []
        }
        else {
            var ls_array = JSON.parse(localStorage['budget_year2']);
            s.budget_year = ls_array
        }

        
        if (localStorage.getItem('psbschedule2') == null || localStorage.getItem('psbschedule2') == "undefined") {
            s.psbschedule = []
        }
        else {
            var ls_array = JSON.parse(localStorage['psbschedule2']);
            s.psbschedule = ls_array
        }

        if (localStorage.getItem('items2') == null || localStorage.getItem('items2') == "undefined") {
            s.psbsched_item = []
        }
        else {
            var ls_array = JSON.parse(localStorage['items2']);
            s.psbsched_item = ls_array
        }

        if (localStorage.getItem('psb_action_btn') == null || localStorage.getItem('psb_action_btn') == "undefined") {
            s.psb_action_btn = []
        }
        else {
            var ls_array = JSON.parse(localStorage['psb_action_btn']);
            s.psb_action_btn = ls_array
        }

        

       
        
        //ASSIGN VALUESON FILTER IF VALUES IS SET IN LOCAL STORAGE

        if (localStorage.getItem('employment_type2') == null || localStorage.getItem('employment_type2') == "undefined") {
            addvalue("employment_type", "")
        }
        else {
            addvalue("employment_type", localStorage['employment_type2'])
        }

        if (localStorage.getItem('budget_code2') == null || localStorage.getItem('budget_code2') == "undefined") {
            addvalue("budget_code", "")
        }
        else {
            addvalue("budget_code", localStorage['budget_code2'])
        }

        if (localStorage.getItem('psb_ctrl_nbr2') == null || localStorage.getItem('psb_ctrl_nbr2') == "undefined") {
            addvalue("psb_ctrl_nbr", "")
            s.psb_ctrl_nbr_toconcluded = ""
        }
        else {
            addvalue("psb_ctrl_nbr", localStorage['psb_ctrl_nbr2'])
            s.psb_ctrl_nbr_toconcluded = localStorage['psb_ctrl_nbr2']
        }
       
        if (localStorage.getItem('item_no2') == null || localStorage.getItem('item_no2') == "undefined") {
            addvalue("item_no", "")
            cs.loading("hide")
        }
        else {
            addvalue("item_no", localStorage['item_no2'])
           
            var item_no = localStorage['item_no2']
            

              
            var psb_ctrl_nbr = localStorage['psb_ctrl_nbr2']
            var employment_type = localStorage['employment_type2']
            var budget_code = localStorage['budget_code2']

                if (s.psb_status == 2 && item_no != "") {
                    s.btn_text3 = "Submit"
                }
                else {
                    s.btn_text3 = "PSB Concluded"
                }

                s.disabled_ReportsBtn()
                cs.loading("show")
                h.post("../cHRMPSBScreening/sp_hrmpsbscreening_item_list", {
                      item_no: item_no
                    , psb_ctrl_nbr: psb_ctrl_nbr
                    , employment_type: employment_type
                    , budget_code: budget_code
                }).then(function (d) {
                    if (d.data.icon == "success") {
                        s.psb_status = d.data.psb_status
                        s.Data_List_RAW = d.data.psblist
                        s.Data_List = d.data.psblist.refreshTable("Data_List_Grid", "")
                    } else {
                        console.log(d.data.message)
                    }
                    s.disabled_ReportsBtn()
                    cs.loading("hide")
                })


            
        }

        $("#addtoComparativeBtn").addClass("hidden")

    }

    
   

    init()

    function addvalue(id,value)
    {
        $("#" + id).val(value)
        s[id] = value
    }

    $('.dial').trigger('configure', {
        'change': function (v) {

        }
    });

    function HSAD(data) { //IF ALREADY SELECTED ITEM DISABLE BUTTON
        if (data) {
            return "disabled"
        }
        else {
          
            return ""
        }
    }
    
    s.addToComparativeCB = function (row) {
        var dt = s.Data_List[row]
        var cbrow = $("#toComparativeCbRow" + row)[0].checked
        
        if (cbrow) {
            var ex = s.ToComparativeTempList.filter(function (d) {
                return d.app_ctrl_nbr == dt.app_ctrl_nbr
            })
            if (ex.length == 0) {

                s.ToComparativeTempList.push(
                    {
                         "app_ctrl_nbr": dt.app_ctrl_nbr
                        , "psb_ctrl_nbr": dt.psb_ctrl_nbr
                    }
                )
            }
        }
        else {
            s.ToComparativeTempList = s.ToComparativeTempList.filter(function (d) {
                return d.app_ctrl_nbr != dt.app_ctrl_nbr
            })
        }


        if (s.ToComparativeTempList.length > 0 ) {
            $("#addtoComparativeBtn").removeClass("hidden")
        }
        else {
            $("#addtoComparativeBtn").addClass("hidden")
        }

    }

    s.getDialKnobValue = function (obj, form) {
        var retObject = obj
        for (var i = 0; i < retObject.length; i++) {
            retObject[i].psb_pnl_rating = $('#' + form + ' input.dial.m-r-sm.' + retObject[i].slide_id).val()
        }
        return retObject.filter(function (d) {
            return d.psb_cat_code == "002"
        })
    }
    s.resetDialKnobValue = function (obj) {
        var ol = Object.keys(s[obj]).length
        for (var i = 0; i < ol; i++) {
           
            $('#' + obj + ' input.dial.m-r-sm.' + Object.keys(s[obj])[i]).trigger(
                           'configure',
                           {
                               "min": 0,
                               "max": 0,
                               "cursor": false
                           }
                   );
            $('#' + obj + ' input.dial.m-r-sm.' + Object.keys(s[obj])[i]).val(1).trigger('change');
        }
    }


    s.rating_view = function (row_id) {
        s.is_panel = false
        var app_ctrl_nbr = s.Data_List[row_id].app_ctrl_nbr;
        
        var item_no = s.Data_List[row_id].item_no; 
        h.post("../cHRMPSBScreening/findPanel", { psb_ctrl_nbr: s.psb_ctrl_nbr }).then(function (d) {
           
            if (d.data.psb > 0) {
                location.href = "cHRMPSBRating/Index?app_ctrl_nbr=" + app_ctrl_nbr + "&psb_ctrl_nbr=" + s.psb_ctrl_nbr + "&item_no=" + item_no;
            } else {
                swal("User is not a Panel Member for this particular PSB screening",{icon:"warning"})
            }
        })
      
      
    }

    s.psbrating_view = function (row_id) {
        var dt = s.Data_List[row_id];
        s.csc_level = dt.csc_level
        s.r_app_ctrl_nbr = dt.app_ctrl_nbr
        s.r_psb_ctrl_nbr = dt.psb_ctrl_nbr
        s.r_data_grid = dt
       
        h.post("../cHRMPSBScreening/PanelRating", {
             psb_ctrl_nbr :s.psb_ctrl_nbr
            ,app_ctrl_nbr :dt.app_ctrl_nbr
            , item_no: dt.item_no 
            , csc_level: dt.csc_level
        }).then(function (d) {
           
            s.PSBRate_Data_List = d.data.panel_rating.refreshTable("psbrating_table_Grid", "")
            $("#PSB_rating_grid_modal").modal("show")
        })
      

    }


    s.summaryOfProfile = function()
    {
        var psb_ctrl_nbr = s.psb_ctrl_nbr
        var item_no = s.item_no
      
      //location.href = "../cSummaryOfProfile/pageUnderDevelopment"
       location.href = "../cSummaryOfProfile/Index?item_no=" + item_no + "&psb_ctrl_nbr=" + psb_ctrl_nbr


    }

    s.getPSBList = function (psb_ctrl_nbr) {

    }

    s.selectEmploymentType = function (val) {
        cs.loading("show")
        s.psb_status = 0
        s.budget_year = []
        s.psbschedule = []
        s.psbsched_item = []
        localStorage["employment_type2"] = val

        removeValueArray(["budget_year", "psbschedule", "psbsched_item"])
        removeValue(["budget_code", "psb_ctrl_nbr", "item_no"])
        cs.removeLocalStorage(["budget_code2", "psb_ctrl_nbr2", "item_no2"])
        cs.removeLocalStorage(["budget_year2", "psbschedule2", "items2"])

       // s.psb_status = false
        if (!cs.elEmpty(val)) {
            h.post("../cHRMPSBScreening/sp_budgetyears_tbl_combolist1_RCT", {
                  employment_type: val
            }).then(function (d) {
                if (d.data.icon == "success") {
                    s.budget_year = d.data.budgetyears
                    localStorage["budget_year2"] = JSON.stringify(d.data.budgetyears)
                    cs.clearTable("Data_List_Grid")
                }

                s.disabled_ReportsBtn()
                cs.loading("hide")
            })
        }
        else {
            cs.loading("hide")
        }
        cs.clearTable("Data_List_Grid")
        
    }
    
    s.selectBudgetCode = function (val) {
        cs.loading("show")
        s.psb_status = 0
        s.psbschedule = []
        localStorage["budget_code2"] = val

        removeValueArray(["psbschedule", "psbsched_item"])
        removeValue(["psb_ctrl_nbr", "item_no"])
        cs.removeLocalStorage(["psb_ctrl_nbr2", "item_no2"])
        cs.removeLocalStorage(["psbschedule2", "items2"])
        
        //s.psb_status = false;
        if (!cs.elEmpty(val)) {
            h.post("../cHRMPSBScreening/sp_get_psbschedule_dropdown", {
                  employment_type: s.employment_type
                , budget_code: val
            }).then(function (d) {
                if (d.data.icon == "success") {
                    s.psbschedule = d.data.psbschedule
                    localStorage["psbschedule2"] = JSON.stringify(d.data.psbschedule)
                    cs.clearTable("Data_List_Grid")
                }

                s.disabled_ReportsBtn()
                cs.loading("hide")
            })
        }
        else {
            cs.loading("hide")
        }
        cs.clearTable("Data_List_Grid")
    }

    s.generateRating = function () {
        var item_no = ""

        var dt = cs.getFormData("head-filter")
        
        if (cs.validatesubmit("head-filter")) {
            cs.loading("show")
            var item_no = $("#item_no").val()
            h.post("../cHRMPSBScreening/GenerateRating",
                {
                      psb_ctrl_nbr: dt.psb_ctrl_nbr
                    , employment_type: dt.employment_type
                    , budget_code: dt.budget_code
                    , item_no: item_no
                    
                }).then(function (d) {
                    if (d.data.icon == "success") {
                        s.psb_status = d.data.psb_status
                        s.Data_List_RAW = d.data.psblist
                        s.Data_List = d.data.psblist.refreshTable("Data_List_Grid", "")
                    } else {
                        console.log(d.data.message)
                    }
                    s.disabled_ReportsBtn()
                    cs.loading("hide")
                  
                })
        }

    }
    
    s.selectPsb_date = function (val) {

        if (!cs.elEmpty(val)) {
            //s.reactivate = true
            cs.loading("show")
            s.psb_ctrl_nbr_toconcluded = val
            localStorage["psb_ctrl_nbr2"] = val

            removeValueArray(["psbsched_item"])
            removeValue(["item_no"])
            cs.removeLocalStorage(["item_no2"])
            cs.removeLocalStorage(["items2"])

            
            h.post("../cHRMPSBScreening/GetItemsInPSB",
                {
                    psb_ctrl_nbr: val,
                    employment_type: s.employment_type,
                    budget_code: s.budget_code
                }).then(function (d) {

                    s.psbsched_item = d.data.items
                    localStorage["items2"] = JSON.stringify(d.data.items)
                   
                    cs.loading("hide")
                })
        }
        else {
            cs.loading("hide")
        }
        cs.clearTable("Data_List_Grid")
    }
    
    s.selectPSBSchedApplicant = function () {
        var dt = cs.getFormData("head-filter")
        var item_no = $("#item_no").val()
        localStorage["item_no2"] = item_no
        if (cs.validatesubmit("head-filter")) {
           
            cs.loading("show")
            var psb_ctrl_nbr = dt.psb_ctrl_nbr
            var employment_type = dt.employment_type
            var budget_code = dt.budget_code
            
            if (s.psb_status == 2 && item_no != "") {
                s.btn_text3 = "Submit"
            }
            else {
                s.btn_text3 = "PSB Concluded"
            }

            s.disabled_ReportsBtn()

            h.post("../cHRMPSBScreening/sp_hrmpsbscreening_item_list", {
                  item_no: item_no
                , psb_ctrl_nbr: psb_ctrl_nbr
                , employment_type: employment_type
                , budget_code: budget_code
            }).then(function (d) {
                if (d.data.icon == "success") {
                    s.psb_action_btn = d.data.psb_action_btn
                    localStorage["psb_action_btn"] = JSON.stringify(d.data.psb_action_btn)
                    s.psb_status = d.data.psb_status
                    s.Data_List_RAW = d.data.psblist
                    s.Data_List = d.data.psblist.refreshTable("Data_List_Grid", "")
                } else {
                    console.log(d.data.message)
                }
                s.disabled_ReportsBtn()
                cs.loading("hide")
            })

           
        }
    }




    s.clearFilterAndTable = function (val) {
        $("#Data_List_Grid").dataTable().fnClearTable();

        if(val == 1)
        {

        }
    }

    s.delete_row = function (row_id) {
        var dt              =   s.Data_List[row_id]
        var app_ctrl_nbr    =   dt.info_ctrl_nbr
        var psb_ctrl_nbr    =   dt.info_ctrl_nbr
        var item_no         =   dt.item_no
        cs.spinnerAdd("#del_row" + row_id, "fa fa-trash")
        swal({
            title: "Are you sure to delete this record?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
                  .then(function (willDelete) {
                      if (willDelete) {
                          h.post("../cHRMPSBScreening/DeletefromPSBScreening", {
                                app_ctrl_nbr  : dt.info_ctrl_nbr,
                                psb_ctrl_nbr  : dt.info_ctrl_nbr,
                                item_no       : dt.item_no
                          }).then(function (d) {
                              if (d.data.icon == "success") {
                                  s.Applicant_List_Data = d.data.returndata.refreshTable("Applicant_List_Grid", "")
                                  swal(d.data.message, { icon: d.data.icon });
                              }
                              else {
                                  swal(d.data.message, { icon: d.data.icon });
                              }
                              cs.spinnerRemove("#del_row" + row_id, "fa fa-trash")
                          })
                      }
                      else {
                          cs.spinnerRemove("#del_row" + row_id, "fa fa-trash")
                      }
           });
    }

    s.start_psb_modal = function () {
        var vl1 = cs.Validate1Field("employment_type") ? true : false;
        var vl2 = cs.Validate1Field("budget_code") ? true : false;
        var vl3 = cs.Validate1Field("psb_ctrl_nbr") ? true : false;
        if (!vl1 || !vl2 || !vl3) {
            return
        }
        
        $("#start_psb_modal").modal("show")
    }
    s.set_start_psb = function () {
        $("#start_psb_modal").modal("hide")
        cs.loading("show")
        h.post("../cHRMPSBScreening/SetPSBToStart", {
            psb_ctrl_nbr: s.psb_ctrl_nbr_toconcluded,
        }).then(function (d) {
            if (d.data.icon == "success") {
                s.psb_status = d.data.psb_status
                s.psb_action_btn = d.data.psb_action_btn
                cs.spinnerAdd("ongoing_psb", "fa fa-check-circle")

                cs.loading("hide")
                swal("HRMPSB started!", { icon: d.data.icon });
              
            }
            else {
               
                swal(d.data.message, { icon: d.data.icon });
                cs.loading("hide")
            }
        })
    }
    
    s.reactivateHRMPSB = function () {
        cs.loading("show")
        var psb_ctrl_nbr = s.psb_ctrl_nbr
        var item_no = s.item_no

        if (cs.Validate1Field("psb_ctrl_nbr") || cs.Validate1Field("item_no")) {
            h.post("../cHRMPSBScreening/CheckIfExec_HasSelected", { psb_ctrl_nbr: psb_ctrl_nbr, item_no: item_no }).then(function (d) {
                
                if (d.data.hasSelected_approved == true) {
                    swal("Cannot reactive screening schedule, Already has approved application!", {icon:"error"})
                    cs.loading("hide")
                }
                else {
                    swal({
                        title: "Are you sure you want to re-activate this PSB Schedule?",
                        text: "",
                        icon: "warning",
                        buttons: ["No", "Yes"],
                        dangerMode: true,
                    }).then(function (willDelete) {
                        if (willDelete) {
                            h.post("../cHRMPSBScreening/ReactivateHRMPSB", {
                                psb_ctrl_nbr: psb_ctrl_nbr
                            }).then(function (d) {
                                if (d.data.icon == "success") {
                                    s.psb_status = d.data.psb_status
                                    s.psb_action_btn = d.data.psb_action_btn
                                    cs.spinnerAdd("ongoing_psb", "fa fa-check-circle")
                                    cs.DisabledAllFields2(["employment_type", "budget_code", "psb_ctrl_nbr"])
                                }
                                else {
                                    swal(d.data.message, { icon: d.data.icon });

                                }
                                $("#start_psb_modal").modal("hide")
                                cs.loading("hide")
                            })
                        }
                        else {
                            $("#start_psb_modal").modal("hide")
                            cs.loading("hide")
                        }
                    });
                }
            })
           
        }
       
    }
    s.ongoing_psb_modal = function () {
        cs.spinnerAdd("ongoing_psb", "fa fa-check-circle")
        $("#conclude_psb").modal("show")
    }
    s.concludePSb = function () {
        cs.loading("show")
        var psb_ctrl_nbr = $("#psb_ctrl_nbr").val()
        h.post("../cHRMPSBScreening/SetPSBToConcluded", {
            psb_ctrl_nbr: psb_ctrl_nbr
        }).then(function (d) {
            if (d.data.icon == "success") {
                s.psb_status = d.data.psb_status
                s.psb_action_btn = d.data.psb_action_btn
                $("#conclude_psb").modal("hide")
                swal("HRMPSB Screening has concluded", { icon: "success" })
                cs.EnabledAllFields2(["employment_type", "budget_code", "psb_ctrl_nbr"])
            }
            else {
                swal(d.data.message, { icon: d.data.icon });
            }
            cs.spinnerRemove("ongoing_psb", "fa fa-check-circle")
            cs.loading("hide")
        })
    }

    function bin2String(arr) {
        var result = "";
        for (var i = 0; i < arr.length; i++) {
            result += String.fromCharCode(parseInt(arr[i], 2));
        }
        return result;
    }

    //s.rating_view_manual = function (row_id) {
    //    var r_dt = s.PSBRate_Data_List[row_id]
     
    //    var attitude = parseInt(r_dt.attitude)
    //    var knowledge = parseInt(r_dt.knowledge)
    //    var skills = parseInt(r_dt.skills)
    //    //if(attitude > 0 && knowledge > 0 && skills > 0)
    //    //{
    //    //      swal({title:"Not Allowed!", text: "Panel rating is complete!",icon:"warning"})
    //    //}
    //    //else
    //    //{

    //    console.log(r_dt)
    //            s.is_panel = true
    //            addvalue("panel_id", "")
    //            var dt = s.r_data_grid
    //            s.profile_img = ""
    //            //s.profile_img = bin2String(dt.empl_photo_img)
    //            s.psb_ctrl_nbr = s.r_psb_ctrl_nbr
    //            s.app_ctrl_nbr = s.r_app_ctrl_nbr
    //            s.profile = [dt].formInnerText(s.profile);
    //    s.sritemno = dt.item_no
    //    h.post("../cHRMPSBScreening/getProfileRatingInfo_manual", { app_ctrl_nbr: s.r_app_ctrl_nbr, psb_ctrl_nbr: s.r_psb_ctrl_nbr, panel_user_id: r_dt.panel_user_id }).then(function (d) {
    //                if (d.data.icon == "success") {
    //                    s.profile_img = d.data.imgDataURL.empl_photo_img
    //                    addvalue("panel_id", r_dt.panel_user_id)
    //                    $("#PSB_manual_rating_input_modal").modal("show")
    //                    s.total_rating = d.data.total_rating
    //                    s.sp_slide_rating = d.data.sp_slide_rating
    //                    console.log(s.sp_slide_rating)
    //                    s.slideInnerText = s.sp_slide_rating
    //                    s.slideInnerText.dialKnobValue("dial")
                       
    //                }
    //            })
    //  // }  
    //}




    function validate(s,id) {
        var rgx = /^[0-9]*\.?[0-9]*$/
        $("#" + id).val(s.match(rgx))
    }

    
    s.SaveRating = function () {
      
        if (cs.valid_textbox($("#panel_id").val(), "panel_id"))
        {

            h.post("../cHRMPSBScreening/validate_Panel", {
                panel_id: $("#panel_id").val(),
                psb_ctrl_nbr : s.total_rating[0].psb_ctrl_nbr
            }).then(function (d) {
               
                if(d.data.is_panel > 0)
                {
                        var data = s.getDialKnobValue(s.slideInnerText, "dial")
                        h.post("../cHRMPSBScreening/SaveRating", {
                              app_ctrl_nbr: s.total_rating[0].app_ctrl_nbr
                            , psb_ctrl_nbr: s.total_rating[0].psb_ctrl_nbr
                            , rating: data
                            , panel_id: $("#panel_id").val()
                            , is_panel: s.is_panel
                            , item_no: s.sritemno
                            , csc_level: s.csc_level
                        }).then(function (d3) {
                            s.PSBRate_Data_List = d3.data.panel_rating.refreshTable("psbrating_table_Grid", "")
                            s.total_rating = d3.data.total_rating
                            s.sp_slide_rating = d3.data.sp_slide_rating
                            s.slideInnerText = d3.data.sp_slide_rating;
                            s.slideInnerText.dialKnobValue("dial")
                            swal("Your rating is successfully saved", { icon: d3.data.icon })
                        })
                }
                else
                {
                    swal("Invalid Panel Id Number", {icon:"error"})
                }
                $("#PSB_manual_rating_input_modal").modal("hide")
            })
        }
    }

    s.submit_to_comparative = function (row_id) {

        var dt = s.Data_List[row_id]
      
        h.post("../cHRMPSBScreening/submit_to_comparative", { app_ctrl_nbr: dt.app_ctrl_nbr, psb_ctrl_nbr: dt.psb_ctrl_nbr }).then(function (d) {
            if (d.data.icon == "success")
            {
                swal(d.data.message, {icon:d.data.icon})
                
            }
            else
            {
                swal(d.data.message, { icon: d.data.icon })
            }
        })

    }

    s.submit_comparative_all_modal = function () {
        var dt = s.Data_List
        if (s.item_no != "")
        {
            if (dt.length < 1)
            {
                swal("List is empty!", { icon: "warning" })
                return
            }
            else
            {
                $("#submit_comparative_all").modal("show")
            }
           
        }
    }

    s.addtoComparativeAll = function () {
        s.ToComparativeTempList

        cs.loading("show")
        h.post("../cHRMPSBScreening/submit_to_comparative_All", { data: s.ToComparativeTempList }).then(function (d) {

            s.rt_err_ntf = d.data.dbn

            if (d.data.icon == "success") {
             
                s.Data_List = d.data.psblist.refreshTable("Data_List_Grid", "")
                swal("Applicants is added for comparative assessment", { icon: "success", timer: 2000 })
                cs.loading("hide")
            }
            else {
                if (s.rt_err_ntf.psb_concluded == true) {
                    $("#rating_err_notif").modal("show")
                }
                else {
                    swal("This application can't proceed to comparative, HRMPSB screening is not yet concluded!", { icon: d.data.icon })
                }

                //swal(d.data.message, { icon: d.data.icon })

                cs.loading("hide")
            }
        })
    }


    s.pass_check_box = function (row, ca) {
        var dt = s.Data_List[row]
       
        var icnbtnadd = "icnbtnadd" + row

        if (!cs.Validate1Field("item_no"))
        {
            swal("No Position/Item is selected!", { icon: "error" })
            cs.spinnerRemove("pass" + row, "checkmark")
            return
        }
        
        if (ca) {
            if (dt.hasSelected_approved == true) {
                swal("Cannot remove or edit this screened application. Already has approved application! ", { icon: "error" })
                cs.loading("hide")
            } else {

                swal({
                    title: "Are you sure you want to remove this record?",
                    text: "This applicant will be remove from comparative",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                    .then(function (willDelete) {
                        if (willDelete) {
                            cs.loading("show")
                            h.post("../cHRMPSBScreening/DeletefromComparative", {
                                app_ctrl_nbr: dt.app_ctrl_nbr,
                            }).then(function (d) {
                                
                                s.Data_List[row].app_status = d.data.app_status
                                s.Data_List = s.Data_List.refreshTable("Data_List_Grid", "")
                                swal("Message", d.data.message, { icon: d.data.icon })
                                cs.loading("hide")
                            })
                        }
                        else {
                            swal("Message", d.data.message, { icon: d.data.icon })
                        }
                    });
            }
        }
        else {

            cs.loading("show")
            h.post("../cHRMPSBScreening/submit_to_comparative", { app_ctrl_nbr: dt.app_ctrl_nbr, psb_ctrl_nbr: dt.psb_ctrl_nbr }).then(function (d) {
                s.rt_err_ntf = d.data.dbn
                
                if (d.data.icon == "success") {
                    s.Data_List[row].app_status = d.data.app_status
                    s.Data_List = s.Data_List.refreshTable("Data_List_Grid", "")
                    swal("Applicants is added for comparative assessment", { icon: "success", timer: 2000 })
                    cs.loading("hide")
                }
                else {
                    if (s.rt_err_ntf.psb_concluded == true) {
                        $("#rating_err_notif").modal("show")
                    }
                    else {
                        swal("This application can't proceed to comparative, HRMPSB screening is not yet concluded!", { icon: d.data.icon })
                    }
                   
                    //swal(d.data.message, { icon: d.data.icon })
                   
                    cs.loading("hide")
                }
            })

        }
        
       
    }

    s.gotoEmbed = function () {
        location.href = "../cEmbededScreening/"
    }

    s.goToQS = function (app_ctrl_nbr) {
        location.href = "cApplicantReviewDetail/Index?app_ctrl_nbr=" + app_ctrl_nbr 
    }

    s.goToExam = function (app_ctrl_nbr) {
        location.href = "cApplicantReviewDetail/Index?app_ctrl_nbr=" + app_ctrl_nbr 
    }

    function changeBtnLabel(){
        var dt = s.included_list.filter(function (d) {
            return d.item_isadded == true
        })
        if(dt.length == 0)
        {
            s.btn_text3 = "Submit"
           
        }
        else
        {
            s.btn_text3 = "Submit"
        }
     
    }



    //s.pass_check_box = function (row) {

    //    cs.spinnerAdd("pass" + row, "checkmark")
    //    var dt = s.Data_List[row]
    //    h.post("../cHRMPSBScreening/HRMPSBScreeningPass",
    //        {
    //            employment_type : s.employment_type
    //          , budget_code     : s.budget_code
    //          , psb_ctrl_nbr    : s.psb_ctrl_nbr
    //          , item_no         : s.item_no
    //          , pass: $("#pass" + row)[0].checked
    //          , app_ctrl_nbr   : dt.app_ctrl_nbr
    //        }).then(function (d) {
    //            if (d.data.icon == "success") {
    //                s.Data_List_RAW = d.data.psblist
    //                s.Data_List = d.data.psblist.refreshTable("Data_List_Grid", "")
    //                cs.spinnerRemove("pass" + row, "checkmark")
    //            }
    //            else {
    //                swal(d.data.message, { icon: d.data.icon });
    //                cs.spinnerRemove("pass" + row, "checkmark")
    //            }

    //        })
    //}

    //s.submit_list_comparative_btn = function () {
    //    var dt = s.Data_List
    //    h.post("../cHRMPSBScreening/submit_list_comparative", { data: dt }).then(function (d) {

    //        swal(d.data.message, { icon: d.data.icon })
    //        s.Data_List_RAW =  d.data.psblist
    //        if (s.item_no != "")
    //        {
    //            var dt = s.Data_List_RAW.filter(function (d) {
    //                return d.item_no == s.item_no
    //            })
    //            s.Data_List = dt.refreshTable("Data_List_Grid", "")
    //        }
    //    })

       
    //}
    Array.prototype.getCheckItem = function () {
     
        var data = this
        var dl = data.length
        for (var x = 0; x < dl; x++)
        {
            if($("#pass" + x)[0].checked == true)
            {
                data[x].item_isadded = true
            }
            else
            {
                data[x].item_isadded = false
            }
        }
        return data
    }

    s.proceedToComparative = function (id) {
      
         if (cs.validatesubmit(id)) {

            var dl = s.Data_List.getCheckItem()
          
            if(dl.length > 0)
            {
                h.post("../cHRMPSBScreening/ProceedToComparative", { data: dl }).then(function (d) {
                    if(d.data.icon == "success")
                    {
                        s.Data_List = d.data.psblist.refreshTable("Data_List_Grid", "")
                        swal(d.data.message, { icon: d.data.icon })
                    }
                    else
                    {
                        console.log(d.data.message)
                    }
                })
            }
            else
            {
                swal("No data to submit!", {icon:"warning"})
            }
        } 
        
    }

    s.validate_panel = function (val) {
        if (val.length == 5)
        {
            var dt = s.panels.filter(function (d) {
                return d.panel_user_id.toUpperCase() == val.toUpperCase()
            })
            if (dt.length > 0) {

                h.post("../cHRMPSBScreening/getPanelRating", { app_ctrl_nbr: s.app_ctrl_nbr, psb_ctrl_nbr: s.psb_ctrl_nbr, panel_user_id: dt[0].panel_user_id }).then(function (d) {
                    s.btn_disabled = d.data.sp_slide_rating[0].btn_disabled
                    s.total_rating = d.data.total_rating
                    s.sp_slide_rating = d.data.sp_slide_rating
                    s.slideInnerText = d.data.sp_slide_rating;
                    s.slideInnerText.dialKnobValue("dial")

                })
                cs.notrequired2("panel_id");

            }
            else {

                cs.required2("panel_id", "Not found")
                s.resetDialKnobValue("dial")
            }
        }
        else
        {
            cs.required2("panel_id", "Not found")
            s.resetDialKnobValue("dial")
        }
      
       
    }

    Array.prototype.dialKnobValue = function (form) {
        var data = this;
       
        for (var i = 0; i < data.length; i++) {
            if (data[i].psb_cat_subcode == "005" || data[i].psb_cat_subcode == "006" || data[i].psb_cat_subcode == "007" ) {
           
                var d_val = data[i].psb_pnl_rating == 0 ? 1 : data[i].psb_pnl_rating;

                console.log(d_val)
             
                $('#' + form + ' input.dial.m-r-sm.' + data[i].slide_id).trigger(
                               'configure',
                               {
                                   "min": 0,
                                   "max": data[i].sub_max_rate,
                                   "cursor": false
                               }
                       );
                    $('#' + form + ' input.dial.m-r-sm.' + data[i].slide_id).val(d_val).trigger('change');
            }
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
})


ng_eRSP_App.directive("minMax", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.on('keyup', function () {
                var param = attrs.minMax.split(',')
                var min = param[0]
                var max = param[1]


                var id = attrs.id
                var val = $("#" + id).val()

                var ngmodel = attrs.ngModel

                if (val < min) {
                    cs.required2(id, "Score must be greater or equal to " + min)
                }
                else if (val > max) {
                    cs.required2(id, "Score must be lower or equal to " + max)
                }
                else {
                    cs.notrequired2(id);
                }

            })
        }
    }
}])


ng_eRSP_App.directive("ngValue", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.on('load', function () {
                var param = attrs.ngValue
                var id = attrs.id
                var ngmodel = attrs.ngModel
                $("#" + id).val(param)
                scope[ngmodel] = param
            })
        }
    }
}])



ng_eRSP_App.filter("initial_min", function () {
    return function (input) {
     
        return input
    };
});


ng_eRSP_App.filter("encode_idv", function () {
   
    return function (d, a, e, b, c, f) {
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
    };
});

//ng_eRSP_App.filter("imgencode", function () {
//    return function (input) {
//        c = "";
//        try {

//            for (a = e = b = 0; a < 4 * d.length / 3; f = b >> 2 * (++a & 3) & 63, c += String.fromCharCode(f + 71 - (f < 26 ? 6 : f < 52 ? 0 : f < 62 ? 75 : f ^ 63 ? 90 : 87)) + (75 == (a - 1) % 76 ? "\r\n" : ""))a & 3 ^ 3 && (b = b << 8 ^ d[e++]); for (; a++ & 3;)c += "=";

//            if (c.toString().trim() == "") {
//               r $('#' + input).attr('src', "../ResourcesImages/149071.png")
//            }
//            else {
//                $('#' + input).attr('src', "data:image/png;base64," + c + "")
//            }
//        } catch (e) {
//            $('#' + input).attr('src', "../ResourcesImages/149071.png")
//        }
//    };
//});

