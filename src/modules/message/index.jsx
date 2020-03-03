/*
查看全部信息
*/
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Gotop from "components/common/toTop/top";
import { Store } from "store";
import MessageService from "service/message";
import "static/css/common.scss";
import "./index.scss";

const kind = ["文档", "文件"];

function getPath(sourcekind, projectID, sourceID) {
  switch (sourcekind) {
    case 0:
      return `/project/${projectID}/doc/${sourceID}`;
    case 1:
      return `/project/${projectID}/file/${sourceID}`;
    default:
      return `/`;
  }
}

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MessageList: []
    };
    this.readAll = this.readAll.bind(this);
    this.getMessage = this.getMessage.bind(this);
  }

  componentDidMount() {
    this.getMessage();
  }

  getMessage() {
    MessageService.getMessageList(1)
      .then(res => {
        this.setState({
          MessageList: res.list.reverse()
        });
      })
      .catch(error => {
        Store.dispatch({
          type: "substituteWrongInfo",
          payload: error
        });
      });
  }

  readAll() {
    const { storeUsername } = this.props;

    MessageService.messageAllRead(storeUsername)
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
    const { MessageList } = this.state;
    return (
      <div className="subject cardContainer">
        <div className="message-container">
          <div className="message-header">
            <span className="message-all">全部通知</span>
            <span
              className="message-readed message-readall"
              onClick={this.readAll}
              onKeyDown={() => {}}
              role="presentation"
            >
              全部标为已读
            </span>
          </div>
          <div className="message-list">
            {MessageList.map(el => (
              <div className="message-item" key={el.sourceID}>
                <div className="message-text">
                  {el.fromName}
                  {el.action}
                  <Link
                    className="info-item-to"
                    to={`${getPath(el.sourceKind, el.projectID, el.sourceID)}`}
                  >
                    {kind[el.sourceKind]}
                  </Link>
                </div>
                <div className="message-date">{el.time}</div>
                <div className="message-readed">{el.readed ? "已读" : ""}</div>
              </div>
            ))}
          </div>
          <div className="message-none">没有更多通知了</div>
        </div>
        <Gotop className="go-top" />
      </div>
    );
  }
}

Message.propTypes = {
  storeUsername: PropTypes.string
};

Message.defaultProps = {
  storeUsername: ""
};

const mapStateToProps = state => ({
  storeUsername: state.username
});

export default connect(mapStateToProps)(Message);
