import Fetch from "./fetch";

const LandingService = {
  getUsername() {
    const splitArr = [{ "?": 1 }, { "&": 0 }, { "=": 1 }];
    let flag = 0;
    let splitStr = window.location.href;

    while (flag < splitArr.length) {
      const ch = Object.keys(splitArr[flag])[0];
      if (splitStr.indexOf(ch) > -1) {
        splitStr = splitStr.split(ch)[splitArr[flag][ch]];
        flag++;
      } else {
        break;
      }
    }

    if (flag === splitArr.length) {
      return splitStr;
    }
    if (localStorage.username && localStorage.username.length > 0) {
      // 去除localStorage字符串中的回车
      const re = /(.*)([\r\n]*)$/;
      return re.exec(localStorage.username)[1];
    }
    return "";
  },
  getPassToken() {
    const splitArr = [{ "?": 1 }, { "&": 1 }, { "=": 1 }];
    let flag = 0;
    let splitStr = window.location.href;

    while (flag < splitArr.length) {
      const ch = Object.keys(splitArr[flag])[0];
      if (splitStr.indexOf(ch) > -1) {
        splitStr = splitStr.split(ch)[splitArr[flag][ch]];
        flag++;
      } else {
        break;
      }
    }

    if (flag === splitArr.length) {
      return splitStr;
    }
    if (localStorage.username && localStorage.username.length > 0) {
      // 去除localStorage字符串中的回车
      const re = /(.*)([\r\n]*)$/;
      return re.exec(localStorage.username)[1];
    }
    return "";
  },
  getEmail(username) {
    return Fetch(
      `http://pass.muxi-tech.xyz/auth/api/email?username=${decodeURIComponent(
        username
      )}`
    );
  },
  getToken(data) {
    return Fetch("/api/v1.0/auth/login/", {
      method: "POST",
      data
    });
  },
  SignUp(data) {
    return Fetch("/api/v1.0/auth/signup/", {
      method: "POST",
      data
    });
  }
};

export default LandingService;
