<?php include 'config.php';?>
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // read and set token key only if it is required... if it is not required, parameter tokenRequired will be explicitely set to false
  if (isset($_COOKIE['p365WidgetKey']))
  {
      $tokenKey = $_COOKIE['p365WidgetKey'];
  }
  $serviceName = $_REQUEST['serviceName'];
  $queryParam = $_SERVER["QUERY_STRING"];
  $hostName = $_SERVER['HTTP_HOST'];
  echo serverCallForGET($queryParam, $tokenKey, $serviceName);
}

/**
 * Function to handle GET requests
 * @param $params
 * @param $cookieValue
 * @param $serviceName
 */
function serverCallForGET($params, $cookieValue, $serviceName)
{
    $finalUrl = CONFIG::getAlfrescoURL() . $serviceName;
    // error_log('CALLIN : ' . $finalUrl);
    $ch = curl_init($finalUrl);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_FRESH_CONNECT, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, '300');
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 0);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Authorization:'.$cookieValue)
    );
    $result = trim(curl_exec($ch));
    $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    http_response_code($http_status);
    // Check if any error occurred
    // if (curl_errno($ch)) {
    //     error_log('Curl error: ' . curl_error($ch));
    // }
    unset($_COOKIE['p365WidgetKey']);
    unset($_COOKIE['userName']);
    setcookie("p365WidgetKey", '', -1, "/", $hostName, true, true);
    setcookie("userName", '', -1, "/", $hostName, true, true);
    curl_close($ch);
    return $result;
}

?>
