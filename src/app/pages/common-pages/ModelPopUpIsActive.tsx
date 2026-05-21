import React from 'react'
import {Modal, Button} from 'react-bootstrap-v5'

type Props = {
  activeID: number
  activeType: boolean
  pageName: string
  showActive: boolean
  handleCloseActive: () => void
  IsActiveFunc: (_activeID: number, _activeType: boolean) => void
}

const ModelPopUpIsActive: React.FC<Props> = ({
  activeID,
  activeType,
  pageName,
  showActive,
  handleCloseActive,
  IsActiveFunc,
}) => {
  return (
    <Modal show={showActive} onHide={handleCloseActive} backdrop='true' keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Active {pageName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {activeType === false ? (
          <h4>Are you sure you want to deactive selected record?</h4>
        ) : (
          <h4>Are you sure you want to active selected record?</h4>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant={activeType === false ? 'danger' : 'success'}
          onClick={() => IsActiveFunc(activeID, activeType)}
        >
          {activeType === false ? 'Deactive' : 'Active'}
        </Button>
        <Button variant='secondary' onClick={handleCloseActive}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {ModelPopUpIsActive}
