import React, {useState} from 'react'
import {Modal, Button, Container, Row, Col} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {addBranchByModularPaymentStageApi} from '../../../modules/master-page/modular-payment-structure/ModularPaymentStructureCRUD'
import {IModularPmtStageByBranchModel} from '../../../models/master-page/IModularPaymentSystemModel'

type Props = {
  show: boolean
  handleClose: () => void
  modularPmtStageBranchMapData: IModularPmtStageByBranchModel[]
  modularProjPaymentStageID: number
  stageName: string
}
interface IProduct {}
const ModularPayStrucBranchMap: React.FC<Props> = ({
  show,
  handleClose,
  modularPmtStageBranchMapData,
  modularProjPaymentStageID,
  stageName,
}) => {
  const [state, setState] = useState<IProduct>({})

  // =================== For Branch ==========================
  function trunkeyPmpStrBranchItem(tech: IModularPmtStageByBranchModel[]) {
    let tmpTech = tech
    let strSelTechid: string = ''
    for (let k in tmpTech) {
      if (tmpTech[k].isMember === 1) {
        if (strSelTechid == '') {
          strSelTechid = `${tmpTech[k].branchID}`
        } else {
          strSelTechid = strSelTechid + ',' + `${tmpTech[k].branchID}`
        }
      }
    }
    addBranchByModularPaymentStageID(strSelTechid)
  }

  // ================= Add Branch Function =============
  function addBranchByModularPaymentStageID(technoIds: string) {
    addBranchByModularPaymentStageApi(modularProjPaymentStageID, technoIds)
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.success('Branch Updated Successfully.', {position: 'top-center'})
          handleClose()
        } else {
          toast.error(`${response.data.message}`, {position: 'top-center'})
          handleClose()
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setState({...state, modularPayStrBranchMapData: [], loading: false})
      })
  }

  // =================== For Branch ==============
  function SetStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpTechno = modularPmtStageBranchMapData
    for (let k in tmpTechno) {
      if (uid == tmpTechno[k].branchID) {
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
      modularPmtStageBranchMapData: tmpTechno,
    })
  }

  return (
    <Modal size='lg' show={show} onHide={handleClose} keyboard={false}>
      <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
        {/* <Modal.Title className='text-white'>Accessories List</Modal.Title> */}
        <h3 className='justify-content-center'>
          <span className='text-white fs-5'>Stage Name : </span>
          <span className='text-primary fw-bolder fs-4'>{stageName}</span>
          {/* <span className='text-muted mt-1 fw-bold fs-7'>Over 500 Project Details</span> */}
        </h3>
      </Modal.Header>
      <Modal.Body>
        <div className={`card  box-shadow-0`}>
          <Container>
            <Row>
              {modularPmtStageBranchMapData.length > 0 &&
                modularPmtStageBranchMapData.map((item, index) => (
                  <Col xs={6} md={4}>
                    <div className='form-check form-check-custom form-check-solid mb-5'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id={`${item.branchID}`}
                        value={item.branchID}
                        name={item.branchName}
                        checked={item.isMember === 1 ? true : false}
                        onChange={(e) => SetStatus(e)}
                      />
                      <label className='form-check-label' htmlFor='flexCheckDefault'>
                        {item.branchName}
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
        <Button
          variant='primary'
          onClick={() => trunkeyPmpStrBranchItem(modularPmtStageBranchMapData)}
        >
          Submit
        </Button>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {ModularPayStrucBranchMap}
