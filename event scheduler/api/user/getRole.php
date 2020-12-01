<?php

    $inData = getRequestInfo();
    
	$id = $inData["username"];

    $conn = new mysqli("localhost", "root", "", "exhibitioncenterdatabase");
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }

    else 
    {    
        $sql = "SELECT user_type 
		FROM users 
		where users.username ='". $id ."'";
		$result = $conn->query($sql);
		
        if( $result != TRUE )
        {
            returnWithError($conn->error);
            $conn->close();
        }
        else if ($result->num_rows > 0)
        {
			$row = $result->fetch_assoc();
			$id = $row["user_type"];
            returnWithInfo($id);
            $conn->close();
		}
		
        else
        {
            returnWithError("User not found.");
            $conn->close();
        }
	}
	
	function returnWithInfo($id)
    {
        $retValue = '{"user_type":"' . $id . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function returnWithError( $err )
    {
        $retValue = '{"user type":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
	}
?>