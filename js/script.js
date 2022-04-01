// ボタンを押した回数のカウント(あとで消す)
pushBtnCount = 0;
// 組数のカウント
incBtnCount = 0;
decBtnCount = 0;
// 総プレイヤー数のカウント
players = 0;
// 有効プレイヤー数のカウント
playerCount = 0;
// 有効プレイヤーのインデックス番号
index = [];
// 組数のカウント
party = 0;
// 合計金額のカウント
amount = 0;
// 単純均等割の金額
simpleEqual = 0;
// 単純均等割の配列
floorEqualArray = [];
// 均等割にあたり発生する端数の金額
difference = 0;
//差額負担人数
onPeople = 0;

// １組目をデフォルト表示
$partys = $('#templatePlayfees').clone();
$partys.css('display','block');
$partys.attr('id','primaryPlayfees')
$('#primaryPlayfeeWrapper').append($partys);


//現在のプレイヤー数を取得
playerLength = 
$('#primaryPlayfeeWrapper > #primaryPlayfees')
.find('.primary-playfee').length;

// テンプレートのクローンを作成する
$('#incClonesBtn').on('click', function(){
  // ボタンカウント
  incBtnCount ++;
  // 総組数
  party = $('.primary-playfees').length;
  //総プレイヤー数
  playerLength = $('.primary-playfee').length;

  console.log('ボタンカウント:' + incBtnCount);
  console.log('総組数:' + party);
  console.log('総プレイヤー数:' + playerLength);

  // 1組増やす
  $partys = $('#templatePlayfees').clone();
  $partys.css('display','block');
  $partys.attr('id','primaryPlayfees')
  $('#primaryPlayfeeWrapper').append($partys);

  return playerLength, party, $partys;
});

// テンプレートのクローンを削除する
$('#decClonesBtn').on('click', function(){
  // 1組減らす
  $('#primaryPlayfees').last().remove();

    // ボタンカウント
    decBtnCount ++;

    // 総組数
    party = $('#primaryPlayfeeWrapper > #primaryPlayfees').length;
    //総プレイヤー数
    playerLength = 
    $('#primaryPlayfeeWrapper > #primaryPlayfees')
    .find('.primary-playfee').length;

    console.log('ボタンカウント:' + decBtnCount);
    console.log('総組数:' + party);
    console.log('総プレイヤー数:' + playerLength);

  return playerLength, party;
});


/*-----------------------------*/
/*  均等割ボタンのイベントハンドラ     */
/*-----------------------------*/


