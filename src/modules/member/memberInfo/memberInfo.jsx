/*
团队成员页面组件
*/
import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Avatar from "../../../components/common/avatar/index";
import "../../../static/css/common.css";
import "./memberInfo.css";

const userLevelSet = {
  1: "普通用户",
  3: "管理员",
  7: "超级管理员"
};

const userGroup = group => {
  if (group == null) {
    return "NoneGroup";
  }
  return group;
};

const MemberInfo = ({ mem, square }) => (
  <div className="memberInfo-contain">
    <Link to="/member/teamMember/personalInfo">
      <div
        className="memberInfo-img"
        role="button"
        tabIndex="-1"
        onKeyDown={() => {}}
        onClick={() => {
          localStorage.per = mem.id;
          localStorage.perRole = mem.role;
        }}
      >
        <Avatar width={60} height={60} square={square} src={mem.avatar} />
      </div>
    </Link>
    <div className="memberInfo-personalIntro">
      <div className="memberInfo-mid">
        <div className="memberInfo-name">
          <div className="memberInfo-nameSize">{mem.name || mem.username}</div>
          <div className="memberInfo-role">{userLevelSet[mem.role]}</div>
        </div>
        <div className="memberInfo-group">
          <span className="memberInfo-littleGroup">{userGroup(mem.group)}</span>
        </div>
      </div>
    </div>
  </div>
);

export default MemberInfo;

MemberInfo.propTypes = {
  mem: PropTypes.shape({
    avatar: PropTypes.string,
    name: PropTypes.string,
    role: PropTypes.number,
    group: PropTypes.string,
    id: PropTypes.number
  }),
  square: PropTypes.bool
};

MemberInfo.defaultProps = {
  mem: {},
  square: true
};
