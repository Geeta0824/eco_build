import React, {useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {KTSVG} from '../../../_Ecd/helpers'
import {
  deleteBusinessDetails,
  getBusinessList,
  getBusinessUpdateIsActive,
} from '../../modules/business-master-page/BusinessCRUD'
import {toast} from 'react-toastify'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'
import {ModelPopUpIsActive} from '../common-pages/ModelPopUpIsActive'

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([])
  const [filteredBusinesses, setFilteredBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const history = useHistory()

  useEffect(() => {
    fetchBusinesses()
  }, [])

  useEffect(() => {
    const filtered = businesses.filter((b) => {
      const term = searchText.toLowerCase()
      return (
        b.businessName?.toLowerCase().includes(term) ||
        b.businessEmailID?.toLowerCase().includes(term) ||
        b.businessContactNo?.toLowerCase().includes(term)
      )
    })

    setFilteredBusinesses(filtered)
  }, [searchText, businesses])

  const fetchBusinesses = async () => {
    try {
      const response = await getBusinessList()
      if (response.data?.isSuccess) {
        const businessArray = response.data.responseObject || []
        setBusinesses(businessArray)
      } else {
        toast.error('API returned success = false:', response.data.message)
      }
    } catch (error) {
      toast.error('Error fetching businesses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id) => {
    history.push(`/business/edit/${id}`)
    console.log('get Id', id)
  }
  const handleDelete = async (businessID) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this business?')
    if (!confirmDelete) return

    try {
      const res = await deleteBusinessDetails(businessID)
      if (res?.data?.isSuccess) {
        toast.success('Business Deleted Successfully')
        fetchBusinesses()
        // Optional: Refresh list here
      } else {
        toast.error('Failed to delete business')
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
    getBusinessUpdateIsActive(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess == true) {
          fetchBusinesses()
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
      {/* Header with search and add button */}
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
        <Link to='/business/add' className='btn btn-sm btn-light-primary bg-white'>
          <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
          Add New
        </Link>
      </div>

      {/* Search box */}

      {/* Business List Table */}

      <div className='table-responsive'>
        <table className='table table-bordered table-hover'>
          <thead className='fs-5 bg-primary text-start'>
            <tr className='fw-bolder'>
              {/* <th className='fw-bold'>#</th> */}
              <th className='ps-5'>Business Name</th>
              <th className=''>Phone Number</th>
              <th className=''>Email</th>
              <th className='min-w-150px'>IsActive</th>
              <th className='text-end pe-2'>Edit</th>
              {/* <th className='text-end pe-2'>Edit | Delete</th> */}
            </tr>
          </thead>
          <tbody className='border-bottom'>
            {loading ? (
              <tr>
                <td colSpan='4'>
                  <div className='d-flex flex-column align-items-center justify-content-center ps-2 py-4'>
                    <div className='spinner-border text-primary' role='status' />
                    <p className='mt-2'>Loading business...</p>
                  </div>
                </td>
              </tr>
            ) : filteredBusinesses.length === 0 ? (
              <tr>
                <td>
                  {/* <div className='alert alert-warning text-center mb-0'>No business found.</div> */}
                  <BlankDataImageInTable
                    length={filteredBusinesses.length}
                    loading={loading}
                    colSpan={5}
                  />
                </td>
              </tr>
            ) : (
              filteredBusinesses.map((business, index) => (
                <tr key={business.businessID}>
                  {/* <td>{index + 1}</td> */}
                  <td className='ps-5'>{business.businessName}</td>
                  <td>{business.businessContactNo}</td>
                  <td>{business.businessEmailID}</td>
                  <td>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id={`${business.businessID}`}
                        checked={business.isActive}
                        onChange={(e) => handleShowActive(e)}
                      />
                    </div>
                  </td>
                  {/* <td>
                    {' '}
                    <div
                      style={{maxHeight: '100px', overflowY: 'auto'}}
                      dangerouslySetInnerHTML={{__html: business.sortDescription}}
                    />
                  </td>
                  <td>
                    <div
                      style={{maxHeight: '100px', overflowY: 'auto'}}
                      dangerouslySetInnerHTML={{__html: business.description}}
                    />
                  </td> */}
                  <td className='text-center'>
                    <div className='d-flex justify-content-end gap-2 pe-2'>
                      <div
                        className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                        onClick={() => handleEdit(business.businessID)}
                      >
                        <KTSVG
                          path='/media/icons/duotune/art/art005.svg'
                          className='svg-icon-3 svg-icon-primary'
                        />
                      </div>
                      {/* <div
                        className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                        onClick={() => handleDelete(business.businessID)}
                      >
                        <KTSVG
                          path='/media/icons/duotune/general/gen027.svg'
                          className='ssvg-icon-3 svg-icon-danger'
                        />
                      </div> */}
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

export default BusinessList
