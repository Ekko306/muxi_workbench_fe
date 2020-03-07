import React from "react";
// import PropTypes from "prop-types";
// import { withRouter } from "react-router";
// import ReactSVG from 'react-svg'
// import backIcon from 'assets/svg/commonIcon/back.svg'
import "static/css/common.scss";
import "./index.scss";

// const goBack = (href, history) => {
//   if (href) {
//     if (history.length > 1) {
//       history.goBack();
//     } else {
//       history.push(href);
//     }
//   } else {
//     history.goBack();
//   }
// };

// const GoBack = ({ href, history }) => (
//   <div
//     className="reArrow back-icon"
//     onClick={goBack.bind(this, href, history)}
//     onKeyDown={() => {}}
//     role="presentation"
//   />
// );

// GoBack.propTypes = {
//   href: PropTypes.string,
//   history: PropTypes.shape({
//     replace: PropTypes.func,
//     goBack: PropTypes.func
//   })
// };

// GoBack.defaultProps = {
//   href: "",
//   history: {}
// };

// export default withRouter(GoBack);

class GoBack extends React.Component {
  handleClick = () => {
    window.close();
  };

  render() {
    return (
      <div
        className="reArrow back-icon"
        onClick={this.handleClick}
        onKeyDown={() => {}}
        role="presentation"
      />
    );
  }
}

export default GoBack;
