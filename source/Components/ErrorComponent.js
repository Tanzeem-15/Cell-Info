import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ErrorComponent = ({message}) => {
    return (
        <View style={styleSheet.MainContainer}>
            <LottieView style={styleSheet.LottieView} source={require('../../assets/lottie/no_info.json')} loop autoPlay />
            <Text style={styleSheet.EmptyText}>{message}</Text>
        </View>
    );
}

const styleSheet = StyleSheet.create({
    MainContainer: {
        flex: 1,
        alignItems: "center",
        marginTop: "20%"
    },
    EmptyText: {
        fontSize: 25,
        fontWeight: "bold",
        color: 'grey',
        textAlign: "center"
    },
    LottieView: {
        height: 300,
        width: 200
    }
});

export default ErrorComponent;