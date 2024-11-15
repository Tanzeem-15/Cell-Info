import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";

const CustomButton = ({
    onPress,
    label,
    backgroundColor = "black",
    width = "90%",
    color = "white",
    loading = false
}) => {
    return (
        <TouchableOpacity
            disabled={loading}
            activeOpacity={.7}
            onPress={onPress}
            style={{
                ...styleSheet.Button,
                backgroundColor,
                width,
            }}
        >
            {loading ?
                <ActivityIndicator size={20} color={'white'} style={styleSheet.IndicatorStyle} />
                :
                <Text
                    style={{
                        ...styleSheet.ButtonText,
                        color,
                    }}
                >
                    {label}
                </Text>}
        </TouchableOpacity>
    );
}

const styleSheet = StyleSheet.create({
    Button: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        elevation: 10
    },
    ButtonText: {
        textAlign: "center",
        fontWeight: 'bold',
        padding: 10
    },
    IndicatorStyle: {
        padding: 10
    }
});

export default CustomButton;