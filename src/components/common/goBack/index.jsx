import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
// import ReactSVG from 'react-svg'
// import backIcon from 'assets/svg/commonIcon/back.svg'
import "static/css/common.scss";
import "./index.scss";

const goBack = (href, history, callback) => {
  if (callback) {
    callback();
  }
  if (href) {
    if (history.length > 1) {
      history.goBack();
    } else {
      history.push(href);
    }
  } else {
    history.goBack();
  }
};

const GoBack = ({ href, history, callback }) => (
  <div
    className="reArrow back-icon"
    onClick={goBack.bind(this, href, history, callback)}
    onKeyDown={() => {}}
    role="presentation"
  />
);

GoBack.propTypes = {
  href: PropTypes.string,
  history: PropTypes.shape({
    replace: PropTypes.func,
    goBack: PropTypes.func
  }),
  callback: PropTypes.func
};

GoBack.defaultProps = {
  href: "",
  history: {},
  callback: undefined
};

export default withRouter(GoBack);
