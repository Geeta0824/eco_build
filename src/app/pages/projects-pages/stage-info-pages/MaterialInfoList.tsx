import React, {useState} from 'react'
import {toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankData from '../../common-pages/BlankData'
import {IStageMaterialModel} from '../../../models/projects-page/IStageInfoModel'
import {useHistory, useLocation} from 'react-router-dom'
import {ModalPopUpImageView_Only} from '../../common-pages/ModalPopUpImageView_Only'

type Props = {
  data: IStageMaterialModel[]
  loading: boolean
  stageName: string
  supervisorName: string
  approveBy: string
  targetDate: string
  approveDate: string
  completeDate: string
  projectID: number
  stageID: number
  projectCategoryID: number
  day: string
  searchText: string
}

interface IBHK {
  loading: boolean
  imageShow: string
}

const MaterialInfoList: React.FC<Props> = ({
  data,
  loading,
  stageName,
  supervisorName,
  approveBy,
  targetDate,
  approveDate,
  completeDate,
  projectID,
  stageID,
  projectCategoryID,
  day,
  searchText,
}) => {
  const pathUrl = process.env.REACT_APP_API_URL
  const history = useHistory()
  const location = useLocation()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel

  const [state, setState] = useState<IBHK>({
    loading: false,
    imageShow: '',
  })

  const [showFlag, setShowFlag] = useState(false)

  const handleCloseFlag = () => {
    setState({...state, imageShow: '', loading: false})
    setShowFlag(false)
  }

  const handleShowFlag = (selImg: string) => {
    setState({...state, imageShow: pathUrl + selImg, loading: false})
    setShowFlag(true)
  }

  return (
    <>
      <div className='card shadow-lg position-relative' style={{backgroundColor: '#000000'}}>
        {/* Back Button */}
        <button
          className='btn btn-sm btn-success text-white rounded-pill position-absolute'
          style={{top: '10px', right: '10px'}}
          onClick={() => {
            if (location.pathname === '/reports/project-deadline/view-details') {
              history.push({
                pathname: '/reports/project-deadline/list',
                state: {
                  projectID,
                  stageID,
                  projectCategoryID,
                  day,
                  searchText,
                },
              })
            } else if (location.pathname === '/reports/project-missed-deadline/view-details') {
              history.push({
                pathname: '/reports/project-missed-deadline/list',
                state: {
                  projectID,
                  stageID,
                  projectCategoryID,
                  day,
                  searchText,
                },
              })
            } else {
              history.push({
                pathname: `/projects/project/edit/${projectID}/stage-info/list`,
                state: {
                  projectID,
                  stageID,
                  projectCategoryID,
                },
              })
            }
          }}
        >
          Back To List
        </button>

        <div className='card-body'>
          {/* Row 1 */}
          <div className='row mb-3'>
            <div className='col-lg-4'>
              <h6 className='text-white mb-1'>Stage Name</h6>
              <p className='text-primary fw-bold mb-0'>{stageName || 'N.A'}</p>
            </div>
            <div className='col-lg-4'>
              <h6 className='text-white mb-1'>Supervisor Name</h6>
              <p className='text-primary fw-bold mb-0'>{supervisorName || 'N.A'}</p>
            </div>
            <div className='col-lg-4'>
              <h6 className='text-white mb-1'>Approved By</h6>
              <p className='text-primary fw-bold mb-0'>{approveBy || 'N.A'}</p>
            </div>
          </div>

          {/* Row 2 */}
          <div className='row'>
            <div className='col-lg-4'>
              <h6 className='text-white mb-1'>Target Date</h6>
              <p className='text-primary fw-bold mb-0'>{targetDate || 'N.A'}</p>
            </div>
            <div className='col-lg-4'>
              <h6 className='text-white mb-1'>Approval Date</h6>
              <p className='text-primary fw-bold mb-0'>{approveDate || 'N.A'}</p>
            </div>
            <div className='col-lg-4'>
              <h6 className='text-white mb-1'>Completion Date</h6>
              <p className='text-primary fw-bold mb-0'>
                {completeDate === '01-Jan-0001 00:00:00' || completeDate == ''
                  ? 'N.A'
                  : completeDate}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='card shadow-lg rounded-3 p-4 my-4'>
        {/* Title Section */}
        <div className='bg-primary text-white text-center py-3 rounded-2 mb-4'>
          <h2 className='m-0 fw-bold'>Material Information List</h2>
        </div>

        {/* Table Section */}
        <div className='table-responsive mt-4'>
          <table className='table table-bordered align-middle g-2'>
            <thead className='bg-light-primary'>
              <tr className='fw-bolder fs-6'>
                <th className='min-w-50px'>Photo</th>
                <th className='min-w-150px'>Material Name</th>
                <th className='min-w-150px'>Montdor Material Name</th>
                <th className='min-w-100px text-center'>PMC Material Name</th>
              </tr>
            </thead>
            <tbody className="border-bottom">
              <LoaderInTable loading={loading} column={4} />
              {data.length > 0 &&
                data.map((material, index) => (
                  <tr key={index}>
                    <td>
                      <div
                        className='symbol symbol-45px me-5 cursor-pointer'
                        onClick={() => handleShowFlag(material.photoPath)}
                      >
                        {material.photoPath ? (
                          <img src={pathUrl + material.photoPath} alt='Material' />
                        ) : (
                          <img
                            src={toAbsoluteUrl('/media/img/NoProductImage.png')}
                            alt='No Image'
                          />
                        )}
                      </div>
                    </td>
                    <td>
                      <span className='text-dark text-hover-primary fs-6'>
                        {material.materialName || 'N.A'}
                      </span>
                    </td>
                    <td>
                      <span className='text-dark text-hover-primary fs-6'>
                        {material.montodorMaterialName || 'N.A'}
                      </span>
                    </td>
                    <td className='text-center'>
                      <span className='text-dark text-hover-primary fs-6'>
                        {material.pmcMaterialName || 'N.A'}
                      </span>
                    </td>
                  </tr>
                ))}
              <BlankData length={data.length} loading={loading} colSpan={4} />
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================== Image Modal =================== */}
      <ModalPopUpImageView_Only
        title={'Stage Information Material Photo'}
        imageShow={state.imageShow}
        show={showFlag}
        isPdf={false}
        handleClose={handleCloseFlag}
      />
    </>
  )
}

export default MaterialInfoList
