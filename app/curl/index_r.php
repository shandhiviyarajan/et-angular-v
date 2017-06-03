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


require_once ('vendor/guzzel/autoload.php');
use GuzzleHttp\Client;

$client = new Client([]);
if (isset($JWT_TOKEN) and $JWT_TOKEN != null) {
    $response = $client->request($request_method, $request_url, [
        'headers' => [
            'Content-Type'     => 'application/json',
            'Authorization'      => $JWT_TOKEN
        ],
        'json' => $post_data
    ]);
} else {
    $response = $client->request($request_method, $request_url, [
        'headers' => [
            'Content-Type'     => 'application/json'
        ],
        'json' => $post_data
    ]);
}
$results = $response->getBody();
print_r($results);
