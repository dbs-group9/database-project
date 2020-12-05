<?php

	$inData = getRequestInfo();
	$id = $inData["username"];
    $onePlaceHolder = 1;
    $arr = array();

	$conn = new mysqli("localhost", "root", "", "exhibitioncenterdatabase");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		//Does user exist in database
        $sql = "SELECT * FROM events WHERE username='". $id ."'";
        $result = $conn->query($sql);
		if( $result != TRUE )
		{
			returnWithError($conn->error);
			$conn->close();
		}
		
		else if ($result->num_rows > 0)
		{	
            // returnWithError("It worked!");
            // $result2 = $result->fetch_assoc();
            // $json = json_encode($result2);
            // echo $json;
            
            while($row = $result->fetch_assoc())
			{
                $arr[] = $row;
            }
            echo json_encode($arr);

			
		}
		else
		{
            returnWithError("No events");
            
		}
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo($searchResults)
	{
		$retValue = '{"results":[' . $searchResults . ']}';
		sendResultInfoAsJson( $retValue );
	}

?>