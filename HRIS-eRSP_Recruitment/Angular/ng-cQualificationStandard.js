


ng_eRSP_App.controller("cQualificationStandard_Ctrlr", function (commonScript, $scope, $http, $filter, $compile, $window) {
    var s = $scope
    var h = $http
    var cs = commonScript
    s.rowLen = "8"
    s.exam_score = ""
    s.competency = ""
    s.totalrating = ""
    s.rank = ""
    s.psb_status = 0
    s.psb_concluded = false
    s.app_ctrl_nbr = ""
    s.profile_img = ""
    s.psb_list = []
    s.sp_slide_rating = []
    s.total_rating = []
    s.slideInnerText = []
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
       , qs002: ""
       , qs003: ""
       , qs004: ""
    }
    s.slideRate = {
        R004: ""
        , R005: ""
        , R006: ""
        , R007: ""
        , R008: ""
        , R009: ""
        , R010: ""
    }

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



    s.el = {

        cscsrvc_ra1080: ""
       , rating: ""
       , examination_date: ""
       , examination_place: ""
       , number: ""
       , validity_date: ""


    }

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

    s.ld = {
        learn_devt_title: ""
      , learn_devt_from: ""
      , learn_devt_to: ""
      , no_of_hrs: ""
      , learn_devt_type: ""
      , conducted_by: ""
    }

    s.AT = [{ id: 'JO', text: 'Job Order' }, { id: 'RE', text: 'Permanent' }, { id: 'CE', text: 'CASUAL' }]

    s.svc = [{ id: false, text: 'No' }, { id: true, text: 'Yes' }]


    var Init_Applicant_Details_Grid = function (par_data) {
        s.Applicant_Details_Data = par_data
        s.Applicant_Details_Table = $('#datalist_grid').dataTable(
            {
                data: s.Applicant_Details_Data,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                columnDefs: [{
                    orderable: false
                }],
                columns: [
                    {

                        "mData": "seq_no",
                        "mRender": function (data, type, full, row) {
                            return '<span class="text-left btn-block tabtxt">' + data + '</span>'

                        }
                    },
                    {

                        "mData": "education",
                        "mRender": function (data, type, full, row) {
                            return '<span style="width:90%;" class="text-left btn-block tabtxt pull-left">' + data + '</span>' +
                                '<span style="width:10%;" class="pull-right"><button ng-hide="' + cs.elEmpty(data) + '"  type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',1)" >  <i class="fa fa-edit"></i></button ></span>'
                        }
                    },
                    {

                        "mData": "training",
                        "mRender": function (data, type, full, row) {
                            return '<span style="width:90%;" class="text-left btn-block tabtxt pull-left">' + data + '</span>' +
                               '<span style="width:10%;" class="pull-right"><button ng-hide="' + cs.elEmpty(data) + '"  type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',2)" >  <i class="fa fa-edit"></i></button ></span>'
                        }
                    },
                    {

                        "mData": "experience",
                        "mRender": function (data, type, full, row) {
                            return '<span style="width:90%;" class="text-left btn-block tabtxt pull-left">' + data + '</span>' +
                                '<span style="width:10%;" class="pull-right"><button ng-hide="' + cs.elEmpty(data) + '"  type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',3)" >  <i class="fa fa-edit"></i></button ></span>'
                        }
                    },

                    {

                        "mData": "eligibility",
                        "mRender": function (data, type, full, row) {
                            return '<span style="width:90%;" class="text-left btn-block tabtxt pull-left">' + data + '</span>' +
                                '<span style="width:10%;" class="pull-right"><button ng-hide="' + cs.elEmpty(data) + '"  type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',4)" >  <i class="fa fa-edit"></i></button ></span>'
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


    function init() {
        cs.loading("show")
        $(".dial").knob();
        Init_Applicant_Details_Grid([]);
        s.year = cs.RetrieveYear(); 5

        h.post("../cQualificationStandard/Initialize").then(function (d) {
            s.app_ctrl_nbr = d.data.app_ctrl_nbr
          
            s.psb_status = d.data.psb_status
            s.sp_slide_rating = d.data.sp_slide_rating
            s.slideInnerText = d.data.sp_slide_rating
            s.slideInnerText.dialKnobValue("dial")
            if (d.data.psb_list.length > 0)
            {
                s.profile_img = d.data.imgDataURL
                s.psb_list = d.data.psb_list
                s.profile = d.data.psb_list.formInnerText(s.profile);
                s.exam_score = s.psb_list[0].exam_score
                s.psb_concluded = d.data.psb_list[0].psb_concluded
                s.readonly = d.data.psb_list[0].psb_concluded
            }
            s.total_rating = d.data.total_rating
            s.Applicant_Details_Data = d.data.dtl_list.refreshTable("datalist_grid", "")
            $(document).ready(cs.loading("hide"))
        })
    }



    init()
    s.getDialKnobValue = function (obj, form) {
        var retObject = obj
        for (var i = 0; i < retObject.length; i++) {
            retObject[i].psb_pnl_rating = $('#' + form + ' input.dial.m-r-sm.' + retObject[i].slide_id).val()
        }

        return retObject.filter(function (d) {
            return d.psb_cat_code == "001"
        })
    }

    Array.prototype.dialKnobValue = function (form) {
        var data = this;
        for (var i = 0; i < data.length; i++) {
            var d_val = data[i].psb_pnl_rating == 0 ? 22 : data[i].psb_pnl_rating;
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

    Array.prototype.dialKnobDisableAll = function (form) {
        var data = this;
        for (var i = 0; i < data.length; i++) {

            $('#' + form + ' input.dial.m-r-sm.' + data[i].slide_id).trigger(
                           'configure',
                           {
                               "min": 0,
                               "max": data[i].sub_max_rate,
                               "cursor": false,
                               "readOnly":true
                           }
                   );
            $('#' + form + ' input.dial.m-r-sm.' + data[i].slide_id).val(data[i].psb_pnl_rating).trigger('change');

        }
    }

    //Array.prototype.slideInnerText = function () {
    //    var thisObject = this
    //    thisObject = this.filter(function (d) {
    //        return d.rtg_ctrl_nbr > "003"
    //    })
    //    angular.forEach(thisObject, function (k, v) {
    //        k.color = s.slide_color[k]
    //    })
    //    return thisObject
    //}


    Array.prototype.formInnerText = function (obj) {
       
        var thisObject = obj
        if (this[0] != undefined && this.length > 0)
        {
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

        }
      
        return thisObject
    }


    $('.dial').trigger('configure', {
        'change': function (v) {

        }
    });




    s.EditScore = function () {
        alert()
    }

    s.SaveRating = function () {
        //if (s.readonly)
        //{
        //    s.slideInnerText = s.sp_slide_rating
        //    s.slideInnerText.dialKnobValue("dial")
        //    return
        //}
        var data = []
        data = s.getDialKnobValue(s.slideInnerText, "dial")
        h.post("../cQualificationStandard/SaveRating", { dial: data, app_ctrl_nbr: s.app_ctrl_nbr }).then(function (d) {
            if (d.data.icon == "success") {
                s.sp_slide_rating = d.data.sp_slide_rating
                s.slideInnerText = d.data.sp_slide_rating;
                s.slideInnerText.dialKnobValue("dial")
                s.total_rating = d.data.total_rating
                swal("Your rating is successfully saved", { icon: d.data.icon })
            }
            else {
                swal(d.data.message, { icon: d.data.icon })
            }
        })

    }

    s.RefreshRating = function () {
        s.slideInnerText = s.sp_slide_rating
        s.slideInnerText.dialKnobValue("dial")
    }

    s.show_details_action = function (row, dtl) {
        var dt = s.Applicant_Details_Data[row]
        var info_ctrl_nbr = dt.info_ctrl_nbr

        if (dtl == 1) {
            h.post("../cQualificationStandard/showDetails", { info_ctrl_nbr: info_ctrl_nbr, seq_no: dt.educ_seq, detail: dtl }).then(function (d) {
                if (d.data.icon == "success") {
                    d.data.obj.populateFields(s.ed, 0)
                    $("#educ_dtl_modal").modal("show")
                }
                else { console.log(d.data.message) }
            })

        }
        else if (dtl == 2) {
            h.post("../cQualificationStandard/showDetails", { info_ctrl_nbr: info_ctrl_nbr, seq_no: dt.lnd_seq, detail: dtl }).then(function (d) {
                if (d.data.icon == "success") {
                    d.data.obj.populateFields(s.ld, 0)
                    $("#lnd_dtl_modal").modal("show")
                }
                else { console.log(d.data.message) }
            })

        }
        else if (dtl == 3) {
            h.post("../cQualificationStandard/showDetails", { info_ctrl_nbr: info_ctrl_nbr, seq_no: dt.wexp_seq, detail: dtl }).then(function (d) {
                if (d.data.icon == "success") {
                    d.data.obj.populateFields(s.wx, 0)
                    $("#workexp_dtl_modal").modal("show")
                }
                else { console.log(d.data.message) }
            })

        }
        else if (dtl == 4) {
            h.post("../cQualityStandardRating/showDetails", { info_ctrl_nbr: info_ctrl_nbr, seq_no: dt.elig_seq, detail: dtl }).then(function (d) {
                if (d.data.icon == "success") {
                    d.data.obj.populateFields(s.el, 0)
                    $("#eligib_dtl_modal").modal("show")
                }
                else { console.log(d.data.message) }
            })

        }


    }

    //Return Button to cApplicantsReview
    s.ReturnToApplicantReview = function () {
        window.location.href = "/cApplicantsReview/";
    }

})


