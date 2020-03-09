import React, { Component } from "react";
import ReactSVG from "react-svg";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import SettingIcon from "assets/svg/commonIcon/setting.svg";
import InfoRemindIcon from "assets/svg/commonIcon/infoRemind.svg";
import InfoIcon from "assets/svg/commonIcon/info.svg";
import MessageService from "service/message";
import { Store } from "store";
import "./index.scss";

const kind = ["文档", "文件", "进度"];

function getPath(sourcekind, projectID, sourceID) {
  switch (sourcekind) {
    case 0:
      return `/project/${projectID}/doc/${sourceID}`;
    case 1:
      return `/project/${projectID}/file/${sourceID}`;
    case 2:
      return `/status/${sourceID}`;
    default:
      return `/`;
  }
}
let informCanGetMessage = true;
// let informIntervalPointer = null;

class Inform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
      MessageList: []
    };
    this.readAll = this.readAll.bind(this);
    this.getMessage = this.getMessage.bind(this);
  }

  componentDidMount() {
    // waiting for get token
    setTimeout(() => {
      const { storeLoginSuccess } = this.props;
      if (informCanGetMessage && storeLoginSuccess === 1) {
        this.getMessage();
        informCanGetMessage = false;
        setTimeout(() => {
          informCanGetMessage = true;
        }, 10000);
      }
    }, 1000);
    // informIntervalPointer = setInterval(() => {
    //   const { storeLoginSuccess } = this.props;
    //   if (informCanGetMessage && storeLoginSuccess === 1) {
    //     this.getMessage();
    //     informCanGetMessage = false;
    //     setTimeout(() => {
    //       informCanGetMessage = true;
    //     }, 10000);
    //   }
    // }, 5000);
  }

  // componentWillUnmount() {
  //   clearInterval(informIntervalPointer);
  // }

  getMessage() {
    MessageService.getMessageList(1)
      .then(res => {
        this.setState({
          MessageList: res.list.reverse().filter(item => item.readed === false)
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  enter() {
    this.setState({
      hover: true
    });
    if (informCanGetMessage) {
      this.getMessage();
      informCanGetMessage = false;
      setTimeout(() => {
        informCanGetMessage = true;
      }, 10000);
    }
  }

  leave() {
    this.setState({
      hover: false
    });
  }

  readAll() {
    MessageService.messageAllRead()
      .then(() => {
        this.getMessage();
      })
      .catch(error => {
        Store.dispatch({
          type: "substituteWrongInfo",
          payload: error
        });
      });
  }

  render() {
    const { hover, MessageList } = this.state;
    const { storeLoginSuccess } = this.props;
    if (storeLoginSuccess !== 1) {
      return <div />;
    }

    const message = MessageList.length;
    return (
      <div
        onMouseLeave={this.leave.bind(this)}
        className="inform-presentMessage"
      >
        <div onMouseEnter={this.enter.bind(this)}>
          <ReactSVG
            className="header-info-icon"
            path={message ? InfoRemindIcon : InfoIcon}
            svgStyle={{ width: 22 }}
          />
        </div>
        {hover && (
          <div className="header-info-container">
            <div className="header-info-arrow" />
            <div className="header-info">
              <div className="header-info-header">
                <strong>通知</strong>
                <div
                  className={
                    message ? "header-info-read" : "header-info-read read-grey"
                  }
                  onClick={this.readAll}
                  onKeyDown={() => {}}
                  role="presentation"
                >
                  全部已读
                </div>
              </div>
              <div className="header-info-content">
                {MessageList.map((el, index) => {
                  if (index <= 5) {
                    return (
                      !el.readed && (
                        // sourceID is not unique
                        <div className="info-item" key={el.time + el.sourceID}>
                          <div className="info-text">
                            {el.fromName}
                            {el.action + "了你的"}
                            <Link
                              className="info-item-to"
                              to={getPath(
                                el.sourceKind,
                                el.projectID,
                                el.sourceID
                              )}
                            >
                              {kind[el.sourceKind]}
                            </Link>
                          </div>
                          <div className="info-date">
                            {el.time.split(" ")[0]}
                          </div>
                          {/* <ReactSVG
                              className="info-hook"
                              path={Check}
                              svgStyle={{ width: 14 }}
                              // onClick={this.read(el.sourceID)}
                            /> */}
                        </div>
                      )
                    );
                  }
                  return false;
                })}
                {!message && <div className="info-none">无新的通知</div>}
              </div>
              <div className="header-info-footer">
                <ReactSVG
                  className="info-setting-icon"
                  path={SettingIcon}
                  svgStyle={{ width: 14 }}
                />
                <Link
                  className="header-info-setting footer-text"
                  to="/teamMember/personalSet"
                >
                  通知设置
                </Link>
                <Link className="header-info-all footer-text" to="/message">
                  查看所有通知
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

Inform.propTypes = {
  storeLoginSuccess: PropTypes.number
};

Inform.defaultProps = {
  storeLoginSuccess: 0
};

const mapStateToProps = state => ({
  storeLoginSuccess: state.loginSuccess
});

export default connect(mapStateToProps)(Inform);
