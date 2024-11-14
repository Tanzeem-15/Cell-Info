import { Image, Text, View } from 'react-native';

const CustomHeader = ({
    title = "",
    child = null
}) => {
    return (
        <View style={{
            flexDirection: "row",
            width: '100%',
            padding: 20,
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Image
                    source={require('../../assets/images/Cellinfo.png')}
                    style={{
                        height: 40,
                        width: 40,
                        borderRadius: 30,
                        marginHorizontal:10
                    }}
                />
                <Text style={{
                    fontSize:25,
                    fontWeight:'bold'
                }}>{title}</Text>
            </View>
            {child}
        </View>
    );
}

export default CustomHeader;