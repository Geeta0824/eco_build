import React, {useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {KTSVG} from '../../../_Ecd/helpers'
import {
  deleteCareerDetails,
  deleteCareerRequestDtls,
  getCareerList,
  getCareerListWithCareerReqCount,
  getCareerRequestListByCareerID,
  getCareerUpdateIsActive,
} from '../../modules/career-master-page/CareerCRUD'
import {toast} from 'react-toastify'
import {ModelPopUpIsActive} from '../common-pages/ModelPopUpIsActive'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'
import {Button, Modal} from 'react-bootstrap-v5'
import {ModelPopUp_ShowImage} from '../../../components/modal-popup/ModelPopUp_ShowImage'

const CareerList = () => {
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [careerData, setCareerData] = useState([])
  const [filteredCareers, setFilteredCareers] = useState([])
  const history = useHistory()
  useEffect(() => {
    getCareerDataList()
  }, [])

  useEffect(() => {
    const filtered = careerData.filter((b) => {
      const term = searchText.toLowerCase()
      return (
        b.jobTitle?.toLowerCase().includes(term) ||
        b.jobLocation?.toLowerCase().includes(term) ||
        b.description?.toLowerCase().includes(term) ||
        b.experience?.toLowerCase().includes(term) ||
        b.skillSet?.toLowerCase().includes(term)
      )
    })

    setFilteredCareers(filtered)
  }, [searchText, careerData])

  const getCareerDataList = async () => {
    try {
      const response = await getCareerListWithCareerReqCount()
      if (response.data?.isSuccess) {
        const careerArray = response.data.responseObject || []
        setCareerData(careerArray)
      } else {
        toast.error('API returned success = false:', response.data.message)
      }
    } catch (error) {
      toast.error('Error fetching career:', error)
    } finally {
      setLoading(false)
    }
  }

  // =================Is Active Function Model Call==============
  const [showActive, setShowActive] = useState(false)
  const handleCloseActive = () => setShowActive(false)
  const [isActive, setIsActive] = useState(false)
  const [tmpbusiID, setTmpbusiID] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedCareer, setSelectedCareer] = useState(null)
  const [careerRequests, setCareerRequests] = useState([])

  function handleShowActive(event) {
    const Cid = event.target.id
    const tmpIsActive = event.target.checked
    setIsActive(tmpIsActive)
    setShowActive(true)
    setTmpbusiID(Cid)
    setLoading(false)
  }
  function checkedFunction(temEmpId, temIsAct) {
    getCareerUpdateIsActive(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess == true) {
          getCareerDataList()
          setShowActive(false)
        } else {
          toast.error(`${response.data.message}`)
          setShowActive(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowActive(false)
      })
  }

  const handleEdit = (id) => {
    history.push(`/career/edit/${id}`)
    console.log('get Id', id.event.id)
  }

  const handleDelete = async (careerID) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this career?')
    if (!confirmDelete) return
    try {
      const res = await deleteCareerDetails(careerID)
      if (res?.data?.isSuccess) {
        toast.success('Career Deleted Successfully')
        getCareerDataList()
        // Optional: Refresh list here
      } else {
        toast.error('Failed to delete career')
      }
    } catch (error) {
      toast.error('Delete error:', error)
      toast.error('An error occurred during deletion.')
    }
  }
  // ----------------- CareerRequest --------------------------
  // ==================== Country Flag ====================
  const [showFlag, setShowFlag] = useState(false)
  const [cvLoading, setCvLoading] = useState(false)
  const [imageShow, setImageShow] = useState('')
  const [applicantFullname, setApplicantFullname] = useState('')
  const handleClose_Flag = () => {
    setCvLoading(false)
    setImageShow('')
    // setState({...state, imageShow: '', loading: false})
    setShowFlag(false)
  }
  const handleShowFlag = (selImg, applicantFullname) => {
    setImageShow(process.env.REACT_APP_API_URL + selImg)
    setApplicantFullname(applicantFullname)
    setCvLoading(false)
    // setState({
    //   ...state,
    //   imageShow: state.pathUrl + selImg,
    //   applicantFullname: applicantFullname,
    //   loading: false,
    // })
    setShowFlag(true)
  }

  const handleShowRequests = async (objCareer) => {
    setSelectedCareer(objCareer)
    try {
      const response = await getCareerRequestListByCareerID(objCareer.carrerID)
      if (response.data?.isSuccess) {
        const careerArray = response.data.responseObject || []
        setCareerRequests(careerArray)
        setShowRequestModal(true)
      } else {
        toast.error('API returned success = false:', response.data.message)
        setShowRequestModal(false)
      }
    } catch (error) {
      toast.error('Error fetching career:', error)
      setShowRequestModal(false)
    } finally {
      setLoading(false)
    }
  }
  // -------------------------------------------------
  const handleDeleteRequest = async (careerRequestID) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this career request?')
    if (!confirmDelete) return
    try {
      const res = await deleteCareerRequestDtls(careerRequestID)
      if (res?.data?.isSuccess) {
        toast.success('Career Request Deleted Successfully')
        handleShowRequests(selectedCareer) // Refresh the requests for the selected career
        setShowRequestModal(true) // Reopen the modal to show updated requests
        // Optional: Refresh list here
      } else {
        toast.error('Failed to delete career request')
      }
    } catch (error) {
      toast.error('Delete error:', error)
      toast.error('An error occurred during deletion.')
    }
  }

  return (
    <>
      <div
        className='card-header border-0 py-4 rounded shadow mb-4 text-white d-flex justify-content-between align-items-center'
        style={{backgroundColor: '#000000'}}
      >
        {/* <div className='mb-3 '> */}
        <span className='w-30 position-relative'>
          <KTSVG
            path='/media/icons/duotune/general/gen021.svg'
            className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
          />
          <input
            type='text'
            className='form-control form-control-solid px-15 bg-white'
            placeholder='Search'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </span>
        <Link to='/career/add' className='btn btn-sm btn-light-primary bg-white'>
          <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
          Add New
        </Link>
      </div>
      <div className='table-responsive'>
        <table className='table table-bordered table-hover'>
          <thead className='fs-5 bg-primary text-start'>
            <tr className='fw-bolder'>
              {/* <th>#</th> */}
              <th className='ps-5'>Business Name</th>
              <th className=''>Job Title</th>
              <th className=''>Skill Set</th>
              <th>Experience</th>
              <th className='w-15'>Location</th>
              <th className='w-15'>No. Of Requests</th>
              {/* <th>Job Code</th> */}
              <th>Is Active</th>
              <th className='text-end pe-2'>Edit | Delete</th>
            </tr>
          </thead>
          <tbody className='border-bottom'>
            {' '}
            {loading ? (
              <tr>
                <td colSpan='4'>
                  <div className='d-flex flex-column align-items-center justify-content-center ps-2 py-4'>
                    <div className='spinner-border text-primary' role='status' />
                    <p className='mt-2'>Loading business...</p>
                  </div>
                </td>
              </tr>
            ) : filteredCareers.length === 0 ? (
              <tr>
                <td>
                  {/* <div className='alert alert-warning text-center mb-0'>No business found.</div> */}
                  <BlankDataImageInTable
                    length={filteredCareers.length}
                    loading={loading}
                    colSpan={5}
                  />
                </td>
              </tr>
            ) : (
              filteredCareers?.map((career, index) => (
                <tr key={career.carrerID}>
                  {/* <td>{index + 1}</td> */}
                  <td className='ps-5'>
                    {career.businessID == 1 ? 'ECD' : 'Eco Build Contractors & Developers'}
                  </td>
                  <td className=''>{career.jobTitle}</td>
                  <td className=''>{career.skillSet}</td>
                  <td>{career.experience}</td>
                  <td>{career.jobLocation}</td>
                  <td className='text-center'>
                    <span
                      className='text-primary fw-bold cursor-pointer'
                      style={{textDecoration: 'underline'}}
                      onClick={() => handleShowRequests(career)}
                    >
                      {career.noOfCareerRequests || 0}
                    </span>
                  </td>
                  {/* <td>{career.jobCode}</td> */}
                  <td>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id={`${career.carrerID}`}
                        checked={career.isActive}
                        onChange={(e) => handleShowActive(e)}
                      />
                    </div>
                  </td>{' '}
                  <td className='text-center'>
                    <div className='d-flex justify-content-end gap-2 pe-2'>
                      <div
                        className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                        onClick={() => handleEdit(career.carrerID)}
                      >
                        <KTSVG
                          path='/media/icons/duotune/art/art005.svg'
                          className='svg-icon-3 svg-icon-primary'
                        />
                      </div>
                      <div
                        className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                        onClick={() => handleDelete(career.carrerID)}
                      >
                        <KTSVG
                          path='/media/icons/duotune/general/gen027.svg'
                          className='ssvg-icon-3 svg-icon-danger'
                        />
                      </div>
                    </div>
                  </td>
                  {/* <td>
                  <button
                    className='btn btn-sm btn-warning me-2'
                    //  onClick={() => onEdit(career)}
                  >
                    Edit
                  </button>
                  <button
                    className='btn btn-sm btn-danger'
                    // onClick={() => onDelete(career.carrerID)}
                  >
                    Delete
                  </button>
                </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={tmpbusiID}
        activeType={isActive}
        pageName={'Career'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(tmpbusiID, isActive)}
      />
      <Modal show={showRequestModal} onHide={() => setShowRequestModal(false)} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCareer?.businessName}
            {/* <br /> */}
            <small className='text-muted ms-2'> | Job Title : </small>
            <span className='text-success'>{selectedCareer?.jobTitle}</span>
            <br />
            <small className='text-muted'>Skills: {selectedCareer?.skillSet}</small>
            <br />
            <small className='text-muted'>
              Experience: {selectedCareer?.experience} &nbsp; | Location:{' '}
              {selectedCareer?.jobLocation}
            </small>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {careerRequests.length === 0 ? (
            <p>No requests for this job yet.</p>
          ) : (
            <div className='table-responsive'>
              <table className='table table-bordered'>
                <thead className='table-light'>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Designation</th>
                    <th>Employer</th>
                    <th>CV</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {careerRequests.map((req, idx) => (
                    <tr key={req.requestID}>
                      <td>{idx + 1}</td>
                      <td>
                        {req.applicantFirstName} {req.applicantLastName}
                      </td>
                      <td>{req.emailID}</td>
                      <td>{req.contactNumber}</td>
                      <td>{req.currentDesignation}</td>
                      <td>{req.currentEmployer}</td>{' '}
                      <td>
                        <div
                          className='symbol symbol-45px me-5 cursor-pointer'
                          onClick={() =>
                            handleShowFlag(
                              req.cvPath,
                              req.applicantFirstName + ' ' + req.applicantLastName
                            )
                          }
                        >
                          <img
                            src={process.env.REACT_APP_API_URL + req.cvPath}
                            alt='CV Preview'
                            className='img-fluid fs-6'
                            style={{width: 45, height: 45, objectFit: 'cover'}}
                          />
                        </div>
                      </td>{' '}
                      <td className='text-center'>
                        <div className='d-flex justify-content-end'>
                          <div
                            className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                            onClick={() => handleDeleteRequest(req.careerRequestID)}
                          >
                            <KTSVG
                              path='/media/icons/duotune/general/gen027.svg'
                              className='ssvg-icon-3 svg-icon-danger'
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowRequestModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* =====================Image Model=================== */}
      <ModelPopUp_ShowImage
        imageShow={imageShow}
        pageName={applicantFullname}
        show={showFlag}
        handleClose={handleClose_Flag}
      />
    </>
  )
}

export default CareerList
