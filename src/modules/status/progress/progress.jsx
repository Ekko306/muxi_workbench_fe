/* eslint-disable import/no-unresolved */
import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  getContainerHeight,
  getScrollHeight,
  getScrollTop
} from "common/scroll";
import { Store } from "store";
import Loading from "components/common/loading/index";
import Gotop from "components/common/toTop/top";
import StatusItem from "../components/basicCard/index";
import StatusService from "../../../service/status";
import "./progerss.scss";

class Progress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      page: 0,
      isPersonal: 0,
      statuList: [],
      loading: true
    };
    this.scroll = this.scroll.bind(this);
    this.getStatuList = this.getStatuList.bind(this);
  }

  // 返回给我总的条数，条数除以20=page

  componentDidMount() {
    this.getStatuList();
    const appContainer = document.querySelector(".app-container");
    if (appContainer) appContainer.addEventListener("scroll", this.scroll);
  }

  componentWillUnmount() {
    const appContainer = document.querySelector(".app-container");
    if (appContainer) appContainer.removeEventListener("scroll", this.scroll);
  }

  getStatuList() {
    const { pathUrl } = this.props;
    const { page } = this.state;
    if (pathUrl.path === "/status") {
      this.setState({ isPersonal: 0 });
      StatusService.getStatusList(page + 1)
        .then(status => {
          if (status) {
            const { statuList } = this.state;
            this.setState({
              count: status.count,
              page: status.page,
              statuList: statuList.concat(status.statuList),
              loading: false
            });
          }
        })
        .catch(error => {
          Store.dispatch({
            type: "substituteWrongInfo",
            payload: error
          });
        });
    } else {
      this.setState({ isPersonal: 1 });
      StatusService.getPersonalStatus(pathUrl.params.uid, page + 1)
        .then(status => {
          if (status) {
            const { statuList } = this.state;
            this.setState({
              count: status.count,
              page: status.page,
              statuList: statuList.concat(status.statuList),
              loading: false
            });
          }
        })
        .catch(error => {
          Store.dispatch({
            type: "substituteWrongInfo",
            payload: error
          });
        });
    }
  }

  scroll() {
    if (getScrollTop() + getContainerHeight() >= getScrollHeight()) {
      this.getStatuList();
    }
  }

  render() {
    const { statuList, isPersonal, count, page, loading } = this.state;
    return loading ? (
      isPersonal ? (
        <Loading />
      ) : (
        <Loading className="status-loading" />
      )
    ) : (
      <div>
        <div className={isPersonal ? "" : "status"}>
          <div className="statusContainer">
            {statuList.map((card, index) => (
              <div key={card.sid}>
                <StatusItem
                  sid={card.sid}
                  username={card.username}
                  avatar={card.avatar}
                  time={card.time}
                  iflike={card.iflike}
                  content={card.content}
                  likeCount={card.likeCount}
                  commentCount={card.commentCount}
                  isPersonal={isPersonal}
                  isFirstItem={!index}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="loadMore" onClick={this.getStatuList}>
          {count / 20 >= page ? "下拉加载更多..." : "最后一页啦"}
        </div>
        <Gotop />
      </div>
    );
  }
}

Progress.propTypes = {
  pathUrl: PropTypes.shape({
    url: PropTypes.string,
    params: PropTypes.shape({
      id: PropTypes.string
    })
  })
};

Progress.defaultProps = {
  pathUrl: {}
};

export default Progress;
