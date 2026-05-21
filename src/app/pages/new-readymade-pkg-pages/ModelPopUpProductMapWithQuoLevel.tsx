import React, { useState, useEffect, useCallback } from 'react'
import {
  Modal,
  Button,
  Container,
  Row,
  Col,
  Form,
} from 'react-bootstrap-v5'
import { toast } from 'react-toastify'

import {
  IProductMapModel,
} from '../../models/new-readymade-pkg/INewReadymadePkgModel'

import {
  AddProductByReadymadePackageTypeMapApi,
} from '../../modules/new-readymade-pkg-mst-page/NewReadymadePackageCRUD'
import { ShadowCardLoader } from './ShadowCardLoader'

type Props = {
  show: boolean
  handleClose: () => void
  productMapData: IProductMapModel[]
  readymadeTypeID: number
  ReadymadePackageType: string
}

const ModelPopUpProductMapWithQuoLevel: React.FC<Props> = ({
  show,
  handleClose,
  productMapData,
  readymadeTypeID,
  ReadymadePackageType,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [productData, setProductData] = useState<IProductMapModel[]>([])
  const [filteredData, setFilteredData] = useState<IProductMapModel[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    if (show) {
      setProductData(productMapData)
      setFilteredData(productMapData)
      setSearchTerm('')
    }
  }, [show, productMapData])

  const handleCheckboxChange = useCallback((productID: number, checked: boolean) => {
    const updated = productData.map((item) =>
      item.productID === productID
        ? { ...item, isMember: checked ? 1 : 0 }
        : item
    )
    setProductData(updated)
    filterData(searchTerm, updated)
  }, [productData, searchTerm])

  const submitProductMap = useCallback(() => {
    const selectedIds = productData
      .filter((item) => item.isMember === 1)
      .map((item) => item.productID)
      .join(',')

    // if (!selectedIds) {
    //   toast.warn('Please select at least one product.', { position: 'top-center' })
    //   return
    // }

    setLoading(true)
    AddProductByReadymadePackageTypeMapApi(readymadeTypeID, selectedIds)
      .then((response) => {
        if (response.data?.isSuccess) {
          toast.success('Product mapped successfully.', { position: 'top-center' })
          handleClose()
        } else {
          toast.error(response.data?.message || 'Something went wrong.', {
            position: 'top-center',
          })
        }
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`, { position: 'top-center' })
      })
      .finally(() => setLoading(false))
  }, [productData, readymadeTypeID, handleClose])

  const filterData = (term: string, data: IProductMapModel[]) => {
    const lower = term.toLowerCase()
    const filtered = data.filter(
      (item) =>
        item.productName?.toLowerCase().includes(lower) ||
        item.productCategoryName?.toLowerCase().includes(lower) ||
        item.description?.toLowerCase().includes(lower)
    )
    setFilteredData(filtered)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    filterData(value, productData)
  }

  return (
    <Modal size="xl" show={show} onHide={handleClose} keyboard={false} centered>
      <div className="modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <Modal.Header closeButton style={{ backgroundColor: '#2a3952', color: '#fff' }}>
          <Modal.Title className="text-white">Map Products to Package</Modal.Title>
          <div className="ms-4">
            <span className="text-white fs-5">Readymade Package Type:</span>
            <span className="text-primary fw-bold ms-2 fs-5">{ReadymadePackageType}</span>
          </div>
        </Modal.Header>

        {/* Body with Search and Product List */}
        <Modal.Body style={{ overflowY: 'auto', flexGrow: 1 }}>
          <Container fluid>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  type="text"
                  placeholder="Search by name, category, or description..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </Col>
            </Row>

            {loading || filteredData.length === 0 ? (
              <ShadowCardLoader />
            ) : (
              <div className="product-list">
                {filteredData.map((item) => (
                  <div key={item.productID} className="d-flex align-items-start border-bottom py-2">
                    <Form.Check
                      type="checkbox"
                      id={`product-${item.productID}`}
                      className="me-3 mt-1"
                      checked={item.isMember === 1}
                      onChange={(e) =>
                        handleCheckboxChange(item.productID, e.target.checked)
                      }
                    />
                    <div className="flex-grow-1 mb-3">
                      <div><strong className='fs-6'>{item.productName}</strong></div>
                      <div className="text-muted fs-6"><strong>Category:</strong> {item.productCategoryName || '—'}</div>
                      <div className="text-muted fs-6"><strong>Description:</strong> {item.description || '—'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Container>
        </Modal.Body>

        {/* Footer */}
        <Modal.Footer className="bg-light">
          <Button variant="primary" onClick={submitProductMap} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Close
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  )
}

export { ModelPopUpProductMapWithQuoLevel }
