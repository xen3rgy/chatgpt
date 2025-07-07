<?php
//include("includes/db.php");
//include("includes/functions.php");

function dbConnect()
{
	$host="127.0.0.1";
	$port=3306;
	$socket="";
	$user="pi";
	$password="pi";
	$dbname="classiccomputingvitrine";

	$conn = new mysqli($host, $user, $password, $dbname, $port, $socket)
		or die ('Could not connect to the database server' . mysqli_connect_error());

	if ($conn == null) 
	{
		print "connection error";
	}
	return $conn;
}

function dbExecute($sql)
{
	$conn = dbConnect();
	//$result = mysqli_execute($sql);
	$stmt = mysqli_prepare($conn, $sql);
	/* bind parameters for markers */
	//mysqli_stmt_bind_param($stmt, "s", $city);
	/* execute query */
	mysqli_stmt_execute($stmt);
	$result="";
	/* bind result variables */
	//mysqli_stmt_bind_result($stmt, $result);
	/* fetch value */
	//mysqli_stmt_fetch($stmt);

	//printf("%s is in district %s\n", $city, $district);
	$conn->close();
	return $result;
}
function dbQuery($query)
{
	$conn = dbConnect();
	$result = mysqli_query($conn, $query);
	//echo var_dump($result);

	// create an empty array for registrations and list contents of the directory registrations
	$rows = array();

	if ($result->num_rows > 0) 
	{
		while($row = $result->fetch_assoc()) 
		{
		 $rows[] = $row;
		}
	} else 
	{
		echo "0 results";
	}

	$conn->close();
	return $rows;
}
?>