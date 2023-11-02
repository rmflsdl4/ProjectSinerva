function menuBarInit() {
    const logIn = document.getElementById('mainLogIn');
    const SignUp = document.getElementById('mainSignUp');
    const logOut = document.getElementById('mainLogOut');
    const myPage = document.getElementById('mainMyPage');
    const admin = document.getElementById('mainAdmin');

    getUserSession()
    .then(loginUser => {
      console.log(loginUser);

      if (loginUser.userType === 'user') {
        console.log('login: ' + loginUser.userId);
        logIn.style.display = 'none';
        SignUp.style.display = 'none';
        logOut.style.display = 'block';
        myPage.style.display = 'block';
      } 
      else if (loginUser.userType === 'expert') {
        logIn.style.display = 'none';
        SignUp.style.display = 'none';
        logOut.style.display = 'block';
        myPage.style.display = 'block';
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