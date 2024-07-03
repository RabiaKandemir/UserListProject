import React, { useEffect, useState } from 'react';
import { SafeAreaView, FlatList, View, Text, TouchableOpacity, StyleSheet,Image  } from 'react-native';
import axios from 'axios';
import crashlytics from '@react-native-firebase/crashlytics';

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar:string;
}

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchData = async (pageNumber: number) => {
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${pageNumber}`);
      setUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      // crashlytics().recordError(error as Error);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };
  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <TouchableOpacity style={styles.button} onPress={() => handleDelete(item.id)}>
        <Text style={styles.buttonText}>Sil</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
      <View style={styles.pagination}>
        {page > 1 && (
          <TouchableOpacity style={styles.paginationButton} onPress={() => setPage(page - 1)}>
            <Text style={styles.buttonText}>Geri</Text>
          </TouchableOpacity>
        )}
        {page < totalPages && (
          <TouchableOpacity style={styles.paginationButton} onPress={() => setPage(page + 1)}>
            <Text style={styles.buttonText}>İleri</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    padding: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontWeight: '900',
    fontSize: 16,
  
    paddingTop:10,
    color: '#00095c',
  },
  email: {
    fontWeight: '500',
  
    color: '#000105',
  },
  button: {
    backgroundColor: '#ad231c',
    padding: 7,
    borderRadius: 10,
    alignSelf: 'flex-end', 
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center', 
    padding: 10,
  },
  paginationButton: {
    backgroundColor: '#0c15c2',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10, 
    alignItems: 'center',
    width: 100,
  },
});
export default App;

