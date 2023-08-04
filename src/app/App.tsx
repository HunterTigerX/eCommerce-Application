import React, { useState, useEffect } from 'react';
import { getApiRoot, projectKey } from '../lib'

import './styles/App.css'

function App() {
  const [projectDetails, setProjectDetails] = useState({})

  const getProject = async () => {
    try {
      const project = await getApiRoot()
        .withProjectKey({ projectKey })
        // .products()
        // .get()
        // .execute();

        .customers()
        .get()
        .execute()

      setProjectDetails(project.body);
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getProject()
  }, [])

  return (
    <>
      <div>Project Details</div>
      {JSON.stringify(projectDetails, undefined, 2)}
    </>
  )
}

export default App