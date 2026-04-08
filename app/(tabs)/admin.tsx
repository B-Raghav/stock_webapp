import { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useSarees } from '../../hooks/useSarees';
import { Link } from 'expo-router';
import { Plus, Trash2, Lock } from 'lucide-react-native';

export default function AdminScreen() {
  const { sarees, loading, removeSaree } = useSarees();
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return (
      <View style={styles.center}>
        <Lock color="#ccc" size={48} style={{ marginBottom: 16 }} />
        <Text style={styles.title}>Enter PIN to access Admin</Text>
        <TextInput 
          style={styles.pinInput}
          secureTextEntry
          keyboardType="numeric"
          value={pin}
          onChangeText={setPin}
          placeholder="PIN"
        />
        <TouchableOpacity style={styles.btn} onPress={() => { if(pin === '1234') setUnlocked(true); else alert('Wrong PIN') }}>
          <Text style={styles.btnText}>Unlock</Text>
        </TouchableOpacity>
        <Text style={{ marginTop: 20, color: '#aaa' }}>Default PIN is 1234</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sarees}
        ListHeaderComponent={<View style={{ height: 16 }} />}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Image source={{ uri: item.imageUri }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.costPrice}>Buying: ₹ {item.costPrice}</Text>
              <Text style={styles.sellingPrice}>Selling: ₹ {item.sellingPrice}</Text>
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            <TouchableOpacity onPress={() => removeSaree(item.id)} style={styles.deleteBtn}>
              <Trash2 color="#ff4444" size={24} />
            </TouchableOpacity>
          </View>
        )}
      />
      <Link href="/modal" asChild>
        <TouchableOpacity style={styles.fab}>
          <Plus color="#fff" size={32} />
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold' },
  pinInput: { borderWidth: 1, borderColor: '#ddd', width: '60%', padding: 12, borderRadius: 8, marginVertical: 16, textAlign: 'center', fontSize: 24, letterSpacing: 4 },
  btn: { backgroundColor: '#333', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  row: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 12, overflow: 'hidden', padding: 8, elevation: 1 },
  image: { width: 80, height: 80, borderRadius: 8 },
  info: { flex: 1, paddingHorizontal: 12, justifyContent: 'center' },
  costPrice: { color: '#e74c3c', fontSize: 14, marginBottom: 4 },
  sellingPrice: { color: '#2ecc71', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  date: { color: '#aaa', fontSize: 12 },
  deleteBtn: { padding: 12, justifyContent: 'center' },
  fab: { position: 'absolute', right: 24, bottom: 24, width: 64, height: 64, borderRadius: 32, backgroundColor: '#FF2A54', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: {height:4,width:0}, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 }
});
