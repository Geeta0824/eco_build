import React, {createContext, useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {Link, useLocation} from 'react-router-dom'
import {IDistrictModel, IStateWebModel} from '../../../models/master-page/IDistrictModel'
import {KTSVG} from '../../../../_Ecd/helpers'
import {
  deleteCity,
  getAllCity,
  isActiveCity,
} from '../../../modules/master-page/district-master-page/DistrictCRUD'
import {getAllState} from '../../../modules/master-page/state-master-page/StateCRUD'
import {Pagination} from 'antd'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import DropdownSate from './DropdownSate'
import Header_Search from '../../../../components/table-header/Header_Search'
import Header_Add from '../../../../components/table-header/Header_Add'
import {DistrictListCard} from './DistrictListCard'
type MachineContextType = {
  getState(value: number): void
  // StateID:number
}
export const MachineMain = createContext<MachineContextType>({getState() {}})
type Props = {}

interface IDistrict {
  loading: boolean
  districtData: IDistrictModel[]
  temDistrictData: IDistrictModel[]
  stateData: IStateWebModel[]
  SearchText: string
  selDistrictID: number
  activeID: number
  activeType: any
}
const DistrictListPage: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IDistrict>({
    loading: false,
    districtData: [] as IDistrictModel[],
    temDistrictData: [] as IDistrictModel[],
    stateData: [] as IStateWebModel[],
    SearchText: '',
    selDistrictID: 0,
    activeID: 0,
    activeType: false,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      var mainSearch: string = ''
      var districtID: number = 0
      if (lc != undefined) {
        mainSearch = lc.searchText
        districtID = lc.selDistrictID
      }
      getStateData(mainSearch, districtID)
    }, 100)
  }, [])

  // ===============GET API CALL=============

  // get State API Call For Search Dropdown

  function getStateData(mainSearch: string, districtID: number) {
    getAllState()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess) {
          const temRows: IStateWebModel[] = []
          const Rows: IStateWebModel[] = responseData
          for (let key in Rows) {
            if (Rows[key].isActive === true) {
              temRows.push(Rows[key])
            }
          }
          getCityData(temRows, mainSearch, districtID)
        } else {
          toast.error(`${response.data.message}`)
          setState({
            ...state,
            stateData: [],
            districtData: [],
            temDistrictData: [],
            loading: false,
            selDistrictID: districtID,
          })
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({
          ...state,
          stateData: [],
          districtData: [],
          temDistrictData: [],
          loading: false,
          selDistrictID: districtID,
        })
      })
  }

  const getCityData = (stateData: IStateWebModel[], mainSearch: string, districtID: number) => {
    getAllCity()
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess) {
          if (mainSearch !== '' && districtID !== 0) {
            const results = responseData.filter((user: any) => {
              return (
                user.cityName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.countryName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.stateMaster.toLowerCase().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            const temRows = []
            const Rows = results
            for (let key in Rows) {
              if (Rows[key].stateID == districtID) {
                temRows.push(Rows[key])
              }
            }
            setState({
              ...state,
              stateData,
              districtData: temRows,
              temDistrictData: responseData,
              selDistrictID: districtID,
              SearchText: mainSearch,
              loading: false,
            })
            setTotal(temRows.length)
            setPage(1)
          } else if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.cityName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.countryName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.stateMaster.toLowerCase().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              stateData,
              districtData: results,
              temDistrictData: responseData,
              selDistrictID: districtID,
              SearchText: mainSearch,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else if (districtID !== 0) {
            const temRows = []
            const Rows = responseData
            for (let key in Rows) {
              if (Rows[key].stateID == districtID) {
                temRows.push(Rows[key])
              }
            }
            setState({
              ...state,
              stateData,
              districtData: temRows,
              temDistrictData: responseData,
              selDistrictID: districtID,
              SearchText: mainSearch,
              loading: false,
            })
            setTotal(temRows.length)
            setPage(1)
          } else {
            setState({
              ...state,
              stateData,
              districtData: responseData,
              temDistrictData: responseData,
              selDistrictID: districtID,
              SearchText: mainSearch,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, districtData: [], loading: false})
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
    isActiveCity(temEmpId, temIsAct)
      .then((response) => {
        if (response.data.isSuccess == true) {
          getCityData(state.stateData, state.SearchText, state.selDistrictID)
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
  const handleShow = (cityID: number) => {
    setState({
      ...state,
      selDistrictID: cityID,
      loading: false,
    })
    setShow(true)
  }

  // =============DELETE API CALL===================
  const deleteDistrictItem = (cityId: number) => {
    deleteCity(cityId)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getCityData(state.stateData, state.SearchText, state.selDistrictID)
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

  // ==============DropDown Filter with state ===================

  function getlistbyStateIdValue(event: any) {
    const stateValue = event.target.value
    filterState(stateValue)
  }

  function filterState(stateValue: number) {
    let temRows: IDistrictModel[] = []

    if (stateValue != 0 && name !== '') {
      const results = state.temDistrictData.filter((user) => {
        return (
          user.cityName.toLowerCase().includes(name.toLowerCase()) ||
          user.countryName.toLowerCase().includes(name.toLowerCase()) ||
          user.stateMaster.toLowerCase().includes(name.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      const Rows = results
      for (let key in Rows) {
        if (Rows[key].stateID == stateValue) {
          temRows.push(Rows[key])
        }
      }
      setState({...state, districtData: temRows, selDistrictID: stateValue})
      setTotal(temRows.length)
      setPage(1)
    } else if (stateValue == 0 && name !== '') {
      const results = state.temDistrictData.filter((user) => {
        return (
          user.cityName.toLowerCase().includes(name.toLowerCase()) ||
          user.countryName.toLowerCase().includes(name.toLowerCase()) ||
          user.stateMaster.toLowerCase().includes(name.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, districtData: results, selDistrictID: stateValue})
      setTotal(results.length)
      setPage(1)
    } else if (stateValue == 0) {
      setState({...state, districtData: state.temDistrictData, selDistrictID: stateValue})
      setTotal(state.temDistrictData.length)
      setPage(1)
    } else {
      const Rows = state.temDistrictData
      for (let key in Rows) {
        if (Rows[key].stateID == stateValue) {
          temRows.push(Rows[key])
        }
      }
      setState({...state, districtData: temRows, selDistrictID: stateValue})
      setTotal(temRows.length)
      setPage(1)
    }
    setPage(1)
  }

  // ============*****---------------- Pagination ----------------*****=============

  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)

  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IDistrictModel[] = state.districtData.slice(indexOfFirstPage, indexOfLastPage)
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '' && state.selDistrictID !== 0) {
      let temRows: IDistrictModel[] = []
      const Rows = state.temDistrictData
      for (let key in Rows) {
        if (Rows[key].stateID == state.selDistrictID) {
          temRows.push(Rows[key])
        }
      }
      const results = temRows.filter((user) => {
        return (
          user.cityName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.countryName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.stateMaster.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, districtData: results})
      setTotal(results.length)
      setPage(1)
    } else if (keyword == '' && state.selDistrictID !== 0) {
      let temRows: IDistrictModel[] = []
      const Rows = state.temDistrictData
      for (let key in Rows) {
        if (Rows[key].stateID == state.selDistrictID) {
          temRows.push(Rows[key])
        }
      }
      setState({...state, districtData: temRows})
      setTotal(temRows.length)
      setPage(1)
    } else if (keyword !== '') {
      const results = state.temDistrictData.filter((user) => {
        return (
          user.cityName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.countryName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.stateMaster.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, districtData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, districtData: state.temDistrictData})
      // If the text field is empty, show all users
      setTotal(state.temDistrictData.length)
      setPage(1)
    }
    setName(keyword)
  }

  function getState(value: number) {
    //
    filterState(value)
  }
  return (
    <>
      <MachineMain.Provider value={{getState}}>
        <div className={`card `}>
          {/* begin::Header */}
          <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
            {/* <h3 className='card-title align-items-start flex-column'> */}
            {/* <span className='card-label fw-bolder fs-3 mb-1'>City</span>
            <span className='text-muted mt-1 fw-bold fs-7'>Over 500 Cities</span> */}
            {/* </h3> */}

            <div className='pt-4'>
              <select
                className='form-select form-select-white'
                onChange={(e) => getlistbyStateIdValue(e)}
              >
                <option value={0} selected={state.selDistrictID == 0}>
                  Select All State
                </option>
                {state.stateData.length > 0 &&
                  state.stateData.map((data, index) => {
                    return (
                      <option
                        key={index}
                        value={data.stateID}
                        selected={state.selDistrictID == data.stateID}
                      >
                        {data.stateMaster}
                      </option>
                    )
                  })}
              </select>
            </div>
            {/* <DropdownSate districtID={state.selDistrictID} /> */}

            <Header_Search searchText={name} filter={filter} />
            <Header_Add
              pathName={'/master/district/add'}
              title='Click to add a district'
              searchText={name}
              id={state.selDistrictID}
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
                    <th className='min-w-140px'>District</th>
                    <th className='min-w-140px'>State</th>
                    <th className='min-w-140px'>Country</th>
                    <th className='min-w-25px'>Active</th>
                    <th className='min-w-100px text-end'>Edit | Delete</th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody className="border-bottom">
                  {/* =================== Api Data Blank ============== */}
                  <LoaderInTable loading={state.loading} column={15} />
                  {currentPosts.length > 0 &&
                    currentPosts.map((data, index) => {
                      return (
                        <DistrictListCard
                          data={data}
                          handleShowActive={(e) => handleShowActive(e)}
                          handleShow={() => handleShow(data.cityID)}
                          name={name}
                          selDistrictID={state.selDistrictID}
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
          id={state.selDistrictID}
          pageName={'District'}
          show={show}
          handleClose={handleClose}
          deleteData={() => deleteDistrictItem(state.selDistrictID)}
        />

        {/* ===================Is Active Model===================== */}
        <ModelPopUpIsActive
          activeID={state.activeID}
          activeType={state.activeType}
          pageName={'District'}
          showActive={showActive}
          handleCloseActive={handleCloseActive}
          IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
        />
      </MachineMain.Provider>
    </>
  )
}

export default DistrictListPage
