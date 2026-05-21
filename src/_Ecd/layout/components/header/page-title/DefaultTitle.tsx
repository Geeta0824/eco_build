import clsx from 'clsx'
import React, {FC} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'
import {KTSVG} from '../../../../helpers'
import {useLayout} from '../../../core/LayoutProvider'
import {usePageData} from '../../../core/PageData'
import {useLocation} from 'react-router'

const DefaultTitle: FC = () => {
  const {pageTitle, pageDescription, pageBreadcrumbs} = usePageData()
  const {config, classes} = useLayout()
  const location = useLocation()
  const {quotationID} = useParams<{quotationID: string}>()

  const history = useHistory()
  // alert(quotationID)
  function goBackPage() {
    history.goBack()
  }

  // /carpetry/carpetry-quotation/pdf/10084
  // /customization-quotations/pdf/20014
  // /quotations/diy-quotation/pdf/20061
  return (
    <div
      id='kt_page_title'
      data-kt-swapper='true'
      data-kt-swapper-mode='prepend'
      data-kt-swapper-parent="{default: '#kt_content_container', 'lg': '#kt_toolbar_container'}"
      className={clsx('page-title d-flex', classes.pageTitle.join(' '))}
    >
      {/* <div
        onClick={goBackPage}
        className={
          // location.pathname == `/carpetry/carpetry-quotation/pdf/${quotationID}` ||
          // location.pathname == `/customization-quotations/pdf/${quotationID}` ||
          location.pathname == `/quotations/diy-quotation/pdf`
            ? 'd-none'
            : 'cursor-pointer'  
        }
      >
        <KTSVG
          path='/media/icons/duotune/arrows/arr002.svg'
          className='svg-icon-2 svg-icon-lg-1 svg-icon-gray-500 translate-middle-y ms-2'
        />
        &nbsp;
      </div> */}

      {/* begin::Title */}
      {pageTitle && (
        <h1 className='d-flex align-items-center text-primary fw-bolder my-1 fs-3'>
          {pageTitle}
          {pageDescription && config.pageTitle && config.pageTitle.description && (
            <>
              <span className='h-20px border-gray-200 border-start ms-3 mx-2'></span>
              <small className='text-primary fs-7 fw-bold my-1 ms-1'>{pageDescription}</small>
            </>
          )}
        </h1>
      )}
      {/* end::Title */}

      {pageBreadcrumbs &&
        pageBreadcrumbs.length > 0 &&
        config.pageTitle &&
        config.pageTitle.breadCrumbs && (
          <>
            {config.pageTitle.direction === 'row' && (
              <span className='h-20px border-gray-200 border-start mx-4'></span>
            )}
            <ul className='breadcrumb breadcrumb-separatorless fw-bold fs-7 my-1'>
              {Array.from(pageBreadcrumbs).map((item, index) => (
                <li
                  className={clsx('breadcrumb-item', {
                    'text-dark': !item.isSeparator && item.isActive,
                    'text-muted': !item.isSeparator && !item.isActive,
                  })}
                  key={`${item.path}${index}`}
                >
                  {!item.isSeparator ? (
                    <Link className='text-muted text-hover-primary' to={item.path}>
                      {item.title}
                    </Link>
                  ) : (
                    <span className='bullet bg-gray-200 w-5px h-2px'></span>
                  )}
                </li>
              ))}
              <li className='breadcrumb-item text-dark'>{pageTitle}</li>
            </ul>
          </>
        )}
    </div>
  )
}

export {DefaultTitle}
