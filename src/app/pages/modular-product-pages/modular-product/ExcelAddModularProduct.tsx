import React, {useEffect, useState} from 'react'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import axios from 'axios'
import {IExcelError} from '../../../models/otherDropDowns/IExcelError'
import {Pagination} from 'antd'
import {IModularTypeModel} from '../../../models/modular-product-page/modular-product-category/IModularProductCategoryModel'
import {getModularTypeListApi} from '../../../modules/modular-product-page/modular-product-category/ModularProductCategoryCRUD'
import {error} from 'console'

type Props = {}

interface ILedger {
  loading: boolean
  selectedFile: any
  excelError: IExcelError[]
  modularTypeData: IModularTypeModel[]
  customerID: number
  selModularTypeID: number
  mainProductCategoryID: number
  mainUnitID: number
  mainSearch: string
}

const ExcelAddModularProduct: React.FC<Props> = () => {
  const location = useLocation()
  const {customerid} = useParams<{customerid: string}>()
  const history = useHistory()
  const [show, setShow] = useState(false)

  const [state, setState] = useState<ILedger>({
    loading: false,
    selectedFile: '',
    excelError: [] as IExcelError[],
    modularTypeData: [] as IModularTypeModel[],
    customerID: 0,
    selModularTypeID: 0,
    mainProductCategoryID: 0,
    mainUnitID: 0,
    mainSearch: '',
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      console.log(lc)
      var mainProductCategoryID: number = 0
      var mainUnitID: number = 0
      var mainSearch: string = ''
      if (
        lc.mainProductCategoryID !== undefined ||
        lc.mainUnitID !== undefined ||
        lc.mainSearch !== undefined
      ) {
        mainProductCategoryID = lc.mainProductCategoryID
        mainUnitID = lc.mainUnitID
        mainSearch = lc.mainSearch
      }
      getModularTypeDatas(mainProductCategoryID, mainUnitID, mainSearch)
    }, 100)
  }, [])

  function getModularTypeDatas(
    mainProductCategoryID: number,
    mainUnitID: number,
    mainSearch: string
  ) {
    getModularTypeListApi()
      .then((response) => {
        if (response.data.isSuccess == true) {
          let responseData = response.data.responseObject
          setState({
            ...state,
            modularTypeData: responseData,
            customerID: parseInt(customerid),
            mainProductCategoryID,
            mainUnitID,
            mainSearch,
            loading: false,
          })
        } else {
          toast.error(`${response.data.message}`)
          setState({...state, modularTypeData: [], loading: false})
        }
      })
      .catch((error) => {
        toast.error(`${error}`)
        setState({...state, modularTypeData: [], loading: false})
      })
  }

  const selectChange = (event: any) => {
    const value = event.target.value
    const elementId = event.target.id
    if (elementId === 'modularTypeID') {
      setState({...state, selModularTypeID: parseInt(value)})
    }
  }

  const selectFile = (e: any) => {
    // console.log(e.target.files[0])
    setState({...state, selectedFile: e.target.files[0]})
  }

  const handleSubmit = () => {
    if (state.selModularTypeID > 0) {
      setState({...state, loading: true})
      // Create an object of formData
      const formData = new FormData()
      // Update the formData object
      formData.append('file', state.selectedFile, state.selectedFile.name)
      // Details of the uploaded file
      // // console.log(state.selectedFile)
      var URL = process.env.REACT_APP_API_URL

      if (state.selModularTypeID == 1) {
        fetch(`${URL}` + '/ModularProduct/UploadModularProductForKitchenExcel', {
          method: 'POST',
          body: formData,
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.isSuccess === true) {
              toast.success(`${response.message}`)
              history.push({
                pathname: '/module/products/list',
                state: {
                  ProductCategoryID: state.mainProductCategoryID,
                  unitID: state.mainUnitID,
                  search: state.mainSearch,
                },
              })
              setState({...state, loading: false})
            } else {
              toast.success(`${response.message}`)
              setState({...state, excelError: response.data, loading: false})
              setShow(true)
              setTotal(response.data.length)
              setPage(1)
            }
          })
          .catch((error) => {
            toast.error(`${error}`)
            setState({...state, loading: false})
          })
      } else if (state.selModularTypeID == 2) {
        fetch(`${URL}` + '/ModularProduct/UploadModularProductForWardrobeExcel', {
          method: 'POST',
          body: formData,
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.isSuccess === true) {
              toast.success(`${response.message}`)
              history.push({
                pathname: '/module/products/list',
                state: {
                  ProductCategoryID: state.mainProductCategoryID,
                  unitID: state.mainUnitID,
                  search: state.mainSearch,
                },
              })
              setState({...state, loading: false})
            } else {
              toast.success(`${response.message}`)
              setState({...state, excelError: response.data, loading: false})
              setShow(true)
              setTotal(response.data.length)
              setPage(1)
            }
          })
          .catch((error) => {
            toast.error(`${error}`)
            setState({...state, loading: false})
          })
      } else if (state.selModularTypeID == 3) {
        fetch(`${URL}` + '/ModularProduct/UploadModularProductForStorageSolutionsExcel', {
          method: 'POST',
          body: formData,
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.isSuccess === true) {
              toast.success(`${response.message}`)
              history.push({
                pathname: '/module/products/list',
                state: {
                  ProductCategoryID: state.mainProductCategoryID,
                  unitID: state.mainUnitID,
                  search: state.mainSearch,
                },
              })
              setState({...state, loading: false})
            } else {
              toast.success(`${response.message}`)
              setState({...state, excelError: response.data, loading: false})
              setShow(true)
              setTotal(response.data.length)
              setPage(1)
            }
          })
          .catch((error) => {
            toast.error(`${error}`)
            setState({...state, loading: false})
          })
      } else {
        toast.error('Please Select Modular Type')
        setState({...state, loading: false})
      }
    } else {
      toast.error('Please Select Modular Type')
      return
    }
  }

  // ============*****---------------- Pagination ----------------*****=============
  const [total, setTotal] = useState(0) //  length
  const [page, setPage] = useState(1)
  const [postPerPage, setPostPerPage] = useState(10)

  const indexOfLastPage = page * postPerPage
  const indexOfFirstPage = indexOfLastPage - postPerPage
  const currentPosts: IExcelError[] = state.excelError.slice(indexOfFirstPage, indexOfLastPage)
  const onShowSizeChange = (current: any, pageSize: any) => {
    setPostPerPage(pageSize)
  }

  return (
    <>
      <div className='text-end '>
        <span
          className='btn btn-sm btn-light-primary bg-success text-white fs-5 mb-2 btn btn-rounded'
          onClick={() => {
            history.push({
              pathname: '/module/products/list',
              state: {
                ProductCategoryID: state.mainProductCategoryID,
                unitID: state.mainUnitID,
                search: state.mainSearch,
              },
            })
          }}
        >
          Back To List
        </span>
      </div>

      <div className='card mb-5 mb-xl-10'>
        <div className={show === true ? 'card-body py-3' : 'd-none'}>
          <div className='card-header border-0 py-2'>
            <h2 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bolder mb-1'>Error Message</span>
              {/*<span className='text-muted mt-1 fw-bold fs-7'>Over 500 Cities</span> */}
            </h2>
          </div>
          {/* begin::Table container */}
          <div className='table-responsive'>
            {/* begin::Table */}
            <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-2'>
              {/* begin::Table head */}
              <thead>
                <tr className='fw-bolder fs-5'>
                  <th className='min-w-100px'>line ID</th>
                  <th className='min-w-100px'>Line Number</th>
                  <th className='min-w-150px'>Error Message</th>
                </tr>
              </thead>
              {/* end::Table head */}
              {/* begin::Table body */}
              <tbody className="border-bottom">
                {currentPosts.length > 0 &&
                  currentPosts.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <span className='text-dark text-hover-primary d-block fs-6'>
                            {data.lineID}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block fs-6'>
                            {data.lineNumber}
                          </span>
                        </td>
                        <td>
                          <span className='text-dark text-hover-primary d-block fs-6'>
                            {data.errorMsg}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
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
        <div className={show === false ? 'collapse show' : 'd-none'}>
          {/* <form onSubmit={handleSubmit} noValidate className='form'> */}
          <div className='card-body border-top p-9 ms-6'>
            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label required fw-bold fs-6'>Modular Type:</label>

              <div className='col-lg-4 fv-row'>
                <select
                  className='form-select bg-light-primary'
                  aria-label='Default select example'
                  onChange={selectChange}
                  id='modularTypeID'
                >
                  <option selected={0 === state.selModularTypeID ? true : false} value={0}>
                    Select Modular type
                  </option>
                  {state.modularTypeData.length > 0 &&
                    state.modularTypeData.map((data, index) => {
                      return (
                        <option
                          key={index}
                          value={data.modularTypeID}
                          selected={data.modularTypeID === state.selModularTypeID ? true : false}
                        >
                          {data.modularTypeName}
                        </option>
                      )
                    })}
                </select>
              </div>
            </div>
            <div className='row mb-6'>
              <label className='col-lg-2 col-form-label fw-bold fs-6'>
                <span className='required'>Upload Excel File:</span>
              </label>
              <div className='col-lg-10 fv-row'>
                <input
                  type='file'
                  accept='.xls,.xlsx'
                  className='form-control form-control-lg form-control-solid bg-light-primary'
                  onChange={(e) => selectFile(e)}
                />
              </div>
            </div>
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button className='btn btn-primary' disabled={state.loading} onClick={handleSubmit}>
              {!state.loading && 'Submit'}
              {state.loading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
          {/* </form> */}
        </div>
      </div>
    </>
  )
}

export default ExcelAddModularProduct
