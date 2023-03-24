


ng_eRSP_App.controller("cAddReviewQS_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript
    //string scope
    s.item_no = ""
    s.appointment = ""
    s.applicant_name = ""
    s.pageTitle = "Applicant Qualification Details"
    s.app_ctrl_nbr = "";
    s.experince2combine = []
    s.wexp_object = {}
    //array scope
    s.year = []
    s.holder = []
    s.position_from_publication = []
    s.ddl_educ_type = []
    

    //object scope
    s.um = {}
    s.ed = {
         educ_type: ""
       , school_name: ""
       , basic_educ_deg: ""
       , period_from: ""
       , period_to: ""
       , highest_lvl_earned: ""
       , year_graduated: ""
       , schlr_acdmic_rcvd: ""
    }

    function SetValue(id,value,ng)
    {
        $("#" + id).val(value)
        if (ng != "")
        {
            s[ng][id] = value
        }
        else
        {
            s[id] = value
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
                        "mData": "period",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "year_graduated",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                         "mData": "psb_selected",
                         "bSortable": false,
                         "mRender": function (data, type, full, row) {
                             return '<label class="container">' +
                                    '<input type="checkbox" ng-click="educ_check_box(' + row["row"] + ',' + data + ',educ)" id="educ' + row["row"] + '" ng-model="educ' + row["row"] + '" ng-checked="' + data + '">' +
                                    '<span class="educ' + row["row"] + ' checkmark"></span>'+
                                    '<button type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',1)" >  <i class="fa fa-eye"></i></button ></span>'+
                                     '</label>'
                       }
                   }
                ],
                "createdRow": function (row, data, index) {
                    $compile(row)($scope);  //add this to compile the DOM
                },
            });
        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }

  

    s.ld = {
        learn_devt_title: ""
        , learn_devt_from: ""
        , learn_devt_to: ""
        , no_of_hrs: ""
        , learn_devt_type: ""
        , conducted_by: ""
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
                    },
                     {
                         "mData": "psb_selected",
                         "bSortable": false,
                         "mRender": function (data, type, full, row) {
                             return '<label class="container">' +
                                    '<input type="checkbox" ng-click="lnd_check_box(' + row["row"] + ',' + data + ',lnd)" id="LnD' + row["row"] + '" ng-model="LnD' + row["row"] + '" ng-checked="' + data + '">' +
                                    '<span class="LnD' + row["row"] + ' checkmark"></span>' +
                                    '<button type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',2)" >  <i class="fa fa-eye"></i></button ></span>' +
                                    '</label>'
                         }
                     }
                ],
                "createdRow": function (row, data, index) {
                    $compile(row)($scope);  //add this to compile the DOM
                },
            });
        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }


    s.salgrade = []
    s.wx = {
        workexp_from: ""
            , workexp_to: ""
            , position_title: ""
            , dept_agncy_offc_co: ""
            , monthly_salary: ""
            , salary_job_grade: ""
            , appt_status: ""
            , gov_srvc: ""
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
                        "mData": "period",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "gov_srvc",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + cs.sector(data) + "</span>"
                        }
                    },
                    {
                        "mData": "psb_selected",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<label class="container">' +
                                   '<input type="checkbox" ng-click="exp_check_box(' + row["row"] + ',' + data + ',exp)" id="wexp' + row["row"] + '" ng-model="wexp' + row["row"] + '" ng-checked="' + data + '">' +
                                   '<span class="wexp' + row["row"] + ' checkmark"></span>' +
                                   '<button type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',3)" >  <i class="fa fa-eye"></i></button >'+
                                   '<button type="button" class="btn btn-warning btn-sm action combine_btn" style="display: inline-block !important;" ng-click="show_combine_action(' + row["row"] + ',3)" >  <i class="fa fa-plus"></i></button >' +
                                   '</label>'
                                  
                        }
                    }
                ],
                "createdRow": function (row, data, index) {
                    $compile(row)($scope);  //add this to compile the DOM
                },
            });
        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }
    var Init_combine_wexp_Grid = function (par_data) {
        s.Combine_Wexp_Data = par_data;
        s.Combine_Wexp_Table = $('#combine_wexp_grid').dataTable(
            {
                data: s.Combine_Wexp_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columns: [
                     //{
                     //    "mData": "seq_no", "mRender": function (data, type, full, row) {
                     //        return "<span class='text-left btn-block'>" + data + "</span>"
                     //    }
                     //},
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
                        "mData": "period",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'>" + data + "</span>"
                        }
                    },
                    {
                        "mData": "gov_srvc",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'>" + cs.sector(data) + "</span>"
                        }
                    },
                    {
                        "mData":null,
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<label class="container">' +
                                   '<input type="checkbox" ng-click="combine_check_box(' + row["row"] + ')" id="combine_wexp' + row["row"] + '" ng-model="combine_wexp' + row["row"] + '" ng-checked="false">' +
                                   '<span class="combine_wexp' + row["row"] + ' checkmark"></span>' +
                                   '</label>'

                        }
                    }
                ],
                "createdRow": function (row, data, index) {
                    $compile(row)($scope);  //add this to compile the DOM
                },
            });
        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }

    s.el = {
        cscsrvc_ra1080: ""
    , rating: ""
    , examination_date: ""
    , examination_place: ""
    , number: ""
    , validity_date: ""
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
                    },
                    {
                        "mData": "psb_selected",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<label class="container">' +
                                   '<input type="checkbox" ng-click="elig_check_box(' + row["row"] + ',' + data + ',elig)" id="elig' + row["row"] + '" ng-model="elig' + row["row"] + '" ng-checked="' + data + '">' +
                                   '<span class="elig' + row["row"] + ' checkmark"></span>' +
                                   '<button type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',4)" >  <i class="fa fa-eye"></i></button ></span>' +
                                   '</label>'
                        }
                    }
                ],
                "createdRow": function (row, data, index) {
                    $compile(row)($scope);  //add this to compile the DOM
                },
            });
        $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    }


    function init() {
        cs.loading("show")
       
        s.year = cs.RetrieveYear();
        s.rowLen = "10"
        h.post("../cAddReviewQS/Initialize").then(function (d) {
            s.app_ctrl_nbr      = d.data.app_ctrl_nbr
            s.Educ_Data         = d.data.education.refreshTable("educ_grid", "");
            s.Elig_Data         = d.data.eligibility.refreshTable("elig_grid", "");
            s.LnD_Data          = d.data.training.refreshTable("LnD_grid", "");
            s.Wexp_Data = d.data.experience.refreshTable("wexp_grid", "");
            s.ddl_educ_type = d.data.eductype
            s.salgrade = d.data.salgrade
            //s.holder = s.Educ_Data.createNewDataArray();
            cs.loading("hide")
        })

    }

    Init_Educ_Grid([]);
    Init_Elig_Grid([]);
    Init_LnD_Grid([]);
    Init_wexp_Grid([]);
    Init_combine_wexp_Grid([])
    init()


    s.educ_check_box = function (row, data) {
        var dt = s.Educ_Data[row]
        var seqno = dt.seq_no
        var type = s.Educ_Data[row].educ_type
        //if (type > '02')
        //{
            cs.spinnerAdd("educ" + row, "checkmark")
            h.post("../cAddReviewQS/addToPSB",
              {
                  seqno: s.Educ_Data[row].seq_no
                  , info_ctrl_nbr: s.Educ_Data[row].info_ctrl_nbr
                  , psb_selected: $("#educ" + row)[0].checked
                  , tab: "educ"
              }).then(function (d) {
                  if (d.data.icon == "success") {
                      s.Educ_Data = d.data.returndata.refreshTable("educ_grid", seqno);
                      cs.spinnerRemove("educ" + row, "checkmark")
                  }
              })
        //}
        //else
        //{
        //    $("#educ" + row)[0].checked = false
        //}
        
    }


    s.elig_check_box = function (row, data) {
        var dt = s.Elig_Data[row]
        var seqno = dt.seq_no
        cs.spinnerAdd("elig" + row, "checkmark")
        h.post("../cAddReviewQS/addToPSB",
            {
                seqno: s.Elig_Data[row].seq_no
                , info_ctrl_nbr: s.Elig_Data[row].info_ctrl_nbr
                , psb_selected: $("#elig" + row)[0].checked
                , tab: "elig"
            }).then(function (d) {
                if (d.data.icon == "success") {
                    s.Elig_Data = d.data.returndata.refreshTable("elig_grid", seqno);
                    cs.spinnerRemove("elig" + row, "checkmark")
                }
            })
    }


    s.lnd_check_box = function (row, data) {

        var dt = s.LnD_Data[row]
        var seqno = dt.seq_no
        cs.spinnerAdd("LnD" + row, "checkmark")
        h.post("../cAddReviewQS/addToPSB",
            {
                seqno: s.LnD_Data[row].seq_no
                , info_ctrl_nbr: s.LnD_Data[row].info_ctrl_nbr
                , psb_selected: $("#LnD" + row)[0].checked
                , tab: "lnd"
            }).then(function (d) {
                if (d.data.icon == "success") {
                    s.LnD_Data = d.data.returndata.refreshTable("LnD_grid", seqno);
                    cs.spinnerRemove("LnD" + row, "checkmark")
                }
            })
    }
     
    s.combine_check_box = function (row) {
        var seq_no = s.Combine_Wexp_Data[row].seq_no
        if ($("#combine_wexp"+row).is(':checked'))
        {
            s.experince2combine.push(s.Combine_Wexp_Data[row])
        }
        else
        {
            var dt = s.experince2combine.filter(function (d) {
                return d.seq_no != seq_no
            })
            s.experince2combine = []
            s.experince2combine = dt
        }
    }
    s.CombineExperience = function()
    {
        var data = cs.fetchDataFromForm("cm")
        if (s.experince2combine.length < 1)
        {
            swal("No experience selected", { icon: "warning" })
            return;
        }


       
        h.post("../cAddReviewQS/CombinedSelectedExperience", { data1: s.experince2combine, data2: data }).then(function (d) {
            s.Wexp_Data = d.data.experience.refreshTable("wexp_grid", "");
            $("#workexp_combine_modal").modal("hide");
            swal("Success",{icon:"success"})
        })
    }
    s.CombinedSelectedExperience = function () {
       s.experince2combine.sort(cs.dynamicSort("workexp_from"))
        var len = s.experince2combine.length
        if (len > 0) {
          
            var workfrom = s.experince2combine[0].workexp_from
            var workto = s.experince2combine[len - 1].workexp_to
            SetValue("workexp_from", workfrom, "")
            SetValue("workexp_to", workto, "")
        }
       $("#workexp_combine_modal_grid").modal("hide")
    }


    s.exp_check_box = function (row, data) {
        cs.spinnerAdd("wexp" + row, "checkmark")
        var dt = s.Wexp_Data[row]
        var seqno = dt.seq_no
        h.post("../cAddReviewQS/addToPSB",
            {
                seqno: s.Wexp_Data[row].seq_no
                , info_ctrl_nbr: s.Wexp_Data[row].info_ctrl_nbr
                , psb_selected: $("#wexp" + row)[0].checked
                , tab: "exp"
            }).then(function (d) {
                if (d.data.icon == "success") {
                    s.Wexp_Data = d.data.returndata.refreshTable("wexp_grid", seqno);
                    cs.spinnerRemove("wexp" + row, "checkmark")
                }
            })
    }




    s.show_combine_action = function (row, dtl) {
        if (dtl == 1) {
            
            s.Educ_Data.populateFields(s.ed, row)
            $("#educ_dtl_modal").modal("show")
        }
        else if (dtl == 2) {
           
            s.LnD_Data.populateFields(s.ld, row)
            $("#lnd_dtl_modal").modal("show")
        }
        else if (dtl == 3) {
          
            var dt = s.Wexp_Data[row]
            s.wexp_object = dt
            if (dt.gov_srvc == true)
            {
                s.wx.gov_srvc = "1"
            }
            else
            {
                s.wx.gov_srvc = "0"
            }
            s.Wexp_Data.populateFields2("cm", row)
           $("#workexp_combine_modal").modal("show")
            
          
            
        }
        else if (dtl == 4) {
            s.Elig_Data.populateFields(s.el, row)
            $("#eligib_dtl_modal").modal("show")
        }
    }


    s.SelectExperience = function () {
        s.experince2combine = []

        var dt = s.wexp_object

        var wexp_arr = s.Wexp_Data.filter(function (d) {
            return d.gov_srvc == dt.gov_srvc
        })

        s.Combine_Wexp_Data = wexp_arr.refreshTable("combine_wexp_grid", "");
        $("#workexp_combine_modal_grid").modal("show")

    }

   
    s.show_details_action = function (row, dtl) {
        if (dtl == 1) {

            s.Educ_Data.populateFields(s.ed, row)
            $("#educ_dtl_modal").modal("show")
        }
        else if (dtl == 2) {

            s.LnD_Data.populateFields(s.ld, row)
            $("#lnd_dtl_modal").modal("show")
        }
        else if (dtl == 3) {

            var dt = s.Wexp_Data[row]
            if (dt.gov_srvc == true) {
                s.wx.gov_srvc = "1"
            }
            else {
                s.wx.gov_srvc = "0"
            }
            s.Wexp_Data.populateFields(s.wx, row)
            $("#workexp_dtl_modal").modal("show")

        }
        else if (dtl == 4) {
            s.Elig_Data.populateFields(s.el, row)
            $("#eligib_dtl_modal").modal("show")
        }
    }
    s.ReturnToApplicantReview = function () {
        h.post("../cApplicantsReview/SetHistoryPage",
        {
            //empl_id: s.Applicant_List_Data[row_index].empl_id,
            //username: s.Applicant_List_Data[row_index].user_id,
            //password: s.Applicant_List_Data[row_index].user_password,
            //account_type: s.Applicant_List_Data[row_index].user_mode

        }).then(function (d) {
            location.href = "../" + controller + "/" + action + "?ReportName=" + ReportName
                + "&SaveName=" + SaveName
                + "&ReportType=" + ReportType
                + "&ReportPath=" + ReportPath
                + "&Sp=" + sp + "," + parameters
        });
        //window.location.href = "/cApplicantReviewDetail/";
    }
      
    
    //s.selectToEdit = function (val) {
    //    if (val == "cApplicantReviewDetail") {
    //        location.href = val + "/Index?app_ctrl_nbr=" + s.app_ctrl_nbr
    //    }
    //    else {
    //        location.href = val + "/Index"
    //    }
    //}

    //s.check_box = function (row, data) {
    //    cs.spinnerAdd(".educ" + row, "checkmark")
    //    h.post("../cPSBReviewEduc/addToPSB",
    //        {
    //            seqno: s.Educ_Data[row].seq_no
    //            , info_ctrl_nbr: s.Educ_Data[row].info_ctrl_nbr
    //            , psb_selected: $("#educ" + row)[0].checked
    //        }).then(function (d) {
    //            if (d.data.icon == "success") {
    //                s.Educ_Data = d.data.returndata.refreshTable("educ_grid", "");
    //                cs.spinnerRemove(".educ" + row, "checkmark")
    //            }
    //        })
    //}
})


