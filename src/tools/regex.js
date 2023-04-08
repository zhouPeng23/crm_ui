/**
 * 校验金额格式
 * @param money  金额
 * @returns {boolean} 是否正确
 */
export const checkPrice = function validateAmount(money) {
  // 先校验是否为数字
  if (isNaN(money)) {
    return false;
  }
  // 再校验是否为正数
  if (money <= 0) {
    return false;
  }
  // 最后校验小数点后最多两位
  return /^\d+(\.\d{1,2})?$/.test(money);
};













