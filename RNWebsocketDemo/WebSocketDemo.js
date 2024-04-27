import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, Text, StyleSheet, ScrollView } from 'react-native';
import ReconnectingWebSocket from 'react-native-reconnecting-websocket';

const App = () => {
  const [ws, setWs] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [serverMessages, setServerMessages] = useState([]);

  // Create WebSocket connection
  const createWebSocket = () => {
    const newWs = new ReconnectingWebSocket('ws://124.222.224.186:8800', [], {
      WebSocket: WebSocket,
      connectionTimeout: 1000,
      maxRetries: 10,
      maxReconnectInterval: 5000,
      minReconnectInterval: 1000,
      debug: true,
    });

    newWs.onopen = () => {
      console.log('WebSocket connection opened');
    };

    newWs.onmessage = (event) => {
      console.log('Received message from server:', event.data);
      setServerMessages((prevMessages) => [...prevMessages, event.data]);
    };

    newWs.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(newWs);
  };

  // Close WebSocket connection
  const closeWebSocket = () => {
    if (ws) {
      ws.close();
      console.log('WebSocket connection closed');
      setWs(null);
    }
  };

  // Send message
  const sendMessage = () => {
    if (ws) {
      if (inputMessage.trim() !== '') {
        ws.send(inputMessage);
        console.log('Message sent:', inputMessage);
        setInputMessage('');
      }
    }
  };

  // Reconnect WebSocket
  const reconnectWebSocket = () => {
    if (ws && ws.readyState !== WebSocket.OPEN) {
      ws.reconnect();
      console.log('Attempting to reconnect WebSocket');
    }
  };

  // Send ping message
  const sendPingMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.ping();
      console.log('Ping message sent');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messageContainer}>
        {serverMessages.map((message, index) => (
          <Text key={index} style={styles.messageText}>{message}</Text>
        ))}
      </ScrollView>
      <TextInput
        style={styles.input}
        value={inputMessage}
        onChangeText={setInputMessage}
        placeholder="Type message..."
      />
      <View style={styles.buttonRow}>
        <Button title="Create WebSocket" onPress={createWebSocket} />
        <Button title="Close WebSocket" onPress={closeWebSocket} disabled={!ws} />
      </View>
      <View style={styles.buttonRow}>
        <Button title="Send Message" onPress={sendMessage} disabled={!ws || inputMessage.trim() === ''} />
        <Button title="Reconnect WebSocket" onPress={reconnectWebSocket} disabled={!ws} />
      </View>
      <View style={styles.buttonRow}>
        <Button title="Send Ping Message" onPress={sendPingMessage} disabled={!ws || ws.readyState !== WebSocket.OPEN} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  messageContainer: {
    flex: 1,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default App;