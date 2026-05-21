import React, {useEffect, useState} from 'react'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import {IExcelError} from '../../../models/otherDropDowns/IExcelError'
import {Pagination} from 'antd'

type Props = {}

interface ILedger {
  loading: boolean
  selectedFile: any
  excelError: IExcelError[]
  customerID: number
  mainSearch: string
  productCategoryID: number
  unitID: number
}

const CarpetryExcelAddProduct: React.FC<Props> = () => {
  const {customerid} = useParams<{customerid: string}>()
  const history = useHistory()
  const location = useLocation()
  const [show, setShow] = useState(false)

  const [state, setState] = useState<ILedger>({
    loading: false,
    selectedFile: '',
    excelError: [] as IExcelError[],
    customerID: 0,
    mainSearch: '',
    productCategoryID: 0,
    unitID: 0,
  })

  useEffect(() => {
    setState({...state, loading: true})
    setTimeout(() => {
      let lc: any = location.state
      let mainSearch: string = ''
      let productCategoryID: number = 0
      let unitID: number = 0
      if (lc.searchText != undefined) {
        mainSearch = lc.searchText
        productCategoryID = lc.mainProductCatgryID
        unitID = lc.mainUnitID
      }
      getState(mainSearch, productCategoryID, unitID)
    }, 100)
  }, [])

  function getState(mainSearch: string, productCategoryID: number, unitID: number) {
    setState({
      ...state,
      customerID: parseInt(customerid),
      loading: false,
      mainSearch,
      productCategoryID,
      unitID,
    })
  }

  const selectFile = (e: any) => {
    setState({...state, selectedFile: e.target.files[0]})
  }

  const handleSubmit = () => {
    // Create an object of formData
    const formData = new FormData()
    // Update the formData object
    formData.append('file', state.selectedFile, state.selectedFile.name)
    // Details of the uploaded file
    // console.log(state.selectedFile)

    fetch(process.env.REACT_APP_API_URL + '/CarpentryProduct/UploadCarpentryProductExcel', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.isSuccess === true) {
          toast.success(`${response.message}`)
          history.push({
            pathname: '/carpetry/product-master/list',
            state: {
              search: state.mainSearch,
              UnitID: state.unitID,
              ProductCategoryID: state.productCategoryID,
            },
          })
        } else {
          toast.success(`${response.message}`)
          setState({...state, excelError: response.data})
          setShow(true)
          setTotal(response.data.length)
        }
      })
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
              pathname: '/carpetry/product-master/list',
              state: {
                search: state.mainSearch,
                UnitID: state.unitID,
                ProductCategoryID: state.productCategoryID,
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
              <label className='col-lg-3 col-form-label fw-bold fs-6'>
                <span className='required'>Upload Excel File:</span>
              </label>
              <div className='col-lg-9 fv-row'>
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

export default CarpetryExcelAddProduct
