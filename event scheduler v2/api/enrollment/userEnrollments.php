<?php
    header("Content-Type: application/json; charset=UTF-8");
    include('..\class\DBConnection.php');

    $user = array();
    $db = new DBConnection();
    $db = $db->getConnection();
    $data = json_decode(file_get_contents("php://input"));
    
    try{
        $sql = "SELECT DISTINCT enrollment.username, events.title
                FROM enrollment, events
                WHERE enrollment.username = :username 
                AND enrollment.event_id = events.event_id
                ORDER BY startdate ASC, enddate ASC";
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':username', $data->username, PDO::PARAM_STR, 20);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
       // add conditional to check if result is empty?
       /*
       if(result is empty)
        $js_encode = json_encode(array('status'=>FALSE, 'message'=>'User creation failed'), true);
       */
        $json = json_encode($result);
        echo $json;
       
    }
    catch(Exception $e){
        die("Error occurred while executing query.");
    }
?>
