import React from 'react'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'
import {Modal, Button} from 'react-bootstrap-v5'
import {IProjectModel} from '../../models/projects-page/IProjectsModel'
import Loader from './Loader'

type Props = {
  data: IProjectModel[]
  show: boolean
  handleClose: () => void
  loading: boolean
}

const ProjectDetailsModel: React.FC<Props> = ({data, show, handleClose, loading}) => {
  return (
    <Modal size='lg' scrollable={true} show={show} onHide={handleClose}>
      <div style={{backgroundColor: '#2a3952'}}>
        <Modal.Header closeButton>
          <Modal.Title style={{color: 'white'}}>Project Details</Modal.Title>
        </Modal.Header>
      </div>
      <Modal.Body>
        <Loader loading={loading} />
        {data.map((data, index) => {
          return (
            <div className='card' id='kt_profile_details_view'>
              <div className='card-body'>
                <div className='row mb-5'>
                  <label className='col-lg-3 fw-bold text-muted'>Project Name</label>
                  <div className='col-lg-8'>
                    <span className='fw-bolder fs-6 text-dark'>{data.projectName}</span>
                  </div>
                </div>
                <div className='row mb-5'>
                  <label className='col-lg-3 fw-bold text-muted'>Customer Name</label>
                  <div className='col-lg-8'>
                    <span className='fw-bolder fs-6 text-dark'>
                      {data.firstName + ' ' + data.lastName}
                    </span>
                  </div>
                </div>
                <div className='row mb-5'>
                  <label className='col-lg-3 fw-bold text-muted'>Mobile Number</label>
                  <div className='col-lg-8'>
                    <span className='fw-bolder fs-6 text-dark'>{data.mobileNumber}</span>
                  </div>
                </div>
                <div className='row mb-5'>
                  <label className='col-lg-3 fw-bold text-muted'>Email</label>
                  <div className='col-lg-8'>
                    <span className='fw-bolder fs-6 text-dark'>
                      {data.email == '' ? 'N.A' : data.email}
                    </span>
                  </div>
                </div>
                <div className='row mb-5'>
                  <label className='col-lg-3 fw-bold text-muted'>Project Category</label>
                  <div className='col-lg-8'>
                    <span className='fw-bolder fs-6 text-dark'>{data.projectCategoryName}</span>
                  </div>
                </div>
                <div className='row mb-5'>
                  <label className='col-lg-3 fw-bold text-muted'>Project Type</label>
                  <div className='col-lg-8'>
                    <span className='fw-bolder fs-6 text-dark'>{data.projectType}</span>
                  </div>
                </div>
                <div className='row mb-5'>
                  <label className='col-lg-3 fw-bold text-muted'>BHK</label>
                  <div className='col-lg-8'>
                    <span className='fw-bolder fs-6 text-dark'>{data.bhkName}</span>
                  </div>
                </div>
                <div className='row mb-5'>
                  <label className='col-lg-3 fw-bold text-muted'>Carpet Area</label>
                  <div className='col-lg-8'>
                    <span className='fw-bolder fs-6 text-dark'>{data.carpetArea}</span>
                  </div>
                </div>
                <div className='row'>
                  <label className='col-lg-3 fw-bold text-muted'>Project Status</label>
                  <div className='col-lg-8'>
                    <span className='fw-bolder fs-6 text-dark'>{data.projectStatusName}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <BlankDataImageInTable length={data.length} loading={loading} colSpan={5} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant='danger' onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {ProjectDetailsModel}
