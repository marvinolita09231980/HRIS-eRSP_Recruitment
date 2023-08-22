
ng_eRSP_App.controller("cOnlineApplicantsList_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript
    s.department = []
    s.submitfetchtrue = false
    s.rowLen = "10";
    s.dd_item_no = ""
    s.startwith = ""
    s.budget_code = ""
    s.employment_type = ""
    s.rowindex = 0
    s.budget_year = []
    s.APL_List_Data = []
    s.sendingEmailList  = []
    s.SelectedApplicant = []
    s.employment_type_data = []
    s.employment_type = ""
    s.startwith = ""
    s.hiring_periods = []
    s.item_nbrs = cs.item_nbrs
    s.includeToEmail = []
    s.APL_List_Data_Orig = []
    s.filterApplicantItem_data = []
    s.pre_info_ctrl_nbr =""
    s.alphabet_list = [
   
       { alpha_name: 'A' }, { alpha_name: 'B' }, { alpha_name: 'C' }, { alpha_name: 'D' }, { alpha_name: 'E' }, { alpha_name: 'F' },
       { alpha_name: 'G' }, { alpha_name: 'H' }, { alpha_name: 'I' }, { alpha_name: 'J' }, { alpha_name: 'K' }, { alpha_name: 'L' },
       { alpha_name: 'M' }, { alpha_name: 'N' }, { alpha_name: 'O' }, { alpha_name: 'P' }, { alpha_name: 'Q' }, { alpha_name: 'R' },
       { alpha_name: 'S' }, { alpha_name: 'T' }, { alpha_name: 'U' }, { alpha_name: 'V' }, { alpha_name: 'W' }, { alpha_name: 'X' },
       { alpha_name: 'Y' }, { alpha_name: 'Z' }
    ]
    function val(id,lang)
    {
        if(lang == "jq")
        {
            return $("#"+id).val()
        }
        else if(lang == "ng")
        {
            return s[id]
        }
     

    }

    var Init_Educ_Grid = function (par_data) {
        s.Educ_Data = par_data;
        s.Educ_Table = $('#educ_grid').dataTable(
            {
                data: s.Educ_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "seq_no", "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "school_name", "mRender": function (data, type, full, row) {
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
                        "mData": null,
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + full["period_from"] + " to " + full["period_to"] + "</span>"
                        }
                    },
                    {
                        "mData": "year_graduated",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    }
                    //,
                    //{
                    //    "mData": "psb_selected",
                    //    "bSortable": false,
                    //    "mRender": function (data, type, full, row) {
                    //        //return '<label class="container no-padding">' +
                    //        //    //'<input type="checkbox" educ-checkbox="' + row["row"]+'" id="educ' + row["row"] + '" ng-model="educ' + row["row"] + '" ng-checked="' + data + '">' +
                    //        //    //'<span class="educ' + row["row"] + ' checkmark"></span>' +
                    //        //    '<button class="btn btn-warning btn-sm dim" type="button" data-toggle="tooltip" data-placement="top" title="Review Application" ng-click="appl_review(l)"><i class="fa fa-plus"></i></button>'+
                    //        //    '<button class="btn btn-success btn-sm dim" type="button" data-toggle="tooltip" data-placement="top" title="Rate Qualification Standards" ng-click="qs_btn_rate(l)"><i class="fa fa-star"></i></button>'+
                    //        //    //'<button type="button" class="btn btn-success btn-sm action" educ-checkbox="' + row["row"] +'" >  <i class="fa fa-eye"></i></button>' +
                    //        //    //'<button type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',1)" >  <i class="fa fa-eye"></i></button>' +
                    //        //    '</label>'

                    //        return '<center><div class="btn-group action-btn">' +
                    //            '<button type="button" qs-addqs="' + row["row"] + ',1" id="educ' + row["row"] + '" ng-model="educ' + row["row"] + '" class="btn btn-success btn-sm action" data-toggle="tooltip" data-placement="top" title="Add Education Details" >  <i class="fa fa-plus"></i></button >' +
                    //            '<button type="button" show-detailsaction = "' + row["row"] + ',1"  class="btn btn-info btn-sm action" data-toggle="tooltip" data-placement="top" title="Open Info">  <i class="fa fa-eye"></i></button >' +
                    //            '</div></center>'
                    //    }
                    //}
                ],
                "createdRow": function (row, data, index) {
                    $compile(row)($scope);  //add this to compile the DOM
                },
            });
        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }
    
    var Init_Elig_Grid = function (par_data) {
        s.Elig_Data = par_data;
        s.Elig_Table = $('#elig_grid').dataTable(
            {
                data: s.Elig_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "seq_no", "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "cscsrvc_ra1080", "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "rating",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "number",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "number",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + cs.sector(data) + "</span>"
                        }
                    }
                    //,
                    //{
                    //    "mData": "psb_selected",
                    //    "bSortable": false,
                    //    "mRender": function (data, type, full, row) {
                    //        //return '<label class="container">' +
                    //        //    '<input type="checkbox" ng-click="elig_check_box(' + row["row"] + ',' + data + ',elig)" id="elig' + row["row"] + '" ng-model="elig' + row["row"] + '" ng-checked="' + data + '">' +
                    //        //    '<span class="elig' + row["row"] + ' checkmark"></span>' +
                    //        //    '<button type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',4)" >  <i class="fa fa-eye"></i></button ></span>' +
                    //        //    '</label>'

                    //        return '<center><div class="btn-group action-btn">' +
                    //            '<button type="button" qs-addqs="' + row["row"] + ',4" id="elig' + row["row"] + '" ng-model="elig' + row["row"] + '" class="btn btn-success btn-sm action" data-toggle="tooltip" data-placement="top" title="Add Eligibility Details" >  <i class="fa fa-plus"></i></button >' +
                    //            '<button type="button" show-detailsaction = "' + row["row"] + ',4"  class="btn btn-info btn-sm action" data-toggle="tooltip" data-placement="top" title="Open Info">  <i class="fa fa-eye"></i></button >' +
                    //            '</div></center>'
                    //    }
                    //}
                ],
                "createdRow": function (row, data, index) {
                    $compile(row)($scope);  //add this to compile the DOM
                },
            });
        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }
    var Init_LnD_Grid = function (par_data) {
        s.LnD_Data = par_data;
        s.LnD_Table = $('#LnD_grid').dataTable(
            {
                data: s.LnD_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "seq_no", "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block font-smr'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "learn_devt_title", "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block font-smr'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "no_of_hrs",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block font-smr'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "learn_devt_type",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block font-smr'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "conducted_by",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block font-smr'>" + cs.sector(data) + "</span>"
                        }
                    }
                    //,
                    //{
                    //    "mData": "psb_selected",
                    //    "bSortable": false,
                    //    "mRender": function (data, type, full, row) {
                    //        //return '<label class="container">' +
                    //        //    '<input type="checkbox" ng-click="lnd_check_box(' + row["row"] + ',' + data + ',lnd)" id="LnD' + row["row"] + '" ng-model="LnD' + row["row"] + '" ng-checked="' + data + '">' +
                    //        //    '<span class="LnD' + row["row"] + ' checkmark"></span>' +
                    //        //    '<button type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',2)" >  <i class="fa fa-eye"></i></button ></span>' +
                    //        //    '</label>'

                    //        return '<center><div class="btn-group action-btn">' +
                    //            '<button type="button" qs-addqs="' + row["row"] + ',2" id="lnd' + row["row"] + '" ng-model="lnd' + row["row"] + '" class="btn btn-success btn-sm action" data-toggle="tooltip" data-placement="top" title="Add Training Details" >  <i class="fa fa-plus"></i></button >' +
                    //            '<button type="button" show-detailsaction = "' + row["row"] + ',2"  class="btn btn-info btn-sm action" data-toggle="tooltip" data-placement="top" title="Open Info">  <i class="fa fa-eye"></i></button >' +
                    //            '</div></center>'
                    //    }
                    //}
                ],
                "createdRow": function (row, data, index) {
                    $compile(row)($scope);  //add this to compile the DOM
                },
            });
        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }
    var Init_wexp_Grid = function (par_data) {
        s.Wexp_Data = par_data;
        s.Wexp_Table = $('#wexp_grid').dataTable(
            {
                data: s.Wexp_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": "seq_no", "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "dept_agncy_offc_co", "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "position_title",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": null,
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + full["workexp_from"] + " to " + full["workexp_to"] + "</span>"
                        }
                    },
                    {
                        "mData": "gov_srvc",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + cs.sector(data) + "</span>"
                        }
                    }
                    //,
                    //{
                    //    "mData": "psb_selected",
                    //    "bSortable": false,
                    //    "mRender": function (data, type, full, row) {
                    //        //return '<label class="container">' +
                    //        //    '<input type="checkbox" ng-click="exp_check_box(' + row["row"] + ',' + data + ',exp)" id="wexp' + row["row"] + '" ng-model="wexp' + row["row"] + '" ng-checked="' + data + '">' +
                    //        //    '<span class="wexp' + row["row"] + ' checkmark"></span>' +
                    //        //    '<button type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',3)" >  <i class="fa fa-eye"></i></button >' +
                    //        //    '<button type="button" class="btn btn-warning btn-sm action combine_btn" style="display: inline-block !important;" ng-click="show_combine_action(' + row["row"] + ',3)" >  <i class="fa fa-plus"></i></button >' +
                    //        //    '</label>'
                    //        return '<center><div class="btn-group action-btn">' +
                    //            '<button type="button" qs-addqs="' + row["row"] + ',3" id="wexp' + row["row"] + '" ng-model="wexp' + row["row"] + '" class="btn btn-success btn-sm action" data-toggle="tooltip" data-placement="top" title="Add Work Experience Details" >  <i class="fa fa-plus"></i></button >' +
                    //            '<button type="button" show-detailsaction = "' + row["row"] + ',3"  class="btn btn-info btn-sm action" data-toggle="tooltip" data-placement="top" title="Open Info">  <i class="fa fa-eye"></i></button >' +
                    //            '<button type="button" ng-click="show_combine_action(' + row["row"] + ',3)" style="display: inline-block !important;"  class="btn btn-warning btn-sm action combine_btn">  <i class="fa fa-cogs"></i></button >' +
                    //            '</div></center>'
                    //    }
                    //}
                ],
                "createdRow": function (row, data, index) {
                    $compile(row)($scope);  //add this to compile the DOM
                },
            });
        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }

    var Init_sendemail_List_Grid2 = function (par_data) {
        s.Sendemail_List_Data2 = par_data;
        s.Sendemail_List_Table2 = $('#sendemail_List_Grid2').dataTable(
            {
                data: s.Sendemail_List_Data2,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": null, "mRender": function (data, type, full, row) {
                            return "<i id='icn3" + row["row"] + "' class='text-info fa fa-check-circle hidden'></i>";
                        },
                    },
                    {
                        "mData": "app_ctrl_nbr", "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "applicant_name",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "email_address",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    }
                    , {
                        "mData": "status",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + sendStatus(data) + "</span>"
                        }
                    }
                    ,{
                        "mData": "status",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<center><div class="btn-group">' +
                                '<button type="button" class="btn btn-info btn-sm action"><i id="icnemialbtn' + row["row"] + '" class="' + sendStatusIcon(data) + '"></i></button >' +
                                '</div></center>';
                            //return '<label class="container">' +
                            //    '<input class="includeNemail" type="checkbox" row="' + row["row"] + '"  ng-checked="' + CheckedToEmailList(data)+'"/>' +
                            //    '<span class="educ' + row["row"] + ' checkmark"></span></label>'
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

    function sendStatus(data) {
        if (data == false) {
            return "Sending..."
        }
        else {
            return "Send"
        }
    }
    function sendStatusIcon(data) {
        if (data == false) {
            return "fa fa-spinner fa-spin"
        }
        else {
            return "fa fa-check"
        }
    }

    var Init_APL_List_Grid = function (par_data) {
      
        s.APL_List_Data = par_data;
        s.APL_List_Table = $('#APL_List_Grid').dataTable(
            {
                data: s.APL_List_Data,
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
                        "mData": null, "mRender": function (data, type, full, row) {
                            return "<i id='icn2" + row["row"] + "' class='text-info fa fa-check-circle hidden'></i>";
                        },
                    },
                    {
                        "mData": "APL_info_ctrl_nbr",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": null,
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block' ng-mouseover='show_child_info(" + row["row"] + ")' ng-mouseleave='hide_child_info(" + row["row"] + ")'>" + s.to_upper(full["firstname"]) + " " + s.to_upper(full["middlename"]) + ". " + s.to_upper(full["lastname"]) + "</span></br>" +
                                "<span class='text-left btn-block no-padding text-danger " + iffetch(full["prescreen_dttm"]) + "' style='margin-top:-18px;font-size:15px;'>Pre-screening date: " + if19000101(full["prescreen_dttm"]) + "</span></br>"
                              
                        }
                    },
                    {
                        "mData": "item_no",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "review",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block " + s.fn_text_danger(data) + "'>" + s.fn_status(data) + "</span></br>" +
                                "<span class='text-left btn-block no-padding text-success " + iffetch(full["fetch_dttm"]) +"' style='margin-top:-18px;font-size:12px;'>Acknowledge date:</span></br>" +
                                "<button class='text-right btn btn-primary btn-block no-padding " + iffetch(full["fetch_dttm"]) + "' style='margin-top:-20px;font-size:12px;color:white;' ng-click='editfetch(" + row["row"] +")'>" + if19000101(full["fetch_dttm"]) + "</button>" 
                        }
                    },
                    {
                        "mData": "review",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<center><div class="btn-group">' +
                                '<button type="button" style="border:1px solid #22B9BB" class="btn btn-default btn-sm text-info"    ng-click="fetch_education(' + row["row"]+')">EDUCATION</button>' +
                                '<button type="button" style="border:1px solid #22B9BB" class="btn btn-default btn-sm text-success" ng-click="fetch_eligibility(' + row["row"] + ')">ELIGIBILITY</button>' +
                                '<button type="button" style="border:1px solid #22B9BB" class="btn btn-default btn-sm text-warning" ng-click="fetch_experience(' + row["row"] + ')">EXPERIENCE</button>' +
                                '<button type="button" style="border:1px solid #22B9BB" class="btn btn-default btn-sm text-danger"  ng-click="fetch_trainings(' + row["row"]+')">TRAININGS</button>' +
                                
                                '</div></center>';
                        }
                    },
                    {
                        "mData": "review",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<center>'+
                                        '<div class="btn-group">' +
                                        '<button ng-disabled="' + data + '"  type="button" class="btn btn-success btn-sm action" data-toggle="tab" href="#tab-7" ng-click="Choose_fetch_data(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Add To Review">  <i id="icnbtn'+row["row"]+'" class="' + s.fa_icon_changed(data)+'"></i></button >' +
                                        //'<button  type="button" class="btn btn-info btn-sm action" data-toggle="tab" href="#tab-7" ng-click="btn_edit(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Edit">  <i class="fa fa-edit"></i></button >' +
                                        '<button  type="button" class="btn btn-warning btn-sm action" ng-click="btn_show_details(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Qualification">   <i id="det_row' + row["row"] + '" class="fa fa-bars"></i></button>' +
                                        //'<button  type="button" class="btn btn-danger btn-sm action" ng-click="btn_del_row_main_grid(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Delete">   <i class="del_row' + row["row"] + ' fa fa-trash"></i></button>' +
                                '<button type="button" id="emailbtn' + row["row"] + '" class="btn btn-danger btn-sm action" data-toggle="tooltip" data-placement="top" title="Send email notification" ng-click="composeEmail(' + row["row"] + ')" >  <i class="fa fa-paper-plane emailbtncls' + row["row"] + '"></i></button >' +
                                '<button type="button" id="prescrnbtn' + row["row"] + '" class="btn btn-primary btn-sm action" data-toggle="tooltip" data-placement="top" title="Pre-screening date" ng-click="prescreen_date(' + row["row"] + ')" >  <i class="fa fa-eye prescrn' + row["row"] + '"></i></button >' +
                                        '</div>' +
                                        '<button type="button" style="border:1px solid #22B9BB;margin-top:3px;" class="btn btn-default btn-sm text-danger"  ng-click="goToDocs(' + row["row"] + ')">Attachements</button>'
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


    function if19000101(data) {
        if (data == "1900-01-01") return ""
        else return data
    }
    function iffetch(data) {
        
        if (data == "1900-01-01" || data == "") return "hidden"
        else return ""
    }
    s.show_child_info = function (row) {
        var id1 = "childinfo" + row;
        id1.removeClass("hidden")
    }
    s.hide_child_info = function (row) {
       
        var id1 = "childinfo" + row;
        id1.addClass("hidden")
    }
    s.to_upper = function (data) {
        return data.toUpperCase();
    }
    s.fa_icon_changed = function (data) {
        if (data) {
            return "fa fa-check"
        }
        else {
            return "fa fa-plus"
        }
    }
    s.fn_status = function (data) {
        if (data) {
            return "Added in review"
        }
        else {
            return "Not in review"
        }
    }
    s.fn_text_danger = function (data) {
        if (data) {
            return "text-warning"
        }
        else {
            return "text-info"
        }
    }


    s.editfetch = function (row) {
        s.rowindex = row
        $("#editfetch").modal("show")
    }

    s.prescreen_date = function (row) {
        s.rowindex = row
        $("#editprescreen").modal("show")
    }
    s.editFetchDate = function () {
        var dt = s.APL_List_Data[s.rowindex]
        var fetch_dttm = $("#fetch_dttm").val()


        if (cs.Validate1Field("fetch_dttm") == true)
        {
          
            h.post("../cOnlineApplicantsList/EditFetchDate", {
                 app_ctrl_nbr: dt.app_ctrl_nbr
                , item_no: dt.item_no
                , employment_type: dt.employment_type
                , budget_code: dt.budget_code
                , hiring_period: dt.ctrl_no
                , fetch_dttm: fetch_dttm
            }).then(function (d) {
                if (d.data.icon == "success") {
                    s.APL_List_Data = d.data.APL_list.refreshTable("APL_List_Grid", s.rowindex + "");
                    $("#editfetch").modal("hide")
                }
                else {

                    swal(d.data.message, { icon: d.data.icon })
                }
            })
        }
    }

    s.editPrescreenDate = function () {

        var dt = s.APL_List_Data[s.rowindex]
        var prescreen_dttm = $("#prescreen_dttm").val()


        if (cs.Validate1Field("prescreen_dttm") == true) {

            h.post("../cOnlineApplicantsList/EditPrescreenDate", {
                  app_ctrl_nbr: dt.app_ctrl_nbr
                , item_no: dt.item_no
                , employment_type: dt.employment_type
                , budget_code: dt.budget_code
                , hiring_period: dt.ctrl_no
                , fetch_dttm: prescreen_dttm
            }).then(function (d) {
                if (d.data.icon == "success") {
                    s.APL_List_Data = d.data.APL_list.refreshTable("APL_List_Grid", s.rowindex + "");
                    $("#editprescreen").modal("hide")
                }
                else {

                    swal(d.data.message, { icon: d.data.icon })
                }
            })
        }
    }

    s.fetch_education = function (row) {
        var info_ctrl_nbr = s.APL_List_Data[row].APL_info_ctrl_nbr
       
        h.post("../cOnlineApplicantsList/fetch_education", { info_ctrl_nbr: info_ctrl_nbr }).then(function (d) {
            if (d.data.icon == "success") {
                s.Educ_Data = d.data.fetched_education.refreshTable("educ_grid", "")
                $("#edu_tab").modal("show")
            }
            else {
                swal(d.data.message, {icon:d.data.icon})
            }
           
        })
    }
    s.fetch_eligibility = function (row) {
        var info_ctrl_nbr = s.APL_List_Data[row].APL_info_ctrl_nbr
        h.post("../cOnlineApplicantsList/fetch_eligibility", { info_ctrl_nbr: info_ctrl_nbr }).then(function (d) {
            if (d.data.icon == "success") {
                s.Elig_Data = d.data.fetched_eligibility.refreshTable("elig_grid", "")
                $("#elig_tab").modal("show")
            }
            else {
                swal(d.data.message, { icon: d.data.icon })
            }
        })
    }
    s.fetch_experience = function (row) {
        var info_ctrl_nbr = s.APL_List_Data[row].APL_info_ctrl_nbr
        h.post("../cOnlineApplicantsList/fetch_experience", { info_ctrl_nbr: info_ctrl_nbr }).then(function (d) {
            if (d.data.icon == "success") {
                s.Wexp_Data = d.data.fetched_experience.refreshTable("wexp_grid", "")
                $("#wexp_tab").modal("show")
            }
            else {
                swal(d.data.message, { icon: d.data.icon })
            }
        })
    }
    s.fetch_trainings = function (row) {
        var info_ctrl_nbr = s.APL_List_Data[row].APL_info_ctrl_nbr
        h.post("../cOnlineApplicantsList/fetch_trainings", { info_ctrl_nbr: info_ctrl_nbr }).then(function (d) {
            if (d.data.icon == "success") {
                s.LnD_Data = d.data.fetched_trainings.refreshTable("LnD_grid", "")
                $("#lnd_tab").modal("show")
            }
            else {
                swal(d.data.message, { icon: d.data.icon })
            }
        })
    }

    s.goToDocs = function (row) {
        var dt = s.APL_List_Data[row]
       
        var info_ctrl_nbr =  dt.APL_info_ctrl_nbr

        h.post("../cOnlineApplicantsList/SetHistoryPage1", {
              employment_type: $("#employment_type").val()
            , budget_code: $("#budget_code").val()
            , hiring_period: $("#hiring_period").val()
            , department_code: $("#dd_department").val()
            , item_no: $("#dd_item_no").val()
        }).then(function (d) {
            location.href = "../cViewUploadedFileFromAPL/Index?app_ctrl_nbr=" + info_ctrl_nbr + "&origin=app_online"
        })
        
    }

    var Init_sendemail_List_Grid = function (par_data) {
        s.Sendemail_List_Data = par_data;
        s.Sendemail_List_Table = $('#sendemail_List_Grid').dataTable(
            {
                data: s.Applicant_List_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                    {
                        "mData": null, "mRender": function (data, type, full, row) {
                            return "<i id='icn3" + row["row"] + "' class='text-info fa fa-check-circle hidden'></i>";
                        },
                    },
                    {
                        "mData": "lastname",
                        "mRender": function (data, type, full, row) { return "<span class='text-left btn-block'>" + data + "</span>" }
                    },

                    {
                        "mData": "firstname",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },

                    {
                        "mData": "email",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "item_no",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    }
                    ,{
                        "mData": "APL_info_ctrl_nbr",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<center><div class="btn-group">' +
                                '<button type="button" id="btninclude' + row["row"] + '" class="btn btn-success btn-sm action" ng-click="includeNemail(' + row["row"] + ')" data-toggle="tooltip" data-placement="left" title="Include to email">  <i id="icnemialbtn' + row["row"] + '" class="fa fa-plus"></i></button >' +
                                '</div></center>';
                            //return '<label class="container">' +
                            //    '<input class="includeNemail" type="checkbox" row="' + row["row"] + '"  ng-checked="' + CheckedToEmailList(data) + '"/>' +
                            //    '<span class="educ' + row["row"] + ' checkmark"></span></label>'
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
    function resetEmailTblcb() {
        var dt = s.Sendemail_List_Data

        for (var x = 0; x < dt.length; x++) {
            
        }
    }
    function addvalue(id, value) {
        $("#" + id).val(value)
        s[id] = value
    }

    function setOptionEmpty(objid)
    {
       
        for (var x = 0; x < objid.length; x++)
        {
            $("#" + objid[x]).val("")
            s[objid[x]] = ""
        }
    
    }

    function init()
    {
        cs.loading("show")

        $("#dd_item_no").select2().on('change', function (e) {
            s.selectItem_no()
        });
       
        $("#dd_department").select2().on('change', function (e) {
            s.selectDepartment()
        })
        $("#budget_code").select2().on('change', function (e) {

            s.clearFetch()
            var budget_code = $("#budget_code").val()

            //   cs.loading("show")


            addvalue("dd_department", "")
            addvalue("hiring_period", "")
            addvalue("dd_item_no", "")
            h.post("../cOnlineApplicantsList/getHiringPeriod", { employment_type: s.employment_type, budget_code: budget_code }).then(function (d) {
                s.hiring_periods = d.data.HiringPeriods;
                $("#APL_List_Grid").dataTable().fnClearTable();

            })

        })

        var employment_type = ""
        var budget_code = ""
        var department_code = ""
        var hiring_period = ""
        var item_no = ""
        var departmentcount = false
      
        

        if (s.department.length > 0) {
            departmentcount = true
        }
        else {
            departmentcount = false
        }

        h.post("../cOnlineApplicantsList/Initialize", {
            departmentcount: departmentcount
        }).then(function (d) {

            s.APL_List_Data_Orig = d.data.APL_list
            s.APL_List_Data = d.data.APL_list.refreshTable("APL_List_Grid", "");

            if (d.data.departments.length > 0) {
                s.department = d.data.departments
              // localStorage["department"] = JSON.stringify(d.data.department)
            }

            if (d.data.budget_year.length > 0) {
                s.budget_year = d.data.budget_year
            }

            if (d.data.HiringPeriods.length > 0) {
                s.hiring_periods = d.data.HiringPeriods
            }

            if (d.data.item_nbrs.length > 0) {
                s.item_nbrs =  d.data.item_nbrs
            }

          

            define_filters(d.data.filter)
           
            cs.loading("hide")
        })
    }

    init()
    Init_APL_List_Grid(s.APL_List_Data)
    Init_Educ_Grid([])
    Init_Elig_Grid([])
    Init_LnD_Grid([])
    Init_wexp_Grid([])
    Init_sendemail_List_Grid([])
    Init_sendemail_List_Grid2([])

    s.selectEmploymentType = function (employment_type) {
        s.clearFilter(1)
        s.clearFetch()
        cs.loading("show")
        addvalue("dd_department", "")
        addvalue("budget_code", "")
        addvalue("hiring_period", "")
        addvalue("dd_item_no", "")
        var employment_type = s.employment_type
        h.post("../cOnlineApplicantsList/selectEmploymentType", { employment_type: employment_type, start: val("startwith", "jq") }).then(function (d) {

            s.budget_year = d.data.budget_year;
            $("#APL_List_Grid").dataTable().fnClearTable();
        })

    }

    
    function define_filters(filter) {  


        addvalue("employment_type", filter.employment_type)

        if (s.budget_year.length > 0) {
            addvalue("budget_code", filter.budget_code)
        } else {
            setTimeout(function () {
                addvalue("budget_code", filter.budget_code)
            }, 1000);
        }

        if (s.hiring_periods.length > 0) {
            addvalue("hiring_period", filter.hiring_period)
        } else {
            setTimeout(function () {
                addvalue("hiring_period", filter.hiring_period)
                console.log(s.hiring_periods)
            }, 1000);
        }

        if (s.department.length > 0) {
            addvalue("dd_department", filter.department_code)
        } else {
            setTimeout(function () {
                addvalue("dd_department", filter.department_code)
            }, 1000);
        }
        if (s.item_nbrs.length > 0) {
            addvalue("dd_item_no", filter.item_no)
        } else {
            setTimeout(function () {
                addvalue("dd_item_no", filter.item_no)
            }, 1000);
        }
      
    }


    s.selectBudgetCode = function () {
        s.clearFilter(2)
        s.clearFetch()
        var budget_code = $("#budget_code").val()

     //   cs.loading("show")
       
       
        addvalue("dd_department", "")
        addvalue("hiring_period", "")
        addvalue("dd_item_no", "")
        h.post("../cOnlineApplicantsList/getHiringPeriod", { employment_type: s.employment_type, budget_code: budget_code}).then(function (d) {
            s.hiring_periods = d.data.HiringPeriods;
            $("#APL_List_Grid").dataTable().fnClearTable();
        
        })
        
      
    }



    s.selectHiringPeriod = function () {
        s.clearFilter(3)
        cs.loading("show")
        addvalue("dd_department", "")
        addvalue("dd_item_no", "")
        var hiring_period = $("#hiring_period").val()
       
        $("#APL_List_Grid").dataTable().fnClearTable();
        
        h.post("../cOnlineApplicantsList/getDepartments", { hiring_period: hiring_period }).then(function (d) {
            s.department = d.data.departments;
            $("#APL_List_Grid").dataTable().fnClearTable();
        })

    }

    s.selectDepartment = function () {
           s.clearFilter(4)
          var employment_type  = $("#employment_type").val()
          var budget_code      = $("#budget_code").val()
          var department_code = $("#dd_department").val()
          var hiring_period    = $("#hiring_period").val()
          h.post("../cOnlineApplicantsList/getItemNumbers", { employment_type: employment_type, budget_code: budget_code, department_code: department_code, hiring_period: hiring_period }).then(function (d) {
               s.item_nbrs = d.data.item_nbrs
               cs.loading("hide")
               $("#APL_List_Grid").dataTable().fnClearTable();
            })

    }
  
   

    s.selectItem_no = function () {
        cs.loading("show")
        s.clearFetch()
        var employment_type = $("#employment_type").val()
        var budget_code = $("#budget_code").val()
        var item_no = $("#dd_item_no").val()
        var hiring_period = $("#hiring_period").val()
             s.getListFromOnline()
    }

    s.getListFromOnline = function(){
            var employment_type = $("#employment_type").val()
            var budget_code = $("#budget_code").val()
            var item_no = $("#dd_item_no").val()
            var hiring_period = $("#hiring_period").val()
            h.post("../cOnlineApplicantsList/getAPLApplicants",
                {
                     employment_type: employment_type
                    , budget_code: budget_code
                    , item_no: item_no
                    , hiring_period :hiring_period
                }
            ).then(function (d) {
               s.APL_List_Data_Orig = d.data.APL_list
               s.APL_List_Data = d.data.APL_list.refreshTable("APL_List_Grid", "");
               cs.loading("hide")
            })
    }
    s.btn_show_details = function (row_id) {
        var dt = s.APL_List_Data[row_id]
        $("#applicant_name").val(dt.firstname + " " + dt.middlename.charAt(0) +". "+ dt.lastname)
        cs.populateFormFields("apl_pds_dtl_form", dt)
        $("#apl_pds_dtl").modal("show")
       
    }
    s.Choose_fetch_data = function (row_id) {
        $("#add_prescreen_dttm").val("")
        if(s.submitfetchtrue)return
        var icn2 = "icn2" + row_id
        var icnbtn = "icnbtn" + row_id
        var dt = s.APL_List_Data[row_id]
        
        var empl_id = dt.empl_id
        var item_no = dt.item_no
        var budget_code = dt.budget_code
        var employment_type = dt.employment_type
        s.pre_info_ctrl_nbr = dt.APL_info_ctrl_nbr

        if (icn2.hasClass("hidden")) {
            s.SelectedApplicant.push(dt)
            icn2.removeClass("hidden")
            icnbtn.replaceClass("fa fa-plus", "fa fa-check")

            $("#addprescreen").modal("show")
        }
        else {
            var dt2 = s.SelectedApplicant.filter(function (d) {
                return d.empl_id != empl_id && d.item_no != item_no && d.budget_code != budget_code && d.employment_type != employment_type
            })
            s.SelectedApplicant = dt2
            icn2.addClass("hidden")
            icnbtn.replaceClass("fa fa-check","fa fa-plus")
        }
    }

    s.addPrescreenDate = function () {
        var add_prescreen_dttm = $("#add_prescreen_dttm").val()
        for (var i = 0; i < s.SelectedApplicant.length; i++) {
            if (s.SelectedApplicant[i].APL_info_ctrl_nbr === s.pre_info_ctrl_nbr) {
                s.SelectedApplicant[i].prescreen_dttm = add_prescreen_dttm;
                break; 
            }
        }
        $("#addprescreen").modal("hide")
    }
    
    s.submitFetch = function () {
        var icnSfetch = "icnSfetch"
        var dt = s.SelectedApplicant
        var hiring_period = $("#hiring_period").val()
        var d_item_no = $("#dd_item_no").val()
        var d_budget_code = $("#budget_code").val()
        swal({
            title: "Fetch Data from Online Application",
            text: "",
            icon:"success",
            buttons: true,
            dangerMode: true,
        }).then(function (willDelete) {
            if (willDelete) {
                s.submitfetchtrue = true

                icnSfetch.processing("fa-save", "fa-spinner fa-spin")

                h.post("../cOnlineApplicantsList/fetch_data_from_online", {
                      data:dt
                    , employment_type: s.employment_type
                    , budget_code: d_budget_code
                    , item_no: d_item_no
                    , start: s.startwith
                    , hiring_period: hiring_period
                }).then(function (d) {


                    if (d.data.icon == "success") {
                        s.APL_List_Data_Orig = d.data.APL_list
                        s.APL_List_Data = d.data.APL_list.refreshTable("APL_List_Grid", "");
                        swal(d.data.message, { icon: "info" })
                    }
                    else {
                        swal(d.data.message, { icon: "error" })
                    }

                    s.SelectedApplicant = []
                    icnSfetch.processingstop("fa-spinner fa-spin","fa-save")
                    s.submitfetchtrue = false
                })
            }
        });
    }


    s.clearFetch = function () {

       var dt = this

       var dtlen = dt.length

        s.SelectedApplicant = []
        
        if (dtlen > 0) {
            for (var x = 0; x < dtlen; x++) {
                var icn2 = "icn2" + x
                var icnbtn = "icnbtn" + x
                icn2.addClass("hidden")
                icnbtn.replaceClass("fa fa-check", "fa fa-plus")
            }
        }
    }

    s.clearFilter = function (idx) {
        if (idx == 1) {
            s.budget_year = []
            s.hiring_periods = []
            s.department = []
            s.item_nbrs = []
        }
        else if (idx == 2) {
           
            s.hiring_periods = []
            s.department = []
            s.item_nbrs = []
        }
        else if (idx == 3) {
            
            s.department = []
            s.item_nbrs = []
        }
        else if (idx == 4) {
            s.item_nbrs = []
        }

    }



    String.prototype.processing = function (cls1,cls2) {
        var id = this
        id.replaceClass(cls1, cls2)
        var employment_type     = "employment_type"
        var budget_code         = "budget_code"
        var dd_item_no          = "dd_item_no"
        var startwith           = "startwith"

        employment_type.disabled()
        budget_code.disabled()
        dd_item_no.disabled()
        startwith.disabled()        

    }

    String.prototype.processingstop = function (cls1, cls2) {
        var id = this
        id.replaceClass(cls1, cls2)
        var employment_type = "employment_type"
        var budget_code = "budget_code"
        var dd_item_no = "dd_item_no"
        var startwith = "startwith"

        employment_type.enabled()
        budget_code.enabled()
        dd_item_no.enabled()
        startwith.enabled()

    }

    s.findOnlineApplicant = function ()
    {
        cs.loading("show")
        var hiring_period = $("#hiring_period").val()
        var data = $("#online_APL_nbr").val() != null ? $("#online_APL_nbr").val() : "";
        h.post("../cOnlineApplicantsList/findOnlineApplicant", {
            data: data,
            start: val("startwith", "jq"),
            hiring_period: hiring_period
        }).then(function (d) {
            s.employment_type = ""
            s.APL_List_Data_Orig = d.data.APL_list
            s.APL_List_Data = d.data.APL_list.refreshTable("APL_List_Grid", "");
            s.filterApplicantItem_data = filterApplicantItem(d.data.APL_list)
            s.item_nbrs = s.filterApplicantItem_data
            s.employment_type_data = filterApplicantEmployment_type(d.data.APL_list)
            cs.loading("hide")
        })
        
    }

    s.selectStartwith = function ()
    {
        var startwith = val("startwith", "jq")
        var hiring_period = $("#hiring_period").val()
        cs.loading("show")
        if (val("employment_type", "jq") == "" && val("budget_code", "jq") == "" && val("item_no", "jq") == "")
        {
            h.post("../cOnlineApplicantsList/StartsWith", {
                  employment_type: val("employment_type", "jq")
                , budget_code: val("budget_code", "jq")
                , item_no: val("item_no", "jq")
                , start: val("startwith", "jq")
                , hiring_period: hiring_period
            }).then(function (d) {
                s.APL_List_Data_Orig = d.data.APL_list
                s.APL_List_Data = d.data.APL_list.refreshTable("APL_List_Grid", "");
                cs.loading("hide")
            })
        }
        else
        {
            
            var dt = s.APL_List_Data_Orig.filter(function (d) {
                return (d.lastname.charAt(0)).toUpperCase() == startwith
            })
            s.APL_List_Data = dt.refreshTable("APL_List_Grid", "");
            cs.loading("hide")
        }
       
    }


    //EMAIL SCRIPT [[[[[[[[[[[[[[[
    function CheckedToEmailList(id) {
        var dt = s.includeToEmail.filter(function (d) {
            return d.empl_id == id
        })

        if (dt.length > 0) {
            return true
        }
        else {
            return false
        }

    }

    

    s.composeEmail = function (row_id) {
        s.includeToEmail = []
        var dt = s.APL_List_Data[row_id]
     
        s.single_email = dt.email
        s.single_empl_id = dt.empl_id
      
        var data = {
              app_ctrl_nbr: dt.APL_info_ctrl_nbr
            , empl_id: dt.APL_info_ctrl_nbr
            , email_address : dt.email
            , first_name : dt.firstname
            , last_name : dt.lastname
            , middle_name : dt.middlename
            , hiring_period : dt.ctrl_no
        }

        s.includeToEmail.push(data)

        var emails = s.includeToEmail
        var mail = ""
        var subject = ""
        ////var body = document.getElementById("mail-content").innerHTML
        //var body = $(".note-editable").html()
        //var body_text = $(".note-editable").text()
       
        
        $(".emailbtncls" + row_id).removeClass('fa fa-paper-plane');
        $(".emailbtncls" + row_id).addClass("fa fa-spinner fa-spin");
        $("#emailbtn" + row_id).prop("disabled", true);

        h.post("../cApplicantsReview/SendToEmail2", {
              email: emails[0]
            , subject: subject
            , body: ""
        }).then(function (d) {

            swal(d.data.message, {icon:d.data.icon})
         
            $(".emailbtncls" + row_id).removeClass("fa fa-spinner fa-spin");
            $(".emailbtncls" + row_id).addClass('fa fa-paper-plane');
            $("#emailbtn" + row_id).prop("disabled", false);
        })
       
    }

   


    //s.composeEmail = function (row_id) {
    //    s.includeToEmail = []
    //    var dt = s.APL_List_Data[row_id]

    //    s.single_email = dt.email
    //    s.single_empl_id = dt.empl_id

    //    var data = {
    //        app_ctrl_nbr: dt.APL_info_ctrl_nbr
    //        , empl_id: ""
    //        , email_address: dt.email
    //        , first_name: dt.firstname
    //        , last_name: dt.lastname
    //        , middle_name: dt.middlename
    //        , hiring_period: dt.ctrl_no
    //    }

    //    s.includeToEmail.push(data)

    //    if (dt.email != "") {
    //        $("#email_receipent").val(dt.email)
    //        $("#email_view_modal").modal("show")
    //    }
    //    else {
    //        swal("No email address provided by the applicant!", { icon: "error" })
    //    }
    //}
    //]]]]]]]]]]]]]]]EMAIL SCRIPT 

    s.uploadfile = function (attachedFile) {
    }

    function filterforOnlineAPLNbr(data)
    {

        var res_data = []
        if (cs.elEmpty("item_no"))
        {
            var elVal = $("#item_no").val()
            res_data = data.filter(function (d) {
                return d.item_no == elVal
            })

        }
        return res_data
    }
   

    function filterApplicantItem(data)
    {
        var ret_data = data.map(function (item) {
            return {"item_no":item["item_no"], "budget_code":item["budget_code"], "employment_type":item["employment_type"], "position_code":item["position_code"], "position_long_title":item["position_long_title"], "department_code":item["department_code"]};
        });
        return ret_data
    }

    function filterApplicantEmployment_type(data) {

        var ret_data = data.map(function (item) {
            return {  "employment_type": item["employment_type"]};
        });

        return ret_data
    }

    function filterItemOnlineByEmpltype(type) {
        var ret_data = []

        if (type == "")
        {
            ret_data = s.filterApplicantItem_data
        }
        else
        {
            ret_data = s.filterApplicantItem_data.filter(function (d) {
                return d.employment_type == type
            })
        }
       
        return ret_data
    }

    function employment_type_find(type) // boolean result
    {
        var data = s.APL_List_Data_Orig.filter(function (d) {
            return d.employment_type == type
        })
        if (data.length > 0)
        {
            return true
        }
        else
        {
            return false
        }
    }

    s.includeNemail = function (row) {
        var icn3 = "icn3" + row
        var icnemialbtn = "icnemialbtn" + row
        var btninclude = "btninclude" + row
        var dt = s.Sendemail_List_Data[row]
     
        var app_ctrl_nbr = dt.app_ctrl_nbr
        if (dt.email_address == "") {
            swal("No email address provided", { icon: "warning" })
            elem.checked = false
        }
        else {
            if (icn3.hasClass("hidden")) {
                var exist = s.includeToEmail.filter(function (d) {
                    return d.email_address == dt.email_address
                })
                if (exist.length == 0) {
                    var data = {
                          app_ctrl_nbr : dt.APL_info_ctrl_nbr
                        , empl_id : ""
                        , email_address: dt.email
                        , first_name: dt.firstname
                        , last_name: dt.lastname
                        , middle_name: dt.middlename
                        , hiring_period : dt.ctrl_no
                    }
                    s.includeToEmail.push(data)
                }
                icnemialbtn.replaceClass("fa-plus", "fa-check")
                icn3.removeClass("hidden")
                btninclude.replaceClass("btn-success", "btn-info")
            }
            else {
                var dt2 = s.includeToEmail.filter(function (d) {
                    return d.app_ctrl_nbr != app_ctrl_nbr
                })
                s.includeToEmail = dt2
                icnemialbtn.replaceClass("fa-check", "fa-plus")
                icn3.addClass("hidden")
                btninclude.replaceClass("btn-info", "btn-success")
            }
        }
    }

    $('#sendemailgrid_modal').on('hidden.bs.modal', function () {
        var dt = s.includeToEmail
        var dtlen = dt.length
        var mi = ""

       
        for (var x = 0; x < dtlen; x++) {
           
            var exist = s.sendingEmailList.filter(function (d) {
                return d.email_address == dt[x].email_address
            })

            if (dt[x].middle_name == "") {
                mi = ""
            }
            else {
                mi = dt[x].middle_name.substring(0, 1)
            }

            if (exist.length == 0) {
                data = {
                      app_ctrl_nbr: dt[x].app_ctrl_nbr
                    , applicant_name: dt[x].first_name + " " + mi + ". " + dt[x].last_name
                    , email_address: dt[x].email_address
                    , status: false
                }
                s.sendingEmailList.push(data)
            }
        }
    })
})


ng_eRSP_App.directive('openEmailList', ["commonScript", function (cs) {
    //************************************// 
    //*** 
    //************************************// 
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {

                scope.Sendemail_List_Data = scope.APL_List_Data.refreshTable("sendemail_List_Grid", "")
                $("#sendemailgrid_modal").modal("show")
            })
        }
    }
}])


ng_eRSP_App.directive('note-editable', ["commonScript", '$http', function (cs, http) {
    //************************************// 
    //*** this directive show alert if the value of a input type= number exceed is max or min values on blur
    //************************************// 
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('keyup', function () {
               cs.valid_textbox(body_text, "")
            })
        }
    }
}])

