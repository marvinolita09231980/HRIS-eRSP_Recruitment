

ng_eRSP_App.controller("cUploadAddsImage_ctrlr", function (commonScript, $scope, $http, $filter, Upload, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript

    s.header_title = "Applicant Attachment"
    s.modal = 1
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
    s.attach = "active"
    s.hasdetails = false
    s.year = []
    s.res_data = []
    s.docname = []
    s.att_dtl = []
    s.position_from_publication = []
    s.item_no = ""
    s.appointment = ""
    s.applicant_name = ""
    s.um = {}
    s.budget_code_list = []

    s.img_name_exist = []


    function addvalue(id, val) {
        $("#" + id).val(val)
        s[id] = val
    }
    function init() {

        Dropzone.options.myAwesomeDropzone = {
            autoProcessQueue: false,
            uploadMultiple: true,
            parallelUploads: 100,
            maxFiles: 100,
            addRemoveLinks: true,
            dictDuplicateFile: "Duplicate Files Cannot Be Uploaded",
            preventDuplicates: true,
            acceptedFiles: "png/jpg/pdf",
            accept: function (file, done) {
                var myDropzone = this;
                var filesize = file.upload.total
                if (filesize > 3000000) {
                    swal({
                        title: "File size too large",
                        text: "Your file exceed 3mb, The file that exceed 1mb will be removed automatically from the list",
                        icon: "error",
                    });
                    myDropzone.removeFile(file);
                }
                else {
                    h.post("../cUploadAddsImage/CheckFile",
                        {
                            doc: s.doc_type,
                            file: file.name,
                            info_ctrl_nbr: s.info_ctrl_nbr
                        }).then(function (d) {
                            console.log(d.data.fileXs)
                            if (d.data.fileXs == 1) {
                                swal({
                                    title: "File already exist",
                                    text: "Please rename your file. The duplicate file will be remove automatically!",
                                    icon: "error",
                                });
                                myDropzone.removeFile(file);
                            }
                            else {
                                //var dt = {
                                //    filename :file.name,
                                //    doc:s.doc_type
                                //}
                                //s.docname.push(dt);
                            }
                        })
                }

            },

            init: function () {
                var myDropzone = this;
                this.element.querySelector("button[id=submitFile]").addEventListener("click", function (e) {
                    if (cs.elEmpty(s.hiring_period)) {
                        cs.required2("hiring_period", "This field is required!")
                    }
                    else {
                        cs.notrequired2("hiring_period")
                        e.preventDefault();
                        e.stopPropagation();
                        var files = myDropzone.files

                        var test = new FormData();
                        if (files.length < 1) {
                            swal({ title: "No file selected", text: "Drag or click to select files", icon: "info", });
                            return
                        }

                        Upload.upload({
                            url: '../cUploadAddsImage/SaveAttachements/',
                            data: { file: files, hiring_period: s.hiring_period }
                        }).then(function (d) {
                            if (d.data.icon == "success") {

                                s.img_name_exist = d.data.img_name_exist

                                if (s.img_name_exist.length > 0) {
                                    $("#added_img_exist").modal("show")
                                }
                                else {
                                    swal({
                                        title: "Success",
                                        text: "File successfully submitted",
                                        icon: "success",
                                        closeOnClickOutside: false
                                    }).then(function (success) {
                                        if (success) {
                                            if (d.data.img_list.length > 0) {

                                                s.att_dtl = d.data.img_list

                                                angular.forEach(d.data.img_list, function (d, k) {
                                                    myDropzone.removeFile(files[k]);
                                                })
                                            }


                                        }
                                    })
                                }

                            }
                        })
                    }
                });
            }
        }

        h.post("../cUploadAddsImage/InitializeAttache").then(function (d) {
            if (d.data.icon == "success") {
                s.hiring_periods = d.data.hiring_periods
            }
        })

    }



    init()

    s.AddDetails = function (val) {
        if (val == "cUploadAddsImage/Attachements") {
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
                    h.post("../cUploadAddsImage/DeleteAttachements", {
                        att: dt,
                        employment_type: s.employment_type,
                        budget_code: s.budget_code,
                        item_no: s.item_no
                    }).then(function (d) {
                        if (d.data.icon == "success") {
                            //s.att_dtl = s.att_dtl.filter(function (d) {
                            //    return d.seq_no != dt_seq
                            //})
                            s.att_dtl = d.data.returndata;
                            swal(d.data.message, { icon: d.data.icon })
                        }
                        else {
                            swal("Error:" + d.data.message, { icon: d.data.icon })
                        }
                    })
                }

            });
    }

    s.show_file = function () {
        $("#choose_action").modal("hide")
        var dt = s.att_dtl[s.file_index]
        s.path = dt.file_path

        var path_split = s.path.split('\\')
        var p_len = path_split.length
        var new_path = (path_split[p_len - 2] + "/" + path_split[p_len - 1]);

        window.open(new_path, "_blank")
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
            }
            else if (doc == 2) {
                s.doc_type = "AL"
                s.doctype_disp = "Application Letter"
            }
            else if (doc == 3) {
                s.doc_type = "IR"
                s.doctype_disp = "IPCR"
            }
            else if (doc == 4) {
                s.doc_type = "TR"
                s.doctype_disp = "Tarnscript Of Record"
            }
            else if (doc == 5) {
                s.doc_type = "CS"
                s.doctype_disp = "CS Eligibility"
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

    s.ngF_Hiring_period = function (value) {
        h.post("../cUploadAddsImage/getImgList", { hiring_period: value }).then(function (d) {
            s.att_dtl = d.data.img_list
        })
    }

    s.split_filename = function (value) {
        var dt = value.split("_APL_")
        return dt[1]
    }

    s.removeImg = function (i) {

        swal({
            title: "Are you sure to delete this image?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,

        })
            .then(function (willDelete) {
                if (willDelete) {
                    h.post("../cUploadAddsImage/DeleteImg", {
                        id: i
                    }).then(function (d) {
                        if (d.data.icon == "success") {

                            s.att_dtl = d.data.img_list;
                            swal(d.data.message, { icon: d.data.icon })
                        }
                        else {
                            swal("Error:" + d.data.message, { icon: d.data.icon })
                        }
                    })
                }

            });
    }

    s.deleteAllImg = function () {
        swal({
            title: "Are you sure to delete this image?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,

        }).then(function (willDelete) {
            if (willDelete) {
                h.post("../cUploadAddsImage/DeleteAllImages", {
                    hiring_period: s.hiring_period 
                }).then(function (d) {
                    if (d.data.icon == "success") {

                        s.att_dtl = d.data.img_list;
                        swal(d.data.message, { icon: d.data.icon })
                    }
                    else {
                        swal("Error:" + d.data.message, { icon: d.data.icon })
                    }
                })
            }
        });
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


