import React, { useEffect, useState } from 'react';
const URI = 'http://localhost:5000/api/tasks'

function App() {
  const [taskState, setTaskState] = useState({
    _id: '',
    title: '',
    description: '',
    tasks: []
  });

  const addTask = async (e) => {
    e.preventDefault();
    if(taskState._id) {
      const fullUri = (URI + '/' + taskState._id);
      const response = await fetch(fullUri, {
        method: 'PUT',
        body: JSON.stringify(taskState),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      const jsonData = await response.json();
      console.log(jsonData);
    }
    else {
      const response = await fetch(URI, {
        method: 'POST',
        body: JSON.stringify(taskState),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const jsonData = await response.json();
      console.log(jsonData);
      alert(jsonData.status);
    }
    fetchTasks();
  };

  const fetchTasks = async() => {
    const response = await fetch(URI);
    const jsonData = await response.json();
    console.log(jsonData);
    setTaskState({
      ...taskState,
      tasks: jsonData.tasks,
      _id: null,
      title: '',
      description: ''
    });
  };

  const deleteTask = async(id) => {
    const userAccepted = window.confirm('Are you sure you want to remove it?');
    if(userAccepted) {
      const fullUri = (URI + '/' + id);
      console.log(fullUri);
      const response = await fetch(fullUri, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const jsonData = await response.json();
      console.log(jsonData);
      fetchTasks();
      alert(jsonData.status);
    }
  };

  const editTask = async(id) => {
    const fullUri = (URI + '/' + id);
    const response = await fetch(fullUri);
    const jsonData = await response.json();
    console.log(jsonData.task);

    setTaskState({
      ...taskState,
      _id: id,
      title: jsonData.task.title,
      description: jsonData.task.description
    });
  };

  const handleChange = (e) => {
    console.log(e.target.name);
    setTaskState({
      ...taskState,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App">
      {/* NAVIGATION */}
      <nav className="light-blue darken-4">
        <div className="container">
          <a className="brand-logo" href="/">
            MERN Stack
          </a>
        </div>
      </nav>

      <div className="container">
        <div className="row">
          <div className="col s5">
            <div className="card">
              <div className="card-content">
                <form onSubmit={(e) => addTask(e)}>
                  <div className="row">
                    <div className="input-field col s12">
                      <input name="title" value={taskState.title} onChange={(e) => handleChange(e)} type="text" placeholder="Task Title"/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field col s12">
                      <textarea name='description' value={taskState.description} onChange={(e) => handleChange(e)} className="materialize-textarea" type="text" placeholder="Type description"/>
                    </div>
                  </div>
                  <button type="submit" className="btn light-blue darken-4">
                    {taskState._id ? "Update" : "Submit"}
                  </button>
                  <p>{taskState._id}</p>
                </form>
              </div>
            </div>
          </div>
          <div className="col s7">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                { taskState.tasks ? 
                  (taskState.tasks.map((task) => {
                    return(
                      <tr key={task._id}>
                        <td>{task.title}</td>
                        <td>{task.description}</td>
                        <td>
                          <button onClick={() => editTask(task._id)} className='btn light-blue darken-4'>
                            <i className='material-icons'>edit</i>
                          </button>
                          <button onClick={() => deleteTask(task._id)} className='btn light-blue darken-4' style={{margin: '4px'}}>
                            <i className='material-icons'>delete</i>
                          </button>
                        </td>
                      </tr>
                    )
                  })) : null
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
