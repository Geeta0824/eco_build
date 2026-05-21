import React, {useState} from 'react'
import {Modal, Button, Container, Row, Col} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import { IAreaProductModel } from '../../../models/carpetry-page/ITurnkeyProductMasterModel'
import { AddTurnkeyAreaByProductIDApi } from '../../../modules/carpetry-master-page/carpetry-product-master-master-page/CarpetryProductMasterCRUD'

type Props = {
  show: boolean
  handleClose: () => void
  areaMapData: IAreaProductModel[]
  ProductID: number
  productName: string
}

interface IProduct {}

const ModelPopUpTurnkeyPlanArea: React.FC<Props> = ({
  show,
  handleClose,
  areaMapData,
  ProductID,
  productName,
}) => {
  const [state, setState] = useState<IProduct>({})

  // =================== For Area ==========================
  function AreaProjectItem(tech: IAreaProductModel[]) {
    let tmpTech = tech
    let strSelTechid: string = ''
    for (let k in tmpTech) {
      if (tmpTech[k].isMember === 1) {
        if (strSelTechid == '') {
          strSelTechid = `${tmpTech[k].areaID}`
        } else {
          strSelTechid = strSelTechid + ',' + `${tmpTech[k].areaID}`
        }
      }
    }
    addAreaByTurnkeyProductMstID(strSelTechid)
  }

  // ================= Add Area Function =============
  function addAreaByTurnkeyProductMstID(technoIds: string) {
    AddTurnkeyAreaByProductIDApi(technoIds, ProductID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          handleClose()
          toast.success('Area Updated Successfully.', {position: 'top-center'})
        } else {
          toast.error(`${response.data.message}`, {position: 'top-center'})
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setState({...state, productMasterData: [], loading: false})
      })
  }

  // =================== For Area ==============
  function SetStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpTechno = areaMapData
    for (let k in tmpTechno) {
      if (uid == tmpTechno[k].areaID) {
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
      areaMapData: tmpTechno,
    })
  }

  return (
    <Modal size='xl' show={show} onHide={handleClose} keyboard={false}>
      <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
        <Modal.Title className='text-white'>Trunkey Plan Area List</Modal.Title>
        <h3 className='card-title align-items-start'>
          <span className='text-white card-label fs-5 mb-1'>Product Name :- </span>
          <span className='text-white card-label fw-bolder fs-3 mb-1'>{productName}</span>
          {/* <span className='text-muted mt-1 fw-bold fs-7'>Over 500 Project Details</span> */}
        </h3>
      </Modal.Header>
      <Modal.Body>
        <div className={`card box-shadow-0`}>
          <Container>
            <Row>
              {areaMapData.length > 0 &&
                areaMapData.map((item, index) => (
                  <Col xs={6} md={4} key={index}>
                    <div className='form-check form-check-custom form-check-solid mb-5'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id={`${item.areaID}`}
                        value={item.areaID}
                        name={item.areaName}
                        checked={item.isMember === 1 ? true : false}
                        onChange={(e) => SetStatus(e)}
                      />
                      <label className='form-check-label' htmlFor='flexCheckDefault'>
                        {item.areaName}
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
        <Button variant='primary' onClick={() => AreaProjectItem(areaMapData)}>
          Submit
        </Button>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {ModelPopUpTurnkeyPlanArea}
