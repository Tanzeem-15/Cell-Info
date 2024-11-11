import { useEffect, useState } from "react";
import { NativeModules, View, PermissionsAndroid, Text, StyleSheet, Button, ToastAndroid, ScrollView, Dimensions, Alert } from "react-native"
import DeviceInfo from "react-native-device-info";
import NetInfo from '@react-native-community/netinfo';

const App = props => {
  const { Telephony, CellInfo } = NativeModules;

  const [cellInfo, setCallInfo] = useState([]);
  const [carrier, setCarrier] = useState("");
  const [networkInfo, setNetWorkInfo] = useState({});

  useEffect(() => {
    const removeNetInfo = NetInfo.addEventListener(state => {
      setNetWorkInfo({
        type: state.type,
        isConnected: state.isConnected
      })
    });

    return () => removeNetInfo;
  }, [])

  useEffect(() => fetchTacAndLac(), [networkInfo]);

  const fetchTacAndLac = () => {
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
              // setCarrier("JIO");
              // setCallInfo([{ "cid": 46771211, "connectionType": "LTE", "eNodeB": 182700, "earfcn": 1301, "localCellId": 11, "mcc": 404, "mnc": 45, "pci": 259, "servingCellFlag": true, "tac": 8279 }, { "cid": 2147483647, "connectionType": "LTE", "eNodeB": 8388607, "earfcn": 1301, "localCellId": 255, "mcc": 2147483647, "mnc": 2147483647, "pci": 392, "servingCellFlag": false, "tac": 2147483647 }, { "cid": 2147483647, "connectionType": "GSM", "lac": 2147483647, "mcc": 2147483647, "mnc": 2147483647, "psc": 2147483647 }])
              ToastAndroid.show("Updated...", ToastAndroid.SHORT);
            })
          });
        }
      });
    } else {
      ToastAndroid.show("Connect to mobile network...", ToastAndroid.SHORT);
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
        console.log("Permissions granted");
        callback(true);
      } else {
        callback(false);
        console.log("Permissions denied");
      }
    } catch (err) {
      callback(false);
      console.warn(err);
    }
  }

  const renderCellInfo = () => (
    <View>
      <Text style={styleSheet.Title}>Cell Info</Text>
      <View style={styleSheet.DetailsContainer}>
        <Text style={{ ...styleSheet.DetailsText, marginVertical: 10 }}>Carrier: {carrier}</Text>
        {cellInfo.map((item, index) => {
          const { connectionType = "", tac = "", lac = ""} = item;
          return (
            <View key={index}>
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
        <View style={{ marginVertical: 10 }} />
        <Button title="Refresh" onPress={fetchTacAndLac} color={"black"} />
      </View>
    </View>
  )

  const renderNoNetworkAndWifiView = message => (
    <View style={styleSheet.DetailsContainer}>
      <Text style={{ ...styleSheet.Title, marginTop: 0, }}>{message}</Text>
      <Text style={{ ...styleSheet.DetailsText, marginVertical: 15, textAlign: "center" }}>Connection: {networkInfo.type}</Text>
      <Button title="Refresh" onPress={fetchTacAndLac} color={"black"} />
    </View>
  )

  return (
    <ScrollView style={{}}>
      <View style={styleSheet.MainContainer}>
        {networkInfo.isConnected ? networkInfo.type != "wifi" ? renderCellInfo() : renderNoNetworkAndWifiView("Switch from Wifi to Mobile Network and refresh...") : renderNoNetworkAndWifiView("Connect to internet and refresh...")}
      </View>
    </ScrollView>
  )
}

const styleSheet = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },
  Title: {
    color: '#c7c5c5',
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
  }
});

export default App;