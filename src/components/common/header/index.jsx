import React, { Component } from "react";
import ReactSVG from "react-svg";
import { NavLink, Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import logo from "../../../assets/img/logo@2x.png";
import searchIcon from "../../../assets/svg/commonIcon/search.svg";
import Avatar from "../avatar/index";
import Inform from "./inform/index";
import "./index.scss";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInput: false
    };
    this.searchRef = React.createRef();
  }

  clickSearchIcon = () => {
    const that = this;
    this.setState({
      showInput: !that.state.showInput
    });
  };

  searchItem = () => {
    const { value } = this.searchRef.current;
    if (value !== "") {
      this.searchText = value;
      const url = `/search/${encodeURIComponent(
        encodeURIComponent(encodeURIComponent(this.searchText))
      )}`;
      const { history } = this.props;
      history.push(`${url}`);
    }
  };

  enterSearch = e => {
    if (e.keyCode === 13) {
      this.searchItem();
      const that = this;
      this.setState({
        showInput: !that.state.showInput
      });
    }
  };

  render() {
    const { showInput } = this.state;
    const { storeAvatar, storeId, storeRole } = this.props;

    return (
      <div className="header-container" id="header-contenter">
        <div className="header-content">
          <div className="header-left">
            <NavLink to="/project" className="home-link">
              <img className="header-logo-img" src={logo} alt="logo" />
              <div className="header-logo-text">木犀工作台</div>
            </NavLink>
            <div className="header-tab-container">
              <NavLink
                to="/project"
                className="header-tab-item"
                activeClassName="header-tab-item-active"
              >
                项目
              </NavLink>
              <NavLink
                to="/status"
                className="header-tab-item"
                activeClassName="header-tab-item-active"
              >
                进度
              </NavLink>
              <NavLink
                to="/feed"
                className="header-tab-item"
                activeClassName="header-tab-item-active"
              >
                动态
              </NavLink>
              <NavLink
                to="/teamMember"
                className="header-tab-item"
                activeClassName="header-tab-item-active"
              >
                成员
              </NavLink>
            </div>
          </div>
          <div className="header-right">
            <div>
              <NavLink to="/edit" className="header-write-progress">
                写进度
              </NavLink>
            </div>
            <Link
              className="header-avatar"
              to={{
                pathname: `/teamMember/personalInfo/${storeId}`,
                state: { uRole: storeRole }
              }}
            >
              <Avatar src={storeAvatar} />
            </Link>

            <Inform />

            {showInput && (
              <input
                className="header-search-input"
                ref={this.searchRef}
                onKeyUp={this.enterSearch}
                type="text"
                // autoFocus
              />
            )}
            <div
              onClick={this.clickSearchIcon.bind(this)}
              onKeyDown={() => {}}
              role="presentation"
            >
              <ReactSVG
                className="header-search-icon"
                path={searchIcon}
                svgStyle={{ width: 22 }}
              />
            </div>
            <div className="Android">
              {/* eslint-disable-next-line react/jsx-no-target-blank */}
              <a
                className="Android-link"
                href="http://beta.muxixyz.com/MuxiWorkbench"
                target="_blank"
              >
                下载安卓版
              </a>
              <div className="Android-inform header-info-container">
                <div className="header-info-arrow" />
                <div className="header-info" style={{ minHeight: "auto" }}>
                  <img
                    className="Android-img"
                    alt="Android"
                    src="http://ossworkbench.muxixyz.com/1603767084.5878322.Android.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Header.propTypes = {
  history: PropTypes.shape({}),
  storeAvatar: PropTypes.string,
  storeId: PropTypes.number,
  storeRole: PropTypes.number
};
Header.defaultProps = {
  history: {},
  storeAvatar: "",
  storeId: 0,
  storeRole: 1
};

const mapStateToProps = state => ({
  storeAvatar: state.avatar,
  storeId: state.id,
  storeRole: state.role
});

export default withRouter(connect(mapStateToProps)(Header));
