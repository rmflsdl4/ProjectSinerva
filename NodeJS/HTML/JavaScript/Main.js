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
    showUserList(loginUser.userType);
    showExpertList(loginUser.userType);
    console.log(loginUser);
    if(loginUser.userId !== undefined){
      userName.textContent = loginUser.userId + "님 환영합니다.";
      userName.style.display = 'block';
    }
    
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
      menuBar.style.display = 'none';
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

async function showUserList(userType) {
  getUserInfo()
  .then(userInfo => {
    // 랜덤 이미지
    let randomNumbers = new Set();
    while(randomNumbers.size < 5){
      if(randomNumbers.size === userInfo.length){
        break;
      }
      randomNumbers.add(Math.floor(Math.random() * userInfo.length));
    }
    let numberArr = Array.from(randomNumbers);



    const usersMenu = document.getElementById('userTable');
    console.log(userInfo);
    
    let imageTr = document.createElement('tr');
    imageTr.className = 'userTrImage';
    let commentTr = document.createElement('tr');
    commentTr.className = 'userTrComment';
    let nameTr = document.createElement('tr');
    nameTr.className = 'userTrName';
    let dateTr = document.createElement('tr');
    dateTr.className = 'userTrDate';

    for (let i = 0; i < numberArr.length; i++) {
      let imageTd = document.createElement('td');
      imageTd.style.width = '16%';
      imageTd.className = 'userTd';

      let imageSrc = document.createElement('img');
      imageSrc.className = 'userImage';
      imageSrc.style.width = '100px';
      imageSrc.src = userInfo[numberArr[i]].file_route;
      imageTd.appendChild(imageSrc);

      imageSrc.addEventListener('click', () => {
          const modal = document.querySelector('.modal');
          modal.style.display = 'block';

          imageSrc.style.width = '80%';
          console.log(userInfo[i].imgUploadDate);
          seeMore(userInfo[numberArr[i]].imgUploadDate)
          .then(value => {
              console.log(value);
              for (let j = 0; j < value.length; j++) {
                imageSrc.src = value[j].file_route;

                  // 이미지를 복제하여 모달 팝업에 추가
                  const imageClone = imageSrc.cloneNode(true);
                  modal.querySelector('.modal-content').appendChild(imageClone);
              }
          });
      });
      
      document.querySelector('.close-modal-btn').addEventListener('click', function () {
          const modal = document.querySelector('.modal');
          modal.style.display = 'none';
          imageSrc.style.width = '100px';
      
          // 모달 팝업 내용을 비우지 않고 복제된 이미지만 제거
          const modalContent = modal.querySelector('.modal-content');
          const clonedImages = modalContent.querySelectorAll('img');
          if (clonedImages.length > 0) {
              clonedImages.forEach((img) => {
                  modalContent.removeChild(img);
              });
          }
      });

      imageTr.appendChild(imageTd);
    }
    usersMenu.appendChild(imageTr);
    
    for (let i = 0; i < numberArr.length; i++) {
      let commentTd = document.createElement('td');
      commentTd.className = 'userTd';
      commentTd.textContent = '코멘트 내용';
      commentTd.style.width = '16%';

      let commentTextarea = document.createElement('textarea');
      commentTextarea.className = 'commentTextarea';
      commentTextarea.textContent = userInfo[numberArr[i]].comment;
      commentTextarea.style.width = '100%';
      commentTextarea.readOnly = true;
      commentTd.appendChild(commentTextarea);
      commentTr.appendChild(commentTd);
    }
    usersMenu.appendChild(commentTr);
    
    

    for (let i = 0; i < numberArr.length; i++) {
      let nameTd = document.createElement('td');
      nameTd.className = 'userTd'; // 기존 유저 이름에서 검사 결과로 바뀜
      
      nameTd.textContent = '검사 결과: ' + userInfo[numberArr[i]].result;
      nameTd.style.width = '16%';
      nameTr.appendChild(nameTd);
    }
    usersMenu.appendChild(nameTr);

    for (let i = 0; i < numberArr.length; i++) {
      const dateStr = userInfo[numberArr[i]].requestDate; // 예: '202311051449'
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const hour = dateStr.substring(8, 10);
      const minute = dateStr.substring(10, 12);
      const upload_date = `${year}-${month}-${day} ${hour}:${minute}`;
      let dateTd = document.createElement('td');
      dateTd.className = 'userTd';
      dateTd.textContent = upload_date;
      dateTd.style.width = '16%';
      dateTr.appendChild(dateTd);
    }
    usersMenu.appendChild(dateTr);
  });
}

