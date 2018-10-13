import React, { Component } from "react";
import ProjectItem from "../components/itemIcon/index";
import Button from "../../../components/common/button";
import ProjectService from "../../../service/project";
import "./index.css";

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: []
    };
  }

  componentWillMount() {
    const userID = JSON.parse(localStorage.user).id
    ProjectService.getAllProjectList(userID)
      .then(res => {
        const project = res
          .map(el => el.list)
          .reduce((el1, el2) => el1.concat(el2), [])
          .map((el, index) => {
            const item = { id: el.projectID, name: el.projectName, index };
            return item;
          });
        this.setState({
          project
        });
      })
      .catch(res => {
        console.error("error", res);
      });
  }

  // componentDidMount() {
  //     //do something
  // }

  render() {
    const { project } = this.state;
    return (
      <div className="project">
        <div className="project-create-bt">
          <Button to="project/new" text="新建项目" />
        </div>
        <div className="projects-container">
          {project.map(el => (
            <div key={el.id} className="project-item">
              <ProjectItem index={el.index} name={el.name} id={el.id} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Index;
