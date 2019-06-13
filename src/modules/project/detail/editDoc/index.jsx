import React, { Component } from "react";
import PropTypes from "prop-types";
import FileService from "service/file";
import { Store } from "store";
import Dialog from "rc-dialog";

import Edit from "../../../status/markdown/edit1";
import "static/css/common.scss";
import "./index.scss";

class EditDoc extends Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.draftId = `doc-draft${match.params.id || ""}`;
    this.state = {
      modalVisible: false,
      id: parseInt(match.params.id, 0),
      title: "",
      content: null
    };
    this.save = this.save.bind(this);
    this.getDocContent = this.getDocContent.bind(this);
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

  // 获取文档详细内容
  getDocContent() {
    const { id } = this.state;
    FileService.getDocConnent(id)
      .then(res => {
        this.setState({
          title: res.name,
          content: res.content
        });
      })
      .catch(error => {
        Store.dispatch({
          type: "substituteWrongInfo",
          payload: error
        });
      });
  }

  onContentChange = val => {
    this.setState({
      content: val
    });

    // 同步到 localStorage，保存草稿
    localStorage.setItem(this.draftId, val);
  };

  onTitleChange = event => {
    this.setState({
      title: event.target.value
    });
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

  getContentFromCache = () => {
    const draft = localStorage.getItem(this.draftId);

    this.setState({
      content: draft
    });
  };

  initContentWithoutDraft = () => {
    this.getDocContent();
  };

  save(title, content) {
    const { id } = this.state;
    const postData = {
      DocName: title,
      content
    };
    FileService.updateDoc(id, postData)
      .then(() => {
        // 清除草稿缓存
        localStorage.removeItem(this.draftId);
        // 保存成功
        window.history.back();
      })
      .catch(error => {
        Store.dispatch({
          type: "substituteWrongInfo",
          payload: error
        });
      });
  }

  render() {
    const { title, content, modalVisible } = this.state;
    return (
      <div>
        <Edit
          content={content}
          title={title}
          save={this.save}
          onTitleChange={this.onTitleChange}
          onContentChange={this.onContentChange}
        />
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
          检测到您有未保存的文档内容，是否恢复？
        </Dialog>
      </div>
    );
  }
}

EditDoc.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string
  })
};

EditDoc.defaultProps = {
  match: {}
};
export default EditDoc;
