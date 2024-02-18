const itemList = require('../const/boxItem');

/**
 * 周回数を計算する
 * 
 * @param {number} boxNum 目標箱数
 * @param {boolean} isTicket ガチャチケット有無
 */
const calc = (boxNum, isTicket) => {
  let totalItem;
  // 目標戦果数の合計を算出
  if (isTicket) {
    totalItem = calcGachaItem(boxNum, itemList[0]);
  } else {
    totalItem = calcGachaItem(boxNum, itemList[1]);
  }

  //周回数の計算する

  return {
    requireItem : totalItem,
    count : calcRoundCount(totalItem)
  }
}

/**
 * 必要戦果を計算する
 * 
 * @param {*} boxNum 
 * @param {*} itemList 
 * @returns 
 */
function calcGachaItem(boxNum, itemList) {
  let totalItem = 0;
  for (let i = 0; i < boxNum; i++) {
    if (i < 4) {
      totalItem += itemList[i];
    } else if (i >= 4 && i < 20) {
      totalItem += itemList[itemList.length - 2];
    } else {
      totalItem += itemList[itemList.length - 1];
    }
  }
  return totalItem;
}

const calcRoundCount = (totalItem) => {
  // ミッション等でもらえる戦果
  const FIXED_ITEM = 4350;
  // HL1体あたりの戦果
  const ITEM_PER_HL = 144;
  // HELL1体あたりの戦果
  const ITEM_PER_HELL = 100;
  // VeryHard1体あたりの戦果
  const ITEM_PER_VH = 31;
  // VeryHard1体あたりのドロップ
  const DROP_PER_VH = 3.5;

  // 必要戦果から上記固定戦果を引く
  let item = totalItem - FIXED_ITEM;
  // HLの周回数
  let tmpHlRound = Math.ceil(item / ITEM_PER_HL);
  // HELLのが出現する回数を出す
  const hellCount = Math.floor(tmpHlRound * 0.3);
  // HELLで稼ぐことのできる戦果を計算する
  const itemHell = hellCount * ITEM_PER_HELL;
  // 必要戦果を更新
  item -= itemHell;
  // HLの周回数を更新
  tmpHlRound = Math.ceil(item / ITEM_PER_HELL);
  // VeryHardの周回数を導出
  const reqVoluntaryMaterial = tmpHlRound * 5 - hellCount * 2;
  const reqVhCount = Math.floor(reqVoluntaryMaterial / DROP_PER_VH);
  // VeryHardで取得する戦果を計算
  const itemOfVh = reqVhCount * ITEM_PER_VH;
  // 必要戦果を更新
  item -= itemOfVh;
  const hlRound = Math.ceil(item / ITEM_PER_HL);

  return {
    requireHlCount: hlRound,
    requireHellCount: hellCount,
    requireVeryHardCount: reqVhCount
  }
}

module.exports = calc;