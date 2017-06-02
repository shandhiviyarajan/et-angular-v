<?php

require __DIR__ . '/vendor/autoload.php';

define('LOGIN', 'https://easytrades.herokuapp.com/login');

use Symfony\Component\HttpFoundation\Request;

class Api
{

    protected $http;

    protected $client;

    public $options = [
        'headers' => [
            'Content-type' => 'application/x-www-form-urlencoded'
        ]
    ];

    public function __construct($type)
    {
        $this->http = Request::createFromGlobals();

        $this->client = new GuzzleHttp\Client([
            'base_uri' => 'https://easytrades.herokuapp.com'
        ]);

        $this->router();
    }


    public function router()
    {
        if ($this->http->get('function')) {

            if (method_exists($this, $this->http->get('function'))) {
                call_user_func([$this, $this->http->get('function')]);
            } else {
                $this->output([
                    'status' => 'hukanawa'
                ]);
            }
        }
    }

    private function login()
    {
        if ($this->http->headers->has('email') && $this->http->headers->has('password')) {
            $login_request = $this->client->request('POST', '/login', array_merge($this->options, [
                'body' => 'Email=' . $this->http->headers->get('email') . '&Password=' . $this->http->headers->get('password')
            ]));
            if ($login_request->getStatusCode() === 200) {
                $login_request = \GuzzleHttp\json_decode($login_request->getBody());
                $this->output($login_request);
            }
        }
        $this->output([
            'status' => false
        ]);
    }

    private function getProfile()
    {
        if ($this->http->headers->has('JWT_TOKEN')) {
            $this->options['headers'] = [
                'Content-type' => 'application/json',
                'Authorization' => $this->http->headers->get('JWT_TOKEN')
            ];

            $get_profile = $this->client->request('GET', '/employee/my-profile', $this->options);
            if ($get_profile->getStatusCode() === 200) {
                $get_profile = \GuzzleHttp\json_decode($get_profile->getBody());
                $this->output($get_profile);
            }
        }
        $this->output([
            'status' => false
        ]);
    }

    private function updateProfile()
    {

        if (
            $this->http->headers->has('JWT_TOKEN') &&
            $this->http->headers->has('username') &&
            $this->http->headers->has('data')
        ) {

            $this->options['headers'] = [
                'Content-type' => 'application/json',
                'Authorization' => $this->http->headers->get('JWT_TOKEN')
            ];

            $this->options = array_merge($this->options, [
                'body' => $this->http->headers->get('data')
            ]);

            $update_profile = $this->client->request('POST', '/employee/' . $this->http->headers->get('username') . '/details', $this->options);
            if ($update_profile->getStatusCode() === 200) {
                $update_profile = \GuzzleHttp\json_decode($update_profile->getBody());
                $this->output($update_profile);
            }
        }
        $this->output([
            'status' => false
        ]);
    }

    private function output($return)
    {
        if (!is_array($return)) {
            $return = (object)$return;
        }
        print \GuzzleHttp\json_encode($return);
        exit();
    }

}

new Api('ela');