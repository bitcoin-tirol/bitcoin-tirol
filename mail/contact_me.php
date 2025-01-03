<?php
// Check for empty fields
if(empty($_POST['name'])  		||
   empty($_POST['email']) 		||
   empty($_POST['phone']) 		||
   empty($_POST['message'])	||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
   {
	echo "Fehlende Angaben!";
	return false;
   }

$name = $_POST['name'];
$email_address = $_POST['email'];
$phone = $_POST['phone'];
$message = $_POST['message'];

// Create the email and send the message
$to = 'hello@bitcoin-tirol.at'; // Add your email address inbetween the '' replacing yourname@yourdomain.com - This is where the form will send a message to.
$email_subject = "Website Kontakt Formular :  $name";
$email_body = "Sie haben eine neue Nachricht von Ihrem Website-Kontaktformular erhalten.\n\n"."Hier sind die Details:\n\nName: $name\n\nE-Mail: $email_address\n\nTelefon: $phone\n\nNachricht:\n$message";
$headers = "From: noreply@bitcoin-tirol.at\n"; // This is the email address the generated message will be from. We recommend using something like noreply@yourdomain.com.
$headers .= "Reply-To: $email_address";
mail($to,$email_subject,$email_body,$headers);
return true;
?>
