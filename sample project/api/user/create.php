<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$requestMethod = $_SERVER["REQUEST_METHOD"];
include('../class/Users.php');
$user = new Users();

// get posted data
$data = json_decode(file_get_contents("php://input"));

switch($requestMethod) {
	case 'POST':
		$user->setUsername($data->username);
		$user->setPassword($data->password);

		$userInfo = $user->getUser();

		if (!empty($userInfo))
		{
			header("HTTP/1.0 409 Conflict");
			$js_encode = json_encode(array('status'=>FALSE, 'message'=>'User creation failed'), true);
			echo $js_encode;
			break;
		}

		$userInfo = $user->createUser();

		if(!empty($userInfo)) {
			header("HTTP/1.0 200 OK");
			$js_encode = json_encode(array('status'=>TRUE, 'message'=>'User created Successfully'), true);
		} else {
			header("HTTP/1.0 409 Conflict");
			$js_encode = json_encode(array('status'=>FALSE, 'message'=>'User creation failed'), true);
		}

		header('Content-Type: application/json');
		echo $js_encode;
		break;
	default:
		header("HTTP/1.0 405 Method Not Allowed");
		break;
}
?>
