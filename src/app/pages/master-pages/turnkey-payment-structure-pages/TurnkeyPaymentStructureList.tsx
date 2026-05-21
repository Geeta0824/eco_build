import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {
  ITurnkeyPaymentStrByBranchModel,
  ITurnkeyPaymentStructureModel,
} from '../../../models/master-page/ITurnkeyPaymentStructureModel'
import {
  deleteTurnkeyProjPayStructure,
  getAllTurnkeyProjPayStructure,
  getBranchWithTurnkeyPaymentStageIDApi,
} from '../../../modules/master-page/turnkey-payment-structure-master-page/TurnkeyPaymentStructureCRUD'
import Pagination from 'antd/es/pagination/Pagination'
import {TurnkeyPaymentStructureCard} from './TurnkeyPaymentStructureCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import {TurnkeyPayStrucBranchMap} from './TurnkeyPayStrucBranchMap'

type Props = {}

interface ITurnkey {
  loading: boolean
  turnkeyData: ITurnkeyPaymentStructureModel[]
  tmpturnkeyData: ITurnkeyPaymentStructureModel[]
  objTurnkeyPaymentStructure: ITurnkeyPaymentStructureModel
  trunkeyPayStrBranchMapData: ITurnkeyPaymentStrByBranchModel[]
  searchText: string
  turnkeyProjPaymentStageID: number
}

