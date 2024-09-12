import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db } from './firebase'; // Import Firestore
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const App = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  // Function to fetch reports from Firestore
  const fetchReports = async () => {
    try {
      // Create a query to order reports by 'id' in descending order
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

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, []);

  // Function to handle when a report item is pressed
  const handleReportPress = (report) => {
    setSelectedReport(report);
  };

  // Function to go back to the report list view
  const goBack = () => {
    setSelectedReport(null);
  };

  // Render detailed report screen (no modal)
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
                {new Date(selectedReport.date.seconds * 1000).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Watering Result</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>{selectedReport.wateringResult || "Success"}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailTitle}>Time</Text>
            <View style={styles.detailBox}>
              <Text style={styles.detailText}>
                {new Date(selectedReport.date.seconds * 1000).toLocaleTimeString()}
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

  // Render each report item in the list
  const renderItem = ({ item }) => (
    <View style={styles.item}>
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
      <TouchableOpacity style={styles.editButton} onPress={() => handleReportPress(item)}>
        <Text style={styles.editButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  // Show the report list or the details view based on `selectedReport`
  return (
    <View style={styles.container}>
      {selectedReport ? (
        renderReportDetails()
      ) : (
        <>
          <Text style={styles.title}>Feeding History</Text>
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
    backgroundColor: '#383838', // Dark background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF', // White text
  },
  item: {
    flexDirection: 'column', // Stack elements vertically
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align left
    borderColor: '#FF7075', // Red border like in the image
    borderWidth: 1,
    padding: 15,
    marginBottom: 15, // Increased spacing between cards
    borderRadius: 10,
    backgroundColor: '#FF7075', // Card background color
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    marginBottom: 5, // Add margin to create space
  },
  date: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5, // Add margin to create space
  },
  time: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 5, // Add margin to create space
  },
  status: {
    fontSize: 14,
    marginBottom: 10,
  },
  statusSuccess: {
    color: 'green', // Green for successful status
  },
  statusFailed: {
    color: 'red', // Red for failed status
  },
  editButton: {
    backgroundColor: '#007AFF', // Blue button background
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end', // Align button to the right
  },
  editButtonText: {
    color: '#FFFFFF', // White text
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  detailView: {
    width: '90%',
    backgroundColor: '#FF7075', // Red background like in the image
    borderRadius: 20,
    padding: 30, // Increased padding for more spacing
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    padding: 10,
    backgroundColor: '#383838',
    borderRadius: 20,
    marginBottom: 30, // Increased margin below the header
    textAlign: 'center',
    width: '70%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30, // Increased margin for better spacing
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5, // Add some horizontal spacing between columns
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  detailBox: {
    backgroundColor: '#FFFFFF',
    height: 50,
    width: '80%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15, // Add margin between rows
  },
  detailText: {
    fontSize: 18,
    color: '#000000',
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

export default App;
