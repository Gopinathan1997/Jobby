import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const locationList = [
  {
    label: 'Chennai',
    locationId: 'CHENNAI',
  },
  {
    label: 'Bangalore',
    locationId: 'BANGALORE',
  },
  {
    label: 'Delhi',
    locationId: 'DELHI',
  },
  {
    label: 'Mumbai',
    locationId: 'MUMBAI',
  },
  {
    label: 'Hyderabad',
    locationId: 'HYDERABAD',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]
const apiConstantStatus = {
  initial: 'INITAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}
class Jobs extends Component {
  state = {
    profileLoading: apiConstantStatus.initial,
    profileData: [],
    salary: '',
    location: [],
    employmentType: [],
    searchInput: '',

    apiStatus: apiConstantStatus.initial,
    jobsList: [],
  }

  componentDidMount() {
    this.getProfile()
    this.renderJobsDetails()
  }

  getProfile = async () => {
    this.setState({profileLoading: apiConstantStatus.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok) {
      const profiledata = await response.json()

      const updatedProfile = {
        name: profiledata.profile_details.name,
        profileImageUrl: profiledata.profile_details.profile_image_url,
        shortBio: profiledata.profile_details.short_bio,
      }
      this.setState({
        profileLoading: apiConstantStatus.success,
        profileData: updatedProfile,
      })
    } else {
      this.setState({profileLoading: apiConstantStatus.failure})
    }
  }

  renderProfile = () => {
    const {profileData} = this.state
    return (
      <div className="profile">
        <img
          className="profile-pic"
          alt="profile"
          src={profileData.profileImageUrl}
        />
        <h1 className="username">{profileData.name}</h1>
        <p className="bio">{profileData.shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <button type="button" onClick={this.getProfile}>
      Retry
    </button>
  )

  renderProfileCondition = () => {
    const {profileLoading} = this.state
    switch (profileLoading) {
      case apiConstantStatus.success:
        return this.renderProfile()
      case apiConstantStatus.failure:
        return this.renderProfileFailureView()
      case apiConstantStatus.inProgress:
        return this.renderLodingView()
      default:
        return null
    }
  }

  renderLodingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  updateEmploymentType = event => {
    const {value, checked} = event.target
    if (checked) {
      this.setState(
        prev => ({employmentType: [...prev.employmentType, value]}),
        this.renderJobsDetails,
      )
    } else {
      const {employmentType} = this.state
      const filteredList = employmentType.filter(each => each !== value)

      this.setState({employmentType: filteredList}, this.renderJobsDetails)
    }
  }

  updateLocation = event => {
    const {value, checked} = event.target
    console.log(value)
    if (checked) {
      this.setState(
        prev => ({location: [...prev.location, value]}),
        this.renderJobsDetails,
      )
    } else {
      const {location} = this.state
      const filteredList = location.filter(each => each !== value)

      this.setState({location: filteredList}, this.renderJobsDetails)
    }
  }

  renderTypeOfLocation = () => (
    <div>
      <h1>Types of Location</h1>
      <ul className="list-employment">
        {locationList.map(eachType => (
          <li onChange={this.updateLocation} key={eachType.locationId}>
            <input
              type="checkbox"
              value={eachType.locationId}
              id={eachType.locationId}
            />
            <label htmlFor={eachType.locationId}>{eachType.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderTypeOfEmployment = () => (
    <div>
      <h1>Types of Employment</h1>
      <ul className="list-employment">
        {employmentTypesList.map(eachType => (
          <li
            onChange={this.updateEmploymentType}
            key={eachType.employmentTypeId}
          >
            <input
              type="checkbox"
              value={eachType.employmentTypeId}
              id={eachType.employmentTypeId}
            />
            <label htmlFor={eachType.employmentTypeId}>{eachType.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  updateSalary = event => {
    this.setState({salary: event.target.value}, this.renderJobsDetails)
  }

  renderSalaryRangesList = () => (
    <div>
      <h1>Salary Range</h1>
      <ul className="list-employment">
        {salaryRangesList.map(eachSalary => (
          <li
            className="column"
            onChange={this.updateSalary}
            key={eachSalary.salaryRangeId}
          >
            <input
              id={eachSalary.salaryRangeId}
              name="salary"
              value={eachSalary.salaryRangeId}
              type="radio"
            />
            <label htmlFor={eachSalary.salaryRangeId}>{eachSalary.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderJobsDetails = async () => {
    this.setState({apiStatus: apiConstantStatus.inProgress})
    const {salary, employmentType, searchInput, location} = this.state
    console.log(location)
    const empInput = employmentType.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${empInput}&minimum_package=${salary}&location=${location}&search=${searchInput}`
    console.log(
      `https://apis.ccbp.in/jobs?employment_type=${empInput}&minimum_package=${salary}&search=${searchInput}`,
    )
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
      const updatedData = data.jobs.map(each => ({
        id: each.id,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        apiStatus: apiConstantStatus.success,
        jobsList: updatedData,
      })
    } else {
      this.setState({apiStatus: apiConstantStatus.failure})
    }
  }

  updateSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  renderJobsList = () => {
    const {jobsList} = this.state
    const renderJobsList = jobsList.length > 0

    return renderJobsList ? (
      <ul className="each-jobs">
        {jobsList.map(eachJobs => (
          <li key={eachJobs.id} className="each-job">
            <Link to={`/jobs/${eachJobs.id}`}>
              <div className="title-container">
                <img
                  src={eachJobs.companyLogoUrl}
                  className="company-logo"
                  alt="company logo"
                />
                <div className="columna">
                  <h1>{eachJobs.title}</h1>
                  <p>{eachJobs.rating}</p>
                </div>
              </div>
              <div className="rowb">
                <div className="row">
                  <p>{eachJobs.location}</p>
                  <br />
                  <p>{eachJobs.employmentType}</p>
                </div>
                <p>{eachJobs.packagePerAnnum}</p>
              </div>
              <hr />
              <h1>Description</h1>
              <p>{eachJobs.jobDescription}</p>
            </Link>
          </li>
        ))}
      </ul>
    ) : (
      <div className="no-jobs-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-jobs-img"
          alt="no jobs"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seems to find the page you are looking for</p>
      <Link to="/jobs">
        <button type="button" onClick={this.renderJobsDetails}>
          Retry
        </button>
      </Link>
    </div>
  )

  renderCondition = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstantStatus.success:
        return this.renderJobsList()
      case apiConstantStatus.failure:
        return this.renderFailureView()
      case apiConstantStatus.inProgress:
        return this.renderLodingView()
      default:
        return null
    }
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.renderJobsDetails()
    }
  }

  render() {
    const {apiStatus} = this.state
    return (
      <>
        <Header />
        <div className="jobs-background">
          <div className="index-container">
            <div className="profile-container">
              {this.renderProfileCondition()}
            </div>
            <br />
            <hr />
            {this.renderTypeOfEmployment()}
            <hr />
            {this.renderSalaryRangesList()}
            <hr />
            {this.renderTypeOfLocation()}
          </div>
          <div className="content-container">
            <div className="search-container">
              <input
                onChange={this.updateSearchInput}
                placeholder="Search"
                type="search"
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                aria-label="button"
                onClick={this.renderJobsDetails}
                type="button"
                className="searchButton"
                data-testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {apiStatus === apiConstantStatus.inProgress
              ? this.renderLodingView()
              : this.renderCondition()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
