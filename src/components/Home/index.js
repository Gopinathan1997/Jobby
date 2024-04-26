import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

const Home = props => {
  const onrenderFindJobs = () => {
    const {history} = props
    history.replace('/jobs')
  }
  return (
    <>
      <Header />
      <div className="home-background">
        <div className="content">
          <h1> Find The Job That Fits Your Life</h1>
          <p>
            Millions of people are searching for jobs, salary information,
            company reviews. Find the job that fits yourr ability and potential.
          </p>
          <Link to="/jobs">
            <button type="button">Find Jobs</button>
          </Link>
        </div>
      </div>
    </>
  )
}
export default Home
