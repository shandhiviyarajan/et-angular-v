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

//create a black post_data
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

//set request header//
if (isset($JWT_TOKEN) and $JWT_TOKEN != null) {
    $HEADER = array(
        "Authorization:" . $JWT_TOKEN,
    );
} else {
    $HEADER = array(
        "Content-Type: application/json"
    );
}

//call the curl function
run($request_url, $post_data, $HEADER, $request_method);


//curl function
function run($url, $post_data, $HEADER, $method)
{

    var_dump(func_get_args());

    exit();

    //create request
    $curlRequest = curl_init();

    //set header
    curl_setopt($curlRequest, CURLOPT_HTTPHEADER, $HEADER);
    //set url
    curl_setopt($curlRequest, CURLOPT_URL, $url);

    //uppercase all methods PUT,POST,GET,DELETE
    $method = strtoupper($method);

    switch ($method) {

        case 'POST':
            curl_setopt($curlRequest, CURLOPT_POST, 1);
            break;

        case 'PUT':
            curl_setopt($curlRequest, CURLOPT_CUSTOMREQUEST, 'PUT');
            break;

        case 'DELETE':
            break;

    }

    curl_setopt($curlRequest, CURLOPT_POSTFIELDS, $post_data);

    //set return as a string is false
    curl_setopt($curlRequest, CURLOPT_RETURNTRANSFER, true);
    //connection timeout
    curl_setopt($curlRequest, CURLOPT_CONNECTTIMEOUT, 5);
    //run curl request



    $data = curl_exec($curlRequest);

    //close
    curl_close($curlRequest);


    //return to front
    return json_encode($data);
}