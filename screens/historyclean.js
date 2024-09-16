import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db } from '../firebase'; // Import Firestore
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const HistoryClean = () => {
  const [historyFeeds, setHistoryFeeds] = useState([]);
  const [selectedFeed, setSelectedFeed] = useState(null);

  // Function to fetch history feeds from Firestore
  const fetchHistoryFeeds = async () => {
    try {
      const q = query(collection(db, 'historyfeed'), orderBy('feedingDate', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedFeeds = [];
      querySnapshot.forEach((doc) => {
        fetchedFeeds.push({ id: doc.id, ...doc.data() });
      });
      setHistoryFeeds(fetchedFeeds);
    } catch (error) {
      console.error('Error fetching history feeds:', error);
      Alert.alert('Error', 'Failed to fetch history feeds.');
    }
  };

  useEffect(() => {
    fetchHistoryFeeds();
  }, []);

  const handleFeedPress = (feed) => {
    setSelectedFeed(feed);
  };

  const goBack = () => {
    setSelectedFeed(null);
  };

  const renderFeedDetails = () => (
    <View style={styles.centeredView}>
      <View style={styles.detailView}>
        <View style={styles.idContainer}>
          <Text style={styles.idText}>{selectedFeed.idNum}</Text>
        </View>
        <Text style={styles.header}>Feeding & Watering Details</Text>
        <View style={styles.row}>
          <View style={styles.statusBox}>
            <Text style={styles.detailTitle}>Feeding Result</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>{selectedFeed.feedingStatus}</Text>
            </View>
          </View>
          <View style={styles.dateBox}>
            <Text style={styles.detailTitle}>Time</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>
                {new Date(selectedFeed.feedingDate.seconds * 1000).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.statusBox}>
            <Text style={styles.detailTitle}>Watering Result</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>{selectedFeed.wateringStatus}</Text>
            </View>
          </View>
          <View style={styles.dateBox}>
            <Text style={styles.detailTitle}>Time</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>
                {new Date(selectedFeed.wateringDate.seconds * 1000).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleFeedPress(item)}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>ID: {item.idNum}</Text>
        <Text style={styles.date}>
          Feeding Date: {item.feedingDate ? new Date(item.feedingDate.seconds * 1000).toLocaleDateString() : ''}
        </Text>
        <Text style={styles.time}>
          Feeding Status: {item.feedingStatus}
        </Text>
        <Text style={styles.date}>
          Watering Date: {item.wateringDate ? new Date(item.wateringDate.seconds * 1000).toLocaleDateString() : ''}
        </Text>
        <Text style={styles.time}>
          Watering Status: {item.wateringStatus}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {selectedFeed ? (
        renderFeedDetails()
      ) : (
        <>
          <Text style={styles.title}>Feeding & Watering History</Text>
          <FlatList
            data={historyFeeds}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#383838', // Matches the darker theme in App.js
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#4B4B4B', // Card color
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  textContainer: {
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text to stand out on the dark background
  },
  date: {
    fontSize: 14,
    color: '#FFFFFF', // White text to match the overall design
  },
  time: {
    fontSize: 14,
    color: '#FFFFFF', // White text
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  detailView: {
    width: '90%',
    backgroundColor: '#FF7075', // Detailed view card
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  idContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  idText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  dateBox: {
    flex: 1,
    marginLeft: 10, // Adds spacing between the status and date boxes
  },
  statusBox: {
    flex: 1,
    marginRight: 10, // Adds spacing between the date and status boxes
  },
  detailTitle: {
    fontSize: 18, // Increased font size for titles
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  detailBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15, // Increased padding for better spacing
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16, // Increased font size for details
    color: '#000',
  },
  backButton: {
    backgroundColor: '#B22222',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    width: '60%',
    alignSelf: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
export default HistoryClean;
