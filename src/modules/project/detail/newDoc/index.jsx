import React, { Component } from "react";
import PropTypes from "prop-types";
import FileService from "service/file";
import ProjectService from "service/project";
import { Store } from "store";
import Dialog from "rc-dialog";

import Edit from "../../../status/markdown/edit1";
import { FileTree } from "../../fileTree";
import "static/css/common.scss";
import "./index.scss";

class NewDoc extends Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.draftId = `doc-draft${match.params.id || ""}`;
    this.state = {
      modalVisible: false,
      content: null,
      title: "",
      docTree: {},
      pid: parseInt(match.params.pid, 0),
      docRootId: parseInt(match.params.id, 0)
    };
    this.save = this.save.bind(this);
    this.getDocTree = this.getDocTree.bind(this);
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

    this.getDocTree();
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
    // console.log()
    this.setState({
      content: draft
    });
  };

  // 获取最新文档树
  getDocTree() {
    const { pid } = this.state;
    FileTree.getDocTree(pid)
      .then(res => {
        this.setState({
          docTree: res
        });
      })
      .catch(error => {
        Store.dispatch({
          type: "substituteWrongInfo",
          payload: error
        });
      });
  }

  initContentWithoutDraft = () => {
    this.setState({
      content: ""
    });
  };

  save(title, content) {
    if (!title || !content) {
      return;
    }
    const { docTree, pid, docRootId } = this.state;
    const postData = {
      mdname: title,
      content,
      project_id: pid
    };
    FileService.createDoc(postData)
      .then(res => {
        // 创建成功
        const newNode = {
          folder: false,
          id: res.fid,
          name: title
        };
        const newTree = FileTree.insertNode(newNode, docRootId, docTree);
        if (newTree) {
          ProjectService.updateProjectDocTree(pid, JSON.stringify(newTree))
            .then(() => {
              // 清除草稿缓存
              localStorage.removeItem(this.draftId);
              window.history.back();
            })
            .catch(error => {
              Store.dispatch({
                type: "substituteWrongInfo",
                payload: error
              });
            });
        }
      })
      .catch(error => {
        Store.dispatch({
          type: "substituteWrongInfo",
          payload: error
        });
      });
  }

  render() {
    const { content, title, modalVisible } = this.state;
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

NewDoc.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string
  })
};

NewDoc.defaultProps = {
  match: {}
};
export default NewDoc;
