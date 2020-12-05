<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$requestMethod = $_SERVER["REQUEST_METHOD"];
include('..\class\Event.php');
//$user = new Users();

// get posted data
$data = json_decode(file_get_contents("php://input"));

switch($requestMethod) {
	case 'POST':
        $event = new Event(
                        $data->title, $data->description,
                        $data->url, $data->startdate, $data->enddate,
                        $data->address, $data->username,
                        $data->city);

		$eventInfo = $event->createEvent();

		if (!empty($eventInfo))
		{
			header("HTTP/1.0 200 OK");
			$js_encode = json_encode(array('status' => true, 'message' => 'Event created Successfully'), true);
		}
		else
		{
			header("HTTP/1.0 409 Conflict");
			$js_encode = json_encode(array('status' => false, 'message' => 'Event creation failed'), true);
		}

		header('Content-Type: application/json');
		echo $js_encode;
		break;
	default:
		header("HTTP/1.0 405 Method Not Allowed");
		break;
}
?>