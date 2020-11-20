<?php
/**
 * @package Users class
 *
 * @author Luis Galvis
 *
 */

include("DBConnection.php");
class Users
{

	protected $db;
	private $_id;
	private $_username;
	private $_password;

	public function setUserID($ID) {
		$this->_id = $ID;
	}

	public function setUsername($username) {
		$this->_username = $username;
	}

	public function setPassword($password) {
		$this->_password = $password;
	}

	public function __construct() {
		$this->db = new DBConnection();
		$this->db = $this->db->returnConnection();
   }

	// create user
	public function createUser() {
		try {

			$sql = "INSERT INTO Users (Login, Password)
					VALUES (:username, :password)";
			$data = [
				'username' => $this->_username,
				'password' => $this->_password,
			];
			$stmt = $this->db->prepare($sql);
			$stmt->execute($data);
			$status = $stmt->rowCount();
			return $status;
		} catch (Exception $e) {
			die("There's an error in the query!");
		}
	}

	// checking if user exists for account creation
	public function getUser()
	{
		try
		{
			$sql = "SELECT * FROM Users WHERE Login=:login";
			$stmt = $this
				->db
				->prepare($sql);
			$data = ['login' => $this->_username];
			$stmt->execute($data);
			$result = $stmt->fetch(\PDO::FETCH_ASSOC);
			return $result;
		}
		catch(Exception $e)
		{
			die("There's an error in the query!");
		}
	}

	public function getUsername()
	{
		try
		{
			$sql = "SELECT Login FROM Users WHERE ID=:id";
			$stmt = $this
				->db
				->prepare($sql);
			$data = ['id' => $this->_id];
			$stmt->execute($data);
			$result = $stmt->fetch(\PDO::FETCH_ASSOC);
			return $result;
		}
		catch(Exception $e)
		{
			die("There's an error in the query!");
		}
	}
}
?>
