<?php
include("db.php");
//include("includes/functions.php");

// get the request method (GET, POST, or DELETE)
$method = $_SERVER['REQUEST_METHOD'];

// get input data, parse it, and store it in $data
$data = json_decode(file_get_contents('php://input'), true);
// var_dump($data);

if ($method == 'POST') //update text in texts-table
{
	/*$id=0;
	if (isset($_GET["id"]))
		$id = $_GET["id"];
	$device = '';
	if (isset($_GET["text"]))
		$text = $_GET["text"];*/
	$id = $data['id'];
	$text = $data['text'];
	$lcid = $data['lcid'];

	if ($id==null || $id==0 || $text==null || $text=='')
	{
		echo "POST:invalid parameters";
		return;
	}

	$text = str_replace("\"","'",$text); // replace " with '
	$sql = 'UPDATE texts SET content="'.$text.'" where id='.$id.' and lcid='.$lcid;
	//echo $sql;
	$result = dbExecute($sql);
	echo json_encode($result);
} 
elseif ($method == 'GET') // if the request method is GET
{	
	//$lcid = 1033; // fallback english
	$lcid = 1031; // german
	if (isset($_GET["lcid"]))
		$lcid = $_GET["lcid"];
	$device = '';
	if (isset($_GET["device"]))
		$device = $_GET["device"];

$sql = 'SELECT e.id, name, model, manufacturer, year
, d.content as description, d.id as description_textid
, g.content as general, g.id as general_textid
, td.content as technical, td.id as technical_textid
, h.content as historical, h.id as historical_textid
, s.content as special, s.id as special_textid 
FROM exhibits e 
join texts g on e.generalInfo = g.textid 
join texts td on e.technicalData = td.textid 
join texts h on e.historicalSignificance = h.textid 
join texts s on e.specialFeatures = s.textid 
join texts d on e.description = d.textid 
where g.lcid = '.$lcid.' and td.lcid = '.$lcid.' and h.lcid = '.$lcid.' and s.lcid = '.$lcid.' and d.lcid = '.$lcid;

	if ($device!='')
		$sql = $sql . ' and name like "%'.$device.'%"';
	$sql = $sql . " order by name;";

	//echo "SQL=".$sql."##";
	$result = dbQuery($sql);
	echo json_encode($result);
}
elseif ($method == 'DELETE') // if the request method is DELETE
{
	$sql = "DELETE from exhibits where id=".$data['id'];
	$result = dbExecute($sql);
	echo json_encode($result);
}
elseif ($method == 'PATCH') // patches exhibit
{
	$sql = sprintf("UPDATE exhibits set %s='%s' where id=%s",$data['column'],$data['text'],$data['id']);
	$result = dbExecute($sql);
	echo json_encode($result);
}
?>