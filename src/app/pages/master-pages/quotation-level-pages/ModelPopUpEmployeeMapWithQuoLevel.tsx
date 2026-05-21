import React, {useState, useEffect} from 'react'
import {Modal, Button, Container, Row, Col, Form, Spinner} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {addEmployeeByProjectIDApi} from '../../../modules/project-master-page/project-master/ProjectCRUD'
import {IEmployeeQuoLevelMapModel} from '../../../models/master-page/IQuotationLevelModel'
import {addEmployeeByQuotationLevelIDApi} from '../../../modules/master-page/quotation-level-page/QuotationLevelCRUD'

type Props = {
  show: boolean
  handleClose: () => void
  EmployeeMapData: IEmployeeQuoLevelMapModel[]
  QuotationLevelID: number
  QuotationLevelName: string
}

interface IEmployee {}

const ModelPopUpEmployeeMapWithQuoLevel: React.FC<Props> = ({
  show,
  handleClose,
  EmployeeMapData,
  QuotationLevelID,
  QuotationLevelName,
}) => {
  const [state, setState] = useState<IEmployee>({})
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedRole, setSelectedRole] = useState<string>('Sales') // Role selection state with default value 'All'
  const [loading, setLoading] = useState<boolean>(false) // Loading state

  // =================== For Accessories ==========================
  function UserMapForDocument(tech: IEmployeeQuoLevelMapModel[]) {
    let tmpTech = tech
    let strSelTechid: string = ''
    for (let k in tmpTech) {
      if (tmpTech[k].isMember === 1) {
        if (strSelTechid === '') {
          strSelTechid = `${tmpTech[k].employeeID}`
        } else {
          strSelTechid = strSelTechid + ',' + `${tmpTech[k].employeeID}`
        }
      }
    }
    addDocCategoryByDocumentCtgryMstID(strSelTechid)
  }

  // ================= Add DocumentType Category Function ==============
  function addDocCategoryByDocumentCtgryMstID(technoIds: string) {
    addEmployeeByQuotationLevelIDApi(QuotationLevelID, technoIds)
      .then((response) => {
        if (response.data.isSuccess === true) {
          handleClose()
          toast.success('Employee Created Successfully.', {position: 'top-center'})
        } else {
          toast.error(`${response.data.message}`, {position: 'top-center'})
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setState({...state, DocumentTypeMasterData: [], loading: false})
      })
  }

  // =================== For Accessories ==============
  function SetStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpTechno = EmployeeMapData
    for (let k in tmpTechno) {
      if (uid == tmpTechno[k].employeeID) {
        if (isChecked) {
          tmpTechno[k].isMember = 1
        } else {
          tmpTechno[k].isMember = 0
        }
        break
      }
    }
    setState({
      ...state,
      EmployeeMapData: tmpTechno,
    })
  }

  // Filtered employee data based on search query and selected role
  const filteredEmployeeData = EmployeeMapData.filter((item) => item.roleName === 'Sales')
  // const matchesSearchQuery = item.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  // const matchesRole = selectedRole === 'Sales' && item.designationName === selectedRole // Role filter logic
  // return matchesSearchQuery && matchesRole
  // )

  // Unique roles for the filter buttons, with 'All' role included
  // const roles = ['All', ...Array.from(new Set(EmployeeMapData.map((item) => item.designationName)))]

  // Reset role selection when modal closes and set to 'All' if it's the first time opening
  // useEffect(() => {
  //   if (!show) {
  //     setSelectedRole('All') // Reset to "All" when modal closes
  //     setLoading(true) // Reset loading when modal is closed
  //   } else {
  //     // Simulate a delay for data loading
  //     setTimeout(() => {
  //       setLoading(false) // Set loading to false after data is "loaded"
  //     }, 1000)
  //   }
  // }, [show])

  return (
    <Modal size='xl' show={show} onHide={handleClose} keyboard={false}>
      <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
        <Modal.Title className='text-white'>Employee Map List</Modal.Title>
        <h3 className='card-title align-items-start'>
          <span className='text-white card-label fs-5 mb-1'>Quotation Level Name: </span>
          <span className='text-primary card-label fw-bolder fs-5 mb-1'> {QuotationLevelName}</span>
        </h3>
      </Modal.Header>
      <Modal.Body>
        <div className='card box-shadow-0'>
          <Container>
            {/* Search and Role Filter */}
            {/* <Row className='mb-3'>
              <Col md={6}>
                <Form.Control
                  type='text'
                  placeholder='Search Employee'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Col>
              <Col md={6}>
                <div className='d-flex flex-wrap justify-content-center'>
                  {roles.map((role, index) => (
                    <div
                      key={index}
                      className={`p-3 m-2 rounded cursor-pointer transition-all ease-in-out duration-300 transform ${
                        selectedRole === role
                          ? 'bg-primary text-white border-2 border-blue-600'
                          : 'bg-light text-blue-600 border-2 border-transparent hover:border-blue-600 hover:bg-transparent hover:text-blue-600'
                      }`}
                      onClick={() => setSelectedRole(role)}
                    >
                      {role}
                    </div>
                  ))}
                </div>
              </Col>
            </Row> */}

            {/* Loading State */}
            {loading ? (
              <div className='d-flex justify-content-center my-5'>
                <Spinner animation='border' variant='primary' />
              </div>
            ) : (
              <Row>
                {filteredEmployeeData.length > 0 &&
                  filteredEmployeeData.map((item) => (
                    <Col xs={6} md={4} key={item.employeeID}>
                      <div className={'form-check form-check-custom form-check-solid mb-5'}>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id={`${item.employeeID}`}
                          value={item.employeeID}
                          name={item.employeeName}
                          checked={item.isMember === 1 ? true : false}
                          onChange={(e) => SetStatus(e)}
                        />
                        <label className='form-check-label' htmlFor='flexCheckDefault'>
                          <span className={item.isActive == true ? 'text-dark' : 'text-danger'}>
                            {item.employeeName}
                          </span>
                          {/* &nbsp;&nbsp;{'('}
                          {item.designationName}
                          {')'} */}
                        </label>
                      </div>
                    </Col>
                  ))}
              </Row>
            )}
          </Container>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={() => UserMapForDocument(EmployeeMapData)}>
          Submit
        </Button>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {ModelPopUpEmployeeMapWithQuoLevel}
