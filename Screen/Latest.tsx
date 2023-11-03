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
  //       <TouchableOpacity onPress={() => handleImagePress(item)}>
  //         <View style={styles.list}>
  //           <Image source={{uri: item.urlToImage}} style={styles.image} />
  //           <View style={styles.rightItem}>
  //             <Text style={styles.title} numberOfLines={3}>
  //               {item.title}
  //             </Text>
  //             <Text style={styles.description} numberOfLines={5}>
  //               {item.description}
  //             </Text>
  //           </View>
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
      <Head />
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
          <Text
            style={{
              color: 'black',
              marginLeft: 235,
              fontSize: 13,
            }}>
            See all
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.text1}>
        <TouchableOpacity style={{marginHorizontal: 17}}>
          <Text style={{color: 'black', fontSize: 15, marginLeft: 5}}>All</Text>
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
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: 10,
  },
  description: {
    flex: 1,
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
  placeholderImage: {
    width: 180,
    height: 150,
    backgroundColor: 'gray',
    marginHorizontal: 17,
    marginVertical: 15,
  },
  image: {
    width: 180,
    height: 150,
    marginHorizontal: 17,
    marginVertical: 15,
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

export default Latest;
