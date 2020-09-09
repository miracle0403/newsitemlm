function verifymail(email, mailer, username, link, hbsmail){
	
	var transporter = mailer.createTransport({ 
		host: '', 
		port: 26, 
		secure: false, // true for 465, false for other ports
		auth: { 
			user: '', // generated ethereal 
			pass:  '' // generated ethereal password } }); 
		  }
   });
transporter.use('compile', hbsmail({ viewPath: '.../views/mail/', extName: '.hbs' })); 

//the message properties
	var mailOptions = {
  		from: '',
  		to: email,
  		subject: 'Verify Your Email',
		template: 'verify',
  		context: {
  			code: code,
  			email: email,
  			username: username,
  			link: link
  		}
	}
	
// send the mail
	transporter.sendMail(mailOptions, function(error, info) { 
		if (error) {
			return console.log(error); 
		} 
		console.log('Message sent: %s', info.messageId);
		//console.log(module.exports.email);
  	});
}


//welcome mail 
function verifymail(email, mailer, hbsmail, fullname, username){
	
	var transporter = mailer.createTransport({ 
		host: '', 
		port: 26, 
		secure: false, // true for 465, false for other ports
		auth: { 
			user: '', // generated ethereal 
			pass:  '' // generated ethereal password } }); 
		  }
   });
transporter.use('compile', hbsmail({ viewPath: '.../views/mail/', extName: '.hbs' })); 

//the message properties
	var mailOptions = {
  		from: '',
  		to: email,
  		subject: 'Verify Your Email',
		template: 'welcome',
  		context: {
  			
  			username: username,
  			fullname: fullname
  		}
	}
	
// send the mail
	transporter.sendMail(mailOptions, function(error, info) { 
		if (error) {
			return console.log(error); 
		} 
		console.log('Message sent: %s', info.messageId);
		//console.log(module.exports.email);
  	});
}