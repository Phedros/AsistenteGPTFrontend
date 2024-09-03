import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, RefreshControl } from 'react-native';
import { Card, Button, IconButton, useTheme } from 'react-native-paper';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ConversationListScreen = ({ route, navigation }) => {
  const { gptId } = route.params; // Recibe el ID del GPT desde la navegación
  const { colors } = useTheme();
  const [conversations, setConversations] = useState([]); // Estado para almacenar todas las conversaciones
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:5000/gpt/conversations/${gptId}`);
      if (response.data) {
        setConversations(response.data);
      } else {
        console.error("No se recibieron conversaciones esperadas:", response.data);
      }
    } catch (error) {
      console.error("Error al obtener las conversaciones:", error);
      Alert.alert('Error', 'Hubo un problema al obtener las conversaciones.');
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async () => {
    try {
      const response = await axios.post(`http://10.0.2.2:5000/gpt/conversation/create/${gptId}`);
      if (response.data.conversation_id) {
        fetchConversations(); // Refresca la lista de conversaciones
      } else {
        console.error("Error al crear la conversación:", response.data);
        Alert.alert('Error', 'Hubo un problema al crear la conversación.');
      }
    } catch (error) {
      console.error("Error al crear la conversación:", error);
      Alert.alert('Error', 'Hubo un problema al crear la conversación.');
    }
  };

  const deleteConversation = async (conversationId) => {
    Alert.alert(
      'Confirmación',
      '¿Estás seguro de que deseas eliminar esta conversación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await axios.delete(`http://10.0.2.2:5000/gpt/conversation/delete/${gptId}/${conversationId}`);
              if (response.status === 200) {
                fetchConversations(); // Refresca la lista de conversaciones después de eliminar una
              } else {
                console.error("Error al eliminar la conversación:", response.data);
                Alert.alert('Error', 'Hubo un problema al eliminar la conversación.');
              }
            } catch (error) {
              console.error("Error al eliminar la conversación:", error);
              Alert.alert('Error', 'Hubo un problema al eliminar la conversación.');
            }
          }
        }
      ]
    );
  };

  const renderConversation = ({ item }) => (
    <Card style={styles.card}>
      <Card.Title title={`Conversación ${item.id}`} left={(props) => <Icon {...props} name="chat-processing" size={30} color={colors.primary} />} />
      <Card.Actions>
        <Button mode="contained" icon="chat" onPress={() => navigation.navigate('ChatScreen', { gptId, conversationId: item.id })}>
          Abrir
        </Button>
        <Button mode="outlined" icon="delete" color="red" onPress={() => deleteConversation(item.id)}>
          Eliminar
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        icon="plus"
        style={styles.createButton}
        onPress={createConversation}
      >
        Crear Nueva Conversación
      </Button>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loading} />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderConversation}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchConversations} />
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
  loading: {
    marginTop: 20,
  },
  list: {
    paddingBottom: 16,
  },
});

export default ConversationListScreen;
