<?php

    // $inData = getRequestInfo();
	$id = array();

    $conn = new mysqli("localhost", "root", "", "exhibitioncenterdatabase");
    if ($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }

    else 
    {    
        $sql = "SELECT * 
		FROM events 
		where events.is_approved = 0";
		$result = $conn->query($sql);
        
        if( $result != TRUE )
        {
            returnWithError($conn->error);
            $conn->close();
        }
        
        else if ($result->num_rows > 0)
        {
            while($row = mysqli_fetch_assoc($result)){
			$id[] = $row;
            // returnWithInfo($id);
            }
            echo json_encode($id);
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
        $retValue = '{"title of event pending":"' . $id . '"}';
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