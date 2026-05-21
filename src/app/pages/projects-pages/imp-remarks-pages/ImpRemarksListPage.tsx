import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import {deleteBHK} from '../../../modules/master-page/bhk-master-page/NewBHKCRUD'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {getAllBHK} from '../../../modules/master-page/bhk-master-page/NewBHKCRUD'
import {ImpRemarksModel} from '../../../models/projects-page/ImpRemarksModel'

type Props = {}

interface IBHK {
  loading: boolean
  bhkMasterData: ImpRemarksModel[]
  tmpBHKMasterData: ImpRemarksModel[]
  SearchText: string
  ProjectName: string
  projectCategoryID: number
  selBHKId: number
  activeID: number
  activeType: any
}

const ImpRemarksListPage: React.FC<Props> = () => {
  const {projectID} = useParams<{projectID: string}>()
  const location = useLocation()
  const [state, setState] = useState<IBHK>({
    loading: false,
    bhkMasterData: [] as ImpRemarksModel[],
    tmpBHKMasterData: [] as ImpRemarksModel[],
    SearchText: '',
    ProjectName: '',
    projectCategoryID: 0,
    selBHKId: 0,
    activeID: 0,
    activeType: false,
  })

  useEffect(() => {
    // setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      let projName: any = lc.projName
      let projectCategoryID: any = lc.projectCategoryID
      var mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.projName
      }
      // getAllBHKMasterData(mainSearch)
    }, 100)
  }, [])

  function getAllBHKMasterData(mainSearch: string) {
    getAllBHK()
      .then((response) => {
        // const responseData = response.data.responseObject
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          let responseData = resp.responseObject
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                // user.countryName.toLowerCase().includes(keyword.toLowerCase()) ||
                user.bhkName.toLowerCase().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              bhkMasterData: results,
              tmpBHKMasterData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              bhkMasterData: responseData,
              tmpBHKMasterData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, bhkMasterData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, bhkMasterData: [], loading: false})
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (bhkID: number) => {
    setState({
      ...state,
      selBHKId: bhkID,
      loading: false,
    })
    setShow(true)
  }

  function deleteBHKMasterItem(temBHKId: number) {
    let value = {bhkid: temBHKId}
    var temBHKID = btoa(JSON.stringify(value))
    // console.log(temBHKID)
    deleteBHK(`${temBHKID}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllBHKMasterData(state.SearchText)
          setShow(false)
        } else {
          toast.error(`${resp.message}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpBHKMasterData.filter((user) => {
        return (
          // user.countryName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.bhkName.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, bhkMasterData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, bhkMasterData: state.tmpBHKMasterData})
      // If the text field is empty, show all users
      setTotal(state.tmpBHKMasterData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.bhkMasterData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: ImpRemarksModel[] = state.bhkMasterData.slice(
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
          <div
            className='card-toolbar'
            data-bs-toggle='tooltip'
            data-bs-placement='top'
            data-bs-trigger='hover'
            title='Click to add a user'
          >
            <Link
              to={{
                pathname: `/projects/project/edit/${parseInt(projectID)}/imp-remarks/add`,
                state: {projectName: state.ProjectName, projectCategoryID: state.projectCategoryID},
              }}
              className='btn btn-sm btn-light-primary bg-white'
              // data-bs-toggle='modal'
              // data-bs-target='#kt_modal_invite_friends'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div>
        </div>

        {/* end::Header */}
        {/* begin::Body */}
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>IMP Remarks Name</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
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
                                {data.bhkName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex justify-content-end flex-shrink-0'>
                            <Link
                              to={{
                                pathname: `/projects/project/edit/${parseInt(
                                  projectID
                                )}/imp-remarks/edit/${data.bhkid}`,
                                state: {
                                  projectID: projectID,
                                  projectCategoryID: state.projectCategoryID,
                                  projectName: state.ProjectName,
                                },
                              }}
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                            >
                              <KTSVG
                                path='/media/icons/duotune/art/art005.svg'
                                className='svg-icon-3 svg-icon-primary'
                              />
                            </Link>
                            <div
                              onClick={() => handleShow(data.bhkid)}
                              className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger btn-sm'
                            >
                              <KTSVG
                                path='/media/icons/duotune/general/gen027.svg'
                                className='ssvg-icon-3 svg-icon-danger'
                              />
                            </div>
                          </div>
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
              // itemRender={itemRender}
              showTotal={(total) => `Total ${total} items`}
            ></Pagination>
          </div>
        </div>
      </div>
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selBHKId}
        pageName={'BHK Master'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteBHKMasterItem(state.selBHKId)}
      />
    </>
  )
}

export default ImpRemarksListPage
