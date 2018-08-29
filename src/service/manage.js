import Fetch from "./fetch";

const ManageService = {
  addGroup(groupName, selMembers) {
    return Fetch("/group/new/", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        groupName: groupName,
        userlist: selMembers
      })
    });
  },

  addMember(userID){
    return Fetch("/user/2bMember", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userID: userID
      })
    });
  },

  groupMember(groupID) {
    return Fetch(`/group/${groupID}/userList/`,{
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    })
  },

  getProMember(proID){
    return Fetch(`/group/${proID}/userList/`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      }
    });
  },

  updateGroupMember(groupID, userList){
    return Fetch(`/group/${groupID}/manageUser/`,{
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userList: userList
      })
    })
  },

  groupDelete(groupID){
    return Fetch(`/group/${groupID}`,{
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    })
  },

  getPersonalPro(){
    return Fetch("/user/project/list/",{
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "token": localStorage.user.token,
      },
    })
  },

  setManager(userID){
    return Fetch("/user/addAdmin/",{
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "token": localStorage.user.token,
      },
      body: JSON.stringify({
        luckydog: userID
      })
    })
  },

  memberDelete(userID){
    return Fetch(`/user/${userID}`,{
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    })
  },

  modifyMemGroup(userID, selMembers) {
    return Fetch(`/user/${userID}/manageGroup/`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        groupID: selMembers[0]
      })
    });
  },

  savePersonalSet(userID, obj) {
    return Fetch(`/user/${userID}/setting/`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: obj
    });
  },

  savePersonalPermiss(userID, selMembers) {
    return Fetch(`/user/${userID}/managePro/`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        projectList: selMembers
      })
    });
  },

  saveModifyMemberIdenty(userID, selIdentities) {
    return Fetch(`/user/${userID}/setRole`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        role: selIdentities[0]
      })
    });
  },

  saveModifyMemberPro(userID, selMembers) {
    return Fetch(`/user/${userID}/managePro/`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        projectList: selMembers
      })
    });
  }
};

export default ManageService;
