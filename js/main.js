
function SignIn(emailInputId, passwordInputId)
{
	email = document.getElementById(emailInputId).value;
	password = document.getElementById(passwordInputId).value;
	alert(email);
}

function ClearSignInModal()
{
	$("#signUpForm input[type=text], #signUpForm input[type=password]").val("");
}
