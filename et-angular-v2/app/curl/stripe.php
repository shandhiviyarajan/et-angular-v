<?php
header('Content-Type: application/json');

include_once('vendor/autoload.php');
\Stripe\Stripe::setApiKey("sk_test_BQokikJOvBiI2HlWgH4olfQ2");


$request_data = file_get_contents('php://input');
$ARR_POST_DATA = json_decode($request_data, true);

$JWT_TOKEN = $ARR_POST_DATA['JWT_TOKEN'];
$request_url = $ARR_POST_DATA['request_url'];
$request_method = $ARR_POST_DATA['request_method'];
$post_data_array = $ARR_POST_DATA['post_data'];
$query_data = $ARR_POST_DATA['query_data'];
$post_data = null;



//SET Request header//
if (isset($JWT_TOKEN) and $JWT_TOKEN != null) {
    $HEADER = array(
        'Content-Type: application/json',
        'Authorization:' . $JWT_TOKEN
    );
} else {
    $HEADER = array(
        'Content-Type: application/json'
    );
}



$CARD_TOKEN = \Stripe\Token::create(array(
    "card" => array(
        "number" => "4242424242424242",
        "exp_month" => 5,
        "exp_year" => 2018,
        "cvc" => "314"
    )
));


print json_encode($CARD_TOKEN);







