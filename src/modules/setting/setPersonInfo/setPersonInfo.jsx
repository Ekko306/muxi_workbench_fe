/*
个人设置页面组件
*/
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import GoBack from "components/common/goBack/index";
import ManageService from "service/manage";
import Loading from "components/common/loading/index";
import { Store } from "store";
import Member from "../components/member/member";
import Delete from "../components/delete/delete";
import Save from "../components/save/save";
import "static/css/common.scss";
import "./setPersonInfo.scss";

class SetPersonalInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selMembers: [],
      members: [],
      selIdentities: [],
      identity: [
        { name: "管理员", selected: false, id: 3 },
        { name: "成员", selected: false, id: 1 }
      ],
      ifSave: false,
      deleteX: false,
      deled: false,
      loading: true
    };
  }

  componentDidMount() {
    const { identity, selIdentities } = this.state;
    const {
      storeId,
      location: {
        state: { uid, uRole }
      }
    } = this.props;

    ManageService.getPersonalPro(storeId)
      .then(project => {
        if (project) {
          const proList = project.list.map(item => {
            const obj = {};

            obj.id = item.projectID;
            obj.name = item.projectName;
            obj.count = item.userCount;
            obj.intro = item.intro;
            obj.selected = false;

            return obj;
          });

          ManageService.getPersonalPro(uid)
            .then(pro => {
              let idList = [];

              if (pro) {
                idList = pro.list.map(item => item.projectID);

                proList.map(item1 => {
                  const item = item1;

                  if (idList.indexOf(item.id) !== -1) item.selected = true;

                  return item;
                });
              }

              identity[0].selected = false;
              identity[1].selected = true;
              selIdentities[0] = 1;
              if (parseInt(uRole, 10) > 1) {
                identity[0].selected = true;
                identity[1].selected = false;
                selIdentities[0] = parseInt(uRole, 10);
              }
              this.setState({
                members: proList,
                selMembers: idList,
                identity,
                selIdentities,
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
      })
      .catch(error => {
        Store.dispatch({
          type: "substituteWrongInfo",
          payload: error
        });
      });
  }

  transferMsgIden = (mem, selMem) => {
    this.setState({
      identity: mem,
      selIdentities: selMem
    });
  };

  transferMsgDel = (deleteX, deled) => {
    this.setState({
      deleteX,
      deled
    });
  };

  transferMsgMem = (members, selMembers) => {
    this.setState({
      members,
      selMembers: selMembers || []
    });
  };

  selAll = () => {
    this.setState(prevState => {
      const { members: arr1 } = prevState;
      const arr2 = [];
      let num = 0;

      if (arr1) {
        arr1.map(i => {
          if (i.selected) num += 1;
          return i;
        });

        if (num === arr1.length) {
          arr1.map(i => {
            const j = i;
            j.selected = false;
            return j;
          });
        } else {
          arr1.map(i => {
            const j = i;
            j.selected = true;
            arr2.push(j.id);
            return j;
          });
        }
      }

      return { members: arr1, selMembers: arr2 };
    });
  };

  saveModifyMember = () => {
    const { selIdentities, selMembers } = this.state;
    const {
      location: {
        state: { uid }
      }
    } = this.props;

    ManageService.saveModifyMemberIdenty(uid, selIdentities).catch(error => {
      Store.dispatch({
        type: "substituteWrongInfo",
        payload: error
      });
    });

    if (Store.getState().wrongInfo.length !== 0) {
      return;
    }

    ManageService.saveModifyMemberPro(uid, selMembers)
      .then(() => {
        this.setState({ ifSave: true });

        setTimeout(() => {
          this.setState({ ifSave: false });
          window.history.back();
        }, 1000);
      })
      .catch(error => {
        Store.dispatch({
          type: "substituteWrongInfo",
          payload: error
        });
      });
  };

  pathJump = () => {
    const { history } = this.props;

    this.transferMsgDel(false, false);
    history.push(`/teamMember`);
  };

  render() {
    const {
      identity,
      selIdentities,
      members,
      selMembers,
      ifSave,
      deleteX,
      deled,
      loading
    } = this.state;
    const {
      match: {
        params: { name }
      },
      location: {
        state: { uid }
      }
    } = this.props;

    return (
      <div className="selectMember-container">
        {loading ? (
          <Loading />
        ) : (
          <div>
            <GoBack />
            <b className="title">
              {name}
              的设置
            </b>

            <div className="present">
              <div className="move">
                <p className="selectMember-fontColor llSize">从团队中移除XXA</p>
                <p className="selectMember-fontSize tip">
                  被移除的成员将不能再访问工作台上的信息，但工作台上与他相关的信息将保留。
                </p>
              </div>
              <button
                type="button"
                className="moveBtn selectMember-btnMArg"
                onClick={() => {
                  this.transferMsgDel(true);
                }}
              >
                确认移除
              </button>
              <br />

              <b className="littleSize title selectMember-titleMarg">设置</b>
              <Member
                members={identity}
                selMembers={selIdentities}
                transferMsg={this.transferMsgIden}
                dis
              />

              <b className="littleSize title selectMember-titleMarg">
                参与的项目
              </b>
              <span
                className="fakeBtn"
                onClick={this.selAll}
                onKeyDown={this.handleClick}
                role="button"
                tabIndex="-1"
              >
                全选
              </span>
              <Member
                members={members}
                selMembers={selMembers}
                transferMsg={this.transferMsgMem}
              />

              <button
                type="button"
                className="footerBtn saveBtn"
                onClick={this.saveModifyMember}
              >
                {ifSave ? "已保存" : "保存设置"}
              </button>

              <Save ifSave={ifSave} />

              <Delete
                name={`确认要移除${name}吗?`}
                deleteX={deleteX}
                transferMsg={this.transferMsgDel}
                memDel
                userId={parseInt(uid, 10)}
                certain
              />
              <Delete
                name="移除成功"
                cancel
                pathJump
                deleteX={deled}
                transferMsg={this.pathJump}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

SetPersonalInfo.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string
    })
  }),
  location: PropTypes.shape({
    state: PropTypes.shape({
      uid: PropTypes.string,
      uRole: PropTypes.number
    })
  }),
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  storeId: PropTypes.number
};

SetPersonalInfo.defaultProps = {
  match: {},
  location: {},
  history: {},
  storeId: 0
};

const mapStateToProps = state => ({
  storeId: state.id
});

export default connect(mapStateToProps)(SetPersonalInfo);
