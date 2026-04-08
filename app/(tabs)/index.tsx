import { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { useSarees } from '../../hooks/useSarees';
import { X } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function GalleryScreen() {
  const { sarees, loading } = useSarees();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (loading) return <View style={styles.center}><Text>Loading...</Text></View>;

  if (sarees.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No sarees in collection yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sarees}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            activeOpacity={0.8}
            onPress={() => setSelectedImage(item.imageUri)}
          >
            <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
            <Text style={styles.price}>₹ {item.sellingPrice}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Full Screen Image Viewer Modal */}
      <Modal visible={!!selectedImage} transparent={true} animationType="fade">
        <View style={styles.fullScreenModal}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedImage(null)}>
            <X color="#fff" size={32} />
          </TouchableOpacity>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.fullScreenImage} resizeMode="contain" />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#666', fontSize: 16 },
  card: {
    width: width / 2 - 24, // 2 columns with padding
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: { width: '100%', height: 220 },
  price: { fontSize: 18, fontWeight: '700', color: '#FF2A54', margin: 12, textAlign: 'center' },
  
  fullScreenModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  fullScreenImage: { width: '100%', height: '80%' },
  closeBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 }
});
