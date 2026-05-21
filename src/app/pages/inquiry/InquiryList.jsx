import React, {useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {KTSVG} from '../../../_Ecd/helpers'
import {deleteInquiryDtls, getInquiryList} from '../../modules/career-master-page/CareerCRUD'
import {toast} from 'react-toastify'
import {ModelPopUpIsActive} from '../common-pages/ModelPopUpIsActive'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'
import {Button, Modal} from 'react-bootstrap-v5'

const InquiryList = () => {
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [inquiryData, setInquiryData] = useState([])
  const [filteredInquiry, setFilteredInquiry] = useState([])
  const history = useHistory()
  useEffect(() => {
    getInquiryDataList()
  }, [])

  useEffect(() => {
    const filtered = inquiryData.filter((i) => {
      const term = searchText.toLowerCase()
      return (
        i.businessName?.toLowerCase().includes(term) ||
        i.personName?.toLowerCase().includes(term) ||
        i.personMessage?.toLowerCase().includes(term)
      )
    })

    setFilteredInquiry(filtered)
  }, [searchText, inquiryData])

  const getInquiryDataList = async () => {
    try {
      const response = await getInquiryList()
      if (response.data?.isSuccess) {
        const inquiryArray = response.data.responseObject || []
        setInquiryData(inquiryArray)
      } else {
        toast.error('API returned success = false:', response.data.message)
      }
    } catch (error) {
      toast.error('Error fetching inquiry:', error)
    } finally {
      setLoading(false)
    }
  }

  // =================Is Active Function Model Call==============
  const [showActive, setShowActive] = useState(false)
  const handleCloseActive = () => setShowActive(false)

  //   function handleShowActive(event) {
  //     const Cid = event.target.id
  //     const tmpIsActive = event.target.checked
  //     setIsActive(tmpIsActive)
  //     setShowActive(true)
  //     setTmpbusiID(Cid)
  //     setLoading(false)
  //   }

  //   function checkedFunction(temEmpId, temIsAct) {
  //     getCareerUpdateIsActive(temEmpId, temIsAct)
  //       .then((response) => {
  //         if (response.data.isSuccess == true) {
  //           getInquiryDataList()
  //           setShowActive(false)
  //         } else {
  //           toast.error(`${response.data.message}`)
  //           setShowActive(false)
  //         }
  //       })
  //       .catch((error) => {
  //         toast.error(`${error}`)
  //         setShowActive(false)
  //       })
  //   }

  //   const handleEdit = (id) => {
  //     history.push(`/career/edit/${id}`)
  //     console.log('get Id', id.event.id)
  //   }

  const handleDelete = async (inquiryID) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this inquiry?')
    if (!confirmDelete) return
    try {
      const res = await deleteInquiryDtls(inquiryID)
      if (res?.data?.isSuccess) {
        toast.success('Inquiry Deleted Successfully')
        getInquiryDataList()
        // Optional: Refresh list here
      } else {
        toast.error('Failed to delete inquiry')
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
        {/* <Link to='/career/add' className='btn btn-sm btn-light-primary bg-white'>
          <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
          Add New
        </Link> */}
      </div>
      <div className='table-responsive'>
        <table className='table table-bordered table-hover'>
          <thead className='fs-5 bg-primary text-start'>
            <tr className='fw-bolder'>
              {/* <th>#</th> */}
              <th className='ps-2'>Business Name</th>
              <th className='ps-2'>Service Name</th>
              <th className=''>Full Name</th>
              <th className=''>Contact No.</th>
              <th>Email ID</th>
              <th className=''>Message</th>
              <th className='text-end pe-2'>Delete</th>
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
            ) : filteredInquiry.length === 0 ? (
              <tr>
                <td>
                  {/* <div className='alert alert-warning text-center mb-0'>No business found.</div> */}
                  <BlankDataImageInTable
                    length={filteredInquiry.length}
                    loading={loading}
                    colSpan={5}
                  />
                </td>
              </tr>
            ) : (
              filteredInquiry?.map((inquiry, index) => (
                <tr key={index}>
                  <td className='ps-2'>{inquiry.businessName}</td>
                  <td className='ps-2'>{inquiry.serviceName ? inquiry.serviceName : 'N.A.'}</td>
                  <td className=''>{inquiry.personName}</td>
                  <td className=''>{inquiry.personContactNumber}</td>
                  <td className=''>{inquiry.personEmailID ? inquiry.personEmailID : '-'}</td>
                  <td>{inquiry.personMessage ? inquiry.personMessage : '-'}</td>

                  {/* <td>
                    <div className='form-check form-switch'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id={`${career.carrerID}`}
                        checked={career.isActive}
                        onChange={(e) => handleShowActive(e)}
                      />
                    </div>
                  </td>{' '} */}
                  <td className='text-center'>
                    <div className='d-flex justify-content-end gap-2 pe-2'>
                      <div
                        className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                        onClick={() => handleDelete(inquiry.inquiryID)}
                      >
                        <KTSVG
                          path='/media/icons/duotune/general/gen027.svg'
                          className='ssvg-icon-3 svg-icon-danger'
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
      {/* <ModelPopUpIsActive
        activeID={tmpbusiID}
        activeType={isActive}
        pageName={'Career'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(tmpbusiID, isActive)}
      /> */}
    </>
  )
}

export default InquiryList
