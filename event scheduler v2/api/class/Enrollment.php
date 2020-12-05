<?php
include("DBConnection.php");
class Enrollment{
    
    private $username;
    private $eventID;
    private $eventTitle;
    private $db;

public function __construct($_username, $_eventID){
    $this->db = new DBConnection();
    $this->db = $this->db->getConnection();
    $this->username = $_username;
    $this->eventID = $_eventID;
    // $this->eventTitle = $_eventTitle;
}
public function createEnrollment(){
    try{
        $sql = "INSERT INTO Enrollment(username, event_id) 
                VALUES(:username, :eventID)";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':username', $this->username, PDO::PARAM_STR, 20);
        $stmt->bindParam(':eventID', $this->eventID, PDO::PARAM_INT);
        // $stmt->bindParam(':eventTitle', $this->eventTitle, PDO::PARAM_STR, 50);
        $stmt->execute();
        $result = $stmt->rowCount();
        return $result;
    }
    catch(Exception $e){
        die("Error occurred while executing query.");
    }
}
}
?>