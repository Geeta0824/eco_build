import React from 'react'
import {Modal, Button} from 'react-bootstrap-v5'

type Props = {
  mandatoryID: number
  mandatoryType: boolean
  pageName: string
  showMandatory: boolean
  handleCloseMandatory: () => void
  IsActiveFunc: (_activeID: number, _activeType: boolean) => void
}

const ModelPopUpIsMandatory: React.FC<Props> = ({
  mandatoryID,
  mandatoryType,
  pageName,
  showMandatory,
  handleCloseMandatory,
  IsActiveFunc,
}) => {
  return (
    <Modal show={showMandatory} onHide={handleCloseMandatory} backdrop='true' keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Active {pageName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showMandatory === false ? (
          <h4>Are you sure you want to deactive selected record?</h4>
        ) : (
          <h4>Are you sure you want to active selected record?</h4>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant={showMandatory === false ? 'danger' : 'success'}
          onClick={() => IsActiveFunc(mandatoryID, mandatoryType)}
        >
          {mandatoryType === false ? 'Deactive' : 'Active'}
        </Button>
        <Button variant='secondary2' onClick={handleCloseMandatory}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {ModelPopUpIsMandatory}
