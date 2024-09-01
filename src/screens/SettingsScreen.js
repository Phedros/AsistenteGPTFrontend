import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';

const ConfiguracionGPTScreen = ({ navigation }) => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('');
  const [showApiKey, setShowApiKey] = useState(false); // Estado para controlar la visibilidad de la API Key

  // Función para obtener la configuración actual desde el backend
  const fetchConfiguracion = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:5000/settings');

      if (response.status === 200) {
        const { api_key, model, message } = response.data;

        if (api_key && model) {
          // Actualiza el estado con los valores obtenidos
          setApiKey(api_key);
          setModel(model);
        } else if (message) {
          Alert.alert('Información', message);
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al obtener la configuración.');
    }
  };

  useEffect(() => {
    fetchConfiguracion(); // Llama a la función al montar el componente
  }, []);

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
        {/* Contenedor para el campo de API Key y el botón */}
        <View style={styles.apiKeyContainer}>
          <TextInput
            style={styles.input}
            placeholder="API Key"
            value={apiKey}
            onChangeText={setApiKey}
            secureTextEntry={!showApiKey} // Cambia la visibilidad según el estado
          />
          <TouchableOpacity
            style={styles.showButton}
            onPressIn={() => setShowApiKey(true)}  // Muestra la API Key al presionar
            onPressOut={() => setShowApiKey(false)} // Oculta la API Key al soltar
          >
            <Text style={styles.showButtonText}>👁️</Text>
          </TouchableOpacity>
        </View>

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
  apiKeyContainer: {
    flexDirection: 'row', // Coloca el input y el botón en línea
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1, // Toma el espacio disponible
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
  },
  showButton: {
    marginLeft: 8, // Espacio entre el input y el botón
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  showButtonText: {
    color: '#ffffff',
    fontSize: 16,
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
