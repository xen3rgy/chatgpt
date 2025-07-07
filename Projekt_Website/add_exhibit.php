<?php
include("db.php");

function validateText($text)
{
    return str_replace("\"","'",htmlspecialchars(trim($text)));
}

$targetDir = "devices/";
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['picture'])) 
{
    // Eingabefelder erfassen
    $name = isset($_POST['title']) ? validateText($_POST['title']) : '';
    $description  = isset($_POST['description']) ? validateText($_POST['description']) : '';
    $year  = isset($_POST['year']) ? validateText($_POST['year']) : '';
    $manufacturer  = isset($_POST['manufacturer']) ? validateText($_POST['manufacturer']) : '';
    $lcid  = isset($_POST['lcid']) ? validateText($_POST['lcid']) : '';
    $model  = isset($_POST['model']) ? validateText($_POST['model']) : '';

    // JPG-Datei verarbeiten
    $file = $_FILES['picture'];

    if (!in_array($file['type'], ['image/jpeg', 'image/jpg'])) {
        echo "Nur JPG-Dateien sind erlaubt.";
        exit;
    }

    if ($file['size'] > 5 * 1024 * 1024) {
        echo "Die Datei ist zu groß. Maximal 5MB erlaubt.";
        exit;
    }

    $fileName = basename($file['name']);
    $targetFile = $targetDir . $name . ".jpg";

    if (move_uploaded_file($file['tmp_name'], $targetFile)) {
        echo "Datei erfolgreich hochgeladen.<br>";
        echo "Gespeicherte Datei: " . $targetFile;
    } else {
        echo "Fehler beim Hochladen der Datei.";
    }

	if ($name==null || $name=='')
	{
		echo "PUT:invalid parameters";
		return;
	}

	$result = dbQuery("select max(id) as maxID, max(textId) as maxTextId from texts;");
	$maxId = $result[0]["maxID"];
	$maxTextId = $result[0]["maxTextId"] + 1;

	// insert empty texts but with valid ids and lcid for each configured language
	$result = dbQuery("select lcid from languages");
	foreach ($result as $row) 
	{
		// description
		dbExecute(sprintf("INSERT into texts values (%s,%s,%s,'%s')",++$maxId, $row['lcid'], $maxTextId, $description));
		// generalInfo,
		dbExecute(sprintf("INSERT into texts values (%s,%s,%s,'')",++$maxId, $row['lcid'], $maxTextId+1));
		// technicalData,
		dbExecute(sprintf("INSERT into texts values (%s,%s,%s,'')",++$maxId, $row['lcid'], $maxTextId+2));
		// historicalSignificance,
		dbExecute(sprintf("INSERT into texts values (%s,%s,%s,'')",++$maxId, $row['lcid'], $maxTextId+3));
		// specialFeatures
		dbExecute(sprintf("INSERT into texts values (%s,%s,%s,'')",++$maxId, $row['lcid'], $maxTextId+4));
	}

	// insert into exhibits table
	$sql = sprintf("INSERT INTO exhibits
(#id, - autoincrement
name,
model,
description,
year,
manufacturer,
generalInfo,
technicalData,
historicalSignificance,
specialFeatures) VALUES ('%s','%s',%s,%s,'%s',%s,%s,%s,%s);"
,$name,$model,$maxTextId,$year,$manufacturer,$maxTextId+1,$maxTextId+2,$maxTextId+3,$maxTextId+4);
echo $sql;
	$result = dbExecute($sql);
	echo json_encode($result);
} 
else 
{
    echo "Keine Datei empfangen.";
}
?>
