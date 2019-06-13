import React, { Component } from "react";
import PropTypes from "prop-types";
// import { MarkdownPreview } from "react-marked-markdown";
import Goback from "components/common/goBack/index";
import Button from "components/common/button";
import RichTextEditor from "components/common/editor";
// import MarkdownInput from "./marked/input";
import "static/css/common.scss";
import "./edit.scss";
import "service/cookie";

class Edit extends Component {
  constructor(props) {
    super(props);
    // this.draftId = `doc-draft${props.id || ""}`;
    this.state = {
      textnone: false
    };
  }

  render() {
    const { textnone } = this.state;
    const { save, content, title, onContentChange, onTitleChange } = this.props;

    return (
      <div>
        <div className="head">
          <div className="last">
            <Goback width="33px" height="33px" />
          </div>
          <input
            className="write-input"
            type="text"
            value={title}
            onChange={onTitleChange}
            placeholder="请输入标题"
          />
          {textnone && (
            <span className="status-ifnone">*标题和内容不能为空！</span>
          )}
          <div className="status-save-bt">
            <Button
              onClick={() => {
                if (title !== "" && content !== "") {
                  save(title, content);

                  // 清除草稿缓存
                  localStorage.removeItem(this.draftId);
                } else {
                  this.setState({
                    textnone: true
                  });
                }
              }}
              text="保存并返回"
            />
          </div>
        </div>
        <div className="status-markdown">
          {content === null ? null : (
            <RichTextEditor value={content} onChange={onContentChange} />
          )}
        </div>
      </div>
    );
  }
}

Edit.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string
  }),
  content: PropTypes.string,
  title: PropTypes.string,
  save: PropTypes.func,
  onTitleChange: PropTypes.func,
  onContentChange: PropTypes.func
};

Edit.defaultProps = {
  match: {},
  content: "",
  title: "",
  save: () => {},
  onTitleChange: () => {},
  onContentChange: () => {}
};
export default Edit;
