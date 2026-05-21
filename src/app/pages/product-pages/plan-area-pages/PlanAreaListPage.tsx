import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {IPlanAreaModel} from '../../../models/product-page/IPlanAreaModel'
import {
  deletePlanArea,
  getAllPlanArea,
  isActivePlanArea,
  isMandatoryPlanArea,
} from '../../../modules/product-master-page/plan-area-master-page/PlanAreaCRUD'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import {ModelPopUpIsMandatory} from '../../common-pages/ModelPopUpIsMandatory'

type Props = {}

interface IPlanArea {
  loading: boolean
  planAreaData: IPlanAreaModel[]
  tmpPlanAreaData: IPlanAreaModel[]
  SearchText: string
  selplanAreaID: number
  activeID: number
  activeType: any
  mandatoryID: number
  mandatoryType: boolean
  selareaName: string
  mainSearch: string
}

const PlanAreaListPage: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IPlanArea>({
    loading: false,
    planAreaData: [] as IPlanAreaModel[],
    tmpPlanAreaData: [] as IPlanAreaModel[],
    SearchText: '',
    selplanAreaID: 0,
    activeID: 0,
    activeType: false,
    mandatoryID: 0,
    mandatoryType: false,
    selareaName: '',
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc !== undefined) {
        mainSearch = lc.search
      }
      getAllPlanAreaData(mainSearch)
    }, 100)
  }, [])

  function getAllPlanAreaData(mainSearch: string) {
    getAllPlanArea()
      .then((response) => {
        const responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return user.areaName.toLowerCase().includes(mainSearch.toLowerCase())
            })

            setState({
              ...state,
              planAreaData: results,
              tmpPlanAreaData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              planAreaData: responseData,
              tmpPlanAreaData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, planAreaData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, planAreaData: [], loading: false})
      })
  }

  // =================Is Active Function Model Call==============

  const [showActive, setShowActive] = useState(false)
  const handleCloseActive = () => setShowActive(false)

  function handleShowActive(event: any) {
    //  console.log(event)
    const Cid = event.target.id
    const tmpIsActive = event.target.checked
    setState({
      ...state,
      activeID: Cid,
      activeType: tmpIsActive,
      loading: false,
    })
    setShowActive(true)
  }

  function checkedFunction(temEmpId: number, temIsAct: boolean) {
    isActivePlanArea(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess == true) {
          getAllPlanAreaData(state.mainSearch)
          setShowActive(false)
        } else {
          toast.error(`${response.data.message}`)
          setShowActive(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowActive(false)
      })
  }
  // =================Is Mandatory Function Model Call==============

  const [showMandatory, setShowMandatory] = useState(false)
  const handleCloseMandatory = () => setShowMandatory(false)

  function handleShowMandatory(event: any) {
    const Cid = event.target.id
    const tmpIsActive = event.target.checked
    setState({
      ...state,
      mandatoryID: Cid,
      mandatoryType: tmpIsActive,
      loading: false,
    })
    setShowMandatory(true)
  }

  function checkedMandatoryFunction(temEmpId: number, temIsAct: boolean) {
    isMandatoryPlanArea(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess == true) {
          getAllPlanAreaData(state.mainSearch)
          setShowMandatory(false)
        } else {
          toast.error(`${response.data.message}`)
          setShowMandatory(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowMandatory(false)
      })
  }

  // ==================Delete Model Function===============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (planAreaID: number) => {
    setState({
      ...state,
      selplanAreaID: planAreaID,
      loading: false,
    })
    setShow(true)
  }

  function deletePlanAreaItem(templanAreaID: number) {
    deletePlanArea(templanAreaID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllPlanAreaData(state.mainSearch)
          setShow(false)
        } else {
          toast.error(`${response.data.message}`)
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
      const results = state.tmpPlanAreaData.filter((user) => {
        return user.areaName.toLowerCase().includes(keyword.toLowerCase())
      })
      setState({...state, planAreaData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, planAreaData: state.tmpPlanAreaData})
      setTotal(state.tmpPlanAreaData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.planAreaData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IPlanAreaModel[] = state.planAreaData.slice(indexOfFirstPage, indexOfLastPage)

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='card-header border-0 pt-4 ps-0' id='kt_chat_contacts_header'>
            <span className='w-100 position-relative'>
              <KTSVG
                path='/media/icons/duotune/general/gen021.svg'
                className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 position-absolute pt-14 ms-5 translate-middle-y'
              />
              <input
                type='text'
                className='form-control form-control-solid px-15 bg-white'
                placeholder='Search'
                onChange={filter}
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
              to={{pathname: '/p-product/plan-area/add', state: {mainSearch: name}}}
              className='btn btn-sm btn-light-primary bg-white'
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
                  <th className='min-w-150px'>Plan Area</th>
                  <th className='min-w-25px'>isActive</th>
                  <th className='min-w-25px ms-2'>isMandatory</th>
                  <th className='min-w-25px ms-2'>Area Price</th>
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
                                {data.areaName}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className='form-check form-switch'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              id={`${data.planAreaID}`}
                              checked={data.isActive}
                              onChange={(e) => handleShowActive(e)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className='form-check form-switch'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              id={`${data.planAreaID}`}
                              checked={data.isMandatory}
                              onChange={(e) => handleShowMandatory(e)}
                            />
                          </div>
                        </td>
                        <td className=''>
                          <div>
                            <Link
                              to={{
                                pathname: `/p-product/plan-area/${data.planAreaID}/list`,
                                state: {
                                  areaName: data.areaName,
                                  planAreaID: data.planAreaID,
                                  mainSearch: name,
                                },
                              }}
                              className='btn btn-icon btn-bg-light bg-hover-success text-hover-inverse-success btn-sm m-1'
                            >
                              <KTSVG
                                path='/media/icons/duotune/maps/map002.svg'
                                className='svg-icon-2 svg-icon-success'
                              />
                            </Link>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex justify-content-end flex-shrink-0'>
                            <Link
                              // to={`/p-product/plan-area/edit/${data.planAreaID}`}
                              to={{
                                pathname: `/p-product/plan-area/edit/${data.planAreaID}`,
                                state: {mainSearch: name},
                              }}
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                            >
                              <KTSVG
                                path='/media/icons/duotune/art/art005.svg'
                                className='svg-icon-3 svg-icon-primary'
                              />
                            </Link>
                            <div
                              onClick={() => handleShow(data.planAreaID)}
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
        id={state.selplanAreaID}
        pageName={'PlanArea'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deletePlanAreaItem(state.selplanAreaID)}
      />
      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'PlanArea'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
      {/* ===================Is Mandatory Model===================== */}
      <ModelPopUpIsMandatory
        mandatoryID={state.mandatoryID}
        mandatoryType={state.mandatoryType}
        pageName={'PlanArea'}
        showMandatory={showMandatory}
        handleCloseMandatory={handleCloseMandatory}
        IsActiveFunc={() => checkedMandatoryFunction(state.mandatoryID, state.mandatoryType)}
      />
    </>
  )
}

export default PlanAreaListPage
