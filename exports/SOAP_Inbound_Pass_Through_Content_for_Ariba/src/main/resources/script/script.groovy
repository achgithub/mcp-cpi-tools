import com.sap.gateway.ip.core.customdev.util.Message;
import com.sap.it.api.ITApiFactory;
import com.sap.it.api.mapping.ValueMappingApi;

def Message processData(Message message) {
	
	
	def map = message.getHeaders();
	def messageLog = messageLogFactory.getMessageLog(message);
	
	def docType = map.get("docType");
	def systemID = map.get("systemId");
	if (systemID == null || systemID.trim().isEmpty()) {
    systemID = map.get("anERPSystemID")
    }
	def documentStandard = map.get("documentStandard");
	def realmID = map.get("realmId");
	def xclientid = map.get("x-client-id");
	
	message.setHeader("DocumentType",docType);
	addCustomHeader(message,"Documenttype",docType);
	
	message.setHeader("X-client-ID", xclientid);
	addCustomHeader(message,"X-client-ID", xclientid);
	
	message.setHeader("SystemID",systemID);
	addCustomHeader(message,"SystemID",systemID);
	
	message.setHeader("DocumentStandard",documentStandard);
	addCustomHeader(message,"documentStandard",documentStandard);
	
	addCustomHeader(message,"RealmID",realmID);
	
	String eccURL=null;
	def address;
	def clientID;
	def ccLocationID;
	def credentialName;
	
			 try
			 {  
	
                def service = ITApiFactory.getApi(ValueMappingApi.class, null);
                def  anid = service.getMappedValue("Ariba","ANID", 'AribaNetworkID', "ECC", "ANIdentifier");
            
                message.setHeader("anid", anid)
                addCustomHeader(message,"anid",anid);
            
                String xcheck = false
                if (xclientid) {
                    xcheck = (anid.contains(xclientid));
                    message.setHeader('xcheck', xcheck);
                    addCustomHeader(message,"xcheck",xcheck);
                }
                
                if( xcheck == 'true' || anid == "ANID")
                {
                    if( service != null)
                    {
			            if ( systemID == null || systemID == '' || systemID == 'SystemID')
                        {
	      		            address = service.getMappedValue("Ariba", "RealmID", realmID, "ECC", "Address");
      		 	            clientID = service.getMappedValue("Ariba", "RealmID", realmID, "ECC", "ClientID");
      		 	            ccLocationID = service.getMappedValue("Ariba", "RealmID", realmID, "ECC", "CCLocationID");
              		 	    credentialName = service.getMappedValue("Ariba", "RealmID", realmID, "ECC", "Credentials");
              		 	    
	      	            }
	      	            else
	      	            {
				            address = service.getMappedValue("Ariba", "SystemID", systemID, "ECC", "Address");
				            clientID = service.getMappedValue("Ariba", "SystemID", systemID, "ECC", "ClientID");
				            ccLocationID = service.getMappedValue("Ariba", "SystemID", systemID, "ECC", "CCLocationID");
				            credentialName = service.getMappedValue("Ariba", "SystemID", systemID, "ECC", "Credentials");
				            
			            }
      		        }
      		
      		        if(documentStandard == 'IDoc')
      		        {
      		            eccURL = address+"sap"+"/bc"+"/srt"+"/IDoc"+"?sap"+"-"+"client"+"="+clientID;
      		        }
      		        else
      		        {
      	  		        eccURL = address+"sap"+"/bc"+"/srt"+"/xip"+"/arba"+"/"+docType+"/"+clientID;
      		
      		        }
      		        docType
                }
                else
                {
                    throw new  Exception("Please maintain ANID in the Value Mapping correctly")
                }
			 }    
			    
                catch(Exception e)
                {
                    messageLog.setStringProperty("Exception",e.toString())
                    return null;
                }
      
                message.setHeader("eccURL",eccURL);
	            addCustomHeader(message,"eccURL",eccURL);
     
                message.setHeader("ccLocationID",ccLocationID);
                message.setHeader("credentialName",credentialName);
      	
                 //addCustomHeader(message,"ccLocationID",ccLocationID);
                //addCustomHeader(message,"credentialName",credentialName);
      
	            return message;
            }


def addCustomHeader(Message message, String key, String val) {
	def messageLog = messageLogFactory.getMessageLog(message)	
	if (val != null) {
		messageLog.addCustomHeaderProperty(key, val);			
	}
}