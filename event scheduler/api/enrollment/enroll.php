<?php
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    include('..\class\Enrollment.php');

    $data = json_decode(file_get_contents("php://input"));
    switch($requestMethod){
        case 'POST':
            $enroll = new Enrollment($data->username, $data->eventID, $data->eventTitle);
            
            $enrollInfo = $enroll->createEnrollment();
            
            if(!empty($enrollInfo)) {
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