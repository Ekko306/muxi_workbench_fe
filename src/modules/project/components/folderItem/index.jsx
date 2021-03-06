import React, { Component } from "react";
import ReactSVG from "react-svg";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import FolderIcon from "assets/svg/fileIcon/folder.svg";
import "./index.scss";
import "static/css/common.scss";

class FolderItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false
    };
  }

  enter() {
    this.setState({
      hover: true
    });
  }

  leave() {
    this.setState({
      hover: false
    });
  }

  deleteFile() {
    const { folderItem, deleteFile, pid } = this.props;
    deleteFile(folderItem.id, "fileFolder", pid);
  }

  moveFile() {
    const { folderItem, moveFile, pid } = this.props;
    moveFile(folderItem.id, "fileFolder", pid);
  }

  render() {
    const { folderItem, pid } = this.props;
    const { hover } = this.state;
    return (
      <div
        className="fileIcon-container"
        onMouseEnter={this.enter.bind(this)}
        onMouseLeave={this.leave.bind(this)}
      >
        <Link
          className="fileIcon-content"
          to={`/project/${pid}/fileFolder/${folderItem.id}`}
        >
          <ReactSVG className="fileIcon-img" path={FolderIcon} />
          <div className="fileIcon-text">{folderItem.name}</div>
        </Link>
        {hover && (
          <div
            className="folderIcon-footer"
            onMouseLeave={this.leave.bind(this)}
          >
            <div
              onClick={this.moveFile.bind(this)}
              onKeyDown={() => {}}
              role="presentation"
            >
              移动
            </div>
            <div
              onClick={this.deleteFile.bind(this)}
              onKeyDown={() => {}}
              role="presentation"
            >
              删除
            </div>
          </div>
        )}
      </div>
    );
  }
}

FolderItem.propTypes = {
  folderItem: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }),
  pid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  moveFile: PropTypes.func,
  deleteFile: PropTypes.func
};

FolderItem.defaultProps = {
  folderItem: {
    name: "",
    id: 0
  },
  pid: "",
  moveFile: () => {},
  deleteFile: () => {}
};

export default FolderItem;
