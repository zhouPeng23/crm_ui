export const checkEmpty = function checkEmpty(checkStr) {
  return checkStr == null || checkStr === undefined || checkStr === "";
};

/**
 * 将毫秒字符串转为日期类型
 * @param str
 * @returns {string}
 */
export function millisecondFormatDate_yymmddHHmmss(str) {
  if (str==null || str.length===0){
    return "";
  }else{
    let oDate = new Date(str);
    let oYear = oDate.getFullYear();
    let oMonth = oDate.getMonth()+1;
    let oDay = oDate.getDate();
    let oHour = oDate.getHours();
    let oMin = oDate.getMinutes();
    let oSen = oDate.getSeconds();
    return oYear +'-'+ addZero(oMonth) +'-'+ addZero(oDay) +' '+ addZero(oHour) +':'+ addZero(oMin) +':'+addZero(oSen);
  }
}

/**
 * 将毫秒字符串转为日期类型
 * @param str
 * @returns {string}
 */
export function millisecondFormatDate_yymmdd(str) {
  if (str==null || str.length===0){
    return "";
  }else{
    let oDate = new Date(str);
    let oYear = oDate.getFullYear();
    let oMonth = oDate.getMonth()+1;
    let oDay = oDate.getDate();
    return oYear +'-'+ addZero(oMonth) +'-'+ addZero(oDay);
  }
}

//补零操作
function addZero(num){
  if(parseInt(num) < 10){
    num = '0'+num;
  }
  return num;
}

/**
 * 格式化性别
 * @param str
 * @returns {string}
 */
export function formatHumanSexByNumber(str){
  if (str == null || str.length === 0) {
    return "";
  }else{
    if (str === "1" || str === 1) {
      return "男";
    }else if (str === "0" || str === 0) {
      return "女";
    }else{
      return "";
    }
  }
}

/**
 * 校验金额格式
 * @param amount  金额
 * @returns {boolean} 是否正确
 */
export function validateAmount(amount) {
  // 先校验是否为数字
  if (isNaN(amount)) {
    return false;
  }

  // 再校验是否为正数
  if (amount <= 0) {
    return false;
  }

  // 最后校验小数点后最多两位
  return /^\d+(\.\d{1,2})?$/.test(amount);
}

/**
 * 格式化金额
 * @param amount
 * @returns {string}
 */
export function formatAmount(amount) {
  // 先将金额转换为字符串，并去除前导零
  amount = parseFloat(amount).toFixed(2).toString().replace(/^0+/, '');

  // 分离整数部分和小数部分
  let parts = amount.split('.');
  let integerPart = parts[0];
  let decimalPart = parts.length > 1 ? '.' + parts[1] : '';

  // 将整数部分每三位加一个逗号
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // 返回格式化后的金额
  return integerPart + decimalPart;
}

