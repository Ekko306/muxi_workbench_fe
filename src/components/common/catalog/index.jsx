import React from "react";
import "./index.scss";
import PropTypes from "prop-types";

class Catalog extends React.Component {
  scrollHandler = this.bindHandleScroll.bind(this);

  constructor(props) {
    super(props);
    this.state = {
      isUnder: false
    };
  }

  componentDidMount() {
    const content = document.getElementById("app-container");
    content.addEventListener("scroll", this.bindHandleScroll.bind(this));
  }

  componentWillUnmount() {
    const content = document.getElementById("app-container");
    content.removeEventListener("scroll", this.bindHandleScroll.bind(this));
  }

  bindHandleScroll(event) {
    // 滚动的高度(兼容多种浏览器)
    const scrollT = event.srcElement.scrollTop;
    const head = document.getElementById("header-contenter");
    const catalog = document.getElementById("catalog");
    if (scrollT > 10) {
      this.setState({
        isUnder: true
      });
      if (catalog) head.style.display = "none";
    }
    if (scrollT < 10) {
      this.setState({
        isUnder: false
      });
      head.style.display = "block";
    }
  }

  render() {
    const { table } = this.props;
    const { isUnder } = this.state;
    return (
      <div className={isUnder ? `trans-pos parent` : `parent`} id="catalog">
        <div className="title1"> 目录 </div>
        {table.map(({ hash, x, hashcopy }, index) => (
          <div key={index} className="blog-table-item">
            <a href={`#${hashcopy}`} onClick={e => this.bindHandleScroll(e)}>
              <div className={`content blog-table-item-${x}`}>{hash}</div>
            </a>
          </div>
        ))}
      </div>
    );
  }
}

Catalog.propTypes = {
  table: PropTypes.array.isRequired
};
export default Catalog;
