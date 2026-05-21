import React, {useState} from 'react'
import {Modal, Button, Container, Row, Col} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {ITurnkeyPaymentStrByBranchModel} from '../../../models/master-page/ITurnkeyPaymentStructureModel'
import {addBranchByTurnkeyProjPaymentStageApi} from '../../../modules/master-page/turnkey-payment-structure-master-page/TurnkeyPaymentStructureCRUD'

type Props = {
  show: boolean
  handleClose: () => void
  trunkeyPayStrBranchMapData: ITurnkeyPaymentStrByBranchModel[]
  turnkeyProjPaymentStageID: number
  projectType: string
  projectTypeID: number
  stageName: string
}

interface IProduct {}

const TurnkeyPayStrucBranchMap: React.FC<Props> = ({
  show,
  handleClose,
  trunkeyPayStrBranchMapData,
  turnkeyProjPaymentStageID,
  projectType,
  projectTypeID,
  stageName,
}) => {
  const [state, setState] = useState<IProduct>({})

  // =================== For Branch ==========================
  function trunkeyPmpStrBranchItem(tech: ITurnkeyPaymentStrByBranchModel[]) {
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
    addBranchByTurnkeyProjPaymentStageID(strSelTechid)
  }

  // ================= Add Branch Function =============
  function addBranchByTurnkeyProjPaymentStageID(technoIds: string) {
    addBranchByTurnkeyProjPaymentStageApi(turnkeyProjPaymentStageID,projectTypeID, technoIds)
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
        setState({...state, trunkeyPayStrBranchMapData: [], loading: false})
      })
  }

  // =================== For Branch ==============
  function SetStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpTechno = trunkeyPayStrBranchMapData
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
      trunkeyPayStrBranchMapData: tmpTechno,
    })
  }

  return (
    <Modal size='lg' show={show} onHide={handleClose} keyboard={false}>
      <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
        {/* <Modal.Title className='text-white'>Branch List</Modal.Title> */}
        <h3 className='justify-content-between'>
          <span className='text-white card-label fs-5'>Project Type : </span>
          <span className='text-primary card-label fw-bolder fs-4'>{projectType}</span>
          <br />
          <span className='text-white card-label fs-5'>Stage Name : </span>
          <span className='text-primary card-label fw-bolder fs-4'>{stageName}</span>
        </h3>
      </Modal.Header>
      <Modal.Body>
        <div className={`card  box-shadow-0`}>
          <Container>
            <Row>
              {trunkeyPayStrBranchMapData.length > 0 &&
                trunkeyPayStrBranchMapData.map((item, index) => (
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
          onClick={() => trunkeyPmpStrBranchItem(trunkeyPayStrBranchMapData)}
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

export {TurnkeyPayStrucBranchMap}
