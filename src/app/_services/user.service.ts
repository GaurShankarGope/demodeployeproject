import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../_models';
import { config } from '../config/config';
import { Router } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class UserService {
    userToken: any;
    constructor(private http: HttpClient, private router: Router) {
        
        const token = JSON.parse(localStorage.getItem('currentUser'));
        // console.log(token);
        if (token == null) {
            //this.userToken = token.token;
            this.router.navigate(['/pages/auth/login']);
        }
    }
    vesselRecordsServerSide(req)
    {
        return this.http.post(`${config.baseUrl}/vesselRecordsServerSide`,req)
    }

    

    clausesCategoryRecords(){
       // console.log('here in clauses Categoory services');
        return this.http.get(`${config.baseUrl}/clusesCategorylist`)
    }
    
    getUserList() {
        return this.http.get(`${config.baseUrl}/userList`);
    }
    getCompanyList() {
        return this.http.get(`${config.baseUrl}/companylist`);
    }
    getUsersCompanyList(req)
    {
        return this.http.post(`${config.baseUrl}/getUsersCompanyList`,req);
    }
    getChartererList() {
        return this.http.get(`${config.baseUrl}/charterlist`);
    }
    getbrokererList() {
        return this.http.get(`${config.baseUrl}/AllBrokerlist`);
    }
    addCompanyList(req) {
        return this.http.post(`${config.baseUrl}/companycreate`, req);
    }
    updateCompanyList(req) {
        return this.http.post(`${config.baseUrl}/companyupdate`, req);
    }
    updateCompanyadminList(req) {
        return this.http.post(`${config.baseUrl}/companyadminupdate`, req);
    }
    updateUserManagement(req) {
        return this.http.post(`${config.baseUrl}/userupdate`, req);
    }
    getCompanyadminList() {
        return this.http.get(`${config.baseUrl}/companyadminlist`);
    }
    updateCharterer(req) {
        return this.http.post(`${config.baseUrl}/charterupdate`, req);
    }
    getChartererDetail(req) {
        return this.http.post(`${config.baseUrl}/charterdetails`, req);
    }
    getbrokererDetail(req) {
        return this.http.post(`${config.baseUrl}/BrokerDetails`, req);
    }
    getvesselDetail(req) {
        return this.http.post(`${config.baseUrl}/vesseldetails`, req);
    }
    VesselList() {
        return this.http.get(`${config.baseUrl}/vessellist`);
    }
    getactivitylist() {
        return this.http.get(`${config.baseUrl}/vesselactivity`);
    }
    AddVessel(req) {

        return this.http.post(`${config.baseUrl}/vesseladd`, req);
    }
    getstateList() {
        return this.http.get(`${config.baseUrl}/vesselbase`);
    }
    getbuilderList() {
        return this.http.get(`${config.baseUrl}/vesselbuilder`);
    }
    getflagList() {
        return this.http.get(`${config.baseUrl}/vesselflag`);
    }
    getstatusList() {
        return this.http.get(`${config.baseUrl}/vesselstatus`);
    }
    getcommmentList() {
        return this.http.get(`${config.baseUrl}/vesselcomment`);
    }
    getenginedesignList() {
        return this.http.get(`${config.baseUrl}/auxenginedesignlist`);
    }
    getenginetypeList() {
        return this.http.get(`${config.baseUrl}/auxenginetypelist`);
    }
    getfueltypeList() {
        return this.http.get(`${config.baseUrl}/fueltypeslist`);
    }
    getnationalityList() {
        return this.http.get(`${config.baseUrl}/nationalitylist`);
    }
    getvesseltypeeList() {
        return this.http.get(`${config.baseUrl}/shiptypelist`);
    }
    getcompanyList() {
        return this.http.get(`${config.baseUrl}/companylist`);
    }
    getregistryList() {
        return this.http.get(`${config.baseUrl}/portregistrylist`);
    }
    addSubAlert(req) {
        return this.http.post(`${config.baseUrl}/subcategoryAdd`, req);
    }
    deleteVessel(req) {
        return this.http.post(`${config.baseUrl}/vesseldelete`, req);
    }
    updateVessel(req) {
        return this.http.post(`${config.baseUrl}/vesselupdate`, req);
    }
    addFile(req) {
        return this.http.post(`${config.baseUrl}/fileupload`, req);
    }
    roleActiveInactive(req) {
        return this.http.post(`${config.baseUrl}/userroleactive`, req);
    }
    selectList(req) {
        return this.http.post(`${config.baseUrl}/selectrolelist`, req);
    }
    moduleAction(req) {
        return this.http.post(`${config.baseUrl}/moduleactioncreate`, req);
    }
    PositionList() {
        return this.http.get(`${config.baseUrl}/vesselpositionlist`)
    }
    roleListshow() {
        return this.http.get(`${config.baseUrl}/roleAccessmoduleView`)
    }



    // charter party type

    getcharterpartytypeList() {
        return this.http.get(`${config.baseUrl}/charterpartylist`)
    }
    getcharterpartytypeadd(req) {
        return this.http.post(`${config.baseUrl}/charterpartytypecreate`, req);
    }
    getcharterpartytypeupdate(req) {
        return this.http.post(`${config.baseUrl}/charterpartypeupdate`, req);
    }
    getcharterpartytypedelete(req) {
        return this.http.post(`${config.baseUrl}/charterpartytypedelete`, req);
    }



    // cluses category detail

    getclusesCategoryList() {
        return this.http.get(`${config.baseUrl}/clusesCategorylist`)
    }
    getclusesCategoryadd(req) {
        return this.http.post(`${config.baseUrl}/clusesCategorycreate`, req);
    }
    getclusesCategoryupdate(req) {
        return this.http.post(`${config.baseUrl}/clusesCategoryupdate`, req);
    }
    getclusesCategorydelete(req) {
        return this.http.post(`${config.baseUrl}/clusesCategorydelete`, req);
    }


    // cluses term detail

    getclusesList() {
        return this.http.get(`${config.baseUrl}/cluseslist`)
    }
    getclusesadd(req) {
        return this.http.post(`${config.baseUrl}/clusescreate`, req);
    }
    getclusesupdate(req) {
        return this.http.post(`${config.baseUrl}/clusesupdate`, req);
    }
    getclusesdelete(req) {
        return this.http.post(`${config.baseUrl}/clusesdelete`, req);
    }


    //Cp Form 

    getFormList() {
        return this.http.get(`${config.baseUrl}/cpFromlist`)
    }

    getFormadd(req) {
        return this.http.post(`${config.baseUrl}/cpFromcreate`, req)
    }

    getFormedit(req) {
        return this.http.post(`${config.baseUrl}/cpFromupdate`,req)
    }

    getFormdelete(req) {
        return this.http.post(`${config.baseUrl}/cpFromdelete`,req)
    }

    // Draw Form Routes
    // Draw Form Records Service
    drawFormRecords()
    {
       // console.log('here in user services');
        return this.http.get(`${config.baseUrl}/drawFormRecords`)
    }
    //  Draw Records Server Side
    drawRecordsServerSide(req)
    {
       // console.log(req);
        return this.http.post(`${config.baseUrl}/drawRecordsServerSide`, req)
    }
    // Draw Form Create Service
    DrawFormCreate(req)
    {
        return this.http.post(`${config.baseUrl}/DrawFormCreate`, req)
    }
    // Draw Form Update Service
    drawFormUpdate(req)
    {
        return this.http.post(`${config.baseUrl}/drawFormUpdate`,req)
    }

    drawFormUpdateByCharter(req)
    {
        return this.http.post(`${config.baseUrl}/drawFormUpdateByCharterCheck`,req)
    } 
    
    drawFormUpdateBybroker(req)
    {
        return this.http.post(`${config.baseUrl}/drawFormUpdateByBrokerCheck`,req)
    } 
    
    drawFormUpdateByowner(req)
    {
        return this.http.post(`${config.baseUrl}/drawFormUpdateByOwnerCheck`,req)
    }
    // Draw Form Remove Service
    drawDataRemove(req)
    {
        return this.http.post(`${config.baseUrl}/drawDataRemove`,req)
    }

    // CityForm Routes
    // CityForm Records Service
    CityRecords()
    {
        return this.http.get(`${config.baseUrl}/CityRecords`)
    }
    // CityForm Create Service
    CityCreate(req)
    {
        return this.http.post(`${config.baseUrl}/CityCreate`, req)
    }
    // CityForm Update Service
    CityUpdate(req)
    {
        return this.http.post(`${config.baseUrl}/CityUpdate`,req)
    }
    // CityForm Remove Service
    CityRemove(req)
    {
        return this.http.post(`${config.baseUrl}/CityRemove`,req)
    }

    // Draw Invite Routes
    // Draw Invite Records Server Side
    DrawInviteRecordsServerSide(req)
    {
       // console.log(req);
        return this.http.post(`${config.baseUrl}/DrawInviteRecordsServerSide`, req)
    }
    // Draw Invite Form Create Service
    DrawInviteCreate(req)
    {
        return this.http.post(`${config.baseUrl}/DrawInviteCreate`, req)
    }
    // Draw Invite Form Update Service
    DrawInviteUpdate(req)
    {
        return this.http.post(`${config.baseUrl}/DrawInviteUpdate`,req)
    }
    // Draw Invite Form Remove Service
    DrawInviteRemove(req)
    {
        return this.http.post(`${config.baseUrl}/DrawInviteRemove`,req)
    }



//  ********************   // clause amendment

// clause amendment  add
    customeClauseadd(req)
    {
        return this.http.post(`${config.baseUrl}/clauseamendmentCreate`,req)
    }
    customeClauseuUpdate(req)
    {
        return this.http.post(`${config.baseUrl}/clauseamendmentUpdate`,req)
    }
    customeClauseremove(req)
    {
        return this.http.post(`${config.baseUrl}/clauseamendmentRemove`,req)
    }
    
    customeClauseList()
    {
        return this.http.get(`${config.baseUrl}/clauseamendmentlist`)
    }


    clauseCategoryServerSideRecordsServerSide(req)
    {
        return this.http.post(`${config.baseUrl}/clauseCategoryServerSideRecords`,req)
    }

    // Clause Terms Data Records Server Side

    clauseTermsDetailsRecordsServerSide(req)
    {
        return this.http.post(`${config.baseUrl}/clauseTermsDetailsRecordsServerSide`,req)
    }

    // Clause Reviews Records Server Side
    clauseTermsReviewsRecordsServerSide(req)
    {
        return this.http.post(`${config.baseUrl}/clauseTermsReviewsRecordsServerSide`,req)
    }

    // Clause Reviews Records Server Side Custom
    clauseTermsReviewsRecordsServerSideCustom(req)
    {
        return this.http.post(`${config.baseUrl}/clauseTermsReviewsRecordsServerSideCustom`,req)
    }
    
    clauseTermsUpdate (req)
    {
        return this.http.post(`${config.baseUrl}/claueseDetailInsertUpdate`,req)
    }

    clauseCustomeTermsUpdate(req)
    {
        return this.http.post(`${config.baseUrl}/claueseDetailCustomInsertUpdate`,req)
    }

    // Clause Terms Review Insert Update
    claueseDetailInsertUpdate(req)
    {
        return this.http.post(`${config.baseUrl}/claueseDetailInsertUpdate`,req)
    }

    // Clause Category Records Server Side
    clauseCategoryServerSideRecords(req)
    {
        return this.http.post(`${config.baseUrl}/clauseCategoryServerSideRecords`,req)
    }

    // Notification Create
    notificationCreate(req)
    {
        return this.http.post(`${config.baseUrl}/notificationCreate`,req)
    }

    // Notification Records
    notificationRecords(req)
    {
        return this.http.post(`${config.baseUrl}/notificationRecords`,req)
    }

    // Charter Data Accept / Reject
    CharterDrawAcceptReject(req)
    {
        return this.http.post(`${config.baseUrl}/CharterDrawAcceptReject`,req)
    }

    // Charter Data Accept / Reject Status Update
    charterPartyRequestStatusUpdate(req)
    {
        return this.http.post(`${config.baseUrl}/charterPartyRequestStatusUpdate`,req)
    }

    // Draw Setver Side Records For Charterer
    drawRecordsServerSideCharterer(req)
    {
        return this.http.post(`${config.baseUrl}/drawRecordsServerSideCharterer`,req)
    }
    drawFormCopyRecords(req)
    {
        return this.http.post(`${config.baseUrl}/drawFormCopyRecords`,req)
    }
     companyRecordsServerSide(req)
        {
            return this.http.post(`${config.baseUrl}/companyRecordsServerSide`,req)
        }
        fetchTradingStdBidReady(req)
        {
            return this.http.post(`${config.baseUrl}/fetchTradingStdBidReady`,req)
        }

    DrawFormCopyCreate(req)
    {
        return this.http.post(`${config.baseUrl}/DrawFormCopyCreate`,req)
    }
    // Draw Request Create
    DrawRequestToChartererCreate(req)
    {
        return this.http.post(`${config.baseUrl}/DrawRequestToChartererCreate`,req)
    }

    // Clause Category Upload
    clauseCategoryUpload(req)
    {
        return this.http.post(`${config.baseUrl}/clauseCategoryUpload`,req)
    }

    // Draw Request Create
    mainClauseScreenDataRecords(req)
    {
        return this.http.post(`${config.baseUrl}/mainClauseScreenDataRecords`,req)
    }

    
    // Draw Request Create
    mainClauseScreenDataRecordsTrading(req)
    {
        return this.http.post(`${config.baseUrl}/mainClauseScreenDataRecordsTrading`,req)
    }

        // Trading Platform Routes
        TradingFormRecords()
        {
            return this.http.get(`${config.baseUrl}/TradingFormRecords`)
        }
    
        TradingFormCreate(req)
        {
            return this.http.post(`${config.baseUrl}/TradingFormCreate`,req)
        }
    
tradeStatusData(req)
{
    return this.http.post(`${config.baseUrl}/tradeStatusData`,req)
}
        TradingFormRecordsServerSide(req)
        {
            return this.http.post(`${config.baseUrl}/TradingFormRecordsServerSide`,req)
        }
    
        TradingFormUpdate(req)
        {
            return this.http.post(`${config.baseUrl}/TradingFormUpdate`,req)
        }
    
        TradingPlatformDataRemove(req)
        {
            return this.http.post(`${config.baseUrl}/TradingPlatformDataRemove`,req)
        }
    
        TradingPlatformAcceptReject(req)
        {
            return this.http.post(`${config.baseUrl}/TradingPlatformAcceptReject`,req)
        }
    
        TradingPlatformRequestToChartererCreate(req)
        {
            return this.http.post(`${config.baseUrl}/TradingPlatformRequestToChartererCreate`,req)
        }
    
        TradingPlatformRequestStatusUpdate(req)
        {
            return this.http.post(`${config.baseUrl}/TradingPlatformRequestStatusUpdate`,req)
        }
    
        TradingPlatformRecordsServerSideCharterer(req)
        {
            return this.http.post(`${config.baseUrl}/TradingPlatformRecordsServerSideCharterer`,req)
        }

        TradingCounterInsert(req)
        {
            return this.http.post(`${config.baseUrl}/TradingCounterInsert`,req)
        }

        getCounterNumber(req)
        {
            return this.http.post(`${config.baseUrl}/getCounterNumber`,req)
        }

        TradingData(req)
        {
            return this.http.post(`${config.baseUrl}/TradingData`,req)
        }

        CustomClauseInsert(req)
        {
            return this.http.post(`${config.baseUrl}/CustomClauseInsert`,req)
        }

        CustomClauseTermsInsert(req)
        {
            return this.http.post(`${config.baseUrl}/CustomClauseTermsInsert`,req)
        }

        customClauseRecords(req)
        {
            return this.http.post(`${config.baseUrl}/customClauseRecords`,req)
        }
        
        getCustomTermDataOfCustomClause(req)
        {
            return this.http.post(`${config.baseUrl}/getCustomTermDataOfCustomClause`,req)
        }

        CustomClauseTermsUpdateParentID(req)
        {
            return this.http.post(`${config.baseUrl}/CustomClauseTermsUpdateParentID`,req)
        }

        viewCustomTermDataOfCustomClause(req)
        {
            return this.http.post(`${config.baseUrl}/viewCustomTermDataOfCustomClause`,req)
        }

        getClauseTermDataForUpdate(req)
        {
            return this.http.post(`${config.baseUrl}/getClauseTermDataForUpdate`,req)
        }

        viewClauseTermUpdateRecordsOfMainClause(req)
        {
            return this.http.post(`${config.baseUrl}/viewClauseTermUpdateRecordsOfMainClause`,req)
        }

        getCustomClauseTermDataForUpdate(req)
        {
            return this.http.post(`${config.baseUrl}/getCustomClauseTermDataForUpdate`,req)
        }

        customClauseDetailsInsert(req)
        {
            return this.http.post(`${config.baseUrl}/customClauseDetailsInsert`,req)
        }

        viewCustomClauseTermUpdateRecordsOfMainClause(req)
        {
            return this.http.post(`${config.baseUrl}/viewCustomClauseTermUpdateRecordsOfMainClause`,req)
        }

        drawProgressUpdate(req)
        {
            return this.http.post(`${config.baseUrl}/drawProgressUpdate`,req)
        }

        tradingProgressUpdate(req)
        {
            return this.http.post(`${config.baseUrl}/tradingProgressUpdate`,req)
        }

        drawStatusInfoUpdate(req)
        {
            return this.http.post(`${config.baseUrl}/drawStatusInfoUpdate`,req)
        }

        tradingStatusInfoUpdate(req)
        {
            return this.http.post(`${config.baseUrl}/tradingStatusInfoUpdate`,req)
        }

        drawDataUpdate(req)
        {
            return this.http.post(`${config.baseUrl}/drawDataUpdate`,req)
        }

        fetchDrawData(req)
        {
            return this.http.post(`${config.baseUrl}/fetchDrawData`,req)
        }

        fetchTradingData(req)
        {
            return this.http.post(`${config.baseUrl}/fetchTradingData`,req)
        }

        tradingDataUpdate(req)
        {
            return this.http.post(`${config.baseUrl}/tradingDataUpdate`,req)
        }

        fetchCompanyData(req)
        {
            return this.http.post(`${config.baseUrl}/fetchCompanyData`,req)
        }

        updateCheckedClauses(req)
        {
            return this.http.post(`${config.baseUrl}/updateCheckedClauses`,req)
        }

        clauseCategoryRecordsServerSide(req)
        {
            return this.http.post(`${config.baseUrl}/clauseCategoryRecordsServerSide`,req)
        }

        cpFormData(req)
        {
            return this.http.post(`${config.baseUrl}/cpFormData`,req)
        }

        fetchVesselData(req)
        {
            return this.http.post(`${config.baseUrl}/fetchVesselData`,req)
        }

        customInputDrawDataUpdate(req)
        {
            return this.http.post(`${config.baseUrl}/customInputDrawDataUpdate`,req)
        }

        updateCheckedClausesTrading(req)
        {
            return this.http.post(`${config.baseUrl}/updateCheckedClausesTrading`,req)
        }

        customInputTradingDataUpdate(req)
        {
            return this.http.post(`${config.baseUrl}/customInputTradingDataUpdate`,req)
        }

        clauseCategoryStatusUpdate(req)
        {
            return this.http.post(`${config.baseUrl}/clauseCategoryStatusUpdate`,req)
        }

        cpFormStatusUpdate(req)
        {
            return this.http.post(`${config.baseUrl}/cpFormStatusUpdate`,req)
        }

        clauseTermsStatusUpdate(req)
        {
            return this.http.post(`${config.baseUrl}/clauseTermsStatusUpdate`,req)
        }

        // Owner Routes

        OwnerRecords()
        {
            return this.http.get(`${config.baseUrl}/OwnerRecords`)
        }

        OwnerCreate(req)
        {
            return this.http.post(`${config.baseUrl}/OwnerCreate`,req)
        }

        OwnerDetails(req)
        {
            return this.http.post(`${config.baseUrl}/OwnerDetails`,req)
        }

        OwnerEdit(req)
        {
            return this.http.post(`${config.baseUrl}/OwnerEdit`,req)
        }

        OwnerDelete(req)
        {
            return this.http.post(`${config.baseUrl}/OwnerDelete`,req)
        }

        signatureFileUpload(req)
        {
            return this.http.post(`${config.baseUrl}/signatureFileUpload`,req)
        }

        drawDataSignatureUpadate(req)
        {
            return this.http.post(`${config.baseUrl}/drawDataSignatureUpadate`,req)
        }

        tradingDataSignatureUpadate(req)
        {
            return this.http.post(`${config.baseUrl}/tradingDataSignatureUpadate`,req)
        }
        userRecordsServerSide(req)
        {
            return this.http.post(`${config.baseUrl}/userRecordsServerSide`,req)
        }

        TradingStandardFormCreate(req)
        {
            return this.http.post(`${config.baseUrl}/TradingStandardFormCreate`,req)
        }

        tradingEmailIDAndNotificationSend(req)
        {
            return this.http.post(`${config.baseUrl}/tradingEmailIDAndNotificationSend`,req)
        }

        getCompanyName(req)
        {
            return this.http.post(`${config.baseUrl}/getCompanyName`,req)
        }

        drawDataUpdateCommon(req)
        {
            return this.http.post(`${config.baseUrl}/drawDataUpdateCommon`,req)
        }

        sendNotificationToCharterer(req)
        {
            return this.http.post(`${config.baseUrl}/sendNotificationToCharterer`,req)
        }

        TradingPlatformRequestStatusUpdateCommon(req)
        {
            return this.http.post(`${config.baseUrl}/TradingPlatformRequestStatusUpdateCommon`,req)
        }

        updateChartererToTrade(req)
        {
            return this.http.post(`${config.baseUrl}/updateChartererToTrade`,req)
        }

        updateOwnerToTrade(req)
        {
            return this.http.post(`${config.baseUrl}/updateOwnerToTrade`,req)
        }

        updateChartererToDraw(req)
        {
            return this.http.post(`${config.baseUrl}/updateChartererToDraw`,req)
        }

        messageCenterCreate(req)
        {
            return this.http.post(`${config.baseUrl}/messageCenterCreate`,req)
        }

        messageCenterRecordsServerSide(req)
        {
            return this.http.post(`${config.baseUrl}/messageCenterRecordsServerSide`,req)
        }

        messageCenterDataUpdate(req)
        {
            return this.http.post(`${config.baseUrl}/messageCenterDataUpdate`,req)
        }

        // Chat Management Routes
        chatCreate(req)
        {
            return this.http.post(`${config.baseUrl}/chatCreate`,req)
        }

        chatRecordsServerSide(req)
        {
            return this.http.post(`${config.baseUrl}/chatRecordsServerSide`,req)
        }

        fetchChatDetails(req)
        {
            return this.http.post(`${config.baseUrl}/fetchChatDetails`,req)
        }

        chatDataUpdate(req)
        {
            return this.http.post(`${config.baseUrl}/chatDataUpdate`,req)
        }

        fetchRealTimeChatData(req)
        {
            return this.http.post(`${config.baseUrl}/fetchRealTimeChatData`,req)
        }

        realTimeChatRecordsServerSide(req)
        {
            return this.http.post(`${config.baseUrl}/realTimeChatRecordsServerSide`,req)
        }

        faqlist()
        {
            return this.http.get(`${config.baseUrl}/faqlist`)
        }

        tclist()
        {
            return this.http.get(`${config.baseUrl}/tclist`)
        }

        
        tradingMessageInsert(req)
        {
            return this.http.post(`${config.baseUrl}/tradingMessageInsert`,req)
        }

        tradingProgressInsert(req)
        {
            return this.http.post(`${config.baseUrl}/tradingProgressInsert`,req)
        }

        tradingDataUpdateCommon(req)
        {
            return this.http.post(`${config.baseUrl}/tradingDataUpdateCommon`,req)
        }

        tradingNotificationInsert(req)
        {
            return this.http.post(`${config.baseUrl}/tradingNotificationInsert`,req)
        }

        copyTradingData(req)
        {
            return this.http.post(`${config.baseUrl}/copyTradingData`,req)
        }

        chartererInviteOwnerForTrade(req)
        {
            return this.http.post(`${config.baseUrl}/chartererInviteOwnerForTrade`,req)
        }
        clauseCategoryRecordsServerSideTrading(req)
        {
            return this.http.post(`${config.baseUrl}/clauseCategoryRecordsServerSideTrading`,req)
        }
        ownerInviteChartererForTrade(req)
        {
            return this.http.post(`${config.baseUrl}/ownerInviteChartererForTrade`,req)
        }
        tradingProgressRecordsServerSide(req)
        {
            return this.http.post(`${config.baseUrl}/tradingProgressRecordsServerSide`,req)
        }

         newUsersRecords(req)
        {
            return this.http.post(`${config.baseUrl}/newUsersRecords`,req)
        }
       
        tradingRecordsServerSideAccordingToVessel(req)
        {
            return this.http.post(`${config.baseUrl}/tradingRecordsServerSideAccordingToVessel`,req)
        }

        tradingMessagesDataRecordsServerSide(req)
        {
            return this.http.post(`${config.baseUrl}/tradingMessagesDataRecordsServerSide`,req)
        }

        drawMessageInsert(req)
        {
            return this.http.post(`${config.baseUrl}/drawMessageInsert`,req)
        }

        drawNotificationInsert(req)
        {
            return this.http.post(`${config.baseUrl}/drawNotificationInsert`,req)
        }

        invitationEmailSend(req)
        {
            return this.http.post(`${config.baseUrl}/invitationEmailSend`,req)
        }

        invitedUserRecordsServerSide(req)
        {
            return this.http.post(`${config.baseUrl}/invitedUserRecordsServerSide`,req)
        }

        invitationEmailSendCompanyAdmin(req)
        {
            return this.http.post(`${config.baseUrl}/invitationEmailSendCompanyAdmin`,req)
        }
        
        changeOwnerShip(req)
        {
            return this.http.post(`${config.baseUrl}/changeOwnerShip`,req)
        }

        emailSendCommon(req)
        {
            return this.http.post(`${config.baseUrl}/emailSendCommon`,req)
        }

        ownerShipRecordsServerSide(req)
        {
            return this.http.post(`${config.baseUrl}/ownerShipRecordsServerSide`,req)
        }

        shareTrade(req)
        {
            return this.http.post(`${config.baseUrl}/shareTrade`,req)
        }
        shareTradeRecordsServerSide(req)
        {
            return this.http.post(`${config.baseUrl}/shareTradeRecordsServerSide`,req)
        }

        saveBid(req)
        {
            return this.http.post(`${config.baseUrl}/saveBid`,req)
        }


        saveBidRecords(req)
        {
            return this.http.post(`${config.baseUrl}/saveBidRecords`,req)
        }

       
        
}