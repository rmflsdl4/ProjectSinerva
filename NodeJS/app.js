// 사용 모듈 로드
const express = require('express');
const session = require('express-session');
//const MySQLStore = require('express-mysql-session')(session);
const normalization = require('./JavaScript/Normalization_Check.js');
const signup = require('./JavaScript/SignUp.js');
const login = require('./JavaScript/Login.js');
const findAccount = require('./JavaScript/Find.js');
//const posts = require('./JavaScript/Post.js');
const database = require('./database.js');
const record = require('./JavaScript/Record.js');
//유저 기능
var bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

// 데이터베이스 연결
database.Connect();
// 모듈에서 사용할 로직들
const app = express();
var fs = require('fs');
// const sessionStore = new MySQLStore({
//     host: 'svc.sel4.cloudtype.app',
//     user: 'root',
//     password: 'tkfkdgo3@',
//     database: 'flier',
//     port: '32388',
//     charset: 'UTF8MB4',
//     expiration: 24 * 60 * 60 * 1000
// });

app.use(express.static('HTML'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(session({
//     secret: 'secret-key',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         maxAge: 24 * 60 * 60 * 1000,
//     },
//     store: sessionStore,
// }));

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

app.post('/posts-import', async (req, res) => {
    const data = await posts.Get_List();
    

    res.send(data);
})
app.post('/view-post', async (req, res) => {
    const { post_id } = req.body;
    await posts.Add_View_Count(post_id);
    const data = await posts.Get_Post(post_id);
    const session_id = req.session.session_id;
    res.send( { data, session_id });
})

app.post('/add-post', async (req, res) => {
    const { formData } = req.body;
    const { board_type, title, content, lock_state } = formData;
    console.log(board_type, title, content, lock_state);
    try{
        await posts.Add_Post(board_type, title, content, req.session.session_id, lock_state);
        res.send("<script>alert('게시글을 등록하였습니다.'); location.href='Main.html';</script>");
    }
    catch(error){
        console.log(error);
        res.send("<script>alert('게시글 등록에 실패하였습니다.'); location.href='Main.html';</script>");
    }
})
app.post('/post-lock-check', async (req, res) => {
    const { post_id } = req.body;
    
    try{
        const isLock = await posts.Lock_Check(post_id, req.session.session_id);
        console.log(isLock);
        res.send(isLock);
    }
    catch(error){
        console.log(error);
        res.send('false');
    }
})
// 제목, 내용, 게시글 넘버 받아서 게시글 업데이트
app.post('/update-post', async (req, res) => {
    const { title, content, post_id } = req.body;

    try{
        await posts.Update_Post(title, content, post_id);
        res.send("<script>alert('게시글을 수정하였습니다.'); location.href='Main.html';</script>");
    }
    catch(error){
        console.log(error);
        res.send("<script>alert('게시글 수정에 실패하였습니다.'); location.href='Main.html';</script>");
    }
})
// post_id받아서 delete_post로 넘김
app.post('/delete-post', async (req, res) => {
	const { post_id } = req.body;
	console.log(post_id);
	try {
		await posts.delete_post(post_id);
		res.send("<script>alert('삭제되었습니다.'); window.location.href = '/';</script>");
	}
	catch(error){
        console.log(error);
		res.send("<script>alert('삭제 실패'); window.location.href = '/';</script>");
    }
})
// 유저 타입 반환
app.post('/get-user-type', async (req, res) => {
    const user_type = req.session.user_type;
    
    res.send(user_type);
})
// 선택한 게시글 삭제 (관리자 전용)
app.post('/selected-posts-delete', async (req, res) => {
    const { posts_id } = req.body;

    try{
        if(posts_id.length > 0){
            await posts.Posts_Delete(posts_id);
        }
        res.send();
    }
    catch(error){
        console.log(error);
        res.send("<script>alert('오류 발생. 삭제 실패.'); window.location.href = 'Main.html';</script>");
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
app.post('/select-posts', async (req, res) => {
    const { formData } = req.body;
    const { col, search_content, board_type } = formData;

    try{
        const data = await posts.Search(col, search_content, board_type);
        console.log(data);
        res.send(data);
    }
    catch(error){
        console.log(error);
    }

})
//댓글 불러오기
app.post('/load-comment', async (req, res) => {
	const { post_id } = await req.body;
	const data = await posts.load_comments(post_id);
	
	try {
		console.log(post_id, '댓글 불러오기');
		res.send(data);
	}
	catch(error) {
		console.log(error);
		res.send("<script>alert('오류');</script>");
	}
});
//댓글 추가
app.post('/add-comment', async (req, res) => {
    const { comment, post_id } = req.body;
    try {
        await posts.add_comment(comment, post_id, req.session.session_id);
        res.send("<script>alert(id + '가' + post_id + '에 댓글이 추가되었습니다');</script>");
    }
    catch(error){
        console.log(error);
        res.send("<script>alert('댓글이 추가에 실패하였습니다');</script>");
    }
});
//댓글 삭제
app.post('/delete-comment', async (req, res) => {
	const { comment_id } = req.body;
	try {
		await posts.delete_comment(comment_id);
		res.send("<script>alert('댓글 번호' + comment_id + '가 삭제되었습니다');</script>");
	}
	catch(error){
        console.log(error);
        res.send("<script>alert('댓글삭제에 실패하였습니다');</script>");
    }
});
//로그인한 유저 반환
app.post('/login-user', async (req, res) => {
    const session_id = req.session.session_id;
	
    res.send({ session_id });
})
// **이미지 파일 폴더에 저장**
const IMAGE_NUMBER_FILE = './image_number.txt';
let dataTime;

// 이미지 번호 파일에서 읽어오기
try {
    const data = fs.readFileSync(IMAGE_NUMBER_FILE, 'utf8');
    imageNumber = parseInt(data);
} catch (err) {
    console.error('이미지 번호 파일을 읽어올 수 없습니다. 이미지 번호는 0으로 초기화됩니다.');
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1이 필요하며, 두 자리로 포맷
        const day = date.getDate().toString().padStart(2, '0'); // 일은 두 자리로 포맷
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');
        dataTime = `${year}${month}${day}${hour}${minute}${second}`;
        const folder = `images/${year}${month}${day}${hour}${minute}${second}/`;

        // 해당 날짜 폴더가 없으면 생성
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        // 이미지 파일을 해당 날짜 폴더에 저장
        cb(null, folder);
    }, 
    filename: (req, file, cb) => {
        // 이미지 번호 증가
        imageNumber++;
        console.log(file)
        cb(null, imageNumber + path.extname(file.originalname))

        // 이미지 번호 파일에 업데이트
        fs.writeFileSync(IMAGE_NUMBER_FILE, imageNumber.toString(), 'utf8');
    }
});

const upload = multer({storage: storage});

app.use('/image', express.static('./images/'));

app.post('/image-discrimination', upload.array('images'), (req, res) => {
    // req.files는 업로드한 파일에 대한 정보를 가지고 있는 배열
    req.files.forEach((file) => {
        console.log('업로드한 파일 이름:', file.originalname);
        console.log('서버에 저장된 파일 이름:', file.filename);
        const query = 'INSERT IGNORE INTO image(file_name, added, user_id) VALUES (?, ?, \'test\')';
        let image = '/image/' + file.filename;
        const values = [image, dataTime];

        database.Query(query, values);
    });
    res.send();
});
// 과거 검사한 기록 select
app.post("/record", async (req, res) => {
    const id = req.body.id;

    console.log(id);

    const query = `SELECT 
                        added,
                        count(*) as total,
                        SUM(CASE WHEN result = '정상' THEN 1 ELSE 0 END) AS normal_count,
                        SUM(CASE WHEN result <> '정상' THEN 1 ELSE 0 END) AS abnormality_count
                    FROM image
                    WHERE user_id = ?
                    GROUP BY added`;

    const values = [id];

    const result = await database.Query(query, values);
    
    console.log(result);

    res.send(result);
});