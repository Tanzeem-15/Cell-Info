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
        callback(true, response.data, request, url);
    }).catch((error) => {
        console.log('Failed');
        callback(false, processError(error), request, url);
    });
};

export const saveDetails = (doc, callback) => {
    //TODO need to use
    //counterColl: "m_cellinfo_dtls",
    //key: "mobileapp.cellInfo_details"
    const request = {
        envelope: {
            payload: {
                generic: {
                    doc,
                    counterColl: "m_device_dtls",
                    key: "mobileapp.device_unique_details"
                }
            },
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

    post(
        _URL_LIST.store_data,
        JSON.stringify(request),
        callback
    )
}

export const fetchDetails = (callback) => {
    //TODO need to use
    //key: "mobileapp.cellInfo_details"
    const request = {
        envelope: {
            payload: {
                generic: {
                    query: {},
                    key: "mobileapp.device_unique_details"
                }
            },
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

    post(
        _URL_LIST.fetch_data,
        JSON.stringify(request),
        callback
    )
}