<?php
$url=_GET[“url”];
if (!preg_match("^https?:~i", $url)) {
$url = "http://" . $url;
}

$request_headers = array();
foreach (getallheaders() as $header => $value) {
$request_headers = $header . ": " . $value;
}

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, $request_headers);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$response_headers = explode("\r\n", substr($response, 0, curl_getinfo($ch, CURLINFO_HEADER_SIZE)));
$response_body = substr($response, curl_getinfo($ch, CURLINFO_HEADER_SIZE));
curl_close($ch);

$propagate_headers = array(“content-type”); //add additonal headers you want to propagate to this array in lower case
foreach ($response_headers as $header) {
if (in_array(strtolower(explode(": ", $header)[0]), $propagate_headers)) {
header($header);
}
}

echo $response_body;