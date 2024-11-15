import axios from "axios";
import { _IP, _URL_LIST } from "../../util/Constants";

export const post = async (url, request, callback) => {
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
        const responseData = response.data;
        console.log(`[URL]${_IP + url}\n[Request]${request}\n[Response]${JSON.stringify(error)}`);
        callback(false, responseData, request, url);
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
                counterColl: "m_device_dtls",
                key: "mobileapp.device_unique_details"
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
                key: "mobileapp.device_unique_details"
            }
        }),
        callback
    )
}