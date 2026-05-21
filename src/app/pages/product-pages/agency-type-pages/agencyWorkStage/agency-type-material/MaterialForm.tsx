// MaterialForm.tsx

import React from 'react'
import {Button} from 'react-bootstrap-v5'

interface MaterialFormProps {
  materialName: string
  materialCompanyName: string
  setMaterialName: (value: string) => void
  setMaterialCompanyName: (value: string) => void
  action: number
  onSave: () => void
  onCancel: () => void
}

const MaterialForm: React.FC<MaterialFormProps> = ({
  materialName,
  materialCompanyName,
  setMaterialName,
  setMaterialCompanyName,
  action,
  onSave,
  onCancel,
}) => (
  <>
    <div className='card-body border-top p-7 ms-6'>
      <div className='row mb-6'>
        <label className='col-lg-2 col-form-label required fw-bold fs-6'>Material Name:</label>
        <div className='col-lg-10 fv-row'>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid bg-light-primary'
            placeholder='Material Name'
            value={materialName}
            onChange={(e) => setMaterialName(e.target.value)}
          />
        </div>
      </div>

      <div className='row mb-6'>
        <label className='col-lg-2 col-form-label required fw-bold fs-6'>
          Material Company Name:
        </label>
        <div className='col-lg-10 fv-row'>
          <input
            type='text'
            className='form-control form-control-lg form-control-solid bg-light-primary'
            placeholder='Material Company Name'
            value={materialCompanyName}
            onChange={(e) => setMaterialCompanyName(e.target.value)}
          />
        </div>
      </div>

      <div className='card-footer d-flex justify-content-end py-2'>
        <Button variant='danger' className='btn btn-danger ms-3 mx-2' onClick={onSave}>
          {action === 0 ? 'Submit' : 'Update'}
        </Button>
        <Button variant='secondary' onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  </>
)

export default MaterialForm
