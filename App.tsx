
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Define cómo se representa una tarea.
type Tarea = {
  id: string;
  titulo: string;
  descripcion: string;
};

export default function App() {
  // Estados de la aplicación.
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // Agrega una tarea nueva o guarda los cambios de una existente.
  const guardarTarea = () => {
    if (!titulo.trim() || !descripcion.trim()) {
      Alert.alert(
        'Campos obligatorios',
        'Completa el título y la descripción.'
      );
      return;
    }

    if (editandoId !== null) {
      setTareas((anteriores) =>
        anteriores.map((tarea) =>
          tarea.id === editandoId
            ? {
                ...tarea,
                titulo: titulo.trim(),
                descripcion: descripcion.trim(),
              }
            : tarea
        )
      );
    } else {
      const nuevaTarea: Tarea = {
        id: `${Date.now()}-${Math.random()}`,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
      };

      setTareas((anteriores) => [...anteriores, nuevaTarea]);
    }

    // Limpia el formulario después de guardar.
    setTitulo('');
    setDescripcion('');
    setEditandoId(null);
    Keyboard.dismiss();
  };

  // Coloca los datos de una tarea en el formulario.
  const editarTarea = (tarea: Tarea) => {
    setTitulo(tarea.titulo);
    setDescripcion(tarea.descripcion);
    setEditandoId(tarea.id);
  };

  // Elimina una tarea después de confirmar.
  const eliminarTarea = (id: string) => {
    Alert.alert(
      'Eliminar tarea',
      '¿Deseas eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () =>
            setTareas((anteriores) =>
              anteriores.filter((tarea) => tarea.id !== id)
            ),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={styles.contenido}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={tareas}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listaContenido}
          ListHeaderComponent={
            <>
              {/* Encabezado de la aplicación */}
              <View style={styles.encabezado}>
                <View style={styles.logo}>
                  <Text style={styles.logoTexto}>✦</Text>
                </View>

                <View>
                  <Text style={styles.nombreApp}>Neon Tasks</Text>
                  <Text style={styles.nombreSecundario}>
                    Tu espacio de organización
                  </Text>
                </View>
              </View>

              {/* Mensaje de bienvenida */}
              <View style={styles.bienvenida}>
                <Text style={styles.bienvenidaTitulo}>
                  Organiza tu día ✨
                </Text>
                <Text style={styles.bienvenidaDescripcion}>
                  Haz espacio para tus ideas y pendientes.
                </Text>
              </View>

              {/* Formulario para crear o editar tareas */}
              <View style={styles.formularioBorde}>
                <View style={styles.formulario}>
                  <View style={styles.filaTitulo}>
                    <Text style={styles.seccionTitulo}>
                      {editandoId !== null
                        ? 'Editar tarea'
                        : 'Nueva tarea'}
                    </Text>
                    <Text style={styles.estrella}>✦</Text>
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="Título de la tarea"
                    placeholderTextColor="#A390B6"
                    value={titulo}
                    onChangeText={setTitulo}
                    maxLength={80}
                  />

                  <TextInput
                    style={[
                      styles.input,
                      styles.descripcionInput,
                    ]}
                    placeholder="Descripción..."
                    placeholderTextColor="#A390B6"
                    value={descripcion}
                    onChangeText={setDescripcion}
                    multiline
                    maxLength={300}
                  />

                  <Pressable
                    style={({ pressed }) => [
                      styles.botonGuardar,
                      pressed && styles.botonPresionado,
                    ]}
                    onPress={guardarTarea}
                    accessibilityRole="button"
                  >
                    <Text style={styles.textoGuardar}>
                      {editandoId !== null
                        ? '✦ Guardar cambios'
                        : '+ Agregar tarea'}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Título y contador */}
              <View style={styles.encabezadoLista}>
                <Text style={styles.tituloLista}>
                  Mis pendientes
                </Text>
                <View style={styles.contador}>
                  <Text style={styles.textoContador}>
                    {tareas.length}{' '}
                    {tareas.length === 1 ? 'tarea' : 'tareas'}
                  </Text>
                </View>
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.vacio}>
              <Text style={styles.vacioIcono}>✧</Text>
              <Text style={styles.vacioTitulo}>
                ¡Todo está en calma!
              </Text>
              <Text style={styles.vacioDescripcion}>
                Agrega tu primera tarea para comenzar.
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.tarjetaBorde,
                {
                  borderColor:
                    index % 3 === 0
                      ? '#50DBEB'
                      : index % 3 === 1
                      ? '#F17BD5'
                      : '#C86BFF',
                },
              ]}
            >
              <View style={styles.tarjeta}>
                <Text style={styles.tituloTarea}>
                  {item.titulo}
                </Text>

                <Text style={styles.descripcionTarea}>
                  {item.descripcion}
                </Text>

                <View style={styles.acciones}>
                  <Pressable
                    onPress={() => editarTarea(item)}
                    style={styles.botonEditar}
                    accessibilityRole="button"
                  >
                    <Text style={styles.textoEditar}>
                      ✎ Editar
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => eliminarTarea(item.id)}
                    style={styles.botonEliminar}
                    accessibilityRole="button"
                  >
                    <Text style={styles.textoEliminar}>
                      ✕ Eliminar
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Estilos visuales de la aplicación.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F0FF',
    paddingTop: Platform.OS === 'android' ? 35 : 0,
  },
  contenido: {
    flex: 1,
  },
  listaContenido: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 45,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  logo: {
    width: 48,
    height: 48,
    backgroundColor: '#EAD8FF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#CB77FF',
  },
  logoTexto: {
    color: '#AD42EF',
    fontSize: 26,
  },
  nombreApp: {
    fontSize: 25,
    fontWeight: '800',
    color: '#563378',
  },
  nombreSecundario: {
    fontSize: 12,
    color: '#9478AB',
    marginTop: 3,
  },
  bienvenida: {
    backgroundColor: '#FDEEFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 22,
  },
  bienvenidaTitulo: {
    fontSize: 23,
    fontWeight: '800',
    color: '#68458E',
    marginBottom: 7,
  },
  bienvenidaDescripcion: {
    fontSize: 14,
    color: '#9377A8',
    lineHeight: 21,
  },
  formularioBorde: {
    borderWidth: 2,
    borderColor: '#CE6BFF',
    borderRadius: 22,
    marginBottom: 25,
    shadowColor: '#C45BFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.32,
    shadowRadius: 12,
    elevation: 5,
    backgroundColor: '#FFFAFF',
  },
  formulario: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#FFFAFF',
  },
  filaTitulo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 17,
  },
  seccionTitulo: {
    fontSize: 19,
    fontWeight: '700',
    color: '#6D4395',
  },
  estrella: {
    color: '#CE6BFF',
    fontSize: 23,
  },
  input: {
    backgroundColor: '#F5ECFF',
    borderWidth: 1,
    borderColor: '#E0B7FF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 13,
    color: '#563378',
  },
  descripcionInput: {
    minHeight: 85,
    textAlignVertical: 'top',
  },
  botonGuardar: {
    backgroundColor: '#B34AF1',
    paddingVertical: 16,
    borderRadius: 13,
    alignItems: 'center',
    shadowColor: '#B34AF1',
    shadowOpacity: 0.3,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  botonPresionado: {
    opacity: 0.75,
  },
  textoGuardar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  encabezadoLista: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tituloLista: {
    color: '#68458E',
    fontSize: 20,
    fontWeight: '800',
  },
  contador: {
    backgroundColor: '#DDFBFA',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 30,
  },
  textoContador: {
    color: '#198F9B',
    fontSize: 12,
    fontWeight: '700',
  },
  tarjetaBorde: {
    borderWidth: 2,
    borderRadius: 18,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    shadowColor: '#BE80EE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 2,
  },
  tarjeta: {
    padding: 17,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  tituloTarea: {
    color: '#634188',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 7,
  },
  descripcionTarea: {
    color: '#9987AA',
    fontSize: 14,
    lineHeight: 21,
  },
  acciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 17,
  },
  botonEditar: {
    backgroundColor: '#E5FAFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  botonEliminar: {
    backgroundColor: '#FFF0F7',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textoEditar: {
    color: '#1FA6C7',
    fontSize: 13,
    fontWeight: '700',
  },
  textoEliminar: {
    color: '#E65B9E',
    fontSize: 13,
    fontWeight: '700',
  },
  vacio: {
    alignItems: 'center',
    padding: 25,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E9C9FF',
  },
  vacioIcono: {
    fontSize: 34,
    color: '#CE6BFF',
    marginBottom: 8,
  },
  vacioTitulo: {
    fontSize: 17,
    fontWeight: '700',
    color: '#68458E',
    marginBottom: 6,
  },
  vacioDescripcion: {
    color: '#9987AA',
    textAlign: 'center',
    fontSize: 13,
  },
});
