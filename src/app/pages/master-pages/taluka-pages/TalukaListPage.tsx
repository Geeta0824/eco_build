import React, {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {Link, useLocation} from 'react-router-dom'
import {ITalukaModel} from '../../../models/master-page/ITalukaModel'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import Search from 'antd/es/input/Search'
import {
  deleteTaluka,
  getAllTaluka,
  getAllTalukaFilter,
  isActiveTaluka,
} from '../../../modules/master-page/taluka-master-page/TalukaCRUD'
import {getAllCity} from '../../../modules/master-page/district-master-page/DistrictCRUD'
import {IDistrictModel} from '../../../models/master-page/IDistrictModel'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import {TalukaCard} from './TalukaCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import Header_Add from '../../../../components/table-header/Header_Add'

type Props = {}

interface ITaluka {
  loading: boolean
  talukaData: ITalukaModel[]
  tmpTalukaData: ITalukaModel[]
  districtData: IDistrictModel[]
  SearchText: string
  selTalukaId: number
  activeID: number
  selCityID: number
  activeType: any
}
const TalukaListPage: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<ITaluka>({
    loading: false,
    talukaData: [] as ITalukaModel[],
    tmpTalukaData: [] as ITalukaModel[],
    districtData: [] as IDistrictModel[],
    SearchText: '',
    selTalukaId: 0,
    activeID: 0,
    selCityID: 0,
    activeType: false,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      var mainSearch: string = ''
      var mainCityID: number = 0
      if (lc != undefined) {
        mainSearch = lc.search
        mainCityID = lc.selcityID
      }
      getDistrictData(mainSearch, mainCityID)
    }, 100)
  }, [])

  // get State API Call For Search Dropdown

  function getDistrictData(mainSearch: string, mainCityID: number) {
    getAllCity()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess) {
          // const temRows: IDistrictModel[] = []
          // const Rows: IDistrictModel[] = responseData
          // for (let key in Rows) {
          //   if (Rows[key].isActive === true) {
          //     temRows.push(Rows[key])
          //   }
          // }
          getTalukaData(responseData, mainSearch, mainCityID)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            districtData: [],
            loading: false,
            selCityID: mainCityID,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          districtData: [],
          loading: false,
          selCityID: mainCityID,
        })
      })
  }

  // ===============GET API CALL=============

  const getTalukaData = (
    districtData: IDistrictModel[],
    mainSearch: string,
    mainCityID: number
  ) => {
    getAllTalukaFilter(mainCityID, mainSearch)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess) {
          setState({
            ...state,
            districtData,
            talukaData: responseData,
            tmpTalukaData: responseData,
            selCityID: mainCityID,
            SearchText: mainSearch,
            loading: false,
          })
          setTotal(responseData.length)
          setPage(1)
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, talukaData: [], tmpTalukaData: [], districtData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, talukaData: [], tmpTalukaData: [], districtData: [], loading: false})
      })
  }
  // ================= Model For IsActive==================

  const [showActive, setShowActive] = useState(false)
  const handleCloseActive = () => setShowActive(false)

  function handleShowActive(event: any) {
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
    isActiveTaluka(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess == true) {
          getTalukaData(state.districtData, state.SearchText, state.selCityID)
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

  // ================Model For Delete=====================

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (talukaID: number) => {
    setState({
      ...state,
      selTalukaId: talukaID,
      loading: false,
    })
    setShow(true)
  }

  // =============DELETE API CALL===================
  const deleteTalukaItem = (talukaId: number) => {
    deleteTaluka(talukaId)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getTalukaData(state.districtData, state.SearchText, state.selCityID)
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

  // ============*****---------------- Pagination ----------------*****=============

  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)

  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: ITalukaModel[] = state.talukaData.slice(indexOfFirstPage, indexOfLastPage)
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  // ==============DropDown Filter with state ===================

  function getlistbyDistrictIdValue(event: any) {
    const districtName = event.target.value
    if (parseInt(districtName) !== 0) {
      getTalukaData(state.districtData, state.SearchText, parseInt(districtName))
    } else {
      getTalukaData(state.districtData, '', 0)
      setName('')
    }
    // filterDistrict(districtName)
  }

  // function filterDistrict(districtName: number) {
  //   const Rows = state.tmpTalukaData
  //   for (let key in Rows) {
  //     if (Rows[key].districtID == districtName) {
  //       temRows.push(Rows[key])
  //     }
  //   }
  //   if (districtName == 0) {
  //     getAllTalukaFilter(0, state.SearchText)
  //     setState({...state, talukaData: state.tmpTalukaData, selCityID: 0})
  //     setTotal(state.tmpTalukaData.length)
  //     setPage(1)
  //     setName('')
  //   } else {
  //     getAllTalukaFilter(districtName, state.SearchText)
  //     setState({...state, talukaData: temRows, selCityID: districtName})
  //     setTotal(temRows.length)
  //     setPage(1)
  //   }
  // }

  //------------------- the value of the search field----------------

  const [name, setName] = useState('')
  const searchFilter = (e: any) => {
    setName(e.target.value)
  }
  function OnSearchfilter(value: string) {
    getTalukaData(state.districtData, value, state.selCityID)
  }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}

        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          {/* <h3 className='card-title align-items-start flex-column'> */}
          {/* <span className='card-label fw-bolder fs-3 mb-1'>Taluka</span>
            <span className='text-muted mt-1 fw-bold fs-7'>Over 500 Cities</span> */}
          {/* </h3> */}

          <div className='pt-4'>
            <select
              className='form-select form-select-white'
              onChange={(e) => getlistbyDistrictIdValue(e)}
            >
              <option value={0} selected={state.selCityID == 0}>
                Select All District
              </option>
              {state.districtData.length > 0 &&
                state.districtData.map((data, index) => {
                  return (
                    <option
                      key={index}
                      value={data.cityID}
                      selected={state.selCityID == data.cityID}
                    >
                      {data.cityName}
                    </option>
                  )
                })}
            </select>
          </div>
          <div className='mb-4 col-xl-3 col-sm-6'>
            {/* <div className='mb-2 col-xl-4 col-sm-6 ps-0'> */}
            <label className='form-label fw-bold text-white'>Search :</label>
            <Search
              placeholder='input search text'
              value={name}
              allowClear={true}
              onChange={searchFilter}
              onSearch={OnSearchfilter} // now receives the actual value from input
              style={{width: '100%'}}
            />
          </div>
          <Header_Add
            searchText={name}
            pathName={'/master/taluka/add'}
            title='Click to add a Taluka'
            id={state.selCityID}
          />
          {/* <div className='card-header border-0 pt-4' id='kt_chat_contacts_header'>
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
                // placeholder={intl.formatMessage({id: 'PEOPLE.SEARCH'})}
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
            <Link to='/master/taluka/add' className='btn btn-sm btn-light-primary bg-white'>
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div> */}
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
                  <th className='min-w-140px'>Taluka</th>
                  <th className='min-w-140px'>District</th>
                  <th className='min-w-140px'>State</th>
                  <th className='min-w-140px'>Country</th>
                  <th className='min-w-25px'>Active</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className='border-bottom'>
                {/* =================== Api Data Blank ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <TalukaCard
                        data={data}
                        handleShowActive={(e) => handleShowActive(e)}
                        handleShow={() => handleShow(data.talukaID)}
                        name={name}
                        selDistrictID={state.selCityID}
                      />
                    )
                  })}
                {/* =================== Loading get Api Data ============== */}
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
      {/* =====================Delete Model PopUp=============== */}
      <ModelPopUpDelete
        id={state.selTalukaId}
        pageName={'Taluka'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteTalukaItem(state.selTalukaId)}
      />
      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'Taluka'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
    </>
  )
}

export default TalukaListPage
