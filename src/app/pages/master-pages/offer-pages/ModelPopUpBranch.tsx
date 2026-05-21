import React, {useState} from 'react'
import {Modal, Button, Container, Row, Col} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {IBranchModelForOfferMap} from '../../../models/master-page/IOfferModel'
import {AddBranchByOfferIDAPI} from '../../../modules/master-page/offer-master-page/OfferCRUD'

type Props = {
  show: boolean
  handleClose: () => void
  branchData: IBranchModelForOfferMap[]
  offerID: number
  offerTitle: string
}

interface IProduct {}

const ModelPopUpBranch: React.FC<Props> = ({
  show,
  handleClose,
  branchData,
  offerID,
  offerTitle,
}) => {
  const [state, setState] = useState<IProduct>({})

  // =================== For Area ==========================
  function BranchOfferItem(tech: IBranchModelForOfferMap[]) {
    let tmpTech = tech
    let strSelTechid: string = ''
    for (let k in tmpTech) {
      if (tmpTech[k].isBranch === 1) {
        if (strSelTechid == '') {
          strSelTechid = `${tmpTech[k].branchID}`
        } else {
          strSelTechid = strSelTechid + ',' + `${tmpTech[k].branchID}`
        }
      }
    }
    addBranchByOfferID(strSelTechid)
  }

  // ================= Add Area Function =============
  function addBranchByOfferID(technoIds: string) {
    AddBranchByOfferIDAPI(technoIds, offerID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          handleClose()
          toast.success('Branch Updated Successfully.', {position: 'top-center'})
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
    let tmpTechno = branchData
    for (let k in tmpTechno) {
      if (uid == tmpTechno[k].branchID) {
        if (isChecked) {
          tmpTechno[k].isBranch = 1
        } else {
          tmpTechno[k].isBranch = 0
        }
        break
      }
    }
    setState({
      ...state,
      branchData: tmpTechno,
    })
  }

  return (
    <Modal size='xl' show={show} onHide={handleClose} keyboard={false}>
      <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
        <Modal.Title className='text-white'>Branch List</Modal.Title>
        <h3 className='card-title align-items-start'>
          <span className='text-white card-label fs-5 mb-1'>Offer Title :- </span>
          <span className='text-white card-label fw-bolder fs-3 mb-1'>{offerTitle}</span>
          {/* <span className='text-muted mt-1 fw-bold fs-7'>Over 500 Project Details</span> */}
        </h3>
      </Modal.Header>
      <Modal.Body>
        <div className={`card box-shadow-0`}>
          <Container>
            <Row>
              {branchData.length > 0 &&
                branchData.map((item, index) => (
                  <Col xs={6} md={4} key={index}>
                    <div className='form-check form-check-custom form-check-solid mb-5'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id={`${item.branchID}`}
                        value={item.branchID}
                        name={item.branchName}
                        checked={item.isBranch === 1 ? true : false}
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
        <Button variant='primary' onClick={() => BranchOfferItem(branchData)}>
          Submit
        </Button>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {ModelPopUpBranch}
