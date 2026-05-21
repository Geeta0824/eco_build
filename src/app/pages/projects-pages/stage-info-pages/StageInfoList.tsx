import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import {UserModel} from '../../../modules/auth/models/UserModel'
import {shallowEqual, useSelector} from 'react-redux'
import {RootState} from '../../../../setup'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {IStageInfoModel} from '../../../models/projects-page/IStageInfoModel'
import {getGetProjectStageInfo_List_ForAdminAPI} from '../../../modules/project-master-page/stage-info/StageInfoCRUD'

type Props = {}

interface IBHK {
  loading: boolean
  stageInfoData: IStageInfoModel[]
  tmpStageInfoData: IStageInfoModel[]
  SearchText: string
  ProjectName: string
  selProjectCategoryID: number
  selProjectID: number
  activeID: number
  activeType: any
}

const StageInfoList: React.FC<Props> = () => {
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  const {projectID} = useParams<{projectID: string}>()
  const location = useLocation()
  const [state, setState] = useState<IBHK>({
    loading: false,
    stageInfoData: [] as IStageInfoModel[],
    tmpStageInfoData: [] as IStageInfoModel[],
    SearchText: '',
    ProjectName: '',
    selProjectCategoryID: 0,
    selProjectID: 0,
    activeID: 0,
    activeType: false,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      let projName: any = lc.projName
      let projectCategoryID: any = lc.projectCategoryID
      getAllStageInfoData(projName, projectCategoryID)
    }, 100)
  }, [])

  function getAllStageInfoData(projectName: string, projectCategoryID: number) {
    getGetProjectStageInfo_List_ForAdminAPI(user.employeeID, parseInt(projectID), projectCategoryID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          setState({
            ...state,
            stageInfoData: responseData,
            tmpStageInfoData: responseData,
            ProjectName: projectName,
            selProjectCategoryID: projectCategoryID,
            loading: false,
          })
          setTotal(responseData.length)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            stageInfoData: [],
            tmpStageInfoData: [],
            loading: false,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          stageInfoData: [],
          tmpStageInfoData: [],
          loading: false,
        })
      })
  }

  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpStageInfoData.filter((user) => {
        return (
          user.stageName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.supervisorName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.approveByName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, stageInfoData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, stageInfoData: state.tmpStageInfoData})
      // If the text field is empty, show all users
      setTotal(state.tmpStageInfoData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.stageInfoData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IStageInfoModel[] = state.stageInfoData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        <div className='card-header border-0 py-2' style={{backgroundColor: '#000000'}}>
          {/* begin::Header */}
          <div className='card-header border-0 pt-4 ps-0' id='kt_chat_contacts_header'>
            <span className='w-100 position-relative'>
              <KTSVG
                path='/media/icons/duotune/general/gen021.svg'
                className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
              />
              <input
                type='text'
                className='form-control form-control-solid px-15 bg-white'
                name='search'
                placeholder='Search'
                onChange={(e) => filter(e)}
                value={name}
              />
            </span>
          </div>
        </div>

        <div className='py-3'>
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>Stage Name</th>
                  <th className='min-w-150px'>Traget Date</th>
                  <th className='min-w-150px'>Complete Date</th>
                  <th className='min-w-150px'>Approve Date</th>
                  <th className='min-w-150px'>Supervisor Name</th>
                  <th className='min-w-150px'>Approve By</th>
                  <th className='min-w-75px text-end'>View</th>
                </tr>
              </thead>
              <tbody className="border-bottom">
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.stageName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.targetDate == null ? 'N.A' : data.targetDate}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.stageCompleteDate == '01-Jan-0001 00:00:00'
                                  ? 'N.A'
                                  : data.stageCompleteDate}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.targetDateApproveDate == null
                                  ? 'N.A'
                                  : data.targetDateApproveDate}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.supervisorName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.approveByName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className='text-end'>
                          <Link
                            to={{
                              pathname: `/projects/project/edit/${projectID}/stage-info/details`,
                              state: {
                                stageID: data.stageID,
                                projectCategoryID: state.selProjectCategoryID,
                                projectID: parseInt(projectID),
                                stageName: data.stageName,
                                supervisorName: data.supervisorName,
                                approveByName: data.approveByName,
                                targetDate: data.targetDate,
                                stageCompleteDate: data.stageCompleteDate,
                                targetDateApproveDate: data.targetDateApproveDate,
                              },
                            }}
                            className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-success btn-sm me-1 text-primary text-hover-light'
                            data-bs-toggle='tooltip'
                            data-bs-placement='top'
                            title='View'
                          >
                            <span className='fa fa-eye fs-2'></span>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={5}
                />
              </tbody>
            </table>
          </div>
          <div className='text-center'>
            <Pagination
              onChange={(value: any) => setPage(value)}
              pageSize={postPerPage}
              total={total}
              current={page}
              showSizeChanger
              showQuickJumper
              onShowSizeChange={onShowSizeChange}
              showTotal={(total) => `Total ${total} items`}
            ></Pagination>
          </div>
        </div>
      </div>
    </>
  )
}

export default StageInfoList