$('#calcEqualBtn').on('click', (e) => {
  //フォームの送信を止める
  e.preventDefault();

  // 均等割ボタンを押せない状態にする
  $('#calcEqualBtn')
  .prop('disabled',true)
  .val('均等割計算中');

  // フォームの値を取得して総額を算出する
  for(i=0; i<playerLength; i++){
    let player = $('#primaryPlayfeeWrapper > #primaryPlayfees')
    .find('.primary-playfee');
    let value = parseFloat(player[i].value);
    if(value){
      // 合計金額に値を加算
      amount += value;
      // 有効フォーム(プレイヤー)数を増加
      playerCount ++;
      // 有効プレイヤーのインデックス番号を追加
      index.push(i);
      // 有効プレイヤーにクラスを追加
      $(player[i]).addClass(`player-${i}`);
      console.log(index);
      console.log(playerCount);
      console.log(amount);
    } else {
      continue;
    };
  };

  // 総合計を表示
  $('#amountFee').text('¥'+ amount.toLocaleString());
  // プレイヤー数を表示
  $('#playerCount').text(playerCount + '名');


  // 単純均等割の金額を算出する
  simpleEqual = amount / playerCount;

  // プレイヤーの数だけカードを作成する
  for(i=0; i<index.length; i++){
    $results = $('#templateResultCards').clone();
    $results.css('display','inline-block');
    $results.attr('id','resultCards');
    $results.addClass('r-player-' + index[i]);

    // 元のプレーフィを入力する
    value = $('.player-'+ index[i]).val();
    $results.find('.first-playfee').text(value);

    $('#resultCardWrapper').append($results);
  }


  // 単純均等割の金額が下一桁0(10円単位)なら
  if(simpleEqual.toString().slice(-1) === "0"){
    // 単純均等割の金額をそのまま結果へ出力
    for(i=0; i<index.length; i++){
      $results = $('.r-player-' + index[i]);
      $results.find('.last-playfee').text(simpleEqual);
      primary = $results.find('.first-playfee').text();
      last = $results.find('.last-playfee').text();
      difference = Math.floor((last - primary) / 1.1);
      // 調整金がマイナスの場合に、負の方向へ丸められるのを防ぐ
      if(difference < 0){
        difference += 1;
      }
      $results.find('.adjustment').text(difference);
    };
  } else {
    //下一桁切り捨て、10円単位にする
    floorEqual = Math.floor(simpleEqual / 10) * 10;

    // 下一桁を切り捨てにした値を配列に代入
    for(i = 0; i < playerCount; i++){
      floorEqualArray.push(floorEqual);
    };

    //下一桁切り捨て後の1人あたりのプレーフィと総額の差を求める
    difference = amount - (floorEqual * playerCount);

    // 差額負担人数の算出
    onPeople = difference / 10;

    // 差額を加算してfloorEqualArrayを置き換える
    for(i = 0; i < onPeople; i++){
      floorEqualArray.splice([i],1,floorEqualArray[i] + 10);
      console.log(floorEqualArray);
    }
    
    // 結果欄に最終の均等割後の金額を出力
    for(i=0; i < playerCount; i++){
      $(`.r-player-${i}`).find('.last-playfee').text(floorEqualArray[i]);
    }

    // 調整金を求めて結果欄に出力
    for(i=0; i < index.length; i++){
      $results = $('.r-player-' + index[i]);
      primary = $results.find('.first-playfee').text();
      last = $results.find('.last-playfee').text();
      difference = Math.floor((last - primary) / 1.1);
      // 調整金がマイナスの場合に、負の方向へ丸められるのを防ぐ
      if(difference < 0){
        difference += 1;
      }
      $results.find('.adjustment').text(difference);
    }
  };

  // 均等割ボタンを初期状態にする
  $('#calcEqualBtn')
  .prop('disabled',false)
  .val('均等割');

});

$('#resetFormBtn').on('click', () => {
  // プレーフィ入力フォームをクリア
  resetPlayfeeForm();
})

// フォームの値をリセットする
const resetPlayfeeForm = () => {
  
  // プレーフィ入力フォームを空にする
  $primaryForms = $('#primaryPlayfeeWrapper').find('.primary-playfee');
  $primaryForms.val('');

  // 結果カードを削除する
  $lastCards = $('#resultCardWrapper').find('.result-cards');
  $lastCards.remove();

  // 総合計をクリア
  $('#amountFee').text('');
  // プレイヤー数を表示
  $('#playerCount').text('');

  //各種変数の初期化
  // ボタンを押した回数のカウント(あとで消す)
  pushBtnCount = 0;
  // 組数のカウント
  incBtnCount = 0;
  decBtnCount = 0;
  // 総プレイヤー数のカウント
  players = 0;
  // 有効プレイヤー数のカウント
  playerCount = 0;
  // 有効プレイヤーのインデックス番号
  index = [];
  // 組数のカウント
  party = 0;
  // 合計金額のカウント
  amount = 0;
  // 単純均等割の金額
  simpleEqual = 0;
  // 単純均等割の配列
  floorEqualArray = [];
  // 均等割にあたり発生する端数の金額
  difference = 0;
  //差額負担人数
  onPeople = 0;
}

/*-----------------------------*/
/* helperボタンのイベントハンドラ     */
/*-----------------------------*/

$('#helperBtn').on('click', (e) => {
  $('#faqModalWrapper').addClass('is-open');
});

/*-----------------------------*/
/* closeボタンのイベントハンドラ      */
/*-----------------------------*/

$('#closeBtn').on('click', (e) => {
  $('#faqModalWrapper').removeClass('is-open');
});

//　モーダルをクリックしても閉じるようにする
$('#faqModalWrapper').on('click', (e) => {
  $('#faqModalWrapper').removeClass('is-open');
});
