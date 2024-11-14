import { StyleSheet, Text, TouchableOpacity } from "react-native";

const CustomButton = ({
    onPress,
    label,
    backgroundColor = "black",
    width = "90%",
    color = "white"
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                ...styleSheet.Button,
                backgroundColor,
                width,
            }}
        >
            <Text
                style={{
                    ...styleSheet.ButtonText,
                    color,
                }}
            >
                {label}
            </Text>
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
    }
});

export default CustomButton;