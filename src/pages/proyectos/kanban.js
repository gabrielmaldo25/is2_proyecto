import { borderRadius, margin } from '@mui/system';
import React, {useEffect, useState} from 'react';


export default function Kanban(user_stories) {

  // useEffect(() => {
  //   console.log(JSON.stringify(user_stories) + "holaaaaaaaaaaaaaaaaaaaaaaa");
  // }, [user_stories]);
   
    const style = {
      paddingTop: '25px',
      height: '400px',
      textAlign: 'center',
    };

    return (
      <div style={style}>
        {/* <h1>Project Kanban Board</h1> */}
        <KanbanBoard user_stories={user_stories}/>
      </div>
    );
}

/*
 * The Kanban Board React component
 */
class KanbanBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      user_stories: [],
      draggedOverCol: 0,
    };
    this.handleOnDragEnter = this.handleOnDragEnter.bind(this);
    this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
    this.columns = [
      // { name: 'Backlog', stage: 1 },
      { name: 'To Do', stage: 2 },
      { name: 'In Progress', stage: 3 },
      { name: 'Done', stage: 4 },
    ];
  }

  componentDidMount() {
    this.setState({ user_stories: this.props.user_stories.user_stories, isLoading: false });
  }

  //this is called when a Kanban card is dragged over a column (called by column)
  handleOnDragEnter(e, stageValue) {
    this.setState({ draggedOverCol: stageValue });
  }

  //this is called when a Kanban card dropped over a column (called by card)
  handleOnDragEnd(e, user_story) {
    const updatedProjects = this.state.user_stories.slice(0);
    updatedProjects.find((projectObject) => {
      console.log(projectObject.nombre + " linea 57")
      return projectObject.nombre === user_story.nombre;
    }).id_estado = this.state.draggedOverCol;
    this.setState({ user_stories: updatedProjects });
  }

  render() {
    const boardStyle = {
      paddingLeft: '5px',
    };

    if (this.state.isLoading) {
      return <h3>Loading...</h3>;
    }
    // console.log(JSON.stringify(this.props.user_stories.user_stories) + "KanbanBoard");
    return (
      <div>
        {this.columns.map((column) => {
          return (
            <KanbanColumn
              name={column.name}
              stage={column.stage}
              user_stories={this.state.user_stories.filter((user_story) => {
                return parseInt(user_story.id_estado, 10) === column.stage;
              })}
              onDragEnter={this.handleOnDragEnter}
              onDragEnd={this.handleOnDragEnd}
              key={column.stage}
            />
          );
        })}
      </div>
    );
  }
}

/*
 * The Kanban Board Column React component
 */
class KanbanColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mouseIsHovering: false };
  }

  componentWillReceiveProps(nextProps) {
    this.state = { mouseIsHovering: false };
  }

  generateKanbanCards() {
    return this.props.user_stories.slice(0).map((user_story) => {
      return <KanbanCard user_story={user_story} key={user_story.id_us} onDragEnd={this.props.onDragEnd} />;
    });
  }

  render() {
    const columnStyle = {
      display: 'inline-block',
      verticalAlign: 'top',
      marginRight: '15px',
      marginBottom: '5px',
      paddingLeft: '5px',
      paddingTop: '0px',
      width: '280px',
      textAlign: 'center',
      backgroundColor: this.state.mouseIsHovering ? '#d3d3d3' : '#f0eeee',
      borderRadius: '7px',
    };
    
    return (
      <div
        style={columnStyle}
        onDragEnter={(e) => {
          this.setState({ mouseIsHovering: true });
          this.props.onDragEnter(e, this.props.stage);
        }}
        onDragExit={(e) => {
          this.setState({ mouseIsHovering: false });
        }}
      >
        <h4 >
        <strong>
          {this.props.name} ({this.props.user_stories.length})
          </strong>
        </h4>
        {this.generateKanbanCards()}
        <br />
      </div>
    );
  }
}

/*
 * The Kanban Board Card component
 */
class KanbanCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };
  }

  render() {
    const cardStyle = {
      // backgroundColor: '#f9f7f7',
      backgroundColor: '#FFFFFF',
      paddingLeft: '0px',
      paddingTop: '5px',
      paddingBottom: '5px',
      // marginLeft: '0px',
      margin: '5px',
      // marginBottom: '5px',
      width: '260px',
      borderRadius: '7px',

    };

    return (
      <div
        style={cardStyle}
        draggable={true}
        onDragEnd={(e) => {
          this.props.onDragEnd(e, this.props.user_story);
        }}
      >
        <div style={{textAlign: 'start', paddingLeft: '8px'}}>
          <h4>{this.props.user_story.nombre}</h4>
        </div>
        {this.state.collapsed ? null : (
          <div style={{textAlign: 'start', margin: '5px',fontSize: '13px'}}>
            {/* <br /> */}
            <h4><strong>Descripción: </strong>
            {this.props.user_story.descripcion}
            <br />
            </h4>
          </div>
        )}
        <div
          style={{ width: '100%' }}
          onClick={(e) => {
            this.setState({ collapsed: !this.state.collapsed });
          }}
        >
          {this.state.collapsed ? String.fromCharCode('9660') : String.fromCharCode('9650')}
        </div>
      </div>
    );
  }
}

/*
 * Projects to be displayed on Kanban Board
 */
let projectList = [
  {
    name: 'Project 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
    project_stage: 1,
  },
  {
    name: 'Project 2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
    project_stage: 1,
  },
  {
    name: 'Project 3',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
    project_stage: 1,
  },
  {
    name: 'Project 4',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
    project_stage: 2,
  },
  {
    name: 'Project 5',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
    project_stage: 3,
  },
  {
    name: 'Project 6',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
    project_stage: 3,
  },
  {
    name: 'Project 7',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
    project_stage: 4,
  },
];

