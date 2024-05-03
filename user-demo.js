// express 모듈 셋팅
const express = require("express");
const app = express();
app.use(express.json()); // http 외의 모듈을 사용할 때 써줘야 한다.
app.listen(7777);

let db = new Map();
var id = 1; // 하나의 객체를 유니크하게 구별하기 위함 (primaryb  key로 사용)

// 로그인
app.post("/login", function (req, res) {
  console.log(req.body);

  // userId가 db에 저장된 회원인지 확인
  const { userId, password } = req.body;
  var loginUser = {};

  // 메서드 추출해보기
  db.forEach(function (user, id) {
    if (user.userId === userId) {
      loginUser = user;
    }
  });

  // userId 값을 찾았을 때
  if (isNotEmpty(loginUser)) {
    console.log("같은 거 찾았다!");

    // pwd도 맞는지 비교
    if (loginUser.password === password) {
      console.log("패스워드도 같다!");
    } else {
      console.log("패스워드가 다르다!");
    }
  } else {
    console.log("입력하신 아이디는 없는 아이디입니다.");
  }
});

function isNotEmpty(obj) {
  if (Object.keys(obj).length) {
    return true;
  } else {
    return false;
  }
}

// 회원가입
app.post("/join", function (req, res) {
  console.log(req.body);

  if (req.body) {
    db.set(id++, req.body);

    res.status(201).json({
      message: `${db.get(id - 1).name}님 환영합니다.`,
    });
  } else {
    res.status(400).json({
      message: "입력 값을 다시 확인해주세요.",
    });
  }
});

app
  .route("/users/:id")
  // 회원 개별 조회
  .get(function (req, res) {
    let { id } = req.params;
    id = parseInt(id);

    const user = db.get(id);
    if (user == undefined) {
      res.status(404).json({
        message: "회원 정보가 없습니다.",
      });
    } else {
      res.status(200).json({
        userId: user.userId,
        name: user.name,
      });
    }
  })
  // 회원 개별 삭제
  .delete(function (req, res) {
    //
    let { id } = req.params;
    id = parseInt(id);

    const user = db.get(id);
    if (user == undefined) {
      res.status(404).json({
        message: "회원 정보가 없습니다.",
      });
    } else {
      db.delete(id);
      res.status(200).json({
        message: `${user.name}님 다음에 또 뵙겠습니다.`,
      });
    }
  });
