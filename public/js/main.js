function CreateWorkflow() {
    $('#workflowModal').modal('hide');
}

function StitchController($scope) {
    $scope.stitches = [];

    $scope.NewWorkflow = function() {
        $scope.stitches = [];
    };

    $scope.AddStitch = function() {
        $scope.stitches.push({
            name: 'New Stitch'
        });

        $('.rss-element-' + $scope.stitches.length() - 1).show();
        $('.xml-element-' + $scope.stitches.length() - 1).hide();
        $('.sms-element-' + $scope.stitches.length() - 1).hide();
    }
}

$(function() {
    $('.stitchTypeSelector').change(function() {
        var selected = $(this).val();
        $(".stitchTypeElement-" + selected).hide();
        $('#' + selected).show();
    }).change()
});
