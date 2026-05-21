import React, {useState} from 'react'
import {Modal, Button, Container, Row, Col} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {AddProductCategoryByAgencyTypeIDApi} from '../../../modules/product-master-page/agency-type-master-page/AgencyTypeCRUD'
import {IProductCategoryTypeModel} from '../../../models/product-page/IAgencyTypeModel'

type Props = {
  show: boolean
  handleClose: () => void
  ProdCategoryMapData: IProductCategoryTypeModel[]
  ProductID: number
  productName: string
}

interface IProduct {}

const ModelPopUpProdCategoryMap: React.FC<Props> = ({
  show,
  handleClose,
  ProdCategoryMapData,
  ProductID,
  productName,
}) => {
  const [state, setState] = useState<IProduct>({})

  // =================== For Asseccories ==========================
  function ProdCategoryProjectItem(tech: IProductCategoryTypeModel[]) {
    let tmpTech = tech
    let strSelTechid: string = ''
    for (let k in tmpTech) {
      if (tmpTech[k].isMember === 1) {
        if (strSelTechid == '') {
          strSelTechid = `${tmpTech[k].productCategoryID}`
        } else {
          strSelTechid = strSelTechid + ',' + `${tmpTech[k].productCategoryID}`
        }
      }
    }
    addProdCategoryByProductMstID(strSelTechid)
  }

  // ================= Add Product Category Function =============
  function addProdCategoryByProductMstID(technoIds: string) {
    AddProductCategoryByAgencyTypeIDApi(technoIds, ProductID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          handleClose()
          toast.success('Product Category Created Successfully.', {position: 'top-center'})
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
    let tmpTechno = ProdCategoryMapData
    for (let k in tmpTechno) {
      if (uid == tmpTechno[k].productCategoryID) {
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
      ProdCategoryMapData: tmpTechno,
    })
  }

  return (
    <Modal size='xl' show={show} onHide={handleClose} keyboard={false}>
      <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
        <Modal.Title className='text-white'>Product Category List</Modal.Title>
        <h3 className='card-title align-items-start'>
          <span className='text-white card-label fs-5 mb-1'>Agency Name : </span>
          <span className='text-white card-label fw-bolder fs-3 mb-1'>{productName}</span>
          {/* <span className='text-muted mt-1 fw-bold fs-7'>Over 500 Project Details</span> */}
        </h3>
      </Modal.Header>
      <Modal.Body>
        <div className={`card  box-shadow-0`}>
          <Container>
            <Row>
              {ProdCategoryMapData.length > 0 &&
                ProdCategoryMapData.map((item, index) => (
                  <Col xs={6} md={4}>
                    <div className='form-check form-check-custom form-check-solid mb-5'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id={`${item.productCategoryID}`}
                        value={item.productCategoryID}
                        name={item.productCategoryName}
                        checked={item.isMember === 1 ? true : false}
                        onChange={(e) => SetStatus(e)}
                      />
                      <label className='form-check-label' htmlFor='flexCheckDefault'>
                        {item.productCategoryName}
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
        <Button variant='primary' onClick={() => ProdCategoryProjectItem(ProdCategoryMapData)}>
          Submit
        </Button>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {ModelPopUpProdCategoryMap}
