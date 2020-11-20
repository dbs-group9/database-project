<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$requestMethod = $_SERVER["REQUEST_METHOD"];
include ('../class/Contacts.php');
$contact = new Contacts();

// get posted data
$data = json_decode(file_get_contents("php://input"));

switch ($requestMethod)
{
	case 'POST':
		$contact->setUserID($data->UserID);
		$contact->setFirstName($data->FirstName);
		$contact->setLastName($data->LastName);
		$contact->setPhoneNumber($data->PhoneNumber);
		$contact->setEmail($data->Email);
		$contact->setAddress($data->Address);
		$contact->setAdditionalNotes($data->AdditionalNotes);

		$contactInfo = $contact->createContact();

		if (!empty($contactInfo))
		{
			header("HTTP/1.0 200 OK");
			$js_encode = json_encode(array('status' => true, 'message' => 'Contact created Successfully'), true);
		}
		else
		{
			header("HTTP/1.0 409 Conflict");
			$js_encode = json_encode(array('status' => false, 'message' => 'Contact creation failed'), true);
		}

		header('Content-Type: application/json');
		echo $js_encode;
		break;
	default:
		header("HTTP/1.0 405 Method Not Allowed");
		break;
}
?>
