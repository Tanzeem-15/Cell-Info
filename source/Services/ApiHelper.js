import axios from "axios";
import { _IP, _URL_LIST } from "../../util/Constants";
import NetInfo from '@react-native-community/netinfo';

export const isNetworkAvailable = (callback) => {
    NetInfo.fetch().then(state => callback(state.isConnected));
};

export const post = async (url, request, callback) => {
    isNetworkAvailable(flag => {
        if (flag) {
            axios.post(_IP + url, request, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Basic YWRtaW46YWRtaW4jMTIz',
                    ecrypt: false,
                },
            }).then((response) => {
                console.log('SUCCESS');
                const responseData = response.data;
                console.log(`[URL]${_IP + url}\n[Request]${request}\n[Response]${JSON.stringify(responseData)}`);
                callback(true, responseData, request, url);
            }).catch((error) => {
                console.log('Failed');
                console.log(`[URL]${_IP + url}\n[Request]${request}\n[Response]${JSON.stringify(error)}`);
                callback(false, error, request, url);
            });
        } else {
            callback(false, { res_code: -1, res_msg: "No internet connection" }, request, url);
        }
    });
};

export const prepareRequest = payload => {
    const request = {
        envelope: {
            payload,
            header: {
                uid: 30001,
                org_type: 5,
                pwd: "Admin@1234",
                tz: "20241112190156",
                chnl: "Mobile-Self",
                orgid: 20,
                uname: "EIADMIN",
                locale: "en",
                timezoneOffset: -330,
                src: "i",
                utype: 730,
                nodeid: 20,
                rqst: "Create",
                imei_number_id: "6862c67574a08562",
                app_version: "1.0",
            }
        }
    }
    return JSON.stringify(request);
}

export const saveDetails = (doc, callback) => {
    //TODO need to use
    //counterColl: "m_cellinfo_dtls",
    //key: "mobileapp.cellInfo_details"
    post(
        _URL_LIST.store_data,
        prepareRequest({
            generic: {
                doc,
                counterColl: "m_cellinfo_dtls",
                key: "mobileapp.cellInfo_details"
            }
        }),
        callback
    )
}

export const fetchDetails = (callback) => {
    //TODO need to use
    //key: "mobileapp.cellInfo_details"
    post(
        _URL_LIST.fetch_data,
        prepareRequest({
            generic: {
                query: {},
                key: "mobileapp.cellInfo_details"
            }
        }),
        callback
    )
}