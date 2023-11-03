import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Footer from './Footer';
const Detail = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.anh1} source={require('../assets/Icon.png')} />
        </TouchableOpacity>
        <Image style={styles.anh2} source={require('../assets/6.png')} />
      </View>
      <Image source={require('../assets/7.png')} />
      <Text style={styles.text}>
        Ukraine's President Zelensky to BBC: Blood money being paid for Russian
        oil
      </Text>
      <Text style={styles.text1}>
        Ukrainian President Volodymyr Zelensky has accused European countries
        that continue to buy Russian oil of "earning their money in other
        people's blood".{'\n'}
      </Text>
      <Text style={styles.text2}>
        In an interview with the BBC, President Zelensky singled out Germany and
        Hungary, accusing them of blocking efforts to embargo energy sales, from
        which Russia stands to make up to £250bn ($326bn) this year.
      </Text>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  head: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
    marginBottom: 20,
    // marginTop: 40,
    marginLeft: 1,
  },
  anh1: {
    marginLeft: -10,
    marginTop: 50,
  },
  anh2: {
    marginLeft: 330,
    marginTop: 50,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 15,
  },
  text1: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 15,
  },
  text2: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 5,
  },
  image1: {
    width: '88%',
    height: 150,
    marginHorizontal: 17,
    marginVertical: 15,
  },
});

export default Detail;
