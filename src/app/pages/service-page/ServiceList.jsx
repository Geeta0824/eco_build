import React, {useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {KTSVG} from '../../../_Ecd/helpers'
import {toast} from 'react-toastify'
import {
  getServiceList,
  deleteServiceDetails,
  getServiceUpdateIsActive,
} from '../../modules/service-master-page/ServiceCRUD'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'
import {ModelPopUpIsActive} from '../common-pages/ModelPopUpIsActive'

const ServiceList = () => {
  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const history = useHistory()

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    const filtered = services.filter((s) => {
      const term = searchText.toLowerCase()
      return (
        s.businessName?.toLowerCase().includes(term) || s.serviceName?.toLowerCase().includes(term)
      )
    })

    setFilteredServices(filtered)
  }, [searchText, services])

  const fetchServices = async () => {
    try {
      const response = await getServiceList()
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

  const handleEdit = (id) => {
    history.push(`/service/edit/${id}`)
    console.log('get Id', id)
  }

  const handleDelete = async (serviceID) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this service?')
    if (!confirmDelete) return

    try {
      const res = await deleteServiceDetails(serviceID)
      if (res?.data?.isSuccess) {
        toast.success('Service Deleted Successfully')
        fetchServices()
      } else {
        toast.error('Failed to delete service')
      }
    } catch (error) {
      toast.error('Delete error:', error)
      toast.error('An error occurred during deletion.')
    }
  }

  // =================Is Active Function Model Call==============
  const [showActive, setShowActive] = useState(false)
  const handleCloseActive = () => setShowActive(false)
  const [isActive, setIsActive] = useState(false)
  const [tmpbusiID, setTmpbusiID] = useState(false)
  function handleShowActive(event) {
    const Cid = event.target.id
    const tmpIsActive = event.target.checked
    setIsActive(tmpIsActive)
    setShowActive(true)
    setTmpbusiID(Cid)
    setLoading(false)
  }
  function checkedFunction(temEmpId, temIsAct) {
    getServiceUpdateIsActive(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess == true) {
          fetchServices()
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

  return (
    <div className=''>
      <div
        className='card-header border-0 py-4 rounded shadow mb-4 text-white d-flex justify-content-between align-items-center'
        style={{backgroundColor: '#000000'}}
      >
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
        <Link to='/service/add' className='btn btn-sm btn-light-primary bg-white'>
          <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
          Add New
        </Link>
      </div>
      <div className='table-responsive'>
        <table className='table table-bordered table-hover'>
          <thead className='fs-5 bg-primary text-start'>
            <tr className='fw-bolder'>
              <th className='ps-5'>Business Name</th>
              <th className=''>Service Name</th>
              <th className='min-w-150px'>IsActive</th>
              {/* <th className=''>Email</th> */}
              {/* <th className='text-end pe-4'>Edit</th> */}
              <th className='text-end pe-2'>Edit | Delete</th>
            </tr>
          </thead>
          <tbody className='border-bottom'>
            {loading ? (
              <tr>
                <td colSpan='4'>
                  <div className='d-flex flex-column align-items-center justify-content-center py-4'>
                    <div className='spinner-border text-primary' role='status' />
                    <p className='mt-2'>Loading services...</p>
                  </div>
                </td>
              </tr>
            ) : filteredServices.length === 0 ? (
              <tr>
                <td>
                  {/* <div className='alert alert-warning text-center mb-0'>No business found.</div> */}
                  <BlankDataImageInTable
                    length={filteredServices.length}
                    loading={loading}
                    colSpan={4}
                  />
                </td>
              </tr>
            ) : (
              filteredServices.map((item) => (
                <tr key={item.serviceID}>
                  <td className='ps-5'>{item.businessName}</td>
                  <td>{item.serviceName}</td>
                  <td>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id={`${item.serviceID}`}
                        checked={item.isActive}
                        onChange={(e) => handleShowActive(e)}
                      />
                    </div>
                  </td>
                  <td className='text-center'>
                    <div className='d-flex justify-content-end gap-2 pe-2'>
                      <div
                        className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                        onClick={() => handleEdit(item.serviceID)}
                      >
                        <KTSVG
                          path='/media/icons/duotune/art/art005.svg'
                          className='svg-icon-3 svg-icon-primary'
                        />
                      </div>
                      <div
                        className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                        onClick={() => handleDelete(item.serviceID)}
                      >
                        <KTSVG
                          path='/media/icons/duotune/general/gen027.svg'
                          className='svg-icon-3 svg-icon-danger'
                        />
                      </div>
                    </div>
                  </td>
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
        pageName={'Business'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(tmpbusiID, isActive)}
      />
    </div>
  )
}

export default ServiceList
