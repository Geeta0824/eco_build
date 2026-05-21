import React, {useEffect, useState, useRef} from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {Link, useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import {addServiceDetails} from '../../modules/service-master-page/ServiceCRUD'
import {getBusinessList} from '../../modules/business-master-page/BusinessCRUD'

function AddServiceForm() {
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const [businesses, setBusinesses] = useState([])
  const [isActive, setIsActive] = useState(false)
  const [filePath, setFilePath] = useState('')
  const [formData, setFormData] = useState({
    businessID: 0,
    serviceName: '',
    servicePhotoPath: '',
    sortDescription: '',
    description: '',
    broucherPath: '',
    isActive: true,
    createdBy: 1,
  })

  const quillRef = useRef(null)

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const fetchBusinesses = async () => {
    try {
      const response = await getBusinessList()
      if (response.data?.isSuccess) {
        const businessArray = response.data.responseObject || []
        setBusinesses(businessArray)
        console.log(businessArray, 'businesses fetched 1')
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

  const selectChange = (event) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'businessID') {
      setFormData((prev) => ({
        ...prev,
        businessID: parseInt(value),
      }))
    }
  }
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

    fetch(process.env.REACT_APP_API_URL + '/Service/Service_Upload_Photo', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFilePath(data)
      })
  }

  // --------------------------
  const handleSubmit = (e) => {
    e.preventDefault()
    // console.log('Form Data:', formData)
    // alert('service info submitted! Check console.')
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

  const handleserviceAdd = async () => {
    try {
      await addServiceDetails(
        formData.businessID,
        formData.serviceName,
        // formData.servicePhotoPath,
        filePath,
        formData.sortDescription,
        formData.description,
        formData.broucherPath,
        formData.isActive,
        formData.createdBy
      )
      toast.success('service created successfully!')
      history.push('/service/list')
    } catch (error) {
      toast.error('Failed to created service:', error)
      toast.error('created failed.')
    }
  }

  return (
    <>
      {/* <div
        onClick={() => {
          history.push('/service/list')
        }}
        className='row justify-content-end mb-4'
      >
        <button className='btn btn-secondary'>Back to service List</button>
      </div> */}
      <div className=''>
        <div className='row justify-content-center'>
          <div className='card shadow-lg border-0 rounded-4'>
            <div className='card-body p-4'>
              <div className='text-end'>
                <Link
                  className='btn btn-sm btn-light-primary bg-primary text-white fs-5 mb-2 btn btn-rounded'
                  to={{pathname: '/service/list'}}
                >
                  Back To List
                </Link>
              </div>
              <form onSubmit={handleSubmit}>
                <div className='row mb-6 mt-6'>
                  <label className='col-lg-2 col-form-label required fw-bold fs-6'>Business:</label>
                  <div className='col-lg-4 fv-row'>
                    <select
                      className='form-select bg-light-primary'
                      aria-label='Default select example'
                      onChange={selectChange}
                      id='businessID'
                    >
                      <option selected>Select Business</option>
                      {businesses.length > 0 &&
                        businesses.map((data, index) => {
                          return (
                            <option key={index} value={data.businessID}>
                              {data.businessName}
                            </option>
                          )
                        })}
                    </select>
                  </div>
                </div>
                <div className='row mb-6 mt-6'>
                  {/* Service Name */}
                  <div className='col-lg-6'>
                    <div className='row align-items-center'>
                      <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                        Service Name:
                      </label>
                      <div className='col-lg-8 fv-row'>
                        <input
                          type='text'
                          name='serviceName'
                          value={formData.serviceName}
                          onChange={handleChange}
                          className='form-control'
                          placeholder='Enter service name'
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Select Image */}
                  <div className='col-lg-6'>
                    <div className='row align-items-center'>
                      <label className='col-lg-4 col-form-label fw-bold fs-6'>
                        <span className='d-block'>Select Image:</span>
                      </label>
                      {filePath !== '' && (
                        <div className='col-lg-2 d-flex align-items-center'>
                          <div className='symbol symbol-45px me-2'>
                            <img
                              src={process.env.REACT_APP_API_URL + filePath}
                              alt='img'
                              className='img-fluid'
                            />
                          </div>
                        </div>
                      )}
                      <div className={filePath === '' ? 'col-lg-8 fv-row' : 'col-lg-6 fv-row'}>
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
                {/* <div className='row mb-3'>
                  <div className='mb-3 col-6 col-md-6'>
                    <label className='form-label'>Email</label>
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      className='form-control'
                      placeholder='Enter email'
                      required
                    />
                  </div>

                  <div className='mb-3 col-6 col-md-6'>
                    <label className='form-label'>Phone Number</label>
                    <input
                      type='tel'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                      className='form-control'
                      placeholder='Enter phone number'
                    />
                  </div>
                </div> */}
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
                      // style={{height: '100px', marginBottom: '1rem'}}
                      className='quill-editor short-desc'
                    />
                  </div>

                  <div className='col-12'>
                    <label className='form-label mt-4'>Service Description:</label>
                    <ReactQuill
                      ref={quillRef}
                      theme='snow'
                      value={formData.description}
                      onChange={handleDescriptionChange}
                      modules={quillModules}
                      formats={quillFormats}
                      // style={{height: '500px', marginBottom: '1rem', marginTop: '1rem'}}
                      className='quill-editor short-desc'
                    />
                  </div>
                </div>

                <div className='mt-13 card-footer text-center'>
                  <button
                    onClick={handleserviceAdd}
                    className='btn btn-success btn-lg rounded-pill'
                  >
                    Submit
                  </button>
                  <Link
                    className='btn btn-primary ms-3 rounded-pill'
                    to={{pathname: '/service/list'}}
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

export default AddServiceForm
