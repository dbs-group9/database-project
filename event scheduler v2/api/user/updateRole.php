<?php

    $inData = getRequestInfo();
		
    $id = $inData["id"];
    

    $conn = new mysqli("localhost", "root", "", "exhibitioncenterdatabase");
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }

    else 
    {    
        $sql = "UPDATE users 
		SET user_type = 'admin'  
        WHERE users.user_type = 'participant' 
        AND users.id ='". $id ."'";
        
		$result = $conn->query($sql);
		
        if( $result != TRUE )
        {
            returnWithError($conn->error);
            $conn->close();
        }
        else if ($result->num_rows > 0)
        {
			$row = $result->fetch_assoc();
			$id = $row["is_approved"];
            returnWithInfo($id);
            $conn->close();
		}
		
        else
        {
            returnWithError("User role updated."); //hardcoded that message. returns wrong json but updates successfully on database
            $conn->close();
        }
	}
	
	function returnWithInfo($id)
    {
        $retValue = '{"is_approved":"' . $id . '"}';
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