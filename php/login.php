<?php include 'config.php';?>
<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data_string = file_get_contents("php://input");
    $serviceName = $_REQUEST['serviceName'];
    $hostName = $_SERVER['HTTP_HOST'];
    echo serverCall($data_string, $serviceName);
}

function serverCall($dataToBeSent, $serviceName)
{

    $url = CONFIG::getAlfrescoURL().$serviceName;
    // error_log('CALLIN : ' . $url);
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $dataToBeSent);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($dataToBeSent))
    );

    $result = curl_exec($ch);
    $obj = json_decode($result);
    $http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    http_response_code($http_status);
    // unset($_COOKIE['p365WidgetKey']);
    // unset($_COOKIE['userName']);
    setcookie("p365WidgetKey", '', -1, "/", $hostName, true, true);
    setcookie("userName", '', -1, "/", $hostName, true, true);
      if($http_status=='200' || $http_status=='201'){
        $resultArray = $obj;
        // $timeout = 36000 * 1000 + time();
        $timeout = time()+2592000; //30 days timeout
        $tokenKeyVal=$resultArray->{'accessToken'}->{'tokenType'}. $resultArray->{'accessToken'}->{'tokenValue'};
        setcookie("p365WidgetKey", $tokenKeyVal, $timeout, "/", $hostName, true, true);
        // get the user's email id from the request parameters, and set it into cookie, needed for freshdesk sso
        $paramsJson = json_decode($dataToBeSent);
        $userEmailId = $paramsJson->{'userId'};
        setcookie("userName", $userEmailId, $timeout, "/", $hostName, true, true);
      }
      $result = json_encode($obj);
      return $result;
}

?>
