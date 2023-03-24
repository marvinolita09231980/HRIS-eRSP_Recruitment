
ng_eRSP_App.controller("cEmbedScreening_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript

    var zoomid = '6695745158'
    var zoompass = 'OTNUWERROVBZUXZJUGhiTVMwNk5qQT09'
   

    s.embedzoomcredentials = function () {
        var id = $("#zoomid").val()
        var password = $("#password").val()
        h.post("../cEmbededScreening/savezoomcredential", {
            zoomid : id,
            password: password
        }).then(function (d) {
            $("#zoomframe").attr('src', 'https://zoom.us/wc/' + id + '/join?prefer=0&pwd=' + password); 
        })
    }

    function init() {
        h.post("../cEmbededScreening/Initialize", {
        }).then(function (d) {
            $("#zoomid").val(d.data.zoomcred.zoom_id)
            $("#password").val(d.data.zoomcred.zoom_password)
            $("#zoomframe").attr('src', 'https://zoom.us/wc/' + d.data.zoomcred.zoom_id + '/join?prefer=0&pwd=' + d.data.zoomcred.zoom_password); 
        })
    }

    init();
    
})


