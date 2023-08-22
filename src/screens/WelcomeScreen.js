import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      {/* title */}
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>CHITTI 7.0</Text>
        <Text style={styles.subtitleText}>The future is here, Generative AI.</Text>
      </View>

      {/* assistant image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/welcome.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* start button */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: wp(10),
    fontWeight: 'bold',
    color: 'gray',
  },
  subtitleText: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: 'gray',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    height: wp(75),
    width: wp(75),
  },
  button: {
    
    backgroundColor: '#48B39B',
    marginHorizontal: wp(5),
    paddingVertical: hp(2),
    borderRadius: wp(5),
  },
  buttonText: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});
