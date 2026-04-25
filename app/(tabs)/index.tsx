import { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useSarees } from '../../hooks/useSarees';
import { X, Search } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function GalleryScreen() {
  const { sarees, loading } = useSarees();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSaree, setSelectedSaree] = useState<any>(null);

  if (loading) return <View style={styles.center}><Text>Loading...</Text></View>;

  const filteredSarees = sarees.filter(s => 
    !searchQuery || (s.sellingCode && s.sellingCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Search color="#999" size={20} style={{ marginRight: 8 }} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search Public Code..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {filteredSarees.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No sarees found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSarees}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={{ padding: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              activeOpacity={0.8}
              onPress={() => setSelectedSaree(item)}
            >
              <View>
                <Image source={{ uri: item.imageUri }} style={styles.image} resizeMode="cover" />
                {item.imageUri2 && (
                  <View style={styles.badgeOverlay}>
                    <Text style={styles.badgeText}>2 Photos</Text>
                  </View>
                )}
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.codeText}>{item.sellingCode || 'No Code'}</Text>
                <Text style={styles.price}>₹ {item.sellingPrice}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Full Screen Image Viewer Modal */}
      <Modal visible={!!selectedSaree} transparent={true} animationType="fade">
        <View style={styles.fullScreenModal}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedSaree(null)}>
            <X color="#fff" size={32} />
          </TouchableOpacity>
          
          {selectedSaree && (
            <FlatList
              data={[selectedSaree.imageUri, selectedSaree.imageUri2].filter(Boolean)}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(uri, i) => uri + i}
              renderItem={({ item }) => (
                <View style={{ width, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                   <Image source={{ uri: item }} style={styles.fullScreenImage} resizeMode="contain" />
                </View>
              )}
            />
          )}
          
          {selectedSaree && selectedSaree.imageUri2 && (
            <Text style={{position: 'absolute', bottom: 50, color: 'rgba(255,255,255,0.5)', fontSize: 16}}>Swipe to see more</Text>
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
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e2e2e2', margin: 16, paddingHorizontal: 12, borderRadius: 12, height: 48 },
  searchInput: { flex: 1, fontSize: 16 },
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
  image: { width: '100%', height: 200 },
  cardFooter: { padding: 8, alignItems: 'center' },
  codeText: { fontSize: 12, color: '#888', fontWeight: 'bold', marginBottom: 4 },
  price: { fontSize: 18, fontWeight: '700', color: '#FF2A54' },
  badgeOverlay: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  
  fullScreenModal: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  fullScreenImage: { width: '100%', height: '80%' },
  closeBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 }
});
