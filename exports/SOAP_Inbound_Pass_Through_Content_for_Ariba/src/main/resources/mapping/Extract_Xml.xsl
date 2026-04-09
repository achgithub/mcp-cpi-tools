<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    exclude-result-prefixes="hci">
    
    <xsl:param name="exchange"/>
    <xsl:output method="xml" encoding="UTF-8" omit-xml-declaration="yes"/>
    
    <xsl:template match="@* | *">
        <xsl:copy>
            <xsl:apply-templates select="@* | *"/>
        </xsl:copy>
    </xsl:template>
    
    <xsl:template match="/">
        
        <xsl:param name="idocType" select="normalize-space(//IDOC/EDI_DC40/IDOCTYP)"/>
        
        <xsl:variable name="docType">
        	<xsl:value-of select="$idocType"/>
        </xsl:variable>
        
        <!-- Output Variables 
        <xsl:value-of select="hci:setHeader($exchange, 'docType', $docType)"/> -->
        <!--  <xsl:value-of select="hci:setHeader($exchange, 'anDocumentID', $documentid)"/>
        <xsl:value-of select="hci:setHeader($exchange, 'anDocumentType', $doctype)"/>
        <xsl:value-of select="hci:setHeader($exchange, 'anSyncFlag', $syncFlag)"/>
        <xsl:value-of select="hci:setHeader($exchange, 'anSenderID', $senderid1)"/>
		<xsl:value-of select="hci:setHeader($exchange, 'anDocumentVersion', $documentVersion)"/>
        <xsl:value-of select="hci:setHeader($exchange, 'anReceiverID', $tmpReceiverID)"/>
        <xsl:value-of select="hci:setHeader($exchange, 'anXsltDoctype', $xsltdoctype)"/>
        <xsl:value-of select="hci:setHeader($exchange, 'anSyncResponse', $syncResponse)"/>
	    <xsl:value-of select="hci:setHeader($exchange, 'anRealmName', $realmName)"/>
		<xsl:value-of select="hci:setHeader($exchange, 'anSystemID', $anSystemID)"/>
 -->
		
		
    </xsl:template>
    </xsl:stylesheet>
    