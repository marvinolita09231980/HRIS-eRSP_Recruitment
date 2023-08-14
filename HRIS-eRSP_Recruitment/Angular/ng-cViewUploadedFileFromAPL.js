


ng_eRSP_App.controller("cViewUploadedFileFromAPL_Ctrlr", function ($scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http

    s.header_title = "Applicant Attachement"
    s.modal = 1
    s.info_ctrl_nbr = ""
    s.empl_id = ""
    s.rowLen = ""
    s.doc_type = ""
    s.pageTitle = ""
    s.doctype_disp = ""
    s.main_edit = false
    s.dtl_edit = false
    s.dropzone = false
    s.editonly = false
    s.adddetails = false
    s.hidesave = false
    s.allow_type_id = true;
    s.applicantinfo = true
    s.nofile = false 
    s.attach = "active"
    s.hasdetails = false
    s.year = []
    s.res_data = []
    s.docname = []
    s.att_dtl = []
    s.att_dtl_orig = []
    s.app_info = {}
    s.position_from_publication = []
    s.item_no = ""
    s.appointment = ""
    s.applicant_name = ""
    s.um = {}
    s.budget_code_list = []

    s.body_client_width  = document.getElementById("main-body").clientWidth
    s.body_client_height = document.getElementById("main-body").clientHeight

    //initialize here...
    init()

    //scope functions.....
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

    function fn_encode_pdf(d, a, e, b, c, f) {
        c = "";
        try {
            for (a = e = b = 0; a < 4 * d.length / 3; f = b >> 2 * (++a & 3) & 63, c += String.fromCharCode(f + 71 - (f < 26 ? 6 : f < 52 ? 0 : f < 62 ? 75 : f ^ 63 ? 90 : 87)) + (75 == (a - 1) % 76 ? "\r\n" : ""))a & 3 ^ 3 && (b = b << 8 ^ d[e++]); for (; a++ & 3;)c += "=";

            if (c.toString().trim() == "") {
                c = "../ResourcesImages/149071.png";
            }
            else {
                c = "data:application/pdf;base64," + c;
            }
        } catch (e) {
            c = "../ResourcesImages/149071.png";
        }
        return c;
    }


    s.split_filename = function (path) {
        var split = path.split("_")
        var spl_len = split.length
        return split[spl_len - 1]
    }

    s.AddDetails = function (val) {
        if (val == "cApplicationInfoDetails/Attachements") {
            $("#eligib_dtl_modal").modal("show");
        }
        else if (val == "cApplicationInfoDetails/Index") {
            location.href = "cApplicationInfoDetails/Index?app_control_nbr=" + s.app_ctrl_nbr;
        }
        else {
            location.href = val
        }
    }

    s.choose_file = function (row) {
        s.file_index = row
        $("#choose_action").modal("show")
    }

    s.delete_file = function () {
        var dt = s.att_dtl[s.file_index]
        var dt_seq = dt.seq_no
        $("#choose_action").modal("hide")
        swal({
            title: "Are you sure to delete this record?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,

        })
            .then(function (willDelete) {
                if (willDelete) {
                    h.post("../cApplicationInfoDetails/DeleteAttachements", {
                        att: dt
                    }).then(function (d) {
                        if (d.data.icon == "success") {
                            s.att_dtl = s.att_dtl.filter(function (d) {
                                return d.seq_no != dt_seq
                            })
                            swal(d.data.message, { icon: d.data.icon })
                        }
                        else {
                            swal("Error:" + d.data.message, { icon: d.data.icon })
                        }
                    })
                }

            });
    }

   
    s.show_file = function (file_index) {
        $("#choose_action").modal("hide")
        var dt = s.att_dtl[file_index]
        s.path = dt.file_path
        var pdf = fn_encode_pdf(dt.filedocs)
        $("#pdfview").attr("src", pdf)
        $("#pdfview_modal").modal("show");

    }


    s.changeZone = function (btn, doc) {
        if (btn == 1) {
            s.hidesave = true
            s.dropzone = true
            s.dropz = "active"
            s.attach = ""

            if (doc == 1) {
                s.doc_type = "PD"
                s.doctype_disp = "Personnel Data Sheet"
                s.att_dtl = s.att_dtl_orig.select(s.doc_type, "doc_type")

            }
            else if (doc == 2) {
                s.doc_type = "AL"
                s.doctype_disp = "Application Letter"
                s.att_dtl = s.att_dtl_orig.select(s.doc_type, "doc_type")
            }
            else if (doc == 3) {
                s.doc_type = "IR"
                s.doctype_disp = "IPCR"
                s.att_dtl = s.att_dtl_orig.select(s.doc_type, "doc_type")
            }
            else if (doc == 4) {
                s.doc_type = "TR"
                s.doctype_disp = "Tarnscript Of Record"
                s.att_dtl = s.att_dtl_orig.select(s.doc_type, "doc_type")
            }
            else if (doc == 5) {
                s.doc_type = "CS"
                s.doctype_disp = "CS Eligibility"
                s.att_dtl = s.att_dtl_orig.select(s.doc_type, "doc_type")
            }
            else if (doc == 6) {
                s.doc_type = "OT"
                s.doctype_disp = "Others"
                s.att_dtl = s.att_dtl_orig.select(s.doc_type, "doc_type")
            }
        }
        else {
            if (s.main_edit == true) {
                s.hidesave = false
            }
            s.dropzone = false
            s.attach = "active"
            s.dropz = ""
            s.doctype_disp = ""
        }
    }

    s.ngF_Employment_type = function (employment_type) {
        h.post("../cApplicationInfoDetails/getBudgetCode", { employment_type: employment_type }).then(function () {

            s.budget_code_list = d.data.budgetcode
        })
    }

    s.ngF_Budget_code = function (employment_type) {
        h.post("../cApplicationInfoDetails/getBudgetCode", { employment_type: employment_type }).then(function () {
            s.budget_code_list = d.data.budgetcode
        })
    }



    s.getUploadedFileOnline = function (empl_id) {

        h.post("../cViewUploadedFileFromAPL/getUploadedFileOnline", { empl_id: empl_id }).then(function (d) {
            s.att_dtl_orig = d.data.app_uploadedfile
            s.att_dtl = d.data.app_uploadedfile
        })

    }
    s.getDownloadedFileOnline = function (info_ctrl_nbr) {

        h.post("../cViewUploadedFileFromAPL/getDownloadedFileOnline", { apl_id: s.att_dtl[0].apl_id }).then(function (d) {
            $("#choose_action").modal("hide")
            var dt = s.att_dtl[s.file_index]
            s.path = dt.file_path
            var path_split = s.path.split('\\')
            var p_len = path_split.length
            var new_path = (path_split[p_len - 2] + "/" + path_split[p_len - 1]);

            window.open(new_path, "_blank")
        })
    }

    //end of scope functions

    //functions....
    function init() {
      
        h.post("../cViewUploadedFileFromAPL/Initialize").then(function (d) {

            s.app_info = d.data.app_info
            var firstname = s.app_info.first_name
            var lastname = s.app_info.last_name
            var middlename = s.app_info.middle_name == "" ? "" : s.app_info.middle_name.substring(0, 1) + "."
            //$("#applicant_name").val(firstname + " " + middlename + " " + lastname)
            s.applicant_name = firstname + " " + middlename + " " + lastname

            s.empl_id = s.app_info.empl_id;

            s.info_ctrl_nbr = s.app_info.info_ctrl_nbr;

            if (d.data.app_uploadedfile.length == 0) {
                s.nofile = true
                      
               
            }
            else {
                s.nofile = false
                s.att_dtl_orig = d.data.app_uploadedfile
                s.att_dtl = d.data.app_uploadedfile
            }

           
        })
       

    }


    //End of functions

    s.PreviousPage = function () {
        h.post("../cViewUploadedFileFromAPL/PreviousPage").then(function (d) {
            location.href = d.data.previouspage
        })
    }
   

   
})

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

ng_eRSP_App.directive("minMax", ["commonScript", "$http", function (cs, h) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
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



ng_eRSP_App.filter("body_clientwidth", function () {
    return function (d) {
        var wd = (d * 85) / 100
        return wd
    }
})

ng_eRSP_App.filter("body_clientheigth", function () {
    return function (d) {
        var ht = (d * 78) / 100
        return ht
    }
})

//ng_onlineRCT_App.filter("docIcon", function () {
//    return function (x) {
//        var p = x.split(".")
//        var pl = p.length
//        var ex = p[pl - 1]
//        if (ex == "pdf") {
//            return "../ResourcesImages/pdf_icon.png"
//        }
//        else {
//            return "../ResourcesImages/excel_icon.png"
//        }

//    };
//})

