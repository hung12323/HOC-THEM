import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {setArticles, setLoading, setPage} from './actions/articlesActions';
// import Head from '../Head';

const About: React.FC = () => {
  const articles = useSelector(state => state.articles);
  const loading = useSelector(state => state.loading);
  const page = useSelector(state => state.page);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    fetchNews();
  }, []);
  useEffect(() => {
    // Hàm handleSearch sẽ được gọi mỗi khi searchQuery thay đổi
    const handleSearch = async () => {
      try {
        dispatch(setLoading(true));

        let url = `https://newsapi.org/v2/everything?q=tesla&sortBy=publishedAt&apiKey=548d98c0e74543179eb939adda12dbe4`;

        if (searchQuery !== '') {
          url = `https://newsapi.org/v2/everything?q=${searchQuery}&sortBy=publishedAt&apiKey=548d98c0e74543179eb939adda12dbe4`;
        }

        const response = await axios.get(url);
        const data = response.data;

        dispatch(setArticles(data.articles));
        setSearchResults(data.articles);
        dispatch(setLoading(false));
      } catch (error) {
        console.error('Error searching news:', error);
        dispatch(setLoading(false));
      }
    };

    handleSearch(); // Gọi handleSearch khi searchQuery thay đổi
  }, [searchQuery]);

  const fetchNews = async () => {
    try {
      dispatch(setLoading(true));

      let url = `https://newsapi.org/v2/everything?q=tesla&sortBy=publishedAt&apiKey=548d98c0e74543179eb939adda12dbe4`;

      if (searchQuery !== '') {
        url = `https://newsapi.org/v2/everything?q=${searchQuery}&sortBy=publishedAt&apiKey=548d98c0e74543179eb939adda12dbe4`;
      }

      const response = await axios.get(url);
      const data = response.data;

      if (page === 1) {
        dispatch(setArticles(data.articles));
      } else {
        dispatch(setArticles([...articles, ...data.articles]));
      }

      dispatch(setLoading(false));
    } catch (error) {
      console.error('Error fetching news:', error);
      dispatch(setLoading(false));
    }
  };
  const handleImagePress = (article: any) => {
    const {url} = article;
    navigation.navigate('NewsDetail', {url});
  };

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(setPage(1));

    if (searchQuery !== '') {
      handleSearch().then(() => {
        setRefreshing(false);
      });
    } else {
      fetchNews().then(() => {
        setRefreshing(false);
      });
    }
  };

  const handleLoadMore = () => {
    if (!loading) {
      dispatch(setPage(page + 1));

      if (searchQuery !== '') {
        handleSearch();
      } else {
        fetchNews();
      }
    }
  };
  // const renderArticle = ({item}: {item: any}) => {
  //   return (
  //     <View style={styles.articleContainer}>
  //       <TouchableOpacity onPress={() => handleImagePress(item)}>
  //         <View style={styles.list}>
  //           <Image source={{uri: item.urlToImage}} style={styles.image} />
  //           {/* <Text style={styles.userId}>{item.userId}</Text> */}
  //           <View>
  //             <Text style={styles.title}>{item.title}</Text>
  //             <Text style={styles.description}>{item.description}</Text>
  //           </View>
  //           {/* <TouchableOpacity onPress={() => handleImagePress(item)}> */}
  //         </View>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };
  const renderArticle = ({item}: {item: any}) => {
    const {urlToImage, title, description} = item;

    const handleImagePress = () => {
      if (urlToImage) {
        navigation.navigate('NewsDetail', {url: item.url});
      }
    };

    return (
      <View style={styles.articleContainer}>
        <TouchableOpacity onPress={handleImagePress}>
          <View style={styles.list}>
            {urlToImage ? (
              <Image source={{uri: urlToImage}} style={styles.image} />
            ) : (
              <View style={styles.placeholderImage} />
            )}
            <View style={styles.rightItem}>
              <Text style={styles.title} numberOfLines={3}>
                {title}
              </Text>
              <Text style={styles.description} numberOfLines={5}>
                {description}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View>
      {/* <Head /> */}
      <TouchableOpacity style={styles.head}>
        <Image
          style={styles.anh1}
          source={require('../../assets/Vector.png')}
        />
        <Image style={styles.anh2} source={require('../../assets/5.png')} />
      </TouchableOpacity>
      <View style={styles.search}>
        <TouchableOpacity>
          <Image
            style={{marginLeft: 5}}
            source={require('../../assets/4.png')}
          />
        </TouchableOpacity>
        <TextInput
          style={{marginLeft: 10}}
          placeholder="Search"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
      </View>
      <View style={styles.Trending}>
        <Text
          style={{
            color: 'black',
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: 20,
          }}>
          Trending
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Trending')}>
          <Text style={{color: 'black', marginLeft: 230, fontSize: 13}}>
            See all
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Detail')}>
        <View>
          <Image style={styles.image1} source={require('../../assets/7.png')} />
          <Text
            style={{
              fontSize: 17,
              fontWeight: 'bold',
              marginHorizontal: 17,
              color: 'black',
            }}>
            Russian warship: Moskva sinks in Black Sea
          </Text>
          <Text
            style={{
              marginHorizontal: 17,
              color: 'black',
            }}>
            Ukrainian President Volodymyr Zelensky has accused European
            countries that continue to buy Russian
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.text2}>
        <Text
          style={{
            color: 'black',
            fontSize: 22,
            fontWeight: 'bold',
            marginLeft: 20,
          }}>
          Latest
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Latest')}>
          <Text style={{color: 'black', marginLeft: 230, fontSize: 13}}>
            See all
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.text1}>
        <TouchableOpacity style={{marginHorizontal: 17}}>
          <Text style={{color: 'black', fontSize: 15}}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginHorizontal: 27}}>
          <Text style={{color: 'black', fontSize: 15}}>Sports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginHorizontal: 27}}>
          <Text style={{color: 'black', fontSize: 15}}>Politics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginHorizontal: 27}}>
          <Text style={{color: 'black', fontSize: 15}}>Bussiness</Text>
        </TouchableOpacity>
      </View>

      {loading && (articles.length === 0 || searchQuery !== '') ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={searchQuery !== '' ? searchResults : articles}
          renderItem={renderArticle}
          keyExtractor={(item, index) => index.toString()}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  articleContainer: {
    marginBottom: 1,
    // backgroundColor: 'white',
  },
  placeholderImage: {
    width: 180,
    height: 150,
    backgroundColor: 'gray',
    marginHorizontal: 17,
    marginVertical: 15,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    // marginTop: 20,
    color: 'black',
    marginTop: 10,
  },
  description: {
    marginBottom: 50,
    color: 'black',
    marginEnd: 10,
  },
  rightItem: {
    marginTop: 10,
    flexDirection: 'column',
    marginHorizontal: 1,
    flex: 1,
    marginBottom: -20,
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: 10,
  },
  image: {
    width: 180,
    height: 150,
    marginHorizontal: 17,
    marginVertical: 15,
  },
  image1: {
    width: '88%',
    height: 150,
    marginHorizontal: 17,
    marginVertical: 15,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    paddingHorizontal: 10,
    width: 350,
    marginTop: 20,
    marginHorizontal: 'auto',
    marginLeft: 20,
  },
  Trending: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  head: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  anh1: {
    marginLeft: 30,
    marginTop: 50,
  },
  anh2: {
    marginLeft: 210,
    marginTop: 60,
  },
  text1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  text2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default About;
