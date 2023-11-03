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

const Bookmark: React.FC = () => {
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
  // const handleImagePress = (article: any) => {
  //   const {url} = article;
  //   navigation.navigate('NewsDetail', {url});
  // };

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

      // if (searchQuery !== '') {
      //   handleSearch();
      // } else {
      //   fetchNews();
      // }
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
      <Text style={styles.text1}>BookMark</Text>
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
    marginTop: 20,
    color: 'black',
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: 10,
  },
  rightItem: {
    marginTop: 10,
    flexDirection: 'column',
    marginHorizontal: 1,
    flex: 1,
    marginBottom: -20,
  },
  description: {
    flex: 1,
    marginBottom: 50,
    color: 'black',
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
  text1: {
    marginTop: 50,
    marginLeft: 20,
    fontSize: 40,
    color: 'black',
    fontWeight: '700',
  },
});

export default Bookmark;
