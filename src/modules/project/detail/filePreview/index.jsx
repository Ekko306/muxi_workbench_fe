import React, { Component } from "react";
import PropTypes from "prop-types";
import MessageService from "../../../../service/message";
import FileService from "../../../../service/file";
import ProjectService from "../../../../service/project";
import { FileTree } from "../../fileTree1";
import WrongPage from "../../../../components/common/wrongPage/wrongPage";
import Othercomments from "../../../../components/common/otherComments/comments";
// import Paging from "../../../../components/common/paging/index";
import Avatar from "../../../../components/common/avatar/index";
import Button from "../../../../components/common/button/index";
import Goback from "../../../../components/common/goBack/index";
import Loading from "../../../../components/common/loading/index";
import FileIcon from "../../components/fileIcon/index";
import "../../../../static/css/common.css";
import "./index.css";

class DocPreview extends Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    this.state = {
      pid: parseInt(match.params.pid, 0),
      id: parseInt(match.params.id, 0),
      isFocus: false,
      // 文件信息
      fileInfo: {
        name: "",
        url: ""
      },
      createTime: "",
      creator: "",
      // fileUrl: "",
      fileUrlWithId: [],
      // 评论列表
      commentList: [],
      // 发表评论的输入值
      commentInput: "",
      // 评论当前页数
      // currentPage: 1,
      // 总页数
      // pageNums: 1
      wrong: {}
    };
    this.getFileInfo = this.getFileInfo.bind(this);
    this.isFocus = this.isFocus.bind(this);
    this.getFileTree = this.getFileTree.bind(this);
    this.getFileUrl = this.getFileUrl.bind(this);
    this.focusFile = this.focusFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.sendComment = this.sendComment.bind(this);
    this.getCommentList = this.getCommentList.bind(this);
    // this.selectPage = this.selectPage.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentWillMount() {
    this.getFileInfo();
    this.getFileTree();
    this.isFocus();
    this.getCommentList();
  }

  // 获取当前页面评论列表
  getCommentList() {
    const { id, pid } = this.state;
    ProjectService.getCommentList(pid, id)
      .then(res => {
        this.setState({
          commentList: res.commentList
          // pageNums:
          //   res.count % 20 === 0
          //     ? Math.floor(res.count / 20, 0)
          //     : Math.floor(res.count / 20, 0) + 1
        });
      })
      .catch(error => {
        this.setState({ wrong: error });
      });
  }

  // 请求该文件的详情信息
  getFileInfo() {
    const { id } = this.state;
    Loading.show();
    const postData = {
      folder: [],
      file: [id]
    };
    FileService.getFileList(postData)
      .then(res => {
        const { creator } = res.FileList[0];
        const regex = /\D/;
        const timeArr = res.FileList[0].create_time.split(regex);
        const timeStr = `${timeArr[0]}年${timeArr[1]}月${timeArr[2]}日`;
        this.setState({
          fileInfo: res.FileList[0],
          createTime: timeStr,
          creator
        });
      })
      .catch(error => {
        this.setState({ wrong: error });
      })
      .finally(() => {
        Loading.hide();
      });
  }

  // 请求该文件所在的树
  getFileTree() {
    const { id, pid } = this.state;
    Loading.show();
    FileTree.getFileTree(pid)
      .then(el => {
        this.getFileUrl(id, el);
      })
      .catch(error => {
        this.setState({ wrong: error });
      })
      .finally(() => {
        Loading.hide();
      });
  }

  // 算出文件的路径
  getFileUrl(id, tree) {
    // 找到文件所在节点
    const node = FileTree.searchNode(id, tree);
    if (node && node.router.length) {
      const fileIdUrl = JSON.parse(JSON.stringify(node.router));
      fileIdUrl.pop();
      fileIdUrl.shift();
      const postData = {
        folder: fileIdUrl.map(el => parseInt(el, 0)),
        file: []
      };
      FileService.getFileList(postData)
        .then(res => {
          // let fileUrl = `路径：${tree.name}`
          let fileUrlWithId = [{ name: "全部文件", id: 0 }];
          if (res.FolderList.length) {
            // fileUrl += `${res.FolderList.map(el => ` - ${el.name}`).reduce((el1, el2) => el1 + el2)}`
            fileUrlWithId = fileUrlWithId.concat(
              res.FolderList.map(el => ({ name: el.name, id: el.id }))
            );
          }
          this.setState({
            // fileUrl,
            fileUrlWithId
          });
        })
        .catch(err => {
          this.setState({ wrong: err });
        });
    }
  }

  // 查看我是否关注
  isFocus() {
    const { id } = this.state;
    // const { isFocus } = this.state
    MessageService.getMyAttentionFiles()
      .then(res => {
        const find = res.list
          .filter(item => item.fileKind === 1)
          .filter(file => file.fileID === id);
        if (find.length) {
          this.setState({
            isFocus: true
          });
        }
      })
      .catch(error => {
        this.setState({ wrong: error });
      });
  }

  // 关注文件或取消关注
  focusFile() {
    const { id, isFocus } = this.state;
    if (isFocus) {
      MessageService.notFocusOnFile(id, 1).catch(error => {
        this.setState({ wrong: error });
      });
      this.setState({
        isFocus: false
      });
    } else {
      MessageService.focusOnFile(id, 1).catch(error => {
        this.setState({ wrong: error });
      });
      this.setState({
        isFocus: true
      });
    }
  }

  // 输入评论内容
  handleChange(event) {
    this.setState({ commentInput: event.target.value });
  }

  // 发送评论
  sendComment() {
    const { pid, id, commentInput } = this.state;
    if (commentInput) {
      ProjectService.commentFile(pid, id, commentInput)
        .then(() => {
          this.setState({
            commentInput: ""
          });
          this.getCommentList();
        })
        .catch(error => {
          this.setState({ wrong: error });
        });
    }
  }

  // 跳转页面
  // selectPage(page) {
  //   const { pid, id, pageNums, currentPage } = this.state;
  //   if (page > 0 && page <= pageNums && page !== currentPage) {
  //     ProjectService.getCommentList(pid, id, page)
  //       .then(res => {
  //         this.setState({
  //           commentList: res.commentList,
  //           currentPage: page
  //         });
  //       })
  //       .catch(error => {
  //         this.setState({ wrong: error });
  //       });
  //   }
  // }

  cancel() {
    this.setState({ wrong: {} });
  }

  render() {
    const {
      pid,
      fileInfo,
      // fileUrl,
      fileUrlWithId,
      creator,
      createTime,
      commentList,
      commentInput,
      // currentPage,
      // pageNums,
      isFocus,
      wrong
    } = this.state;
    return (
      <div className="projectDetail-container">
        <Goback />
        <div className="filePreview-content">
          <div className="filePreview-header-url">
            路径：
            {fileUrlWithId.map((el, index) => (
              <span key={el.id}>
                {index ? <span> - </span> : ""}
                {/* <a href={`../fileFolder/${el.id}`}>{el.name}</a> */}
                <a href={`/project/${pid}/fileFolder/${el.id}`}>{el.name}</a>
              </span>
            ))}
          </div>
          {/*  头部 */}
          <div className="filePreview-header">
            {/* 头部左边 */}
            <div className="filePreview-header-left">
              <FileIcon fileItem={fileInfo} />
              <div className="filePreview-header-fileInfo">
                <div className="filePreview-header-fileName">
                  {fileInfo.name}
                </div>
                <div className="filePreview-header-fileUpdator">
                  {creator}
                  &nbsp;
                  {createTime}
                  上传
                </div>
                <a
                  className="filePreview-onLine"
                  href={fileInfo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  在线预览
                </a>
              </div>
            </div>
            {/* 头部右边 */}
            <div className="filePreview-header-right">
              <div
                onClick={this.focusFile}
                onMouseDown={() => {}}
                role="presentation"
              >
                {isFocus ? "取消关注" : "关注"}
              </div>
              {/* <div>编辑</div> */}
              <a
                href={`${fileInfo.url}?attname=${fileInfo.name}`}
                download={fileInfo.name}
              >
                下载
              </a>
            </div>
          </div>
          <hr className="status-detail-line" />
          {/* 评论列表 */}
          <div className="status-detail-comments">
            {commentList.map(el => (
              <div key={el.id}>
                <Othercomments
                  avatar={el.avatar}
                  name={el.username}
                  day={el.time}
                  text={el.content}
                />
              </div>
            ))}
          </div>
          {/* 分页功能 */}
          {/* {commentList.length ? (
            <div className="filePreview-paging">
              <Paging
                pageNums={pageNums}
                currentPage={currentPage}
                selectPage={this.selectPage}
              />
            </div>
          ) : (
            ""
          )} */}
          {/* 发表评论 */}
          <div className="send">
            <Avatar
              className="comment-img"
              src={localStorage.avatar}
              width={49}
              height={49}
            />
            {/* src是自己的头像 */}
            <div className="push">
              <div>
                <textarea
                  className="send-comment"
                  type="text"
                  value={commentInput}
                  onChange={this.handleChange}
                  placeholder=" 发表评论..."
                />
              </div>
              <div className="comment-bt">
                <Button onClick={() => this.sendComment()} text="发表" />
              </div>
            </div>
          </div>
        </div>
        <WrongPage info={wrong} cancel={this.cancel} />
      </div>
    );
  }
}

DocPreview.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string
  })
};

DocPreview.defaultProps = {
  match: {}
};

export default DocPreview;
