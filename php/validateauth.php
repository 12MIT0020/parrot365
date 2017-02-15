<?php include 'config.php';?>
<?php
try {
    $tokenKey = null;
    if (isset($_COOKIE['p365WidgetKey'])) {
        $tokenKey = $_COOKIE['p365WidgetKey'];
    }
    $serviceName = $_REQUEST['serviceName'];
    $hostName = $_SERVER['HTTP_HOST'];
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $queryParam = $_SERVER["QUERY_STRING"];
        //Call to send/recieve data from server
        echo serverCall($queryParam, $tokenKey, $serviceName);
    }
}
catch (Exception $e)
{
  error_log("Error occurred: ".Config::getUnhandledExceptionResponse($e) );
  echo Config::getUnhandledExceptionResponse($e);
}

function serverCall($params, $cookieValue, $serviceName){
    $finalUrl = CONFIG::getAlfrescoURL() . $serviceName;
    // error_log('CALLIN : ' . $finalUrl);
    $ch = curl_init($finalUrl);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, '300');
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Authorization:'.$cookieValue
          )
    );
    // error_log('Current cookie: ' . $cookieValue);
    // error_log('Sending cookie : ' . $finalUrl);
    $result = trim(curl_exec($ch));
    $obj = json_decode($result);
    // error_log('CALLED : ' . $finalUrl);
    $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    http_response_code($http_status);
    if($http_status=='200' || $http_status=='201'){
      $resObj = new stdClass();
      $resObj -> tokenVal = $cookieValue;
      $result=$obj.json_encode($resObj);
    }else if($http_status=='400' || $http_status=='401'){
      $result=json_encode($obj);
    }
    // if (curl_errno($ch)) {
    //     error_log('Curl error: ' . curl_error($ch));
    // }
    curl_close($ch);
    return $result;
}
?>
