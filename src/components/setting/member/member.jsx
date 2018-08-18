/*
该组件用于选择成员，
自定义成员members:{name:'',selected:false}，
selMembers:[]存储已选择成员，
wrap用于标记是否换行，默认不换行，
dis用于标记是否单选，默认多选，
transferMsg = (mem, selMem) => {this.setState({members: mem,selMembers: selMem});}返回数据
*/

import React, { Component } from "react";
import "./member.css";
import "../../../static/css/common.css";

class Mem extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    let arr1 = this.props.members,
      arr2 = this.props.selMembers;

    arr1.map(item => {
      const index = arr2.indexOf(item);
      if (item.selected && index === -1) {
        arr2.push(item);
      }
    });

    this.props.transferMsg(arr1, arr2);
  }

  select(item) {
    let arr1 = this.props.members,
      arr2 = this.props.selMembers;

    item.selected = !item.selected;

    const index = arr2.indexOf(item);

    if (item.selected && index === -1) {
      arr2.push(item);
    } else if (!item.selected && index !== -1) {
      arr2.splice(index, 1);
    }

    this.props.transferMsg(arr1, arr2);
  }

  onlyOne(item) {
    let arr1 = this.props.members,
      arr2 = this.props.selMembers;
    if (arr2) {
      arr2.map(item => {
        item.selected = false;
      });
    }

    arr2 = [];
    item.selected = true;

    arr2.push(item);

    this.props.transferMsg(arr1, arr2);
  }

  render() {
    return (
      <div className="selectMem">
        {this.props.members.map((item, index) => (
          <div className={this.props.wrap ? "unit" : "unit nowrap"} key={index}>
            <input
              type="checkbox"
              checked={item.selected}
              onChange={
                this.props.dis
                  ? this.onlyOne.bind(this, item)
                  : this.select.bind(this, item)
              }
              id={`check${item.name}${index}`}
            />
            <label htmlFor={`check${item.name}${index}`} className="fontColor">
              {item.name}
            </label>
          </div>
        ))}
      </div>
    );
  }
}

export default Mem;
