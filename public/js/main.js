function StitchController($scope, $http) {

    $http.defaults.headers.common["x-zumo-application"] = "CRpeeOnzAGfdSjmgrsageYSawSyOdg40";
    $http({ method: "GET", url: "https://cloudstitch.azure-mobile.net/api/workflows/" }).
        success(function (data, status) {
            console.log(data);
            $scope.workflows = data;
            if ($scope.workflows.length !== 0) {
                $('#nothingHereIndicator').css('display', 'none');    
            }            
        }).
        error(function (data, status) {
            console.log(data);
            console.log(status);
        });

    $http({ method: "GET", url: "https://cloudstitch.azure-mobile.net/api/stitches/" }).
        success(function (data, status) {
            $scope.stitchTemplates = data;
        }).
        error(function (data, status) {
            console.log(data);
            console.log(status);
        });

    $scope.stitches = [];

    $scope.NewWorkflow = function() {
        $scope.stitches = [];
        $('#alertDiv').remove();
        $('#workflowNameInput').val("");
    };

    $scope.AddStitch = function() {
        $scope.stitches.push({
            name: ''
        });

        $scope.stitchNameBind = 'New Stitch';
    };

    $scope.DeleteStitch = function(index) {
        $scope.stitches.splice(index, 1);
        event.stopPropagation();
    }

    $scope.CreateWorkflow = function() {
        var workflowName = $('#workflowNameInput').val();
        if (!workflowName) {
            var message = "Please give your workflow a name.";
            $('#alertPlaceholder').html('<div id="alertDiv" class="alert alert-danger"><a class="close" data-dismiss="alert">×</a><span>' + message + '</span></div>')
            $("#workflowNameInput").focus();
            return;
        }

        var newStitches = [];

        for (var i = 0; i < $scope.stitches.length; i++) {
            var newStitch = new Object();
            newStitch.name = $("#stitchNameInput" + i).val();

            // Get RSS
            if ($("#stitchTypeSelector" + i).val() == 0) {
                newStitch.stitchTemplateId = '{5F6486EB-FD30-4024-8D07-66B398784C4D}';
                newStitch.sequence = i;
                newStitch.inputs = [{
                    name: 'FeedUrl',
                    value: $("#rssUrlInput" + i).val()
                }];
            }
            // Parse XML
            else if ($("#stitchTypeSelector" + i).val() == 1) {
                newStitch.stitchTemplateId = '{240A7FBB-77FB-42AF-84C1-36D423C53778}';
                newStitch.sequence = i;
                newStitch.inputs = [{
                    name: 'DocumentUrl',
                    value: $("#xmlUrlInput" + i).val()
                }, {
                    name: 'Xpath',
                    value: $("#xmlPathInput" + i).val()
                }];
            }
            // Send SMS
            else if ($("#stitchTypeSelector" + i).val() == 2) {
                newStitch.stitchTemplateId = '{6CAC6474-45C4-4F4B-A965-E780AE82B2DC}';
                newStitch.sequence = i;
                newStitch.inputs = [{
                    name: 'PhoneNumber',
                    value: $("#smsInput" + i).val()
                }, {
                    name: 'Message',
                    value: $("#smsMessageInput" + i).val()
                }];
            }
            // ???
            else {
                window.alert("This shouldn't happen");
            }

            newStitches.push(newStitch);
        }

        $scope.workflows.push({
            lastRunDate: (new Date(0)).toJSON(),
            lastRunStep: 0,
            lastRunComplete: false,
            name: $('#workflowNameInput').val(),
            stitches: newStitches
        });

        var wFlow = $scope.workflows.pop();

        console.log(wFlow);

        // Send new workflow to backend
        //$http.defaults.headers.common["x-zumo-application"] = "CRpeeOnzAGfdSjmgrsageYSawSyOdg40";
        //$http({ method: "POST", url: "https://cloudstitch.azure-mobile.net/api/workflows/" }).
        //    success(function (data, status) {
        //        console.log(data);
        //        $scope.workflows = data;
        //    }).
        //    error(function (data, status) {
        //        console.log(data);
        //        console.log(status);
        //    });

        $.ajax({
            url: "https://cloudstitch.azure-mobile.net/api/workflows/",
            type: "POST",
            data: wFlow,
            crossDomain: true,
            headers: { "x-zumo-application": "CRpeeOnzAGfdSjmgrsageYSawSyOdg40" },
            success: function(data) {
                $("#result").html('submitted successfully');
                $scope.workflows.push(data);
            },
            error: function() {
                $("#result").html('there is error while submit');
            }
        });

        $('#nothingHereIndicator').css('display', 'none');
        $('#workflowModal').modal('hide');
        $('#alertDiv').remove();
        $('#workflowNameInput').val("");
    };

    $scope.DeleteWorkflow = function(index) {
        $scope.workflows.splice(index, 1);

        console.log("Table length: " + $scope.workflows.length);

        if($scope.workflows.length == 0) {
            $('#nothingHereIndicator').css('display', 'block');
        }

        // Delete the workflow from the backend

    }
}

function stitchTypeChanged(index) {
    console.log('Stitch Type Changed');
    console.log('index: ' + index);

    var selected = $('#stitchTypeSelector' + index).val();
    console.log('selected: ' + selected);

    if (selected == '0') {
        $('#xml-element-' + index).css('display', 'none');
        $('#sms-element-' + index).css('display', 'none');
        $('#rss-element-' + index).css('display', 'block');
    } else if (selected == '1') {
        $('#rss-element-' + index).css('display', 'none');
        $('#sms-element-' + index).css('display', 'none');
        $('#xml-element-' + index).css('display', 'block');
    } else {
        $('#rss-element-' + index).css('display', 'none');
        $('#xml-element-' + index).css('display', 'none');
        $('#sms-element-' + index).css('display', 'block');
    }
}

function showWorkflows() {
    console.log('showWorkflows');
}

function refreshAuthDisplay() {
    var isLoggedIn = window.azureClient.currentUser !== null;
    $("#logged-in").toggle(isLoggedIn);
    $("#logged-out").toggle(!isLoggedIn);
    if (isLoggedIn) {
        console.log(window.azureClient.currentUser);
        $("#login-name").text(window.azureClient.currentUser.userId);
        showWorkflows();
    }
}

function logIn() {
    console.log("Logging in...");
    window.azureClient.login("google").then(refreshAuthDisplay, function(error) {
        alert(error);
    });
}

function logOut() {
    window.azureClient.logout();
    refreshAuthDisplay();
    //$('#summary').html('<strong>You must login to access data.</strong>');
}

$(function() {
    $('.stitchTypeSelector').change(function() {
        var selected = $(this).val();
        $(".stitchTypeElement-" + selected).hide();
        $('#' + selected).show();
    }).change();

    var client = window.azureClient = new WindowsAzure.MobileServiceClient(
        'https://cloudstitch.azure-mobile.net/',
        'CRpeeOnzAGfdSjmgrsageYSawSyOdg40');

    refreshAuthDisplay();
    $("#logged-out button").click(logIn);
    $("#logged-in button").click(logOut);
});

$('#workflowModal').on('shown', function() {
    if ($("#workflowNameInput").val() == '') {
        $("#workflowNameInput").focus();
    }
});
