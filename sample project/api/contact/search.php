<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$requestMethod = $_SERVER["REQUEST_METHOD"];
include ('../class/Contacts.php');
$contact = new Contacts();

$inData = getRequestInfo();

$searchResults = "";
$searchCount = 0;

$conn = new mysqli("localhost", "118794", "password", "118794");

// get posted data
$data = json_decode(file_get_contents("php://input"));

if ($conn->connect_error)
{
	returnWithError($conn->connect_error);
}

else
{

	$sql = "select FirstName from Contacts where FirstName like '%" . $inData["search"] . "%' and UserID=" . $inData["userId"];
	$result = $conn->query($sql);

	if ($result->num_rows > 0)
	{
		while ($row = $result->fetch_assoc())
		{
			if ($searchCount > 0)
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '"' . $row["FirstName"] . '"';
		}
	}

	else
	{
		returnWithError("No Conctacts Found.");
	}

	$conn->close();
}

returnWithInfo($searchResults);

function getRequestInfo()
{
	return json_decode(file_get_contents('php://input') , true);
}

function sendResultInfoAsJson($obj)
{
	header('Content-type: application/json');
	echo $obj;
}

function returnWithError($err)
{
	$retValue = json_encode(array('status' => false, 'message' => $err, 'contacts' => ''), true);
	sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults)
{
	$retValue = json_encode(array('status' => true, 'contacts' => $searchResults), true);
	sendResultInfoAsJson($retValue);
}
?>
