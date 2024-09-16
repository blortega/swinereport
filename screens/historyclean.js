import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db } from '../firebase'; // Import Firestore
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const HistoryClean = () => {
  const [historyCleans, setHistoryCleans] = useState([]);
  const [selectedClean, setSelectedClean] = useState(null);

  // Function to fetch history cleans from Firestore
  const fetchHistoryCleans = async () => {
    try {
      const q = query(collection(db, 'historyclean'), orderBy('cleaningDate', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedCleans = [];
      querySnapshot.forEach((doc) => {
        fetchedCleans.push({ id: doc.id, ...doc.data() });
      });
      setHistoryCleans(fetchedCleans);
    } catch (error) {
      console.error('Error fetching cleaning history:', error);
      Alert.alert('Error', 'Failed to fetch cleaning history.');
    }
  };

  useEffect(() => {
    fetchHistoryCleans();
  }, []);

  const handleCleanPress = (clean) => {
    setSelectedClean(clean);
  };

  const goBack = () => {
    setSelectedClean(null);
  };

  const renderCleanDetails = () => (
    <View style={styles.centeredView}>
      <View style={styles.detailView}>
        <Text style={styles.header}>Details</Text>

        {/* Display idNum */}
        <View style={styles.row}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>ID</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>{selectedClean.idNum}</Text>
            </View>
          </View>
        </View>

        {/* Display a single date (using cleaningDate) */}
        <View style={styles.row}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Date</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>
                {new Date(selectedClean.cleaningDate.seconds * 1000).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Display cleaning status */}
        <View style={styles.row}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Cleaning Status</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>{selectedClean.cleaningStatus}</Text>
            </View>
          </View>
        </View>

        {/* Display respective times for cleaning */}
        <View style={styles.row}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Cleaning Time</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>
                {new Date(selectedClean.cleaningDate.seconds * 1000).toLocaleTimeString()}
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

  const determineCardColor = (cleaningStatus) => {
    return cleaningStatus === 'Success' ? '#4CAF50' : '#F44336'; // Green for success, Red for failure
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: determineCardColor(item.cleaningStatus) }]}
      onPress={() => handleCleanPress(item)}
    >
      <View style={styles.textContainer}>
        <Text style={styles.name}>ID: {item.idNum}</Text>
        <Text style={styles.date}>
          Date: {item.cleaningDate ? new Date(item.cleaningDate.seconds * 1000).toLocaleDateString() : ''}
        </Text>
        <Text style={styles.result}>
          Status: {item.cleaningStatus}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {selectedClean ? (
        renderCleanDetails()
      ) : (
        <>
          <Text style={styles.title}>Cleaning History</Text>
          <FlatList
            data={historyCleans}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  date: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  result: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#FFFFFF',
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

export default HistoryClean;
