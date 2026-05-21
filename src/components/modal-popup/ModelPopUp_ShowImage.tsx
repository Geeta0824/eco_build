import React from 'react'
import {Modal, Button} from 'react-bootstrap-v5'
import {toAbsoluteUrl} from '../../_Ecd/helpers'

type Props = {
  imageShow: string
  pageName: string
  show: boolean
  handleClose: () => void
}

const ModelPopUp_ShowImage: React.FC<Props> = ({imageShow, pageName, show, handleClose}) => {
  return (
    <Modal size='lg' show={show} onHide={handleClose} backdrop='true' keyboard={false} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{pageName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='mb-5'>
          <img alt='image' className='img-fluid' src={toAbsoluteUrl(`${imageShow}`)} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {ModelPopUp_ShowImage}
