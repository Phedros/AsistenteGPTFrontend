import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';

const ChatScreen = ({ route }) => {
  const { gptId } = route.params; // Recibe el ID del GPT desde la navegación
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const sendMessage = async () => {
    if (inputText.trim() === '') return; // No enviar mensajes vacíos

    const userMessage = { text: inputText, sender: 'user' };
    console.log("Enviando mensaje:", userMessage); // Mostrar el texto que se va a enviar
    try {
      const response = await axios.post(`http://10.0.2.2:5000/gpt/chat/${gptId}`, {
        prompt: inputText,
      });
      if (response.data && response.data.response) { // Asegurarse de que la respuesta contiene el campo 'response'
        const gptMessage = { text: response.data.response, sender: 'gpt' };
        setMessages(prevMessages => [...prevMessages, userMessage, gptMessage]);
        setInputText('');
      } else {
        console.error("No se recibió la respuesta esperada:", response.data);
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.gptMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer}
        inverted // Muestra los mensajes más recientes en la parte inferior
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu mensaje..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  chatContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  messageContainer: {
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#6200ee',
    alignSelf: 'flex-end',
  },
  gptMessage: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#ffffff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
