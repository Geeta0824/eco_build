import React, {useState} from 'react'
import {Modal, Button, Container, Row, Col} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {addBranchByDNCPaymentStageApi} from '../../../modules/master-page/dnc-payment-structure-master-page/DNCPaymentStructureCRUD'
import {IDNCPmtStageByBranchModel} from '../../../models/master-page/IDNCPaymentStructureModel'

type Props = {
  show: boolean
  handleClose: () => void
  dncPmtStageBranchMapData: IDNCPmtStageByBranchModel[]
  dncProjPaymentStageID: number
  stageName: string
}

interface IProduct {}

const DNCPayStructureBranchMap: React.FC<Props> = ({
  show,
  handleClose,
  dncPmtStageBranchMapData,
  dncProjPaymentStageID,
  stageName,
}) => {
  const [state, setState] = useState<IProduct>({})

  // =================== For Asseccories ==========================
  function trunkeyPmpStrBranchItem(tech: IDNCPmtStageByBranchModel[]) {
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
    addBranchByDNCPaymentStageID(strSelTechid)
  }

  // ================= Add Asseccories Function =============
  function addBranchByDNCPaymentStageID(technoIds: string) {
    addBranchByDNCPaymentStageApi(dncProjPaymentStageID, technoIds)
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

  // =================== For Asseccories ==============
  function SetStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpTechno = dncPmtStageBranchMapData
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
      dncPmtStageBranchMapData: tmpTechno,
    })
  }

  return (
    <Modal size='lg' show={show} onHide={handleClose} keyboard={false}>
      <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
        <h3 className='justify-content-center'>
          <span className='text-white fs-5'>Stage Name : </span>
          <span className='text-primary fw-bolder fs-4'>{stageName}</span>
        </h3>
      </Modal.Header>
      <Modal.Body>
        <div className={`card  box-shadow-0`}>
          <Container>
            <Row>
              {dncPmtStageBranchMapData.length > 0 &&
                dncPmtStageBranchMapData.map((item, index) => (
                  <Col xs={6} md={4}>
                    <div key={index} className='form-check form-check-custom form-check-solid mb-5'>
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
        <Button variant='primary' onClick={() => trunkeyPmpStrBranchItem(dncPmtStageBranchMapData)}>
          Submit
        </Button>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {DNCPayStructureBranchMap}
