<?php
class Config {

  /* Name of cookie for authentication token*/
  // const TOKEN_KEY_COOKIE_NAME = "tokenKey";
    const TOKEN_KEY_COOKIE_NAME = "p365WidgetKey";

  /* Name of cookie for email id of logged in user*/
  const WITTY_USER_EMAIL_ID = "wittyUserEmailId";

  /* App secret of freshdesk, to be used to hash the parameters for freshdesk sso*/
  const FRESHDESK_APP_SECRET_KEY = "ccd9c9bf6bf2627835d41f5ae4dd9596";

	/*
		Env Constants
	*/
	const WITTYENV_STAGE = "STAGE";
	const WITTYENV_QA = "QA";
	const WITTYENV_PROD = "PROD";

  const STAGE_ALFRESCO_URL = "http://52.3.79.236:8080/alfresco/service/acrowit/";

  const QA_ALFRESCO_URL = "https://qawittyapi.wittyparrot.com/wittyparrot/api";

  const PROD_ALFRESCO_URL = "http://apiserver1.wittyparrot.com:8080/alfresco/service/acrowit/";

	/*
		Public function to know which environment we are in currently. .The env is set in
	*/
	public static function getWittyEnv()
	{
		return getenv("WITTYPARROT_ENV");
	}
    /*
     returns the alfresco url based on env
    */
    public static function getAlfrescoURL()
    {
		$currentEnv = getenv("WITTYPARROT_ENV");
 		if( $currentEnv == null || !isset($currentEnv) ||  empty($currentEnv) )
    	{
    		 throw new Exception('WittyParrot configuration error.. environment variable not set.');
    	}

        $url = self::QA_ALFRESCO_URL;
        if($currentEnv)
        {
        	if(self::WITTYENV_STAGE === $currentEnv)
        	{
        		$url = self::STAGE_ALFRESCO_URL;
        	}
        	else if(self::WITTYENV_QA === $currentEnv)
        	{
 	      		$url = self::QA_ALFRESCO_URL;
         	}
        	else if(self::WITTYENV_PROD === $currentEnv)
        	{
        		$url = self::PROD_ALFRESCO_URL;
        	}
        	else if(self::WITTYENV_DEV === $currentEnv)
        	{
 	      		$url = self::DEV_ALFRESCO_URL;
         	}
         }
         return $url;
    }
}
?>
