import React from 'react'
import {Modal, Button} from 'react-bootstrap-v5'
import {KTSVG} from '../../../../_Ecd/helpers'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {Pagination} from 'antd'

interface EmployeeModalProps {
  show: boolean
  handleClose: () => void
  projectData: any[]
  filterByString: (e: any) => void
  selectProject: (project: any) => void
  loading: boolean
  proName: string
  setPage: (value: any) => void
  postPerPage: number
  total: number
  page: number
  onShowSizeChange: (current: any, pageSize: any) => void
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  show,
  handleClose,
  projectData,
  filterByString,
  selectProject,
  loading,
  proName,
  setPage,
  postPerPage,
  total,
  page,
  onShowSizeChange,
}) => {
  return (
    <Modal size='xl' scrollable={true} show={show} onHide={handleClose}>
      <div style={{backgroundColor: '#2a3952'}}>
        <Modal.Header closeButton>
          <Modal.Title style={{color: 'white'}}>Employee Data</Modal.Title>
          <div className='border-0 pt-4' id='kt_chat_contacts_header'>
            <form className='w-100 position-relative' autoComplete='off'>
              <KTSVG
                path='/media/icons/duotune/general/gen021.svg'
                className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
              />
              <input
                type='text'
                className='form-control form-control-solid px-15 bg-white'
                placeholder='Search'
                onChange={filterByString}
                value={proName}
              />
            </form>
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
                <tr className='fw-bolder fs-5 bg-primary rounded'>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1 ps-1'>Employee Name</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Deparment</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Designation</span>
                  </th>
                  <th className='min-w-150px'>
                    <span className='d-block mb-1'>Mobile</span>
                  </th>
                  <th className='min-w-50px text-end pe-1'>
                    <span className='mb-1'>Email</span>
                  </th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {projectData.length > 0 &&
                  projectData.map((data, index) => {
                    return (
                      <tr
                        key={index}
                        className={
                          // data.isActive === false
                          //   ? 'd-none'
                          //   :
                          'bg-hover-light-primary text-hover-primary'
                        }
                        onClick={() => selectProject(data)}
                      >
                        <td>
                          <span className='text-hover-primary d-block ps-1'>
                            {data.firstName + ' ' + data.lastName}
                          </span>
                        </td>
                        <td>
                          <span className='text-hover-primary d-block'>{data.departmentName}</span>
                        </td>
                        <td>
                          <span className='text-hover-primary d-block'>{data.designationName}</span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block'>
                            {data.contactNumber}
                          </span>
                        </td>
                        <td className='min-w-50 text-end pe-1'>
                          <span className='text-dark text-hover-primary'>{data.email}</span>
                        </td>
                      </tr>
                    )
                  })}
                {/* =================== Loading get Api Data ============== */}
                <BlankDataImageInTable length={projectData.length} loading={loading} colSpan={9} />
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

export default EmployeeModal
