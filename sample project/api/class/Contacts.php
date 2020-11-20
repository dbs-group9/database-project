<?php
/**
 * @package Contact class
 *
 * @author Ngoc Nguyen
 *
 */

include ("DBConnection.php");
class Contacts
{
	protected $db;
	private $_id;
	private $_firstName;
	private $_lastName;
	private $_userID;
	private $_phoneNumber;
	private $_address;
	private $_email;
	private $_additionalNotes;

	public function setUserID($userID)
	{
		$this->_userID = $userID;
	}
	public function setContactID($contactID)
	{
		$this->_id = $contactID;
	}
	public function setFirstName($firstName)
	{
		$this->_firstName = $firstName;
	}
	public function setLastName($lastName)
	{
		$this->_lastName = $lastName;
	}
	public function setPhoneNumber($phoneNumber)
	{
		$this->_phoneNumber = $phoneNumber;
	}
	public function setAddress($address)
	{
		$this->_address = $address;
	}
	public function setEmail($email)
	{
		$this->_email = $email;
	}
	public function setAdditionalNotes($additionalNotes)
	{
		$this->_additionalNotes = $additionalNotes;
	}

	public function __construct()
	{
		$this->db = new DBConnection();
		$this->db = $this
			->db
			->returnConnection();
	}

	// create contact
	public function createContact()
	{
		try
		{
			//INSERT INTO Contacts (FirstName, LastName, PhoneNumber, Email, Address, AdditionalNotes, UserID, DateCreated, DateUpdated) VALUES ('test', 'test', 'test', 'test', 'test', 'test', 1, NOW(), NOW())
			$sql = "INSERT INTO Contacts (FirstName, LastName, PhoneNumber, Email, Address, AdditionalNotes, UserID, DateCreated, DateUpdated)
					VALUES (:firstName, :lastName, :phoneNumber, :email, :address, :additionalNotes, :userID, NOW(), NOW())";
			$data = ['firstName' => $this->_firstName,
					'lastName' => $this->_lastName,
					'phoneNumber' => $this->_phoneNumber,
					'email' => $this->_email,
					'address' => $this->_address,
					'additionalNotes' => $this->_additionalNotes,
					'userID' => $this->_userID];
			$stmt = $this
				->db
				->prepare($sql);
			$stmt->execute($data);
			$status = $stmt->rowCount();
			return $status;

		}
		catch(Exception $e)
		{
			die("There's an error in the query!");
		}
	}

	// update contact
	public function updateContact()
	{
		try
		{
			//UPDATE Contacts SET FirstName='test',LastName='test',PhoneNumber='test',Email='test',Address='test',AdditionalNotes='test',DateUpdated=NOW() WHERE ID=24;
			$sql = "UPDATE Contacts SET FirstName=:firstName,
										LastName=:lastName,
										PhoneNumber=:phoneNumber,
										Email=:email,
										Address=:address,
										AdditionalNotes=:additionalNotes,
							 			DateUpdated=NOW()
					WHERE ID=:contact_id";
			$data = ['firstName' => $this->_firstName,
					'lastName' => $this->_lastName,
					'phoneNumber' => $this->_phoneNumber,
					'email' => $this->_email,
					'address' => $this->_address,
					'additionalNotes' => $this->_additionalNotes,
					'contact_id' => $this->_id];
			$stmt = $this
				->db
				->prepare($sql);
			$stmt->execute($data);
			$status = $stmt->rowCount();
			return $status;
		}
		catch(Exception $e)
		{
			die("There's an error in the query!");
		}
	}

	// getAll contacts
	public function getAllContact()
	{
		try
		{
			$sql = "SELECT * FROM Contacts";
			$stmt = $this
				->db
				->prepare($sql);

			$stmt->execute();
			$result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
			return $result;
		}
		catch(Exception $e)
		{
			die("There's an error in the query!");
		}
	}

	// get contact
	public function getContact()
	{
		try
		{
			$sql = "SELECT * FROM Contacts WHERE ID=:contact_id";
			$stmt = $this
				->db
				->prepare($sql);
			$data = ['contact_id' => $this->_id];
			$stmt->execute($data);
			$result = $stmt->fetch(\PDO::FETCH_ASSOC);
			return $result;
		}
		catch(Exception $e)
		{
			die("There's an error in the query!");
		}
	}

	// get user's contacts
	public function getUserContacts()
	{
		try
		{
			$sql = "SELECT * FROM Contacts WHERE UserID=:user_id";
			$stmt = $this
				->db
				->prepare($sql);
			$data = ['user_id' => $this->_userID];
			$stmt->execute($data);
			$result = $stmt->fetchAll(\PDO::FETCH_ASSOC);
			return $result;
		}
		catch(Exception $e)
		{
			die("There's an error in the query!");
		}
	}

	// delete contact
	public function deleteContact()
	{
		try
		{
			$sql = "DELETE FROM Contacts WHERE ID=:contact_id";
			$stmt = $this
				->db
				->prepare($sql);
			$data = ['contact_id' => $this->_id];
			$stmt->execute($data);
			$status = $stmt->rowCount();
			return $status;
		}
		catch(Exception $e)
		{
			die("There's an error in the query!");
		}
	}
}
?>
