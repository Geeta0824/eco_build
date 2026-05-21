import React, {useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap-v5'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {Pagination} from 'antd'
import {SupportModel} from '../../models/Support-page/SupportModel'
import {ICountryModel} from '../../models/master-page/ICountryModel'
import {SupportCard} from './SupportCard'
import LoaderInTable from '../common-pages/LoaderInTable'
import {getAllCountry} from '../../modules/master-page/country-master-page/CountryCRUD'
import Header_Search_Add from '../../../components/table-header/Header_Search_Add'
import {GetProjectTaskFilterList, HRMS_API_URL} from '../../modules/support/SupportCRUD'
import BlankDataImageInTable from '../common-pages/BlankDataImageInTable'
import {toAbsoluteUrl} from '../../../_Ecd/helpers'

interface Isupport {
  loading: boolean
  countryData: SupportModel[]
  tmpCountryData: SupportModel[]
  imageShow: string
  SearchText: string
  selCountryId: number
  activeID: number
  activeType: any
  pathUrl: any
  ProjectID: number
  ProjectTypeID: number
}

type Props = {}

const SupportList: React.FC<Props> = () => {
  const location = useLocation()
  const [state, setState] = useState<Isupport>({
    loading: false,
    countryData: [] as SupportModel[],
    tmpCountryData: [] as SupportModel[],
    imageShow: '',
    SearchText: '',
    selCountryId: 0,
    activeID: 0,
    activeType: false,
    pathUrl: process.env.REACT_APP_API_URL,
    ProjectID: 10010, // montdor project in hrms
    ProjectTypeID: 2, // Support(Outer) project type in hrms
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainSearch: string = ''
      if (lc != undefined) {
        mainSearch = lc.mainSearch
      }
      getCountryData(state.ProjectID, state.ProjectTypeID, mainSearch)
    }, 100)
  }, [])

  // ==================== Get Country API Call===================

  function getCountryData(ProjectID: number, ProjectTypeID: number, mainSearch: string) {
    // alert("APi")
    GetProjectTaskFilterList(ProjectID, ProjectTypeID)
      .then((response) => {
        let responseData = response.data.responseObject
        if (response.data.isSuccess === true) {
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.projectName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.taskName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.description.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.priorityName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.documentPath.toLowerCase().includes(mainSearch.toLowerCase())
              )
              // Use the toLowerCase() method to make it case-insensitive
            })
            setState({
              ...state,
              countryData: results,
              tmpCountryData: responseData,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              countryData: responseData,
              tmpCountryData: responseData,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, countryData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, countryData: [], loading: false})
      })
  }

  // ====================Country Flag============
  const [showFlag, setShowFlag] = useState(false)
  const handleCloseFlag = () => {
    setState({...state, imageShow: '', loading: false})
    setShowFlag(false)
  }
  const handleShowFlag = (selImg: string) => {
    setState({...state, imageShow: HRMS_API_URL + selImg, loading: false})
    setShowFlag(true)
  }

  // ============== Search Function =======================

  //------------------- the value of the search field----------------
  const [name, setName] = useState('')

  //------------------- the search result-----------------
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpCountryData.filter((user) => {
        return (
          user.projectName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.taskName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.description.toLowerCase().includes(keyword.toLowerCase()) ||
          user.priorityName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.documentPath.toLowerCase().includes(keyword.toLowerCase())
        )
        // Use the toLowerCase() method to make it case-insensitive
      })
      setState({...state, countryData: results, loading: false})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, countryData: state.tmpCountryData, loading: false})
      // If the text field is empty, show all users
      setTotal(state.tmpCountryData.length)
      setPage(1)
    }

    setName(keyword)
  }

  // ----------------------pagination---------------------------------------------
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: SupportModel[] = state.countryData.slice(indexOfFirstPage, indexOfLastPage)

  return (
    <>
      <div className={`card `}>
        {/* begin::Header */}
        <Header_Search_Add
          searchText={name}
          filter={(e) => filter(e)}
          pathName={'/support/add'}
          title='Click to add a Support'
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
                  <th className='min-w-50px'>Doc</th>
                  <th className='min-w-150px'>Title</th>
                  <th className='min-w-140px'>Description</th>
                  <th className='min-w-40px'>Priority</th>
                  {/* <th className='min-w-40px'>Documents</th> */}
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {/* =================== Api Data Blank ============== */}
                {state.loading ? (
                  <LoaderInTable loading={state.loading} column={15} />
                ) : (
                  <>
                    {currentPosts.length > 0 &&
                      currentPosts.map((data, index) => {
                        return (
                          <SupportCard
                            data={data}
                            handleShowFlag={() => handleShowFlag(data.documentPath)}
                          />
                        )
                      })}
                    {/* =================== Loading get Api Data ============== */}
                    <BlankDataImageInTable
                      length={currentPosts.length}
                      loading={state.loading}
                      colSpan={5}
                    />
                  </>
                )}
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

      {/* =====================Image Model=================== */}
      <Modal
        size='lg'
        show={showFlag}
        onHide={handleCloseFlag}
        backdrop='true'
        keyboard={false}
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Country Flag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='mb-5'>
            <img alt='Pic' className='img-fluid' src={toAbsoluteUrl(`${state.imageShow}`)} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={handleCloseFlag}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default SupportList
