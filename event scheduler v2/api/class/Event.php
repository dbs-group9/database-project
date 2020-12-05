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

    public function __construct($_title, $_description, $_url, $_startdate, $_enddate, $_address, $_username, $_city){
        $this->db = new DBConnection();
        $this->db = $this->db->getConnection();
        $this->title = $_title;
        $this->description = $_description;
        $this->url = $_url;
        $this->startdate = $_startdate;
        $this->enddate = $_enddate;
        $this->address = $_address;
        $this->username= $_username;
        $this->city = $_city;
    }

	// create event
	public function createEvent()
	{
		try
		{
			$sql = "INSERT INTO Events (title, description, url, startdate, enddate, address, username, city)
					VALUES (:title, :description, :url, :startdate, :enddate, :address, :username, :city)";
			$data = ['title' => $this->title,
					'description' => $this->description,
					'url' => $this->url,
					'startdate' => $this->startdate,
					'enddate' => $this->enddate,
                    'address' => $this->address,
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
}
?>
