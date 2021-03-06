/*
成员分组页面组件
传入{id, group}
*/
import React, { Component } from "react";
import PropTypes from "prop-types";
import GoBack from "components/common/goBack/index";
import ManageService from "service/manage";
import Loading from "components/common/loading/index";
import { Store } from "store";
import Member from "../components/member/member";
import "static/css/common.css";
import "./memberGroup.css";

class MemberGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selMembers: [],
      members: [],
      loading: true
    };
  }

  componentDidMount() {
    ManageService.getAllGroup()
      .then(arr => {
        const {
          match: {
            params: {
              per: { group }
            }
          }
        } = this.props;

        arr.map(item1 => {
          const item = item1;

          if (item.id === group) {
            item.selected = true;
          }

          return item;
        });

        const array = [];
        array.push(group);

        this.setState({
          members: arr,
          selMembers: array,
          loading: false
        });
      })
      .catch(error => {
        Store.dispatch({
          type: "substituteWrongInfo",
          payload: error
        });
      });
  }

  transferMsgMem = (members, selMembers) => {
    this.setState({
      members,
      selMembers: selMembers || []
    });
  };

  modifyMemGroup = () => {
    const {
      match: {
        params: {
          per: { id }
        }
      }
    } = this.props;
    const { selMembers } = this.state;

    ManageService.modifyMemGroup(id, selMembers).catch(error => {
      Store.dispatch({
        type: "substituteWrongInfo",
        payload: error
      });
    });
  };

  render() {
    const { selMembers, members, loading } = this.state;

    return (
      <div>
        {loading ? (
          <Loading />
        ) : (
          <div>
            <GoBack />
            <b className="title">选择成员分组</b>
            <div className="present memberGroup-preMarg">
              <span className="memberGroup-tip tip">请选择该成员所属分组</span>
              <Member
                members={members}
                selMembers={selMembers}
                transferMsg={this.transferMsgMem}
                dis
              />
            </div>
            <button
              type="button"
              className="saveBtn memberGroup-btnMarg"
              onClick={this.modifyMemGroup}
            >
              下一步
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default MemberGroup;

MemberGroup.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      per: PropTypes.shape({
        id: PropTypes.number,
        group: PropTypes.number
      })
    })
  })
};

MemberGroup.defaultProps = {
  match: {}
};
