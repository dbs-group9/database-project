<?php
/**
 * @package PHP Rest API(DBConnection)
 *
 * @author Ngoc Nguyen
 *
 */

// Database Connection
class DBConnection {
	private $_dbHostname = "localhost";
	private $_dbName = "118794";
	private $_dbUsername = "118794";
	private $_dbPassword = FILL PASSWORD BEFORE RUNNING//"password";
	private $_con;

	public function __construct() {
		try {
			$this->_con = new PDO("mysql:host=$this->_dbHostname;dbname=$this->_dbName", $this->_dbUsername, $this->_dbPassword);
			$this->_con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		} catch(PDOException $e) {
			echo "Connection failed: " . $e->getMessage();
		}
	}
	// return Connection
	public function returnConnection() {
		return $this->_con;
	}
}
?>
