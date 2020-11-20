<?php
header("Access-Control-Allow-Methods: GET");

$requestMethod = $_SERVER["REQUEST_METHOD"];
include('../class/Contacts.php');
$contact = new Contacts();
switch($requestMethod) {
	case 'GET':
		$userID = '';

		if($_GET['userID']) {
			$userID = $_GET['userID'];
			$contact->setUserID($userID);
			$contactInfo = $contact->getUserContacts();
		}

		if(!empty($contactInfo)) {
			header("HTTP/1.0 200 OK");
			$js_encode = json_encode(array('status'=>TRUE, 'contacts'=>$contactInfo), true);
		} else {
			header("HTTP/1.1 404 Not Found");
			$js_encode = json_encode(array('status'=>FALSE, 'message'=>'User contacts not found'), true);
		}

		header('Content-Type: application/json');
		echo $js_encode;
		break;
	default:
		header("HTTP/1.0 405 Method Not Allowed");
	break;
}
?>
