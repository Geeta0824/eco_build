import React, {useState} from 'react'
import {Modal, Button} from 'react-bootstrap-v5'
import {toast} from 'react-toastify'
import {IDesignerRemarkModel} from '../../../../models/projects-page/ImpRemarksModel'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import {KTSVG} from '../../../../../_Ecd/helpers'
import {RootState} from '../../../../../setup'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../../../modules/auth/models/UserModel'
import {
  AddProjectDesignerRemarkDetailsAPI,
  DeleteProjectDesignerRemarkAPI,
  UpdateProjectDesignerRemarkDetailsAPI,
} from '../../../../modules/project-master-page/imp-remarks/DesignerRemarkCRUD'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'

type Props = {
  designerRemarkData: IDesignerRemarkModel[]
  showDesignerRemark: boolean
  handleCloseDesignerRemark: () => void
  handleShowDesignerRemarkMap: (id: number, projectName: string) => void
  ProjectID: number
  ProjectName: string
  loading: boolean
}

const ProjectDesignRemark: React.FC<Props> = ({
  designerRemarkData,
  showDesignerRemark,
  handleCloseDesignerRemark,
  handleShowDesignerRemarkMap,
  ProjectID,
  ProjectName,
  loading,
}) => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const [proDesRemID, setProDesRemID] = useState(0)
  const [action, setAction] = useState(0)
  const [designerRemark, setDesignerRemark] = useState('')
  const [showAddUpdate, setShowAddUpdate] = useState(0)

  const handleChangeSocietyBlock = (e: any) => {
    const value = e.target.value
    setDesignerRemark(value)
  }

  function AddSocietyBlockDetails(designerRemark: string) {
    loading = true
    if (designerRemark === '') {
      return toast.error('Please Enter Remark')
    }
    AddProjectDesignerRemarkDetailsAPI(designerRemark, ProjectID, user.employeeID, '192.33.66')
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Create Successfully')
          setDesignerRemark('')
          handleShowDesignerRemarkMap(ProjectID, ProjectName)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }

  function UpdateClick(data: IDesignerRemarkModel) {
    setDesignerRemark(data.projectDesignerRemark)
    setAction(1)
    setShowAddUpdate(1)
    setProDesRemID(data.projectDesignerRemarkID)
  }

  function UpdateDesignerRemarkDetails(designerRemark: string) {
    loading = true
    if (designerRemark === '') {
      return toast.error('Please Enter Remark')
    }
    UpdateProjectDesignerRemarkDetailsAPI(
      proDesRemID,
      designerRemark,
      ProjectID,
      user.employeeID,
      '192.33.66'
    )
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Update Successfully')
          setDesignerRemark('')
          handleShowDesignerRemarkMap(ProjectID, ProjectName)
        } else {
          toast.error(`${response.data.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
      })
  }

  const deleteProjectDesignerRemark = (temProDesRemID: number) => {
    const Delete = window.confirm('Are you sure you want to delete selected record')
    if (Delete) {
      DeleteProjectDesignerRemarkAPI(temProDesRemID)
        .then((response) => {
          if (response.data.isSuccess === true) {
            toast.success('Deleted Successfully')
            handleShowDesignerRemarkMap(ProjectID, ProjectName)
          } else {
            toast.error(`${response.data.message}`)
          }
        })
        .catch((error) => {
          toast.error(`${error}`)
        })
    } else {
      return
    }
  }

  return (
    <>
      <Modal
        size='xl'
        show={showDesignerRemark}
        onHide={() => {
          setAction(0)
          setDesignerRemark('')
          setShowAddUpdate(0)
          handleCloseDesignerRemark()
        }}
        backdrop='true'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <div>
            <label className='fw-bolder fs-4'>Project Name : </label>
            <span className='text-primary fs-5'> {ProjectName}</span>
          </div>
        </Modal.Header>
        {showAddUpdate == 1 && (
          <Modal.Body>
            <div className='row mb-6'>
              <label className='col-lg-3 col-form-label required fw-bold fs-6'>
                Designer Remark:
              </label>
              <div className='col-lg-5 fv-row'>
                <input
                  type='text'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  placeholder='Designer Remark'
                  value={designerRemark}
                  onChange={(e) => handleChangeSocietyBlock(e)}
                />
              </div>
            </div>
          </Modal.Body>
        )}
        {showAddUpdate == 1 && (
          <Modal.Footer>
            {action == 0 ? (
              <Button variant='danger' onClick={() => AddSocietyBlockDetails(designerRemark)}>
                Submit
              </Button>
            ) : action == 1 ? (
              <Button variant='danger' onClick={() => UpdateDesignerRemarkDetails(designerRemark)}>
                Update
              </Button>
            ) : (
              <></>
            )}
            <Button
              variant='secondary'
              onClick={() => {
                setAction(0)
                setDesignerRemark('')
                setShowAddUpdate(0)
                handleCloseDesignerRemark()
              }}
            >
              Cancel
            </Button>
          </Modal.Footer>
        )}
        {showAddUpdate == 0 && (
          <div
            className='card-header border-2 text-end rounded m-2'
            style={{backgroundColor: '#000000'}}
          >
            <div
              className='card-toolbar'
              data-bs-toggle='tooltip'
              data-bs-placement='top'
              data-bs-trigger='hover'
              title='Click to add a user'
            >
              <span
                className='btn btn-sm btn-light-primary bg-white'
                onClick={() => {
                  setShowAddUpdate(1)
                  setAction(0)
                }}
              >
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
                Add New
              </span>
            </div>
          </div>
        )}
        <div className='card'>
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-300px p-3'>Designer Remark</th>
                  <th className='min-w-75px text-end p-3'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                <LoaderInTable loading={loading} column={5} />
                {designerRemarkData.length > 0 &&
                  designerRemarkData.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td className='text-dark text-hover-primary'>
                          {data.projectDesignerRemark}
                        </td>
                        <td className='text-end'>
                          <div className='d-flex justify-content-end flex-shrink-0 mx-2'>
                            <span
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                              onClick={() => UpdateClick(data)}
                            >
                              <KTSVG
                                path='/media/icons/duotune/art/art005.svg'
                                className='svg-icon-3 svg-icon-primary'
                              />
                            </span>
                            <span
                              onClick={() =>
                                deleteProjectDesignerRemark(data.projectDesignerRemarkID)
                              }
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                            >
                              <KTSVG
                                path='/media/icons/duotune/general/gen027.svg'
                                className='ssvg-icon-3 svg-icon-danger'
                              />
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                <BlankDataImageInTable
                  length={designerRemarkData.length}
                  loading={loading}
                  colSpan={2}
                />
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ProjectDesignRemark
