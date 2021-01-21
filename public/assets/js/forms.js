$(document).ready(function() {
	$('#numberValid').hide();
	$('#lengthValid').hide();
	$('#Ulettervalid').hide();
	$('#Llettervalid').hide();
	$('#matchvalid').hide();
	new ClipboardJS('.btn');
	var matched = $(':input#cpass');
	console.log(matched)
	
	//console.log('ready')
	
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
	
	
	//enter feeder
	$("button#enterFeeder").click(function(){
		if (confirm("Are you sure you want to enter the feeder matrix?")){
			$.post("/enter-feeder", function(data, status){
				alert('You have been assigned to pay someone');
				location.reload();
			});
		}
	});
	
	//activate
	$("button#activate").click(function(){
		if (confirm("Are you sure you want to activate your account?")) {
  			$.post("/activate", function(data, status){
				alert(data)
				location.reload(true);
  			});;
		}
	});
	
	//confirm activation
$(".confirmActivation").click(function(){
  var name = $(".confirmActivation").attr("name");
var orderId = $(".confirmActivation").attr("value");
	
});

	//confirm feeder
/*"	$("button#feedenter2").click(function(){
		var name = $('#feedName2').text();
		var link = $('#feedLink2').attr('href');
		if (confirm("Are you sure you received N10,000 from " + name + '?')){
			$.post(link, function(data, status){
				//alert('Payment Was confirmed');
				location.reload();
			});
		}
	});
	
	//feeder bonus
	$("button#feedenter").click(function(){
		var name = $('#feedName').text();
		var link = $('#feedLink').attr('href');
		if (confirm("Are you sure you received N10,000 from " + name + '?')){
			$.post(link, function(data, status){
				alert(status);
				location.reload();
			});
		}
	});
	*/
	
});