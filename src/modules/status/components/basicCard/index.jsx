import React, { Component } from "react";
import ReactSVG from "react-svg";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import thumbs from "../../../../assets/svg/commonIcon/thumbs.svg";
import thumbsUp from "../../../../assets/svg/commonIcon/thumbs_up.svg";
import comment from "../../../../assets/svg/commonIcon/comment.svg";
import Avatar from "../../../../components/common/avatar/index";
import StatusService from "../../../../service/status";
import "./index.scss";

const Goods = [thumbs, thumbsUp];

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      whetherLike: props.iflike,
      likeNumber: props.likeCount,
      sid: props.sid,
      isPersonal: props.isPersonal,
      content: props.content
    };
  }

  handleLink = () => {
    const { sid } = this.state;
    window.open(`/status/${sid}`, "detail");
  };

  // componentDidMount() {
  //   const { content } = this.props;
  //   let converted = "";
  //   content.split("").forEach(str => {
  //     if (str !== "\n") {
  //       converted += `${str}`;
  //     } else {
  //       converted += "<br />";
  //     }
  //   });
  //   const arr = converted.split(/<br\s*\/?>/i);
  //   this.setState({
  //     content: arr.reduce((el, a) => el.concat(a, <br />), [])
  //   });
  // }

  // componentWillReceiveProps(nextProps){
  //   const {sid} = nextProps;
  //   StatusService.getStatuDetail(sid).then(doc => {
  //     if (doc) {
  //       const likeCounts = doc.likeCount;
  //       const iflike1 = doc.iflike;
  //       this.setState({
  //         likeNumber: likeCounts,
  //         whetherLike: iflike1,
  //       });
  //     }
  //   });
  // }

  changeLike = (sid, whetherLike, likeNumber) => {
    if (whetherLike === 0) {
      this.setState({
        whetherLike: 1,
        likeNumber: likeNumber + 1
      });
      StatusService.changeLike(sid, 1);
    } else {
      this.setState({
        whetherLike: 0,
        likeNumber: likeNumber - 1
      });
      StatusService.changeLike(sid, 0);
    }
  };

  render() {
    const { whetherLike, likeNumber, sid, isPersonal, content } = this.state;
    const { username, time, commentCount, avatar, isFirstItem } = this.props;
    return (
      <div
        className={
          isPersonal
            ? "presonal-status"
            : isFirstItem
              ? "status-item-container status-firstItem-container"
              : "status-item-container"
        }
      >
        <div className="status-head">
          <Avatar
            className="status-item-img"
            src={avatar}
            width="60"
            height="60"
          />
          <div className="stauts-second">
            <div className="status-item-name overflowHiddenEllipsisTip">
              {username}
            </div>
            <div className="status-item-time overflowHiddenEllipsisTip">
              {time}
            </div>
          </div>
          <div>
            <div
              className={!isPersonal ? "open" : "open-person"}
              onClick={this.handleLink.bind(this)}
              onKeyDown={() => {}}
              role="presentation"
            >
              详情
            </div>
          </div>
        </div>
        <div
          className={
            isPersonal ? "status-personal-content" : "status-item-content"
          }
        >
          <div
            className={
              isPersonal
                ? "status-personal-link-content"
                : "status-item-link-content"
            }
            onClick={this.handleLink.bind(this)}
            onKeyDown={() => {}}
            role="presentation"
          >
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
        <div className="others">
          <ReactSVG
            className="status-item-good"
            onClick={() => this.changeLike(sid, whetherLike, likeNumber)}
            path={Goods[whetherLike]}
          />
          <div className="status-item-goodnumber">{likeNumber}</div>
          <div>
            <Link to={`/status/${sid}`}>
              <ReactSVG className="status-item-commet" path={comment} />
            </Link>
          </div>
          <div className="status-item-comments">{commentCount}</div>
        </div>
      </div>
    );
  }
}

Item.propTypes = {
  sid: PropTypes.number,
  username: PropTypes.string,
  time: PropTypes.string,
  avatar: PropTypes.string,
  content: PropTypes.string,
  iflike: PropTypes.number,
  likeCount: PropTypes.number,
  commentCount: PropTypes.number,
  isPersonal: PropTypes.number,
  match: PropTypes.shape({
    url: PropTypes.string
  }),
  isFirstItem: PropTypes.bool
};

Item.defaultProps = {
  sid: 0,
  username: "",
  time: "00:00",
  avatar: "",
  content: "",
  iflike: 0,
  likeCount: 0,
  commentCount: 0,
  isPersonal: 0,
  match: {
    url: "/status"
  },
  isFirstItem: false
};

export default Item;
