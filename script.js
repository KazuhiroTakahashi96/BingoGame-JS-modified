// 要素取得
const reachNum = document.querySelector("#reach-num");
const bingoNum = document.querySelector("#bingo-num");
const ballNum = document.querySelector("#ball-num");
const span = document.querySelector("span");
const end = document.querySelector("#end");

// ボタン取得
const createBtn = document.querySelector("#create-btn");
const ballBtn = document.querySelector("#ball-btn");

// 列数の値を取得
const bingo_option = document.querySelector("#bingo_option");

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
    // ビンゴカードの数字を格納する配列。二次元配列にする
    this.col_row_Array = new Array();

    // 上の配列と同じで二次元配列だが、こちらはhtml要素として
    // 取得したものを格納する二次元配列
    this.cardNumArray_html = new Array();

    // 1〜最大195（13列の時）の値が入る配列
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
    // col x col列のビンゴカードの二次元配列作成。中身はまだ空
    for (let i = 0; i < col; i++) {
      this.col_row_Array[i] = new Array();
      this.cardNumArray_html[i] = new Array();
    }

    for (let i = 1; i <= col * 15; i++) {
      this.bingoBallArray.push(i);
    }

    // makeRandomNum関数を発動
    this.makeRandomNum(col);

    console.table(this.col_row_Array);

    const centerNum = (col - 1) / 2;

    // 数字を画面に出力する処理
    for (let i = 0; i < col; i++) {
      // 1列分の数字を格納するdivタグ作成
      const col_div = document.createElement("div");

      this.col_row_Array[i].map((el, index) => {
        // 各数字を格納するpタグ作成
        const P_Tag = document.createElement("p");

        // 中心を'free'にするための処理
        if (i === centerNum && index === centerNum) {
          el = "free";
          P_Tag.append(el);
          // 穴を開ける処理（背景色を変更）
          P_Tag.classList.add("matchedNum");

          // 中心以外の処理
        } else {
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

    // 0〜最大194の中で、ランダムな値を取得
    const randomNum = Math.floor(
      Math.random() * bingoCard.bingoBallArray.length
    );
    this.ballNumArray.unshift(bingoCard.bingoBallArray[randomNum]);
    // 数字が重複しないよう、元の配列から削除
    bingoCard.bingoBallArray.splice(randomNum, 1);

    // 画面に数字を表示
    if (bingoCard.bingoBallArray.length === 0) {
      ballNum.innerHTML = this.ballNumArray[0];
      ballBtn.classList.add("hide");
      end.innerHTML = "終了";
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
  // ===== 縦列のリーチ数、ビンゴ数をチェックする関数 =====
  col__ReachBingo_Num(array, minus) {
    // html要素の二次元配列の各配列を引数に持ってくる
    let col__reachBingo_Num = 0;
    for (let i = 0; i < bingoCard.cardNumArray_html.length; i++) {
      // true(穴が空いてる)なら
      if (array[i].className === "matchedNum") {
        col__reachBingo_Num += 1;
      }
    }
    return col__reachBingo_Num === bingoCard.cardNumArray_html.length - minus
      ? 1
      : 0;
  }

  // ===== 横列のリーチ数、ビンゴ数をチェックする関数 =====
  row__ReachBingo_Num(array, minus) {
    // html要素の二次元配列そのものを引数に持ってくる
    let totalRow_ReachBingo_Num = 0;

    for (let j = 0; j < array.length; j++) {
      let reachBingo_Num = 0;
      for (let i = 0; i < array.length; i++) {
        // 1行ごとにリーチ数、ビンゴ数を計算するfor文
        if (array[i][j].className === "matchedNum") {
          // true(穴が空いてる)なら
          reachBingo_Num += 1;
        }
      }
      reachBingo_Num === array.length - minus
        ? (totalRow_ReachBingo_Num += 1)
        : totalRow_ReachBingo_Num;
    }
    return totalRow_ReachBingo_Num;
  }

  // ===== 斜め列のリーチ数、ビンゴ数をチェックする関数 =====
  cross__ReachBingo_Num(array, minus) {
    // html要素の二次元配列そのものを引数に持ってくる
    let totalCross_ReachBingo_Num = 0;

    // 斜め列1(左上から右下)のリーチ数、ビンゴ数
    let reachBingo_Num1 = 0;
    for (let i = 0; i < array.length; i++) {
      // true(穴が空いてる)なら
      if (array[i][i].className === "matchedNum") {
        reachBingo_Num1 += 1;
      }
    }
    reachBingo_Num1 === array.length - minus
      ? (totalCross_ReachBingo_Num += 1)
      : totalCross_ReachBingo_Num;

    // 斜め列2(左下から右上)のリーチ数、ビンゴ数
    let reachBingo_Num2 = 0;
    for (let i = 0; i < array.length; i++) {
      // true(穴が空いてる)なら
      if (array[i][array.length - 1 - i].className === "matchedNum") {
        reachBingo_Num2 += 1;
      }
    }
    reachBingo_Num2 === array.length - minus
      ? (totalCross_ReachBingo_Num += 1)
      : totalCross_ReachBingo_Num;

    return totalCross_ReachBingo_Num;
  }

  // ===== 画面に出力する関数 =====
  showReachBing() {
    // ==== リーチ数 =====
    let totalReachNumber = 0;
    for (let i = 0; i < bingoCard.cardNumArray_html.length; i++) {
      // 縦列のチェック
      totalReachNumber += this.col__ReachBingo_Num(
        bingoCard.cardNumArray_html[i],
        1
      );
    }
    // 横列のチェック
    totalReachNumber += this.row__ReachBingo_Num(
      bingoCard.cardNumArray_html,
      1
    );
    // 斜め列のチェック
    totalReachNumber += this.cross__ReachBingo_Num(
      bingoCard.cardNumArray_html,
      1
    );

    // ==== ビンゴ数 ====
    let totalBingoNumber = 0;
    for (let i = 0; i < bingoCard.cardNumArray_html.length; i++) {
      // 縦列のチェック
      totalBingoNumber += this.col__ReachBingo_Num(
        bingoCard.cardNumArray_html[i],
        0
      );
    }
    // 横列のチェック
    totalBingoNumber += this.row__ReachBingo_Num(
      bingoCard.cardNumArray_html,
      0
    );
    // 斜め列のチェック
    totalBingoNumber += this.cross__ReachBingo_Num(
      bingoCard.cardNumArray_html,
      0
    );

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
  // 列数の値（5〜13のどれか）を変数に格納
  const bingo_col_num = bingo_option.value;

  // bingo_col_num　は、厳密には文字列なので数値に変換して引数として挿入
  bingoCard.makeBingoCard(Number(bingo_col_num));

  form.classList.add("hide");
  createBtn.classList.add("hide");
  ballBtn.classList.remove("hide");
  number_div.classList.remove("hide");
});

// ========= ビンゴボールを引く（数字を表示する）ボタン =========
ballBtn.addEventListener("click", () => {
  bingoBallNumber.makeBingoBall();
});
