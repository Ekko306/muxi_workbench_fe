/*
    搜索
*/
import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Select from "../../components/common/select/index";
import Button from "../../components/common/button/index";
import WrongPage from "../../components/common/wrongPage/wrongPage";
import SearchItem from "./item/index";
import ProjectService from "../../service/project";
import SearchService from "../../service/search";
import "../../static/css/common.css";
import "./index.css";

class Search extends Component {
  constructor(props) {
    super(props);
    this.changeProject = this.changeProject.bind(this);
    this.searching = this.searching.bind(this);
    this.enterSearch = this.enterSearch.bind(this);
    this.changSearchText = this.changSearchText.bind(this);
    this.encode = window.location.href.split("/").pop(); // 编码后的url
    this.uncode = decodeURIComponent(decodeURIComponent(this.encode)); // 解码后的url
    this.cancel = this.cancel.bind(this);
    this.state = {
      projectOption: [],
      projectCheckedIndex: 0,
      searchResult: {
        count: 0,
        pageMax: 0,
        pageNow: 0,
        hasNext: true,
        list: []
      },
      filterList: [],
      encodeText: this.encode,
      searchText: this.uncode
    };
  }

  componentDidMount() {
    const { projectOption } = this.state;
    ProjectService.getProjectList(1)
      .then(res => {
        // console.log(res.list);
        const projectList = res.list;
        const arr = projectList.map(el => {
          const el1 = { id: 0, value: "" };
          el1.id = el.projectID;
          el1.value = el.projectName;
          return el1;
        });
        arr.unshift({ id: 0, value: "所有项目" });
        this.setState({
          projectOption: projectOption.concat(arr)
        });
      })
      .then(() => {
        this.searching();
      })
      .catch(error => {
        this.setState({ wrong: error });
      });
  }

  componentWillReceiveProps(nextProps) {
    const { location } = nextProps;
    const newSearch = location.pathname.split("/").pop();
    if (this.encode !== newSearch) {
      this.uncode = decodeURIComponent(decodeURIComponent(newSearch));
      this.setState(
        {
          encodeText: newSearch,
          searchText: this.uncode
        },
        () => {
          this.searching();
        }
      );
    }
  }

  cancel() {
    this.setState({ wrong: "" });
  }

  changeProject(index) {
    const { projectOption, searchResult } = this.state;
    this.setState({
      projectCheckedIndex: index
    });
    // console.log(searchResult);
    const result = searchResult.list.filter(item => {
      if (index) {
        return item.projectID === projectOption[index].id;
      }
      return true;
    });
    this.setState({
      filterList: result
    });
  }

  searching() {
    const {
      encodeText,
      searchText,
      projectOption,
      projectCheckedIndex
    } = this.state;
    const pid = projectOption[projectCheckedIndex].id;
    SearchService.getSearchResults(1, searchText, pid)
      .then(res => {
        this.setState({
          searchResult: res,
          filterList: res.list
        });
        // console.log(res.list);
      })
      .catch(error => {
        this.setState({ wrong: error });
      });
    window.history.pushState(this.state, "", `${encodeText}`);
  }

  enterSearch(e) {
    if (e.keyCode === 13) {
      this.searching();
    }
  }

  changSearchText(event) {
    const encode = encodeURIComponent(encodeURIComponent(event.target.value));
    this.setState({
      encodeText: encode,
      searchText: event.target.value
    });
  }

  render() {
    const {
      projectOption,
      projectCheckedIndex,
      filterList,
      searchText,
      wrong
    } = this.state;
    return (
      <div className="subject">
        <div className="search-container">
          <div className="search-header">
            <div className="search-select">
              <Select
                items={projectOption}
                checkedIndex={projectCheckedIndex}
                onChange={this.changeProject}
              />
            </div>
            <input
              type="text"
              className="search-input"
              placeholder=""
              onKeyUp={this.enterSearch}
              onChange={this.changSearchText}
              value={searchText}
            />
            <div className="search-but">
              <Button
                text="搜索"
                onClick={this.searching}
                width="65"
                height="32"
                fontSize="14"
              />
            </div>
          </div>
          <div className="search-results">
            {filterList.length ? (
              filterList.map(el => (
                <div className="search-item" key={el.sourceID}>
                  <div className="search-item-kind">
                    {el.kind === 0 ? "文档：" : "文件："}
                  </div>
                  <SearchItem item={el} />
                  <div className="search-item-footer">
                    <div className="search-item-project">
                      项目：
                      <Link to={`/project/${el.projectID}/preview`}>
                        {el.projectName}
                      </Link>
                    </div>
                    <span className="search-item-date">{el.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="search-item-none">没有找到相关内容！</div>
            )}
          </div>
        </div>
        <WrongPage info={wrong} cancel={this.cancel} />
      </div>
    );
  }
}
Search.propTypes = {
  location: PropTypes.shape({})
};
Search.defaultProps = {
  location: {}
};
export default Search;
