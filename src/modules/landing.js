import React, { Component } from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Store } from "store";
import ManageService from "service/manage";
import LandingService from "service/landing";
import Cookie from "service/cookie";
import "static/css/common.scss";

const User = decodeURIComponent(LandingService.getUsername());
const Token = decodeURIComponent(LandingService.getPassToken());
const requestBody = {
  name: User,
  email: "",
  avatar: "",
  tel: "",
  teamID: 1
};

Store.dispatch({
  type: "substituteUsername",
  payload: User || ""
});

const validateEmail = email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

class Landing extends Component {
  componentDidMount() {
    // 内网门户可以使用email登录或者用户名登录，所以传过来的可以是用户名也可能是email
    if (validateEmail(User)) {
      this.login(User);
    } else {
      LandingService.getEmail(User)
        .then(({ data: { email } }) => {
          this.login(email);
        })
        .catch(error => {
          Store.dispatch({
            type: "substituteWrongInfo",
            payload: error
          });
        });
    }
  }

  login = email => {
    const userInfo = {
      email,
      token: Token
    };
    requestBody.email = email;
    Store.dispatch({
      type: "substituteEmail",
      payload: email || ""
    });
    LandingService.getToken(userInfo)
      .then(response => {
        Store.dispatch({
          type: "substituteId",
          payload: response.uid || 0
        });
        Store.dispatch({
          type: "substituteToken",
          payload: response.token || ""
        });
        Cookie.setCookie("workbench_token", response.token, 36500);
        Store.dispatch({
          type: "substituteRole",
          payload: response.urole || 1
        });
        ManageService.getPersonalSet(response.uid)
          .then(res => {
            Store.dispatch({
              type: "substituteAvatar",
              payload: res.avatar || ""
            });
            Store.dispatch({
              type: "substituteLoginSuccess",
              payload: 1
            });
          })
          .catch(error => {
            Store.dispatch({
              type: "substituteWrongInfo",
              payload: error
            });
          });
      })
      .catch(() => {
        LandingService.SignUp(requestBody)
          .then(() => {
            Store.dispatch({
              type: "substituteLoginSuccess",
              payload: 2
            });
          })
          .catch(error => {
            Store.dispatch({
              type: "substituteWrongInfo",
              payload: error
            });
          });
      });
  };

  render() {
    const { storeLoginSuccess } = this.props;

    if (storeLoginSuccess === 1) {
      return (
        <div>
          <Redirect to="/" />
        </div>
      );
    }
    if (storeLoginSuccess === 2) {
      return (
        <div>
          <div className="subject alert">
            <p>成功向团队发起申请,请留意填写的邮箱</p>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="subject alert">
          <p>页面加载中···</p>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  storeLoginSuccess: PropTypes.number
};

Landing.defaultProps = {
  storeLoginSuccess: 0
};

const mapStateToProps = state => ({
  storeLoginSuccess: state.loginSuccess
});

export default connect(mapStateToProps)(Landing);
