import React, { Component } from "react";
import PropTypes from "prop-types";
import Goback from "components/common/goBack/index";
import Button from "components/common/button";
import Dialog from "rc-dialog";

import "rc-dialog/assets/index.css";
import "static/css/common.scss";
import StatusService from "service/status";
import { Store } from "store";
import RichTextEditor from "components/common/editor";
import "./edit.scss";
import "service/cookie";

// 进度编辑页
class edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null,
      title: "",
      textnone: false,
      modalVisible: false
    };
    this.draftId = `status-draft${props.match.params.id || ""}`;
    this.handleChange = this.handleChange.bind(this);
    this.save = this.save.bind(this);
  }

  componentDidMount() {
    const draft = localStorage.getItem(this.draftId);

    // 有草稿，用户确认是否恢复草稿
    if (draft) {
      this.setState({
        modalVisible: true
      });
      // 没草稿
    } else {
      this.initContentWithoutDraft();
    }
  }

  initContentWithoutDraft = () => {
    const { match } = this.props;
    if (match.path !== "/edit") {
      // 编辑旧内容，首先拉取服务端的旧内容
      this.getContentFromServer();
    } else {
      // 初次编辑，初始化
      this.setState({
        content: ""
      });
    }
  };

  getContentFromCache = () => {
    const draft = localStorage.getItem(this.draftId);
    // console.log()
    this.setState({
      content: draft
    });
  };

  getContentFromServer = () => {
    const { match } = this.props;
    StatusService.getStatuDetail(match.params.id)
      .then(doc => {
        if (doc) {
          const value = doc.content;
          const name = doc.title;
          this.setState({
            title: name,
            content: value
          });
        }
      })
      .catch(error => {
        Store.dispatch({
          type: "substituteWrongInfo",
          payload: error
        });
      });
  };

  onContentChange = val => {
    this.setState({
      content: val
    });

    // 同步到 localStorage，保存草稿
    localStorage.setItem(this.draftId, val);
  };

  onModalClose = () => {
    this.setState({
      modalVisible: false
    });

    // 有草稿但不使用，走无草稿初始化逻辑
    this.initContentWithoutDraft();

    // 清除草稿
    localStorage.removeItem(this.draftId);
  };

  onModalOK = () => {
    this.getContentFromCache();
    this.setState({
      modalVisible: false
    });

    // 清除草稿
    localStorage.removeItem(this.draftId);
  };

  handleChange(event) {
    this.setState({
      title: event.target.value
    });
  }

  save(title) {
    const { match } = this.props;
    const { content } = this.state;

    if (title.trim() === "" || content.trim() === "") {
      this.setState({
        textnone: true
      });
      return;
    }
    if (match.path === "/edit") {
      StatusService.addNewStatu(title, content).catch(error => {
        Store.dispatch({
          type: "substituteWrongInfo",
          payload: error
        });
      });
      // 清除草稿缓存
      localStorage.removeItem(this.draftId);
      window.history.back();
    } else {
      StatusService.changeStatu(match.params.id, title, content).catch(
        error => {
          Store.dispatch({
            type: "substituteWrongInfo",
            payload: error
          });
        }
      );
      // 清除草稿缓存
      localStorage.removeItem(this.draftId);
      window.history.back();
    }
  }

  render() {
    const { title, textnone, content, modalVisible } = this.state;

    return (
      <div className="subject edit-marginHeader">
        <div className="head">
          <div className="last">
            <Goback width="33px" height="33px" />
          </div>
          <input
            className="write-input"
            type="text"
            value={title}
            onChange={this.handleChange}
            placeholder="请输入标题"
          />
          {textnone && (
            <span className="status-ifnone">*标题和内容不能为空！</span>
          )}
          <div className="status-save-bt">
            <Button
              onClick={() => {
                this.save(title);
              }}
              text="保存并返回"
            />
          </div>
        </div>
        <div className="status-markdown">
          {content === null ? null : (
            <RichTextEditor value={content} onChange={this.onContentChange} />
          )}
        </div>

        <Dialog
          visible={modalVisible}
          animation="slide-fade"
          maskAnimation="fade"
          onClose={this.onModalClose}
          style={{ width: 600 }}
          title={<div>提示</div>}
          footer={[
            <button
              type="button"
              className="btn btn-default"
              key="close"
              onClick={this.onModalClose}
            >
              取消
            </button>,
            <button
              type="button"
              className="btn btn-primary"
              key="save"
              onClick={this.onModalOK}
            >
              确认
            </button>
          ]}
        >
          检测到您有未保存的进度内容，是否恢复？
        </Dialog>
      </div>
    );
  }
}

edit.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string
  })
};

edit.defaultProps = {
  match: {}
};
export default edit;
