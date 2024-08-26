import axios from 'axios';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';

const EditGPTScreen = ({ route, navigation }) => {
  const { gptId, initialName, initialApiKey, initialModel, initialSystemMessage, onGPTUpdated } = route.params;

  const [name, setName] = React.useState(initialName);
  const [apiKey, setApiKey] = React.useState(initialApiKey);
  const [model, setModel] = React.useState(initialModel);
  const [systemMessage, setSystemMessage] = React.useState(initialSystemMessage);

  const handleEditGPT = async () => {
    try {
      const response = await axios.post(`http://10.0.2.2:5000/gpt/update/${gptId}`, {
        name,
        api_key: apiKey,
        model,
        system_message: systemMessage,
      });
      if (response.status === 200) {
        Alert.alert('GPT Actualizado', 'El GPT ha sido actualizado exitosamente.');
        if (onGPTUpdated) {
          onGPTUpdated(); // Llama al callback para refrescar la lista en HomeScreen
        }
        navigation.goBack(); // Regresa a la pantalla anterior
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al actualizar el GPT.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar GPT</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nuevo Nombre del GPT"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nueva API Key"
          value={apiKey}
          onChangeText={setApiKey}
          secureTextEntry // Para ocultar la API Key
        />
        <TextInput
          style={styles.input}
          placeholder="Nuevo Modelo"
          value={model}
          onChangeText={setModel}
        />
        <TextInput
          style={styles.input}
          placeholder="Nuevo Mensaje del sistema"
          value={systemMessage}
          onChangeText={setSystemMessage}
          multiline
          numberOfLines={3}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleEditGPT}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
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
  saveButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditGPTScreen;
