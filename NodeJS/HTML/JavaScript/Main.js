function menuBarInit() {
  const menuBar = document.getElementById('menuBar');
  const logIn = document.getElementById('mainLogIn');
  const SignUp = document.getElementById('mainSignUp');
  const logOut = document.getElementById('mainLogOut');
  const myPage = document.getElementById('mainMyPage');
  const admin = document.getElementById('mainAdmin');
  const userMenu = document.getElementsByClassName('userMenu');
  const expertMenu = document.getElementsByClassName('expertMenu');
  const requestButton = document.getElementsByClassName('requestButton');
  const userName = document.getElementById('userName');

  getUserSession()
  .then(loginUser => {
    showExpertList(loginUser.userType);
    console.log(loginUser);
    userName.textContent = loginUser.userId + "님 환영합니다.";
    if (!loginUser.userType) {
      menuBar.style.display = 'block';

      for(let i = 0; i < userMenu.length; i++){
        userMenu[i].style.display = '';
        userMenu[i].addEventListener('click', function() {
          event.preventDefault();
          alert('로그인해야 사용가능합니다.');
        });
      }
      for(let i = 0; i < expertMenu.length; i++){
        expertMenu[i].style.display = 'none';
        expertMenu[i].addEventListener('click', function() {
          event.preventDefault();
          alert('로그인해야 사용가능합니다.');
        });
      }
      for(let i = 0; i < requestButton.length; i++) {
        requestButton[i].style.display = 'none';
      }
    }
    else if (loginUser.userType === 'user') {
      console.log('login: ' + loginUser.userId);
      menuBar.style.display = 'block';
      logIn.style.display = 'none';
      SignUp.style.display = 'none';
      logOut.style.display = 'block';
      myPage.style.display = 'block';

      for(let i = 0; i < userMenu.length; i++){
        userMenu[i].style.display = '';
      }
      for(let i = 0; i < expertMenu.length; i++){
        expertMenu[i].style.display = 'none';
      }
    } 
    else if (loginUser.userType === 'expert') {
      menuBar.style.display = 'block';
      logIn.style.display = 'none';
      SignUp.style.display = 'none';
      logOut.style.display = 'block';
      myPage.style.display = 'block';

      for(let i = 0; i < userMenu.length; i++){
        userMenu[i].style.display = 'none';
      }
      for(let i = 0; i < expertMenu.length; i++){
        expertMenu[i].style.display = '';
      }
      for(let i = 0; i < requestButton.length; i++) {
        requestButton[i].style.display = 'none';
      }
    }
    else if (loginUser.userType === 'admin') {
      logIn.style.display = 'none';
      SignUp.style.display = 'none';
      logOut.style.display = 'block';
      admin.style.display = 'block';

      for(let i = 0; i < requestButton.length; i++) {
        requestButton[i].style.display = 'none';
      }
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

function showExpertList(userType) {
  getExpertInfo()
  .then(expertInfo => {
    const usersMenu = document.getElementById('expertTable');
    console.log(expertInfo);
    
    expertInfo.forEach(item => {
      let row = document.createElement('tr');
      row.className = 'expertTr';
  
      let nameTd = document.createElement('td');
      nameTd.className = 'expertTd';
      nameTd.textContent = item.name;
      nameTd.style.width = '20%';
      row.appendChild(nameTd);
  
      let addressTd = document.createElement('td');
      addressTd.className = 'expertTd';
      addressTd.textContent = item.address;
      addressTd.style.width = '10%';
      row.appendChild(addressTd);
  
      let introTd = document.createElement('td');
      introTd.className = 'expertTd';
      introTd.textContent = item.introduction;
      introTd.style.width = '30%';
      row.appendChild(introTd);
  
      let likeTd = document.createElement('td');
      likeTd.className = 'expertTd';
      likeTd.textContent = 'item.like';
      likeTd.style.width = '20%';
      row.appendChild(likeTd);
  
      let buttonTd = document.createElement('td');
      buttonTd.className = 'expertTd';

      if (userType === 'user') {
        let requestButton = document.createElement('button');
        requestButton.className = 'requestButton';
        requestButton.textContent = '요청';

        buttonTd.appendChild(requestButton);
      }
      
      row.appendChild(buttonTd);
  
      usersMenu.appendChild(row);
    });
  });
}

async function getExpertInfo() {
  try {
      const response = await fetch('/getExpertInfo', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          }
      });

      if (!response.ok) {
          throw new Error('데이터 가져오기 실패');
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error(error);
      throw error;
  }
}
      