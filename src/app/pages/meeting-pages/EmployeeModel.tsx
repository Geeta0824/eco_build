import React, {useState} from 'react'
import {Modal, Button, Container, Row, Col} from 'react-bootstrap-v5'

import {toast} from 'react-toastify'
import { IEmployeeMapModel } from '../../models/projects-page/IProjectsModel'
import LoaderInTable from '../common-pages/LoaderInTable'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'


type Props = {
  show: boolean
  loading: boolean
  handleClose: () => void
  employeeMapData: IEmployeeMapModel[]
  serviceCenterID: number
  serviceCenterName: string
}

interface IProduct {}

const EmployeeModel: React.FC<Props> = ({
  show,
  loading,
  handleClose,
  employeeMapData,
  serviceCenterID,
  serviceCenterName,
}) => {
  const [state, setState] = useState<IProduct>({})

  // =================== For Area ==========================
  function AreaItem(tech: IEmployeeMapModel[]) {
    let tmpTech = tech
    let strSelTechid: string = ''
    for (let k in tmpTech) {
      if (tmpTech[k].isMember === 1) {
        if (strSelTechid == '') {
          strSelTechid = `${tmpTech[k].employeeID}`
        } else {
          strSelTechid = strSelTechid + ',' + `${tmpTech[k].employeeID}`
        }
      }
    }
    addEmployee(strSelTechid)
  }

  // ================= Add Area Function =============
  function addEmployee(employeeIDs: string) {
    // EmployeeMapWithPickupAndDropPointServiceCenter(serviceCenterID, employeeIDs)
    //   .then((response) => {
    //     if (response.data.isSuccess === true) {
    //       handleClose()
    //       toast.success('Area Updated Successfully.', {position: 'top-center'})
    //     } else {
    //       toast.error(`${response.data.message}`, {position: 'top-center'})
    //     }
    //   })
    //   .catch((error) => {
    //     toast.error(`${error}`, {position: 'top-center'})
    //     setState({...state, productMasterData: [], loading: false})
    //   })
  }

  // ============= For Area ==============
  function SetStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpTechno = employeeMapData
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
      employeeMapData: tmpTechno,
    })
  }
  
  return (
    <Modal size='xl' show={show} onHide={handleClose} loading={loading} keyboard={false}>
      <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
        <Modal.Title className='text-white'> Employee List</Modal.Title>
        <h3 className='card-title align-items-start'>
          <span className='text-white card-label fs-5 mb-1'>Service Center Name:- </span>
          <span className='text-white card-label fw-bolder fs-4 mb-1'>{serviceCenterName}</span>
          {/* <span className='text-muted mt-1 fw-bold fs-7'>Over 500 Project Details</span> */}
        </h3>
      </Modal.Header>
      <Modal.Body>
        <div className={`card box-shadow-0`}>
          <Container>
            <Row>
              <LoaderInTable loading={loading} column={9} />
              {employeeMapData.length > 0 &&
                employeeMapData.map((item, index) => (
                  <Col xs={6} md={4} key={index}>
                    <div className='form-check form-check-custom form-check-solid mb-10'>
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
                        {item.employeeName}
                      </label>
                    </div>
                  </Col>
                ))}
              <BlankDataImageInTable
                length={employeeMapData.length}
                loading={loading}
                colSpan={5}
              />
            </Row>
          </Container>
          {/* begin::Body */}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant='primary' onClick={() => AreaItem(employeeMapData)}>
          Submit
        </Button>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {EmployeeModel}
