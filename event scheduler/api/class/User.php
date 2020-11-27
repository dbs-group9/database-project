<?php
include("DBConnection.php");
class Users{

private $username;
private $password;
private $db;

public function __construct($_username, $_password){
    $this->db = new DBConnection();
    $this->db = $this->db->getConnection();
    $this->username = $_username;
    $this->password = $_password; 
}
public function getUser(){
    try{
        $sql = "SELECT username
                FROM Users
                WHERE username = :username";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':username', $this->username, PDO::PARAM_STR, 20);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result;
    }
    catch(Exception $e){
        die("Error occurred while executing query.");
    }
}
public function createUser(){
    try{
        $sql = "INSERT INTO Users(username, password)
                VALUES(:username, :password)";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':username', $this->username, PDO::PARAM_STR, 20);
        $stmt->bindParam(':password', $this->password, PDO::PARAM_STR, 255);
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