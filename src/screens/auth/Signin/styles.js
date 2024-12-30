import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF7EC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 100,
    height: 90,
    margin: 5,
  },
  bigBox: {
    width: 400,
    height: 490,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 10,
    alignItems: 'center',
  },
  inputContainer: {
    width: '85%',
    marginTop: 10,
  },
  shortInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputShort: {
    width: '75%',
    marginTop: 5,
    marginRight: 5,
    height: 40,
    padding: 10,
    backgroundColor: '#F2F2EF',
    borderRadius: 13,
    fontSize: 15,
    fontFamily: 'TAEBAEKmilkyway',
  },
  emailButton: {
    width: '23%',
    height: 40,
    marginTop: 5,
    backgroundColor: '#4E5A8C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  emailButtonText: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'TAEBAEKfont',
  },
  input: {
    marginTop: 5,
    padding: 10,
    height: 40,
    backgroundColor: '#F2F2EF',
    borderRadius: 13,
    fontSize: 15,
    fontFamily: 'TAEBAEKmilkyway',
  },

  textBox: {
    width: '90%',
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 20,
  },
  titleApp: {
    alignItems: 'left',
    fontSize: 23,
    color: '#4E5A8C',
    fontFamily: 'TAEBAEKfont',
  },
  titleText: {
    fontSize: 20,
    color: '#393939',
    fontFamily: 'TAEBAEKfont',
  },
  buttonContainer: {
    width: '85%',
    marginTop: 10,
    alignItems: 'center',
  },
  button: {
    marginTop: 10,
    width: '100%',
    height: 50,
    backgroundColor: '#4E5A8C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'TAEBAEKfont',
  },
  subTitle: {
    color: '#393939',
    fontSize: 15,
    fontFamily: 'TAEBAEKfont',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
  },
});
