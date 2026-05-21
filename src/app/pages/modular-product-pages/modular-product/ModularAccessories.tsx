import React, {useState} from 'react'
import {Modal, Button, Container, Row, Col} from 'react-bootstrap-v5'
import {IAsseccoriesProductModel} from '../../../models/product-page/IProductMasterModel'
import {toast} from 'react-toastify'
import {AddAccessoriesByProductIDApi} from '../../../modules/product-master-page/product-master-page/ProductMasterCRUD'
import { AddAccessoriesByModularProductIDApi } from '../../../modules/modular-product-page/modular-product/ModularProductCRUD'

type Props = {
  show: boolean
  handleClose: () => void
  accessoriesMapData: IAsseccoriesProductModel[]
  ProductID: number
  productName: string
}

interface IProduct {}

const ModularAccessories: React.FC<Props> = ({
  show,
  handleClose,
  accessoriesMapData,
  ProductID,
  productName,
}) => {
  const [state, setState] = useState<IProduct>({})

  // =================== For Asseccories ==========================
  function AsseccoriesProjectItem(tech: IAsseccoriesProductModel[]) {
    let tmpTech = tech
    let strSelTechid: string = ''
    for (let k in tmpTech) {
      if (tmpTech[k].isMember === 1) {
        if (strSelTechid == '') {
          strSelTechid = `${tmpTech[k].asseccoriesID}`
        } else {
          strSelTechid = strSelTechid + ',' + `${tmpTech[k].asseccoriesID}`
        }
      }
    }
    addAsseccoriesByProductMstID(strSelTechid)
  }

  // ================= Add Asseccories Function =============
  function addAsseccoriesByProductMstID(technoIds: string) {
    AddAccessoriesByModularProductIDApi(technoIds, ProductID)
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.success('Asseccories Updated Successfully.', {position: 'top-center'})
          handleClose()
        } else {
          toast.error(`${response.data.message}`, {position: 'top-center'})
          handleClose()
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
    let tmpTechno = accessoriesMapData
    for (let k in tmpTechno) {
      if (uid == tmpTechno[k].asseccoriesID) {
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
      accessoriesMapData: tmpTechno,
    })
  }

  return (
    <Modal size='xl' show={show} onHide={handleClose} keyboard={false}>
      <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
        <Modal.Title className='text-white'>Accessories List</Modal.Title>
        <h3 className='card-title align-items-start'>
          <span className='text-white card-label fs-5 mb-1'>Product Name :</span>
          <span className='text-white card-label fw-bolder fs-3 mb-1'>{productName}</span>
          {/* <span className='text-muted mt-1 fw-bold fs-7'>Over 500 Project Details</span> */}
        </h3>
      </Modal.Header>
      <Modal.Body>
        <div className={`card  box-shadow-0`}>
          <Container>
            <Row>
              {accessoriesMapData.length > 0 &&
                accessoriesMapData.map((item, index) => (
                  <Col xs={6} md={4}>
                    <div className='form-check form-check-custom form-check-solid mb-5'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id={`${item.asseccoriesID}`}
                        value={item.asseccoriesID}
                        name={item.accessoriesName}
                        checked={item.isMember === 1 ? true : false}
                        onChange={(e) => SetStatus(e)}
                      />
                      <label className='form-check-label' htmlFor='flexCheckDefault'>
                        {item.accessoriesName}
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
        <Button variant='primary' onClick={() => AsseccoriesProjectItem(accessoriesMapData)}>
          Submit
        </Button>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {ModularAccessories}
