export const checkEmpty = function checkEmpty(checkStr) {
  if (checkStr == null || checkStr == undefined || checkStr == "") {
    return true;
  }
  return false;
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
 * @return {string}
 */
export function formatDate_yyyyMMdd(date0){
  let yyyMMdd;
  if (date0.length !== 8) {
    if (date0.toString().indexOf('Z')!==-1){
      // 如果是国际时间
      yyyMMdd = formatUTCtime(date0,'yyyyMMdd')
    }else {
      // 否则就是中国时间
      yyyMMdd = GetDate_yyyyMMdd_byDate(date0);
    }
  }else{
    yyyMMdd = date0;
  }
  return yyyMMdd;
}


/**
 * @return {string}
 */
export function GetToday_yyyyMMdd(){
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth()+1;
  if (parseInt(month)<10) {
    month =  '0'+month;
  }
  let today = date.getDate();
  if (parseInt(today)<10) {
    today =  '0'+today;
  }
  return year + '' + month + '' + today;
}

/**
 * @return {string}
 */
export function GetDate_yyyyMMdd_byDate(date0){
  let date = new Date(date0);
  let year = date.getFullYear();
  let month = date.getMonth()+1;
  if (parseInt(month)<10) {
    month =  '0'+month;
  }
  let today = date.getDate();
  if (parseInt(today)<10) {
    today =  '0'+today;
  }
  return year + '' + month + '' + today;
}

/**
 * @return {string}
 */
export function GetTodayTime_yyyyMMddhhmmss(){
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth()+1;
  if (parseInt(month)<10) {
    month =  '0'+month;
  }
  let day = date.getDate();
  if (parseInt(day)<10) {
    day =  '0'+day;
  }
  let hour = date.getHours();
  if (parseInt(hour)<10) {
    hour =  '0'+hour;
  }
  let minute = date.getMinutes();
  if (parseInt(minute)<10) {
    minute =  '0'+minute;
  }
  let second = date.getSeconds();
  if (parseInt(second)<10) {
    second =  '0'+second;
  }
  return year +''+ month +''+ day +''+ hour + '' + minute +''+ second;
}

// 格式化世界标准时间   2020-05-09T16:00:00.000Z
export function formatUTCtime(time, format){
  let t = new Date(time);
  let tf = function (i) { return (i < 10 ? '0' : '') + i };
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear());
        break;
      case 'MM':
        return tf(t.getMonth() + 1);
        break;
      case 'mm':
        return tf(t.getMinutes());
        break;
      case 'dd':
        return tf(t.getDate());
        break;
      case 'HH':
        return tf(t.getHours());
        break;
      case 'ss':
        return tf(t.getSeconds());
        break;
    }
  })
}
