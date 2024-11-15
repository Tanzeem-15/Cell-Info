import { useEffect, useReducer, useState } from "react";
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { fetchDetails } from "../Services/ApiHelper";
import ErrorComponent from "../Components/ErrorComponent";
import moment from "moment";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import LottieView from "lottie-react-native";
import { closeAlert, showAlert } from "react-native-customisable-alert";
import { _ALERT_IMAGES } from "../../util/Constants";

const DetailsScreen = props => {

    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(false);
    const [update, refresh] = useReducer(current => !current, false);

    useEffect(() => {
        setLoading(true);
        fetchDetails((flag, response) => {
            if (
                flag &&
                response.res_code == 100 &&
                response.payload
            ) {
                const details = response.payload.map(obj => {
                    const { cellInfo = [] } = obj;
                    const tac = cellInfo.reduce((acc, obj) => obj.tac ? `${acc == "" ? acc : acc + "\n"}${obj.tac}` : acc, "")
                    const lac = cellInfo.reduce((acc, obj) => obj.lac ? `${acc == "" ? acc : acc + "\n"}${obj.lac}` : acc, "")
                    return { ...obj, tac, lac }
                });
                setLoading(false);
                setDetails(details);
            } else {
                setLoading(false);
                setDetails([]);
                showAlert({
                    title: "Error",
                    message: response.res_msg || "Request Failed",
                    alertType: 'error',
                    customIcon: _ALERT_IMAGES.ERROR,
                    onDismiss: closeAlert
                })
            }
        })
    }, [update]);

    const tableView = () => {
        const tableHead = ['Name', 'Carrier', 'Generation', 'LAC', 'TAC', 'Date'];
        return (
            <ScrollView horizontal style={{ marginVertical: '4%', marginHorizontal: '2%' }}>
                <View style={{ marginBottom: 10 }}>
                    <View style={[styleSheet.TableMainContainer]}>
                        {tableHead.map((item, index) => (
                            <View key={index} style={[styleSheet.TableContainer, { backgroundColor: '#848383', paddingVertical: 10 }]}>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white' }}>{item}</Text>
                            </View>
                        ))}
                    </View>
                    <ScrollView>
                        {details.map((item, index1) => {
                            const { name, carrier, cellularGeneration, lac, tac, date } = item;
                            const list = [name, carrier, cellularGeneration.toUpperCase(), lac, tac, moment(date).format("DD-MM-YYYY HH:mm:ss")]
                            return (
                                <View key={index1} style={[styleSheet.TableMainContainer, { borderTopWidth: 0 }]}>
                                    {list.map((innerItem, innerIndex) => (
                                        <View key={innerIndex} style={styleSheet.TableContainer}>
                                            <Text style={{ textAlign: 'center' }}>{innerItem || ' - '}</Text>
                                        </View>
                                    ))}
                                </View>
                            )
                        })}
                    </ScrollView>
                </View>
            </ScrollView>
        )
    }

    return (
        <View style={styleSheet.MainContainer}>
            <View style={styleSheet.TitleContainer}>
                <Text style={styleSheet.TitleText}>Network Details</Text>
                <FontAwesome name="refresh" size={25} color="#676565" style={{ marginHorizontal: 10 }} onPress={refresh} />
            </View>
            {loading ?
                <View style={{ flex: 1, alignItems: "center" }}>
                    <LottieView source={require('../../assets/lottie/fetching_result.json')} loop autoPlay style={{ height: 300, width: 200 }} />
                    <Text style={styleSheet.LoadingText}>Loading...</Text>
                </View>
                :
                details.length > 0 ?
                    <View style={styleSheet.DetailsContainer}>
                        {tableView()}
                    </View>
                    :
                    <ErrorComponent message={"NO Information Available..."} />
            }

        </View>
    );
}

const styleSheet = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    DetailsContainer: {
        flex: 1
    },
    TitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 5,
        justifyContent: "space-between",
        borderBottomWidth: 1,
        marginHorizontal: '3%',
        marginTop: 10
    },
    TitleText: {
        fontSize: 20,
        fontWeight: '700',
    },
    TableContainer: {
        width: 110,
        borderRightWidth: 2,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    TableMainContainer: {
        flexDirection: 'row',
        borderWidth: 2,
        marginHorizontal: 5,
        borderRightWidth: 0,
    },
    LoadingText: {
        fontSize: 25,
        fontWeight: "bold",
        color: 'grey',
        textAlign: "center"
    }
});

export default DetailsScreen;