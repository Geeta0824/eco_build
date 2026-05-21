import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {
  IModularPaymentSystemModel,
  IModularPmtStageByBranchModel,
} from '../../../models/master-page/IModularPaymentSystemModel'
import {
  deleteModularProjPayStructureAPI,
  getAllModularProjPayStructureAPI,
  getBranchWithModularPaymentStageIDApi,
} from '../../../modules/master-page/modular-payment-structure/ModularPaymentStructureCRUD'
import {ModularPaymentStructureCard} from './ModularPaymentStructureCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import {ModularPayStrucBranchMap} from './ModularPayStrucBranchMap'

type Props = {}

interface IModularStage {
  loading: boolean
  ModularPaymentData: IModularPaymentSystemModel[]
  tmpModularPaymentData: IModularPaymentSystemModel[]
  objModularPaymentStructure: IModularPaymentSystemModel
  modularPayStrBranchMapData: IModularPmtStageByBranchModel[]
  searchText: string
  dncProjPaymentStageID: number
}

const ModularPaymentStructureList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IModularStage>({
    loading: false,
    ModularPaymentData: [] as IModularPaymentSystemModel[],
    tmpModularPaymentData: [] as IModularPaymentSystemModel[],
    objModularPaymentStructure: {} as IModularPaymentSystemModel,
    modularPayStrBranchMapData: [] as IModularPmtStageByBranchModel[],
    searchText: '',
    dncProjPaymentStageID: 0,
  })

  useEffect(() => {
    setState({...state, loading: false})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.search
      }
      getModularProjPayData(mainSearch)
    }, 100)
  }, [])

  // ===============GET API CALL=============

  function getModularProjPayData(mainSearch: string) {
    getAllModularProjPayStructureAPI()
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.responseObject.filter((user: any) => {
              return (
                user.stageName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.amtPercentage.toString().includes(mainSearch.toLowerCase()) ||
                user.sequenceNo.toString().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              ModularPaymentData: results,
              searchText: mainSearch,
              tmpModularPaymentData: responseData.responseObject,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              ModularPaymentData: responseData.responseObject,
              tmpModularPaymentData: responseData.responseObject,
              loading: false,
            })
            setTotal(responseData.responseObject.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.massege}`)
          setState({...state, ModularPaymentData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, ModularPaymentData: [], loading: false})
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (modId: number) => {
    setState({
      ...state,
      dncProjPaymentStageID: modId,
      loading: false,
    })
    setShow(true)
  }

  // ========================Delete DNC PAYMENT STRUCTURE=====================
  function deleteModularProjPayStr(modId: number) {
    deleteModularProjPayStructureAPI(modId)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getModularProjPayData(state.searchText)
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
  const [modularPmtStructureBranch, setmodularPmtStructureBranch] = useState(false)
  const [showModularPmtStructureBranch, setShowModularPmtStructureBranch] = useState(false)
  const handleClosemodularPayStrBranch = () => {
    setShowModularPmtStructureBranch(false)
    setState({...state, modularPayStrBranchMapData: [], loading: false})
  }

  function modularPmtStructureBranchMapData(tmpObjModularPmtStructure: IModularPaymentSystemModel) {
    setmodularPmtStructureBranch(true)
    getBranchWithModularPaymentStageIDApi(tmpObjModularPmtStructure.dncProjPaymentStageID)
      .then((response) => {
        const modularPayStrBranchMapData = response.data.responseObject
        if (response.data.isSuccess === true) {
          setState({
            ...state,
            modularPayStrBranchMapData: modularPayStrBranchMapData,
            objModularPaymentStructure: tmpObjModularPmtStructure,
            loading: false,
          })
          setmodularPmtStructureBranch(false)
        } else {
          setState({
            ...state,
            modularPayStrBranchMapData: modularPayStrBranchMapData,
            objModularPaymentStructure: tmpObjModularPmtStructure,
            loading: false,
          })
          toast.error(`${response.data.message}`, {position: 'top-center'})
          setmodularPmtStructureBranch(false)
        }
      })
      .catch((error) => {
        toast.error(`${error}`, {position: 'top-center'})
        setmodularPmtStructureBranch(false)
        setState({
          ...state,
          modularPayStrBranchMapData: [],
          objModularPaymentStructure: tmpObjModularPmtStructure,
          loading: false,
        })
      })
    setShowModularPmtStructureBranch(true)
  }
  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpModularPaymentData.filter((user) => {
        return (
          user.stageName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.amtPercentage.toString().includes(keyword.toLowerCase()) ||
          user.sequenceNo.toString().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, ModularPaymentData: results, searchText: keyword})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, ModularPaymentData: state.tmpModularPaymentData, searchText: keyword})
      // If the text field is empty, show all users
      setTotal(state.tmpModularPaymentData.length)
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
  const currentPosts: IModularPaymentSystemModel[] = state.ModularPaymentData.slice(
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
          pathName={'/master/modular-pay-struc/add'}
          title='Click to add a Modular Payment Structure'
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
                  <th className='min-w-150px'>Stage Name</th>
                  <th className='min-w-25px'>Payment Percentage</th>
                  <th className='min-w-25px'>Sequence No.</th>
                  <th className='min-w-25px'>No. Of Days</th>
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
                      <ModularPaymentStructureCard
                        data={data}
                        handleShow={() => handleShow(data.dncProjPaymentStageID)}
                        modularPmtStructureBranchMapData={() =>
                          modularPmtStructureBranchMapData(data)
                        }
                        name={name}
                      />
                      // <tr key={index}>
                      //   <td className='text-dark text-hover-primary fs-6'>{data.stageName}</td>

                      //   <td className='text-dark text-hover-primary fs-6'>{data.amtPercentage} %</td>

                      //   <td className='text-dark text-hover-primary fs-6'>{data.sequenceNo}</td>

                      //   <td>
                      //     <div className='d-flex justify-content-end flex-shrink-0'>
                      //       <Link
                      //         to={`/master/modular-pay-struc/edit/${data.dncProjPaymentStageID}`}
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/art/art005.svg'
                      //           className='svg-icon-3 svg-icon-primary'
                      //         />
                      //       </Link>
                      //       <div
                      //         onClick={() => handleShow(data.dncProjPaymentStageID)}
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
        id={state.dncProjPaymentStageID}
        pageName={'Modular Pay'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteModularProjPayStr(state.dncProjPaymentStageID)}
      />
      <ModularPayStrucBranchMap
        show={showModularPmtStructureBranch}
        handleClose={handleClosemodularPayStrBranch}
        modularPmtStageBranchMapData={state.modularPayStrBranchMapData}
        modularProjPaymentStageID={state.objModularPaymentStructure.dncProjPaymentStageID}
        stageName={state.objModularPaymentStructure.stageName}
      />
    </>
  )
}
export default ModularPaymentStructureList
