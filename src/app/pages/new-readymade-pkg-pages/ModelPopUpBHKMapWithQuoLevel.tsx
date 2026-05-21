import React, {useState, useEffect} from 'react'
import {Modal, Button, Container, Row, Col, Form, Spinner} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {
  IBhkMapModel,
  INewReadymadePkgModel,
} from '../../models/new-readymade-pkg/INewReadymadePkgModel'
import {AddBhkByReadymadePackageTypeMapApi} from '../../modules/new-readymade-pkg-mst-page/NewReadymadePackageCRUD'
import Loader from '../common-pages/Loader'
import {ShadowCardLoader} from './ShadowCardLoader'
import {ShadowCardBHKLoader} from './ShadowCardBHKLoader'

type Props = {
  show: boolean
  handleClose: () => void
  BhkMapData: IBhkMapModel[]
  readymadeTypeID: number
  ReadymadePackageType: string
}

interface IBhk {}

const ModelPopUpBHKMapWithQuoLevel: React.FC<Props> = ({
  show,
  handleClose,
  BhkMapData,
  readymadeTypeID,
  ReadymadePackageType,
}) => {
  const [state, setState] = useState<IBhk>({})
  const [filteredData, setFilteredData] = useState<IBhkMapModel[]>([])
  const [BhkData, setBhkData] = useState<IBhkMapModel[]>([])
  const [loading, setLoading] = useState<boolean>(false) // Loading state
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    if (show) {
      setBhkData(BhkMapData)
      setFilteredData(BhkMapData)
      setSearchTerm('')
    }
  }, [show, BhkMapData])

  // =================== For Accessories ==========================
  function bhkMapForDocument(tech: IBhkMapModel[]) {
    let tmpTech = tech
    let strSelTechid: string = ''
    for (let k in tmpTech) {
      if (tmpTech[k].isMember === 1) {
        if (strSelTechid === '') {
          strSelTechid = `${tmpTech[k].bhkID}`
        } else {
          strSelTechid = strSelTechid + ',' + `${tmpTech[k].bhkID}`
        }
      }
    }
    addBhkByReadyMadePkgMstID(strSelTechid)
  }

  // ================= Add DocumentType Category Function ==============
  function addBhkByReadyMadePkgMstID(technoIds: string) {
    AddBhkByReadymadePackageTypeMapApi(readymadeTypeID, technoIds)
      .then((response) => {
        if (response.data.isSuccess === true) {
          handleClose()
          toast.success('Bhk Created Successfully.', {position: 'top-center'})
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
    let tmpTechno = BhkMapData
    for (let k in tmpTechno) {
      if (uid == tmpTechno[k].bhkID) {
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
      BhkMapData: tmpTechno,
    })
  }
  return (
    <Modal size='lg' show={show} onHide={handleClose} keyboard={false}>
      <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
        <Modal.Title className='text-white'>Bhk Map List</Modal.Title>
        <h3 className='card-title align-items-start'>
          <span className='text-white card-label fs-5 mb-1'>Package Tye: </span>
          <span className='text-primary card-label fw-bolder fs-5 mb-1'>
            {' '}
            {ReadymadePackageType}
          </span>
        </h3>
      </Modal.Header>
      <Modal.Body>
        {/* <div className='card box-shadow-0'> */}
        {loading || filteredData.length === 0 ? (
          <ShadowCardBHKLoader />
        ) : (
          <Row>
            {BhkMapData.length > 0 &&
              BhkMapData.map((item) => (
                <Col xs={6} md={4}>
                  <div className={'form-check form-check-custom form-check-solid mb-5'}>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      id={`${item.bhkID}`}
                      name={item.bhkName}
                      checked={item.isMember === 1 ? true : false}
                      onChange={(e) => SetStatus(e)}
                    />
                    <label className='form-check-label' htmlFor='flexCheckDefault'>
                      {item.bhkName}
                    </label>
                  </div>
                </Col>
              ))}
          </Row>
        )}

        {/* </div> */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={() => bhkMapForDocument(BhkMapData)}>
          Submit
        </Button>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {ModelPopUpBHKMapWithQuoLevel}
