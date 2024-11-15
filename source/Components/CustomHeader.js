import { Image, StyleSheet, Text, View } from 'react-native';

const CustomHeader = ({
    title = "",
    child = null
}) => {
    return (
        <View style={styleSheet.MainContainer}>
            <View style={styleSheet.TitleContainer}>
                <Image
                    source={require('../../assets/images/Cellinfo.png')}
                    style={styleSheet.IconStyle}
                />
                <Text style={styleSheet.TitleStyle}>{title}</Text>
            </View>
            {child}
        </View>
    );
}

const styleSheet = StyleSheet.create({
    MainContainer: {
        flexDirection: "row",
        width: '100%',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        elevation: 6
    },
    TitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    IconStyle: {
        height: 40,
        width: 40,
        borderRadius: 30,
        marginHorizontal: 10
    },
    TitleStyle: {
        fontSize: 25,
        fontWeight: 'bold'
    }
});

export default CustomHeader;