import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {
  IAgencyTypeModel,
  IProductCategoryTypeModel,
} from '../../../models/product-page/IAgencyTypeModel'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import {
  GetProductCategoryWithAgencyTypeIDApi,
  deleteAgencyType,
  getAllAgencyType,
  isActiveAgencyType,
  iskazulenciaAgencyType,
} from '../../../modules/product-master-page/agency-type-master-page/AgencyTypeCRUD'
import {ModelPopUpProdCategoryMap} from './ModelPopUpProdCategoryMap'

type Props = {}

interface IAgency {
  loading: boolean
  agencyTypeData: IAgencyTypeModel[]
  tmpAgencyTypeData: IAgencyTypeModel[]
  objCategoryData: IProductCategoryTypeModel[]
  objAgencyData: IAgencyTypeModel
  SearchText: string
  mainSearch: string
  selAgencyType: number
  activeID: number
  KazuleanciaID: number
  activeType: any
  kazulenciaType: any
  mandatoryID: number
  mandatoryType: boolean
}

const AgencyTypeList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IAgency>({
    loading: false,
    agencyTypeData: [] as IAgencyTypeModel[],
    tmpAgencyTypeData: [] as IAgencyTypeModel[],
    objAgencyData: {} as IAgencyTypeModel,
    objCategoryData: [] as IProductCategoryTypeModel[],
    SearchText: '',
    mainSearch: '',
    selAgencyType: 0,
    activeID: 0,
    KazuleanciaID: 0,
    activeType: false,
    kazulenciaType: false,
    mandatoryID: 0,
    mandatoryType: false,
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
      getAllAgencyTypeData(mainSearch)
    }, 100)
  }, [])

  function getAllAgencyTypeData(mainSearch: string) {
    getAllAgencyType()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return user.agencyTypeName.toLowerCase().includes(mainSearch.toLowerCase())
            })

            setState({
              ...state,
              agencyTypeData: results,
              tmpAgencyTypeData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              agencyTypeData: responseData,
              tmpAgencyTypeData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, agencyTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, agencyTypeData: [], loading: false})
      })
  }

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
    isActiveAgencyType(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess == true) {
          getAllAgencyTypeData(state.mainSearch)
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
  const [showKazuleancia, setShowKazuleancia] = useState(false)
  const handleCloseKazuleancia = () => setShowKazuleancia(false)

  function handleShowKazuleancia(event: any) {

    const Cid = event.target.id
    const tmpIsKazulencia = event.target.checked
    setState({
      ...state,
      KazuleanciaID: Cid,
      kazulenciaType: tmpIsKazulencia,
      loading: false,
    })
    setShowKazuleancia(true)
  }

  function checkedFunctionKazuleancia(temEmpId: number, temIsKaz: boolean) {
    iskazulenciaAgencyType(temEmpId, temIsKaz)
      .then((response) => {
        if (response.data.isSuccess == true) {
          getAllAgencyTypeData(state.mainSearch)
          setShowKazuleancia(false)
        } else {
          toast.error(`${response.data.message}`)
          setShowKazuleancia(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowKazuleancia(false)
      })
  }
  //==================================================

  const [prodCategoryMap, setProdCategoryMap] = useState(false)
  const [showProdCategoryMap, setShowProdCategoryMap] = useState(false)
  const handleCloseProdCategory = () => {
    setShowProdCategoryMap(false)
    setState({...state, loading: false})
  }

  function handleShowProdCategoryMap(objProduct: IAgencyTypeModel) {
    setProdCategoryMap(true)
    GetProductCategoryWithAgencyTypeIDApi(objProduct.agencyTypeID)
      .then((response) => {
        const resProdCategoryMapData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            objCategoryData: resProdCategoryMapData,
            objAgencyData: objProduct,
            loading: false,
          })
          setProdCategoryMap(false)
        } else {
          setState({
            ...state,
            loading: false,
          })
          toast.error(`${response.data.message}`, {position: 'top-center'})
          setProdCategoryMap(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setProdCategoryMap(false)
        setState({...state, loading: false})
      })
    setShowProdCategoryMap(true)
  }

  // ==================Delete Model Function===============
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (agencyTypeID: number) => {
    setState({
      ...state,
      selAgencyType: agencyTypeID,
      loading: false,
    })
    setShow(true)
  }

  function deletePlanAreaItem(agencyTypeID: number) {
    deleteAgencyType(agencyTypeID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getAllAgencyTypeData(state.mainSearch)
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
      const results = state.tmpAgencyTypeData.filter((user) => {
        return user.agencyTypeName.toLowerCase().includes(keyword.toLowerCase())
        // user.areaPrice.toLowerCase().includes(keyword.toLowerCase())
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, agencyTypeData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, agencyTypeData: state.tmpAgencyTypeData})
      // If the text field is empty, show all users
      setTotal(state.tmpAgencyTypeData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.agencyTypeData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IAgencyTypeModel[] = state.agencyTypeData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

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
                // name='search'
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
              to={{pathname: '/p-product/agency-type/add', state: {mainSearch: name}}}
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
                  <th className='min-w-120px'>Agency Type Name</th>
                  <th className='min-w-120px'>Agency Percentage</th>
                  <th className='min-w-25px ms-2'>Product Category Map</th>
                  <th className='min-w-25px '>Agency Work Stage</th>
                  <th className='min-w-25px'>isActive</th>
                  <th className='min-w-25px'>isKazulencia</th>
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
                          <span className='text-dark text-hover-primary fs-6'>
                            {data.agencyTypeName}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary fs-6'>
                            {data.adminCommissionPercentage} %
                          </span>
                        </td>
                        <td className='text-center'>
                          <div
                            onClick={() => handleShowProdCategoryMap(data)}
                            className='btn btn-icon btn-bg-light bg-hover-info text-hover-inverse-info btn-sm me-1'
                          >
                            <KTSVG
                              path='/media/icons/duotune/social/soc005.svg'
                              className='svg-icon-2x svg-icon-info'
                            />
                          </div>
                        </td>
                        <td className=''>
                          <div>
                            <Link
                              to={{
                                pathname: `/p-product/agency-type/${data.agencyTypeID}/list`,
                                state: {
                                  agencyTypeName: data.agencyTypeName,
                                  agencyTypeID: data.agencyTypeID,
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
                          <div className='form-check form-switch'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              id={`${data.agencyTypeID}`}
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
                              id={`${data.agencyTypeID}`}
                              checked={data.isKazulencia}
                              onChange={(e) => handleShowKazuleancia(e)}
                            />
                          </div>
                        </td>

                        <td>
                          <div className='d-flex justify-content-end flex-shrink-0'>
                            <Link
                              to={{
                                pathname: `/p-product/agency-type/edit/${data.agencyTypeID}`,
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
                              onClick={() => handleShow(data.agencyTypeID)}
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
        id={state.selAgencyType}
        pageName={'Agency Type'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deletePlanAreaItem(state.selAgencyType)}
      />
      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Agency Type'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
      {/* ===================Is Kazuleancia Model===================== */}
      <ModelPopUpIsActive
        activeID={state.KazuleanciaID}
        activeType={state.kazulenciaType}
        pageName={'Agency Type'}
        showActive={showKazuleancia}
        handleCloseActive={handleCloseKazuleancia}
        IsActiveFunc={() => checkedFunctionKazuleancia(state.KazuleanciaID, state.kazulenciaType)}
      />
      {/* ===================ProdCategory Model=====================  */}

      <ModelPopUpProdCategoryMap
        show={showProdCategoryMap}
        handleClose={handleCloseProdCategory}
        ProdCategoryMapData={state.objCategoryData}
        ProductID={state.objAgencyData.agencyTypeID}
        productName={state.objAgencyData.agencyTypeName}
      />
    </>
  )
}

export default AgencyTypeList
