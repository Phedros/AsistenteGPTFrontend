import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import axios from 'axios';

const ChatScreen = ({ route }) => {
  const { gptId, conversationId } = route.params; // Recibe el ID del GPT y el ID de la conversación desde la navegación
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchHistory(conversationId);
  }, [conversationId]);

  const fetchHistory = async (convId) => {
    try {
      const response = await axios.get(`http://10.0.2.2:5000/gpt/history/${gptId}/${convId}`);
      if (response.data) {
        const formattedMessages = response.data.map(item => ({
          text: item.content,
          sender: item.role === 'user' ? 'user' : 'gpt'
        }));
        setMessages(formattedMessages);

        flatListRef.current.scrollToEnd({ animated: false });
      } else {
        console.error("No se recibió el historial esperado:", response.data);
      }
    } catch (error) {
      console.error("Error al obtener el historial:", error);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage = { text: inputText, sender: 'user' };
    try {
      const response = await axios.post(`http://10.0.2.2:5000/gpt/chat/${gptId}/${conversationId}`, {
        prompt: inputText,
      });
      if (response.data && response.data.response) {
        const gptMessage = { text: response.data.response, sender: 'gpt' };
        setMessages(prevMessages => [...prevMessages, userMessage, gptMessage]);
        setInputText('');
        flatListRef.current.scrollToEnd({ animated: true });
      } else {
        console.error("No se recibió la respuesta esperada:", response.data);
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.gptMessage]}>
            <Text style={[styles.messageText, item.sender === 'user' ? styles.userMessageText : styles.gptMessageText]}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
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
  userMessageText: {
    color: '#ffffff', // Texto blanco para los mensajes del usuario
  },
  gptMessageText: {
    color: '#000000', // Texto negro para los mensajes de GPT
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
