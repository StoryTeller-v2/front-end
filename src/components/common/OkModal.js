import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const OkModal = ({ isVisible, onClose, title, message }) => {
  return (
    <Modal
      animationType="slide"
      visible={isVisible}
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <LinearGradient
            colors={['#F8C683', '#FF8C43']}
            style={styles.gradientButton}
          >
            <TouchableOpacity onPress={onClose} style={styles.okButton}>
              <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '40%',
    height: '43%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalTitle: {
    marginVertical: 3,
    fontFamily: 'TAEBAEKfont',
    fontSize: 28,
    textAlign: 'center',
    marginTop: 10,
  },
  modalMessage: {
    marginVertical: 40,
    fontWeight: '100',
    textAlign: 'center',
    fontSize: 23,
    color: 'black',
    fontFamily: 'TAEBAEKmilkyway',
    marginTop: 5,
  },
  gradientButton: {
    borderRadius: 30,
    overflow: 'hidden',
    marginTop: 20,
  },
  okButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 25,
    fontWeight: '900',
    color: '#393939',
  },
});

export default OkModal;
