import React from 'react';
import { View, Modal, Text, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';

const ProfileImageSelector = ({
  showModal,
  onCloseModal,
  images,
  onSelectImage,
  selectedImage,
  defaultImage,
}) => {
  return (
    <>
      <Image
        source={
          selectedImage
            ? { uri: selectedImage }
            : typeof defaultImage === 'string'
              ? { uri: defaultImage }
              : defaultImage
        }
        style={styles.profileImage}
      />
      <TouchableOpacity onPress={onCloseModal}>
        <Text style={styles.changeText}>변경</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="slide"
        visible={showModal}
        onRequestClose={onCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>프로필을 골라주세요</Text>
            <FlatList
              data={images}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.profilePicItem}
                  onPress={() => onSelectImage(item.uri)}
                >
                  <Image source={{ uri: item.uri }} style={styles.profilePic} />
                </TouchableOpacity>
              )}
              numColumns={4}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  profileImage: {
    width: 160,
    height: 160,
    marginBottom: 10,
  },
  changeText: {
    color: '#FF8B42',
    marginTop: -10,
    marginBottom: 20,
    fontWeight: '900',
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FBF7EC',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    top: 60,
    fontSize: 35,
    fontWeight: '900',
    color: '#393939',
    marginBottom: 20,
  },
  profilePicItem: {
    left: 85,
    top: 80,
    width: '20%',
    aspectRatio: 1,
    padding: 5,
  },
  profilePic: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});

export default ProfileImageSelector;
