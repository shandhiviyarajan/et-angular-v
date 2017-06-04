<?php
header('Content-Type: application/json');


//get the post data
$request_data = file_get_contents('php://input');

//make a request data array
$ARR_POST_DATA = json_decode($request_data, true);

//assign to vars
$JWT_TOKEN = $ARR_POST_DATA['JWT_TOKEN'];
$request_url = $ARR_POST_DATA['request_url'];
$request_method = $ARR_POST_DATA['request_method'];
$post_data_array = $ARR_POST_DATA['post_data'];
$query_data = $ARR_POST_DATA['query_data'];

//create a blank post_data
$post_data = null;
$options = array();
$headers = array();


//if query_data true build a query array else send as a object
if ($query_data) {
    if (isset($post_data_array)) {
        $post_data = http_build_query($post_data_array);
    } else {
        $post_data = null;
    }
} else {
    $post_data = json_encode($post_data_array);
}

if ($JWT_TOKEN != null && isset($JWT_TOKEN)) {
    $headers = array(
        'Content-length: 0',
        'Accept: application/json',
        'Content-Type:application/json',
        'Authorization:' . $JWT_TOKEN
    );
} else {
    $headers = array(
        'Content-length: 0',
        'Accept: application/json',
        'Content-Type:application/json'
    );
}

switch ($request_method) {
    case 'POST':
        $options = array(
            CURLOPT_URL => $request_url,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_TIMEOUT => 120,
            CURLOPT_POSTFIELDS => $post_data,
        );
        break;

    case 'PUT':
        $options = array(
            CURLOPT_URL => $request_url,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => 'PUT',
            CURLOPT_TIMEOUT => 120,
            CURLOPT_POSTFIELDS => $post_data,
        );
        break;

    case 'GET':
        echo "get";
        $options = array(
            CURLOPT_URL => $request_url,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 120,
            CURLOPT_POSTFIELDS => $post_data,
        );
        break;
}

$curlRequest = curl_init();
curl_setopt_array($curlRequest, $options);

$result = curl_exec($curlRequest);
curl_close($curlRequest);

print_r($result);