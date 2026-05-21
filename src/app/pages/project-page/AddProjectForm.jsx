import React, {useState, useEffect, useRef} from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {title} from 'process'
import {Link, useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import {
  addProjectDetails,
  getServiceDropDownByBusinessID,
} from '../../modules/projects-master-page/ProjectsCRUD'
import {getServiceList} from '../../modules/service-master-page/ServiceCRUD'
import {getBusinessList} from '../../modules/business-master-page/BusinessCRUD'

function AddProjectForm() {
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const [businesses, setBusinesses] = useState([])
  const [services, setServices] = useState([])
  const quillRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const [filePath, setFilePath] = useState('')
  const [formData, setFormData] = useState({
    businessID: 0,
    serviceID: 0,
    projectName: '',
    projectPhotoPath: '',
    sortDescription: '',
    description: '',
    broucherPath: '',
    isActive: true,
    createBy: 1,
  })

  useEffect(() => {
    // fetchServiceData()
    fetchBusinessData()
  }, [])
  // --------------------------------------
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
        console.log(setBusinesses(businessArray), 'businesses fetched 2')
        console.log(businesses, 'businesses fetched 3')
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
  // --------------------------------------------------------
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
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

  // --------------------------------
  const handleSubmit = (e) => {
    e.preventDefault()
    // console.log('Form Data:', formData)
    // toast.success('project created successfully!')
  }

  const quillModules = {
    toolbar: [
      [{header: [1, 2, 3, 4, 5, 6, false]}, {title: 'heading'}],
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

  const handleprojectAdd = async () => {
    try {
      await addProjectDetails(
        formData.businessID,
        formData.serviceID,
        // formData.projectPhotoPath,
        filePath,
        formData.projectName,
        formData.sortDescription,
        formData.description,
        formData.broucherPath,
        isActive,
        formData.createBy
      )
      toast.success('project created successfully!')
      history.push('/project/list')
    } catch (error) {
      toast.error('Failed to created project:', error)
      toast.error('created failed.')
    }
  }

  return (
    <>
      {/* <div
        onClick={() => {
          history.push('/project/list')
        }}
        className='row justify-content-end mb-4'
      >
        <button className='btn btn-secondary'>Back to project List</button>
      </div> */}
      <div className=''>
        <div className='row justify-content-center'>
          <div className='card shadow-lg border-0 rounded-4'>
            <div className='card-body p-4'>
              {/* Back to List button */}
              <div className='text-end'>
                <Link
                  className='btn btn-sm btn-light-primary bg-primary text-white fs-6 mb-2 btn-rounded'
                  to={{pathname: '/project/list'}}
                >
                  Back To List
                </Link>
              </div>

              <form onSubmit={handleSubmit} className='mt-5'>
                {/* Business & Service */}
                <div className='row g-3 mb-4'>
                  <div className='col-12 col-lg-2 d-flex align-items-center'>
                    <label className='col-form-label required fw-bold fs-6 mb-0'>Business:</label>
                  </div>
                  <div className='col-12 col-lg-4'>
                    <select
                      className='form-select bg-light-primary'
                      onChange={selectChange}
                      id='businessID'
                      value={formData.businessID || ''}
                    >
                      <option value=''>Select Business</option>
                      {businesses.map((data, index) => (
                        <option key={index} value={data.businessID}>
                          {data.businessName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='col-12 col-lg-2 d-flex align-items-center'>
                    <label className='col-form-label required fw-bold fs-6 mb-0'>Service:</label>
                  </div>
                  <div className='col-12 col-lg-4'>
                    <select
                      className='form-select bg-light-primary'
                      onChange={selectChange}
                      id='serviceID'
                      value={formData.serviceID || ''}
                    >
                      <option value=''>Select Service</option>
                      {services.map((data, index) => (
                        <option key={index} value={data.serviceID}>
                          {data.serviceName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

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

                {/* isActive Switch */}
                <div className='row g-3 mb-4'>
                  <div className='col-12 col-lg-2 d-flex align-items-center'>
                    <label className='col-form-label fw-bold fs-6 mb-0'>isActive:</label>
                  </div>
                  <div className='col-12 col-lg-8'>
                    <div className='form-check form-switch mt-2'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        checked={isActive}
                        onChange={checkedFunction}
                      />
                    </div>
                  </div>
                </div>

                {/* Short Description */}
                <div className='row mt-5'>
                  <div className='col-12 mb-4'>
                    <label className='form-label fw-bold fs-6'>Short Description:</label>
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

                  {/* Project Description */}
                  <div className='col-12'>
                    <label className='form-label fw-bold mt-4 fs-6'>Project Description:</label>
                    <ReactQuill
                      ref={quillRef}
                      theme='snow'
                      value={formData.description}
                      onChange={handleDescriptionChange}
                      modules={quillModules}
                      formats={quillFormats}
                      className='quill-editor business-desc'
                      // style={{height: '500px', marginBottom: '1rem'}}
                    />
                  </div>
                </div>
                {/* Submit & Cancel */}
                <div className='mt-4 card-footer text-center'>
                  <button
                    type='submit'
                    onClick={handleprojectAdd}
                    className='btn btn-success btn-lg rounded-pill'
                  >
                    Submit
                  </button>
                  <Link
                    className='btn btn-primary ms-3 rounded-pill'
                    to={{pathname: '/project/list'}}
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddProjectForm
