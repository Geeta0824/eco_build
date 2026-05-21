import {Pagination} from 'antd'
import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {KTSVG} from '../../../../../_Ecd/helpers'
import LoaderInTable from '../../../common-pages/LoaderInTable'
import BlankDataImageInTable from '../../../common-pages/BlankDataImageInTable'
import {getGetAreaPriceListByAreaIDAPI} from '../../../../modules/product-master-page/plan-area-master-page/AreaPriceCRUD'
import {AreaPriceModel} from '../../../../models/product-page/AreaPriceModel'
type Props = {}

interface IPlanArea {
  loading: boolean
  areaPriceData: AreaPriceModel[]
  tmpAreaPriceData: AreaPriceModel[]
  selAreaID: number
  selAreaName: string
  mainSearch: string
}

const AreaList: React.FC<Props> = () => {
  // const {planAreaId} = useParams<{planAreaId: string}>()
  const location = useLocation()
  const [state, setState] = useState<IPlanArea>({
    loading: false,
    areaPriceData: [] as AreaPriceModel[],
    tmpAreaPriceData: [] as AreaPriceModel[],
    selAreaID: 0,
    selAreaName: '',
    mainSearch: '',
  })


  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      var AreaName = lc.areaName
      var AreaID = lc.planAreaID
      console.log(lc)
      var mainSearch: string = ''
      if (lc.search) {
        mainSearch = lc.search
      }
      getAllPlanAreaData(AreaID, AreaName, mainSearch)
    }, 100)
  }, [])
  function getAllPlanAreaData(AreaID: number, AreaName: string, mainSearch: string) {
    getGetAreaPriceListByAreaIDAPI(AreaID)
      .then((response) => {
        if (response.data.isSuccess == true) {
          const responseData = response.data.responseObject
          if (mainSearch !== '') {
            const results = responseData.filter((user: any) => {
              return (
                user.projectType.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.areaName.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.carpetArea.toLowerCase().includes(mainSearch.toLowerCase()) ||
                user.bhkName.toLowerCase().includes(mainSearch.toLowerCase())
              )
            })

            setState({
              ...state,
              areaPriceData: results,
              tmpAreaPriceData: responseData,
              selAreaID: AreaID,
              selAreaName: AreaName,
              loading: false,
            })
            setTotal(results.length)
            setPage(1)
          } else {
            setState({
              ...state,
              areaPriceData: responseData,
              tmpAreaPriceData: responseData,
              selAreaID: AreaID,
              selAreaName: AreaName,
              loading: false,
            })
            setTotal(responseData.length)
            setPage(1)
          }
          setName(mainSearch)
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, areaPriceData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, areaPriceData: [], loading: false})
      })
  }

  const [name, setName] = useState('')
  const filter = (e: any) => {
    const keyword = e.target.value

    if (keyword !== '') {
      const results = state.tmpAreaPriceData.filter((user) => {
        return (
          user.projectType.toLowerCase().includes(keyword.toLowerCase()) ||
          user.areaName.toLowerCase().includes(keyword.toLowerCase()) ||
          user.carpetArea.toLowerCase().includes(keyword.toLowerCase()) ||
          user.bhkName.toLowerCase().includes(keyword.toLowerCase())
        )
      })
      setState({...state, areaPriceData: results})
      setTotal(results.length)
      setPage(1)
    } else {
      setState({...state, areaPriceData: state.tmpAreaPriceData})
      setTotal(state.tmpAreaPriceData.length)
      setPage(1)
    }
    setName(keyword)
  }

  // ================Pagination ================
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }
  const [total, setTotal] = useState(state.areaPriceData.length) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)
  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: AreaPriceModel[] = state.areaPriceData.slice(
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
              to={{
                pathname: `/p-product/plan-area/${state.selAreaID}/add`,
                state: {
                  planAreaID: state.selAreaID,
                  mainSerach: name,
                },
              }}
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
                  <th className='min-w-150px'>Project Type</th>
                  <th className='min-w-150px'>BHK</th>
                  <th className='min-w-150px '>Sqft</th>
                  <th className='min-w-150px'>Rate</th>
                  <th className='min-w-40px text-end  '>Edit </th>
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
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.projectType}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.bhkName}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.carpetArea}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex align-items-center'>
                            <div className='d-flex justify-content-start flex-column'>
                              <span className='text-dark text-hover-primary fs-6'>
                                {data.areaRate}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className='d-flex justify-content-end flex-shrink-0 '>
                            <Link
                              to={{
                                pathname: `/p-product/plan-area/${state.selAreaID}/edit`,
                                state: {
                                  areaRateID: data.areaRateID,
                                  AreaID: state.selAreaID,
                                  CarpetArea: data.carpetArea,
                                  BhkName: data.bhkName,
                                  ProjectTypeName: data.projectType,
                                  mainSerach: name,
                                },
                              }}
                              className='btn btn-icon btn-bg-light bg-hover-primary text-hover-inverse-primary btn-sm me-1'
                            >
                              <KTSVG
                                path='/media/icons/duotune/art/art005.svg'
                                className='svg-icon-3 svg-icon-primary'
                              />
                            </Link>
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
    </>
  )
}

export default AreaList
