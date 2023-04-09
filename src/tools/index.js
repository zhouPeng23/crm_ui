/**
 * 校验字符串是否为空
 * @param checkStr
 * @returns {boolean}
 */
export function validateEmpty(checkStr) {
  return checkStr !== null && checkStr !== undefined && checkStr !== "";
}


/**
 * 校验手机号
 * @param phoneNumber
 * @returns {boolean}
 */
export function validatePhoneNumber(phoneNumber) {
  // 以1开头，后面跟10位数字，共11位
  const reg = /^1\d{10}$/;
  return reg.test(phoneNumber);
}


/**
 * 校验密码格式
 * @param password
 * @returns {boolean}
 */
export function validatePassword(password) {
  // 先校验长度是否为6-20位
  if (password.length < 6 || password.length > 20) {
    return false;
  }

  // 再校验是否只包含字母和数字
  return /^[a-zA-Z0-9]+$/.test(password);
}


/**
 * 将"日期"格式化为 yyyy-MM-dd
 * @param date
 * @returns {string}
 */
export function formatDate_yyyyMMdd(date) {
  if (!validateEmpty(date)) {
    return "";
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}


/**
 * 将"字符串"日期格式化为 yyyy-MM-dd HH:mm:ss
 * @param str
 * @returns {string}
 */
export function formatStrDate_yymmddHHmmss(str) {
  if (!validateEmpty(str)) {
    return "";
  }
  const date = new Date(str);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


//补零操作
function addZero(num){
  if(parseInt(num) < 10){
    num = '0'+num;
  }
  return num;
}


/**
 * 给定日期增加一定天数
 * @param date
 * @param days
 * @returns {Date}
 */
export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
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

