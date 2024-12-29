import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionic from 'react-native-vector-icons/Ionicons';

const NextStep = ({ goNextStep }) => {

  return (
    <View style={styles.buttonContainer}>
       <TouchableOpacity onPress={goNextStep} style={styles.button}>
            <Ionic name="play-outline" size={70} color={'white'}/>
            <Text style={styles.buttonText}>next step</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        top: '60%',
        left: '42%',
    },
    button: {
        width: 170,
        height: 170,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 5,
    },
    buttonText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontFamily: 'TAEBAEKfont',

    },
 
})

export default NextStep