import React, {useEffect, useState, useRef} from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {useParams, useHistory, Link} from 'react-router-dom'
import {toast} from 'react-toastify'
import {
  getProjectById,
  editProjectDetails,
  getServiceDropDownByBusinessID,
} from '../../modules/projects-master-page/ProjectsCRUD'
import {getServiceList} from '../../modules/service-master-page/ServiceCRUD'
import {getBusinessList} from '../../modules/business-master-page/BusinessCRUD'

function EditProjectForm() {
  const {id} = useParams()
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const [businesses, setBusinesses] = useState([])
  const [services, setServices] = useState([])
  const [isActive, setIsActive] = useState(false)
  const [filePath, setFilePath] = useState('')
  const [formData, setFormData] = useState({
    projectID: 0,
    businessID: 0,
    serviceID: 0,
    projectName: '',
    projectPhotoPath: '',
    sortDescription: '',
    description: '',
    broucherPath: '',
    isActive: true,
  })

  const quillRef = useRef(null)
  const [serID, setSerID] = useState(0)
  useEffect(() => {
    const fetchProjectByIdData = async () => {
      try {
        const res = await getProjectById(Number(id))
        if (res.data?.isSuccess) {
          const data = res.data
          setFormData({
            projectID: data.projectID,
            businessID: data.businessID,
            serviceID: data.serviceID,
            projectName: data.projectName || '',
            projectPhotoPath: data.projectPhotoPath || '',
            sortDescription: data.sortDescription || '',
            description: data.description || '',
            broucherPath: data.broucherPath || '',
            isActive: data.isActive || false,
          })
          setIsActive(data.isActive)
          setFilePath(data.projectPhotoPath)
          serviceDropDownListData(data.businessID)
        } else {
          toast.success('project not found.')
        }
      } catch (error) {
        toast.error('Failed to fetch project:', error)
        toast.error('Error loading project data.')
      } finally {
        setLoading(false)
      }
    }

    fetchProjectByIdData()
    fetchBusinessData()
  }, [id])

  const serviceDropDownListData = async (businessId) => {
    try {
      const response = await getServiceDropDownByBusinessID(businessId)
      if (response.data?.isSuccess) {
        const serviceArray = response.data.responseObject || []
        setServices(serviceArray)
      } else {
        toast.error('API returned success = false:', response.data.message)
      }
    } catch (error) {
      toast.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }
  // --------------------------------------
  const fetchBusinessData = async () => {
    try {
      const response = await getBusinessList()
      if (response.data?.isSuccess) {
        const businessArray = response.data.responseObject || []
        setBusinesses(businessArray)
        // console.log(setBusinesses(businessArray), 'businesses fetched 2')
        // console.log(businesses, 'businesses fetched 3')
      } else {
        toast.error('API returned success = false:', response.data.message)
      }
    } catch (error) {
      toast.error('Error fetching businesses:', error)
    } finally {
      setLoading(false)
    }
  }

  // ------------handle functions----------------------------
  const selectChange = (event) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'businessID') {
      setFormData((prev) => ({
        ...prev,
        businessID: parseInt(value),
      }))
      serviceDropDownListData(parseInt(value))
    } else if (elementId === 'serviceID') {
      setFormData((prev) => ({
        ...prev,
        serviceID: parseInt(value),
      }))
    }
  }

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSortDescChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      sortDescription: value,
    }))
  }
  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }))
  }

  const checkedFunction = (event) => {
    setIsActive(event.target.checked)
  }

  const imageUpload = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', e.target.files[0], e.target.files[0].name)

    fetch(process.env.REACT_APP_API_URL + '/Project/Project_Upload_Photo', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFilePath(data)
      })
  }

  const handleUpdateClick = async () => {
    try {
      await editProjectDetails(
        formData.projectID,
        formData.businessID,
        formData.serviceID,
        formData.projectName,
        filePath,
        formData.sortDescription,
        formData.description,
        formData.broucherPath,
        isActive
      )
      toast.success('project updated successfully!')
      history.push('/project/list')
    } catch (error) {
      toast.error('Failed to update project:', error)
      toast.error('Update failed.')
    }
  }

  const quillModules = {
    toolbar: [
      [{header: [1, 2, 3, 4, 5, 6, false]}],
      [{font: []}],
      [{size: ['small', false, 'large', 'huge']}],
      ['bold', 'italic', 'underline', 'strike'],
      [{script: 'sub'}, {script: 'super'}],
      [{color: []}, {background: []}],
      [{list: 'ordered'}, {list: 'bullet'}],
      [{align: []}],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  }

  const quillFormats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'script',
    'color',
    'background',
    'list',
    'bullet',
    'align',
    'blockquote',
    'code-block',
    'link',
    'image',
    'video',
  ]

  if (loading) return <p className='text-center mt-5'>Loading project data...</p>

  return (
    <div className=''>
      <div className='row justify-content-center'>
        <div className='card shadow-lg border-0 rounded-4'>
          <div className='card-body p-4'>
            {/* <h3 className='card-title mb-4 text-center text-primary'>Edit Project Information</h3> */}
            <div className='text-end'>
              <Link
                className='btn btn-sm btn-light-primary bg-primary text-white fs-6 mb-2 btn btn-rounded'
                to={{pathname: '/project/list'}}
              >
                Back To List
              </Link>
            </div>
            <form className='mt-5'>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>Business:</label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='businessID'
                    value={formData.businessID || 0} // <-- Controlled value
                  >
                    <option value=''>Select Business</option>
                    {businesses.length > 0 &&
                      businesses.map((data, index) => (
                        <option
                          key={index}
                          value={data.businessID}
                          // selected={data.businessID === selBusinessID ? true : false}
                        >
                          {data.businessName}
                        </option>
                      ))}
                  </select>
                </div>
                <label className='col-lg-2 col-form-label  fw-bold fs-6'>Service:</label>
                <div className='col-lg-4 fv-row'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='serviceID'
                    value={formData.serviceID || 0} // <-- Controlled value
                  >
                    <option value=''>Select Service</option>
                    {services.length > 0 &&
                      services.map((data, index) => (
                        <option
                          key={index}
                          value={data.serviceID}
                          selected={data.serviceID === formData.serviceID ? true : false}
                        >
                          {data.serviceName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>{' '}
              <div className='row mb-6 mt-6'>
                {/* Column 1: Project Name */}
                <div className='col-lg-6'>
                  <div className='row align-items-center mb-3'>
                    <label className='col-lg-4 col-form-label required fw-bold fs-6 mb-0'>
                      Project Name
                    </label>
                    <div className='col-lg-8'>
                      <input
                        type='text'
                        name='projectName'
                        value={formData.projectName}
                        onChange={handleChange}
                        className='form-control'
                        placeholder='Enter project name'
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Column 2: Select Photo */}
                <div className='col-lg-6'>
                  <div className='row align-items-center mb-3'>
                    <label className='col-lg-4 col-form-label fw-bold fs-6 mb-0'>
                      Select Photo:
                    </label>

                    {/* Preview Image */}
                    {filePath && (
                      <div className='col-lg-2 d-flex align-items-center'>
                        <div className='symbol symbol-45px me-2'>
                          <img
                            src={process.env.REACT_APP_API_URL + filePath}
                            alt='img'
                            className='img-fluid rounded'
                          />
                        </div>
                      </div>
                    )}

                    {/* File Input */}
                    <div className={filePath ? 'col-lg-6' : 'col-lg-8'}>
                      <input
                        type='file'
                        accept='image/*'
                        className='form-control form-control-lg form-control-solid bg-light-primary'
                        onChange={(e) => imageUpload(e)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label fw-bold fs-6'>
                  <span className=''>isActive:</span>
                </label>
                <div className='col-lg-8 fv-row'>
                  <div className='form-check form-switch'>
                    <input
                      className='form-check-input mt-3'
                      type='checkbox'
                      checked={isActive}
                      onChange={(e) => checkedFunction(e)}
                    />
                  </div>
                </div>
              </div>
              <div className='row mt-5'>
                <div className='col-12 mb-4'>
                  <label className='form-label'>Short Description:</label>
                  <ReactQuill
                    ref={quillRef}
                    theme='snow'
                    value={formData.sortDescription}
                    onChange={handleSortDescChange}
                    modules={quillModules}
                    formats={quillFormats}
                    // style={{height: '250px', marginBottom: '1rem'}}
                    className='quill-editor short-desc'
                  />
                </div>
                <div className='col-12'>
                  <label className='form-label mt-4'>Project Description:</label>
                  <ReactQuill
                    ref={quillRef}
                    theme='snow'
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    modules={quillModules}
                    formats={quillFormats}
                    // style={{height: '500px', marginBottom: '1rem', marginTop: '2rem'}}
                    className='quill-editor short-desc'
                  />
                </div>
              </div>
              <div className='mt-13 card-footer text-center'>
                <button
                  type='button'
                  className='btn btn-success btn-lg rounded-pill'
                  onClick={handleUpdateClick}
                >
                  Update
                </button>
                <Link
                  className='btn btn-primary ms-3 rounded-pill'
                  to={{pathname: '/project/list'}}
                >
                  Cancel
                </Link>
                {/* <button
                  type='button'
                  className='btn btn-primary btn-lg rounded-pill'
                  onClick={handleUpdateClick}
                >
                  Cancel
                </button> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProjectForm
