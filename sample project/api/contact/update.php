<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$requestMethod = $_SERVER["REQUEST_METHOD"];

include('../class/Contacts.php');

$contact = new Contacts();

// get put data
$data = json_decode(file_get_contents("php://input"));

switch($requestMethod) {
	case 'POST':
		$contact->setContactID($data->ID);
		$contact->setFirstName($data->FirstName);
		$contact->setLastName($data->LastName);
		$contact->setPhoneNumber($data->PhoneNumber);
		$contact->setEmail($data->Email);
		$contact->setAddress($data->Address);
		$contact->setAdditionalNotes($data->AdditionalNotes);

		$contactInfo = $contact->updateContact();

		if(!empty($contactInfo)) {
			header("HTTP/1.0 200 OK");
			$js_encode = json_encode(array('status'=>TRUE, 'message'=>'Contact updated successfully'), true);
		} else {
			header("HTTP/1.0 409 Conflict");
			$js_encode = json_encode(array('status'=>FALSE, 'message'=>'Contact update failed'), true);
		}

		header("HTTP/1.0 200 OK");
		header('Content-Type: application/json');
		echo $js_encode;
		break;
	default:
		header("HTTP/1.0 405 Method Not Allowed");
	break;
}
?>
