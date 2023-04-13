  // 根据键名获取cookie
function getCookie (key) {
    if (document.cookie.length > 0) {
      // 字符串按照分号分割，得到数组
      let arr = document.cookie.split(";");
      for (let i = 0; i < arr.length; i++) {
        // trim:删除空格，按照等号分割，得到[键，名]的数组
        let t = arr[i].trim().split("=");
        // 判断键是否相等，返回相应的值
        if (t[0] === key) {
          return t[1];
        }
      }
    }
    return "";
  }
  export { getCookie }