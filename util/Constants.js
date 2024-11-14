import { Image } from 'react-native';

export const _IP = "http://50.19.153.241:8080";

export const _URL_LIST = {
    fetch_data: "/organization-services/generic/getByQuery",
    store_data: "/organization-services/generic/insert"
};

export const _ALERT_IMAGES = {
    WARNING: <Image source={require('../assets/images/warning.png')} style={{height: 60,width: 60}} />,
    SUCCESS: <Image source={require('../assets/images/success.png')} style={{height: 110,width: 110}} />,
    ERROR: <Image source={require('../assets/images/error.png')} style={{height: 80,width: 80}} />,
};