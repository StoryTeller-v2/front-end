import {StyleSheet} from 'react-native';

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
    marginBottom: 10,
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
    marginTop: 15,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: 45,
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
  orContainer: {
    width: '85%',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  orHorizontal: {
    flex: 1,
    height: 1,
    backgroundColor: 'black',
  },
  orText: {
    width: 50,
    textAlign: 'center',
  },
  socialButtonContainer: {
    width: '85%',
  },
  socialButton: {
    width: '100%',
    height: 40,
    marginTop: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4E5A8C',
    flexDirection: 'row',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  socialButtonText: {
    color: '#393939',
    fontSize: 15,
    fontFamily: 'TAEBAEKmilkyway',
  },
  signInContainer: {
    marginTop: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signIn: {
    fontSize: 13,
    color: '#393939',
    textAlign: 'center',
    fontFamily: 'TAEBAEKfont',
  },
  signInBold: {
    color: '#4E5A8C',
    textDecorationLine: 'underline',
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