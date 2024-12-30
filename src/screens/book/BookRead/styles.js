import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF7EC',
  },
  page: {
    width: '70.5%',
    height: '100%',
  },
  titleBox: {
    marginBottom: 20,
  },
  textBox: {
    width: '35%',
    justifyContent: 'center',
    position: 'absolute',
    top: '3%',
    left: '57%',
    borderRadius: 10,
    padding: 10,
  },
  bookTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 38,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    fontFamily: 'TAEBAEKfont',
  },
  iconBox: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'baseline',
    margin: 20,
  },
  icon: {
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  bookText: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 30,
    fontFamily: 'TAEBAEKfont',
  },
  wordBox: {
    width: 150,
    height: 70,
    position: 'absolute',
    bottom: '10%',
    left: '80%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(78,90,140,0.8)',
    borderStyle: 'solid',
    justifyContent: 'center',
  },
  wordText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'rgba(78,90,140,0.8)',
    fontFamily: 'TAEBAEKmilkyway',
  },
  highlightedText: {
    backgroundColor: 'yellow',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightModal: {
    position: 'absolute',
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  highlightModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  highlightModalText: {
    paddingHorizontal: 10,
    fontFamily: 'TAEBAEKmilkyway',
  },
  emptyContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webviewContainer: {
    width: '80%',
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  closeButton: {
    padding: 5,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    alignItems: 'flex-end',
  },
});
