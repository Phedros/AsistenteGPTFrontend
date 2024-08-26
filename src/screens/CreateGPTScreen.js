import axios from 'axios';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';

const CreateGPTScreen = ({ navigation, route }) => {
  const [name, setName] = React.useState('');
  const [apiKey, setApiKey] = React.useState('');
  const [model, setModel] = React.useState('');
  const [systemMessage, setSystemMessage] = React.useState('');

  const handleCreateGPT = async () => {
    if (!name || !apiKey || !model || !systemMessage) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    try {
      const response = await axios.post('http://10.0.2.2:5000/gpt/create', {
        name,
        api_key: apiKey,
        model,
        system_message: systemMessage,
      });
      if (response.status === 201) {
        Alert.alert('GPT Creado', 'Tu nuevo GPT ha sido creado exitosamente.');
        if (route.params?.onGPTCreated) {
          route.params.onGPTCreated(); // Llama al callback para refrescar la lista
        }
        navigation.goBack(); // Regresa a la pantalla anterior
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al crear el GPT.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear Nuevo GPT</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre del GPT"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="API Key"
          value={apiKey}
          onChangeText={setApiKey}
          secureTextEntry // Para proteger la API Key
        />
        <TextInput
          style={styles.input}
          placeholder="Modelo"
          value={model}
          onChangeText={setModel}
        />
        <TextInput
          style={styles.input}
          placeholder="Mensaje del sistema"
          value={systemMessage}
          onChangeText={setSystemMessage}
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleCreateGPT}>
        <Text style={styles.createButtonText}>Crear</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    marginBottom: 15,
  },
  createButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateGPTScreen;
