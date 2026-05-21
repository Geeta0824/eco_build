import React, {useState} from 'react'
import {Modal, Button, Container, Row, Col} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {AddProductCategoryByAgencyTypeIDApi} from '../../../modules/product-master-page/agency-type-master-page/AgencyTypeCRUD'
import {IUserMapWithDocCatgryModel} from '../../../models/documents/IDocumentCategoryModel'
import {addRoleByDocumentCategoryIDApi} from '../../../modules/documents-mst-pages/document-category/DocumentCategoryCRUD'

type Props = {
  show: boolean
  handleClose: () => void
  UserMapData: IUserMapWithDocCatgryModel[]
  DocumentCategoryID: number
  DocumentCategoryName: string
}

interface IUser {}

const ModelPopUpUserMap: React.FC<Props> = ({
  show,
  handleClose,
  UserMapData,
  DocumentCategoryID,
  DocumentCategoryName,
}) => {
  const [state, setState] = useState<IUser>({})

  // =================== For Asseccories ==========================
  function UserMapForDocument(tech: IUserMapWithDocCatgryModel[]) {
    let tmpTech = tech
    let strSelTechid: string = ''
    for (let k in tmpTech) {
      if (tmpTech[k].isMember === 1) {
        if (strSelTechid == '') {
          strSelTechid = `${tmpTech[k].roleID}`
        } else {
          strSelTechid = strSelTechid + ',' + `${tmpTech[k].roleID}`
        }
      }
    }
    addDocCategoryByDocumentCtgryMstID(strSelTechid)
  }

  // ================= Add DocumentType Category Function =============
  function addDocCategoryByDocumentCtgryMstID(technoIds: string) {
    addRoleByDocumentCategoryIDApi(DocumentCategoryID, technoIds)
      .then((response) => {
        if (response.data.isSuccess === true) {
          handleClose()
          toast.success('User Created Successfully.', {position: 'top-center'})
        } else {
          toast.error(`${response.data.message}`, {position: 'top-center'})
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setState({...state, DocumentTypeMasterData: [], loading: false})
      })
  }

  // =================== For Asseccories ==============
  function SetStatus(e: any) {
    let uid: number = e.target.id
    let isChecked = e.target.checked
    let tmpTechno = UserMapData
    for (let k in tmpTechno) {
      if (uid == tmpTechno[k].roleID) {
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
      UserMapData: tmpTechno,
    })
  }

  return (
    <Modal size='xl' show={show} onHide={handleClose} keyboard={false}>
      <Modal.Header closeButton style={{backgroundColor: '#2a3952'}}>
        <Modal.Title className='text-white'>User Map List</Modal.Title>
        <h3 className='card-title align-items-start'>
          <span className='text-white card-label fs-5 mb-1'>Document Category Name : </span>
          <span className='text-primary card-label fw-bolder fs-5 mb-1'>
            {' '}
            {DocumentCategoryName}
          </span>
          {/* <span className='text-muted mt-1 fw-bold fs-7'>Over 500 Project Details</span> */}
        </h3>
      </Modal.Header>
      <Modal.Body>
        <div className={`card  box-shadow-0`}>
          <Container>
            <Row>
              {UserMapData.length > 0 &&
                UserMapData.map((item, index) => (
                  <Col xs={6} md={4}>
                    <div className='form-check form-check-custom form-check-solid mb-5'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        id={`${item.roleID}`}
                        value={item.roleID}
                        name={item.roleName}
                        checked={item.isMember === 1 ? true : false}
                        onChange={(e) => SetStatus(e)}
                      />
                      <label className='form-check-label' htmlFor='flexCheckDefault'>
                        {item.roleName}
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
        <Button variant='primary' onClick={() => UserMapForDocument(UserMapData)}>
          Submit
        </Button>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {ModelPopUpUserMap}
