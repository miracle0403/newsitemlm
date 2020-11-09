$(document).ready(function() {
	$('#numberValid').hide();
	$('#lengthValid').hide();
	$('#Ulettervalid').hide();
	$('#Llettervalid').hide();
	$('#matchvalid').hide();
	var matched = $(':input#cpass');
	console.log(matched)
	
	$('#password').keyup(function() {
		var pswd = $(this).val();
		var matched = $('#cpass');
		
		if ( pswd.length < 8 ){
			$('#lengthInvalid').show();
			$('#lengthValid').hide();
		}else {
			$('#lengthValid').show();
			$('#lengthInvalid').hide();
		}
		if ( pswd.match(/[A-Z]/) ){
			$('#Ulettervalid').show();
			$('#Uletter-invalid').hide();
		} else {
			$('#UletterValid').hide();
			$('#Uletter-invalid').show();
		}
		if ( pswd.match(/[a-z]/) ){
			$('#Llettervalid').show();
			$('#Lletter-invalid').hide();
		} else {
			$('#Llettervalid').hide();
			$('#Lletter-invalid').show();
		}
		if ( pswd.match(/\d/) ){
			$('#numberValid').show();
			$('#numberInvalid').hide();
		} else {
			$('#numberInvalid').show();
			$('#numberValid').hide();
		}
	}).focus(function() {
		var pswd = $(this).val();
		if ( pswd.length < 8 ){
			$('#lengthInvalid').show();
			$('#lengthValid').hide();
		}else {
			$('#lengthValid').show();
			$('#lengthInvalid').hide();
		}
		if ( pswd.match(/[A-Z]/) ){
			$('#Ulettervalid').show();
			$('#Uletter-invalid').hide();
		} else {
			$('#UletterValid').hide();
			$('#Uletter-invalid').show();
		}
		if ( pswd.match(/[a-z]/) ){
			$('#Llettervalid').show();
			$('#Lletter-invalid').hide();
		} else {
			$('#Llettervalid').hide();
			$('#Lletter-invalid').show();
		}
		if ( pswd.match(/\d/) ){
			$('#numberValid').show();
			$('#numberInvalid').hide();
		} else {
			$('#numberInvalid').show();
			$('#numberValid').hide();
		}
		if(matched === pswd){
			$('#matchvalid').show();
			$('#matchinvalid').hide();
		}else{
			$('#matchvalid').hide();
			$('#matchinvalid').show();
		}
	}).blur(function() {
		var pswd = $(this).val();
		if ( pswd.length < 8 ){
			$('#lengthInvalid').show();
			$('#lengthValid').hide();
		}else {
			$('#lengthValid').show();
			$('#lengthInvalid').hide();
		}
		if ( pswd.match(/[A-Z]/) ){
			$('#Ulettervalid').show();
			$('#Uletter-invalid').hide();
		} else {
			$('#Ulettervalid').hide();
			$('#Uletter-invalid').show();
		}
		if ( pswd.match(/[a-z]/) ){
			$('#Llettervalid').show();
			$('#Lletter-invalid').hide();
		} else {
			$('#Llettervalid').hide();
			$('#Lletter-invalid').show();
		}
		if ( pswd.match(/\d/) ){
			$('#numberValid').show();
			$('#numberInvalid').hide();
		} else {
			$('#numberInvalid').show();
			$('#numberValid').hide();
		}
	});
	
	$("#resendPass").click(function(){
		$.get("/resendPass", function(data){
			$("#result").html(data);
		});
	});
});