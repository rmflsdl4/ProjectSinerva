function menuBarInit() {
  const menuBar = document.getElementById('menuBar');
  const logIn = document.getElementById('mainLogIn');
  const SignUp = document.getElementById('mainSignUp');
  const logOut = document.getElementById('mainLogOut');
  const myPage = document.getElementById('mainMyPage');
  const admin = document.getElementById('mainAdmin');
  const userMenu = document.getElementsByClassName('userMenu');
  const expertMenu = document.getElementsByClassName('expertMenu');

  getUserSession()
  .then(loginUser => {
    console.log(loginUser);

    if (loginUser.userType === 'user') {
      
      console.log('login: ' + loginUser.userId);
      menuBar.style.display = 'block';
      logIn.style.display = 'none';
      SignUp.style.display = 'none';
      logOut.style.display = 'block';
      myPage.style.display = 'block';
      for(i = 0; i < userMenu.length; i++){
        userMenu[i].style.display = '';
      }
      for(i = 0; i < expertMenu.length; i++){
        expertMenu[i].style.display = 'none';
      }
    } 
    else if (loginUser.userType === 'expert') {
      menuBar.style.display = 'block';
      logIn.style.display = 'none';
      SignUp.style.display = 'none';
      logOut.style.display = 'block';
      myPage.style.display = 'block';
      for(i = 0; i < userMenu.length; i++){
        userMenu[i].style.display = 'none';
      }
      for(i = 0; i < expertMenu.length; i++){
        expertMenu[i].style.display = '';
      }
    }
    else if (loginUser.userType === 'admin') {
      logIn.style.display = 'none';
      SignUp.style.display = 'none';
      logOut.style.display = 'block';
      admin.style.display = 'block';
    }
    else {
      console.log('nope');
    }
  });
}

async function getUserSession() {
  return await new Promise((resolve, reject) => {
      fetch('/login-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
      })
          .then(response => response.json())
          .then(data => {
              resolve(data);
          })
          .catch(error => {
              reject(error);
          });
  });
}

async function logOut() {
  new Promise((resolve, reject) => {
      fetch('/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
      })
          .then(data => {
              alert('로그아웃 되었습니다.');
          })
          .catch(error => {
              reject(error);
          });
  });
}