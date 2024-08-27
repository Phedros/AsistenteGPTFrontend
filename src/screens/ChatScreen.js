import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import axios from 'axios';

const ChatScreen = ({ route }) => {
  const { gptId } = route.params; // Recibe el ID del GPT desde la navegación
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null); // Crear referencia para FlatList

  // Función para mapear el historial recibido a formato usado por la app
  const mapHistoryToMessages = (history) => {
    return history.map(item => ({
      text: item.content,
      sender: item.role === 'user' ? 'user' : 'gpt'
    }));
  };

  // Obtener historial de conversación al montar el componente
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:5000/gpt/history/${gptId}`);
        if (response.data) {
          const formattedMessages = mapHistoryToMessages(response.data);
          setMessages(formattedMessages); // Actualizar mensajes con historial formateado

          // Desplazar al final después de cargar el historial
          flatListRef.current.scrollToEnd({ animated: false });
        } else {
          console.error("No se recibió el historial esperado:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener el historial:", error);
      }
    };

    fetchHistory();
  }, [gptId]);

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

        // Hacer scroll al final después de actualizar los mensajes
        flatListRef.current.scrollToEnd({ animated: true });
      } else {
        console.error("No se recibió la respuesta esperada:", response.data);
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  // Función para borrar la conversación
  const clearConversation = async () => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro de que deseas borrar la conversación?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Borrar",
          onPress: async () => {
            try {
              const response = await axios.delete(`http://10.0.2.2:5000/gpt/history/delete/${gptId}`);
              if (response.status === 200) {
                setMessages([]); // Limpiar mensajes en el estado local
              } else {
                console.error("Error al borrar la conversación:", response.data);
              }
            } catch (error) {
              console.error("Error al borrar la conversación:", error);
            }
          }
        }
      ]
    );
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.gptMessage]}>
      <Text style={[styles.messageText, item.sender === 'gpt' ? styles.gptMessageText : null]}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Botón para borrar conversación en la parte superior derecha */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={clearConversation}>
          <Text style={styles.clearButtonText}>🗑</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef} // Asignar la referencia a FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })} // Desplazar al final cuando cambia el contenido
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })} // Desplazar al final al cargar el layout
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
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
  gptMessageText: { // Nuevo estilo para el texto de los mensajes del GPT
    color: '#000000', // Cambiado a negro para mejorar la legibilidad
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
  clearButton: {
    backgroundColor: '#ff0000',
    padding: 5,
    borderRadius: 15,
  },
  clearButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12, // Reducido el tamaño de fuente para que el botón sea más pequeño
  },
});

export default ChatScreen;
