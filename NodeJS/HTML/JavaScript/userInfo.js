function userInfoInit(){
    const id = document.getElementById('id');
    const pw = document.getElementById('pw');
    const nick_name = document.getElementById('nick_name');
    const phone_num = document.getElementById('phone_num');
    const email = document.getElementById('email');
    const address = document.getElementById('address');

    getUserSession()
    .then(loginUser => {
        console.log(loginUser);

        let userInfo = getUserInfo(loginUser.userId, loginUser.userType);
        console.log(userInfo);

        if (loginUser.userType === 'user') {
        console.log('login: ' + loginUser.userId);
        nick_name.placeholder;
        phone_num.placeholder;
        email.placeholder;
        address.placeholder;
        } 
        else if (loginUser.userType === 'expert') {
       
        }
        else if (loginUser.userType === 'admin') {
        
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

async function getUserInfo(id, userType) {
    try {
        const response = await fetch('/loginUserInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, userType })
        });

        if (!response.ok) {
            throw new Error('데이터 가져오기 실패');
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
