


ng_eRSP_App.controller("cAppInfoAttachDetails_Ctrlr", function ($scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http

    s.header_title = "Applicant Attachement"
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
    function init() {
       
        h.post("../cApplicationInfoDetails/InitializeAttache").then(function (d) {
            s.position_from_publication = d.data.positions
            s.applicant_name = d.data.applicant.applicant_name
            s.item_no = d.data.applicant.item_no
            s.appointment = d.data.applicant.appointment
        })
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
                h.post("../cApplicationInfoDetails/CheckFile", {doc: s.doc_type, file: file.name }).then(function (d) {
                    if (d.data.fileXs == 1) {
                        swal({
                            title: "Filename already exist",
                            text: "Please rename your file",
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
            },
            init: function () {
                var myDropzone = this;
                this.element.querySelector("button[type=submit]").addEventListener("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var files = myDropzone.files
                    var test = new FormData();
                    if (files.length < 1) {
                        swal({ title: "No file selected", text: "Drag or click to select files", icon: "info", });
                        return
                    }


                    for (var i = 0; i < files.length; i++) {
                        test.append(files[i].name, files[i]);
                    }
                    //test.append("app_ctrl_nbr", s.app_ctrl_nbr);

                  
                    $.ajax({
                        url: "UploadImage.ashx",
                        type: "POST",
                        contentType: false,
                        processData: false,
                        data: test,
                        success: function (result) {
                            myDropzone.processQueue();
                            s.res_data = result.split(';')
                            if (s.res_data[0] == "success") {
                               
                                h.post("../cApplicationInfoDetails/SaveAttachements", { doc: s.doc_type, data: s.res_data }).then(function (d) {

                                    if (d.data.icon == "success") {
                                        swal({
                                            title: "Success",
                                            text: "File successfully added",
                                            icon: "success",
                                            closeOnClickOutside: false
                                        }).then(function (success) {
                                            if (success) {
                                             
                                                var fil = d.data.file_att
                                                angular.forEach(d.data.file_att, function (d, k) {
                                                    s.att_dtl.push(d)
                                                    myDropzone.removeFile(files[k]);
                                                })
                                            }
                                        })


                                    }
                                    else {
                                        swal("Error:" + d.data.message, { icon: d.data.icon })
                                    }
                                })
                            }

                        },
                        error: function (err) {
                            alert(err.statusText);
                        }
                    });

                });

            }

        }

        h.post("../cApplicationInfoDetails/InitializeAttache").then(function (d) {
            if (d.data.icon == "success") {
                s.app_ctrl_nbr = d.data.app_ctrl_nbr
                s.att_dtl = d.data.returndata
            }
        })
       
    }

   

    init()
    
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
                        else
                        {
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
})


