import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Alert } from 'react-native';
import { Button, Card, Menu, Provider as PaperProvider } from 'react-native-paper';
import axios from 'axios';

const CreateFlujoScreen = ({ navigation, route }) => {
  const flujoId = route?.params?.flujoId || null;
  const [nombreFlujo, setNombreFlujo] = useState('');
  const [agentes, setAgentes] = useState([]);
  const [nuevoGpt, setNuevoGpt] = useState({ gpt_id: '', prompt_entrada: '', tipo_prompt: '', referencias_respuestas: [] });
  const [gpts, setGpts] = useState([]);
  const [promptOptions, setPromptOptions] = useState([]);
  const [menuGptVisible, setMenuGptVisible] = useState(false);
  const [tipoPromptMenuVisible, setTipoPromptMenuVisible] = useState(false);
  const [menuAgentesVisible, setMenuAgentesVisible] = useState(false); // Estado para el menú de agentes en el prompt combinado
  const [selectedAgents, setSelectedAgents] = useState([]); // Para seleccionar múltiples agentes

  const fetchGpts = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:5000/gpts');
      setGpts(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al obtener la lista de GPTs.');
    }
  };

  const fetchPromptOptions = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:5000/flujo/prompt-options');
      setPromptOptions(response.data);
    } catch (error) {
      console.error('Error al obtener las opciones de prompt:', error);
      Alert.alert('Error', 'Hubo un problema al obtener las opciones de prompt.');
    }
  };

  const fetchAgentes = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:5000/flujo/${flujoId}/agentes`);
      setAgentes(response.data);
    } catch (error) {
      console.error('Error al obtener los agentes del flujo:', error);
      Alert.alert('Error', 'Hubo un problema al obtener los agentes del flujo.');
    }
  };

  useEffect(() => {
    fetchGpts();
    fetchPromptOptions();

    if (flujoId) {
      fetchAgentes();
    }
  }, [flujoId]);

  const agregarAgente = () => {
    if (!nuevoGpt.gpt_id || !nuevoGpt.tipo_prompt) {
      Alert.alert('Error', 'Debe completar todos los campos para agregar un agente.');
      return;
    }

    const nuevoOrden = agentes.length + 1;

    let referencias_respuestas = [];

    // Si el tipo de prompt es 'respuesta_anterior', añadimos el agente anterior como referencia
    if (nuevoGpt.tipo_prompt === 'respuesta_anterior') {
      const ordenAnterior = agentes.length > 0 ? agentes[agentes.length - 1].orden : null;
      if (ordenAnterior !== null) {
        referencias_respuestas = [ordenAnterior]; // Aquí guardamos el número del agente anterior
      } else {
        Alert.alert('Error', 'No hay agentes anteriores para usar como referencia.');
        return;
      }
    }

    // Si el tipo de prompt es 'combinado', validamos que se haya seleccionado al menos un agente
    if (nuevoGpt.tipo_prompt === 'combinado' && selectedAgents.length === 0) {
      Alert.alert('Error', 'Debe seleccionar al menos un agente para combinar.');
      return;
    }

    const agenteConOrden = {
      ...nuevoGpt,
      orden: nuevoOrden,
      referencias_respuestas: nuevoGpt.tipo_prompt === 'combinado' ? selectedAgents : referencias_respuestas
    };

    // Actualizamos el estado con el nuevo agente
    setAgentes([...agentes, agenteConOrden]);

    // Reiniciamos el formulario
    setNuevoGpt({ gpt_id: '', prompt_entrada: '', tipo_prompt: '', referencias_respuestas: [] });
    setSelectedAgents([]);
  };

  const crearFlujo = async () => {
    if (!nombreFlujo || agentes.length === 0) {
      Alert.alert('Error', 'El nombre del flujo y al menos un agente son obligatorios.');
      return;
    }

    try {
      const response = await axios.post('http://10.0.2.2:5000/flujo/create', {
        nombre: nombreFlujo,
        agentes,
      });

      Alert.alert('Éxito', 'Flujo creado exitosamente.');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema al crear el flujo.');
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Crear Nuevo Flujo</Text>

        <TextInput
          placeholder="Nombre del Flujo"
          value={nombreFlujo}
          onChangeText={setNombreFlujo}
          style={styles.input}
        />

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Agregar Agente</Text>

          <Menu
            visible={menuGptVisible}
            onDismiss={() => setMenuGptVisible(false)}
            anchor={
              <Button mode="outlined" onPress={() => setMenuGptVisible(true)}>
                {nuevoGpt.gpt_id ? gpts.find(g => g.id === nuevoGpt.gpt_id)?.name : 'Seleccionar GPT'}
              </Button>
            }>
            {gpts.map((gpt) => (
              <Menu.Item
                key={gpt.id}
                onPress={() => {
                  setNuevoGpt({ ...nuevoGpt, gpt_id: gpt.id });
                  setMenuGptVisible(false);
                }}
                title={gpt.name}
              />
            ))}
          </Menu>

          <Menu
            visible={tipoPromptMenuVisible}
            onDismiss={() => setTipoPromptMenuVisible(false)}
            anchor={
              <Button mode="outlined" onPress={() => setTipoPromptMenuVisible(true)}>
                {nuevoGpt.tipo_prompt ? promptOptions.find(opt => opt.value === nuevoGpt.tipo_prompt)?.label : 'Seleccionar Tipo de Prompt'}
              </Button>
            }>
            {promptOptions.map((option) => (
              <Menu.Item
                key={option.value}
                onPress={() => {
                  setNuevoGpt({ ...nuevoGpt, tipo_prompt: option.value });
                  setTipoPromptMenuVisible(false);
                }}
                title={option.label}
              />
            ))}
          </Menu>

          {nuevoGpt.tipo_prompt === 'combinado' && (
            <View style={styles.agentsContainer}>
              <Text>Selecciona Agentes para el Prompt Combinado:</Text>
              <Menu
                visible={menuAgentesVisible}
                onDismiss={() => setMenuAgentesVisible(false)}
                anchor={
                  <Button mode="outlined" onPress={() => setMenuAgentesVisible(true)}>
                    {selectedAgents.length > 0 ? `Agentes seleccionados: ${selectedAgents.join(', ')}` : 'Seleccionar Agentes'}
                  </Button>
                }
              >
                {agentes.map((agente) => (
                  <Menu.Item
                    key={agente.orden}
                    onPress={() => {
                      if (selectedAgents.includes(agente.orden)) {
                        setSelectedAgents(selectedAgents.filter(id => id !== agente.orden));
                      } else {
                        setSelectedAgents([...selectedAgents, agente.orden]);
                      }
                      setMenuAgentesVisible(false);
                    }}
                    title={`Agente ${agente.orden}`}
                  />
                ))}
              </Menu>
            </View>
          )}

          {nuevoGpt.tipo_prompt === 'prompt_directo' && (
            <TextInput
              placeholder="Prompt del Usuario"
              value={nuevoGpt.prompt_entrada}
              onChangeText={(text) => setNuevoGpt({ ...nuevoGpt, prompt_entrada: text })}
              style={styles.input}
            />
          )}

          <Button mode="contained" onPress={agregarAgente} style={styles.addButton}>
            Agregar Agente
          </Button>
        </Card>

        <FlatList
          data={agentes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.agentItem}>
              <Text>ID GPT: {item.gpt_id}, Orden: {item.orden}, Prompt: {item.prompt_entrada || 'Sin Prompt'}</Text>
            </View>
          )}
        />

        <Button mode="contained" onPress={crearFlujo} style={styles.createButton}>
          Crear Flujo
        </Button>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButton: {
    marginTop: 10,
  },
  agentItem: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 10,
  },
  agentsContainer: {
    marginTop: 16,
  },
  createButton: {
    marginTop: 20,
  },
});

export default CreateFlujoScreen;
