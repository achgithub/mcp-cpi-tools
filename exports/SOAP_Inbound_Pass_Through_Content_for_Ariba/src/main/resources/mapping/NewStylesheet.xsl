<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:hci="http://sap.com/it/"
    xmlns:n0="http://sap.com/xi/ARBCIG1" xmlns:ns0="http://sap.com/xi/ARBCIG2" xmlns:sapg20="http://sap.com/xi/SAPGlobal20/Global"  xmlns:n1="urn:sap-com:document:sap:rfc:functions" xmlns:ns2="http://ariba.com/s4/dms/schema/pir"  xmlns:ns3="http://sap.com/xi/Procurement" xmlns:ns4="urn:Ariba:Buyer:vsap"
    version="2.0" exclude-result-prefixes="hci n0 ns0 sapg20 n1 ns2 ns3 ns4">
    <xsl:param name="exchange"/>
    <xsl:output method="xml" encoding="UTF-8" omit-xml-declaration="yes"/>
    <xsl:template match="@* | *">
        <xsl:copy>
            <xsl:apply-templates select="@* | *"/>
        </xsl:copy>
    </xsl:template>
    <xsl:template match="/">
        <!-- TODO: Auto-generated template -->
        <!-- For SP01 through SP03 use RCVPRN for Inbound ERP IDOC System ID reference-->
        <xsl:param name="idocSysId" select="normalize-space(//IDOC/EDI_DC40/RCVPRN)"/> 
        <!--For SP04 onwards Use E1ARBCIG_ADDITIONAL_DATA/ERPSYSTEMID for Inbound ERP IDOC System ID reference-->
        <xsl:param name="idocSysId_Addl" select="normalize-space(//E1ARBCIG_ADDITIONAL_DATA/ERPSYSTEMID)"/>
        
        <xsl:param name="idocType" select="normalize-space(//IDOC/EDI_DC40/IDOCTYP)"/>
        
        <xsl:param name="soapSysId" select="normalize-space(//RecipientParty/InternalID)"/>
        <xsl:param name="soapSysIdQuote" select="normalize-space(//MESSAGEHEADER/RECIPIENTBUSINESSSYSTEMID)"/>
        
        <!--Use RecipientBusinessSystemID for SLP inbound documents-->
        <xsl:param name="slpSysId"  select="normalize-space((//MessageHeader/RecipientBusinessSystemID)[1])"/>
         <!--Use RecipientBusinessSystemID for Sourcing Contracts inbound documents-->
        <xsl:param name="srcContractSysId"  select="normalize-space((//n0:PurchasingContractERPCreateRequest/MessageHeader/RecipientBusinessSystemID)[1])"/>
        <xsl:param name="srcContractServicesSysId"  select="normalize-space((//ns0:PurchasingContractERPRequest_V1/MessageHeader/RecipientBusinessSystemID)[1])"/>
        <!-- Status Update scenario -->
		<xsl:param name="surSoapSysId" select="normalize-space(//RecipientParty/InternalID)" />	
        <xsl:param name="surSoapSysId1" select="normalize-space(//n0:DocumentStatusUpdateRequest/LogicalSystem)" />
        <xsl:param name="buyerCatalogSURSysId" select="normalize-space(//n0:BuyerCatalogStatusResponseMsg/Item/SystemID)"/>
		<!-- p2p/sourcing scenario -->
        <xsl:param name="soapRealmId" select="normalize-space(//VARIANT)" />
        <xsl:param name="sesSoapRealmId" select="normalize-space(//@variant)" />
        <xsl:param name="buyerSURSoapRealmId" select="normalize-space(//n0:BuyerStatusUpdateRequest/MessageHeader/variant)"/>
        <xsl:param name="buyerCatalogSURSoapRealmId" select="normalize-space(//n0:BuyerCatalogStatusResponseMsg/Item/RealmID)"/>
        <!-- stock check request, only ID ex: 100  -->
        <xsl:param name="stockRealmId" select="normalize-space(//@RealmName)" />
        <xsl:param name="pirSysId" select="normalize-space(ns2:PIRPushRequest/ns2:ERPId)" />
        <xsl:param name="bomSysID" select="normalize-space(n0:BOMConfirmation/MessageHeader/ERPID)"/>
        <xsl:variable name="docType">
            <xsl:choose>
                <xsl:when test="n0:DsptchdDelivNotifMsg">DsptchdDelivNotifMsg</xsl:when>
                <xsl:when test="n0:ComponentAcknowledgement">ComponentAcknowledgement</xsl:when>
                <xsl:when test="n0:ComponentConsumption">ComponentConsumption</xsl:when>
                <xsl:when test="n0:CreditMemoMsg">CreditMemoMsg</xsl:when>
                <xsl:when test="n0:DocumentStatusUpdateRequest"
                    >DocumentStatusUpdateRequest</xsl:when>
                <xsl:when test="n0:LiabilityTransfer">LiabilityTransfer</xsl:when>
                <xsl:when test="n0:ProductReplenishment">ProductReplenishment</xsl:when>
                <xsl:when test="n0:RemittanceAdvice">RemittanceAdvice</xsl:when>
                <xsl:when test="n0:ServiceEntrySheetRequest">ServiceEntrySheetRequest</xsl:when>
                <xsl:when test="n0:QualityIssueNotificationMessage"
                    >QualityIssueNotificationMessage</xsl:when>
                <xsl:when test="n0:PurchasingContractERPCreateRequest"
                    >PurchasingContractERPCreateRequest</xsl:when>
                <xsl:when test="n1:ARBCIG_QUOTE">QuoteMessageOrder</xsl:when>
                <xsl:when test="ns0:PurchasingContractERPRequest_V1"
                    >PurchasingContractERPRequest_V1</xsl:when>
				<xsl:when test="sapg20:BusinessPartnerSUITEBulkReplicateRequest"
                    >BusinessPartnerSUITEReplicateRequest</xsl:when>
                <xsl:when test="sapg20:BusinessPartnerSUITEBulkReplicateConfirmation"
                    >BusinessPartnerSUITEReplicateConfirmation</xsl:when>
                <xsl:when test="sapg20:KeyMappingBulkReplicateConfirmation"
                    >KeyMappingBulkReplicateConfirmation</xsl:when>
                  <xsl:when test="sapg20:BusinessPartnerRelationshipSUITEBulkReplicateRequest"
                    >BusinessPartnerRelationshipSUITEBulkReplicateRequest</xsl:when>
                <xsl:when test="sapg20:BusinessPartnerRelationshipSUITEBulkReplicateConfirmation"
                    >BusinessPartnerRelationshipSUITEBulkReplicateConfirmation</xsl:when>
                <xsl:when test="n0:SpendVisibilityConfirmation">SpendAnalysisConfirmation</xsl:when>
                <xsl:when test="ARBCIGR_ARTMAS">ArticleMaster</xsl:when>
                <xsl:when test="ARBCIGR_BOMMAT">ArticleComponents</xsl:when>
                <xsl:when test="n0:AssetRequisitionAsyncExportRequest">AssetRequisitionAsyncExportRequest</xsl:when>
                <xsl:when test="n0:QualityInspectionResult">qualityinspectionresultrequest</xsl:when>
                <xsl:when test="n0:OrdConfAppReqMsg">ordconfappreqmsg</xsl:when>
                <xsl:when test="n0:ReplenishmentOrderRequest">ReplenishmentOrderRequest</xsl:when>
                <xsl:when test="n0:SchedulingAgreementERPRequest">schedulingagreementerprequest</xsl:when>
                <xsl:when test="n0:InvoiceERPRequest">InvoiceERPRequest</xsl:when>
                <xsl:when test="n0:PaymentReceiptConfirmationRequest">paymentreceiptconfrequest</xsl:when>
                <xsl:when test="n0:FileAttachRequest">fileattachrequest</xsl:when>
                
                <!--  P2P documents -->
       			<xsl:when test="n1:ARBCIG_BAPI_PO_CREATE1">PurchaseOrderExportRequest</xsl:when>
				<xsl:when test="n1:ARBCIG_BAPI_PO_CHANGE">PurchaseOrderChangeExportRequest</xsl:when>
				<xsl:when test="n1:ARBCIG_BAPI_PO_CANCEL">PurchaseOrderCancelExportRequest</xsl:when>
				<xsl:when test="n1:ARBCIG_BAPI_PO_CLOSE">PurchaseOrderCloseStatusExportRequest</xsl:when>
				<xsl:when test="n1:ARBCIG_GOODS_RECEIPT_CREATE">ReceiptExportRequest</xsl:when>
				<xsl:when test="n1:ARBCIG_ADV_PAYMENT_POST">AdvancePaymentExportRequest</xsl:when>
				<xsl:when test="n1:ARBCIG_ADV_PAYMENT_REV_POST">CancelAdvancePaymentExportRequest</xsl:when>
				<xsl:when test="n1:ARBCIG_BAPI_INVOICE_CREATE">PaymentExportRequest</xsl:when>
				<xsl:when test="n1:ARBCIG_BAPI_ASSET_CREATE">AssetRequisitionExportRequest</xsl:when>
				<xsl:when test="n1:ARBCIG_BATCH_PURREQ_DELETE">AggregatedRequisitionRevertBudgetRequest</xsl:when>
				<xsl:when test="n0:BuyerStatusUpdateRequest">BuyerStatusUpdateRequest</xsl:when>
				<xsl:when test="n0:BuyerCatalogStatusResponseMsg">CatalogStatusResponse</xsl:when>
				
				<!-- includes stock create and delete -->
				<xsl:when test="n1:ARBCIG_STK_RESERVATION">ReservationAsyncExportRequest</xsl:when>
				<xsl:when test="n0:StockCheckRequest">StockCheckRequest</xsl:when>
				
				<!-- Sourcing Master data -->
				<xsl:when test="ns2:PIRPushRequest">PurchaseInfoRecord</xsl:when>
				<xsl:when test="n0:BOMConfirmation">BomConfirmation</xsl:when>
                
            </xsl:choose>
        </xsl:variable>
        
        <xsl:variable name="systemId">
            <xsl:choose>
                <xsl:when test="$idocSysId_Addl != ''">
                    <xsl:value-of select="$idocSysId_Addl"/>
                </xsl:when>
                <xsl:when test="$idocSysId != ''">
                    <xsl:value-of select="$idocSysId"/>
                </xsl:when>
                <xsl:when test="$soapSysId != ''">
                    <xsl:value-of select="$soapSysId"/>
                </xsl:when>
                 <xsl:when test="$soapSysIdQuote != ''">
                    <xsl:value-of select="$soapSysIdQuote"/>
                </xsl:when>
                 <xsl:when test="$srcContractSysId != ''">
                    <xsl:value-of select="$srcContractSysId"/>
                </xsl:when>
                <xsl:when test="$srcContractServicesSysId != ''">
                    <xsl:value-of select="$srcContractServicesSysId"/>
                </xsl:when>  
                <xsl:when test="$slpSysId != ''">
                    <xsl:value-of select="$slpSysId"/>
                </xsl:when>
                 <xsl:when test="$pirSysId != ''">
                    <xsl:value-of select="$pirSysId"/>
                  </xsl:when>
                <xsl:when test="$bomSysID != ''">
                    <xsl:value-of select="$bomSysID"/>
                  </xsl:when>  
                <xsl:when test="$surSoapSysId1 != ''">
                    <xsl:value-of select="$surSoapSysId1"/>
                </xsl:when>
                 <xsl:when test="$buyerCatalogSURSysId != ''">
                    <xsl:value-of select="$buyerCatalogSURSysId"/>
                </xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="$surSoapSysId" />
				</xsl:otherwise>
            </xsl:choose>
        </xsl:variable>

        <xsl:variable name="docStd">
            <xsl:choose>
                <xsl:when test="$idocSysId_Addl != ''">IDoc</xsl:when>
                <xsl:when test="$idocSysId != ''">IDoc</xsl:when>
                <xsl:otherwise>SOAP</xsl:otherwise>
            </xsl:choose>
        </xsl:variable>
		
	    <xsl:variable name="realmId">
         <xsl:choose>
            <xsl:when test="$sesSoapRealmId != ''">
               <xsl:value-of select="$sesSoapRealmId" />
            </xsl:when> 
            <xsl:when test="$soapRealmId != ''">
               <xsl:value-of select="$soapRealmId" />
            </xsl:when>
            <xsl:when test="$stockRealmId != ''">
               <xsl:value-of select="$stockRealmId" />
            </xsl:when>
            <xsl:when test="$buyerSURSoapRealmId != ''">
                <xsl:value-of select="$buyerSURSoapRealmId"/>
            </xsl:when>
            <xsl:when test="$buyerCatalogSURSoapRealmId != ''">
                <xsl:value-of select="$buyerCatalogSURSoapRealmId"/>
            </xsl:when>
         </xsl:choose>
        </xsl:variable>  
	  
        <xsl:copy>
            <xsl:apply-templates select="@*"/>
            <xsl:copy-of select="."/>
        </xsl:copy>

        <!-- Output Variables -->
        <xsl:value-of select="hci:setHeader($exchange, 'docType', $docType)"/>
        <xsl:value-of select="hci:setHeader($exchange, 'systemId', $systemId)"/>
        <xsl:value-of select="hci:setHeader($exchange, 'documentStandard', $docStd)"/>
        <xsl:value-of select="hci:setHeader($exchange, 'realmId', $realmId)" />

    </xsl:template>
</xsl:stylesheet>