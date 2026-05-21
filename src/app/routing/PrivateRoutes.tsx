import {Suspense, lazy} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {FallbackView} from '../../_Ecd/partials'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import InquiryPageMaster from '../modules/inquiry-page/InquiryPageMaster'

export function PrivateRoutes() {
  const BuilderPageWrapper = lazy(() => import('../pages/layout-builder/BuilderPageWrapper'))
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  // -------------------------------------------------------------------------------------------------
  // ================================= Change Password ==========================
  const ChangePasswordPage = lazy(() => import('../modules/change-password/ChangePasswordPage'))
  // ================================= Masters ==========================
  const DistrictMasterPage = lazy(
    () => import('../modules/master-page/district-master-page/DistrictMasterPage')
  )
  const CountryMasterPage = lazy(
    () => import('../modules/master-page/country-master-page/CountryMasterPage')
  )
  const StateMasterPage = lazy(
    () => import('../modules/master-page/state-master-page/StateMasterPage')
  )
  const TalukaMasterPage = lazy(
    () => import('../modules/master-page/taluka-master-page/TalukaMasterPage')
  )
  const NationalityMasterPage = lazy(
    () => import('../modules/master-page/nationality-master-page/NationalityMasterPage')
  )
  const EducationCategoryPage = lazy(
    () => import('../modules/master-page/education-category-master-page/EducationCategoryPage')
  )
  const EducationDepartmentPage = lazy(
    () => import('../modules/master-page/education-department-master-page/EducationDepartmentPage')
  )
  const DocumentTypePage = lazy(
    () => import('../modules/master-page/document-type-page/DocumentTypePage')
  )
  const DepartmentMasterPage = lazy(
    () => import('../modules/master-page/department-master-page/DepartmentMasterPage')
  )
  const DesignationMasterPage = lazy(
    () => import('../modules/master-page/designation-master-page/DesignationMasterPage')
  )
  const BranchMasterPage = lazy(
    () => import('../modules/master-page/branch-master-page/BranchMasterPage')
  )
  const BHKMasterPage = lazy(() => import('../modules/master-page/bhk-master-page/BHKMasterPage'))
  const CarpetAreaMasterPage = lazy(
    () => import('../modules/master-page/carpet-area-page/CarpetAreaMasterPage')
  )
  const UnitMasterPage = lazy(
    () => import('../modules/master-page/unit-master-page/UnitMasterPage')
  )
  const DiscountMasterPage = lazy(
    () => import('../modules/master-page/discount-master-page/DiscountMasterPage')
  )
  const OfferMasterPage = lazy(
    () => import('../modules/master-page/offer-master-page/OfferMasterPage')
  )
  const ModularPaymentStructureMasterPage = lazy(
    () =>
      import('../modules/master-page/modular-payment-structure/ModularPaymentStructureMasterPage')
  )

  const ModularDiscountMasterPage = lazy(
    () => import('../modules/master-page/modular-discount-master-page/ModularDiscountMasterPage')
  )

  const DNCDiscountMasterPage = lazy(
    () => import('../modules/master-page/dnc-discount-master-page/DNCDiscountMasterPage')
  )
  const DNCTypeMasterPage = lazy(
    () => import('../modules/master-page/dnc-type-master-page/DNCTypeMasterPage')
  )
  const DesignerTicketCategoryMasterPage = lazy(
    () =>
      import('../modules/master-page/designer-ticket-catgry-page/DesignerTicketCategoryMasterPage')
  )
  const DesignStageMasterPage = lazy(
    () => import('../modules/master-page/design-stage-page/DesignStageMasterPage')
  )

  const ComplainMasterPage = lazy(
    () => import('../modules/master-page/complain-master-page/ComplainMasterPage')
  )
  const ComplainExpireMasterPage = lazy(
    () => import('../modules/master-page/complain-expire-page/ComplainExpireMasterPage')
  )
  // ============================================================================
  const BannerImageMasterPage = lazy(
    () => import('../modules/master-page/banner-image-master-page/BannerImageMasterPage')
  )
  //
  // ====================================Customer Complain========================

  const CustomerComplainMasterPage = lazy(
    () => import('../modules/customer-complain-master-page/CustomerComplainMasterPage')
  )

  // ================================= Product ==========================
  const PlanAreaMasterPage = lazy(
    () => import('../modules/product-master-page/plan-area-master-page/PlanAreaMasterPage')
  )
  const ProductMasterPage = lazy(
    () => import('../modules/product-master-page/product-master-page/ProductMasterPage')
  )
  const ProductCategoryMasterPage = lazy(
    () =>
      import(
        '../modules/product-master-page/product-category-master-page/ProductCategoryMasterPage'
      )
  )
  const AgencyTypeMasterPage = lazy(
    () => import('../modules/product-master-page/agency-type-master-page/AgencyTypeMasterPage')
  )
  const UpgradeItemMasterPage = lazy(
    () => import('../modules/product-master-page/upgrade-item-master-page/UpgradeItemMasterPage')
  )

  // ================================= Standard Quotation ==========================
  const StandardQuotationMasterPage = lazy(
    () => import('../modules/standard-quotation-master-page/StandardQuotationMasterPage')
  )
  // ================================= Discount Request ==========================
  const DiscountRequestMasterPage = lazy(
    () =>
      import(
        '../modules/discount-request-master-page/diy-request-master-page/DiscountRequestMasterPage'
      )
  )
  const CustomizationDiscountRequestMasterPage = lazy(
    () =>
      import(
        '../modules/discount-request-master-page/customize-request-master-page/CustomizationDiscountRequestMasterPage'
      )
  )
  const CarpetryCustomizationDiscountRequestMasterPage = lazy(
    () =>
      import(
        '../modules/discount-request-master-page/capetry-customize-request-master-page/CarpetryCustomizationDiscountRequestMasterPage'
      )
  )
  const ModularDiscountRequestMasterpage = lazy(
    () =>
      import(
        '../modules/discount-request-master-page/modular-discount-request-master-page/ModularDiscountRequestMasterpage'
      )
  )

  const CivilAndArchitectDiscountRequestMasterPage = lazy(
    () =>
      import(
        '../modules/discount-request-master-page/civil-and-architect-request-master-page/CivilAndArchitectDiscountRequestMasterPage'
      )
  )

  const CivilWithDesignDiscountRequestMasterPage = lazy(
    () =>
      import(
        '../modules/discount-request-master-page/civil-with-design-request-master-page/CivilWithDesignDiscountRequestMasterPage'
      )
  )
  const DesignAndConsultancyDiscountRequestMasterPage = lazy(
    () =>
      import(
        '../modules/discount-request-master-page/design-and-consultancy-request-master-page/DesignAndConsultancyDiscountRequestMasterPage'
      )
  )

  const DesignOnly3dDiscountRequestMasterPage = lazy(
    () =>
      import(
        '../modules/discount-request-master-page/design-only-3d-request-master-page/DesignOnly3dDiscountRequestMasterPage'
      )
  )
  // ================================= Quotations ==========================
  const CustomizationQuotationsMasterPage = lazy(
    () => import('../modules/customization-quotation-master-page/CustomizationQuotationsMasterPage')
  )
  // ================================= Quotations ==========================
  const StandardQuotationsMasterPage = lazy(
    () =>
      import(
        '../modules/quotations-master-page/standard-quotations-master-page/StandardQuotationsMasterPage'
      )
  )
  const PremiumQuotationMasterPage = lazy(
    () =>
      import(
        '../modules/quotations-master-page/premium-quotation-master-page/PremiumQuotationMasterPage'
      )
  )
  const EssentialQuotationsMasterPage = lazy(
    () =>
      import(
        '../modules/quotations-master-page/essential-quotations-master-page/EssentialQuotationsMasterPage'
      )
  )
  const DIYQuotationMasterPage = lazy(
    () =>
      import('../modules/quotations-master-page/diy-quotation-master-page/DIYQuotationMasterPage')
  )
  // ================================= Package ==========================
  const PackageMasterPage = lazy(() => import('../modules/package-master-page/PackageMasterPage'))

  // ================================= Organization ==========================
  const EmployeeMasterPage = lazy(
    () => import('../modules/organization-page/employee-master-page/EmployeeMasterPage')
  )

  const UserMasterPage = lazy(
    () => import('../modules/organization-page/user-master-page/UserMasterPage')
  )
  const CustomerMasterPage = lazy(
    () => import('../modules/organization-page/customer-master-page/CustomerMasterPage')
  )

  const ComanyInfoMasterPage = lazy(
    () => import('../modules/organization-page//comany-info-master/ComanyInfoMasterPage')
  )
  // ======================================================================
  const BankMasterPage = lazy(
    () => import('../modules/organization-page/bank-master-page/BankMasterPage')
  )
  // ======================================================================
  const CashAccountMasterPage = lazy(
    () => import('../modules/organization-page/cash-account-master-page/CashAccountMasterPage')
  )
  // ========================================================================
  const VenderMasterPage = lazy(
    () => import('../modules/master-page/vender-master-page/VenderMasterPage')
  )
  // ========================================================================
  const ProjectStatusMasterPage = lazy(
    () => import('../modules/master-page/project-status-master-page/ProjectStatusMasterPage')
  )
  // =======================================================================
  const PMCWorkStageMasterPage = lazy(
    () => import('../modules/master-page/pmc-work-stage-master-page/PMCWorkStageMasterPage')
  )
  // ========================================================================
  const TurnkeyPaymentStructureMasterPage = lazy(
    () =>
      import(
        '../modules/master-page/turnkey-payment-structure-master-page/TurnkeyPaymentStructureMasterPage'
      )
  )
  // ========================================================================
  const DNCPaymentStructureMasterPage = lazy(
    () =>
      import(
        '../modules/master-page/dnc-payment-structure-master-page/DNCPaymentStructureMasterPage'
      )
  )

  // ========================================================================
  const ExpenseMastersMasterPage = lazy(
    () => import('../modules/master-page/expense-masters-page/ExpenseMastersMasterPage')
  )
  // ============================= Account Page ==============================
  const ExpenseTypeMasterPage = lazy(
    () => import('../modules/master-page/expense-type-page/ExpenseTypeMasterPage')
  )

  const FundReceiveMasterPage = lazy(
    () => import('../modules/account-page/fund-receive-master-page/FundReceiveMasterPage')
  )

  const OtherFundReceiveMasterPage = lazy(
    () =>
      import('../modules/account-page/other-fund-receive-master-page/OtherFundReceiveMasterPage')
  )
  const AccountTransferMasterPage = lazy(
    () => import('../modules/account-page/account-transfer-master-page/AccountTransferMasterPage')
  )
  const PayFundMasterPage = lazy(
    () => import('../modules/account-page/pay-fund-master-page/PayFundMasterPage')
  )

  const PayPurchaseMasterPage = lazy(
    () => import('../modules/account-page/pay-purchase-master-page/PayPurchaseMasterPage')
  )
  const PurchaseAccountMasterPage = lazy(
    () => import('../modules/account-page/purchase-account-master-page/PurchaseAccountMasterPage')
  )

  const TDSPayMasterPage = lazy(
    () => import('../modules/account-page/tds-pay-master-page/TDSPayMasterPage')
  )
  const GSTPayMasterPage = lazy(
    () => import('../modules/account-page/gst-pay-master-page/GstPayMasterPage')
  )
  const DebitNoteMasterPage = lazy(
    () => import('../modules/account-page/debit-note-master-page/DebitNoteMasterPage')
  )

  // ==================================================================================
  const CarpetryPackageMasterPage = lazy(
    () =>
      import(
        '../modules/carpetry-master-page/carpetry-package-master-page/CarpetryPackageMasterPage'
      )
  )
  // ========================== projects===============================
  const ProjectMasterPage = lazy(
    () => import('../modules/project-master-page/project-master/ProjectMasterPage')
  )
  const StageChangeReqMasterPage = lazy(
    () => import('../modules/project-master-page/stage-change-req-page/StageChangeReqMasterPage')
  )
  const ModularStageChangeReqMasterPage = lazy(
    () =>
      import('../modules/project-master-page/stage-change-req-page/ModularStageChangeReqMasterPage')
  )
  const DIYStageChangeReqMasterPage = lazy(
    () => import('../modules/project-master-page/stage-change-req-page/DIYStageChangeReqMasterPage')
  )
  const WorkOrderRequestMasterPage = lazy(
    () => import('../modules/project-master-page/work-order-request/WorkOrderRequestMasterPage')
  )
  // ========================== Carpetry ===============================
  const AddonMasterPage = lazy(
    () => import('../modules/carpetry-master-page/addon-master-page/AddonMasterPage')
  )
  const CarpetryQuotationMasterPage = lazy(
    () =>
      import(
        '../modules/carpetry-master-page/carpetry-quotation-master-page/CarpetryQuotationMasterPage'
      )
  )
  const QuotationMinAmountMasterPage = lazy(
    () =>
      import(
        '../modules/carpetry-master-page/quotation-min-amount-master-page/QuotationMinAmountMasterPage'
      )
  )
  const CarpetryProductMasterMasterPage = lazy(
    () =>
      import(
        '../modules/carpetry-master-page/carpetry-product-master-master-page/CarpetryProductMasterMasterPage'
      )
  )
  const CarpetryDiscountMasterPage = lazy(
    () =>
      import(
        '../modules/carpetry-master-page/carpetry-discount-master-page/CarpetryDiscountMasterPage'
      )
  )

  //=======================Accounte Reports==========================================
  const LedgerReportMasterPage = lazy(
    () => import('../modules/accounts-reports/ledger-report/LedgerReportMasterPage')
  )
  const CashAccountReportMasterPage = lazy(
    () => import('../modules/accounts-reports/cash-account-report/CashAccountReportMasterPage')
  )
  const ProjectDetailReportMasterPage = lazy(
    () =>
      import(
        '../modules/accounts-reports/project-detail-report-master/ProjectDetailReportMasterPage'
      )
  )
  const ProjectReportMasterPage = lazy(
    () => import('../modules/accounts-reports/project-report-master/ProjectReportMasterPage')
  )
  const VendortReportMasterPage = lazy(
    () => import('../modules/accounts-reports/vendor-report-master/VendortReportMasterPage')
  )
  const ProjectProfitLosstReportMasterPage = lazy(
    () =>
      import(
        '../modules/accounts-reports/project-profit-loss-report/ProjectProfitLosstReportMasterPage'
      )
  )
  const CompanyProfitLosstReportMasterPage = lazy(
    () =>
      import(
        '../modules/accounts-reports/company-profit-loss-report/CompanyProfitLosstReportMasterPage'
      )
  )

  // const BalanceReportMasterPage = lazy(
  //   () => import('../modules/accounts-reports/balance-report-master/BalanceReportMasterPage')
  // )
  const AccountDashboardMaster = lazy(
    () => import('../modules/accounts-reports/Account-dashboard-master/AccountDashboardMaster')
  )
  const KitchenLayoutMasterPage = lazy(
    () => import('../modules/account-page/kithchen-layout-master-page/KitchenLayoutMasterPage')
  )

  const ExpenseHeaderMasterPage = lazy(
    () => import('../modules/account-page/expense-header-page/ExpenseHeaderMasterPage')
  )

  const ExpenseTypeReportMasterPage = lazy(
    () =>
      import('../modules/accounts-reports/expense-type-report-master/ExpenseTypeReportMasterPage')
  )

  const PurchaseReportMasterPage = lazy(
    () => import('../modules/accounts-reports/purchase-report-master-page/PurchaseReportMasterPage')
  )
  const PurchaseLedgerMasterPage = lazy(
    () => import('../modules/accounts-reports/purchase-ledger-master/PurchaseLedgerMasterPage')
  )
  const SundryCreditorsReportMasterPage = lazy(
    () =>
      import(
        '../modules/accounts-reports/sundry-credit-report-pages/SundryCreditorsReportMasterPage'
      )
  )
  const SundryDebtorsReportMasterPage = lazy(
    () =>
      import('../modules/accounts-reports/sundry-debt-reports-pages/SundryDebtorsReportMasterPage')
  )
  // ============================ Modular Product =================================
  const ModularProductMasterPage = lazy(
    () => import('../modules/modular-product-page/modular-product/ModularProductMasterPage')
  )
  const ModularProductCategoryMasterPage = lazy(
    () =>
      import(
        '../modules/modular-product-page/modular-product-category/ModularProductCategoryMasterPage'
      )
  )
  const ModularQuotationMasterPage = lazy(
    () =>
      import(
        '../modules/modular-quotation-master-page/diy-quotation-master-page/ModularQuotationMasterPage'
      )
  )
  const CarpetryRemarksMasterPage = lazy(
    () =>
      import(
        '../modules/remarks-master-pages/carpetry-remarks-master-page/CarpetryRemarksMasterPage'
      )
  )
  const DNCRemarksMasterPage = lazy(
    () => import('../modules/remarks-master-pages/dnc-remarks-master-page/DNCRemarksMasterPage')
  )
  const ModularRemarksMasterPage = lazy(
    () =>
      import('../modules/remarks-master-pages/modular-remarks-master-page/ModularRemarksMasterPage')
  )
  const AgencyRemarksMasterPage = lazy(
    () =>
      import('../modules/remarks-master-pages/agency-remarks-master-page/AgencyRemarksMasterPage')
  )

  {
    /* ------------------------ DNC Queatetion  ----------------- */
  }
  const DesignAndConsultancyMasterPage = lazy(
    () =>
      import('../modules/dnc-quotation-page/design-and-consultancy/DesignAndConsultancyMasterPage')
  )

  const CivilAndArchitectMasterPage = lazy(
    () => import('../modules/dnc-quotation-page/civil-and-architect/CivilAndArchitectMasterPage')
  )

  const DesignOnly3dMasterPage = lazy(
    () => import('../modules/dnc-quotation-page/design-only-3d/DesignOnly3dMasterPage')
  )
  const CivilWithDesignMasterPage = lazy(
    () => import('../modules/dnc-quotation-page/civil-with-design/CivilWithDesignMasterPage')
  )
  const RegistrationMasterPage = lazy(
    () => import('../modules/registration-master-page/RegistrationMasterPage')
  )
  const PDFPhotoMasterPage = lazy(
    () => import('../modules/master-page/pdf-photo-master-page/PDFPhotoMasterPage')
  )
  // --------------------------------work History-----------------------------
  const WorkHistoryMaterPage = lazy(
    () => import('../modules/reports-page/work-history-page/WorkHistoryMasterPage')
  )
  const MaterialReportMasterPage = lazy(
    () => import('../modules/material-report-page/MaterialReportMasterPage')
  )
  const ProjectDeadlineReportMasterPage = lazy(
    () =>
      import('../modules/reports-page/project-deadline-master-page/ProjectDeadlineReportMasterPage')
  )
  const ProjectMissedDeadlineReportMasterPage = lazy(
    () =>
      import('../modules/reports-page/missed-deadline-page/ProjectMissedDeadlineReportMasterPage')
  )

  const VendorPenaltyReportMasterPage = lazy(
    () => import('../modules/reports-page/penalty-report/VendorPenaltyReportMasterPage')
  )

  const EmployeePenaltyReportMasterPage = lazy(
    () => import('../modules/reports-page/penalty-report/EmployeePenaltyReportMasterPage')
  )

  const OtherVendorReportMasterPage = lazy(
    () =>
      import('../modules/accounts-reports/other-vendor-report-master/OtherVendorReportMasterPage')
  )
  const MaterialMasterPage = lazy(
    () => import('../modules/master-page/material-master-page/MaterialMasterPage')
  )
  const ProjectExpenseMasterPage = lazy(
    () => import('../modules/account-page/project-expense-master-page/ProjectExpenseMasterPage')
  )
  const ProductQuotations = lazy(() => import('../pages/product-tree-view-page/ProductQuotations'))
  const Notification = lazy(() => import('../pages/dashboard/components/for-admin/Notification'))
  // ======================Documents=================
  const DocumentCategoryMasterPage = lazy(
    () => import('../modules/documents-mst-pages/document-category/DocumentCategoryMasterPage')
  )

  // ==================== Quotation Master ======================
  const QuotationMasterPage = lazy(() => import('../modules/quo-mst/QuotationMasterPage'))
  const SupportMasterPage = lazy(() => import('../modules/support/SupportMasterPage'))

  // ==================== Design Addon ======================

  const ReadyMadeAddonMasterPage = lazy(
    () => import('../modules/design-addon/ready-made-addon/ReadyMadeAddonMasterPage')
  )
  const DIYAddonMasterPage = lazy(
    () => import('../modules/design-addon/diy-addon/DIYAddonMasterPage')
  )

  const ModularDesignAddonMasterPage = lazy(
    () => import('../modules/design-addon/modular-addon/ModularDesignAddonMasterPage')
  )

  const GenerateTicketMasterPage = lazy(
    () => import('../modules/generate-ticket-master-page/GenerateTicketMasterPage')
  )

  const GeneratePenaltyMasterPage = lazy(
    () => import('../modules/generate-penalty-master-page/GeneratePenaltyMasterPage')
  )

  const DesignerStageChangeReqMasterPage = lazy(
    () =>
      import(
        '../modules/project-master-page/designer-change-req-page/DesignerStageChangeReqMasterPage'
      )
  )

  const PenaltyTypeMasterPage = lazy(
    () => import('../modules/master-page/Penalty-Type-page/PenaltyTypeMasterPage')
  )

  const MeetingMasterPage = lazy(() => import('../modules/meeting-mst-pages/MeetingMasterPage'))
  const MeetingTypeMasterPage = lazy(
    () => import('../modules/master-page/meeting-type-page/MeetingTypeMasterPage')
  )

  const MapWithPathMasterPage = lazy(
    () => import('../modules/google-mape-master-pages/map-path-master-page/MapWithPathMasterPage')
  )

  const LiveTrackingMasterPage = lazy(
    () =>
      import('../modules/google-mape-master-pages/live-tracking-master-page/LiveTrackingMasterPage')
  )

  const QuotationLevelMasterPage = lazy(
    () => import('../modules/master-page/quotation-level-page/QuotationLevelMasterPage')
  )

  const NewReadymadePackageMasterPage = lazy(
    () => import('../modules/new-readymade-pkg-mst-page/NewReadymadePackageMasterPage')
  )
  // ================================================================
  const AreaPinCodeMasterPage = lazy(
    () => import('../modules/master-page/area-pincode-master-page/AreaPinCodeMasterPage')
  )
  // ================================================================
  const BusinessMasterPage = lazy(
    () => import('../modules/business-master-page/BusinessMasterPage')
  )

  // ================================================================
  const ServiceMasterPage = lazy(() => import('../modules/service-master-page/ServiceMasterPage'))

  // ================================================================
  const ProjectsMasterPage = lazy(() => import('../modules/projects-master-page/ProjectMasterPage'))
  // ================================================================
  const CareerMasterPage = lazy(() => import('../modules/career-master-page/CareerMasterPage'))
  // ================================================================
  const InquiryPageMaster = lazy(() => import('../modules/inquiry-page/InquiryPageMaster'))

  return (
    <Suspense fallback={<FallbackView />}>
      <Switch>
        <Route path='/dashboard' component={DashboardWrapper} />
        <Route path='/builder' component={BuilderPageWrapper} />
        <Route path='/crafted/pages/profile' component={ProfilePage} />
        <Route path='/crafted/pages/wizards' component={WizardsPage} />
        <Route path='/crafted/widgets' component={WidgetsPage} />
        <Route path='/crafted/account' component={AccountPage} />
        <Route path='/apps/chat' component={ChatPage} />
        <Route path='/menu-test' component={MenuTestPage} />

        {/* --------------------------- Masters ------------------------- */}
        <Route path='/master/district' component={DistrictMasterPage} />
        <Route path='/master/state' component={StateMasterPage} />
        <Route path='/master/country' component={CountryMasterPage} />
        <Route path='/master/taluka' component={TalukaMasterPage} />
        <Route path='/master/nationality' component={NationalityMasterPage} />
        <Route path='/master/eduDepartment' component={EducationDepartmentPage} />
        <Route path='/master/eduCategory' component={EducationCategoryPage} />
        <Route path='/master/documenttype' component={DocumentTypePage} />
        <Route path='/master/department' component={DepartmentMasterPage} />
        <Route path='/master/designation' component={DesignationMasterPage} />
        <Route path='/master/branch' component={BranchMasterPage} />
        <Route path='/master/bhkMaster' component={BHKMasterPage} />
        <Route path='/master/carpetArea' component={CarpetAreaMasterPage} />
        <Route path='/master/discount' component={DiscountMasterPage} />
        <Route path='/master/unit' component={UnitMasterPage} />
        <Route path='/vender' component={VenderMasterPage} />
        <Route path='/master/projectstatus' component={ProjectStatusMasterPage} />
        <Route path='/master/pmc-work-stage' component={PMCWorkStageMasterPage} />
        <Route path='/master/turnkey-pay-struc' component={TurnkeyPaymentStructureMasterPage} />
        <Route path='/master/dnc-pay-struc' component={DNCPaymentStructureMasterPage} />
        <Route path='/master/offer' component={OfferMasterPage} />
        <Route path='/master/modular-pay-struc' component={ModularPaymentStructureMasterPage} />
        <Route path='/master/pdf-photo-mst' component={PDFPhotoMasterPage} />
        <Route path='/master/modular-discount' component={ModularDiscountMasterPage} />
        <Route path='/master/dnc-discount' component={DNCDiscountMasterPage} />
        <Route path='/master/designer-ticket-catgry' component={DesignerTicketCategoryMasterPage} />
        <Route path='/master/design-stage' component={DesignStageMasterPage} />
        <Route path='/master/dnc-type' component={DNCTypeMasterPage} />
        <Route path='/master/complaints' component={ComplainMasterPage} />
        <Route path='/master/expire-complaint' component={ComplainExpireMasterPage} />
        <Route path='/master/material' component={MaterialMasterPage} />
        <Route path='/master/penalty-type' component={PenaltyTypeMasterPage} />
        <Route path='/master/meeting-type' component={MeetingTypeMasterPage} />
        <Route path='/master/project-type-mst' component={QuotationMasterPage} />
        <Route path='/master/quotation-level' component={QuotationLevelMasterPage} />
        <Route path='/master/areapincode' component={AreaPinCodeMasterPage} />
        <Route path='/master/bannerimage' component={BannerImageMasterPage} />
        {/* -------------------------------Complain------------------------- */}

        <Route path='/cust-complaint' component={CustomerComplainMasterPage} />

        {/* --------------------------- Remarks ------------------------- */}
        <Route path='/remarks/carpetry-rmk' component={CarpetryRemarksMasterPage} />
        <Route path='/remarks/dnc-rmk' component={DNCRemarksMasterPage} />
        <Route path='/remarks/modular-rmk' component={ModularRemarksMasterPage} />
        <Route path='/remarks/agency-rmk' component={AgencyRemarksMasterPage} />

        {/* --------------------------- product ------------------------- */}

        <Route path='/p-product/plan-area' component={PlanAreaMasterPage} />
        <Route path='/p-product/products' component={ProductMasterPage} />
        <Route path='/p-product/product-category' component={ProductCategoryMasterPage} />
        <Route path='/p-product/agency-type' component={AgencyTypeMasterPage} />
        <Route path='/p-product/upgrade-item' component={UpgradeItemMasterPage} />
        {/* --------------------------- Standard Quotation ------------------------- */}
        <Route path='/standard-quotation' component={StandardQuotationMasterPage} />
        {/* --------------------------- discount Request ------------------------- */}
        <Route path='/discount-req/diy-req' component={DiscountRequestMasterPage} />
        <Route
          path='/discount-req/customization-req'
          component={CustomizationDiscountRequestMasterPage}
        />
        <Route
          path='/discount-req/carpetry-cust-req'
          component={CarpetryCustomizationDiscountRequestMasterPage}
        />

        <Route path='/discount-req/modular-dis-req' component={ModularDiscountRequestMasterpage} />

        <Route
          path='/discount-req/civil-and-architect-dis-req'
          component={CivilAndArchitectDiscountRequestMasterPage}
        />

        <Route
          path='/discount-req/civil-design-consultancy-dis-req'
          component={CivilWithDesignDiscountRequestMasterPage}
        />

        <Route
          path='/discount-req/design-consultancy-dis-req'
          component={DesignAndConsultancyDiscountRequestMasterPage}
        />
        <Route
          path='/discount-req/3d-design-onliy-dis-req'
          component={DesignOnly3dDiscountRequestMasterPage}
        />
        {/* --------------------------- Customization Quotation ------------------------- */}
        <Route path='/customization-quotations' component={CustomizationQuotationsMasterPage} />
        {/* --------------------------- Quotation ------------------------- */}
        <Route path='/quotations/standards-quotations' component={StandardQuotationsMasterPage} />
        <Route path='/quotations/premium-quotation' component={PremiumQuotationMasterPage} />
        <Route path='/quotations/essential-quotation' component={EssentialQuotationsMasterPage} />
        <Route path='/quotations/diy-quotation' component={DIYQuotationMasterPage} />
        <Route path='/quotations/ready-made-quotation' component={CarpetryQuotationMasterPage} />
        {/* --------------------------- Modular Quotation ------------------------- */}
        <Route path='/modular/modular-quotation' component={ModularQuotationMasterPage} />

        {/* --------------------------- Package ------------------------- */}
        <Route path='/package' component={PackageMasterPage} />
        {/* --------------------------- Organization ------------------------- */}
        <Route path='/organization/employee' component={EmployeeMasterPage} />
        <Route path='/organization/user' component={UserMasterPage} />
        <Route path='/organization/customer' component={CustomerMasterPage} />
        <Route path='/change/password' component={ChangePasswordPage} />
        <Route path='/organization/bank' component={BankMasterPage} />
        <Route path='/organization/cashaccount' component={CashAccountMasterPage} />
        <Route path='/organization/company-info' component={ComanyInfoMasterPage} />
        {/* --------------------------- Projects ------------------------- */}
        <Route path='/projects/project' component={ProjectMasterPage} />
        <Route path='/projects/stage-change-req' component={StageChangeReqMasterPage} />
        <Route
          path='/projects/modular-stage-change-req'
          component={ModularStageChangeReqMasterPage}
        />
        <Route path='/projects/diy-stage-change-req' component={DIYStageChangeReqMasterPage} />
        <Route path='/projects/work-order-request' component={WorkOrderRequestMasterPage} />
        <Route
          path='/projects/designer-stage-change-req'
          component={DesignerStageChangeReqMasterPage}
        />

        {/* --------------------------- Account ------------------------- */}
        <Route path='/accounts/fundreceive' component={FundReceiveMasterPage} />
        <Route path='/accounts/other-fund-receive' component={OtherFundReceiveMasterPage} />
        <Route path='/accounts/accounttransfer' component={AccountTransferMasterPage} />
        <Route path='/accounts/pay-for-project' component={PayFundMasterPage} />
        <Route path='/accounts/pay-for-purchase' component={PayPurchaseMasterPage} />
        <Route path='/accounts/purchase' component={PurchaseAccountMasterPage} />
        <Route path='/accounts/tds' component={TDSPayMasterPage} />
        <Route path='/accounts/gst' component={GSTPayMasterPage} />
        <Route path='/accounts/debit-note' component={DebitNoteMasterPage} />
        <Route path='/accounts/expense-head' component={ExpenseHeaderMasterPage} />
        <Route path='/accounts/expenseMasters' component={ExpenseMastersMasterPage} />
        <Route path='/accounts/expenseType' component={ExpenseTypeMasterPage} />
        <Route path='/accounts/project-expense' component={ProjectExpenseMasterPage} />
        {/* --------------------------- Carpetry ------------------------- */}
        <Route path='/carpetry/addon-master' component={AddonMasterPage} />
        <Route path='/carpetry/carpetry-pkg-mst' component={CarpetryPackageMasterPage} />
        <Route path='/carpetry/product-master' component={CarpetryProductMasterMasterPage} />
        <Route path='/carpetry/quotation-min-amt' component={QuotationMinAmountMasterPage} />
        <Route path='/carpetry/discount' component={CarpetryDiscountMasterPage} />
        {/* --------------------------- Accounts Reports ------------------------- */}
        <Route path='/account-reports/ledger' component={LedgerReportMasterPage} />
        <Route path='/account-reports/cash' component={CashAccountReportMasterPage} />
        <Route path='/account-reports/project' component={ProjectDetailReportMasterPage} />
        <Route path='/account-reports/project-report' component={ProjectReportMasterPage} />
        <Route path='/account-reports/vendor' component={VendortReportMasterPage} />
        <Route path='/account-reports/account-dashboard' component={AccountDashboardMaster} />
        <Route
          path='/account-reports/project-profit-loss'
          component={ProjectProfitLosstReportMasterPage}
        />
        <Route
          path='/account-reports/company-profit-loss'
          component={CompanyProfitLosstReportMasterPage}
        />
        {/* <Route path='/account-reports/balance' component={BalanceReportMasterPage} /> */}
        <Route path='/kitchen-layout' component={KitchenLayoutMasterPage} />
        <Route path='/account-reports/expense' component={ExpenseTypeReportMasterPage} />
        <Route path='/account-reports/purchase' component={PurchaseReportMasterPage} />
        <Route path='/account-reports/purchase-ledger' component={PurchaseLedgerMasterPage} />
        <Route path='/account-reports/other-vendor' component={OtherVendorReportMasterPage} />
        <Route
          path='/account-reports/sundry-creditor'
          component={SundryCreditorsReportMasterPage}
        />
        <Route path='/account-reports/sundry-debtor' component={SundryDebtorsReportMasterPage} />
        {/* ------------------------ modular product ----------------- */}
        <Route path='/module/products' component={ModularProductMasterPage} />
        {/* ------------------------ Meeting ----------------- */}
        <Route path='/meeting' component={MeetingMasterPage} />
        <Route path='/module/product-category' component={ModularProductCategoryMasterPage} />
        {/* ------------------------ DNC Queatetion  ----------------- */}
        <Route
          path='/dnc-quotation/design-and-consultancy'
          component={DesignAndConsultancyMasterPage}
        />

        <Route path='/dnc-quotation/civil-and-architect' component={CivilAndArchitectMasterPage} />

        <Route path='/dnc-quotation/3d-design-onliy' component={DesignOnly3dMasterPage} />

        <Route
          path='/dnc-quotation/civil-with-design-and-consultancy'
          component={CivilWithDesignMasterPage}
        />
        {/* -------------------Vendor Registration----------------------- */}
        <Route path='/registration/vendor-reg-req' component={RegistrationMasterPage} />
        {/* ------------------------------work History---------------------- */}
        <Route path='/reports/work-history' component={WorkHistoryMaterPage} />
        <Route path='/reports/project-material' component={MaterialReportMasterPage} />
        <Route path='/reports/project-deadline' component={ProjectDeadlineReportMasterPage} />
        <Route
          path='/reports/project-missed-deadline'
          component={ProjectMissedDeadlineReportMasterPage}
        />
        <Route path='/reports/employee-penalty' component={EmployeePenaltyReportMasterPage} />
        <Route path='/reports/vendor-penalty' component={VendorPenaltyReportMasterPage} />
        {/* ------------------------------work History---------------------- */}
        <Route path='/products-quotations' component={ProductQuotations} />
        {/* ------------------------------Notification---------------------- */}
        <Route path='/notification' component={Notification} />
        {/* ------------------------------Documents---------------------- */}
        <Route path='/documents/document-ctgry' component={DocumentCategoryMasterPage} />

        {/* <Route path='/mst' component={QuotationMasterPage} /> */}

        <Route path='/support' component={SupportMasterPage} />
        {/* ------------------------------Design Addon---------------------- */}
        <Route path='/design/diy-addon' component={DIYAddonMasterPage} />
        <Route path='/design/readymade-addon' component={ReadyMadeAddonMasterPage} />
        <Route path='/design/modular-addon' component={ModularDesignAddonMasterPage} />
        <Route path='/generate-ticket' component={GenerateTicketMasterPage} />
        <Route path='/generate-penalty' component={GeneratePenaltyMasterPage} />

        <Route path='/emp-google-path' component={MapWithPathMasterPage} />
        <Route path='/track' component={LiveTrackingMasterPage} />
        <Route path='/readymade-pkg/new-readymade-pkg' component={NewReadymadePackageMasterPage} />
        <Route path='/business' component={BusinessMasterPage} />
        <Route path='/service' component={ServiceMasterPage} />
        <Route path='/project' component={ProjectsMasterPage} />
        <Route path='/career' component={CareerMasterPage} />
        <Route path='/inquiry' component={InquiryPageMaster} />

        <Redirect from='/' to='/dashboard' />
        <Redirect exact from='/' to='/dashboard' />
        <Redirect to='error/404' />
      </Switch>
    </Suspense>
  )
}
