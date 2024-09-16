import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db } from '../firebase'; // Import Firestore
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const HistoryBath = () => {
  const [baths, setBaths] = useState([]);
  const [selectedBath, setSelectedBath] = useState(null);

  // Function to fetch bath history from Firestore
  const fetchBaths = async () => {
    try {
      const q = query(collection(db, 'historybath'), orderBy('bathingDate', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedBaths = [];
      querySnapshot.forEach((doc) => {
        fetchedBaths.push({ id: doc.id, ...doc.data() });
      });
      setBaths(fetchedBaths);
    } catch (error) {
      console.error('Error fetching bath history:', error);
      Alert.alert('Error', 'Failed to fetch bath history.');
    }
  };

  useEffect(() => {
    fetchBaths();
  }, []);

  const handleBathPress = (bath) => {
    setSelectedBath(bath);
  };

  const goBack = () => {
    setSelectedBath(null);
  };

  const renderBathDetails = () => (
    <View style={styles.centeredView}>
      <View style={styles.detailView}>
        <Text style={styles.header}>Details</Text>

        {/* Display idNum */}
        <View style={styles.row}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>ID</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>{selectedBath.idNum}</Text>
            </View>
          </View>
        </View>

        {/* Display a single date (using bathingDate) */}
        <View style={styles.row}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Date</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>
                {new Date(selectedBath.bathingDate.seconds * 1000).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Display bathing status */}
        <View style={styles.row}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Bathing Status</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>{selectedBath.bathingStatus}</Text>
            </View>
          </View>
        </View>

        {/* Display respective times for bathing */}
        <View style={styles.row}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Bathing Time</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>
                {new Date(selectedBath.bathingDate.seconds * 1000).toLocaleTimeString()}
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

  const determineCardColor = (bathingStatus) => {
    return bathingStatus === 'Success' ? '#4CAF50' : '#F44336'; // Green for success, Red for failure
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: determineCardColor(item.bathingStatus) }]}
      onPress={() => handleBathPress(item)}
    >
      <View style={styles.textContainer}>
        <Text style={styles.name}>ID: {item.idNum}</Text>
        <Text style={styles.date}>
          Date: {item.bathingDate ? new Date(item.bathingDate.seconds * 1000).toLocaleDateString() : ''}
        </Text>
        <Text style={styles.result}>
          Status: {item.bathingStatus}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {selectedBath ? (
        renderBathDetails()
      ) : (
        <>
          <Text style={styles.title}>Bathing History</Text>
          <FlatList
            data={baths}
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
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
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
    width: '80%',
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

export default HistoryBath;