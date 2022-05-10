// 要素取得
const reachNum = document.querySelector("#reach-num");
const bingoNum = document.querySelector("#bingo-num");
const ballNum = document.querySelector("#ball-num");
const span = document.querySelector("span");

// ボタン取得
const createBtn = document.querySelector("#create-btn");
const ballBtn = document.querySelector("#ball-btn");

// 列数の値を取得
const inputNum = document.querySelector("#col_Num");

// form要素の取得
const form = document.querySelector("#form");

// ビンゴカードを表示する要素の取得
const bingoCard_div = document.querySelector(".bingoCard-num");

// 引いた数字やリーチ数などを表示するdiv
const number_div = document.querySelector(".number-div");

// ==============================================================
// ==================== ビンゴカードの作成クラス ====================
// ==============================================================
class BingoCard {
  constructor() {
    // ビンゴカードの数字を格納する配列
    // 入力した値の列×列の、二次元配列
    this.col_row_Array = new Array();

    // 上の配列と似ているが、こちらはhtml要素として
    // 取得したものを格納する二次元配列
    this.cardNumArray_html = new Array();

    // 1〜最大195（13列）の値を持つ配列の作成
    this.bingoBallArray = [];
  }

  // =========== ビンゴカードの数字を作成する関数 ===========
  makeRandomNum(col) {
    for (let i = 0; i < col; i++) {
      // 1〜15を持った長さ15の配列の作成
      const array = [];
      for (let k = 1; k <= 15; k++) {
        array.push(k);
      }

      for (let j = 0; j < col; j++) {
        // ランダムな値を取得
        const randomNum = Math.floor(Math.random() * array.length);
        this.col_row_Array[i].push(array[randomNum] + i * 15);

        // 数字が重複しないよう、元の配列から削除
        array.splice(randomNum, 1);
      }
    }
  }

  // =========== 上で作成した数字を出力する関数 ============
  makeBingoCard(col) {
    // col x col列のビンゴカードの二次元配列作成（例：5列x5列）
    for (let i = 0; i < col; i++) {
      this.col_row_Array[i] = new Array();
      this.cardNumArray_html[i] = new Array();
    }

    for (let i = 1; i <= col * 15; i++) {
      this.bingoBallArray.push(i);
    }

    // 上の関数を発動
    this.makeRandomNum(col);

    const centerNum = Math.floor(col / 2);

    // 数字を画面に出力
    for (let i = 0; i < col; i++) {
      // divタグ作成
      const col_div = document.createElement("div");

      this.col_row_Array[i].map((el, index) => {
        // pタグ作成
        const P_Tag = document.createElement("p");

        // 中心を'free'にするための処理
        if (i === centerNum && index === centerNum) {
          el = "free";
          P_Tag.append(el);
          // 穴を開ける処理（背景色を変更）
          P_Tag.classList.add("matchedNum");
        } else {
          // 中心以外の処理
          P_Tag.append(el);
        }

        // pタグ（カードの数字）をdivタグ配下に挿入
        col_div.append(P_Tag);
        // pタグを、二次元配列のi番目の配列に格納
        this.cardNumArray_html[i].push(P_Tag);
      });

      // col_div(一列分の数字)を画面に表示
      bingoCard_div.append(col_div);
    }

    // ビンゴカードの中心の値を'free'に変更しておく
    this.col_row_Array[centerNum][centerNum] = "free";
  }
}

// ==============================================================
// =============== ビンゴボール（数字）の取り出しクラス ===============
// ==============================================================
class BingoBallNumber {
  constructor() {
    // // 1〜最大195（13列）の値を持つ配列の作成
    // this.bingoBallArray = [];
    // for (let i = 1; i <= col_row_num * 15; i++) {
    //   this.bingoBallArray.push(i);
    // }

    // 出たビンゴボールの数字を格納していく配列の作成
    this.ballNumArray = [];

    // 何個目のボールか（初期値＝1）
    this.ball = 1;
  }

