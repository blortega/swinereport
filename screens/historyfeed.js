import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db } from '../firebase'; // Import Firestore
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const HistoryFeed = () => {
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
        <Text style={styles.header}>Details</Text>
        
        {/* Display idNum */}
        <View style={styles.row}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>ID</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>{selectedFeed.idNum}</Text>
            </View>
          </View>
        </View>
  
        {/* Display a single date (using feedingDate as an example) */}
        <View style={styles.row}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Date</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>
                {new Date(selectedFeed.feedingDate.seconds * 1000).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
  
        {/* Display feeding and watering statuses */}
        <View style={styles.row}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Feeding Status</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>{selectedFeed.feedingStatus}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Watering Status</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>{selectedFeed.wateringStatus}</Text>
            </View>
          </View>
        </View>
  
        {/* Display respective times for feeding and watering */}
        <View style={styles.row}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Feeding Time</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>
                {new Date(selectedFeed.feedingDate.seconds * 1000).toLocaleTimeString()}
              </Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Watering Time</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>
                {new Date(selectedFeed.wateringDate.seconds * 1000).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        </View>
  
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  
  const determineCardColor = (feedingStatus, wateringStatus) => {
    if (feedingStatus === 'Success' && wateringStatus === 'Success') {
      return '#4CAF50'; // Green for success
    } else if (feedingStatus === 'Failed' && wateringStatus === 'Failed') {
      return '#F44336'; // Red for failure
    } else {
      return '#FFA500'; // Orange for partial success
    }
  };

  const determineStatusText = (feedingStatus, wateringStatus) => {
    if (feedingStatus === 'Success' && wateringStatus === 'Success') {
      return 'All Success';
    } else if (feedingStatus === 'Failed' && wateringStatus === 'Failed') {
      return 'All Failed';
    } else {
      return 'Problem Occurred';
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: determineCardColor(item.feedingStatus, item.wateringStatus) }]}
      onPress={() => handleFeedPress(item)}
    >
      <View style={styles.textContainer}>
        {/* Centered ID */}
        <Text style={styles.name}>ID: {item.idNum}</Text>
        
        {/* Centered Date */}
        <Text style={styles.date}>
          Date: {item.feedingDate ? new Date(item.feedingDate.seconds * 1000).toLocaleDateString() : ''}
        </Text>
        
        {/* Centered Status */}
        <Text style={styles.result}>
          {determineStatusText(item.feedingStatus, item.wateringStatus)}
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
    backgroundColor: '#383838',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  card: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    justifyContent: 'center',  // Center vertically
    alignItems: 'center',      // Center horizontally
  },
  textContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',   // Center text horizontally
    marginBottom: 5,
  },
  date: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',   // Center text horizontally
    marginBottom: 5,
  },
  time: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  result: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',   // Center text horizontally
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  detailView: {
    width: '90%',
    backgroundColor: '#FF7075',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  idText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  detailBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },
  detailText: {
    fontSize: 16,
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

export default HistoryFeed;
