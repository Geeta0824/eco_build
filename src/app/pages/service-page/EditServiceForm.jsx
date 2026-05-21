import React, {useEffect, useState, useRef} from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {useParams, useHistory, Link} from 'react-router-dom'
import {toast} from 'react-toastify'
import {getServiceById, editServiceDetails} from '../../modules/service-master-page/ServiceCRUD'
import {getBusinessList} from '../../modules/business-master-page/BusinessCRUD'

function EditServiceForm() {
  const {id} = useParams()
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const [businesses, setBusinesses] = useState([])
  const [isActive, setIsActive] = useState(false)
  const [filePath, setFilePath] = useState('')
  const [formData, setFormData] = useState({
    businessID: 0,
    serviceID: 0,
    serviceName: '',
    servicePhotoPath: '',
    sortDescription: '',
    description: '',
    broucherPath: '',
    isActive: true,
  })

  const quillRef = useRef(null)

  useEffect(() => {
    const fetchServicebyIdData = async () => {
      try {
        const res = await getServiceById(Number(id))
        if (res.data?.isSuccess) {
          const data = res.data
          setFormData({
            serviceID: data.serviceID,
            businessID: data.bussinessID,
            serviceName: data.serviceName || '',
            servicePhotoPath: data.servicePhotoPath || '',
            sortDescription: data.sortDescription || '',
            description: data.description || '',
            broucherPath: data.broucherPath || '',
            isActive: data.isActive || false,
          })

          setIsActive(data.isActive)
          setFilePath(data.servicePhotoPath)
        } else {
          toast.success('service not found.')
        }
      } catch (error) {
        toast.error('Failed to fetch service:', error)
        toast.error('Error loading service data.')
      } finally {
        setLoading(false)
      }
    }

    fetchServicebyIdData()
    fetchBusinessData()
  }, [id])

  const fetchBusinessData = async () => {
    try {
      const response = await getBusinessList()
      if (response.data?.isSuccess) {
        const businessArray = response.data.responseObject || []
        setBusinesses(businessArray)
        console.log(setBusinesses(businessArray), 'businesses fetched 2')
        console.log(businesses, 'businesses fetched 3')
      } else {
        toast.error(`API returned success = false: ${response.data.message}`)
      }
    } catch (error) {
      toast.error(`Error fetching businesses: ${error}`)
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

    fetch(process.env.REACT_APP_API_URL + '/Career/Career_Upload_Photo', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFilePath(data)
      })
  }
  // -----------------------

  const handleUpdateClick = async () => {
    try {
      await editServiceDetails(
        formData.businessID,
        formData.serviceID,
        formData.serviceName,
        filePath,
        formData.sortDescription,
        formData.description,
        formData.broucherPath,
        isActive
      )
      toast.success('Service updated successfully!')
      history.push('/service/list')
    } catch (error) {
      toast.error('Failed to update service:', error)
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

  if (loading) return <p className='text-center mt-5'>Loading service data...</p>

  return (
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
            <form>
              <div className='row mb-6'>
                <label className='col-lg-2 col-form-label required fw-bold fs-6'>Business:</label>
                <div className='col-lg-4 fv-row mt-6'>
                  <select
                    className='form-select bg-light-primary'
                    aria-label='Default select example'
                    onChange={selectChange}
                    id='businessID'
                    value={formData.businessID || 0} // <-- Controlled value
                  >
                    <option value='0'>Select Business</option>
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
              {/* <div className='mb-3'>
                <label className='form-label'>Email</label>
                <input
                  type='email'
                  name='businessEmailID'
                  value={formData.businessEmailID}
                  onChange={handleChange}
                  className='form-control'
                  required
                />
              </div>

              <div className='mb-3'>
                <label className='form-label'>Phone Number</label>
                <input
                  type='tel'
                  name='businessContactNo'
                  value={formData.businessContactNo}
                  onChange={handleChange}
                  className='form-control'
                />
              </div> */}
              {/* <div className='mb-12 mt-5'>
                <label className='form-label'>Short Description</label>
                <ReactQuill
                  ref={quillRef}
                  theme='snow'
                  value={formData.sortDescription}
                  onChange={handleSortDescChange}
                  modules={quillModules}
                  formats={quillFormats}
                  style={{height: '250px', marginBottom: '1rem'}}
                />
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
                  type='button'
                  className='btn btn-success btn-lg rounded-pill'
                  onClick={handleUpdateClick}
                >
                  Update
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
  )
}

export default EditServiceForm
