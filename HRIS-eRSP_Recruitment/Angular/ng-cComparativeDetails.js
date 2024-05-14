


ng_eRSP_App.controller("cComparativeDetails_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript
    var c = commonScript
    var psb_ctrl_nbr = ""
    var item_no      = ""
    var budget_code     =""
    var employment_type =""
    var salary_grade = ""
    var ranked = false
    var summernote = $('#summernote2').summernote();
    s.applicant = ""
    s.is = ""
    var row_for_email = ""
    var type_for_email = ""

    s.forComparative_temp_list = []
    s.emailreceipent = ""

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



    function changefa(val) {
        if (val == "4") {
            return "fa-check"
        }
        else if (val == "5") {
            return "fa-trophy"
        }
        else {
            return "fa-plus"
        }
    }

    function HSAD(data) { //IF ALREADY SELECTED ITEM DISABLE BUTTON
        if (data) {
            return "disabled"
        }
        else {
            return ""
        }
    }

    var Init_PSB_List_Grid = function (par_data) {
        s.Data_List = par_data;
        s.Data_Table = $('#Data_List_Grid').dataTable(
            {
                data: s.Data_List,
                sDom: 'rt<"bottom"p>',
                pageLength: 10,
                //order: [[0, 'asc']],
                columns: [
                    {
                        "mData": "applicants_name",
                        "mRender": function (data, type, full, row) {
                            return "<span><b>" + full["last_name"] + "</b>, &nbsp;&nbsp;" + full["first_name"] + "</span>"+
                                "<br><span>" + full["position_long_title"]  + "</span>"
                        }
                    },
                    {
                        "mData": "gender",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block' style='text-transform:uppercase'><strong>" + data + "</strong></span>"
                        }
                    },

                    {
                        "mData": "education",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-left btn-block' style='text-transform:uppercase'><strong>" + data + "</strong></span>"
                        }
                    },
                    {
                        "mData": "lnd",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'><strong>" + data + "</strong></span>"
                        }
                    },
                    {
                        "mData": "experience",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'><strong>" + data + "</strong></span>"
                        }
                    },
                    {
                        "mData": "eligibility",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'><strong>" + data + "</strong></span>"
                        }
                    },
                    {
                        "mData": "qs_total_100perc",
                        "mRender": function (data, type, full, row) {
                            return "<span class='text-center btn-block'><strong>" + data + "</strong></span>"
                        }
                    },
                    {
                        "mData": "qs_rating",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'><strong>" + data + "</strong></span>"
                        }
                    },
                    {
                        "mData": "exam_100perc",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'><strong>" + data + "</strong></span>"
                        }
                    },
                    {
                        "mData": "exam_rating",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'><strong>" + data + "</strong></span>"
                        }
                    },
                    {
                        "mData": "cbi_100rating",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'><strong>" + data + "</strong></span>"
                        }
                    },
                    {
                        "mData": "cbi_rating",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'><strong>" + data + "</strong></span>"
                        }
                    },
                    {
                        "mData": "total_rating",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'><strong>" + data + "</strong></span>"
                        }
                    },
                    {
                        "mData": "applicant_rank",
                        "mRender": function (data, type, full, row) {

                            return "<span class='text-center btn-block'><strong>" + data + "</strong></span>"
                        }
                    },
                    {
                        "mData": "app_status",
                        "mRender": function (data, type, full, row) {
                            return '<div>' +
                                '<input id="toComparativeCbRow' + row["row"] + '"  align="left"  type="checkbox" class="form-control pull-left" ng-click="addToComparative5CB(' + row["row"] + ')" ng-checked="' + inComparative(data) + '" ng-disabled="' + inComparative(data)+'"/>' +
                                '</div>';
                        }
                    },
                    {
                        "mData": "app_status",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<div>' +
                                //'<button  type="button" class="btn btn-danger btn-sm action chkbox" ng-click="remove_comparative(' + row["row"] + ')" ' + HSAD(full["hasSelected_approved"]) + '><i class="fa fa-times"></i></button >' +
                                //'<button  type="button" class="btn btn-info btn-sm action chkbox" ng-click="approved_comparative(' + row["row"] + ')" ' + HSAD(full["hasSelected_approved"]) + '><i class="fa ' + changefa(data) + '"></i></button >' +
                                
                                
                                '<div class="btn-group pull-left">' +
                                '<button class="btn btn-warning dropdown-toggle" type="button" data-toggle="dropdown" data-placement="top" title="Click for more action"><i class="fa fa-paper-plane"></i></button>' +
                                '<ul class="dropdown-menu ">' +
                                '<li><a ng-click="sendEmailNotification(' + row["row"] + ',7)">Congratulatory Email</a></li>' +
                                '<li><a ng-click="sendEmailNotification(' + row["row"] + ',4)">Regret Email</a></li>' +
                                '<li><a ng-click="printEmailNotif(' + row["row"] + ',7)">Print Congratulatory Letter</a></li>' +
                                '<li><a ng-click="printEmailNotif(' + row["row"] + ',4)">Print Regret Letter</a></li>' +
                                '</ul>' +
                                '</div>' +
                                //'<div class="btn-group">' +
                                //'<button class="btn btn-success btn-sm action chkbox dropdown-toggle" type="button" data-toggle="dropdown" data-placement="top" title="Click for more action"><i class="fa fa-info"></i></button>' +
                                //'<ul class="dropdown-menu ">' +
                                //'<li><a ng-click="setEndorseDate(' + row["row"] + ',7)">Set Endorse Date</a></li>' +

                                //'</ul>' +
                                //'</div>' +
                                '</div>';
                        }
                    },
                    {
                        "mData": "app_status",
                        "bSortable": false,
                        "mRender": function (data, type, full, row) {
                            return '<div>' +
                                '<button id="includeRow' + row["row"] + '" class="btn ' + comparativeAddClassColor(data)+'" type="button" ng-click="approved_comparative(' + row["row"] + ')">'+
                                '<i class="fa ' + comparativeAddClassIcon(data) +'"></i></button > ' +
                                '</div>';
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

    function inComparative(data) {
      
        if (parseInt(data) >= 4) {
            console.log(parseInt(data))
            return true
        }
        else {
            return false
        }
    }
    function comparativeAddClassIcon(data) {

        if (parseInt(data) >= 4) {
            return "fa-times" 
        }
        else {
            return "fa-arrow-right" 
        }
    }
    function comparativeAddClassColor(data) {

        if (parseInt(data) >= 4) {
            return "btn-danger"
        }
        else {
            return "btn-info"
        }
    }


    Init_PSB_List_Grid([])

    function init() {
        cs.loading("show")
        h.post("../ComparativeDetails/Initialize").then(function (d) {
            if (d.data.icon == "success") {
                console.log(d.data.comparative)
                psb_ctrl_nbr = d.data.psb_ctrl_nbr 
                item_no = d.data.item_no      
                budget_code     = d.data.budget_code    
                employment_type = d.data.employment_type
                salary_grade = d.data.salary_grade
                ranked = d.data.ranked
                cs.loading("hide")
                if (d.data.comparative == 0) {
                    swal({
                        title: "No applicants for this item have proceeded to the Comparative stage",
                        text: "",
                        icon: "error",
                        showCancelButton: false,
                        dangerMode: true,
                    }).then(function (ok) {
                        if (ok) {
                            window.history.go(-1);
                        }
                    });
                  
                   
                } else {
                  //  console.log(d.data.comparative)
                    s.Data_List = d.data.comparative.refreshTable("Data_List_Grid", "")
                }
                
               
            } else {
                cs.loading("hide")
                swal({
                    title: d.data.message,
                    text: "",
                    icon: "error",
                    showCancelButton: false,
                    dangerMode: true,
                }).then(function (ok) {
                    if (ok) {
                        window.history.go(-1);
                    }
                });
                
            }
        })
        $("#addToComparativeBtn").addClass("hidden")
    }


    

    init()

    s.approved_comparative = function (row) {
        var dt = s.Data_List[row]

        var app_status = parseInt(dt.app_status)
        if (app_status < 4) {


            swal({
                title: "Add to endorsement list!",
                text: "",
                icon: "info",
                buttons: true,
                dangerMode: true,
            })
                .then(function (ok) {
                    if (ok) {
                        cs.loading("show")
                        h.post("../cComparativeAssessment/approved_comparative",
                            {
                                  app_ctrl_nbr          : dt.app_ctrl_nbr
                                , approval_id           : dt.approval_id
                                , psb_ctrl_nbr          : dt.psb_ctrl_nbr
                                , item_no               : dt.item_no
                                , hasSelected_approved  : dt.hasSelected_approved

                            }).then(function (d) {
                                if (d.data.icon == "success") {
                                    swal("Successfully Added for Indorsement", { icon: "success", timer: 1500 })
                                    s.Data_List[row].app_status = d.data.app_status
                                    s.Data_List = s.Data_List.refreshTable("Data_List_Grid", "")
                                    //s.get_sp_psb_item_list(dt.psb_ctrl_nbr)
                                    cs.loading("hide")
                                }
                                else {
                                    cs.loading("hide")
                                }
                            });
                    }

                });

        }
        else {
            swal({
                title: "Remove from endorsement list!",
                text: "",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then(function (remove) {
                    if (remove) {
                        cs.loading("show")
                        h.post("../cComparativeAssessment/remove_comparative",
                            {
                                  app_ctrl_nbr: dt.app_ctrl_nbr
                                , approval_id: dt.approval_id
                                , psb_ctrl_nbr: dt.psb_ctrl_nbr
                                , item_no: dt.item_no
                                , hasSelected_approved: dt.hasSelected_approved

                            }).then(function (d) {
                                if (d.data.icon == "success") {
                                    swal("Successfully Remove Indorsement", { icon: "warning", timer: 1500 })
                                    s.Data_List[row].app_status = d.data.app_status
                                    s.Data_List = s.Data_List.refreshTable("Data_List_Grid", "")
                                    //s.get_sp_psb_item_list(dt.psb_ctrl_nbr)
                                    cs.loading("hide")
                                }
                                else {
                                    cs.loading("hide")
                                }
                            });
                    }

                });
        }
    }

    s.addToComparative5CB = function (row) {
       
        var dt = s.Data_List[row]
        var cbrow = $("#toComparativeCbRow" + row)[0].checked
        if (cbrow) {
            var ex = s.forComparative_temp_list.filter(function (d) {
                return d.app_ctrl_nbr == dt.app_ctrl_nbr
            })
            if (ex.length == 0) {

                s.forComparative_temp_list.push(
                    {
                       "app_ctrl_nbr"           :dt.app_ctrl_nbr
                      ,"approval_id"            :dt.approval_id
                      ,"psb_ctrl_nbr"           :dt.psb_ctrl_nbr
                      ,"item_no"                :dt.item_no
                      ,"hasSelected_approved"   :dt.hasSelected_approved
                    }
                )
            }
        }
        else {
            s.forComparative_temp_list = s.forComparative_temp_list.filter(function (d) {
                return d.app_ctrl_nbr != dt.app_ctrl_nbr
            })
        }

        if (s.forComparative_temp_list.length > 0) {
            $("#addToComparativeBtn").removeClass("hidden")
        }
        else {
            $("#addToComparativeBtn").addClass("hidden")
        }
    }

    s.approvedComparativeAll = function () {
        var dt = s.forComparative_temp_list

        cs.loading("show")

        h.post("../cComparativeAssessment/approvedComparativeAll",
            {
              data:dt

            }).then(function (d) {
                if (d.data.icon == "success") {
                    swal("Successfully Added for Indorsement", { icon: "success", timer: 1500 })
                    s.Data_List = d.data.comparative.refreshTable("Data_List_Grid", "")
                    cs.loading("hide")
                }
                else {
                    swal(d.data.message, {icon:d.data.icon})
                    cs.loading("hide")
                }
            });

       
       
    }

    


    //s.get_sp_psb_item_list = function (psb_ctrl_nbr) {
    //    h.post("../cComparativeAssessment/sp_psb_item_list",
    //        {
    //            psb_ctrl_nbr: psb_ctrl_nbr,
    //        }).then(function (d) {
    //            if (d.data.icon == "success") {
                
    //                s.sp_psb_item_list = d.data.sp_psb_item_list
    //                s.item_grid_List = d.data.sp_psb_item_list.refreshTable("Data_item_Grid", psb_ctrl_nbr)

    //            } else {
    //                console.log(d.data.message)

    //            }
    //        })

    //}




    s.printComparative = function () {
       

        //if (dt.screen_item < 1) {
        //    swal("Warning!", "No data for this item!", { icon: "warning" })
        //    return
        //}

        var reporttype = "3"

        s.employee_name_print = 'COMPARATIVE ASSESSMENT REPORT';
       
        var ReportName = "cryComparative";
        var SaveName = "Crystal_Report";
        var ReportType = "inline";
        var ReportPath = "~/Reports/cryComparative/";
        var sp = "";

        ReportPath = ReportPath + "" + ReportName + ".rpt";

        if (ranked) {
            sp = "sp_comaparative_asessment_rpt_ranked,p_item_no," + item_no + ",p_psb_ctrl_nbr," + psb_ctrl_nbr + ",p_app_status," + reporttype;
        } else {
            sp = "sp_comaparative_asessment_rpt,p_item_no," + item_no + ",p_psb_ctrl_nbr," + psb_ctrl_nbr + ",p_app_status," + reporttype;
        }
       

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
        console.log(s.embed_link)
        if (!/*@cc_on!@*/0) { //if not IE
            iframe.onload = function () {
                iframe.style.visibility = "visible";
                cs.loading('hide')
            };
        }
        else if (iframe_page.innerHTML()) {
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
    }


    s.prepareEndorsement = function () {
        cs.loading('show')
       
        h.post("../ComparativeDetails/GetEndorseList", {
              item_no: item_no
            , budget_code: budget_code
            , employment_type: employment_type
            , ranked: ranked
        }).then(function (d) {
            if (d.data.icon == "success") {
                var apps = d.data.apps
                console.log(apps)
                if (apps.length > 0) {
                    s.endorse_position = apps[0].position_long_title
                    s.endorse_item_no = d.data.endorse_item_no
                    s.endorse_department_name1 = apps[0].department_name1
                    s.endorse_salary_grade = salary_grade
                    s.endorse_psb_ctrl_nbr = psb_ctrl_nbr

                    h.post("../cComparativeAssessment/prepareEndorsement", {
                          psb_ctrl_nbr: psb_ctrl_nbr
                        , item_no: apps[0].item_no
                        , ranked: ranked
                    }).then(function (d) {
                        if (d.data.icon == "success") {
                           
                            if (d.data.endorse.length > 1) {
                                s.applicant = "applicants"
                                s.is = "are"
                            }
                            else {
                                s.applicant = "applicant"
                                s.is = "is"
                            }
                            s.endorse_list = d.data.endorse
                            $("#prepareEndorsement").modal("show")
                        }
                        else {
                            swal(d.data.message, { icon: d.data.icon })
                        }
                        cs.loading('hide')
                    })
                }
                else {
                    swal("Warning!", "No applicants has proce!", { icon: "warning" })
                    cs.loading('hide')
                }
            }
            else {
                swal(d.data.message, { icon: d.data.icon })
            }
            cs.loading('hide')
        })

       

       
    }


    s.printEmailNotif = function (row_id, type) {
      
        var dt = s.Data_List[row_id]
        var email = ""
        var empl_id = ""
        var app_ctrl_nbr = ""
        var hiring_period = ""

        console.log(dt)

        s.employee_name_print = 'EMAIL REPORT';
        var SaveName = "Crystal_Report";
        var ReportType = "inline";
        var ReportPath = "~/Reports/cryEmailPrinting/";
        var ReportName = "";
        var sp = "";

        email = dt.email
        empl_id = dt.empl_id
        app_ctrl_nbr = dt.app_ctrl_nbr
        hiring_period = dt.hiring_period

        if (type == "4") {
            swal_title = "Send Acknowledgement Email"

            ReportName = "cryNotifRegret";
            
        } else if (type == "7") {

            swal_title = "Not Qualified for Examination Email"

            ReportName = "cryNotifCongratulatory";

        }

        if (dt.email == "" || dt.email == null) {
            swal({ title: "This applicant has not provided an email address", icon: "error" })
            cs.loading("hide")
            return
        }


        ReportPath = ReportPath + "" + ReportName + ".rpt";
        sp = "sp_send_email_notification_PRINT,p_email," + email + ",p_empl_id," + empl_id + ",p_app_ctrl_nbr," + app_ctrl_nbr + ",p_hiring_period," + hiring_period + ",p_email_type," + type;

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
        console.log(s.embed_link)
        if (!/*@cc_on!@*/0) { //if not IE
            iframe.onload = function () {
                iframe.style.visibility = "visible";
                cs.loading('hide')
            };
        }
        else if (iframe_page.innerHTML()) {
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
    }



    s.printEndorsement = function () {

        if (!cs.validatesubmit("endorseForm")) {
            return
        }

        var endorse_date = $("#endorse_dt").val()
        var endorse_by = $("#endorse_by").val()

        var reporttype = "4"

        s.employee_name_print = 'ENDORSEMENT REPORT';
        //var item_no = item_no
        //var psb_ctrl_nbr = psb_ctrl_nbr
        var endorse_no = "";
        var ReportName = "cryEndorsement";
        var SaveName = "Crystal_Report";
        var ReportType = "inline";
        var ReportPath = "~/Reports/cryEndorsement/";

        console.log(psb_ctrl_nbr)
        console.log(item_no)

        var sp = "";
       

        ReportPath = ReportPath + "" + ReportName + ".rpt";
        if (ranked) {
            sp = "sp_endorsement_list_rpt_ranked,p_item_no," + item_no + ",p_psb_ctrl_nbr," + psb_ctrl_nbr + ",p_app_status," + reporttype + ",p_endorse_no," + endorse_no;
        } else {
            sp = "sp_endorsement_list_rpt,p_item_no," + item_no + ",p_psb_ctrl_nbr," + psb_ctrl_nbr + ",p_app_status," + reporttype + ",p_endorse_no," + endorse_no;
        }
      

        cs.loading('show')

        h.post("../cComparativeAssessment/printEndorsement", {
              psb_ctrl_nbr: psb_ctrl_nbr
            , item_no: item_no
            , endorse_date: endorse_date
            , endorse_by: endorse_by
        }).then(function (d) {

            if (d.data.icon == "success") {
                var iframe = document.getElementById('iframe_print_preview');

                var iframe_page = $("#iframe_print_preview")[0];

                iframe.style.visibility = "hidden";

                s.embed_link = "../Reports/CrystalViewer.aspx?Params=" + ""
                    + "&ReportName=" + ReportName
                    + "&SaveName=" + SaveName
                    + "&ReportType=" + ReportType
                    + "&ReportPath=" + ReportPath
                    + "&id=" + sp //+ parameters
                console.log(s.embed_link)
                if (!/*@cc_on!@*/0) { //if not IE
                    iframe.onload = function () {
                        iframe.style.visibility = "visible";
                        cs.loading('hide')
                    };
                }
                else if (iframe_page.innerHTML()) {
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

                //s.item_grid_List[s.selectedRow].endorsement_date = endorse_date
                //tab_table_data(s.item_grid_List)
            }
            else {
                swal(d.data.endorse.db_message, { icon: d.data.icon })
            }
        })




    }

    s.sendEmailNotification = function (row_id, type) {
        cs.loading("show")
        row_for_email = row_id
        type_for_email = type

        var dt = s.Data_List[row_id]

        var swal_title = ""
        var swal_text = ""

        if (type == "1") {
           
            swal_title = "Send Acknowledgement Email"
            swal_text = "Are you sure you want to send an acknowledgement email to this applicant? Please double-check your action!"


        } else if (type == "2") {

          
            swal_title = "Not Qualified for Examination Email"
            swal_text = "Are you sure you want to inform this applicant that they did not qualify for the examination? Please double-check your action!"


        } else if (type == "3") {
            
            swal_title = "Qualified for Online Examination Email"
            swal_text = "Are you sure you want to inform this applicant that they qualify for the examination? Please double-check your action!"

        } else if (type == "4") {
           
            swal_title = "Send Regret Email"
            swal_text = "Are you sure you want to send a regret email to this applicant? Please double-check your action!"


        } else if (type == "5") {
            
            swal_title = "Notify For HRMPSB Screening"
            swal_text = "Are you sure you want to notify this applicant that they are included for the HRMPSB Screening? Please double-check your action!"

        } else if (type == "6") {
            
            swal_title = "Notify not in top 5 Examinees"
            swal_text = "Are you sure you want to notify this applicant that they are not in the top 5 examinees? Please double-check your action!"
        }
        else if (type == "7") {

            swal_title = "Send Congratulatory Email"
            swal_text = "Are you sure you want to send a congratulatory letter to this applicant? Please double-check your action!"
        }
        

        if (dt.email == "" || dt.email== null) {
            swal({ title: "This applicant has not provided an email address", icon: "error" })
            cs.loading("hide")
            return
        }

        s.emailreceipent = dt.email


        if (type == "1" && dt.email_aknowldge_dttm != "") {

            swal_title = "You have already sent an acknowledgment email for this applicant"
            swal_text = "Would you like to resend this notification?"

        } else if (type == "2" && dt.email_aknowldge_regret_dttm != "") {


            swal_title = "You have already sent a notification email to this applicant indicating that they were not qualified for the position"
            swal_text = "Would you like to resend this notification?"

        } else if (type == "3" && dt.email_noti_exam_dttm != "") {

            swal_title = "You have already sent a notification email to this applicant regarding the schedule of the online examination"
            swal_text = "Would you like to resend this notification?"

        } else if (type == "4" && dt.email_regret_dttm != "") {

            swal_title = "You have already sent a regret email to this applicant"
            swal_text = "Would you like to resend this notification?"

        } else if (type == "5" && dt.email_noti_hrmpsb_dttm != "") {

            swal_title = "You have already sent a notification email to this applicant regarding the screening schedule"
            swal_text = "Would you like to resend this notification?"

        } else if (type == "6" && dt.email_notintop5_dttm != "") {

            swal_title = "You have already sent a notification email to this applicant indicating that they are not included in the top 5 examinees"
            swal_text = "Would you like to resend this notification?"
        }
        else if (type == "7" && dt.email_congratulatory_dttm != "") {

            swal_title = "You have already sent a congratulatory to this applicant!"
            swal_text = "Would you like to resend this notification?"
        }



        h.post("../ComparativeDetails/GetEmailNotification2", {
              dt: dt
            , email_type: type
        }).then(function (d) {
            cs.loading("hide")
            if (d.data.icon == "success") {
                swal({
                    title: swal_title,
                    text: swal_text,
                    icon: "info",
                    buttons: ["No", "Yes"],
                    dangerMode: true,
                }).then(function (yes) {
                    if (yes) {
                        
                        
                        s.email_settup = d.data.email_settup
                        console.log(d.data.email_settup.email_body)
                        summernote.code(d.data.email_settup.email_body)
                        $("#sendnotif_modal").modal("show")
                        cs.loading("hide")
                    }
                });
            }
            else {
                swal({ title: d.data.message, icon: d.data.icon })

            }
        })



    }




    s.sendEmailNotification2 = function () {


        var row_id = parseInt(row_for_email);
        var type = parseInt(type_for_email);
        var dt = s.Data_List[row_id]
        var data = []
        var email_data = s.email_settup

        $("#btnsendemailicon").removeClass('fa fa-send');
        $("#btnsendemailicon").addClass("fa fa-spinner fa-spin");
        $("#buttonsendemail").prop("disabled", true);
        $("#buttonsendemailcancel").prop("disabled", true);


        email_data.email_body = summernote.code()



        h.post("../ComparativeDetails/sendEmailNotification2", {
            dt: dt
            , email_type: type
            , email_settup: email_data
        }).then(function (d) {


            var se = d.data.se
            if (d.data.se != undefined) {
                s.Data_List[row_id].email_regret_dttm = se.email_regret_dttm
                s.Data_List[row_id].email_congratulatory_dttm = se.email_congratulatory_dttm
            }


            //setTimeout(function () {
            //    s.Data_List.refreshTable("Data_List_Grid","");
            //}, 500)



            swal({ title: d.data.message, icon: d.data.icon })


            $("#btnsendemailicon").removeClass("fa fa-spinner fa-spin");
            $("#btnsendemailicon").addClass('fa fa-send');
            $("#buttonsendemail").prop("disabled", false);
            $("#buttonsendemailcancel").prop("disabled", false);
        })

    }



    //s.sendEmailNotification = function (row_id, type) {

    //    var dt = s.Data_List[row_id]
    //    var swal_title = ""
    //    var swal_message = ""


    //    if (dt.email == "" || dt.email == null) {
    //        swal("This applicant has not provided email address", { icon: "error" })
    //        return
    //    }


    //    if (type == "4") {
    //        if (dt.email_regret_dttm != "") {
    //            swal("You have already sent regret email for this applicant", { icon: "error" })
    //            return
    //        }
    //        swal_title = "Send Regret Email"
    //        swal_message = "Are you sure you want to send this applicant a regret email? Please double check you action!"
    //    }

    //    if (type == "7") {
    //        if (dt.email_congratulatory_dttm != "") {
    //            swal("You have already sent Congratulatory email for this applicant", { icon: "error" })
    //            return
    //        }
    //        swal_title = "Send Congratulatory Email"
    //        swal_message = "Are you sure you want to send this applicant a congratulatory email? Please double check you action!"
    //    }


    //    $(".emailbtncls" + row_id).removeClass('fa fa-paper-plane');
    //    $(".emailbtncls" + row_id).addClass("fa fa-spinner fa-spin");
    //    $("#emailbtn" + row_id).prop("disabled", true);

    //    swal({
    //        title: swal_title,
    //        text: swal_message,
    //        icon: "info",
    //        buttons: true,
    //        dangerMode: true,
    //    })
    //        .then(function (willDelete) {
    //            if (willDelete) {

    //                h.post("../cComparativeAssessment/sendEmailNotification", {
    //                    dt: dt
    //                    , email_type: type
    //                }).then(function (d) {

    //                    var se = d.data.se

    //                    s.Data_List[row_id].email_aknowldge_dttm = se.email_aknowldge_dttm
    //                    s.Data_List[row_id].email_aknowldge_regret_dttm = se.email_aknowldge_regret_dttm
    //                    s.Data_List[row_id].email_noti_exam_dttm = se.email_noti_exam_dttm
    //                    s.Data_List[row_id].email_regret_dttm = se.email_regret_dttm
    //                    s.Data_List[row_id].email_noti_hrmpsb_dttm = se.email_noti_hrmpsb_dttm
    //                    s.Data_List[row_id].email_notintop5_dttm = se.email_notintop5_dttm
    //                    s.Data_List[row_id].email_congratulatory_dttm = se.email_congratulatory_dttm
    //                    swal(d.data.message, { icon: d.data.icon })

    //                    $(".emailbtncls" + row_id).removeClass("fa fa-spinner fa-spin");
    //                    $(".emailbtncls" + row_id).addClass('fa fa-paper-plane');
    //                    $("#emailbtn" + row_id).prop("disabled", false);
    //                })

    //            }

    //        });


    //}

    s.backevent = function () {
        window.history.go(-1);
    }
})


