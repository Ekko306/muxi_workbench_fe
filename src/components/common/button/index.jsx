import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./index.scss";

const Button = ({
  width,
  height,
  text,
  to,
  onClick,
  bgColor,
  textColor,
  border,
  fontSize,
  disabled
}) => {
  const style =disabled ? {
    width: `${width}px`,
    height: `${height}px`,
    borderRadius: "4px",
    backgroundColor: "#f5f5f5",
    border: "1px solid",
    color: "rgba(0, 0, 0, 0.25)",
    "borderColor": "#d9d9d9"
  } : {
    width: `${width}px`,
    height: `${height}px`,
    borderRadius: "4px",
    backgroundColor: `${bgColor}`,
    border: `${border}`
  };

  const btText = {
    color: disabled ? "rgba(0, 0, 0, 0.25)"  : `${textColor}`,
    fontSize: `${fontSize}px`
  };
  return (
    <div style={style}>
      <div
        className={disabled ? "bt bt-disabled" : "bt"}
        onClick={disabled ? ()=>{} : onClick}
        onKeyDown={() => {}}
        role="presentation"
      >
        {to ? (
          <Link className="bt-text" style={btText} to={to}>
            {text}
          </Link>
        ) : (
          <div className="bt-text" style={btText}>
            {text}
          </div>
        )}
      </div>
    </div>
  );
};

Button.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  border: PropTypes.string,
  text: PropTypes.string,
  fontSize: PropTypes.string,
  to: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

Button.defaultProps = {
  width: "96",
  height: "40",
  bgColor: "RGBA(29, 76, 181, 1)",
  textColor: "RGBA(255, 255, 255, 1)",
  border: "none",
  fontSize: "16",
  text: "Button",
  to: "",
  onClick: ()=>{},
  disabled: false
};

export default Button;
