import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { useSarees } from '../hooks/useSarees';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ImagePlus } from 'lucide-react-native';

import * as ImageManipulator from 'expo-image-manipulator';

export default function AddSareeModal() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [buyingCode, setBuyingCode] = useState('');
  const [sellingCode, setSellingCode] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const { addSaree } = useSarees();
  const router = useRouter();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8, 
    });

    if (!result.canceled) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 500 } }],
        { compress: 0.4, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      
      if (manipResult.base64) {
        setImageUri(`data:image/jpeg;base64,${manipResult.base64}`);
      }
    }
  };

  const handleSave = async () => {
    if (!imageUri || !buyingCode || !sellingCode || !costPrice || !sellingPrice) {
      alert("Please fill all fields and select an image.");
      return;
    }
    
    // Automatically add 5% to whatever number they type for buying price!
    const parsedCost = parseFloat(costPrice);
    const finalCostWithMargin = isNaN(parsedCost) ? costPrice : Math.round(parsedCost * 1.05).toString();

    await addSaree({
      imageUri,
      buyingCode,
      sellingCode,
      costPrice: finalCostWithMargin,
      sellingPrice
    });
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.label}>Saree Photo</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <ImagePlus color="#aaa" size={48} />
            <Text style={{ color: '#aaa', marginTop: 8 }}>Tap to Select Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Buying Code (Secret)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. BC-100"
        value={buyingCode}
        onChangeText={setBuyingCode}
      />

      <Text style={styles.label}>Selling Code (Public)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. SK-1042"
        value={sellingCode}
        onChangeText={setSellingCode}
      />

      <Text style={styles.label}>Buying Price (₹)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="e.g. 1500"
        value={costPrice}
        onChangeText={setCostPrice}
      />

      <Text style={styles.label}>Selling Price (₹)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="e.g. 2500"
        value={sellingPrice}
        onChangeText={setSellingPrice}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save to Inventory</Text>
      </TouchableOpacity>
      
      {Platform.OS === 'ios' && <View style={{ height: 40 }} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  input: { borderWidth: 1, borderColor: '#eee', padding: 16, borderRadius: 12, fontSize: 16, marginBottom: 24, backgroundColor: '#fafafa' },
  imagePicker: { height: 300, backgroundColor: '#f0f0f0', borderRadius: 16, overflow: 'hidden', marginBottom: 24, borderWidth: 1, borderColor: '#eee', borderStyle: 'dashed' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: '100%' },
  saveBtn: { backgroundColor: '#FF2A54', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  saveBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
