import React, {useEffect, useState, useRef} from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {useParams, useHistory, Link} from 'react-router-dom'
import {getBusinessById, editBusinessDetails} from '../../modules/business-master-page/BusinessCRUD'
import {toast} from 'react-toastify'

function EditBusinessForm() {
  const {id} = useParams()
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const [isActive, setIsActive] = useState(false)
  const [filePath, setFilePath] = useState('')
  const [formData, setFormData] = useState({
    businessID: 0,
    businessName: '',
    businessLogoFilePath: '',
    businessPhotoPath: '',
    sortDescription: '',
    description: '',
    businessStartDate: '',
    businessContactNo: '',
    businessEmailID: '',
    businessAddress1: '',
    businessAddress2: '',
    businessCity: '',
    businessState: '',
    broucherPath: '',
    isActive: true,
  })

  const quillRef = useRef(null)

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const res = await getBusinessById(Number(id))
        if (res.data?.isSuccess) {
          const data = res.data
          setFormData({
            businessID: data.businessID,
            businessName: data.businessName || '',
            businessLogoFilePath: data.businessLogoFilePath || '',
            businessPhotoPath: data.businessPhotoPath || '',
            sortDescription: data.sortDescription || '',
            description: data.description || '',
            businessStartDate: data.businessStartDate || '',
            businessContactNo: data.businessContactNo || '',
            businessEmailID: data.businessEmailID || '',
            businessAddress1: data.businessAddress1 || '',
            businessAddress2: data.businessAddress2 || '',
            businessCity: data.businessCity || '',
            businessState: data.businessState || '',
            broucherPath: data.broucherPath || '',
            isActive: data.isActive || false,
          })
          setIsActive(data.isActive)
          setFilePath(data.businessPhotoPath)
        } else {
          toast.success('Business not found.')
        }
      } catch (error) {
        toast.error('Failed to fetch business:', error)
        toast.error('Error loading business data.')
      } finally {
        setLoading(false)
      }
    }

    fetchBusiness()
  }, [id])

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

    fetch(process.env.REACT_APP_API_URL + '/Business/Business_Upload_Photo', {
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
      await editBusinessDetails(
        formData.businessID,
        formData.businessName,
        // formData.businessLogoFilePath,
        filePath,
        formData.businessPhotoPath,
        formData.sortDescription,
        formData.description,
        formData.businessStartDate,
        formData.businessContactNo,
        formData.businessEmailID,
        formData.businessAddress1,
        formData.businessAddress2,
        formData.businessCity,
        formData.businessState,
        formData.broucherPath,
        isActive
      )
      toast.success('Business updated successfully!')
      history.push('/business/list')
    } catch (error) {
      toast.error('Failed to update business:', error)
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

  if (loading) return <p className='text-center mt-5'>Loading business data...</p>

  return (
    <div className='row justify-content-center'>
      <div className='card shadow-lg border-0 rounded-4 w-100'>
        <div className='card-body p-4'>
          {/* Back Button */}
          <div className='text-end mb-3'>
            <Link
              className='btn btn-sm btn-light-primary bg-primary text-white fs-6 mb-2 btn btn-rounded'
              to='/business/list'
            >
              Back To List
            </Link>
          </div>

          <form>
            {/* Business Name */}
            {/* Row 1: Business Name & Email */}
            <div className='row mb-3 mt-4'>
              {/* Business Name */}
              <div className='col-lg-6 col-md-6 col-sm-12 mb-3'>
                <label className='form-label'>Business Name</label>
                <input
                  type='text'
                  name='businessName'
                  value={formData.businessName}
                  onChange={handleChange}
                  className='form-control'
                  placeholder='Enter business name'
                  required
                />
              </div>

              {/* Email */}
              <div className='col-lg-6 col-md-6 col-sm-12 mb-3'>
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
            </div>

            {/* Row 2: Phone Number & Image */}
            <div className='row mb-3'>
              {/* Phone Number */}
              <div className='col-lg-6 col-md-6 col-sm-12 mb-3'>
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

              {/* Image Upload */}
              <div className='col-lg-6 col-md-6 col-sm-12 mb-3'>
                <label className='form-label'>Select Image</label>
                <div className='d-flex align-items-center gap-3 flex-wrap'>
                  {filePath && (
                    <div className='symbol symbol-45px'>
                      <img
                        src={process.env.REACT_APP_API_URL + filePath}
                        alt='Preview'
                        className='img-fluid rounded'
                      />
                    </div>
                  )}
                  <input
                    type='file'
                    accept='image/*'
                    className='form-control'
                    onChange={(e) => imageUpload(e)}
                  />
                </div>
              </div>
            </div>

            {/* isActive Toggle */}
            <div className='mb-3 d-flex align-items-center'>
              <label className='form-label me-3 mb-0'>Is Active:</label>
              <div className='form-check form-switch'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  checked={isActive}
                  onChange={(e) => checkedFunction(e)}
                />
              </div>
            </div>

            <div className='row mt-5'>
              {/* Short Description */}
              <div className='col-12 mb-4'>
                <label className='form-label fw-bold'>Short Description:</label>
                <ReactQuill
                  ref={quillRef}
                  theme='snow'
                  value={formData.sortDescription}
                  onChange={handleSortDescChange}
                  modules={quillModules}
                  formats={quillFormats}
                  className='quill-editor short-desc'
                />
              </div>

              {/* Business Description */}
              <div className='col-12'>
                <label className='form-label fw-bold mt-4'>Business Description:</label>
                <ReactQuill
                  ref={quillRef}
                  theme='snow'
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  modules={quillModules}
                  formats={quillFormats}
                  className='quill-editor business-desc'
                />
              </div>
            </div>

            {/* Buttons */}
            <div className='text-center mt-4'>
              <button
                type='button'
                className='btn btn-success rounded-pill px-4'
                onClick={handleUpdateClick}
              >
                Update
              </button>
              <Link className='btn btn-secondary ms-2 rounded-pill px-4' to='/business/list'>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditBusinessForm
