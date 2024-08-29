import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, TextInput, RefreshControl, Image } from 'react-native';
import { Card, Button, IconButton, Searchbar, useTheme } from 'react-native-paper';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [gpts, setGpts] = useState([]);
  const [filteredGpts, setFilteredGpts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchGpts = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:5000/gpts');
      const sortedGpts = response.data.sort((a, b) => a.name.localeCompare(b.name));

      setGpts(sortedGpts);
      setFilteredGpts(sortedGpts);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al obtener los GPTs.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGpts();
  }, []);

  const handleGPTCreatedOrUpdated = () => {
    fetchGpts();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchGpts().then(() => setRefreshing(false));
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = gpts.filter(gpt => gpt.name.toLowerCase().includes(text.toLowerCase()));
    setFilteredGpts(filtered);
  };

  const deleteGpt = async (id) => {
    try {
      await axios.delete(`http://10.0.2.2:5000/gpt/delete/${id}`);
      Alert.alert('Éxito', 'GPT eliminado correctamente.');
      fetchGpts();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al eliminar el GPT.');
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={item.name} left={(props) => <Icon {...props} name="robot-outline" size={30} color={colors.primary} />} />
      <Card.Content>
        <Text style={styles.gptDetails}>Modelo: {item.model}</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" icon="chat" onPress={() => navigation.navigate('ChatScreen', { gptId: item.id })}>
          Chatear
        </Button>
        <Button mode="outlined" icon="pencil" onPress={() => navigation.navigate('EditGPT', {
          gptId: item.id,
          initialName: item.name,
          initialApiKey: item.api_key,
          initialModel: item.model,
          initialSystemMessage: item.system_message,
          onGPTUpdated: handleGPTCreatedOrUpdated
        })}>
          Editar
        </Button>
        <Button mode="outlined" icon="delete" color="red" onPress={() => deleteGpt(item.id)}>
          Eliminar
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      {/* Contenedor para el botón de configuración */}
      <View style={styles.settingsButtonContainer}>
        <IconButton
          icon="cog"
          size={24}
          onPress={() => navigation.navigate('Settings')}
        />
      </View>

      {/* Logo y Título */}
      <Image source={require('../../assets/logo.webp')} style={styles.logo} />
      <Text style={styles.title}>Welcome to Agent Manager</Text>

      {/* Barra de Búsqueda */}
      <Searchbar
        placeholder="Buscar GPT..."
        onChangeText={handleSearch}
        value={searchText}
        style={styles.searchBar}
      />

      {/* Botón para Crear Nuevo GPT */}
      <Button
        mode="contained"
        icon="plus"
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateGPT', { onGPTCreated: handleGPTCreatedOrUpdated })}
      >
        Crear GPT
      </Button>

      {/* Lista de GPTs */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
      ) : (
        <FlatList
          data={filteredGpts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
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
  settingsButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, // Asegura que esté por encima de otros elementos
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gptDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  loading: {
    marginTop: 20,
  },
  list: {
    paddingBottom: 16,
  },
});

export default HomeScreen;
