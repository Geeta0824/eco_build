import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap-v5'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import {deleteBHK, isActiveBHK} from '../../../modules/master-page/bhk-master-page/NewBHKCRUD'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {ModelPopUpIsActive} from '../../common-pages/ModelPopUpIsActive'
import {IBHKMasterModel} from '../../../models/master-page/IBHKMasterModel'
import {BHKMasterCard} from './BHKMasterCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import {getAllBHK} from '../../../modules/master-page/bhk-master-page/NewBHKCRUD'

type Props = {}

interface IBHK {
  loading: boolean
  bhkMasterData: IBHKMasterModel[]
  tmpBHKMasterData: IBHKMasterModel[]
  SearchText: string
  selBHKId: number
  activeID: number
  activeType: any
}

const BHKMasterListPage: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IBHK>({
    loading: false,
    bhkMasterData: [] as IBHKMasterModel[],
    tmpBHKMasterData: [] as IBHKMasterModel[],
    SearchText: '',
    selBHKId: 0,
    activeID: 0,
    activeType: false,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.search
      }
      getAllBHKMasterData(mainSearch)
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

  // =================Is Active Function Model Call==============

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
    let value = {bhkid: temEmpId, isActive: temIsAct}
    var objBHK = btoa(JSON.stringify(value))
    isActiveBHK(`${objBHK}`)
      .then((response) => {
        var decodeResp = JSON.parse(atob(response.data.encodedResponse))
        let resp = decodeResp
        if (resp.isSuccess == true) {
          getAllBHKMasterData(state.SearchText)
          setShowActive(false)
        } else {
          toast.error(`${resp.message}`)
          setShowActive(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShowActive(false)
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
  const currentPosts: IBHKMasterModel[] = state.bhkMasterData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/master/bhkMaster/add'}
          title='Click to add a BHK'
        />

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
                  <th className='min-w-150px'>BHK Name</th>
                  <th className='min-w-25px'>isActive</th>
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
                      <BHKMasterCard
                        data={data}
                        handleShowActive={(e) => handleShowActive(e)}
                        handleShow={() => handleShow(data.bhkid)}
                        name={name}
                      />
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
      {/* ===================Is Active Model===================== */}
      <ModelPopUpIsActive
        activeID={state.activeID}
        activeType={state.activeType}
        pageName={'BHK Master'}
        showActive={showActive}
        handleCloseActive={handleCloseActive}
        IsActiveFunc={() => checkedFunction(state.activeID, state.activeType)}
      />
    </>
  )
}

export default BHKMasterListPage
