import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Avatar from "components/common/avatar/index";
import "./index.scss";

function dividerName(kind, proName, userName) {
  switch (kind) {
    case 1:
      return "成员";
    case 2:
      return `${proName}`;
    case 3:
      return `${proName}`;
    case 4:
      return `${proName}`;
    case 6:
      return `${userName}的进度`;
    default:
      return `/`;
  }
}
function changeWord(kind, action) {
  switch (kind) {
    case 1:
      return `${action}了团队`;
    case 2:
      return `${action}了项目：`;
    case 3:
      return `${action}了文档：`;
    case 4:
      return `${action}了文件：`;
    case 6:
      return `${action}了进度：`;
    default:
      return "";
  }
}
function findKind(kind, sourceID, sourcePro) {
  switch (kind) {
    case 1:
      return 0;
    case 2:
      return `/project/${sourcePro}/preview`;
    case 3:
      return `/project/${sourcePro}/doc/${sourceID}`;
    case 4:
      return `/project/${sourcePro}/file/${sourceID}`;
    case 6:
      return `/status/${sourceID}/`;
    default:
      return `/`;
  }
}

function findProject(kind, sourcePro, uid) {
  switch (kind) {
    case 1:
      return `/teamMember`;
    case 2:
      return `/project/${sourcePro}/preview`;
    case 3:
      return `/project/${sourcePro}/preview`;
    case 4:
      return `/project/${sourcePro}/preview`;
    case 6:
      return `/teamMember/personalInfo/${uid}/personalProgress`;
    default:
      return `/`;
  }
}

class feedItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      timeHour,
      action,
      uid,
      kind,
      ifSplit,
      avatarUrl,
      sourcePro,
      proName,
      userName,
      sourceName,
      sourceID
    } = this.props;
    return (
      <div className="feed-item">
        <div className="feed-divider">
          <div className={ifSplit ? "line" : "no-line"} />
          <Link
            to={`${findProject(kind, sourcePro, uid)}`}
            className={
              ifSplit
                ? "feed-project overflowHiddenEllipsisTip"
                : "feed-no-project"
            }
            title={ifSplit ? `${dividerName(kind, proName, userName)}` : ""}
            target={`${findProject(kind, sourcePro, uid)}`}
          >
            {ifSplit ? `${dividerName(kind, proName, userName)}` : ""}
          </Link>
        </div>
        <div className="feed-details">
          <div className="feed-time">{timeHour}</div>
          <div className="feed-item-img">
            <Avatar src={avatarUrl} width="60" height="60" />
          </div>
          <div className="feed-action">
            <div role="button" tabIndex="-1" onKeyDown={() => {}}>
              <Link
                to={`/teamMember/personalInfo/${uid}`}
                target={`/teamMember/personalInfo/${uid}`}
                className="overflowHiddenEllipsisTip link feedItem-linkUername"
                title={userName}
              >
                {userName}
              </Link>
            </div>
            <div className="feed-action-word">
              {`${changeWord(kind, action)}`}
            </div>
            <div>
              <Link
                to={`${findKind(kind, sourceID, sourcePro)}`}
                className="link overflowHiddenEllipsisTip"
                title={sourceName}
              >
                {sourceName}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

feedItem.propTypes = {
  timeHour: PropTypes.string,
  avatarUrl: PropTypes.string,
  action: PropTypes.string,
  uid: PropTypes.number,
  userName: PropTypes.string,
  kind: PropTypes.number,
  sourceID: PropTypes.number,
  sourcePro: PropTypes.number,
  sourceName: PropTypes.string,
  ifSplit: PropTypes.bool,
  proName: PropTypes.string
};

feedItem.defaultProps = {
  timeHour: "00:00:00",
  avatarUrl: " ",
  action: " ",
  uid: 0,
  userName: " ",
  kind: 0,
  sourceID: 0,
  sourcePro: -1,
  sourceName: " ",
  ifSplit: 0,
  proName: " "
};

export default feedItem;
