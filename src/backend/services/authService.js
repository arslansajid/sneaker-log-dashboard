import firebase from 'firebase';

export const signUp = async (email, password) => {
  let success = true;
  await firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(async (user) => {
      alert('Sign up success')
    }).catch((error)=> {
      success = false;
      alert(error.code + ': ' + error.message);
    });
    return success;
}

export async function signInWithEmail(email, password) {
  let success = true;
  await firebase.auth().signInWithEmailAndPassword(email, password)
  .then(async (user) => {
    alert('Sign in succcess')
  })
  .catch(function (error) {
    success = false;
    alert(error.code + ': ' + error.message);
  });
  return success;
}

export async function signInWithPhoneNumber(phoneNo, password) {
  let success = true;
  await firebase.auth().signInWithEmailAndPassword(phoneNo, password).catch(function (error) {
    success = false;
    alert(error.code + ': ' + error.message);
  });
  return success;
}

export async function getCurrentUserId() {
  var user = firebase.auth().currentUser;
  if (user != null) {
    return user.uid;
  }
}