  // ============= ビンゴボールの数字を作成する関数 ============
  makeBingoBall() {
    // n個目のボール
    span.innerHTML = this.ball;
    this.ball += 1;

    // 0〜最大195の中で、ランダムな値を取得
    const randomNum = Math.floor(
      Math.random() * bingoCard.bingoBallArray.length
    );
    this.ballNumArray.unshift(bingoCard.bingoBallArray[randomNum]);
    // 数字が重複しないよう、元の配列から削除
    bingoCard.bingoBallArray.splice(randomNum, 1);

    // 画面に数字を表示
    if (bingoCard.bingoBallArray.length == 0) {
      ballNum.innerHTML = this.ballNumArray[0];
      ballBtn.classList.add("hide");
      setTimeout(() => {
        // end.innerHTML = "終了";
      }, 1000);
    } else {
      ballNum.innerHTML = this.ballNumArray[0];
    }

    this.checkNumber();
  }

  // =========== ボールの数字とカード上の数字のチェックをして =============
  // ======== 一致した場合、カード上のその数字の背景色を変更する関数 =========
  checkNumber() {
    // 引いた数字の値がカード上にある場合、
    for (let i = 0; i < bingoCard.col_row_Array.length; i++) {
      if (bingoCard.col_row_Array[i].includes(this.ballNumArray[0])) {
        // インデックス番号を取得する
        const indexNum = bingoCard.col_row_Array[i].indexOf(
          this.ballNumArray[0]
        );
        // 背景色を変える＝穴を開ける
        bingoCard.cardNumArray_html[i][indexNum].classList.add("matchedNum");
      }
    }
    this.showReachBing();
  }

  // ========== リーチ数、ビンゴ数をチェック、出力する関数 ============
  // ===== 縦列のリーチ数をチェックする関数 =====
  checkReachNum(el) {
    let reachNum = 0;
    for (let i = 0; i < bingoCard.cardNumArray_html.length; i++) {
      // true(穴が空いてる)なら
      if (el[i].className === "matchedNum") {
        console.log("マッチした数字あり");
        reachNum += 1;
      }
    }
    console.log(reachNum);
    return reachNum === bingoCard.cardNumArray_html.length - 1 ? 1 : 0;
  }

  // ===== 縦列のビンゴ数をチェックする関数 =====
  checkBingoNum(el) {
    let bingoNum = 0;
    for (let i = 0; i < bingoCard.cardNumArray_html.length; i++) {
      // true(穴が空いてる)なら
      if (el[i].className === "matchedNum") {
        bingoNum += 1;
      }
    }
    return bingoNum === bingoCard.cardNumArray_html.length ? 1 : 0;
  }

  // ===== 画面に出力する関数 =====
  showReachBing() {
    // リーチ数
    let totalReachNumber = 0;
    for (let i = 0; i < bingoCard.cardNumArray_html.length; i++) {
      // 縦列のチェック
      totalReachNumber += this.checkReachNum(bingoCard.cardNumArray_html[i]);
    }
    // ビンゴ数
    let totalBingoNumber = 0;
    for (let i = 0; i < bingoCard.cardNumArray_html.length; i++) {
      // 縦列のチェック
      totalReachNumber += this.checkBingoNum(bingoCard.cardNumArray_html[i]);
    }

    reachNum.innerHTML = totalReachNumber;
    bingoNum.innerHTML = totalBingoNumber;
  }
}

// ====================== インスタンス化 ======================
const bingoCard = new BingoCard();
const bingoBallNumber = new BingoBallNumber();

//======================== クリックイベント ========================
// ========= ビンゴカード作成ボタン =========
createBtn.addEventListener("click", () => {
  // 列数の値（5〜13のどれか）を変数に格納して、makeBingoCardの引数に挿入
  let col_row_num = inputNum.valueAsNumber;

  bingoCard.makeBingoCard(col_row_num);

  form.classList.add("hide");
  createBtn.classList.add("hide");
  ballBtn.classList.remove("hide");
  number_div.classList.remove("hide");
});

// ========= ビンゴボールを引く（数字を表示する）ボタン =========
ballBtn.addEventListener("click", () => {
  bingoBallNumber.makeBingoBall();
});

// 文字列の数字を、数値に変換する方法
// console.log(Number("12"));
