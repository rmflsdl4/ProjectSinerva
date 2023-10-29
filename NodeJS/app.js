// 사용 모듈 로드
const express = require('express');
const normalization = require('./JavaScript/Normalization_Check.js');
const signup = require('./JavaScript/SignUp.js');
const login = require('./JavaScript/Login.js');
const findAccount = require('./JavaScript/Find.js');
const database = require('./database.js');
const tfjs = require('./JavaScript/tfjsNode.js');
//유저 기능
var bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

// 데이터베이스 연결
database.Connect();
// 모듈에서 사용할 로직들
const app = express();
var fs = require('fs');

app.use(express.static('HTML'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 서버 구동
app.listen(3000, function(){
    console.log('서버 구동');
});

// 서버 오류 처리
process.on('uncaughtException', (err) => {
    console.error('오류가 발생했습니다:', err);
  
    database.Close();
    
    process.exit(1); // 0이 아닌 값은 비정상적인 종료를 나타냄
});


// 라우팅 설정

app.get('/', function(req, res){
    fs.readFile('HTML/Login.html', function(error, data){
        if(error){
            console.log(error);
        }
        else{
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        }
    });
});
// 회원가입 입력값 검사 및 계정 찾기 입력값 검사
app.post('/check-input', (req, res) => {
    const { name, value1, value2 } = req.body;
    
    // 분기별로 처리 로직 수행
    if (name === 'id') {                //회원가입 분기
        normalization.ID_Check(value1)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'pw') {
        normalization.PW_Check(value1, value2)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'confirm_pw') {
        normalization.Confirm_Pw_Check(value1, value2)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'nick_name') {
        //console.log(value1);
        normalization.Nick_Name_Check(value1)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'phone_num') {
        //console.log(value1);
        normalization.Phone_Num_Check(value1)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'email') {
        //console.log(value1);
        normalization.Email_Check(value1)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'address') {
        //console.log(value1);
        normalization.Address_Check(value1)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'findId') {         //계정 찾기 분기
        //console.log(value1);
        normalization.FindId_Check(value1)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'findNickName') {
        //console.log(value1);
        normalization.FindNickName_Check(value1)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'findPhone_num') {
        //console.log(value1);
        normalization.FindPhone_num_Check(value1)
            .then(result => {
                res.json({ result });
            });
    } else if (name === 'findEmail') {
        //console.log(value1);
        normalization.FindEmail_Check(value1)
            .then(result => {
                res.json({ result });
            });
    }
});
//회원가입
app.post('/sign-up', (req, res) => {
    const { id, pw, nick_name, phone_num, email, address, userType} = req.body;

    try{
        signup.Add_User(id, pw, nick_name, phone_num, email, address, userType);
    
        console.log(`신규 회원 정보 [ ID - ${id} / NAME - ${nick_name} / userType - ${userType} ]`);

        res.send("<script>alert('회원가입이 완료되었습니다.'); location.href='Login.html';</script>");
    }
    catch(error){
        console.error('회원가입 오류:', error);
        res.status(500).send("<script>alert('회원가입에 실패하였습니다.'); location.href='SignUp.html';</script>");
    }
});
//로그인
app.post('/login', (req, res) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분 ${seconds}초`;

    const { id, pw } = req.body;

    login.Login(id, pw)
        .then((arr) => {
            const state = arr[0];
            const user_type = arr[1];
            const waitOk = arr[2];
            if(state === 1 && waitOk === 1){
                req.session.session_id = id;
                req.session.user_type = user_type;
                console.log(`회원 [ ${id} ] 접속.... 접속 시간 : ${formattedDate}`);
                console.log(`세션에 ID 저장: ${req.session.session_id}`);
                console.log(`유저 타입: ${user_type}`);
                res.send("<script>alert('로그인에 성공하였습니다.'); location.href='Main.html';</script>");
            }
            else{
                if (waitOk === 0) {
                    res.send("<script>alert('승인 대기중입니다.'); location.href='Login.html';</script>");
                }
                else {
                    res.send("<script>alert('로그인에 실패하였습니다.'); location.href='Login.html';</script>");
                }
            }
        })
})
//계정찾기
app.post('/findAccount', (req,res) => {
    const { findId, findNickName, userType, findPhone_num, findEmail } = req.body;

    if (findNickName) {
        findAccount.FindId( findNickName, userType, findPhone_num, findEmail )
        .then((arr) => {
            const userId = arr[0];
            const userNickName = arr[1];

            if(userId !== null && userNickName !== null){
                console.log(`ID: ${userId}`);
                console.log(`Nick_Name: ${userNickName}`);
                const message = `${userNickName}님의 계정을 찾았습니다.
ID: ${userId}입니다.`;
                res.json({ message });
            }
            else{
                const message = `계정을 찾을 수 없습니다.`;
                res.json({ message });
            }
        })
    }
    else if (findId) {
        findAccount.FindPw( findId, userType, findPhone_num, findEmail )
        .then((arr) => {
            const userPw = arr[0];
            const userNickName = arr[1];

            if(userPw !== null && userNickName !== null){
                console.log(`PW: ${userPw}`);
                console.log(`Nick_Name: ${userNickName}`);
                const message = `${userNickName}님의 계정을 찾았습니다.
PW: ${userPw}입니다.`;
                res.json({ message });
            }
            else{
                const message = `계정을 찾을 수 없습니다.`;
                res.json({ message });
            }
        })
    }
})


//모든 유저 가져옴
app.post('/users-import', async (req, res) => {
	const data = await posts.get_users();
	
    res.send(data);
})
//유저삭제
app.post('/delete-users', async (req, res) => {
	const { id, nick_name } = req.body;
	console.log(id, nick_name);
	try {
		await posts.delete_users(id, nick_name);
		res.send("<script>alert(id + ' 가 삭제되었습니다.'); window.location.href = '/';</script>");
	}
	catch(error){
        console.log(error);
		res.send("<script>alert('삭제 실패'); window.location.href = '/';</script>");
    }
})

//로그인한 유저 반환
app.post('/login-user', async (req, res) => {
    const session_id = req.session.session_id;
	
    res.send({ session_id });
})

// 이미지 파일 폴더에 저장
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/')
    }, 
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, file.originalname.split('.', 1) + path.extname(file.originalname))
    }
});

const upload = multer({storage: storage});

app.post('/checkImg', upload.array('images'), (req, res) => {
    // req.files는 업로드한 파일에 대한 정보를 가지고 있는 배열
    req.files.forEach((file) => {
        console.log('업로드한 파일 이름:', file.originalname);
        console.log('서버에 저장된 파일 이름:', file.filename);
        const query = 'INSERT INTO testImg(fileName, userId) VALUES (?, \'test\')';
        let image = '/image/' + file.filename;
        const values = [image];

        database.Query(query, values);
    });
    Connection.query(sql, values,
        (err, rows, fields) => {
            res.send(rows);
        }
    );
});
// tfjsNode.js 부분으로 넘어갈 것
app.post('/image-discrimination', async (req, res) => {
    
    tfjs.Predict('test1.jpg');
    res.send();
})