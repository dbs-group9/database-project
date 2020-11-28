<?php

include ("DBConnection.php");

class Event
{
	protected $db;
	private $event_id;
	private $title;
	private $description;
	private $url;
	private $startdate;
	private $enddate;
	private $address;
    private $is_approved;
    private $username;
    private $city;

    public function __construct($_event_id, $_title, $_description, $_url, $_stardate, $_enddate, $_address, $_is_approved, $_username, $_city){
        $this->db = new DBConnection();
        $this->db = $this->db->getConnection();
        $this->event_id = $_event_id;
        $this->title = $_title;
        $this->description = $_description;
        $this->url = $_url;
        $this->startdate = $_stardate;
        $this->enddate = $_enddate;
        $this->address = $_address;
        $this->is_approved = $_is_approved;
        $this->username= $_username;
        $this->city = $_city;
    }

	// create contact
	public function createEvent()
	{
		try
		{
			$sql = "INSERT INTO Events (event_id, title, description, url, startdate, enddate, address, is_approved, username, city)
					VALUES (:event_id, :title, :description, :url, :startdate, :enddate, :address, :is_approved, :username, :city)";
			$data = ['event_id' => $this->event_id,
                    'title' => $this->title,
					'description' => $this->description,
					'url' => $this->url,
					'startdate' => $this->startdate,
					'enddate' => $this->enddate,
                    'address' => $this->address,
                    'is_approved' => $this->is_approved,
                    'username' => $this->username,
                    'city' => $this->city,];
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

	// getAll events
	public function getAllEvents()
	{

    }

    // get event
	public function getEvent()
	{
        try
		{
            $sql = "SELECT
            FROM events
            WHERE event_id=:event_id";
			$stmt = $this->db->prepare($sql);
			$data = ['event_id' => $this->event_id];
			$stmt->execute($data);
			$result = $stmt->fetch(\PDO::FETCH_ASSOC);
			return $result;
		}
		catch(Exception $e)
		{
			die("There's an error in the query!");
		}
    }

    // get user's events
	public function getUserEvents()
	{
        
    }


    //--------------------------------------------------------------------------------

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
?>
