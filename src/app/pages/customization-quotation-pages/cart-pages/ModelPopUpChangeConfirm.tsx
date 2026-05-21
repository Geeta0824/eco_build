import React from 'react'
import {Modal, Button} from 'react-bootstrap-v5'

type Props = {
  id: number
  pageName: string
  show: boolean
  handleClose: () => void
  deleteData: (_id: number) => void
}

const ModelPopUpChangeConfirm: React.FC<Props> = ({id, pageName, show, handleClose, deleteData}) => {
  return (
    <Modal show={show} onHide={handleClose} backdrop='true' keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{pageName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Are you sure you want to change product?</h4>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='danger' onClick={() => deleteData(id)}>
          Yes
        </Button>
        <Button variant='secondary2' onClick={handleClose}>
          No
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {ModelPopUpChangeConfirm}
