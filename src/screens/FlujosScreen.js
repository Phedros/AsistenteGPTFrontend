import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Alert, StyleSheet, RefreshControl, Text } from 'react-native';
import { Card, Button, IconButton, Searchbar, useTheme } from 'react-native-paper';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FlujosScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [flujos, setFlujos] = useState([]);
  const [filteredFlujos, setFilteredFlujos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchFlujos();
  }, []);

  const fetchFlujos = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:5000/flujo');
      setFlujos(response.data);
      setFilteredFlujos(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al obtener los flujos.');
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFlujos().then(() => setRefreshing(false));
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = flujos.filter((flujo) =>
      flujo.nombre.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredFlujos(filtered);
  };

  const deleteFlujo = async (flujoId) => {
    try {
      await axios.delete(`http://10.0.2.2:5000/flujo/eliminar/${flujoId}`);
      Alert.alert('Éxito', 'Flujo eliminado con éxito.');
      fetchFlujos(); // Refresca la lista de flujos después de la eliminación
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo eliminar el flujo.');
    }
  };

  const renderFlujo = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.nombre}
        left={(props) => <Icon {...props} name="source-branch" size={30} color={colors.primary} />}
      />
      <Card.Actions>
        <Button
          mode="contained"
          icon="eye"
          onPress={() => navigation.navigate('FlujoDetail', { flujoId: item.id })}
        >
          Ver Flujo
        </Button>
        <Button
          mode="outlined"
          icon="delete"
          color="red"
          onPress={() => deleteFlujo(item.id)}
        >
          Eliminar
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>Gestión de Flujos</Text>

      {/* Barra de búsqueda */}
      <Searchbar
        placeholder="Buscar Flujos..."
        onChangeText={handleSearch}
        value={searchText}
        style={styles.searchBar}
      />

      {/* Botón para Crear Nuevo Flujo */}
      <Button
        mode="contained"
        icon="plus"
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateFlujo')}
      >
        Crear Nuevo Flujo
      </Button>

      {/* Lista de Flujos */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
      ) : (
        <FlatList
          data={filteredFlujos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFlujo}
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
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

export default FlujosScreen;
