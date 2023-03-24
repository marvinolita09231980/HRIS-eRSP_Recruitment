


ng_eRSP_App.controller("TestAPI_Ctrlr", function (commonScript, $scope, $http, $filter, $compile) {
    var s = $scope
    var h = $http
    var cs = commonScript
    

    s.testAPI = function () {

        h.get("https://localhost:5001/api/Values/Employees").then(function (d) {
             console.log(d.data)
        })
    }
   
})


