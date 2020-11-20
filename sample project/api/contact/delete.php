<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$requestMethod = $_SERVER["REQUEST_METHOD"];
include ('../class/Contacts.php');
$contact = new Contacts();
switch ($requestMethod)
{
	case 'POST':
		$empId = '';
		if ($_GET['id'])
		{
			$contactID = $_GET['id'];
			$contact->setContactID($contactID);
		}

		$contactInfo = $contact->deleteContact();

		if (!empty($contactInfo))
		{
			header("HTTP/1.0 200 OK");
			$js_encode = json_encode(array('status'=>TRUE, 'message'=>'Contact deleted successfully'), true);
		}
		else
		{
			header("HTTP/1.0 409 Conflict");
			$js_encode = json_encode(array('status'=>FALSE, 'message'=>'Contact deletetion failed'), true);
		}

		header('Content-Type: application/json');
		echo $js_encode;
		break;
	default:
		header("HTTP/1.0 405 Method Not Allowed");
		break;
}
?>
