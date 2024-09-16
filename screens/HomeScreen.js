import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image 
        source={require('../assets/piggery.jpg')} // Replace with the actual image path
        style={styles.headerImage}
      />

      {/* Main Dashboard Button (History) */}
      <TouchableOpacity 
        style={styles.dashboardButton}
        onPress={() => navigation.navigate('History')} // Change navigation route if needed
      >
        <Text style={styles.dashboardButtonText}>History</Text>
      </TouchableOpacity>

      {/* Other Buttons (Feed, Bath, Cleaning) */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Feed')} // Change navigation route if needed
        >
          <Icon name="nutrition-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Feed</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Bath')} // Change navigation route if needed
        >
          <Icon name="water-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Bath</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Cleaning')} // Change navigation route if needed
        >
          {/* Changed the cleaning icon */}
          <Icon name="sparkles-outline" size={30} color="#fff" />
          <Text style={styles.buttonText}>Cleaning</Text>
        </TouchableOpacity>
      </View>

      {/* Top Icons for Settings and Notifications */}
      <View style={styles.iconContainer}>
        <TouchableOpacity>
          <Icon name="settings-outline" size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Icon name="notifications-outline" size={30} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B4B4B',
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: 250,
  },
  dashboardButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: 30,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginVertical: -25,
    zIndex: 1,
  },
  dashboardButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
    top: 40,
  },
  button: {
    backgroundColor: '#FF6F61',
    width: '40%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    margin: 10,
  },
  buttonText: {
    color: '#fff',
    marginTop: 5,
    fontSize: 16,
  },
  iconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 70,
  },
});

export default HomeScreen;
