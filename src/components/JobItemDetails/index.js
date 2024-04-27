import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const apiStatusConstant = {
  initial: 'INITAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    similarJobs: [],
    jobDetail: [],
    skillsList: [],
    apiStatus: apiStatusConstant.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  renderLodingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstant.inProgress})
    const url = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const updatedData = {
        id: data.job_details.id,
        companyLogoUrl: data.job_details.company_logo_url,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        companyWebsiteUrl: data.job_details.company_website_url,
        location: data.job_details.location,
        rating: data.job_details.rating,
        title: data.job_details.title,
        packagePerAnnum: data.job_details.package_per_annum,
        lifeDescription: data.job_details.life_at_company.description,
        lifeImageUrl: data.job_details.life_at_company.image_url,
      }

      const skillsList = data.job_details.skills.map(eachSkill => ({
        skillImage: eachSkill.image_url,
        name: eachSkill.name,
      }))

      const similarJobs = data.similar_jobs.map(eachSim => ({
        id: eachSim.id,
        companyLogoUrl: eachSim.company_logo_url,
        employmentType: eachSim.employment_type,
        jobDescription: eachSim.job_description,
        location: eachSim.location,
        rating: eachSim.rating,
        title: eachSim.title,
      }))
      this.setState({
        similarJobs,
        skillsList,
        jobDetail: updatedData,
        apiStatus: apiStatusConstant.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstant.failure})
    }
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>

      <button onClick={this.renderJobsDetails} type="button">
        Retry
      </button>
    </div>
  )

  renderCondition = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstant.success:
        return this.renderSuccessView()
      case apiStatusConstant.failure:
        return this.renderFailureView()
      case apiStatusConstant.inProgress:
        return this.renderLodingView()
      default:
        return null
    }
  }

  renderSuccessView = () => {
    const {jobDetail, skillsList, similarJobs} = this.state

    const {
      title,
      jobDescription,
      rating,
      companyLogoUrl,
      location,
      packagePerAnnum,
      employmentType,
      lifeImageUrl,
      companyWebsiteUrl,
      lifeDescription,
    } = jobDetail
    console.log(jobDetail)
    return (
      <div className="jobdetail-bg">
        <div className="details-container">
          <div className="title-container">
            <img
              src={companyLogoUrl}
              className="company-logo"
              alt="job details company logo"
            />
            <div className="columna">
              <h1>{title}</h1>
              <div>{rating}</div>
            </div>
          </div>
          <div className="rowb">
            <div className="row">
              <p>{location}</p>
              <p>{employmentType}</p>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr />
          <h1>Description</h1>{' '}
          <a href={companyWebsiteUrl} className="visit-heading">
            Visit
          </a>
          <p>{jobDescription}</p>
          <br />
          <h1>Skills</h1>
          <ul className="skill">
            {skillsList.map(each => (
              <li key={each.name}>
                <img alt={each.name} src={each.skillImage} />
                <p>{each.name}</p>
              </li>
            ))}
          </ul>
          <h1>Life at Company</h1>
          <div className="row">
            <p>{lifeDescription}</p>
            <img
              className="life-image"
              src={lifeImageUrl}
              alt="life at company"
            />
          </div>
        </div>

        <h1>Similar Jobs</h1>
        <ul className="skill">
          {similarJobs.map(each => (
            <li className="simJobs" key={each.id}>
              <div className="title-container">
                <img
                  src={each.companyLogoUrl}
                  className="company-logo"
                  alt="similar job company logo"
                />
                <div className="columna">
                  <h1>{each.title}</h1>
                  <p>{each.rating}</p>
                </div>
              </div>
              <div className="rowb">
                <div className="row">
                  <p>{each.location}</p>
                  <p>{each.employmentType}</p>
                </div>
                <p>{each.packagePerAnnum}</p>
              </div>
              <hr />
              <h1>Description</h1>
              <p>{each.jobDescription}</p>
              <br />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    return (
      <>
        <Header />
        {this.renderCondition()}
      </>
    )
  }
}
export default JobItemDetails
