import React, {useState} from 'react'
import {Modal, Button, Container, Row, Col} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import { IAgencyTypeModel } from '../../../models/master-page/IVenderModel'
import { addAgencyTypeByVendorTypeID } from '../../../modules/master-page/vender-master-page/VenderCRUD'


type Props = {
  show: boolean
  handleClose: () => void
  AgencyTypeData: IAgencyTypeModel[]
  ProductID: number
  productName: string
}

interface IProduct {}

const ModelPopUpAgencyType: React.FC<Props> = ({
  show,
  handleClose,
  AgencyTypeData,
  ProductID,
  productName,
}) => {
  const [state, setState] = useState<IProduct>({})

  // =================== For Agency Type ==========================
  function AgencyTypeItem(tech: IAgencyTypeModel[]) {
    let tmpTech = tech
    let strSelTechid: string = ''
    for (let k in tmpTech) {
      if (tmpTech[k].isMember === 1) {
        if (strSelTechid == '') {
          strSelTechid = `${tmpTech[k].agencyTypeID}`
        } else {
          strSelTechid = strSelTechid + ',' + `${tmpTech[k].agencyTypeID}`
        }
      }
    }
    addAgencyTypeByAgencyMstID(strSelTechid)
  }

  // ================= Add Agency Type Function =============
  function addAgencyTypeByAgencyMstID(technoIds: string) {
    addAgencyTypeByVendorTypeID(technoIds, ProductID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          handleClose()
          toast.success('Agency Type Created Successfully.', {position: 'top-center'})
        } else {
          toast.error(`${response.data.message}`, {position: 'top-center'})
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setState({...state, productMasterData: [], loading: false})
      })
  }

  // =================== For Asseccories ==============
  function SetStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpTechno = AgencyTypeData
    for (let k in tmpTechno) {
      if (uid == tmpTechno[k].agencyTypeID) {
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
      AgencyTypeData: tmpTechno,
    })
  }

  return (
    <Modal size='xl' show={show} onHide={handleClose} keyboard={false}>
      <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
        <Modal.Title className='text-white'>Agency Type List</Modal.Title>
        <h3 className='card-title align-items-start'>
          <span className='text-white card-label fs-5 mb-1'>Contact Person {' '}: </span>
          <span className='text-white card-label fw-bolder fs-3 mb-1 text-primary'>&nbsp;{productName}</span>
          {/* <span className='text-muted mt-1 fw-bold fs-7'>Over 500 Project Details</span> */}
        </h3>
      </Modal.Header>
      <Modal.Body>
        <div className={`card  box-shadow-0`}>
          <Container>
            <Row>
              {AgencyTypeData.length > 0 &&
                AgencyTypeData.map((item, index) => (
                  <Col xs={6} md={4}>
                    <div className='form-check form-check-custom form-check-solid mb-5'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id={`${item.agencyTypeID}`}
                        value={item.agencyTypeID}
                        name={item.agencyTypeName}
                        checked={item.isMember === 1 ? true : false}
                        onChange={(e) => SetStatus(e)}
                      />
                      <label className='form-check-label' htmlFor='flexCheckDefault'>
                        {item.agencyTypeName}
                      </label>
                    </div>
                  </Col>
                ))}
            </Row>
          </Container>
          {/* begin::Body */}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={() => AgencyTypeItem(AgencyTypeData)}>
          Submit
        </Button>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {ModelPopUpAgencyType}
