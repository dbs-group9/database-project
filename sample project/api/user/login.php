<?php
$inData = getRequestInfo();

$id = 0;

$conn = new mysqli("localhost", "118794", "***REMOVED***", "118794"); //localhost, db username, db password, db name
if ($conn->connect_error)
{
	returnWithError($conn->connect_error);
}
else
{
	$sql = "SELECT ID FROM Users WHERE Login='" . $inData["login"] . "' AND Password='" . $inData["password"] . "'";
	$result = $conn->query($sql);
	if ($result->num_rows > 0)
	{
		$row = $result->fetch_assoc();
		$id = $row["ID"];

		returnWithInfo($id);
	}
	else
	{
		returnWithError("No Records Found");
	}
	$conn->close();
}

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
	$retValue = json_encode(array('status'=>FALSE, 'id'=>0, 'message'=>$err), true);
	//$retValue = '{"id":0,"error":"' . $err . '"}';
	sendResultInfoAsJson($retValue);
}

function returnWithInfo($id)
{
	$retValue = json_encode(array('status'=>TRUE, 'id'=>($id * 1)), true);
	//$retValue = '{"id":' . $id . ',"error":""}';
	sendResultInfoAsJson($retValue);
}
?>
