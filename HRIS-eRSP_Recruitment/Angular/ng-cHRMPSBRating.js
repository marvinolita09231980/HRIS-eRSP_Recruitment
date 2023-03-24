


ng_eRSP_App.controller("cHRMPSBRating_Ctrlr", function (commonScript, $scope, $http, $filter, $compile, $window) {
    var s = $scope
    var h = $http
    var cs = commonScript
    s.indv_image = ""
    s.empl_id = ""
    s.rateinfo=false
    s.competencies_required = ""
    s.psb_temp = []
    s.items_raw = []
    s.items= []
    s.screening = false
    s.screenicon = ""
    s.rowLen = "8"
    s.exam_score = ""
    s.competency = ""
    s.totalrating = ""
    s.rank = ""
    s.app_ctrl_nbr = ""
    s.psb_ctrl_nbr = ""
    s.psb_status = 0
    s.psb_list = []
    s.datasource = []
    s.total_rating = [] 
    s.sp_slide_rating = []
    s.psbsched_item = []
    s.slideInnerText = []
    s.cbrating = []
    s.psb = []
    s.psb_ctrl_nbr_active = ""
    s.profile_img = ""
    s.show_details = false
    s.panel_not_authorize = false
    s.um = {}
    s.educdetails = []
    s.eligdetails = []
    s.lnddetails  = []
    s.wexpdetails = []
    s.zoomcred = ""
    //s.profile = {
    //      applicant_name: ""
    //    , app_status: ""
    //    , position_long_title: ""
    //    , app_address: ""
    //    , birth_date: ""
    //    , employment_type_descr: ""
    //    , gender_descr: ""
    //    , budget_description: ""
    //    , civil_status_descr: ""
    //    , department_name: ""
    //    , qs_education: ""
    //    , qs_work_experience: ""
    //    , qs_training: ""
    //    , qs_eligibility: ""
    //    , education_rating: ""
    //    , experience_rating: ""
    //    , training_rating: ""
    //    , eligibility_rating: ""
    //    , exam_rating: ""
    //    , empl_photo_img: ""
    //    , mobile_number: ""
    //    , email_add: ""
    //}

    s.profile = {}

   
    s.zoomcred = {}
    s.profile2 = {}

    s.dial = {
          qs001                 :""
        , qs002                 :""
        , qs003                 :""
        , qs004                 :""
        , cb005                 :""
        , cb006                 :""
        , cb007                 :""
    }
    s.slideRate = {
          R004                  : ""
        , R005                  : ""
        , R006                  : ""
        , R007                  : ""
        , R008                  : ""
        , R009                  : ""
        , R010                  : ""
    }
    s.ed = {
          educ_type             : ""
        , school_name           : ""
        , basic_educ_deg        : ""
        , period_from           : ""
        , period_to             : ""
        , highest_lvl_earned    : ""
        , year_graduated        : ""
        , schlr_acdmic_rcvd     : ""
    }
    s.el = {

          cscsrvc_ra1080        : ""
        , rating                : ""
        , examination_date      : ""
        , examination_place     : ""
        , number                : ""
        , validity_date         : ""


    }
    s.wx = {
          workexp_from          : ""
        , workexp_to            : ""
        , position_title        : ""
        , dept_agncy_offc_co    : ""
        , monthly_salary        : ""
        , salary_job_grade      : ""
        , appt_status           : ""
        , gov_srvc              : ""
    }
    s.ld = {
          learn_devt_title      : ""
        , learn_devt_from       : ""
        , learn_devt_to         : ""
        , no_of_hrs             : ""
        , learn_devt_type       : ""
        , conducted_by          : ""
    }
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
    s.AT = [{ id: 'JO', text: 'Job Order' }, { id: 'RE', text: 'Permanent' }, { id: 'CE', text: 'CASUAL' }]
    s.svc = [{ id: false, text: 'No' }, { id: true, text: 'Yes' }]
    //var Init_Applicant_Details_Grid = function (par_data) {
    //    s.Applicant_Details_Data = par_data
    //    s.Applicant_Details_Table = $('#datalist_grid').dataTable(
    //        {
    //            data: s.Applicant_Details_Data,
    //            sDom: 'rt<"bottom"p>',
    //            pageLength: 10,
    //            columnDefs: [{

    //                orderable: false
    //            }],
    //            columns: [
    //                {

    //                    "mData": "seq_no",
    //                    "mRender": function (data, type, full, row) {
    //                        return '<span class="text-left btn-block tabtxt">' + data + '</span>'

    //                    }
    //                },
    //                {

    //                    "mData": "education",
    //                    "mRender": function (data, type, full, row) {
    //                        return '<span style="width:90%;" class="text-left btn-block tabtxt pull-left">' + data + '</span>' +
    //                            '<span style="width:10%;" class="pull-right"><button ng-hide="' + cs.elEmpty(data) + '"  type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',1)" >  <i class="fa fa-edit"></i></button ></span>'
    //                    }
    //                },
    //                {

    //                    "mData": "training",
    //                    "mRender": function (data, type, full, row) {
    //                        return '<span style="width:90%;" class="text-left btn-block tabtxt pull-left">' + data + '</span>' +
    //                           '<span style="width:10%;" class="pull-right"><button ng-hide="' + cs.elEmpty(data) + '"  type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',2)" >  <i class="fa fa-edit"></i></button ></span>'
    //                    }
    //                },
    //                {

    //                    "mData": "experience",
    //                    "mRender": function (data, type, full, row) {
    //                        return '<span style="width:90%;" class="text-left btn-block tabtxt pull-left">' + data + '</span>' +
    //                            '<span style="width:10%;" class="pull-right"><button ng-hide="' + cs.elEmpty(data) + '"  type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',3)" >  <i class="fa fa-edit"></i></button ></span>'
    //                    }
    //                },

    //                {

    //                    "mData": "eligibility",
    //                    "mRender": function (data, type, full, row) {
    //                        return '<span style="width:90%;" class="text-left btn-block tabtxt pull-left">' + data + '</span>' +
    //                            '<span style="width:10%;" class="pull-right"><button ng-hide="' + cs.elEmpty(data) + '"  type="button" class="btn btn-info btn-sm action" ng-click="show_details_action(' + row["row"] + ',4)" >  <i class="fa fa-edit"></i></button ></span>'
    //                    }
    //                },

    //            ],

    //            "createdRow": function (row, data, index) {
    //                //$(row).addClass("dt-row");
    //                $compile(row)($scope);  //add this to compile the DOM
    //            },

    //        });

    //    $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    //}


    //var Init_PSB_Rating_Grid = function (par_data) {
    //    s.PSBRate_Data_List = par_data;
    //    s.PSBRate_Data_Table = $('#psbrating_table_Grid').dataTable(
    //        {
    //            data: s.PSBRate_Data_List,
    //            sDom: 'rt<"bottom"p>',
    //            pageLength: 10,
    //            //order: [[6, 'asc']],
    //            columns: [
    //                {
    //                    "mData": "app_ctrl_nbr",
    //                    "mRender": function (data, type, full, row) {
    //                        return "<span class='text-center btn-block'>" + data + "</span>"
    //                    }
    //                },
    //                {
    //                    "mData": "applicant_name",
    //                    "mRender": function (data, type, full, row) {
    //                        return "<span class='text-left btn-block'>" + data + "</span>"
    //                    }
    //                },
    //                {
    //                    "mData": "knowledge",
    //                    "mRender": function (data, type, full, row) {
    //                        return "<span class='text-center btn-block'>" + data + "</span>"
    //                    }
    //                },
    //                {
    //                    "mData": "skills",
    //                    "mRender": function (data, type, full, row) {
    //                        return "<span class='text-center btn-block'>" + data + "</span>"
    //                    }
    //                },
    //                {
    //                    "mData": "attitude",
    //                    "mRender": function (data, type, full, row) {

    //                        return "<span class='text-center btn-block'>" + data + "</span>"
    //                    }
    //                }
    //            ],
    //            "createdRow": function (row, data, index) {
    //                //$(row).addClass("dt-row");screening                    $compile(row)($scope);  //add this to compile the DOM
    //            },
    //        });
    //    $("div.toolbar").html('<b>Custom tool bar! Text/images etc.</b>');
    //}

    s.rateflag = function (r1, r2, r3) {
      
        if (r1 > 0 && r2 > 0 && r3 > 0) {
           return true
        }
        else {
            return false
        }
    }
    function init() {

        $("#itemfilter").select2().on('change', function (e) {
            s.filterlist()
        });

        cs.loading("show")
       
        //Init_Applicant_Details_Grid([]);
        //Init_PSB_Rating_Grid([])
       
        h.post("../cHRMPSBRating/Initialize").then(function (d) {
            s.items_raw = d.data.items
            cs.loading("hide")
           })
    }
    function show_detail()
    {
        var itm = $("#app_ctrl_nbr").val()
        
        if (!cs.elEmpty(itm))
        { 
            s.show_details = true
        }
        else
        {
            s.show_details = false
        }
        return s.show_details
    }
    init()

    s.ngfn_selectcsclevel = function (val) {
        console.log(s.items_raw)
        s.items = s.items_raw.filter(function (d) {
            return d.csc_level == val
        })
        console.log(s.items)    }

    s.getDialKnobValue = function (obj,form) {
        var retObject = obj
        for (var i = 0; i < retObject.length; i++) {
            retObject[i].psb_pnl_rating = $('#' + form + ' input.dial.m-r-sm.' + retObject[i].slide_id).val()
        }
        return retObject.filter(function (d) {
            return d.psb_cat_code == "002"
        })
    }

    Array.prototype.dialKnobValue = function (form) {
        var data = this;
        for (var i = 0; i < data.length; i++) {

            var d_val = data[i].psb_pnl_rating == 0 ? 1 : data[i].psb_pnl_rating;

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

    s.EditScore = function () {
        alert()
    }

    s.SaveRating = function () {
        var data = []

          data = s.getDialKnobValue(s.slideInnerText, "dial")
         
          h.post("../cHRMPSBRating/SaveRating", { dial: data }).then(function (d) {

              if(d.data.icon == "success")
              {
                  s.total_rating = d.data.total_rating
                  s.sp_slide_rating = d.data.sp_slide_rating
                  s.slideInnerText = d.data.sp_slide_rating;
                  s.slideInnerText.dialKnobValue("dial")
                  swal("Your rating is successfully saved", {icon:d.data.icon})
              }
              else
              {
                  swal(d.data.message, { icon: d.data.icon })
              }
         })
    }

    s.RefreshRating = function () {
       
        s.slideInnerText = s.sp_slide_rating;
      
        s.slideInnerText.dialKnobValue("dial")
    }

    s.show_details_action = function (row, dtl) {
        var dt = s.Applicant_Details_Data[row]
        var info_ctrl_nbr = dt.info_ctrl_nbr

        if (dtl == 1) {
            h.post("../cHRMPSBRating/showDetails", { info_ctrl_nbr: info_ctrl_nbr, seq_no: dt.educ_seq, detail: dtl }).then(function (d) {
                if (d.data.icon == "success") {
                    d.data.obj.populateFields(s.ed, 0)
                    $("#educ_dtl_modal").modal("show")
                }
                else {
                    console.log(d.data.message) 
                }
            })

        }
        else if (dtl == 2) {
            h.post("../cHRMPSBRating/showDetails", { info_ctrl_nbr: info_ctrl_nbr, seq_no: dt.lnd_seq, detail: dtl }).then(function (d) {
                if (d.data.icon == "success") {
                    d.data.obj.populateFields(s.ld, 0)
                    $("#lnd_dtl_modal").modal("show")
                }
            })
        }
        else if (dtl == 3) {
            h.post("../cHRMPSBRating/showDetails", { info_ctrl_nbr: info_ctrl_nbr, seq_no: dt.wexp_seq, detail: dtl }).then(function (d) {
                if (d.data.icon == "success") {
                    d.data.obj.populateFields(s.wx, 0)
                    $("#workexp_dtl_modal").modal("show")
                }
                else { 
                    console.log(d.data.message) 
                }
            })

        }                
        else if (dtl == 4) {
            h.post("../cHRMPSBRating/showDetails", { info_ctrl_nbr: info_ctrl_nbr, seq_no: dt.elig_seq, detail: dtl }).then(function (d) {
                if (d.data.icon == "success") {
                    d.data.obj.populateFields(s.el, 0)
                    $("#eligib_dtl_modal").modal("show")
                }
                else {
                    console.log(d.data.message)
                }
            })
        }
    }

   

    
    $('#panel_not_authorize_modal').on('hidden.bs.modal', function () {

        
        //h.post("../Login/logout").then(function (d) {
        //    if (d.data.success == 1) {
        //        location.href = "../Login/Index"
        //    }
        //})
    })


    //************************************// 
    //*** Print Score Sheet             
    //**********************************// 
    s.printScoreSheet = function (row_index) {
        var dt = s.datasource.filter(function (d) {
            return d.app_ctrl_nbr == s.app_ctrl_nbr
        })[0]
        
        cs.loading("show")
        var controller = "Reports";
        var action = "Index";
        var ReportName = "";
        var SaveName = "Crystal_Report";
        var ReportType = "inline";
        var ReportPath = "~/Reports/cryScoreSheet/";
        var sp = "sp_score_sheet_rpt"
        var parameters = "p_item_no," + dt.item_no + ",p_app_ctrl_nbr," + dt.app_ctrl_nbr + ",p_app_status," + dt.app_status + ",p_panel_user_id," + s.panel_user_id;
        ReportName = "cryScoreSheet";
        ReportPath = ReportPath + "" + ReportName + ".rpt";
    
        h.post("../cPrintScoreSheet/SetHistoryPage",).then(function (d) {
                location.href = "../" + controller + "/" + action + "?ReportName=" + ReportName
                    + "&SaveName=" + SaveName
                    + "&ReportType=" + ReportType
                    + "&ReportPath=" + ReportPath
                    + "&Sp=" + sp + "," + parameters
            });
    }

    //s.expandzoommodal = function () {
    //    $("#expandzoomframe").attr('src', 'https://zoom.us/wc/' + zoomcred.zoom_id + '/join?prefer=0&pwd=' + zoomcred.zoom_password); 

    //    $("#maxzoommeet").modal("show")
    //}

    s.btn_show_pds = function () {
        s.employee_name_print = 'PERSONAL DATA SHEET REPORT';

        var controller = "Reports";
        var action = "Index";
        var ReportName = "";
        var SaveName = "Crystal_Report";
        var ReportType = "inline";
        var ReportPath = "~/Reports/cryReorgApplReport/";
        var sp = "";
       var dataX = s.psb.filter(function (d) {
           return d.app_ctrl_nbr == s.app_ctrl_nbr
       })[0]
       //comsole.log(dataX)
        //return;
        ReportPath = "~/Reports/cryPDS/";
        ReportName = "cryPDSMain";
        ReportPath = ReportPath + "" + ReportName + ".rpt";
        sp = "sp_pds_rep,p_empl_id," + s.empl_id  + ",O";

        

        // *******************************************************
        // *** VJA : 2021-07-14 - Validation and Loading hide ****
        // *******************************************************
        //$("#modal_loading").modal({ keyboard: false, backdrop: "static" })
        cs.loading('show')
        var iframe = document.getElementById('iframe_print_preview');
        var iframe_page = $("#iframe_print_preview")[0];
        iframe.style.visibility = "hidden";

        s.embed_link = "../Reports/CrystalViewer.aspx?Params=" + ""
            + "&ReportName=" + ReportName
            + "&SaveName=" + SaveName
            + "&ReportType=" + ReportType
            + "&ReportPath=" + ReportPath
            + "&id=" + sp //+ parameters
       // console.log(s.embed_link)

        if (!/*@cc_on!@*/0) { //if not IE
            iframe.onload = function () {
                iframe.style.visibility = "visible";
                //$("#modal_loading").modal("hide")
                cs.loading('hide')
            };
        }
        else if (iframe_page.innerHTML()) {
            // get and check the Title (and H tags if you want)
            var ifTitle = iframe_page.contentDocument.title;
            if (ifTitle.indexOf("404") >= 0) {
                swal("You cannot Preview this Report", "There something wrong!", { icon: "warning" });
                iframe.src = "";
            }
            else if (ifTitle != "") {
                swal("You cannot Preview this Report", "There something wrong!", { icon: "warning" });
                iframe.src = "";
            }
        }
        else {
            iframe.onreadystatechange = function () {
                if (iframe.readyState == "complete") {
                    iframe.style.visibility = "visible";
                    //$("#modal_loading").modal("hide")
                    cs.loading('hide')
                }
            };
        }

        iframe.src = s.embed_link;
        $('#modal_print_preview').modal({ backdrop: 'static', keyboard: false });
        // *******************************************************
        // *******************************************************
    }


    s.filterlist = function () {
        var item = $("#itemfilter").val();
        cs.loading("show")
        console.log(item)
        h.post("../cHRMPSBRating/getPSBList2", { item: item }).then(function (d) {
            s.psb = d.data.psblist
            cs.loading("hide")
        })
    }
    s.screeningview = function (a) {
        s.screenicon = "screenicn_"+a
        s.screenicon.addSpinner("fa-heartbeat")
        //cs.loading("show")
            s.sp_slide_rating =[]
            s.educdetails =    []
            s.eligdetails =    []
            s.lnddetails =     []
            s.wexpdetails =    []
            s.cbrating =       []
       
        var data = s.psb.filter(function (d) {
            return d.app_ctrl_nbr == a
        })[0]
        s.empl_id = data.empl_id
        //s.empl_id = '8672'
        s.competencies_required = data.competency_required
        s.profile2 = data
        s.psb_ctrl_nbr = data.psb_ctrl_nbr
        s.app_ctrl_nbr = a
       
        h.post("../cHRMPSBRating/QSdetails", { app_ctrl_nbr: a, info_ctrl_nbr: data.info_ctrl_nbr, psb_ctrl_nbr: data.psb_ctrl_nbr }).then(function (d) {

            s.educdetails = d.data.educdetails
            s.eligdetails       = d.data.eligdetails
            s.lnddetails        = d.data.lnddetails
            s.wexpdetails       = d.data.wexpdetails
            s.cbrating          = d.data.cbrating 
            s.profile = d.data.reviewer_list[0];

            //setTimeout(function () {
            //    cs.loading("hide")
            //}, 500)

            s.screening = true
           
        })
        h.post("../cHRMPSBRating/getImage", { info_ctrl_nbr: data.info_ctrl_nbr }).then(function (d) {
            s.indv_image = d.data.image
        })
    }
   
    s.ratecbi = function (arg) {
      
        var disabled_rating = s.profile2.disabled_rating
        var title = ""
        if (disabled_rating) {
            swal("No Allowed!","Admin has disabled rating action for this applicant. Please contact HR - Recruitment, Selection and Placement Section ", {icon:"error"})
            return 
        }
        var psb_ctrl_nbr = s.psb_ctrl_nbr
        var app_ctrl_nbr = s.app_ctrl_nbr
        var psb_pnl_rating = 0
        var psb_cat_subcode = ""
        var maxvalue = ""
        if (arg == "knowledge") {
            psb_cat_subcode = "005"
            maxvalue = "Maximum value - 40"
            title = "Rate Knowledge"
        }
        else if (arg == "skills") {
            psb_cat_subcode = "006"
            maxvalue = "Maximum value - 30"
            title = "Rate Skills"
        }
        else if (arg == "attitude") {
            psb_cat_subcode = "007"
            maxvalue = "Maximum value - 30"
            title = "Rate Attitude"
        }
            swal({
                title: title,
                text: maxvalue,
                content: "input",
                closeOnClickOutside: false,
                showCancelButton: true,
                cancelButtonText: "Cancel",
                buttons: [
                    "Cancel", /* showCancelButton: true, cancelButtonText: "No", */
                    "Save" /* confirmButtonText: "Yes", */
                ],
                //button: {
                //    text: "Save",
                //    closeModal: false,

                //},
            }).then(input => {
               
                var noerr = false
                if (isNaN(input) || input == "") {
                    swal("Score invalid", { icon: "error" })
                   
                    throw null;
                } else {
                   
                    if (input != null) {
                        psb_pnl_rating = input
                        if (psb_cat_subcode == "005") {
                          
                            if (parseInt(psb_pnl_rating) < 0 || parseInt(psb_pnl_rating) > 40) {
                                noerr = false
                                throw "005"
                            }
                            else {
                                noerr = true
                            }
                            
                        }
                        else if (psb_cat_subcode == "006") {
                            if (parseInt(psb_pnl_rating) < 0 || parseInt(psb_pnl_rating) > 30) {
                                throw "006"
                            }
                            else {
                                noerr = true
                            }

                        }
                        else if (psb_cat_subcode == "007") {
                            if (parseInt(psb_pnl_rating) < 0 || parseInt(psb_pnl_rating) > 30) {
                                throw "006"
                            }
                            else {
                                noerr = true
                            }

                        }
                        if (noerr) {
                            h.post("../cHRMPSBRating/ratecbi",
                                { psb_ctrl_nbr: psb_ctrl_nbr, app_ctrl_nbr: app_ctrl_nbr, psb_pnl_rating: psb_pnl_rating, psb_cat_subcode: psb_cat_subcode }).then(function (d) {
                                    if (d.data.icon == "success") {
                                        s.cbrating = d.data.cbrating
                                        swal("Knowledge Rating", "Successfully Save", { icon: "success", timer: 3000 });

                                        if (psb_cat_subcode == "005") {
                                            s.psb = s.psb.editKnw(app_ctrl_nbr, psb_pnl_rating)
                                        }
                                        else if (psb_cat_subcode == "006") {
                                            s.psb = s.psb.editSkl(app_ctrl_nbr, psb_pnl_rating)
                                        }
                                        else if (psb_cat_subcode == "007") {
                                            s.psb = s.psb.editAtt(app_ctrl_nbr, psb_pnl_rating)
                                        }
                                    }
                                    else {
                                        throw "error"

                                    }
                                  
                                })
                        }
                       
                    }
                   
                }
            })
                .catch(err => {
                  
                    if (err == "005") {
                        swal("Error:Invalid value!", "Value must be lower than 40 and greater than 0", "error");
                    }
                    else if (err == "006") {
                        swal("Error:Invalid value!", "Value must be lower than 30 and greater than 0", "error");
                    }
                    else if (err == "000") {
                        swal("Knowledge Rating", "Successfully Save", { icon: "success", timer: 1000 });
                    }
                    else if (err == "001") {
                        swal("Error!", "The saving request failed!", { icon: "error", timer: 1000 });
                    }
                    else {
                        swal("Error!", "The saving request failed!", "error");
                        swal.stopLoading();
                        swal.close();
                    }

                   
                
            });
        
        
    }
    Array.prototype.editKnw = function (app,val) {
        var arr = this
        for (var x = 0; x < arr.length; x++) {
            if (arr[x].app_ctrl_nbr == app) {
                arr[x].knowledge_rate = val
            }
        }
        return arr
    }

    Array.prototype.editSkl = function (app, val) {
        var arr = this
        for (var x = 0; x < arr.length; x++) {
            if (arr[x].app_ctrl_nbr == app) {
                arr[x].skill_rate = val
            }
        }
        return arr
    }

    Array.prototype.editAtt = function (app, val) {
        var arr = this
        for (var x = 0; x < arr.length; x++) {
            if (arr[x].app_ctrl_nbr == app) {
                arr[x].attitude_rate = val
            }
        }
        return arr
    }
    s.backbtn = function () {
       
        s.screenicon.removeSpinner("fa-heartbeat")
        s.screening = false
        s.profile = []
        s.d = []
       
    }

    s.reloadlist = function() {
        var item = $("#itemfilter").val();
        cs.loading("show")
        h.post("../cHRMPSBRating/getPSBList2", { item: item }).then(function (d) {
            s.psb = d.data.psblist
            setTimeout(function () {
                cs.loading("hide")
            }, 2000)
            

        })
    }

})


ng_eRSP_App.filter("filtertext", function () {
    return function (input) {
        var str = ""
        if (input == "" || input == null || input == undefined) {
            
            return "" 
        }
        else {
            var split = input.split(",")

            for (var x = 0; x < split.length; x++) {

                if (split[x].toUpperCase().trim() == "SELECT HERE" || split[x].toUpperCase().trim() == "N/A") {

                }
                else {
                    if (x == (split.length - 1)) {
                        str = str + split[x]
                    }
                    else {
                        str = str + split[x] + ", "
                    }
                }
            }
            return str
        }
        
    };
});

ng_eRSP_App.filter("civilStatus", function () {
    return function (input) {
     
        if (input == "" || input == null || input == undefined) {
            return ""
        }
        else {
            if (input.toUpperCase() == "S")
                return "Single"
            else if (input.toUpperCase() == "M")
                return "Married"
            else if (input.toUpperCase() == "W")
                return "Widowed"
            else return ""
        }
    };
});

ng_eRSP_App.filter("cbiKnowledge", function () {
    return function (input) {
        for (var x = 0; x < input.length; x++) {
            if (input[x].psb_cat_subcode == "005") {
                return input[x].psb_pnl_rating
            }
        }
    };
});

ng_eRSP_App.filter("cbiskills", function () {
    return function (input) {
        for (var x = 0; x < input.length; x++) {
            if (input[x].psb_cat_subcode == "006") {
                return input[x].psb_pnl_rating
            }
        }
    };
});

ng_eRSP_App.filter("cbiattitude", function () {
    return function (input) {
        for (var x = 0; x < input.length; x++) {
            if (input[x].psb_cat_subcode == "007") {
                return input[x].psb_pnl_rating
            }
        }
    };
});

ng_eRSP_App.filter("cbiaveragerating", function () {
    return function (cbrating) {
        var average = 0
        var total = 0
        for (var x = 0; x < cbrating.length; x++) {
            if (cbrating[x].psb_cat_subcode == "005") {
                total = total + cbrating[x].psb_pnl_rating
            } else if (cbrating[x].psb_cat_subcode == "006") {
                total = total + cbrating[x].psb_pnl_rating
            }
            else if (cbrating[x].psb_cat_subcode == "007") {
                total = total + cbrating[x].psb_pnl_rating
            }
        }
       
        return total.toString()
    };
});

ng_eRSP_App.filter("cbiratingTotal", function () {
    return function (data) {
        var average = 0
        var total = parseFloat(data.knowledge_rate) + parseFloat(data.skill_rate) + parseFloat(data.attitude_rate);
        return total
    };
});

ng_eRSP_App.filter("qsaveragerating", function () {
    return function (profile) {
        var average = 0
        var total = profile.education_rating + profile.experience_rating + profile.training_rating + profile.eligibility_rating    
       
        return total.toString()
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


ng_eRSP_App.directive("pageOnload", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            element.bind('load', function () {
              
                cs.loading("hide")
            });

        }
    };
}]);