const TurnkeyPaymentStructureList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<ITurnkey>({
    loading: false,
    turnkeyData: [] as ITurnkeyPaymentStructureModel[],
    tmpturnkeyData: [] as ITurnkeyPaymentStructureModel[],
    objTurnkeyPaymentStructure: {} as ITurnkeyPaymentStructureModel,
    trunkeyPayStrBranchMapData: [] as ITurnkeyPaymentStrByBranchModel[],
    searchText: '',
    turnkeyProjPaymentStageID: 0,
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
      getTurnkeyData(mainSearch)
    }, 100)
  }, [])

  // ===============GET API CALL=============

  function getTurnkeyData(mainSearch: string) {
    getAllTurnkeyProjPayStructure()
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.responseObject.filter((user: any) => {
              return (
                user.amtPercentage.toString().includes(mainSearch.toLowerCase()) ||
                user.stageName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.projectType.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.sequenceNo.toString().includes(mainSearch.toLowerCase()) ||
                user.projectTypeID.toString().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              turnkeyData: results,
              searchText: mainSearch,
              tmpturnkeyData: responseData.responseObject,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              turnkeyData: responseData.responseObject,
              tmpturnkeyData: responseData.responseObject,
              loading: false,
            })
            setTotal(responseData.responseObject.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.massege}`)
          setState({...state, turnkeyData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, turnkeyData: [], loading: false})
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (turnkeyid: number) => {
    setState({
      ...state,
      loading: false,
      turnkeyProjPaymentStageID: turnkeyid,
    })
    setShow(true)
  }

  // ========================Delete Department=====================
  function deleteTurnkeyItem(turnkeyProjPaymentStageID: number) {
    deleteTurnkeyProjPayStructure(turnkeyProjPaymentStageID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getTurnkeyData(state.searchText)
          setShow(false)
        } else {
          toast.error(`${response.data.massege}`)
          setShow(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setShow(false)
      })
  }
  // -------------------Branch Map -----------------
  const [trunkeyPmtStructureBranch, setTrunkeyPmtStructureBranch] = useState(false)
  const [showTrunkeyPmtStructureBranch, setShowTrunkeyPmtStructureBranch] = useState(false)
  const handleCloseTrunkeyPayStrBranch = () => {
    setShowTrunkeyPmtStructureBranch(false)
    setState({...state, trunkeyPayStrBranchMapData: [], loading: false})
  }

  function trunkeyPmtStructureBranchMapData(
    tmpObjTurnkeyPmtStructure: ITurnkeyPaymentStructureModel
  ) {
    setTrunkeyPmtStructureBranch(true)
    getBranchWithTurnkeyPaymentStageIDApi(tmpObjTurnkeyPmtStructure.turnkeyProjPaymentStageID)
      .then((response) => {
        const trunkeyPayStrBranchMapData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            trunkeyPayStrBranchMapData: trunkeyPayStrBranchMapData,
            objTurnkeyPaymentStructure: tmpObjTurnkeyPmtStructure,
            loading: false,
          })
          setTrunkeyPmtStructureBranch(false)
        } else {
          setState({
            ...state,
            trunkeyPayStrBranchMapData: trunkeyPayStrBranchMapData,
            objTurnkeyPaymentStructure: tmpObjTurnkeyPmtStructure,
            loading: false,
          })
          toast.error(`${response.data.message}`, {position: 'top-center'})
          setTrunkeyPmtStructureBranch(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setTrunkeyPmtStructureBranch(false)
        setState({
          ...state,
          trunkeyPayStrBranchMapData: [],
          objTurnkeyPaymentStructure: tmpObjTurnkeyPmtStructure,
          loading: false,
        })
      })
    setShowTrunkeyPmtStructureBranch(true)
  }
  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpturnkeyData.filter((user) => {
        return (
          user.amtPercentage.toString().includes(keyword.toLowerCase()) ||
          user.stageName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.sequenceNo.toString().includes(keyword.toLowerCase()) ||
          user.projectType.toLowerCase().includes(keyword.toLowerCase()) ||
          user.projectTypeID.toString().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, turnkeyData: results, searchText: keyword})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, turnkeyData: state.tmpturnkeyData, searchText: keyword})
      // If the text field is empty, show all users
      setTotal(state.tmpturnkeyData.length)
      setPage(1)
    }

    setName(keyword)
  }

  // ====================Pagination==============
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: ITurnkeyPaymentStructureModel[] = state.turnkeyData.slice(
    indexOfFirstPage,
    indexOfLastPage
  )

  // function handleClose(): void {
  //   throw new Error('Function not implemented.')
  // }

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/master/turnkey-pay-struc/add'}
          title='Click to add a Turnkey Payment Structure'
        />

        {/* <div className='card-header border-0 py-2 ' style={{backgroundColor: '#000000'}}>
          <div className='border-0 pt-2' id='kt_chat_contacts_header'>
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
            <Link
              to='/master/turnkey-pay-struc/add'
              className='btn btn-sm btn-light-primary bg-white'
              // data-bs-toggle='modal'
              // data-bs-target='#kt_modal_invite_friends'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
              Add New
            </Link>
          </div>
        </div> */}
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
                  <th className='min-w-150px'>Project Type</th>
                  <th className='min-w-150px'>Stage Name</th>
                  <th className='min-w-25px'>Payment Percentage</th>
                  <th className='min-w-25px'>Sequence No.</th>
                  <th className='min-w-25px'>No Of Days</th>
                  <th className='min-w-25px'>Branch</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Loading ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <TurnkeyPaymentStructureCard
                        data={data}
                        handleShow={() => handleShow(data.turnkeyProjPaymentStageID)}
                        trunkeyPmtStructureBranchMapData={() =>
                          trunkeyPmtStructureBranchMapData(data)
                        }
                        name={name}
                      />
                      // <tr key={index}>
                      //   <td className='text-dark text-hover-primary fs-6'>{data.projectType}</td>
                      //   <td className='text-dark text-hover-primary fs-6'>{data.stageName}</td>

                      //   <td className='text-dark text-hover-primary fs-6'>
                      //     {data.amtPercentage} %
                      //   </td>

                      //   <td className='text-dark text-hover-primary fs-6'>{data.sequenceNo}</td>

                      //   <td>
                      //     <div className='d-flex justify-content-end flex-shrink-0'>
                      //       <Link
                      //         to={`/master/turnkey-pay-struc/edit/${data.turnkeyProjPaymentStageID}`}
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/art/art005.svg'
                      //           className='svg-icon-3 svg-icon-primary'
                      //         />
                      //       </Link>
                      //       <div
                      //         onClick={() => handleShow(data.turnkeyProjPaymentStageID)}
                      //         className='btn btn-icon btn-bg-light bg-hover-danger text-hover-inverse-danger  btn-sm'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/general/gen027.svg'
                      //           className='ssvg-icon-3 svg-icon-danger'
                      //         />
                      //       </div>
                      //     </div>
                      //   </td>
                      // </tr>
                    )
                  })}
                {/* =================== Image no data ============== */}
                <BlankDataImageInTable
                  length={currentPosts.length}
                  loading={state.loading}
                  colSpan={9}
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
        id={state.turnkeyProjPaymentStageID}
        pageName={'Turnkey'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteTurnkeyItem(state.turnkeyProjPaymentStageID)}
      />
      <TurnkeyPayStrucBranchMap
        show={showTrunkeyPmtStructureBranch}
        handleClose={handleCloseTrunkeyPayStrBranch}
        trunkeyPayStrBranchMapData={state.trunkeyPayStrBranchMapData}
        turnkeyProjPaymentStageID={state.objTurnkeyPaymentStructure.turnkeyProjPaymentStageID}
        projectType={state.objTurnkeyPaymentStructure.projectType}
        projectTypeID={state.objTurnkeyPaymentStructure.projectTypeID}
        stageName={state.objTurnkeyPaymentStructure.stageName}
      />
    </>
  )
}
export default TurnkeyPaymentStructureList
