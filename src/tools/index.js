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
  console.log(date);
  if (!validateEmpty(date)) {
    return "";
  }
  if (date.length === 10) {
    return date;
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
 * 将"预约时间"格式化为 HH:mm:ss
 * @param time
 * @returns {string}
 */
export function formatAppointmentTime2Str(time) {
  if (!validateEmpty(time)) {
    return "";
  }
  if (time.length === 8) {
    return time;
  }
  if (time.length > 8) {
    return time.substring(0,8);
  }
  if (time.length < 8) {
    return time+":00";
  }
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
 * 判断一个date日期是不是今天
 * @param date
 * @returns {boolean}
 */
export function dateIsToday(date) {
  let today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}


/**
 * 判断一个date日期字符串是不是今天
 * @param dateString
 * @returns {boolean}
 */
function dateStrIsToday(dateString) {
  let today = new Date();
  let date = new Date(dateString);
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}


/**
 * 传入日期和时间：如果日期是今天，则返回上午、下午、晚上+时间，否则继续返回时间，如： 上午 08:00 ,  13:00
 * @param dateString
 * @param timeString
 * @returns {string}
 */
export function getTimePeriod(dateString,timeString) {
  if (dateStrIsToday(dateString)) {
    let time = new Date(dateString+" "+timeString);
    let hours = time.getHours();
    let period;
    if (hours >= 0 && hours < 12) {
      period = "上午";
    } else if (hours >= 12 && hours < 18) {
      period = "下午";
    } else {
      period = "晚上";
    }
    return period+"  -  "+timeString.substring(0,5);

  }else{
    return timeString.substring(0,5);
  }
}


/**
 * 传入日期返回： 今日  或者是具体日期 2023-04-11
 * @param dateString
 * @returns {string}
 */
export function getDatePeriod(dateString) {
  if (dateStrIsToday(dateString)) {
    return "今日";
  }else{
    return dateString;
  }
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
 * 校验百分比
 * @param percentNumber
 * @returns {boolean} 是否正确
 */
export function validatePercent(percentNumber) {
  let reg = new RegExp("^([1-9]|[1-9]\\d|100)$");
  return reg.test(percentNumber);
}


/**
 * 格式化操作类型
 * @param operateType
 * @returns {string}
 */
export function formatOperateType(operateType) {
  if (operateType === 1) {
    return "充值";
  }else if (operateType === -1) {
    return "消费";
  }
  return "";
}


/**
 * 格式化金额
 * @param amount
 * @returns {string}
 */
export function formatAmount(amount) {
  if (amount<0.01){
    return "-";
  }
  if (parseFloat(amount).toFixed(2)<1) {
    return amount;
  }

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


/**
 * 格式化顾客收益金额
 * @param amount
 * @param percent
 * @returns {string}
 */
export function formatCustomerIncomeAmount(amount,percent) {
  amount = amount * percent;
  return formatAmount(amount);
}

