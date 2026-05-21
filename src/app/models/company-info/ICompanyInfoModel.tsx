export interface ICompanyInfoModel {
   
   companyID:number
   companyName:string,
   addressLine1:string,
   addressLine2:string,
   landmark:string,
   pinCode:string,
   cityName:string,
   stateName:string,
   countryName:string,
   isActive: boolean,
   logoPath:string,
   facebookPath:string,
   instaPath:string,
   youTubePath:string,
   signaturePath:string,
   termsMessage:string,
   thankyouMsg:string,
   gstNumber:string,
   phoneNumber:string,
   mobileNumber:string,
   faxNumer:string,
   stateID:number
   emailAddress:string,
   gstCode:string,
   currencySymbole:string,
   currencyName:string,
   currencyCode:string

  }
  export const companyInfoInitValue: ICompanyInfoModel = {
    companyID:0,
   companyName:'',
   addressLine1:'',
   addressLine2:'',
   landmark:'',
   pinCode:'',
   cityName:'',
   stateName:'',
   countryName:'',
   isActive: true,
   logoPath:'',
   facebookPath:'',
   instaPath:'',
   youTubePath:'',
   signaturePath:'',
   termsMessage:'',
   thankyouMsg:'',
   gstNumber:'',
   phoneNumber:'',
   mobileNumber:'',
   faxNumer:'',
   stateID:0,
   emailAddress:'',
   gstCode:'',
   currencySymbole:'',
   currencyName:'',
   currencyCode:''

  
  }
  
 