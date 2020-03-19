import React, { Component } from "react";
import ReactSVG from "react-svg";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import { MarkdownPreview } from "react-marked-markdown";
import Goback from "components/common/goBack/index";
import thumbs from "assets/svg/commonIcon/thumbs.svg";
import thumbsUp from "assets/svg/commonIcon/thumbs_up.svg";
import Button from "components/common/button/index";
import Avatar from "components/common/avatar/index";
import Othercomments from "components/common/otherComments/comments";
import "static/css/common.scss";
import StatusService from "service/status";
import Loading from "components/common/loading/index";
import CardContainer from "components/layouts/card/index";
import { Store } from "store";
import Delete from "../../setting/components/delete/delete";
import "./detail.scss";

const Goods = [thumbs, thumbsUp];

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteX: false,
      sid: 0,
      title: "",
      content: "",
      time: "",
      likeCount: 0,
      iflike: 0,
      value: "",
      commentList: [],
      loading: true
    };
    this.transferMsgDel = this.transferMsgDel.bind(this);
    this.changeLike = this.changeLike.bind(this);
    this.del = this.del.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    this.setState({
      sid: match.params.id
    });
    StatusService.getStatuDetail(match.params.id)
      .then(doc => {
        if (doc) {
          this.setState({
            sid: doc.sid,
            title: doc.title,
            authorId: doc.author_id,
            content: doc.content,
            time: doc.time,
            likeCount: doc.likeCount,
            iflike: doc.iflike,
            commentList: doc.commentList,
            loading: false
          });
          localStorage.setItem("content", doc.content);
        }
      })
      .catch(error => {
        Store.dispatch({
          type: "substituteWrongInfo",
          payload: error
        });
      });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  changeLike(iflike, likeCount, sid) {
    if (iflike === 0) {
      this.setState({
        iflike: 1,
        likeCount: likeCount + 1
      });
      StatusService.changeLike(sid, 1);
    } else {
      this.setState({
        iflike: 0,
        likeCount: likeCount - 1
      });
      StatusService.changeLike(sid, 0);
    }
  }

  sendComment(value, sid) {
    if (!value) {
      return;
    }
    StatusService.postComments(sid, value).then(result => {
      if (result !== null) {
        StatusService.getStatuDetail(sid).then(comments => {
          if (comments) {
            this.setState({
              commentList: comments.commentList,
              value: ""
            });
          }
        });
      }
    });
  }

  del() {
    this.setState({
      deleteX: true
    });
  }

  transferMsgDel(deleteX) {
    this.setState({ deleteX });
  }

  callback = () => {
    window.close();
  };

  render() {
    const {
      sid,
      deleteX,
      commentList,
      value,
      authorId,
      title,
      time,
      likeCount,
      iflike,
      content,
      loading
    } = this.state;
    const { storeAvatar, storeId } = this.props;

    return loading ? (
      <CardContainer>
        <Loading />
      </CardContainer>
    ) : (
      <div className="subject cardContainer">
        <div className="status-detail-head">
          <Goback callback={this.callback} />
          <div className="stauts-detail-second">
            <div className="status-detail-title">{title}</div>
            <span className="status-detail-time">{time}</span>
          </div>
          {storeId !== authorId ? null : (
            <div className="status-detail-edit">
              <Link
                to={`/status/${sid}/reEdit`}
                className="status-detail-editor"
              >
                编辑
              </Link>
              <span
                className="status-detail-delete"
                onClick={() => {
                  this.del();
                }}
                onKeyDown={this.handleKeyDown}
                role="button"
                tabIndex={0}
              >
                删除
              </span>
              <Delete
                name="确认要删除该进度文档吗？"
                deleteX={deleteX}
                transferMsg={this.transferMsgDel}
                staId={sid}
                staDel
              />
            </div>
          )}
        </div>
        <div className="status-detail-good">
          <div>
            <ReactSVG
              className="status-ifgood"
              onClick={() => this.changeLike(iflike, likeCount, sid)}
              path={Goods[iflike]}
            />
          </div>
          <div className="status-detail-love">{likeCount}</div>
        </div>
        <div className="status-details">
          {/* <MarkdownPreview value={content} /> */}
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        <hr className="status-detail-line" />
        <div className="status-detail-comments">
          {commentList.map(el => (
            <div key={el.cid}>
              <Othercomments
                avatar={el.avatar}
                name={el.username}
                day={el.time}
                text={el.content}
              />
            </div>
          ))}
        </div>
        <div className="send">
          <Avatar
            className="comment-img"
            src={storeAvatar}
            width={49}
            height={49}
          />
          <div className="push">
            <div>
              <textarea
                className="send-comment"
                type="text"
                value={value}
                onChange={this.handleChange}
                placeholder=" 发表评论..."
              />
            </div>
            <div className="comment-bt">
              <Button
                onClick={() => this.sendComment(value, sid)}
                text="发表"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Detail.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string
  }),
  storeAvatar: PropTypes.string,
  storeId: PropTypes.number
};

Detail.defaultProps = {
  match: {},
  storeAvatar: "",
  storeId: 0
};

const mapStateToProps = state => ({
  storeAvatar: state.avatar,
  storeId: state.id
});

export default connect(mapStateToProps)(Detail);
