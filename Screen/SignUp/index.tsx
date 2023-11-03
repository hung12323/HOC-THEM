import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from 'react-native';
import {AppContext} from '../AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import Realm from 'realm';
import UserSchemaV2 from './UserSchema';
export default function SignUp({navigation}) {
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const {name, setName} = useContext(AppContext);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  useEffect(() => {}, []);
  const handleLogin = async () => {
    if (username === '') {
      setUsernameError('Vui lòng điền thông tin');
    } else {
      setUsernameError('');
    }

    if (pass === '') {
      setPasswordError('Vui lòng điền thông tin');
    } else {
      setPasswordError('');
    }

    if (username !== '' && pass !== '') {
      setError('');

      try {
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('password', pass);
      } catch (error) {
        console.log('Lỗi khi lưu thông tin đăng nhập:', error);
      }

      Alert.alert(`Chào mừng ${username} đăng nhập`);
      setName(username);
      navigation.navigate('HomePage');
    } else {
      setError('Vui lòng điền đủ thông tin');
    }
  };
  useEffect(() => {
    const retrieveLoginInfo = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem('username');
        const savedPassword = await AsyncStorage.getItem('password');
        if (savedUsername && savedPassword) {
          setUsername(savedUsername);
          setPass(savedPassword);
        }
      } catch (error) {
        console.log('Lỗi khi lấy thông tin đăng nhập:', error);
      }
    };

    retrieveLoginInfo();
  }, []);

  const handleRealmMigration = async () => {
    try {
      const realm = await Realm.open({
        schema: [UserSchemaV2],
        schemaVersion: 4,
        migration: (oldRealm, newRealm) => {
          // Di cư từ phiên bản 1 đến phiên bản 2
          if (oldRealm.schemaVersion < 4) {
            const oldUsers = oldRealm.objects('User');
            const newUsers = newRealm.objects('User');
            for (let i = 0; i < oldUsers.length; i++) {
              const {fullName, password} = oldUsers[i];
              newUsers[i].username = fullName;
              newUsers[i].pass = password;
            }
          }
        },
      });

      // Truy vấn dữ liệu từ Realm đã được di cư
      const users = realm.objects('User');
      console.log('Danh sách người dùng:', users);

      // Đóng Realm
      realm.close();
    } catch (error) {
      console.log('Lỗi khi sử dụng Realm:', error);
    }
  };
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.text}> Hello!</Text>
        <Text
          style={{
            color: 'black',
            fontSize: 20,
            marginLeft: 20,
            marginTop: 10,
            // marginBottom: 70,
          }}>
          Signup to get Started
        </Text>
        <Text style={{marginTop: 50, marginLeft: 20}}>Username*</Text>
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập "
          value={username}
          onChangeText={text => setUsername(text)}
        />
        <Text style={{color: 'red'}}>{usernameError}</Text>
        <Text style={{marginLeft: 20}}>Password*</Text>
        <View style={styles.pass}>
          <TextInput
            placeholder="Mật khẩu"
            value={pass}
            onChangeText={text => setPass(text)}
          />
          <Image
            style={{marginLeft: 250}}
            source={require('../../assets/8.png')}
          />
          <Text style={{color: 'red'}}>{passwordError}</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={isChecked}
            onValueChange={handleCheckboxChange}
            tintColors={{true: '#1877F2', false: 'gray'}}
            boxType="circle"
            lineWidth={1}
          />
          <Text style={styles.label}>Remember me </Text>
        </View>
        {/* <Text style={{color: 'red', alignSelf: 'center'}}>{error}</Text> */}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={{fontWeight: 'bold', color: 'white', fontSize: 18}}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRealmMigration}>
          <Text style={{fontWeight: 'bold', color: 'white', fontSize: 18}}>
            SignUp
          </Text>
        </TouchableOpacity>
        <Text style={styles.tex1}>or continue with</Text>
        <View style={styles.button3}>
          <View>
            <TouchableOpacity style={styles.button1}>
              <Image
                style={{marginRight: 10}}
                source={require('../../assets/9.png')}
              />
              <Text style={{fontWeight: 'bold', color: 'gray', fontSize: 18}}>
                Facebook
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={styles.button2}>
              <Image
                style={{marginRight: 10}}
                source={require('../../assets/10.png')}
              />
              <Text style={{fontWeight: 'bold', color: 'gray', fontSize: 18}}>
                Google
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.sig}>
        <Text style={{marginTop: 17}}>don’t have an account ?</Text>
        <TouchableOpacity
          style={styles.sig2}
          onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={{fontWeight: 'bold', color: '#1877F2', fontSize: 18}}>
            Sig in
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 140,
  },
  container: {},
  text: {
    color: '#1877F2',
    fontSize: 50,
    fontWeight: '700',
    marginLeft: 10,
  },

  input: {
    height: 40,
    width: 370,
    marginHorizontal: 16,
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 2,
    marginTop: 10,
    marginLeft: 20,
  },
  button: {
    height: 40,
    margin: 4,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal: 16,
    marginLeft: 20,
    marginTop: 15,
  },
  tex1: {
    color: 'gray',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
  },
  button1: {
    height: 40,
    width: 150,
    margin: 4,
    backgroundColor: '#C4C4C4',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginHorizontal: 16,
    marginLeft: 10,
    flexDirection: 'row',
  },
  button2: {
    height: 40,
    width: 150,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C4C4C4',
    borderRadius: 5,
    marginHorizontal: 16,
    marginLeft: 10,
    flexDirection: 'row',
  },
  button3: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  sig: {
    flexDirection: 'row',
    marginBottom: 100,
  },
  sig2: {
    margin: 4,
    marginHorizontal: 16,
    marginLeft: 20,
    marginTop: 15,
  },
  pass: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    width: 370,
    marginHorizontal: 16,
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 2,
    marginTop: 10,
    marginLeft: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  label: {
    marginLeft: 2,
    color: 'black',
  },
});
