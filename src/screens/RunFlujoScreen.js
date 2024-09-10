import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Text, useTheme } from 'react-native-paper';
import axios from 'axios';

const RunFlujoScreen = ({ route }) => {
  const { colors } = useTheme();
  const { flujoId, conversationId } = route.params;
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');  // Para guardar el prompt ingresado por el usuario

  // Llamada para cargar el historial al iniciar la pantalla
  const loadHistorial = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `http://10.0.2.2:5000/flujo/history/${flujoId}/${conversationId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setHistorial(response.data || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al cargar el historial de la conversación.');
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar el flujo con el prompt ingresado
  const fetchHistorial = async () => {
    if (!prompt) {
      Alert.alert('Error', 'Por favor ingresa un prompt antes de ejecutar el flujo.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `http://10.0.2.2:5000/flujo/run/${flujoId}/${conversationId}`,
        { prompt },  // Enviar el prompt en el cuerpo de la solicitud
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setHistorial(response.data.resultados || []);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al ejecutar el flujo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cargar el historial cuando el componente se monte
    loadHistorial();
  }, []);

  const renderAgenteResponse = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.agentName}>Agente {item.position}: {item.agent_name}</Text>
        <Text style={styles.response}>{item.response}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Entrada para el prompt */}
      <TextInput
        mode="outlined"
        label="Ingresa el prompt"
        value={prompt}
        onChangeText={setPrompt}
        style={styles.input}
      />

      {/* Botón para ejecutar el flujo */}
      <Button
        mode="contained"
        onPress={fetchHistorial}
        disabled={loading}  // Deshabilitar el botón mientras carga
        style={styles.runButton}
      >
        Ejecutar Flujo
      </Button>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
      ) : (
        <FlatList
          data={historial}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderAgenteResponse}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f9fc',
  },
  input: {
    marginBottom: 16,
  },
  runButton: {
    marginBottom: 16,
  },
  loading: {
    marginVertical: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
  },
  agentName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  response: {
    fontSize: 14,
    color: '#555',
  },
  list: {
    paddingBottom: 16,
  },
});

export default RunFlujoScreen;
