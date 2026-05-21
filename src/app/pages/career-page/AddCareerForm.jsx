import React, {useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {toast} from 'react-toastify'
import {addCareerDetails} from '../../modules/career-master-page/CareerCRUD'
import {getBusinessList} from '../../modules/business-master-page/BusinessCRUD'

const AddCareerForm = () => {
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const [businesses, setBusinesses] = useState([])
  const [isActive, setIsActive] = useState(false)
  const [formData, setFormData] = useState({
    businessID: 0,
    jobTitle: '',
    skillSet: '',
    description: '',
    experience: '',
    jobLocation: '',
    jobCode: '',
    createBy: 1,
    ipAddress: '192.16.1',
    // isActive: false,
  })

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const fetchBusinesses = async () => {
    try {
      const response = await getBusinessList()
      if (response.data?.isSuccess) {
        const businessArray = response.data.responseObject || []
        setBusinesses(businessArray)
        console.log(businessArray, 'career fetched 1')
      } else {
        toast.error('API returned success = false:', response.data.message)
      }
    } catch (error) {
      toast.error('Error fetching businesses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCareerAdd = async () => {
    try {
      await addCareerDetails(
        formData.businessID,
        formData.jobTitle,
        formData.skillSet,
        formData.description,
        formData.experience,
        formData.jobLocation,
        formData.jobCode,
        formData.createBy,
        formData.ipAddress,
        isActive
      )
      toast.success('Career created successfully!')
      history.push('/career/list')
    } catch (error) {
      toast.error('Failed to created career:', error)
      toast.error('created failed.')
    }
  }

  const checkedFunction = (event) => {
    setIsActive(event.target.checked)
  }

  const handleChange = (e) => {
    const {name, value, type, checked} = e.target
    setFormData({...formData, [name]: type === 'checkbox' ? checked : value})
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

  const handleSubmit = (e) => {
    e.preventDefault()
    // onSubmit(formData)
  }

  return (
    <>
      <div className=''>
        <div className='row justify-content-center'>
          <div className='card shadow-lg border-0 rounded-4'>
            <div className='card-body p-4'>
              <div className='text-end'>
                <Link
                  className='btn btn-sm btn-light-primary bg-primary text-white fs-5 mb-2 btn btn-rounded'
                  to={{pathname: '/career/list'}}
                >
                  Back To List
                </Link>
              </div>
              {/* <h4>{initialData ? 'Update Career' : 'Add Career'}</h4> */}
              <form onSubmit={handleSubmit}>
                {/* Row 1: Business & Job Title */}
                <div className='row mb-3'>
                  <label className='col-lg-2 col-form-label required fw-bold fs-6'>Business:</label>
                  <div className='col-lg-3'>
                    <select
                      className='form-select bg-light-primary'
                      aria-label='Select Business'
                      onChange={selectChange}
                      id='businessID'
                    >
                      <option value=''>Select Business</option>
                      {businesses.length > 0 &&
                        businesses.map((data, index) => (
                          <option key={index} value={data.businessID}>
                            {data.businessName}
                          </option>
                        ))}
                    </select>
                  </div>

                  <label className='col-lg-2 col-form-label fw-bold fs-6'>Job Title:</label>
                  <div className='col-lg-3'>
                    <input
                      type='text'
                      className='form-control'
                      name='jobTitle'
                      value={formData.jobTitle}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Skill Set & Experience */}
                <div className='row mb-3'>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>Skill Set:</label>
                  <div className='col-lg-3'>
                    <input
                      type='text'
                      className='form-control'
                      name='skillSet'
                      value={formData.skillSet}
                      onChange={handleChange}
                    />
                  </div>

                  <label className='col-lg-2 col-form-label fw-bold fs-6'>Experience:</label>
                  <div className='col-lg-3'>
                    <input
                      type='text'
                      className='form-control'
                      name='experience'
                      value={formData.experience}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Row 3: Job Location & Job Code */}
                <div className='row mb-3'>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>Job Location:</label>
                  <div className='col-lg-3'>
                    <input
                      type='text'
                      className='form-control'
                      name='jobLocation'
                      value={formData.jobLocation}
                      onChange={handleChange}
                    />
                  </div>

                  <label className='col-lg-2 col-form-label fw-bold fs-6'>Job Code:</label>
                  <div className='col-lg-3'>
                    <input
                      type='text'
                      className='form-control'
                      name='jobCode'
                      value={formData.jobCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Row 4: Description (Label + Textarea) */}
                <div className='row mb-3 align-items-start'>
                  <label className='col-sm-2 col-form-label fw-bold fs-6'>Description:</label>
                  <div className='col-sm-8'>
                    <textarea
                      className='form-control'
                      name='description'
                      value={formData.description}
                      onChange={handleChange}
                      rows='3'
                    ></textarea>
                  </div>
                </div>

                {/* Row 5: isActive */}
                <div className='row mb-3 align-items-center'>
                  <label className='col-lg-2 col-form-label fw-bold fs-6'>Is Active:</label>
                  <div className='col-lg-3'>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        checked={isActive}
                        onChange={(e) => checkedFunction(e)}
                      />
                    </div>
                  </div>
                </div>

                {/* Row 6: Buttons */}
                <div className='text-center mt-4'>
                  <button
                    type='submit'
                    onClick={handleCareerAdd}
                    className='btn btn-success rounded-square px-4'
                  >
                    Submit
                  </button>
                  <Link className='btn btn-primary ms-3 rounded-square px-4' to='/career/list'>
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

export default AddCareerForm
