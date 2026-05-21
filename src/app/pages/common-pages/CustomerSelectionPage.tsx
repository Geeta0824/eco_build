import React, {useEffect, useState} from 'react'
import {Modal, Button} from 'react-bootstrap-v5'
import {KTSVG} from '../../../_Ecd/helpers'
import {ICustomerPageModel} from '../../models/organization-page/customer/ICustomenrModel'
import {Pagination} from 'antd'

type Props = {
  show: boolean
  customerData: ICustomerPageModel[]
  handleClose: () => void
  selectCustomer: (_customerData: ICustomerPageModel) => void
}

const CustomerSelectionPage: React.FC<Props> = ({
  show,
  customerData,
  handleClose,
  selectCustomer
}) => {
  const [tmpCustomerData, setTmpCustomerData] = useState<ICustomerPageModel[]>(customerData)

  useEffect(() => {
    // setLoading(true)
    setTimeout(() => {
      setTotal(customerData.length)
    }, 100)
  }, [])

  // =================-------------------------- Pagination --------------------------===================
  // const [posts, setPosts] = useState([])  // data
  const [total, setTotal] = useState(customerData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)

  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: ICustomerPageModel[] = tmpCustomerData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = customerData.filter((user) => {
        return (
          user.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.lastName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setTmpCustomerData(results)
      setTotal(results.length)
    } else {
      setTmpCustomerData(customerData)
      // If the text field is empty, show all users
      setTotal(customerData.length)
    }
    setName(keyword)
  }

  return (
    <Modal size='xl' scrollable={true} show={show} onHide={handleClose}>
      <div style={{backgroundColor: '#2a3952'}}>
        <Modal.Header closeButton>
          <Modal.Title style={{color: 'white'}}>Customer Data</Modal.Title>
          <div className='border-0 pt-4' id='kt_chat_contacts_header'>
            <span className='w-100 position-relative'>
              <KTSVG
                path='/media/icons/duotune/general/gen021.svg'
                className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
              />
              <input
                type='text'
                className='form-control form-control-solid px-15 bg-light-primary'
                // name='search'
                placeholder='Search'
                onChange={(e) => filter(e)}
                value={name}
              />
            </span>
          </div>
        </Modal.Header>
      </div>
      <Modal.Body>
        <div className='card-body py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
              {/* begin::Table head */}
              <thead>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-125px'>
                    <span className='d-block mb-1 ps-2'>Name</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Mobile Number</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Email</span>
                  </th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr
                        key={index}
                        className='bg-hover-light-primary text-hover-primary'
                        onClick={() => selectCustomer(data)}
                      >
                        <td>
                          <span className='text-dark text-hover-primary d-block ps-2 mb-1 fs-6'>
                            {data.fullName}
                          </span>
                        </td>
                        <td className=''>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.terminalCode}
                          </span>
                        </td>
                        <td className=''>
                          <span className='text-dark text-hover-primary d-block mb-1 fs-6'>
                            {data.balance}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
          <div className='text-center'>
            <Pagination
              onChange={(value: any) => setPage(value)}
              pageSize={postPerPage}
              total={total}
              current={page}
              showSizeChanger
              showQuickJumper
              onShowSizeChange={onShowSizeChange}
              showTotal={(total) => `Total ${total} items`}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {CustomerSelectionPage}
