import React from "react";
import PropTypes from "prop-types";
import AvatarImg from "../../../../assets/img/avatar.png";
import Avatar from "../../../../components/common/avatar/index";
import "./index.css";

function feedItem(props) {
  const { timeHour, action, divider, dividerName } = props;
  return (
    <div className="feed-item">
      <div className="feed-divider">
        <div className={divider ? "line" : "no-line"} />
        <div className={divider ? "feed-project" : "feed-no-project"}>
          {divider ? dividerName : ""}
        </div>
      </div>
      <div className="feed-details">
        <div className="feed-time">{timeHour}</div>
        <div className="feed-item-img">
          <Avatar src={AvatarImg} width="60" height="60" />
        </div>
        <div className="feed-action">{action}</div>
      </div>
    </div>
  );
}

feedItem.propTypes = {
  // timeDay: PropTypes.string,
  timeHour: PropTypes.string,
  // avatarUrl: PropTypes.string,
  // uid: PropTypes.number,
  action: PropTypes.string,
  // kind: PropTypes.number,
  // sourceID: PropTypes.number,
  divider: PropTypes.bool,
  // dividerID: PropTypes.number,
  dividerName: PropTypes.string
};

feedItem.defaultProps = {
  // timeDay: "0000/00/00",
  timeHour: "00:00",
  // avatarUrl: " ",
  // uid: 0,
  action: " ",
  // kind: 0,
  // sourceID: 0,
  divider: 0,
  // dividerID: 0,
  dividerName: " "
};
export default feedItem;

// [{  time_d:年月日时间，
//     time_s:时分秒时间
//     avatar_url:头像图片，
//     uid:用户id,（number）
//     action:行为，
//     kind:类型，（number）
//     sourceID:对应类型的id，（number）
//     divider:是否分隔，(bool)
//     divider_id:分隔对应的id，（number）
//     divider_name:分隔对应的名字}]