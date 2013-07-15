function ClearSignInModal() {
    $("#signUpForm input[type=text], #signUpForm input[type=password]").val("");
}

function CreateWorkflow() {
	$('#workflowModal').modal('hide');
}

function StitchController($scope) {
	$scope.stitches = [
    {text:'learn angular'},
    {text:'build an angular app'},
    {text:'blah'},
    {text:'blah2'}];
 
  // $scope.addTodo = function() {
  //   $scope.todos.push({text:$scope.todoText, done:false});
  //   $scope.todoText = '';
  // };
 
  // $scope.remaining = function() {
  //   var count = 0;
  //   angular.forEach($scope.todos, function(todo) {
  //     count += todo.done ? 0 : 1;
  //   });
  //   return count;
  // };
 
  // $scope.archive = function() {
  //   var oldTodos = $scope.todos;
  //   $scope.todos = [];
  //   angular.forEach(oldTodos, function(todo) {
  //     if (!todo.done) $scope.todos.push(todo);
  //   });
  // };
}