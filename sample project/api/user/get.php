<?php
header("Access-Control-Allow-Methods: GET");

$requestMethod = $_SERVER["REQUEST_METHOD"];
include('../class/Users.php');
$user = new Users();

switch($requestMethod) {
	case 'GET':
		$userID = '';

		if($_GET['id']) {
			$userID = $_GET['id'];
			$user->setUserID($userID);
			$userInfo = $user->getUsername();
		} else {
			header("HTTP/1.1 404 Not Found");
			$js_encode = json_encode(array('status'=>FALSE, 'message'=>'No ID provided'), true);
		}

		if(!empty($userInfo)) {
			header("HTTP/1.0 200 OK");
			$js_encode = json_encode(array('status'=>TRUE, 'Login'=>array_values($userInfo)[0]), true); // this code is weird... idk if there is a better way to do it
		} else {
			header("HTTP/1.1 404 Not Found");
			$js_encode = json_encode(array('status'=>FALSE, 'message'=>'User not found'), true);
		}

		header('Content-Type: application/json');
		echo $js_encode;
		break;
	default:
		header("HTTP/1.0 405 Method Not Allowed");
		break;
}
?>
