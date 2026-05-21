import React, {useState, useRef} from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {title} from 'process'
import {addBusinessDetails} from '../../modules/business-master-page/BusinessCRUD'
import {Link, useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'

function AddBusinessForm() {
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
    // isActive: true,
  })

  const quillRef = useRef(null)

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

    fetch(process.env.REACT_APP_API_URL + '/Business/Business_Upload_Photo', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setFilePath(data)
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // console.log('Form Data:', formData)

    // toast.success('Business Created successfully!')
    // alert('Business info submitted! Check console.')
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

  const handleBusinessAdd = async () => {
    try {
      await addBusinessDetails(
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
      toast.success('Business created successfully!')
      history.push('/business/list')
    } catch (error) {
      toast.error('Failed to created business:', error)
      toast.error('created failed.')
    }
  }

  return (
    <>
      {/* <div
        onClick={() => {
          history.push('/business/list')
        }}
        className='row justify-content-end mb-4'
      >
        <button className='btn btn-secondary'>Back to Business List</button>
      </div> */}
      <div className=''>
        <div className='row justify-content-center'>
          <div className='card shadow-lg border-0 rounded-4'>
            <div className='card-body p-4'>
              {/* <h3 className='card-title mb-4 text-center text-primary'>
                Business Information Form
              </h3> */}
              <div className='text-end '>
                <Link
                  className='btn btn-sm btn-light-primary bg-primary text-white fs-6 mb-2 btn btn-rounded'
                  to={{pathname: '/business/list'}}
                >
                  Back To List
                </Link>
              </div>
              <form onSubmit={handleSubmit}>
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

                <div className='mt-13 card-footer text-center'>
                  <button
                    onClick={handleBusinessAdd}
                    className='btn btn-success btn-lg rounded-pill'
                  >
                    Submit
                  </button>
                  <Link
                    className='btn btn-primary ms-3 rounded-pill'
                    to={{pathname: '/business/list'}}
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

export default AddBusinessForm
