import React from 'react'
import {Modal, Button} from 'react-bootstrap-v5'
import { toAbsoluteUrl } from '../../../_Ecd/helpers'

type Props = {
  pageName1: string
  pageName2: string
  title1: string
  title2: string
  imageShow: string
  show: boolean
  handleClose: () => void
}

const ModalPopUpImageView: React.FC<Props> = ({
  pageName2,
  pageName1,
  title1,
  title2,
  show,
  imageShow,
  handleClose,
}) => {
  return (
    <Modal size='xl' show={show} onHide={handleClose} backdrop='true' keyboard={false} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>
          <span className='d-block mb-1'>
            <span className='text-muted text-light'>{pageName1} :- </span>
            <span className='text-dark text-hover-primary '>{title1} </span>
          </span>
          <span className='text-dark d-block'>
            <span className='text-muted text-light'>{pageName2} :- </span>
            <span className='text-dark text-hover-primary '>{title2}</span>
          </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='mb-5 text-center'>
          <img alt='Pic' className='object-fit-cover h-90 w-100' src={toAbsoluteUrl(`${imageShow}`)} />
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

export {ModalPopUpImageView}
