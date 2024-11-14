import { View, StyleSheet, TouchableOpacity, Text, Image, Alert } from "react-native"
import CustomHeader from "./source/Components/CustomHeader";
import HomeScreen from "./source/Screens/HomeScreen";
import { useReducer, useState } from "react";
import DetailsScreen from "./source/Screens/DetailsScreen";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomisableAlert from "react-native-customisable-alert";

const App = props => {

  const [isViewData, toggleView] = useReducer(current => !current, false);

  return (
    <View style={styleSheet.MainContainer}>
      <CustomHeader
        title="Cell Info"
        child={
          <View>
            <TouchableOpacity
              onPress={toggleView}
            >
              <MaterialCommunityIcons name={isViewData ? "file-edit" : "file-eye"} size={30} color={"#5c5959"} />
            </TouchableOpacity>
          </View>
        }
      />
      {isViewData ? <DetailsScreen /> : <HomeScreen />}
      <CustomisableAlert
        animationIn='rubberBand'
        animationOut='slideOutDown'
        titleStyle={styleSheet.AlertTitleStyle}
        alertContainerStyle={styleSheet.AlertContainerStyle}
        btnStyle={styleSheet.AlertBtnStyle}
        btnLabelStyle={styleSheet.AlertBtnLabelStyle}
        textStyle={styleSheet.AlertTextStyle}
      />
    </View>
  )
}

const styleSheet = StyleSheet.create({
  MainContainer: {
    flex: 1
  },
  AlertTitleStyle: {
    fontSize: 25,
    fontWeight: '700'
  },
  AlertContainerStyle: {
    width: '80%'
  },
  AlertBtnStyle: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    elevation: 10
  },
  AlertBtnLabelStyle: {
    textAlign: "center",
    fontWeight: 'bold',
    padding: 10
  },
  AlertTextStyle: {
    fontSize: 18,
    fontWeight: '500'
  }
});

export default App;