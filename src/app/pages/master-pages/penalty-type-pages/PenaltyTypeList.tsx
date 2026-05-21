import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import LoaderInTable from '../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../common-pages/BlankDataImageInTable'
import {ModelPopUpDelete} from '../../common-pages/ModelPopUpDelete'
import {PenaltyTypeCard} from './PenaltyTypeCard'
import Header_Search_Add from '../../../../components/table-header/Header_Search_Add'
import {PenaltyTypeModel} from '../../../models/master-page/PenaltyTypeModel'
import {
  deletePenaltyTypeDetails,
  getAllPenaltyTypeList,
} from '../../../modules/master-page/Penalty-Type-page/PenaltyTypeCRUD'

type Props = {}

interface IDesignStage {
  loading: boolean
  designStageData: PenaltyTypeModel[]
  tmpDesignStageData: PenaltyTypeModel[]
  searchText: string
  sequenceNo: number
  stageName: string
  amtPercentage: number
  selPenalTypeID: number
}

const PenaltyTypeList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<IDesignStage>({
    loading: false,
    designStageData: [] as PenaltyTypeModel[],
    tmpDesignStageData: [] as PenaltyTypeModel[],
    searchText: '',
    sequenceNo: 0,
    stageName: '',
    amtPercentage: 0,
    selPenalTypeID: 0,
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
      getDesignStageData(mainSearch)
    }, 100)
  }, [])

  // ===============GET API CALL=============

  function getDesignStageData(mainSearch: string) {
    getAllPenaltyTypeList()
      .then((response) => {
        let responseData = response.data
        if (responseData.isSuccess == true) {
          if (mainSearch !== '') {
            const results = responseData.responseObject.filter((user: any) => {
              return user.title.toLowerCase().includes(mainSearch.toLowerCase())
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              designStageData: results,
              searchText: mainSearch,
              tmpDesignStageData: responseData.responseObject,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              designStageData: responseData.responseObject,
              tmpDesignStageData: responseData.responseObject,
              loading: false,
            })
            setTotal(responseData.responseObject.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.massege}`)
          setState({...state, designStageData: [], loading: true})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, designStageData: [], loading: false})
      })
  }

  // ==================Delete Model Function===============

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = (temPenalTypeID: number) => {
    setState({
      ...state,
      loading: false,
      selPenalTypeID: temPenalTypeID,
    })
    setShow(true)
  }

  // ========================Delete Department=====================
  function deleteDesignStageItem(temPenalTypeID: number) {
    deletePenaltyTypeDetails(temPenalTypeID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          toast.success('Deleted Successfully')
          getDesignStageData(state.searchText)
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
      const results = state.tmpDesignStageData.filter((user) => {
        return user.penaltyTypeName.toLowerCase().includes(keyword.toLowerCase())
      })
      setState({...state, designStageData: results, searchText: keyword})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, designStageData: state.tmpDesignStageData, searchText: keyword})
      setTotal(state.tmpDesignStageData.length)
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
  const currentPosts: PenaltyTypeModel[] = state.designStageData.slice(
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
          pathName={'/master/penalty-type/add'}
          title='Click to add a PMC Work Stage'
        />
        <div className='py-3'>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-bordered align-middle g-2'>
              {/* begin::Table head */}
              <thead className='bg-light-primary'>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-150px'>Penalty Name</th>
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
                      <PenaltyTypeCard
                        data={data}
                        handleShow={() => handleShow(data.penaltyTypeID)}
                        name={name}
                      />
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
        id={state.selPenalTypeID}
        pageName={'Penalty Type'}
        show={show}
        handleClose={handleClose}
        deleteData={() => deleteDesignStageItem(state.selPenalTypeID)}
      />
    </>
  )
}

export default PenaltyTypeList
