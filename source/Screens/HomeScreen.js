import { useEffect, useState } from "react";
import { NativeModules, View, PermissionsAndroid, Text, StyleSheet, Button, ToastAndroid, ScrollView, TextInput, TouchableOpacity, Alert, Image } from "react-native"
import DeviceInfo from "react-native-device-info";
import NetInfo from '@react-native-community/netinfo';
import CustomButton from "../Components/CustomButton";
import { saveDetails } from "../Services/ApiHelper";
import { closeAlert, showAlert } from "react-native-customisable-alert";
import { _ALERT_IMAGES } from "../../util/Constants";


const HomeScreen = props => {
    const { Telephony } = NativeModules;

    const [cellInfo, setCallInfo] = useState([]);
    const [carrier, setCarrier] = useState("");
    const [networkInfo, setNetWorkInfo] = useState({});
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const removeNetInfo = NetInfo.addEventListener((state = {}) => {
            state = { "details": { "carrier": "airtel", "cellularGeneration": "4g", "isConnectionExpensive": true }, "isConnected": true, "isInternetReachable": false, "isWifiEnabled": false, "type": "cellular" }
            const { type = "", isConnected, details: { cellularGeneration = "" } = {} } = state;
            setNetWorkInfo({
                type,
                isConnected,
                cellularGeneration
            })
        });

        return () => removeNetInfo;
    }, [])

    useEffect(() => fetchTacAndLac(), [networkInfo]);

    const fetchTacAndLac = (showToast = false) => {
        if (networkInfo.isConnected && networkInfo.type != 'wifi') {
            requestPermissions(flag => {
                if (flag) {
                    DeviceInfo.getCarrier().then((carrier) => {
                        Telephony.getCellInfo(info => {
                            const list = [];
                            info.forEach(element => {
                                const { cellIdentity, connectionType, data } = element;
                                if (cellIdentity.tac && list.some(obj => obj.tac == cellIdentity.tac)) return;
                                if (cellIdentity.lac && list.some(obj => obj.lac == cellIdentity.lac)) return;
                                list.push({ ...cellIdentity, connectionType });
                            });
                            setCarrier(carrier);
                            setCallInfo(list)
                            setCarrier("JIO");
                            setCallInfo([{ "cid": 46771211, "connectionType": "LTE", "eNodeB": 182700, "earfcn": 1301, "localCellId": 11, "mcc": 404, "mnc": 45, "pci": 259, "servingCellFlag": true, "tac": 8279 }, { "cid": 2147483647, "connectionType": "LTE", "eNodeB": 8388607, "earfcn": 1301, "localCellId": 255, "mcc": 2147483647, "mnc": 2147483647, "pci": 392, "servingCellFlag": false, "tac": 2147483647 }, { "cid": 2147483647, "connectionType": "GSM", "lac": 2147483647, "mcc": 2147483647, "mnc": 2147483647, "psc": 2147483647 }])
                            showToast && ToastAndroid.show("Updated...", ToastAndroid.SHORT);
                        })
                    });
                }
            });
        } else {
            showToast && ToastAndroid.show("Connect to mobile network...", ToastAndroid.SHORT);
        }
    }

    async function requestPermissions(callback) {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            ]);

            if (
                granted["android.permission.READ_PHONE_STATE"] === PermissionsAndroid.RESULTS.GRANTED &&
                granted["android.permission.ACCESS_COARSE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED &&
                granted["android.permission.ACCESS_FINE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED
            ) {
                callback(true);
            } else {
                callback(false);
            }
        } catch (err) {
            callback(false);
            console.warn(err);
        }
    }

    const renderDetailsHeader = () => {
        return (
            <View style={styleSheet.HeaderContainer}>
                <View>
                    <Text style={{ ...styleSheet.DetailsText }}>Carrier: {carrier}</Text>
                    <Text style={{ ...styleSheet.DetailsText }}>Cellular Generation: {networkInfo.cellularGeneration.toUpperCase()}</Text>
                </View>
                <TextInput
                    style={styleSheet.InputContainer}
                    value={name}
                    editable={!loading}
                    placeholder="Enter Name *"
                    placeholderTextColor={"grey"}
                    onChangeText={text => setName(text)}
                />
            </View>
        )
    }

    const renderCellInfo = () => (
        <View>
            <View style={styleSheet.DetailsContainer}>
                {renderDetailsHeader()}
                <Text style={{ ...styleSheet.DetailsText, borderBottomWidth: 2, marginTop: 15 }}>Details</Text>
                {cellInfo.map((item, index) => {
                    const { connectionType = "", tac = "", lac = "" } = item;
                    return (
                        <View key={index} style={{ marginVertical: 10, borderWidth: 1, borderRadius: 9, padding: 10 }}>
                            <Text style={{ display: connectionType != "" ? 'flex' : 'none', ...styleSheet.DetailsText }}>
                                Connection Type: {connectionType}
                            </Text>
                            <Text style={{ display: tac != "" ? 'flex' : 'none', ...styleSheet.DetailsText }}>
                                TAC: {tac}
                            </Text>
                            <Text style={{ display: lac != "" ? 'flex' : 'none', ...styleSheet.DetailsText }}>
                                LAC: {lac}
                            </Text>
                        </View>
                    )
                })}
                <View style={{
                    flexDirection: "row",
                    marginVertical: 10,
                    justifyContent: "space-around",
                    alignItems: "center"
                }} >
                    <CustomButton
                        label={"Refresh"}
                        onPress={fetchTacAndLac.bind(this, true)}
                        backgroundColor="black"
                        color="white"
                        width="45%"
                    />
                    <CustomButton
                        label={"Save"}
                        onPress={saveData}
                        backgroundColor="black"
                        color="white"
                        width="45%"
                        loading={loading}
                    />
                </View>
            </View>
        </View>
    )

    const saveData = () => {
        const { cellularGeneration } = networkInfo;
        if (name == "") {
            showAlert({
                title: "Incomplete Date",
                alertType: "error",
                customIcon: _ALERT_IMAGES.ERROR,
                message: "Please Enter Name...",
                onPress: closeAlert,
            });
            return
        }
        setLoading(true);
        const payload = {
            cellularGeneration,
            carrier,
            cellInfo,
            name,
            date: new Date(),
            isCellInfo: true
        };
        saveDetails(payload, (flag, response) => {
            setLoading(false);
            if (
                flag &&
                response.res_code == 100
            ) {
                setName('');
                showAlert({
                    title: "Success",
                    alertType: "success",
                    customIcon: _ALERT_IMAGES.SUCCESS,
                    message: "Saveed Success...",
                    onPress: closeAlert,
                });
            } else {
                showAlert({
                    title: "Error",
                    alertType: "error",
                    customIcon: _ALERT_IMAGES.ERROR,
                    message: "Failed to save...",
                    onPress: closeAlert,
                });
            }
        })
    }

    const renderNoNetworkAndWifiView = message => (
        <View style={styleSheet.DetailsContainer}>
            <Text style={{ ...styleSheet.Title, marginTop: 0, color: '#676565', }}>{message}</Text>
            <Text style={{ ...styleSheet.DetailsText, marginVertical: 15, textAlign: "center" }}>Connection: {networkInfo.type}</Text>
            <Button title="Refresh" onPress={fetchTacAndLac} color={"black"} />
        </View>
    )

    return (
        <View style={styleSheet.MainContainer}>
            <ScrollView style={{ flex: 1 }}>
                <View style={styleSheet.MainContainer}>
                    {networkInfo.isConnected ? networkInfo.type != "wifi" ? renderCellInfo() : renderNoNetworkAndWifiView("Switch from Wifi to Mobile Network and refresh...") : renderNoNetworkAndWifiView("Connect to internet and refresh...")}
                </View>
            </ScrollView>
        </View>
    );
}

const styleSheet = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: '#5c5959'
    },
    Title: {
        color: '#f3ebeb',
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: '5%',
    },
    DetailsContainer: {
        margin: "6%",
        backgroundColor: "white",
        padding: '5%',
        elevation: 9,
        borderRadius: 8
    },
    DetailsText: {
        fontSize: 18,
        fontWeight: '700'
    },
    HeaderContainer: {
        justifyContent: "center",
        marginVertical: 10,
    },
    InputContainer: {
        width: '100%',
        backgroundColor: '#f4f2f2',
        padding: 10,
        marginTop: 8,
        borderRadius: 4,
        borderWidth: 1
    },
    Button: {
        backgroundColor: "black",
        width: "45%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        elevation: 10
    },
    ButtonText: {
        color: "white",
        textAlign: "center",
        fontWeight: 'bold',
        padding: 10
    }
});

export default HomeScreen;