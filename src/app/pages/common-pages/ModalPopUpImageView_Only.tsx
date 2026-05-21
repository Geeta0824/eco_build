import React from 'react'
import {Modal, Button} from 'react-bootstrap-v5'
import {toAbsoluteUrl} from '../../../_Ecd/helpers'

type Props = {
  title: string
  imageShow: string
  show: boolean
  isPdf: boolean
  handleClose: () => void
}

const ModalPopUpImageView_Only: React.FC<Props> = ({
  title,
  imageShow,
  show,
  isPdf,
  handleClose,
}) => {
  return (
    <Modal size='xl' show={show} onHide={handleClose} backdrop='true' keyboard={false} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='mb-5'>
          {isPdf ? (
            <iframe src={imageShow} height={600} width='100%' />
          ) : (
            <>
              {imageShow ? (
                <img alt='Pic' className='img-fluid' src={toAbsoluteUrl(imageShow)} />
              ) : (
                <img src={toAbsoluteUrl('/media/img/NoProductImage.png')} alt='No image' />
              )}
            </>
          )}
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

export {ModalPopUpImageView_Only}