ng_eRSP_App.directive('sendEmail', ["commonScript", '$http', function (cs, http) {
    //************************************// 
    //*** this directive show alert if the value of a input type= number exceed is max or min values on blur
    //************************************// 
    return {
        restrict: 'C',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                
                var emails = scope.includeToEmail
                var mail = $("#email_receipent").val()
                var subject = $("#email_subject").val()
                //var body = document.getElementById("mail-content").innerHTML
                var body = $(".note-editable").html()
                var body_text = $(".note-editable").text()

                

              
                if (cs.valid_textbox(subject, "email_subject") && cs.valid_textbox(body_text, "")) {
                    scope.Sendemail_List_Data2 = scope.sendingEmailList.refreshTable("sendemail_List_Grid2", "")
                    //$("#sendemailgrid_modal2").modal("show")
                    for (var x = 0; x < emails.length; x++) {
                       
                        http.post("../cApplicantsReview/SendToEmail2", {
                              email: emails[x]
                            , subject: subject
                            , body: body
                        }).then(function (d) {
                            var se = d.data.se
                            console.log(d.data.se)
                            scope.Sendemail_List_Data2 = rse(se).refreshTable("sendemail_List_Grid2", "")
                            })
                        
                    }
                }
                else {
                    if (!cs.valid_textbox(body_text, "")) {
                        $(".note-editable").html("<center><h2 style='color:red'>Required Message Here!</h2></center>")
                    }
                }

                function rse(se) {
                    var dt = angular.forEach(scope.sendingEmailList, function (value) {
                        if (value.app_ctrl_nbr == se.app_ctrl_nbr) {
                            value.status = true
                        }
                    })
                    return dt
                }

            })
        }
    }
}])

ng_eRSP_App.filter("UPPERCASE", function () {
    return function (x) {
       
        if (x.length > 0) {
            return x.toUpperCase();
        }
        else {
            return ""
        }
    };
});
