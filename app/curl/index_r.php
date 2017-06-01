<?php
//header("Content-Type: text/json");

$request_data = file_get_contents('php://input');
$ARR_POST_DATA = json_decode($request_data, true);

$JWT_TOKEN = $ARR_POST_DATA['JWT_TOKEN'];
$request_url = $ARR_POST_DATA['request_url'];
$request_method = $ARR_POST_DATA['request_method'];
$post_data_array = $ARR_POST_DATA['post_data'];
$query_data = $ARR_POST_DATA['query_data'];
$post_data = null;

if ($query_data) {
    if (isset($post_data_array)) {
        $post_data = http_build_query($post_data_array);
    } else {
        $post_data = null;
    }
} else {
    $post_data = json_encode($post_data_array);
    //$post_data = $post_data_array;
}

//SET Request header//
if (isset($JWT_TOKEN) and $JWT_TOKEN != null) {
    $HEADER = array(
        "Content-Type: application/json",
        "Authorization:" . $JWT_TOKEN
    );
} else {
    $HEADER = array(
        "Content-Type: application/json"
    );
}


run($request_url, $post_data, $HEADER, $request_method);

function run($url, $post_data, $HEADER, $method)
{
    $curlRequest = curl_init();
    curl_setopt($curlRequest, CURLOPT_HTTPHEADER, $HEADER);
    curl_setopt($curlRequest, CURLOPT_URL, $url);

    $method = strtoupper($method);


    switch ($method) {

        case 'GET':
            if (isset($post_data)) {
                curl_setopt($curlRequest, CURLOPT_POSTFIELDS, $post_data);
            }
            break;

        case 'POST':
            curl_setopt($curlRequest, CURLOPT_POST, 1);
            break;

        case 'PUT':
            curl_setopt($curlRequest, CURLOPT_CUSTOMREQUEST, 'PUT');
            break;

        case 'DELETE':
            break;
    }

//
//    if ($method == 'post' || $method == 'POST') {
//        curl_setopt($curlRequest, CURLOPT_POST, 1);
//    } elseif ($method == 'put' || $method == 'PUT') {
//        curl_setopt($curlRequest, CURLOPT_CUSTOMREQUEST, 'PUT');
//    } else {
//        if (isset($post_data)) {
//            curl_setopt($curlRequest, CURLOPT_POSTFIELDS, $post_data);
//        }
//    }


    curl_setopt($curlRequest, CURLOPT_RETURNTRANSFER, 0);
    curl_setopt($curlRequest, CURLOPT_CONNECTTIMEOUT, 5);
    $data = curl_exec($curlRequest);
    curl_close($curlRequest);
    return json_encode($data);
}