function showExpertList(userType) {
  getExpertInfo()
  .then(expertInfo => {
    const usersMenu = document.getElementById('expertTable');
    let i = 0;
    console.log(expertInfo);
    let cnt = 0;
    expertInfo.forEach(item => {
      if(cnt > 4){
        return;
      }
      let row = document.createElement('tr');
      row.className = 'expertTr';
  
      let nameTd = document.createElement('td');
      nameTd.className = 'expertTd';
      nameTd.textContent = item.name;
      row.appendChild(nameTd);
  
      let addressTd = document.createElement('td');
      addressTd.className = 'expertTd';
      addressTd.textContent = item.address;
      row.appendChild(addressTd);
  
      let introTd = document.createElement('td');
      introTd.className = 'expertTd';
      introTd.textContent = item.introduction;
      
      row.appendChild(introTd);

      // 테이블 셀(td)을 생성합니다.
      let ratingTd = document.createElement('td');
      ratingTd.className = 'expertTd'; // 클래스 이름을 'expertTd'로 설정합니다.

      // 별점을 표시할 별점(div)을 생성합니다.
      const starRatingsDiv = document.createElement('div');
      starRatingsDiv.id = `star-ratings-${i}`;; // 고유한 ID를 생성하여 설정합니다.
      starRatingsDiv.className = 'star-ratings'; // 클래스 이름을 'star-ratings'로 설정합니다.

      // 채워진 별 모양을 표시할 별점 채우기(div)를 생성합니다.
      const filledStarsDiv = document.createElement('div');
      filledStarsDiv.className = 'star-ratings-fill space-x-2 text-lg'; // 클래스 이름을 'star-ratings-fill space-x-2 text-lg'로 설정합니다.
      filledStarsDiv.id = `filled-stars-${i}`; // 고유한 ID를 생성하여 설정합니다.

      // 비어있는 별 모양을 표시할 별점 기본값(div)를 생성합니다.
      const baseStarsDiv = document.createElement('div');
      baseStarsDiv.className = 'star-ratings-base space-x-2 text-lg'; // 클래스 이름을 'star-ratings-base space-x-2 text-lg'로 설정합니다.
      baseStarsDiv.id = `base-stars-${i}`; // 고유한 ID를 생성하여 설정합니다.

      // 별 모양(span)을 별점 채우기(div)와 별점 기본값(div)에 추가합니다.
      for (let j = 0; j < 5; j++) {
        const starSpan = document.createElement('span');
        starSpan.textContent = '★';

        filledStarsDiv.appendChild(starSpan.cloneNode(true));
        baseStarsDiv.appendChild(starSpan.cloneNode(true));
      }

      // 별점 채우기(div)와 별점 기본값(div)을 별점(div)에 추가합니다.
      starRatingsDiv.appendChild(filledStarsDiv);
      starRatingsDiv.appendChild(baseStarsDiv);

      // 별점(div)을 테이블 셀(td)에 추가합니다.
      ratingTd.appendChild(starRatingsDiv);

      // 별점 텍스트를 추가합니다.
      ratingTd.innerHTML += ` / ${item.rating}`;

      // 테이블 행(row)에 테이블 셀(td)을 추가합니다.
      row.appendChild(ratingTd);

      // 테이블에 행을 추가하기 전에 updateStars 함수를 호출하여 별점을 업데이트합니다.
      usersMenu.appendChild(row);
      updateStars(item.rating, i);
      i++;

  
      let buttonTd = document.createElement('td');
      buttonTd.className = 'expertTd';

      if (userType === 'user') {
        let requestButton = document.createElement('button');
        requestButton.className = 'requestButton';
        requestButton.textContent = '요청';

        requestButton.addEventListener('click', () => {
          window.location.href = 'InspectResult.html';
        });

        buttonTd.appendChild(requestButton);
      }
      
      row.appendChild(buttonTd);
  
      usersMenu.appendChild(row);
      cnt++;
    });
  });
}

// updateStars 함수는 이전 예제와 동일하게 정의되었다고 가정합니다
function updateStars(score, index) {
  const STAR_COUNT = 5;
  const ratingToPercent = (score / STAR_COUNT) * 100;
  const filledStars = document.getElementById(`filled-stars-${index}`);

  if (filledStars) {
    filledStars.style.width = ratingToPercent + '%';
  } else {
    console.error(`Element with id 'filled-stars-${index}' not found.`);
  }
}

async function getUserInfo() {
  try {
      const response = await fetch('/getUserInfo', {
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

function seeMore(imgUploadDate) {
	return new Promise((resolve, reject) => {
        fetch('/seeMore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imgUploadDate })
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