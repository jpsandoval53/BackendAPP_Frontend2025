import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { api } from "../hooks/useApiFetch";

type FormPayload = {
  nombre: string;
  vlr_unit: number;
  categoria: string;
  referencia: string;
};

export default function FormScreen() {
  const [nombre, setNombre] = useState("");
  const [vlr_unit, setVlrUnit] = useState("");
  const [categoria, setCategoria] = useState("");
  const [referencia, setReferencia] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nombre.trim() || !vlr_unit.trim() || !categoria.trim() || !referencia.trim()) {
      Alert.alert(
        "Formulario incompleto",
        "Por favor completa todos los campos."
      );
      return;
    }

    const payload: FormPayload = {
      nombre: nombre.trim(),
      vlr_unit: parseFloat(vlr_unit),
      categoria: categoria.trim(),
      referencia: referencia.trim(),
    };

    setLoading(true);
    const { data, error } = await api.post<{ id: number; message: string }>(
      "/crear",
      payload
    );
    setLoading(false);

    if (error) {
      Alert.alert(
        "Error al enviar",
        `${error.message} (status: ${error.status})`
      );
      return;
    }

    Alert.alert("¡Enviado!", `ID: ${data?.id}\n${data?.message}`);

    // limpiar campos
    setNombre("");
    setVlrUnit("");
    setCategoria("");
    setReferencia("");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#4a4e46ff" }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Crear Producto</Text>

        {/* NOMBRE */}
        <View style={styles.field}>
          <Text style={styles.label}>Nombre del Producto</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Cable USB"
            placeholderTextColor="#d9d4d2"
            value={nombre}
            onChangeText={setNombre}
            returnKeyType="next"
          />
        </View>

        {/* VALOR UNITARIO */}
        <View style={styles.field}>
          <Text style={styles.label}>Valor Unitario</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 25.900"
            placeholderTextColor="#d9d4d2"
            value={vlr_unit}
            onChangeText={setVlrUnit}
            keyboardType="numeric"
          />
        </View>

        {/* CATEGORIA */}
        <View style={styles.field}>
          <Text style={styles.label}>Categoría</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Accesorios"
            placeholderTextColor="#d9d4d2"
            value={categoria}
            onChangeText={setCategoria}
          />
        </View>

        {/* REFERENCIA */}
        <View style={styles.field}>
          <Text style={styles.label}>Referencia</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: ABC123"
            placeholderTextColor="#d9d4d2"
            value={referencia}
            onChangeText={setReferencia}
          />
        </View>

        <TouchableOpacity
          style={[styles.submit, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.submitText}>Guardar Producto</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 32, alignItems: "stretch" },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  field: { marginBottom: 14 },
  label: { color: "#fff", marginBottom: 6, fontWeight: "600" },
  input: {
    backgroundColor: "rgba(153, 140, 140, 0.12)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    borderWidth: 1,
    borderColor: "rgba(179, 162, 162, 0.25)",
  },
  submit: {
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: { color: "#5d473bff", fontWeight: "700", fontSize: 16 },
});
