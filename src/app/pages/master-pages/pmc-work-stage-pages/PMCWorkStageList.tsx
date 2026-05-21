import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap-v5'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG, toAbsoluteUrl} from '../../../../_Ecd/helpers'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {IPMCWorkStageModel} from '../../../models/master-page/IPMCWorkStageModel'
import {
  deletePMCWorkStageStructure,
  getPMCWorkStageStructure,
} from '../../../modules/master-page/pmc-work-stage-master-page/PMCWorkStageCRUD'
import {PMCWorkStageCard} from './PMCWorkStageCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'

type Props = {}

interface IPMCWorkStage {
  loading: boolean
  pmcWorkStageData: IPMCWorkStageModel[]
  tmpPMCWorkStageData: IPMCWorkStageModel[]
  searchText: string
  sequenceNo: number
  stageName: string
  amtPercentage: number
  pmcWorkStageID: number
}

const PMCWorkStageList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IPMCWorkStage>({
    loading: false,
    pmcWorkStageData: [] as IPMCWorkStageModel[],
    tmpPMCWorkStageData: [] as IPMCWorkStageModel[],
    searchText: '',
    sequenceNo: 0,
    stageName: '',
    amtPercentage: 0,
    pmcWorkStageID: 0,
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
      getPMCWorkWorkStageData(mainSearch)
    }, 100)
  }, [])

  // ===============GET API CALL=============

  function getPMCWorkWorkStageData(mainSearch: string) {
    getPMCWorkStageStructure()
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
              pmcWorkStageData: results,
              searchText: mainSearch,
              tmpPMCWorkStageData: responseData.responseObject,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              pmcWorkStageData: responseData.responseObject,
              tmpPMCWorkStageData: responseData.responseObject,
              loading: false,
            })
            setTotal(responseData.responseObject.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.massege}`)
          setState({...state, pmcWorkStageData: [], loading: true})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, pmcWorkStageData: [], loading: false})
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (pmcid: number) => {
    setState({
      ...state,
      loading: false,
      pmcWorkStageID: pmcid,
    })
    setShow(true)
  }

  // ========================Delete Department=====================
  function deletePMCStageItem(pmcWorkStageID: number) {
    deletePMCWorkStageStructure(pmcWorkStageID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getPMCWorkWorkStageData(state.searchText)
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

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpPMCWorkStageData.filter((user) => {
        return (
          user.stageName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.amtPercentage.toString().includes(keyword.toLowerCase()) ||
          user.sequenceNo.toString().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, pmcWorkStageData: results, searchText: keyword})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, pmcWorkStageData: state.tmpPMCWorkStageData, searchText: keyword})
      // If the text field is empty, show all users
      setTotal(state.tmpPMCWorkStageData.length)
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
  const currentPosts: IPMCWorkStageModel[] = state.pmcWorkStageData.slice(
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
          pathName={'/master/pmc-work-stage/add'}
          title='Click to add a PMC Work Stage'
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
              to='/master/pmc-work-stage/add'
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
                  <th className='min-w-150px'>Stage Name</th>
                  <th className='min-w-25px'>Payment Percentage</th>
                  <th className='min-w-140px'>Sequence No.</th>
                  <th className='min-w-140px'>Material</th>
                  <th className='min-w-100px text-end'>Edit | Delete</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className='border-bottom'>
                {/* =================== Loading ============== */}
                <LoaderInTable loading={state.loading} column={15} />
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <PMCWorkStageCard
                        data={data}
                        handleShow={() => handleShow(data.pmcWorkStageID)}
                        name={name}
                      />
                      // <tr key={index}>
                      //   <td className='text-dark text-hover-primary fs-6'>{data.stageName}</td>

                      //   <td className='text-dark text-hover-primary fs-6'>{data.amtPercentage} %</td>

                      //   <td className='text-dark text-hover-primary fs-6'>{data.sequenceNo}</td>

                      //   <td>
                      //     <div className='d-flex justify-content-end flex-shrink-0'>
                      //       <Link
                      //         to={`/master/pmc-work-stage/edit/${data.pmcWorkStageID}`}
                      //         className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                      //       >
                      //         <KTSVG
                      //           path='/media/icons/duotune/art/art005.svg'
                      //           className='svg-icon-3 svg-icon-primary'
                      //         />
                      //       </Link>
                      //       <div
                      //         onClick={() => handleShow(data.pmcWorkStageID)}
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
        id={state.pmcWorkStageID}
        pageName={'PMCStage'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deletePMCStageItem(state.pmcWorkStageID)}
      />
    </>
  )
}

export default PMCWorkStageList
