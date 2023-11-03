import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Head from './Head';

const Latest: React.FC = () => {
  const [articles, setArticles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigation = useNavigation();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async (page = 1, refresh = false) => {
    try {
      const url = `https://newsapi.org/v2/everything?q=tesla&sortBy=publishedAt&apiKey=548d98c0e74543179eb939adda12dbe4`;

      setRefreshing(true);

      const response = await axios.get(url);
      const data = response.data;

      if (refresh) {
        setArticles(data.articles);
      } else {
        setArticles(prevArticles => [...prevArticles, ...data.articles]);
      }

      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // const handleImagePress = (article: any) => {
  //   const {url} = article;
  //   navigation.navigate('NewsDetail', {url});
  // };

  // const renderArticle = ({item}: {item: any}) => {
  //   return (
  //     <View style={styles.articleContainer}>
  //       <Text style={styles.title}>{item.title}</Text>
  //       <Text style={styles.description}>{item.description}</Text>
  //       <TouchableOpacity onPress={() => handleImagePress(item)}>
  //         <Image source={{uri: item.urlToImage}} style={styles.image} />
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
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      fetchNews(nextPage);
    }
  };

  const handleRefresh = () => {
    fetchNews(1, true);
  };

  return (
    <View>
      <View style={{flexDirection: 'row'}}>
        <Head />
        <Text
          style={{
            marginTop: 60,
            marginLeft: -210,
            fontSize: 20,
            color: 'black',
          }}>
          Trending
        </Text>
      </View>

      <FlatList
        data={articles}
        renderItem={renderArticle}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  articleContainer: {
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'black',
    marginHorizontal: 20,
  },
  description: {
    flex: 1,
    color: 'black',
    marginEnd: 10,
    marginHorizontal: 20,
  },
  image: {
    width: '90%',
    height: 180,
    marginHorizontal: 20,
    marginVertical: 20,
    // marginHorizontal: 'auto',
  },
  placeholderImage: {
    width: 180,
    height: 150,
    backgroundColor: 'gray',
    marginHorizontal: 17,
    marginVertical: 15,
  },
  rightItem: {
    marginTop: 10,
    flexDirection: 'column',
    marginHorizontal: 1,
    flex: 1,
    marginBottom: -20,
  },
  // list: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginEnd: 10,
  // },
});

export default Latest;
