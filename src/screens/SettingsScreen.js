import axios from 'axios';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';

const ConfiguracionGPTScreen = ({ navigation, route }) => {
  const [apiKey, setApiKey] = React.useState('');
  const [model, setModel] = React.useState('');

  const handleGuardarConfiguracion = async () => {
    try {
      const response = await axios.post('http://10.0.2.2:5000/settings/update', {
        api_key: apiKey,
        model,
      });

      if (response.status === 200) {
        Alert.alert('Configuración Guardada', 'La configuración ha sido guardada exitosamente.');
        navigation.goBack(); // Regresa a la pantalla anterior
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al guardar la configuración.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Configuración Global</Text>

      <View style={styles.inputContainer}>
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
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleGuardarConfiguracion}>
        <Text style={styles.createButtonText}>Guardar Configuración</Text>
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

export default ConfiguracionGPTScreen;
