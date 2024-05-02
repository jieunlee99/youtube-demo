// express 모듈 셋팅
const express = require("express");
const app = express();
app.use(express.json()); // http 외의 모듈을 사용할 때 써줘야 한다.
app.listen(7777);

let db = new Map();
var id = 1; // 하나의 객체를 유니크하게 구별하기 위함 (primaryb  key로 사용)

// 로그인
// app.post("/login", function (req, res) {});

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
