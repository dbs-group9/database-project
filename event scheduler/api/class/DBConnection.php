<?php
class DBConnection{
// edit these fields if needed
private $servername = "localhost";
private $username = "root";
private $password = "";
private $db = "exhibitioncenterdatabase";
private $con;

    public function __construct(){
        try{
            $this->con = new PDO("mysql:host=$this->servername;dbname=$this->db", $this->username, $this->password);
            $this->con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        }
        catch(PDOException $e){
            echo "Connection failed: " . $e->getMessage();
        }
    }
    public function getConnection(){
        return $this->con;
    }
}
?>