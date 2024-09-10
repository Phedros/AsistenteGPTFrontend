import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, RefreshControl } from 'react-native';
import { Card, Button, IconButton, Searchbar, useTheme, Checkbox } from 'react-native-paper';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [gpts, setGpts] = useState([]);
  const [filteredGpts, setFilteredGpts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedGpts, setSelectedGpts] = useState([]);

  // Obtener los GPTs disponibles
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

  // Manejar selección/deselección de un GPT
  const toggleSelectGpt = (id) => {
    setSelectedGpts((prevSelectedGpts) =>
      prevSelectedGpts.includes(id)
        ? prevSelectedGpts.filter((gptId) => gptId !== id)
        : [...prevSelectedGpts, id]
    );
  };

  // Confirmar la eliminación de un solo GPT
  const confirmDeleteSingleGpt = (id) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar este GPT?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => deleteSingleGpt(id),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  // Función para eliminar un solo GPT
  const deleteSingleGpt = async (id) => {
    try {
      await axios.delete(`http://10.0.2.2:5000/gpt/delete/${id}`);
      Alert.alert('Éxito', 'GPT eliminado correctamente.');
      fetchGpts();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al eliminar el GPT.');
    }
  };

  // Confirmar la eliminación de GPTs seleccionados
  const confirmDeleteSelectedGpts = () => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar ${selectedGpts.length} GPT(s)?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => deleteSelectedGpts(),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  // Eliminar GPTs seleccionados
  const deleteSelectedGpts = async () => {
    try {
      const promises = selectedGpts.map((id) => axios.delete(`http://10.0.2.2:5000/gpt/delete/${id}`));
      await Promise.all(promises);
      Alert.alert('Éxito', 'GPTs eliminados correctamente.');
      setSelectedGpts([]);
      fetchGpts();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al eliminar los GPTs.');
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.name}
        left={(props) => <Icon {...props} name="robot-outline" size={30} color={colors.primary} />}
        right={() => (
          <Checkbox
            status={selectedGpts.includes(item.id) ? 'checked' : 'unchecked'}
            onPress={() => toggleSelectGpt(item.id)}
          />
        )}
      />
      <Card.Content>
        <Text style={styles.gptDetails}>Modelo: {item.model}</Text>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          icon="chat"
          onPress={() => navigation.navigate('ConversationList', { gptId: item.id })}
        >
          Conver
        </Button>
        <Button
          mode="outlined"
          icon="pencil"
          onPress={() =>
            navigation.navigate('EditGPT', {
              gptId: item.id,
              initialName: item.name,
              initialApiKey: item.api_key,
              initialModel: item.model,
              initialSystemMessage: item.system_message,
              onGPTUpdated: handleGPTCreatedOrUpdated,
            })
          }
        >
          Editar
        </Button>
        <Button
          mode="outlined"
          icon="delete"
          color="red"
          onPress={() => confirmDeleteSingleGpt(item.id)} // Confirmar eliminación de un solo GPT
        >
          Eliminar
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.settingsButtonContainer}>
        <IconButton icon="cog" size={24} onPress={() => navigation.navigate('Settings')} />
      </View>

      <Text style={styles.title}>Agent Manager</Text>

      <Searchbar
        placeholder="Buscar GPT..."
        onChangeText={handleSearch}
        value={searchText}
        style={styles.searchBar}
      />

      <Button
        mode="contained"
        icon={({ size, color }) => <Icon name="source-branch" size={size} color={color} />}
        style={[styles.createButton, styles.specialButton]}
        onPress={() => navigation.navigate('Flujos')}
      >
        Flujos
      </Button>

      <Button
        mode="contained"
        icon="plus"
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateGPT', { onGPTCreated: handleGPTCreatedOrUpdated })}
      >
        Crear GPT
      </Button>

      {selectedGpts.length > 0 && (
        <Button
          mode="contained"
          icon="delete"
          color="red"
          onPress={confirmDeleteSelectedGpts}
          style={styles.deleteButton}
        >
          Eliminar {selectedGpts.length} GPTs
        </Button>
      )}

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
      ) : (
        <FlatList
          data={filteredGpts}
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
  settingsButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
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
  specialButton: {
    backgroundColor: '#6200ea',
    borderColor: '#3700b3',
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 8,
  },
  deleteButton: {
    marginBottom: 16,
    paddingVertical: 5,
    backgroundColor: 'red',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
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
