import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { useSarees } from '../hooks/useSarees';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ImagePlus } from 'lucide-react-native';

import * as ImageManipulator from 'expo-image-manipulator';

export default function AddSareeModal() {
  const { editId } = useLocalSearchParams();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageUri2, setImageUri2] = useState<string | null>(null);
  const [buyingCode, setBuyingCode] = useState('');
  const [sellingCode, setSellingCode] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  
  const { sarees, addSaree, updateSaree } = useSarees();
  const router = useRouter();

  useEffect(() => {
    if (editId && sarees.length > 0) {
      const target = sarees.find(s => s.id === editId);
      if (target && !imageUri) { 
        setImageUri(target.imageUri);
        if (target.imageUri2) setImageUri2(target.imageUri2);
        setBuyingCode(target.buyingCode || '');
        setSellingCode(target.sellingCode || '');
        setCostPrice(target.costPrice);
        setSellingPrice(target.sellingPrice);
      }
    }
  }, [editId, sarees]);

  const pickImage = async (isSecondary = false) => {
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
        const url = `data:image/jpeg;base64,${manipResult.base64}`;
        if (isSecondary) setImageUri2(url);
        else setImageUri(url);
      }
    }
  };

  const handleSave = async () => {
    if (!imageUri || !buyingCode || !sellingCode || !costPrice || !sellingPrice) {
      alert("Please fill all fields and select at least one main image.");
      return;
    }
    
    const finalCost = costPrice;

    if (editId) {
      await updateSaree(editId as string, {
        imageUri,
        imageUri2: imageUri2 || undefined,
        buyingCode,
        sellingCode,
        costPrice: finalCost,
        sellingPrice
      });
    } else {
      await addSaree({
        imageUri,
        imageUri2: imageUri2 || undefined,
        buyingCode,
        sellingCode,
        costPrice: finalCost,
        sellingPrice
      });
    }
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {editId && <Text style={{fontSize: 22, fontWeight: '900', color: '#3498db', marginBottom: 20}}>Editing Mode</Text>}
      
      <Text style={styles.label}>Saree Photos (Up to 2)</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24}}>
        <TouchableOpacity style={[styles.imagePicker, {flex: 1, marginRight: 10}]} onPress={() => pickImage(false)}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <ImagePlus color="#aaa" size={32} />
              <Text style={{ color: '#aaa', marginTop: 8, fontSize: 12 }}>Main Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.imagePicker, {flex: 1, marginLeft: 10}]} onPress={() => pickImage(true)}>
          {imageUri2 ? (
            <Image source={{ uri: imageUri2 }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <ImagePlus color="#aaa" size={32} />
              <Text style={{ color: '#aaa', marginTop: 8, fontSize: 12 }}>Detail Photo</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

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

      <TouchableOpacity style={[styles.saveBtn, editId && {backgroundColor: '#3498db'}]} onPress={handleSave}>
        <Text style={styles.saveBtnText}>{editId ? "Update Inventory" : "Save to Inventory"}</Text>
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
