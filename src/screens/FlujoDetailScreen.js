import React, { useState, useEffect } from 'react';
import { View, FlatList, Alert, ActivityIndicator, StyleSheet, RefreshControl, Text } from 'react-native';
import { Card, Button, useTheme, Searchbar } from 'react-native-paper';
import axios from 'axios';

const FlujoDetailScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { flujoId } = route.params;
  const [conversaciones, setConversaciones] = useState([]);
  const [filteredConversaciones, setFilteredConversaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchConversaciones();
  }, []);

  const fetchConversaciones = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:5000/flujo/${flujoId}/conversaciones`);
      setConversaciones(response.data);
      setFilteredConversaciones(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al obtener las conversaciones.');
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = conversaciones.filter((conv) =>
      conv.id.toString().includes(text)
    );
    setFilteredConversaciones(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchConversaciones().then(() => setRefreshing(false));
  };

  const crearConversacion = async () => {
    try {
      const response = await axios.post(`http://10.0.2.2:5000/flujo/conversation/create/${flujoId}`);
      const conversationId = response.data.conversation_id;
      Alert.alert('Conversación creada', `Conversación ID: ${conversationId}`);
      navigation.navigate('RunFlujo', { flujoId, conversationId });
    } catch (error) {
      console.error('Error al crear la conversación:', error);
      Alert.alert('Error', 'Hubo un problema al crear la conversación.');
    }
  };

  const deleteConversacion = async (conversationId) => {
    try {
      await axios.delete(`http://10.0.2.2:5000/flujo/conversation/delete/${conversationId}`);
      Alert.alert('Éxito', 'Conversación eliminada correctamente.');
      fetchConversaciones(); // Refresca la lista de conversaciones después de eliminar
    } catch (error) {
      console.error('Error al eliminar la conversación:', error);
      Alert.alert('Error', 'Hubo un problema al eliminar la conversación.');
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={`ID Conversación: ${item.id}`} />
      <Card.Actions>
        <Button
          mode="contained"
          icon="play"
          onPress={() => navigation.navigate('RunFlujo', { flujoId, conversationId: item.id })}
        >
          Correr Flujo
        </Button>
        <Button
          mode="outlined"
          icon="delete"
          color="red"
          onPress={() => deleteConversacion(item.id)}
        >
          Eliminar
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <Searchbar
        placeholder="Buscar Conversaciones..."
        onChangeText={handleSearch}
        value={searchText}
        style={styles.searchBar}
      />

      {/* Botón para crear conversación */}
      <Button
        mode="contained"
        icon="plus"
        style={styles.createButton}
        onPress={crearConversacion}
      >
        Crear Nueva Conversación
      </Button>

      {/* Lista de conversaciones */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
      ) : (
        <FlatList
          data={filteredConversaciones}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
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
  searchBar: {
    marginBottom: 16,
    borderRadius: 8,
  },
  createButton: {
    marginBottom: 16,
    paddingVertical: 5,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
  },
  loading: {
    marginTop: 20,
  },
  list: {
    paddingBottom: 16,
  },
});

export default FlujoDetailScreen;
