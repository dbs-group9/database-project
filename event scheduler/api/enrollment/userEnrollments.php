<?php
    header("Content-Type: application/json; charset=UTF-8");
    include("DBConnection.php");

    $user = array();
    $db = new DBConnection();
    $db = $db->getConnection();
    $data = json_decode(file_get_contents("php://input"));
    
    try{
        $sql = "SELECT *
                FROM Enrollment
                WHERE username = :username";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':username', $data->username, PDO::PARAM_STR, 20);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
       // add conditional to check if result is empty?
        $json = json_encode($result);
        echo $json;
    }
    catch(Exception $e){
        die("Error occurred while executing query.");
    }
?>