import { StyleSheet, Text, View, Button } from 'react-native';
import { Card } from 'react-native-paper';

const App = () => {
    const [color, setColor] = useState('blue');

    const changeColor = () => {
        if (color === 'blue') setColor('red');
        else setColor('blue');
    };

    return(
        <SafeAreaView style={styles.container}>
            <Text style={{
                borderColor: color,
            }}>
                This dummy app flips the color of a tile
            </Text>
            <Card style={{
                backgroundColor: color,
            }}/>
            <Pressable style={styles.button} onPress={changeColor}>
                <Text style={styles.buttonText}>Press me!</Text>
            </Pressable>
            {/* <Button title="Press me" /> */}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 8,
    },

    button: {
        backgroundColor: '#00008B',
        width: 100,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    }, 

    buttonText: {
        color: 'white',
    }
})
