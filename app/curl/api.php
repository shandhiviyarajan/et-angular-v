<?php

/**
 * @file : Guzzle API Endpoints & Stripe tokens
 * @author: Vipula / Shan
 * @date : 30 May 2017
 */

require __DIR__ . '/vendor/autoload.php';

\Stripe\Stripe::setApiKey("sk_test_BQokikJOvBiI2HlWgH4olfQ2");

define('LOGIN', 'https://easytrades.herokuapp.com/login');

use Symfony\Component\HttpFoundation\Request;

class Pointers
{

    protected $http;

    protected $client;

    public $options = [
        'headers' => [
            'Content-type' => 'application/x-www-form-urlencoded'
        ]
    ];

    public function __construct()
    {
        $this->http = Request::createFromGlobals();

        //Base URL for the API Call
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
                    'status' => 'false'
                ]);
            }
        }
    }

    /**
     * Register Profile
     */
    private function sign_up()
    {

        $this->options['headers'] = [
            'Content-type' => 'application/json'
        ];

        $this->options = array_merge($this->options, [
            'body' => $this->http->headers->get('data')
        ]);

        $request = $this->client->request('POST', '/signup/', $this->options);
        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }

    }

    /**
     * Get profile employee
     */
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

    /**
     * Update profile employee
     */
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

            $request = $this->client->request('POST', '/employee/' . $this->http->headers->get('username') . '/details', $this->options);
            if ($request->getStatusCode() === 200) {
                $request = \GuzzleHttp\json_decode($request->getBody());
                $this->output($request);
            }
        }
        $this->output([
            'status' => false
        ]);
    }

    /**
     * Update locations employee
     */
    private function updateLocations()
    {

        $this->options['headers'] = [
            'Content-type' => 'application/json',
            'Authorization' => $this->http->headers->get('JWT_TOKEN')
        ];

        $this->options = array_merge($this->options, [
            'body' => $this->http->headers->get('data')
        ]);

        $request = $this->client->request('POST', '/employee/' . $this->http->headers->get('username') . '/location', $this->options);

        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }
    }

    /**
     * Update skills employee
     */
    private function updateSkills()
    {

        $this->options['headers'] = [
            'Content-type' => 'application/json',
            'Authorization' => $this->http->headers->get('JWT_TOKEN')
        ];

        $this->options = array_merge($this->options, [
            'body' => $this->http->headers->get('data')
        ]);

        $request = $this->client->request('POST', '/employee/'.$this->http->headers->get('username').'/skills', $this->options);

        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }
    }

    /*
     * Update employee Experience
     */
    private function updateExperience()
    {

        $this->options['headers'] = [
            'Content-type' => 'application/json',
            'Authorization' => $this->http->headers->get('JWT_TOKEN')
        ];

        $this->options = array_merge($this->options, [
            'body' => $this->http->headers->get('data')
        ]);

        $request = $this->client->request('POST', '/employee/' . $this->http->headers->get('username') . '/experience', $this->options);

        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }
    }

    /*
     * Update employee Billing setp 01
     */
    private function billing_step_one()
    {

        $this->options['headers'] = [
            'Content-type' => 'application/json',
            'Authorization' => $this->http->headers->get('JWT_TOKEN')
        ];

        $this->options = array_merge($this->options, [
            'body' => $this->http->headers->get('data')
        ]);

        $request = $this->client->request('POST', '/user/billing/bank', $this->options);

        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }
    }

    /*
     * Update employee Billing step 02
     */
    private function billing_step_two()
    {

        $this->options['headers'] = [
            'Content-type' => 'application/json',
            'Authorization' => $this->http->headers->get('JWT_TOKEN')
        ];

        $this->options = array_merge($this->options, [
            'body' => $this->http->headers->get('data')
        ]);

        $request = $this->client->request('POST', '/user/billing/', $this->options);

        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }
    }

    /*
     * Update file information for verify
     */
    private function billing_step_verify()
    {

        $this->options['headers'] = [
            'Content-type' => 'application/json',
            'Authorization' => $this->http->headers->get('JWT_TOKEN')
        ];

        $this->options = array_merge($this->options, [
            'body' => $this->http->headers->get('data')
        ]);

        $request = $this->client->request('POST', '/user/billing/verify', $this->options);

        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }
    }

    private function search_jobs()
    {
        $this->options['headers'] = [
            'Content-type' => 'application/json'
        ];

        $request = $this->client->request('GET', '/employer/job/search?location=' . $this->http->headers->get('location') . '&skill=' . $this->http->headers->get('skill'), $this->options);

        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }


    }

    private function add_time_sheet()

    {

        $this->options['headers'] = [
            'Content-type' => 'application/json',
            'Authorization' => $this->http->headers->get('JWT_TOKEN')
        ];

        $this->options = array_merge($this->options, [
            'body' => $this->http->headers->get('data')
        ]);

        $request = $this->client->request('POST', '/employee/' . $this->http->headers->get('username') . '/timesheet', $this->options);

        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }

    }

    private function approve_time_sheet_employee()
    {
        $this->options['headers'] = [
            'Content-type' => 'application/json',
            'Authorization' => $this->http->headers->get('JWT_TOKEN')
        ];

        $request = $this->client->request('PUT', '/employee/timesheet/' . $this->http->headers->get('contract_id') . '/' . $this->http->headers->get('time_sheet_id'), $this->options);

        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }
    }

    private function recontest_time_sheet_employee()
    {
        $this->options['headers'] = [
            'Content-type' => 'application/json',
            'Authorization' => $this->http->headers->get('JWT_TOKEN')
        ];

        $request = $this->client->request('PUT', '/employee/timesheet/' . $this->http->headers->get('contract_id') . '/' . $this->http->headers->get('time_sheet_id'), $this->options);

        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }
    }


    /* EMPLOYER FUNCTION */

    private function update_profile_employer()
    {

        $this->options['headers'] = [
            'Content-type' => 'application/json',
            'Authorization' => $this->http->headers->get('JWT_TOKEN')
        ];

        $this->options = array_merge($this->options, [
            'body' => $this->http->headers->get('data')
        ]);

        $request = $this->client->request('POST', '/employer/' . $this->http->headers->get('username') . '/update', $this->options);

        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }

    }

    private function view_all_jobs_employer()
    {
        $this->options['headers'] = [
            'Content-type' => 'application/json',
            'Authorization' => $this->http->headers->get('JWT_TOKEN')
        ];

        $request = $this->client->request('GET', '/employer/job', $this->options);

        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }

    }

    private function view_single_job()
    {

        $this->options['headers'] = [
            'Content-type' => 'application/json',
            'Authorization' => $this->http->headers->get('JWT_TOKEN')
        ];


        $request = $this->client->request('GET', '/employer/job?id=' . $this->http->headers->get('job_id'), $this->options);

        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }

    }

    private function send_invitations()
    {


        $this->options['headers'] = [
            'Content-type' => 'application/json',
            'Authorization' => $this->http->headers->get('JWT_TOKEN')
        ];
        $this->options = array_merge($this->options, [
            'body' => $this->http->headers->get('data')
        ]);


        $request = $this->client->request('POST', '/employer/hire/' . $this->http->headers->get('job_id'), $this->options);


        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }
    }

    private function contest_time_sheet()
    {


        $this->options['headers'] = [
            'Content-type' => 'application/json',
            'Authorization' => $this->http->headers->get('JWT_TOKEN')
        ];
        $this->options = array_merge($this->options, [
            'body' => $this->http->headers->get('data')
        ]);


        $request = $this->client->request('POST', '/employer/timesheet/' . $this->http->headers->get('contract_id') . '/' . $this->http->headers->get('time_sheet_id'), $this->options);


        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }
    }

    private function approve_time_sheet()
    {
        $this->options['headers'] = [
            'Content-type' => 'application/json',
            'Authorization' => $this->http->headers->get('JWT_TOKEN')
        ];

        $request = $this->client->request('PUT', '/employer/timesheet/' . $this->http->headers->get('contract_id') . '/' . $this->http->headers->get('time_sheet_id'), $this->options);


        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }
    }

    private function created_by()
    {
        $this->options['headers'] = [
            'Content-type' => 'application/json',
            'Authorization' => $this->http->headers->get('JWT_TOKEN')
        ];

        $request = $this->client->request('GET', '/employer/timesheets?CreatedBy=' . $this->http->headers->get('created-by'), $this->options);


        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }
    }

    private function post_job_employer()
    {
        $this->options['headers'] = [
            'Content-type' => 'application/json',
            'Authorization' => $this->http->headers->get('JWT_TOKEN')
        ];


        $this->options = array_merge($this->options, [
            'body' => $this->http->headers->get('data')
        ]);

        $request = $this->client->request('POST', '/employer/job', $this->options);


        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }

    }

    private function stripe_token()
    {

        $request = \Stripe\Token::create(array(
            "card" => array(
                "number" => $this->http->headers->get('number'),
                "exp_month" => $this->http->headers->get('exp_month'),
                "exp_year" => $this->http->headers->get('exp_year'),
                "cvc" => $this->http->headers->get('cvc')
            )
        ));

        $this->output($request);

    }

    private function add_card()
    {
        $this->options['headers'] = [
            'Content-type' => 'application/json'
        ];
        $this->options = array_merge($this->options, [
            'body' => $this->http->headers->get('data')
        ]);

        $request = $this->client->request('POST', '/user/billing', $this->options);

        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }
    }

    private function API()
    {

        $this->options['headers'] = [
            'Content-type' => 'application/json',
            'Authorization' => $this->http->headers->get('JWT_TOKEN')
        ];

        $this->options = array_merge($this->options, [
            'body' => $this->http->headers->get('data')
        ]);

        $request = $this->client->request($this->http->headers->get('request_method'), $this->http->headers->get('request_url'), $this->options);

        if ($request->getStatusCode() === 200) {
            $request = \GuzzleHttp\json_decode($request->getBody());
            $this->output($request);
        }

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


new Pointers();