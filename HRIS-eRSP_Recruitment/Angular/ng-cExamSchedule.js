﻿
ng_eRSP_App.controller("cExamSchedule_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript

    s.is_edit = false
    s.um = {}
    s.year = cs.RetrieveYear()
 
    var Init_ExamSchedule_Grid = function (par_data) {
        s.ExamSchedule_Data = par_data;
        s.ExamSchedule_Table = $('#examschedule_grid').dataTable(
            {
                data: s.PsbSchedule_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [

                    {
                        "mData": "exam_date",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "exam_type",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "exam_location",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block' style='font-size:13px;'>" + data + "</span><br>" +
                            "<span class='text-left btn-block no-padding text-danger " + vw_zoomdt(full["exam_type"]) + "' style='margin-top:-18px;font-size:12px;'>Meeting ID: " + full["zoom_meeting_id"] + "</span></br>"+
                            "<span class='text-left btn-block no-padding text-danger " + vw_zoomdt(full["exam_type"]) + "' style='margin-top:-18px;font-size:12px;'>Passcode: " + full["zoom_passcode"] + "</span></br>"

                        }
                    },
                    {
                        "mData": "exam_time",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                   
                    {
                        "mData": "psb_status",
                        "mRender": function (data, type, full, row) {
                            return '<div>' +
                                '<div class="btn-group">' +
                                '<button class="btn btn-info btn-sm dropdown-toggle btn-grid" type="button" data-toggle="dropdown" data-placement="top" title="Edit exam schedule" ng-click="edit_exam_schedule(' + row["row"] + ')">Edit</button>' +
                                '<button  type="button" ng-disabled="' + full["del_disabled"] + '" class="btn btn-danger btn-sm btn-grid" data-toggle="tooltip" data-placement="top" title="Delete exam schedule" ng-click="deleteExamSchedule(' + row["row"] + ')">Delete</button>' +
                                '</div>' +
                                '</div>';

                           
                            //return '<div>' +
                            //    '<div class="btn-group">' +
                            //    '<button class="btn btn-info btn-sm dropdown-toggle btn-grid" type="button" data-toggle="dropdown" data-placement="top" title="Click for more action">MORE ACTION</button>' +
                            //    '<ul class="dropdown-menu ">' +
                            //    '<li><a ng-click="btn_psbsetup(' + row["row"] + ')">OTHER SETUP</a></li>' +
                            //    '<li><a ng-click="show_panel(' + row["row"] + ',' + data + ')">SHOW PANEL FOR THIS HRMPSB</a></li>' +
                            //    '<li><a ng-click="psb_app_list(' + row["row"] + ',' + data + ')">SHOW APPLICANTS FOR THIS HRMPSB</a></li>' +
                            //    '<li><a ng-disabled="' + full["edit_disabled"] + '" ng-click="btn_edit(' + row["row"] + ')">EDIT HRMPSB SCHEDULE</a></li>' +
                            //    '<li><a ng-disabled="' + full["edit_disabled"] + '"  ng-click="btn_refreshPanelList(' + row["row"] + ')">REFRESH PANEL LIST</a></li>' +
                            //    '</ul>' +
                            //    '</div>' +
                            //    '<button  type="button" ng-disabled="' + full["del_disabled"] + '" class="btn btn-danger btn-sm btn-grid" data-toggle="tooltip" data-placement="top" title="Delete PSB Schedule" ng-click="psb_sched_del(' + row["row"] + ')" ng-disabled="' + data + '==2">Delete</button>' +
                            //    '</div>';


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

  
    
    function vw_zoomdt(data) {
        if (data == "Online Examination") {
            return ""
        }
        else {
            return "hidden"
        }
    }

    function vw_f2floc(data) {
        if (data == "Face to Face") {
            return ""
        }
        else {
            return "hidden"
        }
    }

    function addvalue(id, value) {
        $("#" + id).val(value)
        s[id] = value
    }

    
    Init_ExamSchedule_Grid([])
   

    function init() {

        $("#examclockpicker").clockpicker({
            format: "HH:mm",
            align: "left",
            autoclose: true,
            leadingZeroHours: true,
            twelvehour: true
        });

   
    }

    init()

 
    s.addExamSchedule = function () {
        s.is_edit = false;
        cs.clearFormFields("exm_sched")
        $("#addExamSchedule").modal("show")
        $("#exam_type").prop("disabled", false)
        $("#exam_date").prop("disabled", false)
        $("#exam_time").prop("disabled", false)

    }
    
    s.saveExamSchedule = function () {

        
        var year = $("#f_year").val()
        var exam_data = cs.getFormData("exm_sched")

        if (s.is_edit == false) {
            h.post("../cExamSchedule/SaveExamSchedule", { year: year, exam_data: exam_data }).then(function (d) {
                if (d.data.icon == "success") {

                    s.ExamSchedule_Data = d.data.examschedules.refreshTable("examschedule_grid", "")
                }
                else {
                    swal(d.data.message, { icon: d.data.icon })
                }
                $("#addExamSchedule").modal("hide")
            })
        }
        else {
            h.post("../cExamSchedule/EditExamSchedule", { year: year, exam_data: exam_data }).then(function (d) {
                if (d.data.icon == "success") {

                    s.ExamSchedule_Data = d.data.examschedules.refreshTable("examschedule_grid", "")
                }
                else {
                    swal(d.data.message, { icon: d.data.icon })
                }
                $("#addExamSchedule").modal("hide")
            })
        }
       
    }

    function en_dis_field(type) {
        if (type == "Online Examination") {
            $("#zoom_link").attr("required")
            $("#zoom_meeting_id").attr("required")
            $("#zoom_passcode").attr("required")

            $("#zoom_link").prop("disabled", false)
            $("#zoom_meeting_id").prop("disabled", false)
            $("#zoom_passcode").prop("disabled", false)
        }
        else {
            $("#zoom_link").removeAttr("required")
            $("#zoom_meeting_id").removeAttr("required")
            $("#zoom_passcode").removeAttr("required")
            $("#zoom_link").prop("disabled", true)
            $("#zoom_meeting_id").prop("disabled", true)
            $("#zoom_passcode").prop("disabled", true)
        }
    }

    s.selectExamType = function (type) {
        en_dis_field(type) 
    }


    s.edit_exam_schedule = function (row) {
        s.is_edit = true;
        cs.clearFormFields("exm_sched")
        var dt = s.ExamSchedule_Data[row]

        cs.populateFormFields("exm_sched",dt)

        $("#addExamSchedule").modal("show")

        $("#exam_type").prop("disabled", true)
        $("#exam_date").prop("disabled", true)
        $("#exam_time").prop("disabled", true)
        
        en_dis_field(dt.exam_type)

    }




    s.deleteExamSchedule = function (row) {
        var year = $("#f_year").val()
        var dt = s.ExamSchedule_Data[row]
        h.post("../cExamSchedule/DeleteExamSchedule",
            {
                 exam_date : dt.exam_date
                ,exam_type : dt.exam_type
                , exam_time: dt.exam_time
                , year: year
                
            }).then(function (d) {
            if (d.data.icon == "success") {
                s.ExamSchedule_Data = d.data.examschedules.refreshTable("examschedule_grid", "")
            }
            else {
                swal(d.data.message, { icon: d.data.icon })
            }
        })
    }

    s.selectYear = function (year) {
        
        h.post("../cExamSchedule/GetExamSchedulePeryear", { year: year}).then(function (d) {
            if (d.data.icon == "success") {
                s.ExamSchedule_Data = d.data.examschedules.refreshTable("examschedule_grid", "")
            }
            else {
                swal(d.data.message, {icon:d.data.icon})
            }
        })

    }

})


