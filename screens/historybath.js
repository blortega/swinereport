import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db } from '../firebase'; // Import Firestore
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const HistoryClean = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  // Function to fetch reports from Firestore
  const fetchReports = async () => {
    try {
      const q = query(collection(db, 'reports'), orderBy('id', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedReports = [];
      querySnapshot.forEach((doc) => {
        fetchedReports.push({ id: doc.id, ...doc.data() });
      });
      setReports(fetchedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      Alert.alert('Error', 'Failed to fetch reports.');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleReportPress = (report) => {
    setSelectedReport(report);
  };

  const goBack = () => {
    setSelectedReport(null);
  };

  const renderReportDetails = () => (
    <View style={styles.centeredView}>
      <View style={styles.detailView}>
        <Text style={styles.header}>Feeding History</Text>
        <View style={styles.row}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>ID</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>{selectedReport.id}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Date</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>
                {new Date(selectedReport.date.seconds * 1000).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Feeding Result</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>{selectedReport.status}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Time</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>
                {selectedReport.date ? new Date(selectedReport.date.seconds * 1000).toLocaleTimeString() : 'N/A'}
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
    <TouchableOpacity style={styles.card} onPress={() => handleReportPress(item)}>
      <View style={styles.textContainer}>
        <Text style={styles.name}>ID: {item.id}</Text>
        <Text style={styles.date}>
          Date: {item.date ? new Date(item.date.seconds * 1000).toLocaleDateString() : ''}
        </Text>
        <Text style={styles.time}>
          Time: {item.date ? new Date(item.date.seconds * 1000).toLocaleTimeString() : ''}
        </Text>
        <Text style={[styles.status, item.status === 'Failed' ? styles.statusFailed : styles.statusSuccess]}>
          Status: {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {selectedReport ? (
        renderReportDetails()
      ) : (
        <>
          <Text style={styles.title}>Feeding & Watering History</Text>
          <FlatList
            data={reports}
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
    backgroundColor: '#4B4B4B', // Dark gray to match the app's overall theme
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
  status: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  statusSuccess: {
    color: '#2ECC71', // Green for Success
  },
  statusFailed: {
    color: '#FF6F61', // Accent color used for Failed
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  detailView: {
    width: '90%',
    backgroundColor: '#FF7075', // Keep this for detailed views
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
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
