import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Features = () => {
  return (
    <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Features</Text>
      <View style={[styles.featureContainer,{backgroundColor:'rgb(167 243 208)'}]}>
        <View style={styles.featureIconContainer}>
          <Image source={require('../../assets/images/chatgptIcon.png')} style={styles.featureIcon} />
          <Text style={styles.featureTitle}>ChatGPT</Text>
        </View>
        <Text style={styles.featureDescription}>
          ChatGPT can provide you with instant and knowledgeable responses, assist you with creative ideas on a wide range of topics.
        </Text>
      </View>


      <View style={[styles.featureContainer,{backgroundColor:'rgb(233 213 255)'}]}>
        <View style={styles.featureIconContainer}>
          <Image source={require('../../assets/images/dalleIcon.png')} style={styles.featureIcon} />
          <Text style={styles.featureTitle}>DALL-E</Text>
        </View>
        <Text style={styles.featureDescription}>
          DALL-E can generate imaginative and diverse images from textual descriptions, expanding the boundaries of visual creativity.
        </Text>
      </View>
      <View style={[styles.featureContainer,{backgroundColor:'rgb(165 243 252)'}]}>
        <View style={styles.featureIconContainer}>
          <Image source={require('../../assets/images/smartaiIcon.png')} style={styles.featureIcon} />
          <Text style={styles.featureTitle}>Smart AI</Text>
        </View>
        <Text style={styles.featureDescription}>
          A powerful voice assistant with the abilities of ChatGPT and DALL-E, providing you the best of both worlds.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(60),
    padding:wp(2.5)
  },
  title: {
    fontSize: wp(6.5),
    fontWeight: 'bold',
    color: 'rgb(55 65 81)',
  },
  featureContainer: {
    // backgroundColor: 'light-green', // Change this to your desired color
    padding: hp(2),
    borderRadius: 15,
    marginVertical: hp(2),
  },
  featureIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  featureIcon: {
    height: hp(4),
    width: hp(4),
    borderRadius: hp(2),
    marginRight: hp(1),
  },
  featureTitle: {
    fontSize: wp(4.8),
    fontWeight: 'bold',
    color: 'rgb(55 65 81)',

  },
  featureDescription: {
    fontSize: wp(3.8),
    fontWeight: '500',
    color: 'rgb(55 65 81)',

  },
});

export default Features;
