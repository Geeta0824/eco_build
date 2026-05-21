import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {Pagination} from 'antd'
import {KTSVG} from '../../../../_Ecd/helpers'
import {
  deleteState,
  getAllState,
  isActiveState,
} from '../../../modules/master-page/state-master-page/StateCRUD'
import {getDropDownCountryList} from '../../../modules/master-page/country-master-page/NewCountryCRUD'
import {IStateModel} from '../../../models/master-page/IStateModel'
import {ICountryModel} from '../../../models/master-page/ICountryModel'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import Header_Add from '../../../../components/table-header/Header_Add'
import Header_Search from '../../../../components/table-header/Header_Search'
import {StateCard} from './StateCard'

type Props = {}

interface IState {
  loading: boolean
  stateData: IStateModel[]
  temStateData: IStateModel[]
  countryData: ICountryModel[]
  SearchText: string
  selStateID: number
  activeID: number
  activeType: any
  selCountryId: number
}

const StateListPage: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IState>({
    loading: false,
    stateData: [] as IStateModel[],
    temStateData: [] as IStateModel[],
    countryData: [] as ICountryModel[],
    SearchText: '',
    selStateID: 0,
    activeID: 0,
    activeType: false,
    selCountryId: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      var mainCountryId: number = 0
      if (lc != undefined) {
        mainSearch = lc.search
        mainCountryId = lc.countryID
      }
      getStateData(mainSearch, mainCountryId)
    }, 100)
  }, [])

  // Get State API Call
  function getStateData(mainSearch: string, mainCountryId: number) {
    getAllState()
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess === true) {
          getCountryData(responseData.responseObject, mainSearch, mainCountryId)
        } else {
          toast.error(`${responseData.message}`)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, stateData: [], selCountryId: mainCountryId, loading: false})
      })
  }

  //API Call for Country Dropdown

  function getCountryData(
    temresponseStateData: IStateModel[],
    mainSearch: string,
    mainCountryID: number
  ) {
    getDropDownCountryList()
      .then((response) => {
        // let responseData = response.data
        let decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          if (mainSearch !== '' && mainCountryID !== 0) {
            const results = temresponseStateData.filter((user: any) => {
              return (
                user.countryName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.stateMaster.toLowerCase().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            const temRows = []
            const Rows = results
            for (let key in Rows) {
              if (Rows[key].countryID == mainCountryID) {
                temRows.push(Rows[key])
              }
            }
            setState({
              ...state,
              stateData: temRows,
              temStateData: temresponseStateData,
              countryData: resp.responseObject,
              selCountryId: mainCountryID,
              SearchText: mainSearch,
              loading: false,
            })
            setTotal(temRows.length)
            setPage(1)
          } else if (mainSearch !== '') {
            const results = temresponseStateData.filter((user) => {
              return (
                user.countryName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.stateMaster.toLowerCase().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              stateData: results,
              temStateData: temresponseStateData,
              countryData: resp.responseObject,
              selCountryId: mainCountryID,
              SearchText: mainSearch,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else if (mainSearch == '' && mainCountryID !== 0) {
            const temRows = []
            const Rows = temresponseStateData
            for (let key in Rows) {
              if (Rows[key].countryID == mainCountryID) {
                temRows.push(Rows[key])
              }
            }
            setState({
              ...state,
              stateData: temRows,
              temStateData: temresponseStateData,
              countryData: resp.responseObject,
              selCountryId: mainCountryID,
              SearchText: mainSearch,
              loading: false,
            })
            setTotal(temRows.length)
            setPage(1)
          } else {
            setState({
              ...state,
              countryData: resp.responseObject,
              stateData: temresponseStateData,
              temStateData: temresponseStateData,
              selCountryId: mainCountryID,
              loading: false,
            })
            setTotal(temresponseStateData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${resp.message}`)
          setState({...state, countryData: [], stateData: [], temStateData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, countryData: [], stateData: [], temStateData: [], loading: false})
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

  // -------------------IsActive Funciton-------------

  function checkedFunction(temEmpId: number, temIsAct: boolean) {
    isActiveState(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess === true) {
          getStateData(state.SearchText, state.selCountryId)
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
  const handleShow = (stateID: number) => {
    setState({
      ...state,
      selStateID: stateID,
      loading: false,
    })
    setShow(true)
  }

  // Delete Function

  const deleteStateItem = (stateId: number) => {
    deleteState(stateId)
      .then((response) => {
        if (response.data.isSuccess === true) {
          toast.success('Deleted Successfully')
          getStateData(state.SearchText, state.selCountryId)
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

  // Filter Function By Country Name

  function getlistbyCountryIdValue(event: any) {
    const countryVaule = event.target.value
    filterCountry(countryVaule)
  }

  // ====================Filter Country=================

  function filterCountry(countryVaule: number) {
    const temRows = []
    const Rows = state.temStateData
    for (let key in Rows) {
      if (Rows[key].countryID == countryVaule) {
        temRows.push(Rows[key])
      }
    }
    if (countryVaule == 0) {
      setState({...state, stateData: state.temStateData, selCountryId: 0})
      setTotal(state.temStateData.length)
      setPage(1)
      setName('')
    } else {
      setState({...state, stateData: temRows, selCountryId: countryVaule})
      setTotal(temRows.length)
      setPage(1)
    }
  }

  // Search Function By Country And State Name
  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '' && state.selCountryId !== 0) {
      const temRows = []
      const Rows = state.temStateData
      for (let key in Rows) {
        if (Rows[key].countryID == state.selCountryId) {
          temRows.push(Rows[key])
        }
      }
      const results = temRows.filter((user) => {
        return (
          user.countryName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.stateMaster.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, stateData: results})
      setTotal(results.length)
      setPage(1)
    } else if (keyword !== '') {
      const results = state.temStateData.filter((user) => {
        return (
          user.countryName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.stateMaster.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, stateData: results})
      setTotal(results.length)
      setPage(1)
    } else if (keyword == '' && state.selCountryId !== 0) {
      filterCountry(state.selCountryId)
    } else {
      setState({...state, stateData: state.temStateData})
      // If the text field is empty, show all users
      setTotal(state.temStateData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ================= Pagination ===================

  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IStateModel[] = state.stateData.slice(indexOfFirstPage, indexOfLastPage)

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='pt-4'>
            <select
              className='form-select form-select-white'
              onChange={(e) => getlistbyCountryIdValue(e)}
            >
              <option value={0} selected={state.selCountryId == 0}>
                Select All Country
              </option>
              {state.countryData.length > 0 &&
                state.countryData.map((data, index) => {
                  return (
                    <option
                      key={index}
                      value={data.countryID}
                      selected={state.selCountryId == data.countryID}
                    >
                      {data.countryName}
                    </option>
                  )
                })}
            </select>
          </div>

          <Header_Search searchText={name} filter={filter} />
          <Header_Add
            pathName='/master/state/add'
            title='Click to add a state'
            searchText={name}
            id={state.selCountryId}
          />
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
                  <th className='min-w-150px'>State Name</th>
                  <th className='min-w-140px'>Country Name</th>
                  <th className='min-w-25px'>Active</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              <tbody className="border-bottom">
                {/* ============================== Data Loading ============================== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <StateCard
                        data={data}
                        handleShowActive={(e) => handleShowActive(e)}
                        handleShow={() => handleShow(data.stateID)}
                        name={name}
                        selCountryID={state.selCountryId}
                      />
                      // <tr key={index}>
                      //   <td>
                      //     <div className='d-flex align-items-center'>
                      //       <div className='d-flex justify-content-start flex-column'>
                      //         <a href='#' className='text-dark text-hover-primary fs-6'>
                      //           {data.stateMaster}
                      //         </a>
                      //       </div>
                      //     </div>
                      //   </td>
                      //   <td>
                      //     <a href='#' className='text-dark text-hover-primary d-block fs-6'>
                      //       {data.countryName}
                      //     </a>
                      //   </td>
                      //   <td>
                      //     <div className='form-check form-switch'>
                      //       <input
                      //         id={`${data.stateID}`}
                      //         className='form-check-input'
                      //         type='checkbox'
                      //         checked={data.isActive}
                      //         onChange={(e) => handleShowActive(e)}
                      //       />
                      //     </div>
                      //   </td>
                      //   <td>
                      //     <div className='d-flex justify-content-end flex-shrink-0'>
                      //       <Link
                      //         to={`/master/state/edit/${data.stateID}`}
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/art/art005.svg'
                      //           className='svg-icon-3 svg-icon-primary'
                      //         />
                      //       </Link>
                      //       <a
                      //         onClick={() => handleShow(data.stateID)}
                      //         className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/general/gen027.svg'
                      //           className='svg-icon-3 svg-icon-danger'
                      //         />
                      //       </a>
                      //     </div>
                      //   </td>
                      // </tr>
                    )
                  })}
                {/* =================== Loading Image ============== */}
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
        id={state.selStateID}
        pageName={'State'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteStateItem(state.selStateID)}
      />
      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'State'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
    </>
  )
}

export default StateListPage
