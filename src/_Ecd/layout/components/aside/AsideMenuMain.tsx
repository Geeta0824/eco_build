import {useIntl} from 'react-intl'
import {KTSVG} from '../../../helpers'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'
import {shallowEqual, useSelector} from 'react-redux'
import {UserModel} from '../../../../app/modules/auth/models/UserModel'
import {RootState} from '../../../../setup'

export function AsideMenuMain() {
  const intl = useIntl()
  const user: UserModel = useSelector<RootState>(({auth}) => auth.user, shallowEqual) as UserModel
  return (
    <>
      <AsideMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to='/business'
        icon='/media/icons/duotune/general/gen019.svg'
        title='Business'
        dislpay={user.roleID === 2 ? '' : 'd-none'}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to='/service'
        icon='/media/icons/duotune/general/gen010.svg'
        title='Service'
        dislpay={user.roleID === 2 ? '' : 'd-none'}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to='/project'
        icon='/media/icons/duotune/general/gen013.svg'
        title='Project'
        dislpay={user.roleID === 2 ? '' : 'd-none'}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to='/career'
        icon='/media/icons/duotune/general/gen016.svg'
        title='Career'
        dislpay={user.roleID === 2 ? '' : 'd-none'}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to='/inquiry'
        icon='/media/icons/duotune/general/gen012.svg'
        title='Inquiry'
        dislpay={user.roleID === 2 ? '' : 'd-none'}
        fontIcon='bi-app-indicator'
      />
      {/* <AsideMenuItem
        to='/meeting'
        icon='/media/icons/duotune/art/art004.svg'
        title='Meeting'
        // dislpay={user.roleID === 2 || user.roleID === 4 ? '' : 'd-none'}
        fontIcon='bi-app-indicator'
      /> */}
      {/* ----------------------Quotation Master-------------------------------------------------- */}

      {user.roleID === 2 ? (
        <>
          {/* <AsideMenuItem
            to='/master/quotation-mst/list'
            icon='/media/icons/duotune/general/gen010.svg'
            title='Quotation Master'
            fontIcon='bi-layers'
            dislpay={user.roleID === 2 ? '' : 'd-none'}
          /> */}
          {/* <AsideMenuItem
            to='/master/project-type-mst/list'
            icon='/media/icons/duotune/general/gen010.svg'
            title='Project Type Master'
            fontIcon='bi-layers'
            dislpay={user.roleID === 2 ? '' : 'd-none'}
          /> */}
        </>
      ) : null}

      {/* <AsideMenuItemWithSub
        to='/crafted/widgets'
        title='Widgets'
        icon='/media/icons/duotune/general/gen025.svg'
        fontIcon='bi-layers'
      >
        <AsideMenuItem to='/crafted/widgets/lists' title='Lists' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/charts' title='Charts' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/mixed' title='Mixed' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/tables' title='Tables' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} />
      </AsideMenuItemWithSub> */}
      {/* --------------------------------- Organization -------------------------------------- */}

      <AsideMenuItemWithSub
        to='/organization'
        title='Organization'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen025.svg'
        dislpay={user.roleID === 2 || user.roleID === 3 || user.roleID === 4 ? '' : 'd-none'}
      >
        <AsideMenuItem
          to='/organization/cashaccount'
          dislpay={
            (user.roleID === 2 && user.departmentID === 5) ||
            (user.roleID === 3 && user.departmentID === 5)
              ? ''
              : 'd-none'
          }
          title='Cash Account'
          hasBullet={true}
        />

        <AsideMenuItem
          to='/organization/customer'
          dislpay={
            user.roleID === 2 || user.roleID === 4 || (user.roleID === 3 && user.departmentID === 5)
              ? ''
              : 'd-none'
          }
          title='Customer'
          hasBullet={true}
        />
        {/* {user.roleID === 2 ? (
          <AsideMenuItem
            to='/organization/company-info'
            dislpay={user.roleID === 2 ? '' : 'd-none'}
            title='Company Info'
            hasBullet={true}
          />
        ) : null} */}
        {user.roleID === 2 ? (
          <>
            <AsideMenuItem
              to='/organization/employee'
              dislpay={user.roleID === 2 ? '' : 'd-none'}
              title='Employee'
              hasBullet={true}
            />
            <AsideMenuItem
              to='/organization/user'
              dislpay={user.roleID === 2 ? '' : 'd-none'}
              title='User'
              hasBullet={true}
            />
          </>
        ) : null}
        {/* <AsideMenuItem
          to='/organization/bank'
          dislpay={
            (user.roleID === 2 && user.departmentID === 5) ||
            (user.roleID === 3 && user.departmentID === 5)
              ? ''
              : 'd-none'
          }
          title='Organization Bank'
          hasBullet={true}
        /> */}
      </AsideMenuItemWithSub>

      {/* --------------------------------- Module Product -------------------------------------- */}
      {user.roleID === 2 ? (
        <>
          {/* eMenuItemWithSub> */}
          {/* --------------------------------- Module Product -------------------------------------- */}

          {/* <AsideMenuItemWithSub
            to='/module'
            title='Modular Product'
            fontIcon='bi-archive'
            icon='/media/icons/duotune/general/gen026.svg'
            dislpay={user.roleID === 2 ? '' : 'd-none'}
          >
            <AsideMenuItem
              to='/module/product-category'
              title='Modular Product Category'
              hasBullet={true}
            />
            <AsideMenuItem to='/module/products' title='Modular Product' hasBullet={true} />
          </AsideMenuItemWithSub>

          <AsideMenuItemWithSub
            to='/readymade-pkg'
            title=' ReadyMade Package'
            fontIcon='bi-archive'
            icon='/media/icons/duotune/general/gen017.svg'
            dislpay={user.roleID === 2 ? '' : 'd-none'}
          >
            <AsideMenuItem
              to='/readymade-pkg/new-readymade-pkg'
              title='New ReadyMade Package'
              hasBullet={true}
            />
          </AsideMenuItemWithSub> */}
          {/* ------------------------------------- */}
          {/* --------------------------------- Product -------------------------------------- */}

          {/* <AsideMenuItemWithSub
            to='/p-product'
            title='Product'
            fontIcon='bi-archive'
            icon='/media/icons/duotune/general/gen025.svg'
            dislpay={user.roleID === 2 ? '' : 'd-none'}
          > */}
          {/* <AsideMenuItem to='/p-product/agency-type' title='Agency Type' hasBullet={true} /> */}
          {/* <AsideMenuItem to='/p-product/plan-area' title='Product Area' hasBullet={true} /> */}
          {/* <AsideMenuItem to='/p-product/products' title='Product Master' hasBullet={true} />
            <AsideMenuItem
              to='/p-product/product-category'
              title='Product Category'
              hasBullet={true}
            /> */}
          {/* <AsideMenuItem to='/p-product/upgrade-item' title='UpGrade Item' hasBullet={true} /> */}
          {/* </AsideMenuItemWithSub> */}

          {/* -----------------------------customer complain-------------------------------------------------- */}

          {/* <AsideMenuItem
            to='/cust-complaint'
            icon='/media/icons/duotune/general/gen019.svg'
            title='Customer Complaint'
            fontIcon='bi-layers'
            dislpay={user.roleID === 2 ? '' : 'd-none'}
          /> */}

          {/* ---------------------- DNC Quotation  -------------------------------------------------- */}
          {/* <AsideMenuItemWithSub
            to='/dnc-quotation'
            title='DNC Quotation'
            fontIcon='bi-archive'
            icon='/media/icons/duotune/general/gen022.svg'
            dislpay={user.roleID === 2 ? '' : 'd-none'}
          >
            <AsideMenuItem
              to='/dnc-quotation/design-and-consultancy'
              title='Design And Consultancy'
              hasBullet={true}
            />
            <AsideMenuItem
              to='/dnc-quotation/3d-design-onliy'
              title='Design Only - 3D'
              hasBullet={true}
            />
            <AsideMenuItem
              to='/dnc-quotation/civil-and-architect'
              title='Civil And Architect And D&C'
              hasBullet={true}
            />
            <AsideMenuItem
              to='/dnc-quotation/civil-with-design-and-consultancy'
              title='Civil With Design And Consultancy'
              hasBullet={true}
            />
          </AsideMenuItemWithSub> */}

          {/* ----------------------Remarks-------------------------------------------------- */}
          {/* <AsideMenuItemWithSub
            to='/remarks'
            title='Remarks'
            fontIcon='bi-archive'
            icon='/media/icons/duotune/general/gen023.svg'
            dislpay={user.roleID === 2 ? '' : 'd-none'}
          >
            {' '}
            <AsideMenuItem to='/remarks/carpetry-rmk' title='Carpentry Remarks' hasBullet={true} />
            <AsideMenuItem to='/remarks/dnc-rmk' title='DNC Remarks' hasBullet={true} />
            <AsideMenuItem to='/remarks/modular-rmk' title='Modular Remarks' hasBullet={true} />
            <AsideMenuItem to='/remarks/agency-rmk' title='Agency Remarks' hasBullet={true} />
          </AsideMenuItemWithSub> */}
          {/* --------------------------------- Standard Quotation -------------------------------------- */}

          {/* <AsideMenuItem
            to='/standard-quotation'
            icon='/media/icons/duotune/general/gen019.svg'
            title='Standard Quotation PDF'
            fontIcon='bi-layers'
            dislpay={user.roleID === 2 ? '' : 'd-none'}
          /> */}

          {/* --------------------------------- Discount Request -------------------------------------- */}

          {/* <AsideMenuItemWithSub
            to='/discount-req'
            title='Discount Request'
            fontIcon='bi-archive'
            icon='/media/icons/duotune/general/gen025.svg'
            dislpay={user.roleID === 2 ? '' : 'd-none'}
          >
            <AsideMenuItem
              to='/discount-req/diy-req'
              title='DIY Discount Request'
              hasBullet={true}
            />
            <AsideMenuItem
              to='/discount-req/customization-req'
              title='Customization Discount Request'
              hasBullet={true}
            />
            <AsideMenuItem
              to='/discount-req/carpetry-cust-req'
              title='Carpentry Discount Request'
              hasBullet={true}
            />
            <AsideMenuItem
              to='/discount-req/modular-dis-req'
              title='Modular Discount Request'
              hasBullet={true}
            />
            <AsideMenuItem
              to='/discount-req/design-consultancy-dis-req'
              title='Design And Consultancy Discount Request'
              hasBullet={true}
            />
            <AsideMenuItem
              to='/discount-req/3d-design-onliy-dis-req'
              title='Design Only - 3D Discount Request'
              hasBullet={true}
            />
            <AsideMenuItem
              to='/discount-req/civil-and-architect-dis-req'
              title='Civil And Architect And D&C Discount Request'
              hasBullet={true}
            />
            <AsideMenuItem
              to='/discount-req/civil-design-consultancy-dis-req'
              title='Civil With Design And Consultancy Discount Request'
              hasBullet={true}
            />
          </AsideMenuItemWithSub> */}

          {/* --------------------------------- Package -------------------------------------- */}

          {/* <AsideMenuItem
            to='/package'
            icon='/media/icons/duotune/general/gen019.svg'
            title='Package Master'
            fontIcon='bi-layers'
            dislpay={user.roleID === 2 ? '' : 'd-none'}
          /> */}
        </>
      ) : null}
      {/* --------------------------------- Quotation -------------------------------------- */}

      {/* <AsideMenuItemWithSub
        to='/quotations'
        title='Carpentry Quotation'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen025.svg'
        dislpay={user.roleID === 2 || user.designationID === 1007 ? '' : 'd-none'}
      > */}
      {/* <AsideMenuItem
                  to='/quotations/standards-quotations'
                  title='Standard Quotation'
                  hasBullet={true}
                />
                <AsideMenuItem
                  to='/quotations/premium-quotation'
                  title='Premium Quotation'
                  hasBullet={true}
                />
                <AsideMenuItem
                  to={`/quotations/essential-quotation`}
                  title='Essential Quotation'
                  hasBullet={true}
                /> */}
      {/* <AsideMenuItem to={`/quotations/diy-quotation`} title='DIY Quotation' hasBullet={true} /> */}
      {/* <AsideMenuItem */}
      {/* // dislpay={user.roleID === 2 || user.roleID === 4 ? '' : 'd-none'} */}
      {/* to='/quotations/ready-made-quotation' */}
      {/* title='Ready Made Quotation' */}
      {/* hasBullet={true} */}
      {/* /> */}
      {/* </AsideMenuItemWithSub> */}

      {/* ----------------------------------------- Modular Quotation-------------- */}
      {/* <AsideMenuItemWithSub
        to='/modular'
        title='Modular Quotation'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen026.svg'
        dislpay={user.roleID === 2 || user.designationID === 1007 ? '' : 'd-none'}
      >
        <AsideMenuItem
          to={`/modular/modular-quotation`}
          title='Modular Quotation'
          hasBullet={true}
        />
      </AsideMenuItemWithSub> */}

      {/* ----------------------------- Customization Quotation ---------------------------------- */}

      {user.roleID === 2 ? (
        <>
          {/* <AsideMenuItem
            to='/customization-quotations'
            title='Customization Quotation'
            icon='/media/icons/duotune/general/gen019.svg'
            fontIcon='bi-layers'
            dislpay={user.roleID === 2 ? '' : 'd-none'}
          /> */}
        </>
      ) : null}
      {/* ============================project =============================== */}
      {/* <AsideMenuItemWithSub
        to='/projects'
        title='Projects'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen025.svg'
        dislpay={
          user.roleID === 2 || user.roleID === 3 || user.roleID === 5 || user.roleID === 6
            ? ''
            : 'd-none'
        }
      >
        <AsideMenuItem
          to='/projects/project'
          title='Project'
          hasBullet={true}
          dislpay={
            user.roleID === 2 || user.roleID === 3 || user.roleID === 5 || user.roleID === 6
              ? ''
              : 'd-none'
          }
        />
        {user.roleID === 2 ? (
          <AsideMenuItem
            to='/projects/stage-change-req'
            title='Ready Made Project Stage Change Request'
            hasBullet={true}
            dislpay={user.roleID === 2 ? '' : 'd-none'}
          />
        ) : null}
        {user.roleID === 2 ? (
          <AsideMenuItem
            to='/projects/diy-stage-change-req'
            title='DIY Project Stage Change Request'
            hasBullet={true}
            dislpay={user.roleID === 2 ? '' : 'd-none'}
          />
        ) : null}
        {user.roleID === 2 ? (
          <AsideMenuItem
            to='/projects/modular-stage-change-req'
            title='Modular Project Stage Change Request'
            hasBullet={true}
            dislpay={user.roleID === 2 ? '' : 'd-none'}
          />
        ) : null}
        {user.roleID === 2 || (user.roleID === 6 && user.designationID === 1007) ? (
          <AsideMenuItem
            to='/projects/designer-stage-change-req'
            title='Designer Project Stage Change Request'
            hasBullet={true}
            dislpay={user.roleID === 2 || user.roleID === 6 ? '' : 'd-none'}
          />
        ) : null}
        <AsideMenuItem
          to='/projects/work-order-request'
          title='Work Order Request'
          hasBullet={true}
          dislpay={user.roleID === 2 || user.roleID === 5 ? '' : 'd-none'}
        />
      </AsideMenuItemWithSub> */}

      {/* ============================Accounts =============================== */}

      {/* <AsideMenuItemWithSub
        to='/accounts'
        title='Accounts'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen025.svg'
        dislpay={
          (user.roleID === 2 && user.departmentID === 5) ||
          (user.roleID === 3 && user.departmentID === 5)
            ? ''
            : 'd-none'
        }
      >
        <AsideMenuItem to='/accounts/accounttransfer' title='Account Transfer' hasBullet={true} />
        <AsideMenuItem to='/accounts/debit-note' title='Debit Note' hasBullet={true} />
        <AsideMenuItem to='/accounts/expense-head' title='Expense Head' hasBullet={true} />
        <AsideMenuItem to='/accounts/gst' title='GST Pay' hasBullet={true} />
        <AsideMenuItem to='/accounts/expenseType' title='Office Expense Type' hasBullet={true} />
        <AsideMenuItem to='/accounts/expenseMasters' title='Office Expense' hasBullet={true} />
        <AsideMenuItem
          to='/accounts/other-fund-receive'
          title='Other Fund Receive'
          hasBullet={true}
        />
        <AsideMenuItem to='/accounts/fundreceive' title='Project Fund Receive' hasBullet={true} />
        <AsideMenuItem to='/accounts/pay-for-project' title='Pay For Project' hasBullet={true} />
        <AsideMenuItem to='/accounts/purchase' title='Purchase' hasBullet={true} />
        <AsideMenuItem to='/accounts/pay-for-purchase' title='Pay For Purchase' hasBullet={true} />
        <AsideMenuItem to='/accounts/project-expense' title='Project Expense' hasBullet={true} />
        <AsideMenuItem to='/accounts/tds' title='TDS Pay' hasBullet={true} />
      </AsideMenuItemWithSub> */}

      {/* ============================Accounts Reports=============================== */}
      {/* <AsideMenuItemWithSub
        to='/account-reports'
        title='Accounts Reports'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen011.svg'
        dislpay={
          user.roleID === 2 || (user.roleID === 3 && user.departmentID === 5) ? '' : 'd-none'
        }
      >
        <AsideMenuItem
          to='/account-reports/account-dashboard'
          title='Account Dashboard'
          hasBullet={true}
        />
        <AsideMenuItem to='/account-reports/cash' title='Cash Account Report' hasBullet={true} />
        <AsideMenuItem
          to='/account-reports/company-profit-loss'
          title='Company Profit | Loss'
          hasBullet={true}
        />
        <AsideMenuItem to='/account-reports/expense' title='Expense Type Report' hasBullet={true} />
        <AsideMenuItem to='/account-reports/ledger' title='Ledger Report' hasBullet={true} />
        <AsideMenuItem
          to='/account-reports/other-vendor'
          title='Other Vendor Report'
          hasBullet={true}
        />
        <AsideMenuItem
          to='/account-reports/project-report'
          title='Project Report'
          hasBullet={true}
        />
        <AsideMenuItem
          to='/account-reports/project'
          title='Project Detail Report'
          hasBullet={true}
        />
        <AsideMenuItem
          to='/account-reports/project-profit-loss'
          title='Project Profit | Loss'
          hasBullet={true}
        />
        <AsideMenuItem to='/account-reports/vendor' title='PMC Vendor Report' hasBullet={true} />
        <AsideMenuItem to='/account-reports/purchase' title='Purchase Report' hasBullet={true} />
        <AsideMenuItem
          to='/account-reports/sundry-creditor'
          title='Sundry Creditors Report'
          hasBullet={true}
        />
        <AsideMenuItem
          to='/account-reports/sundry-debtor'
          title='Sundry Debtors Report'
          hasBullet={true}
        /> */}
      {/* <AsideMenuItem
          to='/account-reports/purchase-ledger'
          title='Purchase Ledger'
          hasBullet={true}
        /> */}
      {/* <AsideMenuItem to='/account-reports/balance' title='Balance Report' hasBullet={true} /> */}
      {/* </AsideMenuItemWithSub> */}
      {/* ============================Carpetrt=============================== */}
      {user.roleID === 2 ? (
        <>
          {/* <AsideMenuItemWithSub
            to='/carpetry'
            title='Carpentry'
            fontIcon='bi-archive'
            icon='/media/icons/duotune/general/gen025.svg'
            dislpay={user.roleID === 2 ? '' : 'd-none'}
          >
            <AsideMenuItem
              dislpay={user.roleID === 2 ? '' : 'd-none'}
              to='/carpetry/addon-master'
              title='Addon Master'
              hasBullet={true}
            />
            <AsideMenuItem
              dislpay={user.roleID === 2 ? '' : 'd-none'}
              to='/carpetry/discount'
              title='Carpentry Discount'
              hasBullet={true}
            />
            <AsideMenuItem
              dislpay={user.roleID === 2 ? '' : 'd-none'}
              to='/carpetry/carpetry-pkg-mst'
              title='Carpetry Package Master'
              hasBullet={true}
            />
            <AsideMenuItem
              dislpay={user.roleID === 2 ? '' : 'd-none'}
              to='/carpetry/product-master'
              title='Product Master'
              hasBullet={true}
            />
            <AsideMenuItem
              dislpay={user.roleID === 2 ? '' : 'd-none'}
              to='/carpetry/quotation-min-amt'
              title='Quotation Min Amount'
              hasBullet={true}
            /> */}
          {/* <AsideMenuItem
          dislpay={user.roleID === 2 || user.roleID === 4 ? '' : 'd-none'}
          to='/carpetry/carpetry-quotation'
          title='Carpentry Quotation'
          hasBullet={true}
        /> */}
          {/* </AsideMenuItemWithSub> */}

          {/* <AsideMenuItem
            to='/kitchen-layout'
            icon='/media/icons/duotune/general/gen017.svg'
            title='Kitchen Layout'
            fontIcon='bi-layers'
            dislpay={user.roleID === 2 ? '' : 'd-none'}
          /> */}
          {/* =====================================Work History========================================== */}
          {/* <AsideMenuItemWithSub
            to='/reports'
            title='Reports'
            fontIcon='bi-archive'
            icon='/media/icons/duotune/general/gen022.svg'
            dislpay={user.roleID === 2 || user.designationID === 1009 ? '' : 'd-none'}
          >
            <AsideMenuItem
              to='/reports/project-material'
              title='Project Material'
              hasBullet={true}
              dislpay={user.roleID === 2 || user.designationID === 1009 ? '' : 'd-none'}
            />
            <AsideMenuItem
              to='/reports/project-deadline'
              title='Project Deadline'
              hasBullet={true}
              dislpay={user.roleID === 2 || user.designationID === 1009 ? '' : 'd-none'}
            />
            <AsideMenuItem
              to='/reports/project-missed-deadline'
              title='Project Missed Deadline'
              hasBullet={true}
              dislpay={user.roleID === 2 || user.roleID === 6 ? '' : 'd-none'}
            />
            <AsideMenuItem
              to='/reports/employee-penalty'
              title='Employee Penalty Report'
              hasBullet={true}
              dislpay={user.roleID === 2 || user.roleID === 6 ? '' : 'd-none'}
            />
            <AsideMenuItem
              to='/reports/vendor-penalty'
              title='Vendor Penalty Report'
              hasBullet={true}
              dislpay={user.roleID === 2 || user.roleID === 6 ? '' : 'd-none'}
            />
            <AsideMenuItem
              to='/reports/work-history'
              title='Work History'
              hasBullet={true}
              dislpay={user.roleID === 2 || user.roleID === 6 ? '' : 'd-none'}
            />
          </AsideMenuItemWithSub> */}
        </>
      ) : null}
      {/* --------------------------------- Master -------------------------------------- */}

      <AsideMenuItemWithSub
        to='/master'
        title='Master'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen025.svg'
        dislpay={
          user.roleID === 2 || (user.roleID === 3 && user.departmentID === 5) ? '' : 'd-none'
        }
      >
        {/* <AsideMenuItem to='/master/bhkMaster' title='BHK Master' hasBullet={true} /> */}
        <AsideMenuItem to='/master/bannerimage' title='Bannner Image' hasBullet={true} />
        <AsideMenuItem to='/master/branch' title='Branch' hasBullet={true} />
        {/* <AsideMenuItem to='/master/carpetArea' title='Carpet Area' hasBullet={true} /> */}
        {/* <AsideMenuItem to='/master/complaints' title='Complaint Master' hasBullet={true} /> */}
        {/* <AsideMenuItem to='/master/country' title='Country' hasBullet={true} /> */}
        {/* <AsideMenuItem to='/master/expire-complaint' title=' Complaint Expire' hasBullet={true} /> */}
        <AsideMenuItem to='/master/department' title='Department' hasBullet={true} />
        <AsideMenuItem to='/master/designation' title='Designation' hasBullet={true} />
        <AsideMenuItem to='/master/district' title='District' hasBullet={true} />
        <AsideMenuItem to='/master/documenttype' title='Document Type' hasBullet={true} />
        {/* <AsideMenuItem to='/master/discount' title='DIY Discount' hasBullet={true} /> */}
        {/* <AsideMenuItem to='/master/dnc-pay-struc' title='DNC Payment Structure' hasBullet={true} /> */}
        {/* <AsideMenuItem to='/master/dnc-discount' title='DNC Discount' hasBullet={true} /> */}
        {/* <AsideMenuItem to='/master/dnc-type' title='DNC Type' hasBullet={true} /> */}
        {/* <AsideMenuItem
          to='/master/designer-ticket-catgry'
          title='Designer Ticket Category'
          hasBullet={true}
        /> */}
        {/* <AsideMenuItem to='/master/design-stage' title='Design Stage' hasBullet={true} /> */}
        <AsideMenuItem to='/master/eduCategory' title='Education Category' hasBullet={true} />
        <AsideMenuItem to='/master/eduDepartment' title='Education Department' hasBullet={true} />
        {/* <AsideMenuItem to='/master/expenseMasters' title='Expense Master' hasBullet={true} /> */}
        {/* <AsideMenuItem to='/master/expenseType' title='Expense Type' hasBullet={true} /> */}
        {/* <AsideMenuItem to='/master/meeting-type' title='Meeting Type' hasBullet={true} /> */}
        {/* <AsideMenuItem to='/master/modular-discount' title='Modular Discount' hasBullet={true} /> */}
        {/* <AsideMenuItem
          to='/master/modular-pay-struc'
          title='Modular Payment Structure'
          hasBullet={true}
        /> */}
        {/* <AsideMenuItem to='/master/material' title='Material' hasBullet={true} /> */}
        <AsideMenuItem to='/master/nationality' title='Nationality' hasBullet={true} />
        {/* <AsideMenuItem to='/master/offer' title='Offer' hasBullet={true} /> */}
        {/* <AsideMenuItem to='/master/projectstatus' title='Project Status' hasBullet={true} /> */}
        {/* <AsideMenuItem to='/master/pmc-work-stage' title='PMC Work Stage' hasBullet={true} /> */}
        {/* <AsideMenuItem to='/master/pdf-photo-mst' title='PDF Photo Master' hasBullet={true} /> */}
        {/* <AsideMenuItem to='/master/penalty-type' title='Penalty Type' hasBullet={true} /> */}
        {/* <AsideMenuItem
          to='/master/project-type-mst'
          title='Project Type Master'
          dislpay={user.roleID === 2 ? '' : 'd-none'}
          fontIcon='bi-layers'
          hasBullet={true}
        /> */}
        {/* <AsideMenuItem to='/master/quotation-level' title='Quotation Level' hasBullet={true} /> */}
        <AsideMenuItem to='/master/areapincode' title='Area Pincode' hasBullet={true} />
        <AsideMenuItem to='/master/state' title='State' hasBullet={true} />
        <AsideMenuItem to='/master/taluka' title='Taluka' hasBullet={true} />

        {/* <AsideMenuItem
          to='/master/turnkey-pay-struc'
          title='Turnkey Payment Structure'
          hasBullet={true}
        /> */}
        {/* <AsideMenuItem to='/master/unit' title='Unit' hasBullet={true} /> */}
      </AsideMenuItemWithSub>
      <AsideMenuItem
        to='/vender'
        title='Vendor'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen025.svg'
      />
      {/* =====================================Documents========================================== */}
      {/* =====================================Documents========================================== */}
      {/* <AsideMenuItemWithSub
        to='/documents'
        title='Documents'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen005.svg'
      >
        {user.roleID === 2 ? (
        <>
          <AsideMenuItem to='/documents/document-ctgry' title='Documents' hasBullet={true} />
        </>
        ) : null}
      </AsideMenuItemWithSub> */}

      {/* <AsideMenuItem
        to='/documents/document-ctgry'
        icon='/media/icons/duotune/general/gen005.svg'
        title='Documents'
        fontIcon='bi-app-indicator'
      /> */}
      {/* =========================== HR Documnet ================ */}
      {/* <AsideMenuItem
        to='/support'
        title='Support'
        icon='/media/icons/duotune/general/gen025.svg'
        fontIcon='bi-layers'
      /> */}

      {/* ----------------------------------------- Design Addon-------------- */}
      {/* <AsideMenuItemWithSub
        to='/design'
        title='Design Addon'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen022.svg'
        dislpay={user.roleID === 2 || user.designationID === 1007 ? '' : 'd-none'}
      >
        <AsideMenuItem to={`/design/diy-addon`} title='DIY Addon' hasBullet={true} />
        <AsideMenuItem to={`/design/readymade-addon`} title='Ready Made Addon' hasBullet={true} />
        <AsideMenuItem to={`/design/modular-addon`} title='Modular Addon' hasBullet={true} />
      </AsideMenuItemWithSub> */}
      {/* =========================== HR Documnet ================ */}
      {/* <AsideMenuItem
        to='/generate-ticket'
        title='Generate Ticket'
        icon='/media/icons/duotune/general/gen024.svg'
        fontIcon='bi-layers'
      /> */}

      {/* <AsideMenuItem
        to='/generate-penalty'
        title='Penalty'
        icon='/media/icons/duotune/general/gen026.svg'
        fontIcon='bi-layers'
        dislpay={user.roleID === 2 || user.roleID === 5 || user.roleID === 6 ? '' : 'd-none'}
      /> */}

      {/* <AsideMenuItem
        to='/track/live/location'
        icon='/media/icons/duotune/maps/map003.svg'
        title='Employees Avaibility'
        dislpay={user.roleID === 2 || user.roleID === 1 ? '' : 'd-none'}
        fontIcon='bi-app-indicator'
      /> */}

      {/* <AsideMenuItem
        to='/track/history/location'
        icon='/media/icons/duotune/maps/map003.svg'
        title='Employee Tracking'
        dislpay={user.roleID === 2 || user.roleID === 1 ? '' : 'd-none'}
        fontIcon='bi-app-indicator'
      /> */}
      {/* <AsideMenuItem
        to='/google-map/path'
        title='Emp Google Path'
        icon='/media/icons/duotune/maps/map003.svg'
        fontIcon='bi-layers'
        dislpay={user.roleID === 2 ? '' : 'd-none'}
      /> */}

      {/* <AsideMenuItem
        to='/emp-google-path'
        icon='/media/icons/duotune/art/art004.svg'
        title='Employee Google Path'
        dislpay={user.roleID === 2 || user.roleID === 1 ? '' : 'd-none'}
        fontIcon='bi-app-indicator'
      />

      <AsideMenuItem
        to='/track'
        icon='/media/icons/duotune/art/art004.svg'
        title='Track'
        dislpay={user.roleID === 2 || user.roleID === 1 ? '' : 'd-none'}
        fontIcon='bi-app-indicator'
      /> */}
      {/* <AsideMenuItem
        to='/builder'
        icon='/media/icons/duotune/general/gen019.svg'
        title='Builder Layout'
        fontIcon='bi-layers'
      />

      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Menu</span>
        </div>
      </div> */}

      {/* <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Crafted</span>
        </div>
      </div>

      <AsideMenuItemWithSub
        to='/crafted/pages'
        title='Pages'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen022.svg'
      >
        <AsideMenuItemWithSub to='/crafted/pages/profile' title='Profile' hasBullet={true}>
          <AsideMenuItem to='/crafted/pages/profile/overview' title='Overview' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/campaigns' title='Campaigns' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/documents' title='Documents' hasBullet={true} />
          <AsideMenuItem
            to='/crafted/pages/profile/connections'
            title='Connections'
            hasBullet={true}
          />
        </AsideMenuItemWithSub>

        <AsideMenuItemWithSub to='/crafted/pages/wizards' title='Wizards' hasBullet={true}>
          <AsideMenuItem
            to='/crafted/pages/wizards/horizontal'
            title='Horizontal'
            hasBullet={true}
          />
          <AsideMenuItem to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true} />
        </AsideMenuItemWithSub>
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub
        to='/crafted/accounts'
        title='Accounts'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
      >
        <AsideMenuItem to='/crafted/account/overview' title='Overview' hasBullet={true} />
        <AsideMenuItem to='/crafted/account/settings' title='Settings' hasBullet={true} />
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub
        to='/error'
        title='Errors'
        fontIcon='bi-sticky'
        icon='/media/icons/duotune/general/gen040.svg'
      >
        <AsideMenuItem to='/error/404' title='Error 404' hasBullet={true} />
        <AsideMenuItem to='/error/500' title='Error 500' hasBullet={true} />
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub
        to='/crafted/widgets'
        title='Widgets'
        icon='/media/icons/duotune/general/gen025.svg'
        fontIcon='bi-layers'
      >
        <AsideMenuItem to='/crafted/widgets/lists' title='Lists' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/charts' title='Charts' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/mixed' title='Mixed' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/tables' title='Tables' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} />
      </AsideMenuItemWithSub>
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Apps</span>
        </div>
      </div>
      <AsideMenuItemWithSub
        to='/apps/chat'
        title='Chat'
        fontIcon='bi-chat-left'
        icon='/media/icons/duotune/communication/com012.svg'
      >
        <AsideMenuItem to='/apps/chat/private-chat' title='Private Chat' hasBullet={true} />
        <AsideMenuItem to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />
        <AsideMenuItem to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />
      </AsideMenuItemWithSub>
      <div className='menu-item'>
        <div className='menu-content'>
          <div className='separator mx-1 my-4'></div>
        </div>
      </div>
      <div className='menu-item'>
        <a
          target='_blank'
          className='menu-link'
          href={process.env.REACT_APP_PREVIEW_DOCS_URL + '/docs/changelog'}
        >
          <span className='menu-icon'>
            <KTSVG path='/media/icons/duotune/general/gen005.svg' className='svg-icon-2' />
          </span>
          <span className='menu-title'>Changelog {process.env.REACT_APP_VERSION}</span>
        </a>
      </div> */}
    </>
  )
}
