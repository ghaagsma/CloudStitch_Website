function StitchController($scope) {

    $.ajax({
        type: "GET",
        url: "/api/workflows/",
        crossDomain: true,
        success: function (data) {
            console.log(data);
        }
    });

    $scope.workflows = [];
    $scope.stitches = [];

    $scope.NewWorkflow = function() {
        $scope.stitches = [];
        $('#alertDiv').remove();
        $('#workflowNameInput').val("");
    };

    $scope.AddStitch = function() {
        $scope.stitches.push({
            name: 'New Stitch'
        });
    };

    $scope.DeleteStitch = function(index) {
        $scope.stitches.splice(index, 1);

        // Not working...
        $('.accordion-body').each(function() {
            $(this).removeClass("in");
        });
    }

    $scope.CreateWorkflow = function() {
        var workflowName = $('#workflowNameInput').val();
        if (!workflowName) {
            var message = "Please give your workflow a name.";
            $('#alertPlaceholder').html('<div id="alertDiv" class="alert alert-danger"><a class="close" data-dismiss="alert">×</a><span>' + message + '</span></div>')
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
                    name: 'Feed URL',
                    value: $("#rssUrlInput" + i).val()
                }];
            }
            // Parse XML
            else if ($("#stitchTypeSelector" + i).val() == 1) {
                newStitch.stitchTemplateId = '{240A7FBB-77FB-42AF-84C1-36D423C53778}';
                newStitch.sequence = i;
                newStitch.inputs = [{
                    name: 'Document URL',
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
                    name: 'Phone Number',
                    value: $("#smsInput" + i).val()
                }, {
                    name: 'Message',
                    value: 'Notification'
                }];
            }
            // ???
            else {
                window.alert("This shouldn't happen");
            }

            newStitches.push(newStitch);
        }

        $scope.workflows.push({
            lastRunDate: new Date(0),
            lastRunStep: 0,
            lastRunComplete: false,
            name: $('#workflowNameInput').val(),
            stitches: newStitches
        });

        var wFlow = $scope.workflows.pop();

        console.log(wFlow);

        // Send new workflow to backend
        $.ajax({
            url: "/api/workflows/",
            type: "POST",
            data: wFlow,
            crossDomain: true,
            success: function() {
                alert("success");
                $("#result").html('submitted successfully');
            },
            error: function() {
                alert("failure");
                $("#result").html('there is error while submit');
            }
        });

        $scope.workflows.push(wFlow);

        $('#workflowModal').modal('hide');
        $('#alertDiv').remove();
        $('#workflowNameInput').val("");
    };
}

$(function() {
    $('.stitchTypeSelector').change(function() {
        var selected = $(this).val();
        $(".stitchTypeElement-" + selected).hide();
        $('#' + selected).show();
    }).change()
});
