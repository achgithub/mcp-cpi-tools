# SAP CPI iFlow BPMN Generation Reference

This skill provides complete XML building blocks and generation rules for creating SAP Cloud Integration iFlow BPMN XML (`.iflw` files).

---

## File Structure

An iFlow ZIP artifact contains:
```
META-INF/MANIFEST.MF
metainfo.prop
src/main/resources/scenarioflows/integrationflow/{IFlowName}.iflw
src/main/resources/script/{scriptName}.groovy          (if Groovy steps exist)
src/main/resources/mapping/{mappingName}.xsl            (if XSLT steps exist)
src/main/resources/mapping/{mappingName}.mmap           (if MessageMapping exists)
src/main/resources/parameters.prop                      (externalized params)
src/main/resources/parameters.propdef                   (param definitions)
```

---

## BPMN Document Skeleton

Every `.iflw` file follows this structure:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions
    xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
    xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
    xmlns:ifl="http:///com.sap.ifl.model/Ifl.xsd"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    id="Definitions_1">

    <!-- 1. Collaboration: global iFlow settings + participants -->
    <bpmn2:collaboration id="Collaboration_1" name="Default Collaboration">
        <bpmn2:extensionElements>
            <!-- iFlow-level settings -->
        </bpmn2:extensionElements>
        <!-- Sender participant.
             - HTTP/HTTPS flows: no ifl:type needed on the participant element itself.
             - SFTP and most other channel-based adapters: MUST have ifl:type="EndpointSender"
               as BOTH an XML attribute AND an ifl:property inside extensionElements. -->
        <bpmn2:participant id="Participant_Sender" name="Sender1" ifl:type="EndpointSender">
            <bpmn2:extensionElements>
                <ifl:property><key>ifl:type</key><value>EndpointSender</value></ifl:property>
            </bpmn2:extensionElements>
        </bpmn2:participant>
        <!-- Integration Process participant — ifl:type="IntegrationProcess" is REQUIRED -->
        <bpmn2:participant id="Participant_Process_1"
            ifl:type="IntegrationProcess"
            name="Integration Process"
            processRef="Process_1">
            <bpmn2:extensionElements>
                <ifl:property><key>componentVersion</key><value>1.1.0</value></ifl:property>
                <ifl:property><key>id</key><value>Participant_Process_1</value></ifl:property>
            </bpmn2:extensionElements>
        </bpmn2:participant>
        <!-- Receiver participant — same rule: SFTP/channel adapters need ifl:type="EndpointRecevier"
             NOTE: "EndpointRecevier" is a SAP typo — use the misspelling exactly. -->
        <bpmn2:participant id="Participant_Receiver" name="Receiver1" ifl:type="EndpointRecevier">
            <bpmn2:extensionElements>
                <ifl:property><key>ifl:type</key><value>EndpointRecevier</value></ifl:property>
            </bpmn2:extensionElements>
        </bpmn2:participant>
        <!-- Adapter connections -->
        <bpmn2:messageFlow id="MessageFlow_1" name="HTTPS"
            sourceRef="Participant_1" targetRef="StartEvent_1">
            <!-- Sender adapter config -->
        </bpmn2:messageFlow>
        <bpmn2:messageFlow id="MessageFlow_2" name="HTTP"
            sourceRef="EndEvent_1" targetRef="Participant_2">
            <!-- Receiver adapter config -->
        </bpmn2:messageFlow>
    </bpmn2:collaboration>

    <!-- 2. Process: the flow steps -->
    <bpmn2:process id="Process_1" name="Integration Process">
        <bpmn2:extensionElements>
            <!-- Process-level settings -->
        </bpmn2:extensionElements>
        <!-- Start Event -->
        <bpmn2:startEvent id="StartEvent_1" name="Start">
            <bpmn2:outgoing>SequenceFlow_1</bpmn2:outgoing>
        </bpmn2:startEvent>
        <!-- Flow steps (callActivity, serviceTask, gateway, subProcess) -->
        <!-- End Event -->
        <bpmn2:endEvent id="EndEvent_1" name="End">
            <bpmn2:incoming>SequenceFlow_N</bpmn2:incoming>
            <bpmn2:messageEventDefinition/>
        </bpmn2:endEvent>
        <!-- Sequence flows -->
        <bpmn2:sequenceFlow id="SequenceFlow_1" sourceRef="StartEvent_1" targetRef="..." />
    </bpmn2:process>

    <!-- 3. Diagram layout (BPMNDiagram) — required but positions are arbitrary -->
    <bpmndi:BPMNDiagram id="BPMNDiagram_1" name="Default Collaboration Diagram">
        <bpmndi:BPMNPlane bpmnElement="Collaboration_1" id="BPMNPlane_1">
            <!-- BPMNShape for each element, BPMNEdge for each sequenceFlow/messageFlow -->
        </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
</bpmn2:definitions>
```

---

## Collaboration-Level Properties (iFlow Configuration)

```xml
<bpmn2:collaboration id="Collaboration_1" name="Default Collaboration">
    <bpmn2:extensionElements>
        <ifl:property><key>namespaceMapping</key><value/></ifl:property>
        <ifl:property><key>allowedHeaderList</key><value/></ifl:property>
        <ifl:property><key>httpSessionHandling</key><value>None</value></ifl:property>
        <ifl:property><key>ServerTrace</key><value>false</value></ifl:property>
        <ifl:property><key>returnExceptionToSender</key><value>false</value></ifl:property>
        <ifl:property><key>log</key><value>All events</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.1</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::IFlowVariant/cname::IFlowConfiguration/version::1.1.16</value>
        </ifl:property>
    </bpmn2:extensionElements>
    ...
</bpmn2:collaboration>
```

**Key settings:**
- `log`: `"All events"` | `"No logging"` | `"Header only"` | `"Property only"`
- `returnExceptionToSender`: `"true"` to propagate errors to caller (sync flows)
- `httpSessionHandling`: `"None"` | `"On Exchange"` | `"Reuse`
- `allowedHeaderList`: comma-separated headers to propagate (empty = none)

---

## Process-Level Properties

```xml
<bpmn2:process id="Process_1" name="Integration Process">
    <bpmn2:extensionElements>
        <ifl:property><key>transactionTimeout</key><value>30</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.1</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowElementVariant/cname::IntegrationProcess/version::1.2.1</value>
        </ifl:property>
        <ifl:property><key>transactionalHandling</key><value>Required</value></ifl:property>
    </bpmn2:extensionElements>
    ...
</bpmn2:process>
```

**`transactionalHandling`:** `"Required"` (JMS/AT-MOST-ONCE) | `"Not Required"` | `"Required (Commit Before Retry)"`

---

## cmdVariantUri Reference (Latest Versions)

### IFlow Configuration
| Component | cmdVariantUri |
|-----------|--------------|
| IFlowConfiguration | `ctype::IFlowVariant/cname::IFlowConfiguration/version::1.1.16` |

### Flow Elements
| Component | cmdVariantUri |
|-----------|--------------|
| IntegrationProcess | `ctype::FlowElementVariant/cname::IntegrationProcess/version::1.2.1` |
| LocalIntegrationProcess | `ctype::FlowElementVariant/cname::LocalIntegrationProcess/version::1.1.3` |

### Adapter Variants (Sender / Receiver)
| Adapter | Direction | cmdVariantUri |
|---------|-----------|--------------|
| HTTPS | Sender | `ctype::AdapterVariant/cname::sap:HTTPS/tp::HTTPS/mp::None/direction::Sender/version::1.5.0` |
| HTTP | Receiver | `ctype::AdapterVariant/cname::sap:HTTP/tp::HTTP/mp::None/direction::Receiver/version::1.10.0` |
| SOAP (Plain) | Sender | `ctype::AdapterVariant/cname::sap:SOAP/tp::HTTP/mp::Plain SOAP/direction::Sender/version::1.4.1` |
| SOAP (Plain) | Receiver | `ctype::AdapterVariant/cname::sap:SOAP/tp::HTTP/mp::Plain SOAP/direction::Receiver/version::1.10.3` |
| SOAP 1.x | Sender | `ctype::AdapterVariant/cname::sap:SOAP/tp::HTTP/mp::SOAP 1.x/direction::Sender/version::1.9.2` |
| SOAP 1.x | Receiver | `ctype::AdapterVariant/cname::sap:SOAP/tp::HTTP/mp::SOAP 1.x/direction::Receiver/version::1.10.0` |
| JMS | Sender (poll) | `ctype::AdapterVariant/cname::sap:JMS/tp::Not Applicable/mp::Not Applicable/direction::Sender/version::1.4.3` |
| JMS | Receiver (write) | `ctype::AdapterVariant/cname::sap:JMS/tp::Not Applicable/mp::Not Applicable/direction::Receiver/version::1.6.3` |
| SFTP | Sender (polling, user/password) | `ctype::AdapterVariant/cname::sap:SFTP/tp::SFTP/mp::File/direction::Sender/version::1.20.1` |
| SFTP | Receiver (public key) | `ctype::AdapterVariant/cname::sap:SFTP/tp::SFTP/mp::File/direction::Receiver/version::1.13.3` |
| IDoc SOAP | Sender | `ctype::AdapterVariant/cname::sap:IDOC/tp::HTTP/mp::IDoc SOAP/direction::Sender/version::1.4.3` |
| IDoc SOAP | Receiver | `ctype::AdapterVariant/cname::sap:IDOC/tp::HTTP/mp::IDoc SOAP/direction::Receiver/version::1.8.1` |
| XI | Sender | `ctype::AdapterVariant/cname::sap:XI/tp::HTTP/mp::XI/direction::Sender/version::1.19.1` |
| XI | Receiver | `ctype::AdapterVariant/cname::sap:XI/tp::HTTP/mp::XI/direction::Receiver/version::1.19.2` |
| OData V2 | Receiver | `ctype::AdapterVariant/cname::sap:HCIOData/tp::HTTP/mp::OData V2/direction::Receiver/version::1.19.0` |
| AS2 | Sender | `ctype::AdapterVariant/cname::AS2/tp::HTTP/mp::AS2/direction::Sender/version::1.10.1` |
| AS2 | Receiver | `ctype::AdapterVariant/cname::AS2/tp::HTTP/mp::AS2/direction::Receiver/version::1.4.0` |
| ProcessDirect | Sender | `ctype::AdapterVariant/cname::ProcessDirect/vendor::SAP/tp::Not Applicable/mp::Not Applicable/direction::Sender/version::1.1.2` |
| ProcessDirect | Receiver | `ctype::AdapterVariant/cname::ProcessDirect/vendor::SAP/tp::Not Applicable/mp::Not Applicable/direction::Receiver/version::1.1.1` |
| Data Store Consumer | Sender | `ctype::AdapterVariant/cname::sap:DataStoreConsumer/tp::JDBC/mp::None/direction::Sender/version::1.0.0` |

### Flow Step Variants
| Step | activityType | cmdVariantUri |
|------|-------------|--------------|
| Start Event (Message) | StartEvent | `ctype::FlowstepVariant/cname::MessageStartEvent` |
| Start Event (Timer) | StartTimerEvent | `ctype::FlowstepVariant/cname::intermediatetimer/version::1.0.1` |
| End Event (Message) | EndEvent | `ctype::FlowstepVariant/cname::MessageEndEvent/version::1.1.0` |
| Error Start Event | StartErrorEvent | `ctype::FlowstepVariant/cname::ErrorStartEvent` |
| Error End Event | EndErrorEvent | `ctype::FlowstepVariant/cname::ErrorEndEvent` |
| Content Modifier | Enricher | `ctype::FlowstepVariant/cname::Enricher/version::1.6.1` |
| Groovy Script | Script | `ctype::FlowstepVariant/cname::GroovyScript/version::1.1.2` |
| XSLT Mapping | Mapping | `ctype::FlowstepVariant/cname::XSLTMapping/version::1.2.0` |
| Message Mapping | Mapping | `ctype::FlowstepVariant/cname::MessageMapping/version::1.3.1` |
| Filter | Filter | `ctype::FlowstepVariant/cname::Filter/version::1.1.0` |
| General Splitter | Splitter | `ctype::FlowstepVariant/cname::GeneralSplitter/version::1.5.1` |
| Aggregator | Aggregator | `ctype::FlowstepVariant/cname::Aggregator/version::1.0.5` |
| Request Reply | ExternalCall | `ctype::FlowstepVariant/cname::ExternalCall/version::1.0.4` |
| Send | Send | `ctype::FlowstepVariant/cname::Send/version::1.0.4` |
| Exclusive Gateway | ExclusiveGateway | `ctype::FlowstepVariant/cname::ExclusiveGateway/version::1.1.2` |
| Gateway Route (conditional) | — | `ctype::FlowstepVariant/cname::GatewayRoute/version::1.0.0` |
| Multicast | Multicast | `ctype::FlowstepVariant/cname::Multicast/version::1.1.1` |
| Sequential Multicast | SequentialMulticast | `ctype::FlowstepVariant/cname::SequentialMulticast/version::1.1.0` |
| Data Store Write (Put) | DBstorage | `ctype::FlowstepVariant/cname::put/version::1.7.1` |
| Data Store Get | DBstorage | `ctype::FlowstepVariant/cname::get/version::1.7.1` |
| Data Store Select | DBstorage | `ctype::FlowstepVariant/cname::select/version::1.5.1` |
| Data Store Delete | DBstorage | `ctype::FlowstepVariant/cname::delete/version::1.7.1` |
| Content Enricher (lookup) | contentEnricherWithLookup | `ctype::FlowstepVariant/cname::contentEnricherWithLookup/version::1.1.0` |
| Local Process Call | ProcessCallElement | `ctype::FlowstepVariant/cname::NonLoopingProcess/version::1.0.4` |
| Looping Process Call | ProcessCallElement | `ctype::FlowstepVariant/cname::LoopingProcess/version::1.3.0` |
| Error Subprocess | ErrorEventSubProcessTemplate | `ctype::FlowstepVariant/cname::ErrorEventSubProcessTemplate/version::1.1.0` |
| Variables | Variables | `ctype::FlowstepVariant/cname::Variables/version::1.2.0` |
| XML Validator | XmlValidator | `ctype::FlowstepVariant/cname::XmlValidator/version::2.1.0` |
| JSON to XML | JsonToXmlConverter | `ctype::FlowstepVariant/cname::JsonToXmlConverter/version::1.1.1` |
| XML to JSON | XmlToJsonConverter | `ctype::FlowstepVariant/cname::XmlToJsonConverter/version::1.0.6` |
| CSV to XML | CsvToXmlConverter | `ctype::FlowstepVariant/cname::CsvToXmlConverter/version::1.3.0` |
| XML to CSV | XmlToCsvConverter | `ctype::FlowstepVariant/cname::XmlToCsvConverter/version::1.1.1` |
| Base64 Encode | Base64Encode | `ctype::FlowstepVariant/cname::Base64 Encode/version::1.0.1` |
| Base64 Decode | Base64Decode | `ctype::FlowstepVariant/cname::Base64 Decode/version::1.0.1` |
| Idempotent Process Call | IdempotentProcessCall | `ctype::FlowstepVariant/cname::IdempotentProcessCall/version::1.1.0` |
| EDI Splitter | EDISplitter | `ctype::FlowstepVariant/cname::EDISplitter/version::1.7.1` |
| EDI to XML | EDItoXMLConverter | `ctype::FlowstepVariant/cname::EDItoXMLConverter/version::1.4.0` |
| Encrypt | Encrypt | `ctype::FlowstepVariant/cname::Encrypt/version::1.2.1` |
| Decrypt | Decrypt | `ctype::FlowstepVariant/cname::Decrypt/version::1.1.0` |
| XML Modifier | XmlModifier | `ctype::FlowstepVariant/cname::XmlModifier/version::1.1.0` |
| Message Digest | MessageDigest | `ctype::FlowstepVariant/cname::MessageDigest/version::1.0.2` |
| Poll Enrich | PollEnrich | `ctype::FlowstepVariant/cname::PollEnrich/version::1.1.0` |
| Persist | Persist | `ctype::FlowstepVariant/cname::Persist/version::1.0.2` |

---

## Adapter XML Blocks

### HTTPS Sender (inbound HTTP trigger)

The messageFlow connects an external Participant to the StartEvent.

```xml
<bpmn2:messageFlow id="MessageFlow_1" name="HTTPS"
    sourceRef="Participant_1" targetRef="StartEvent_1">
    <bpmn2:extensionElements>
        <ifl:property><key>ComponentType</key><value>HTTPS</value></ifl:property>
        <ifl:property><key>Description</key><value/></ifl:property>
        <ifl:property><key>maximumBodySize</key><value>40</value></ifl:property>
        <ifl:property><key>ComponentNS</key><value>sap</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.4</value></ifl:property>
        <ifl:property><key>urlPath</key><value>/my/endpoint/path</value></ifl:property>
        <ifl:property><key>Name</key><value>HTTPS</value></ifl:property>
        <ifl:property><key>TransportProtocolVersion</key><value>1.5.0</value></ifl:property>
        <ifl:property><key>ComponentSWCVName</key><value>external</value></ifl:property>
        <ifl:property><key>system</key><value>Sender</value></ifl:property>
        <ifl:property><key>xsrfProtection</key><value>1</value></ifl:property>
        <ifl:property><key>TransportProtocol</key><value>HTTPS</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::AdapterVariant/cname::sap:HTTPS/tp::HTTPS/mp::None/direction::Sender/version::1.5.0</value>
        </ifl:property>
        <ifl:property><key>userRole</key><value>ESBMessaging.send</value></ifl:property>
        <ifl:property><key>senderAuthType</key><value>RoleBased</value></ifl:property>
        <ifl:property><key>MessageProtocol</key><value>None</value></ifl:property>
        <ifl:property><key>MessageProtocolVersion</key><value>1.5.0</value></ifl:property>
        <ifl:property><key>ComponentSWCVId</key><value>1.5.0</value></ifl:property>
    </bpmn2:extensionElements>
</bpmn2:messageFlow>
```

**Key properties:**
- `urlPath`: inbound endpoint path, e.g. `/http/my-service`
- `senderAuthType`: `"RoleBased"` (default) | `"ClientCertificate"` | `"None"`
- `userRole`: `"ESBMessaging.send"` (default role for inbound)
- `xsrfProtection`: `"1"` = enabled, `"0"` = disabled
- `maximumBodySize`: MB, default 40

---

### HTTP Receiver (outbound HTTP call)

The messageFlow connects the EndEvent (or ServiceTask for Request-Reply) to an external Participant.

```xml
<bpmn2:messageFlow id="MessageFlow_2" name="HTTP"
    sourceRef="EndEvent_1" targetRef="Participant_2">
    <bpmn2:extensionElements>
        <ifl:property><key>Description</key><value/></ifl:property>
        <ifl:property><key>ComponentNS</key><value>sap</value></ifl:property>
        <ifl:property><key>httpMethod</key><value>POST</value></ifl:property>
        <ifl:property><key>Name</key><value>HTTP</value></ifl:property>
        <ifl:property><key>TransportProtocolVersion</key><value>1.10.0</value></ifl:property>
        <ifl:property><key>ComponentSWCVName</key><value>external</value></ifl:property>
        <ifl:property><key>address</key><value>https://target.example.com/api/endpoint</value></ifl:property>
        <ifl:property><key>httpRequestTimeout</key><value>60000</value></ifl:property>
        <ifl:property><key>system</key><value>Receiver</value></ifl:property>
        <ifl:property><key>authType</key><value>BasicAuthentication</value></ifl:property>
        <ifl:property><key>credentialName</key><value>MyCredential</value></ifl:property>
        <ifl:property><key>TransportProtocol</key><value>HTTP</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::AdapterVariant/cname::sap:HTTP/tp::HTTP/mp::None/direction::Receiver/version::1.10.0</value>
        </ifl:property>
        <ifl:property><key>MessageProtocol</key><value>None</value></ifl:property>
        <ifl:property><key>MessageProtocolVersion</key><value>1.10.0</value></ifl:property>
        <ifl:property><key>ComponentSWCVId</key><value>1.10.0</value></ifl:property>
        <ifl:property><key>ComponentType</key><value>HTTP</value></ifl:property>
    </bpmn2:extensionElements>
</bpmn2:messageFlow>
```

**Key properties:**
- `address`: target URL (can use `${header.x}` or `${property.x}`)
- `httpMethod`: `"POST"` | `"GET"` | `"PUT"` | `"DELETE"`
- `authType`: `"BasicAuthentication"` | `"ClientCertificate"` | `"OAuth2ClientCredentials"` | `"None"`
- `credentialName`: name of deployed credential in Security Material
- `httpRequestTimeout`: milliseconds

---

### JMS Sender (poll from queue — triggers iFlow)

```xml
<bpmn2:messageFlow id="MessageFlow_1" name="JMS"
    sourceRef="Participant_1" targetRef="StartEvent_1">
    <bpmn2:extensionElements>
        <ifl:property><key>ComponentType</key><value>JMS</value></ifl:property>
        <ifl:property><key>ComponentNS</key><value>sap</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.4</value></ifl:property>
        <ifl:property><key>QueueName</key><value>MyQueue</value></ifl:property>
        <ifl:property><key>system</key><value>Sender</value></ifl:property>
        <ifl:property><key>NumberConcurrentProcesses</key><value>1</value></ifl:property>
        <ifl:property><key>MaxRetryInterval</key><value>60</value></ifl:property>
        <ifl:property><key>useDeadLetterQueue</key><value>true</value></ifl:property>
        <ifl:property><key>ExponentialBackoff</key><value>true</value></ifl:property>
        <ifl:property><key>RetryInterval</key><value>0</value></ifl:property>
        <ifl:property><key>MaxRetries</key><value>-1</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::AdapterVariant/cname::sap:JMS/tp::Not Applicable/mp::Not Applicable/direction::Sender/version::1.4.3</value>
        </ifl:property>
        <ifl:property><key>TransportProtocol</key><value>Not Applicable</value></ifl:property>
        <ifl:property><key>MessageProtocol</key><value>Not Applicable</value></ifl:property>
        <ifl:property><key>Name</key><value>JMS</value></ifl:property>
        <ifl:property><key>TransportProtocolVersion</key><value>1.4.3</value></ifl:property>
        <ifl:property><key>ComponentSWCVId</key><value>1.4.3</value></ifl:property>
    </bpmn2:extensionElements>
</bpmn2:messageFlow>
```

---

### JMS Receiver (write to queue)

```xml
<bpmn2:messageFlow id="MessageFlow_2" name="JMS"
    sourceRef="EndEvent_1" targetRef="Participant_2">
    <bpmn2:extensionElements>
        <ifl:property><key>ComponentType</key><value>JMS</value></ifl:property>
        <ifl:property><key>ComponentNS</key><value>sap</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.6</value></ifl:property>
        <ifl:property><key>QueueName_outbound</key><value>MyOutputQueue</value></ifl:property>
        <ifl:property><key>system</key><value>Receiver</value></ifl:property>
        <ifl:property><key>UseMessageCompression</key><value>false</value></ifl:property>
        <ifl:property><key>EncryptMessage</key><value>false</value></ifl:property>
        <ifl:property><key>RetentionThresholdAlerting</key><value>2</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::AdapterVariant/cname::sap:JMS/tp::Not Applicable/mp::Not Applicable/direction::Receiver/version::1.6.3</value>
        </ifl:property>
        <ifl:property><key>TransportProtocol</key><value>Not Applicable</value></ifl:property>
        <ifl:property><key>MessageProtocol</key><value>Not Applicable</value></ifl:property>
        <ifl:property><key>Name</key><value>JMS</value></ifl:property>
        <ifl:property><key>TransportProtocolVersion</key><value>1.6.3</value></ifl:property>
        <ifl:property><key>ComponentSWCVId</key><value>1.6.3</value></ifl:property>
    </bpmn2:extensionElements>
</bpmn2:messageFlow>
```

---

### SFTP Sender (poll files — user/password auth)

The SFTP Sender polls files from a remote SFTP server on a schedule. Each file becomes one message exchange.

**Important:** The sender participant MUST use `ifl:type="EndpointSender"` as both XML attribute and `ifl:property`. The `system` property must match the participant `name` attribute exactly.

```xml
<!-- Participant in collaboration: -->
<bpmn2:participant id="Participant_Sender" name="Sender1" ifl:type="EndpointSender">
    <bpmn2:extensionElements>
        <ifl:property><key>ifl:type</key><value>EndpointSender</value></ifl:property>
    </bpmn2:extensionElements>
</bpmn2:participant>

<!-- MessageFlow from participant to StartEvent: -->
<bpmn2:messageFlow id="MessageFlow_Sender" name="SFTP"
    sourceRef="Participant_Sender" targetRef="StartEvent_1">
    <bpmn2:extensionElements>
        <ifl:property><key>ComponentType</key><value>SFTP</value></ifl:property>
        <ifl:property><key>ComponentNS</key><value>sap</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.20</value></ifl:property>
        <ifl:property><key>Name</key><value>SFTP</value></ifl:property>
        <ifl:property><key>system</key><value>Sender1</value></ifl:property>
        <!-- Connection -->
        <ifl:property><key>host</key><value>{{SenderHost}}</value></ifl:property>
        <ifl:property><key>port</key><value>{{SenderPort}}</value></ifl:property>
        <ifl:property><key>credential_name</key><value>{{SenderCredentialName}}</value></ifl:property>
        <!-- NOTE: property name is credential_name (underscore), NOT credentialName -->
        <ifl:property><key>authentication</key><value>user_password</value></ifl:property>
        <!-- authentication: "user_password" | "public_key" -->
        <ifl:property><key>username</key><value/></ifl:property>
        <!-- File selection -->
        <ifl:property><key>path</key><value>{{SenderDirectory}}</value></ifl:property>
        <!-- NOTE: property name is "path", NOT "directoryName" -->
        <ifl:property><key>fileName</key><value>*</value></ifl:property>
        <!-- fileName: supports wildcards, e.g. "*.xml", "*" for all files -->
        <!-- Post-processing -->
        <ifl:property><key>noop</key><value>delete</value></ifl:property>
        <!-- noop: "delete" (delete after processing) | "move" (archive) | "none" (leave, may reprocess) -->
        <!-- NOTE: property name is "noop" NOT "deleteFile" -->
        <ifl:property><key>file.move</key><value>.archive</value></ifl:property>
        <!-- file.move: archive subdirectory used when noop=move -->
        <!-- Polling schedule (XML-escaped table) -->
        <ifl:property>
            <key>scheduleKey</key>
            <value>&lt;row&gt;&lt;cell id='scheduleType'&gt;timer&lt;/cell&gt;&lt;cell id='startTime'&gt;&lt;/cell&gt;&lt;cell id='endTime'&gt;&lt;/cell&gt;&lt;cell id='timerCron'&gt;&lt;/cell&gt;&lt;cell id='timerInterval'&gt;1&lt;/cell&gt;&lt;cell id='timerIntervalUnit'&gt;minutes&lt;/cell&gt;&lt;cell id='weekDays'&gt;&lt;/cell&gt;&lt;cell id='timerDay'&gt;&lt;/cell&gt;&lt;/row&gt;</value>
        </ifl:property>
        <!-- Concurrency and limits -->
        <ifl:property><key>maxMessagesPerPoll</key><value>20</value></ifl:property>
        <ifl:property><key>disconnect</key><value>1</value></ifl:property>
        <ifl:property><key>readLock</key><value>none</value></ifl:property>
        <ifl:property><key>idempotentRepository</key><value>database</value></ifl:property>
        <ifl:property><key>emptyFileHandling</key><value>processFile</value></ifl:property>
        <ifl:property><key>maximumFileSize</key><value>40</value></ifl:property>
        <ifl:property><key>sftpSecEnabled</key><value>1</value></ifl:property>
        <ifl:property><key>sorting</key><value>none</value></ifl:property>
        <ifl:property><key>includeSubFolders</key><value>0</value></ifl:property>
        <!-- Protocol metadata -->
        <ifl:property><key>TransportProtocol</key><value>SFTP</value></ifl:property>
        <ifl:property><key>MessageProtocol</key><value>File</value></ifl:property>
        <ifl:property><key>TransportProtocolVersion</key><value>1.20.1</value></ifl:property>
        <ifl:property><key>MessageProtocolVersion</key><value>1.20.1</value></ifl:property>
        <ifl:property><key>ComponentSWCVName</key><value>external</value></ifl:property>
        <ifl:property><key>ComponentSWCVId</key><value>1.20.1</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::AdapterVariant/cname::sap:SFTP/tp::SFTP/mp::File/direction::Sender/version::1.20.1</value>
        </ifl:property>
    </bpmn2:extensionElements>
</bpmn2:messageFlow>
```

**Key properties:**
- `host` / `port`: SFTP server hostname and port — always externalize: `{{SenderHost}}`, `{{SenderPort}}`
- `path`: remote directory — property name is `path` (NOT `directoryName`)
- `credential_name`: deployed Security Material alias — property name uses underscore (NOT `credentialName`)
- `authentication`: `user_password` for username+password; `public_key` for key-based
- `noop`: `delete` removes file after processing; `move` archives to `file.move` subdirectory; `none` leaves it (risks reprocessing)
- `system`: must exactly match the `name` attribute on the participant element
- `scheduleKey`: XML-escaped table row controlling polling interval (timer/cron)

---

### SFTP Receiver (write file — public key auth)

**Important:** The receiver participant MUST use `ifl:type="EndpointRecevier"` (SAP's typo — note the misspelling) as both XML attribute and `ifl:property`.

```xml
<!-- Participant in collaboration: -->
<bpmn2:participant id="Participant_Receiver" name="Receiver1" ifl:type="EndpointRecevier">
    <bpmn2:extensionElements>
        <ifl:property><key>ifl:type</key><value>EndpointRecevier</value></ifl:property>
    </bpmn2:extensionElements>
</bpmn2:participant>

<!-- MessageFlow from EndEvent to participant: -->
<bpmn2:messageFlow id="MessageFlow_Receiver" name="SFTP"
    sourceRef="EndEvent_1" targetRef="Participant_Receiver">
    <bpmn2:extensionElements>
        <ifl:property><key>ComponentType</key><value>SFTP</value></ifl:property>
        <ifl:property><key>ComponentNS</key><value>sap</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.13</value></ifl:property>
        <ifl:property><key>Name</key><value>SFTP</value></ifl:property>
        <ifl:property><key>system</key><value>Receiver1</value></ifl:property>
        <!-- Connection -->
        <ifl:property><key>host</key><value>{{ReceiverHost}}</value></ifl:property>
        <ifl:property><key>port</key><value>{{ReceiverPort}}</value></ifl:property>
        <ifl:property><key>authentication</key><value>public_key</value></ifl:property>
        <!-- authentication: "public_key" | "user_password" -->
        <ifl:property><key>privateKeyAlias</key><value>{{ReceiverPrivateKeyAlias}}</value></ifl:property>
        <!-- privateKeyAlias: name of SSH key in Security Material (for public_key auth) -->
        <ifl:property><key>username</key><value>{{ReceiverUsername}}</value></ifl:property>
        <ifl:property><key>credential_name</key><value/></ifl:property>
        <!-- credential_name: empty for public_key auth; set for user_password auth -->
        <!-- File target -->
        <ifl:property><key>path</key><value>{{ReceiverDirectory}}</value></ifl:property>
        <!-- NOTE: property name is "path", NOT "directoryName" -->
        <ifl:property><key>fileName</key><value>${header.CamelFileName}</value></ifl:property>
        <!-- fileName: use ${header.CamelFileName} to preserve original name, or set a static/dynamic name -->
        <!-- File handling -->
        <ifl:property><key>fileExist</key><value>Override</value></ifl:property>
        <!-- fileExist: "Override" | "Append" | "Fail" | "Ignore" -->
        <ifl:property><key>autoCreate</key><value>1</value></ifl:property>
        <!-- autoCreate: 1 = create target directory if it doesn't exist -->
        <ifl:property><key>sftpSecEnabled</key><value>1</value></ifl:property>
        <ifl:property><key>disconnect</key><value>1</value></ifl:property>
        <ifl:property><key>maximumFileSize</key><value>40</value></ifl:property>
        <!-- Protocol metadata -->
        <ifl:property><key>TransportProtocol</key><value>SFTP</value></ifl:property>
        <ifl:property><key>MessageProtocol</key><value>File</value></ifl:property>
        <ifl:property><key>TransportProtocolVersion</key><value>1.13.3</value></ifl:property>
        <ifl:property><key>MessageProtocolVersion</key><value>1.13.3</value></ifl:property>
        <ifl:property><key>ComponentSWCVName</key><value>external</value></ifl:property>
        <ifl:property><key>ComponentSWCVId</key><value>1.13.3</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::AdapterVariant/cname::sap:SFTP/tp::SFTP/mp::File/direction::Receiver/version::1.13.3</value>
        </ifl:property>
    </bpmn2:extensionElements>
</bpmn2:messageFlow>
```

**Key properties:**
- `privateKeyAlias`: name of the SSH private key deployed in Security Material (public key auth only)
- `username`: the SFTP username (required for public key auth; `credential_name` holds both user+pass for user_password auth)
- `fileExist`: how to handle existing files — `Override` replaces, `Append` appends, `Fail` throws error
- `fileName`: to write files with a dynamic name computed in the flow, use `${header.CamelFileName}` or set a Groovy-computed header before this step
- `autoCreate`: `1` = create the target directory automatically if missing

**Participant type reminder (SFTP):**
```xml
<!-- SFTP Sender participant — ifl:type on element AND as ifl:property -->
<bpmn2:participant id="Participant_Sender" name="Sender1" ifl:type="EndpointSender">
    <bpmn2:extensionElements>
        <ifl:property><key>ifl:type</key><value>EndpointSender</value></ifl:property>
    </bpmn2:extensionElements>
</bpmn2:participant>

<!-- SFTP Receiver participant — NOTE the SAP typo: "EndpointRecevier" not "EndpointReceiver" -->
<bpmn2:participant id="Participant_Receiver" name="Receiver1" ifl:type="EndpointRecevier">
    <bpmn2:extensionElements>
        <ifl:property><key>ifl:type</key><value>EndpointRecevier</value></ifl:property>
    </bpmn2:extensionElements>
</bpmn2:participant>
```

---

## Flow Step XML Blocks

### Message Start Event (HTTP/SOAP trigger)

```xml
<bpmn2:startEvent id="StartEvent_1" name="Start">
    <bpmn2:extensionElements>
        <ifl:property><key>componentVersion</key><value>1.0</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::MessageStartEvent</value>
        </ifl:property>
        <ifl:property><key>activityType</key><value>StartEvent</value></ifl:property>
    </bpmn2:extensionElements>
    <bpmn2:outgoing>SequenceFlow_1</bpmn2:outgoing>
    <bpmn2:messageEventDefinition/>
</bpmn2:startEvent>
```

### Message End Event

```xml
<bpmn2:endEvent id="EndEvent_1" name="End">
    <bpmn2:extensionElements>
        <ifl:property><key>componentVersion</key><value>1.1</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::MessageEndEvent/version::1.1.0</value>
        </ifl:property>
    </bpmn2:extensionElements>
    <bpmn2:incoming>SequenceFlow_N</bpmn2:incoming>
    <bpmn2:messageEventDefinition/>
</bpmn2:endEvent>
```

---

### Content Modifier (set headers, properties, or body)

`activityType = Enricher`, element = `bpmn2:callActivity`

Table values are XML-escaped `<row><cell>` structures. Each row = one header/property.

```xml
<bpmn2:callActivity id="CallActivity_1" name="Set Headers">
    <bpmn2:extensionElements>
        <ifl:property><key>bodyType</key><value>expression</value></ifl:property>
        <!-- bodyType: "expression" (Camel Simple), "constant", "xpath", "" (no change) -->
        <ifl:property><key>wrapContent</key><value>${in.body}</value></ifl:property>
        <!-- wrapContent: the body value when bodyType is set -->
        <ifl:property>
            <key>headerTable</key>
            <!-- Each row: Action=Create|Delete, Type=constant|expression|xpath|property|header,
                 Value=the value, Default=fallback, Name=header name, Datatype=java.lang.String -->
            <value>&lt;row&gt;&lt;cell id='Action'&gt;Create&lt;/cell&gt;&lt;cell id='Type'&gt;constant&lt;/cell&gt;&lt;cell id='Value'&gt;myValue&lt;/cell&gt;&lt;cell id='Default'&gt;&lt;/cell&gt;&lt;cell id='Name'&gt;MyHeader&lt;/cell&gt;&lt;cell id='Datatype'&gt;java.lang.String&lt;/cell&gt;&lt;/row&gt;</value>
        </ifl:property>
        <ifl:property>
            <key>propertyTable</key>
            <value>&lt;row&gt;&lt;cell id='Action'&gt;Create&lt;/cell&gt;&lt;cell id='Type'&gt;expression&lt;/cell&gt;&lt;cell id='Value'&gt;${header.SomeHeader}&lt;/cell&gt;&lt;cell id='Default'&gt;&lt;/cell&gt;&lt;cell id='Name'&gt;MyProperty&lt;/cell&gt;&lt;cell id='Datatype'&gt;java.lang.String&lt;/cell&gt;&lt;/row&gt;</value>
        </ifl:property>
        <ifl:property><key>componentVersion</key><value>1.6</value></ifl:property>
        <ifl:property><key>activityType</key><value>Enricher</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::Enricher/version::1.6.1</value>
        </ifl:property>
    </bpmn2:extensionElements>
    <bpmn2:incoming>SequenceFlow_1</bpmn2:incoming>
    <bpmn2:outgoing>SequenceFlow_2</bpmn2:outgoing>
</bpmn2:callActivity>
```

**Cell type values:**
- `constant` — literal string
- `expression` — Apache Camel Simple Language: `${header.X}`, `${property.Y}`, `${date:now:yyyy-MM-dd}`
- `xpath` — XPath 1.0: `//Order/@id`
- `property` — reads exchange property: `${property.X}`
- `header` — reads exchange header: `${header.X}`

---

### Groovy Script

```xml
<bpmn2:callActivity id="CallActivity_2" name="Process Message">
    <bpmn2:extensionElements>
        <ifl:property><key>scriptFunction</key><value>processData</value></ifl:property>
        <!-- scriptFunction: the Groovy method to call, default "processData" -->
        <ifl:property><key>scriptBundleId</key><value/></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.1</value></ifl:property>
        <ifl:property><key>activityType</key><value>Script</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::GroovyScript/version::1.1.2</value>
        </ifl:property>
        <ifl:property><key>subActivityType</key><value>GroovyScript</value></ifl:property>
        <ifl:property><key>script</key><value>myScript.groovy</value></ifl:property>
        <!-- script: filename in src/main/resources/script/ -->
    </bpmn2:extensionElements>
    <bpmn2:incoming>SequenceFlow_1</bpmn2:incoming>
    <bpmn2:outgoing>SequenceFlow_2</bpmn2:outgoing>
</bpmn2:callActivity>
```

**Groovy script template:**
```groovy
import com.sap.gateway.ip.core.customdev.util.Message

def Message processData(Message message) {
    def headers = message.getHeaders()
    def body = message.getBody(String)

    // Set headers
    message.setHeader("MyHeader", "value")
    // Set properties
    message.setProperty("MyProperty", "value")
    // Set body
    message.setBody("<root>modified</root>")

    return message
}
```

---

### XSLT Mapping

```xml
<bpmn2:callActivity id="CallActivity_3" name="Transform Message">
    <bpmn2:extensionElements>
        <ifl:property><key>mappingoutputformat</key><value>Bytes</value></ifl:property>
        <!-- mappingoutputformat: "Bytes" (default) | "String" -->
        <ifl:property><key>mappingpath</key><value>src/main/resources/mapping/MyMapping.xsl</value></ifl:property>
        <ifl:property><key>mappingSource</key><value>mappingSrcBody</value></ifl:property>
        <!-- mappingSource: "mappingSrcBody" (default) | "mappingSrcHeader" (from header) -->
        <ifl:property><key>componentVersion</key><value>1.2</value></ifl:property>
        <ifl:property><key>activityType</key><value>Mapping</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::XSLTMapping/version::1.2.0</value>
        </ifl:property>
        <ifl:property><key>subActivityType</key><value>XSLTMapping</value></ifl:property>
    </bpmn2:extensionElements>
    <bpmn2:incoming>SequenceFlow_1</bpmn2:incoming>
    <bpmn2:outgoing>SequenceFlow_2</bpmn2:outgoing>
</bpmn2:callActivity>
```

---

### Message Mapping

```xml
<bpmn2:callActivity id="CallActivity_4" name="Map Message">
    <bpmn2:extensionElements>
        <ifl:property><key>mappinguri</key><value>dir://mmap/src/main/resources/mapping/MyMapping.mmap</value></ifl:property>
        <ifl:property><key>mappingname</key><value>MyMapping</value></ifl:property>
        <ifl:property><key>mappingType</key><value>MessageMapping</value></ifl:property>
        <ifl:property><key>mappingpath</key><value>src/main/resources/mapping/MyMapping</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.3</value></ifl:property>
        <ifl:property><key>activityType</key><value>Mapping</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::MessageMapping/version::1.3.1</value>
        </ifl:property>
    </bpmn2:extensionElements>
    <bpmn2:incoming>SequenceFlow_1</bpmn2:incoming>
    <bpmn2:outgoing>SequenceFlow_2</bpmn2:outgoing>
</bpmn2:callActivity>
```

---

### Filter

```xml
<bpmn2:callActivity id="CallActivity_5" name="Filter Items">
    <bpmn2:extensionElements>
        <ifl:property><key>xpathType</key><value>Nodelist</value></ifl:property>
        <!-- xpathType: "Nodelist" (returns matching nodes) | "Node" (single node) -->
        <ifl:property><key>wrapContent</key><value>//Order/Items/Item[./Type='X']</value></ifl:property>
        <!-- wrapContent: XPath expression to filter by -->
        <ifl:property><key>componentVersion</key><value>1.0</value></ifl:property>
        <ifl:property><key>activityType</key><value>Filter</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::Filter/version::1.1.0</value>
        </ifl:property>
    </bpmn2:extensionElements>
    <bpmn2:incoming>SequenceFlow_1</bpmn2:incoming>
    <bpmn2:outgoing>SequenceFlow_2</bpmn2:outgoing>
</bpmn2:callActivity>
```

---

### General Splitter

```xml
<bpmn2:callActivity id="CallActivity_6" name="Split Messages">
    <bpmn2:extensionElements>
        <ifl:property><key>exprType</key><value>XPath</value></ifl:property>
        <!-- exprType: "XPath" | "Token" | "Line" -->
        <ifl:property><key>Streaming</key><value>false</value></ifl:property>
        <ifl:property><key>StopOnExecution</key><value>true</value></ifl:property>
        <ifl:property><key>SplitterThreads</key><value>10</value></ifl:property>
        <ifl:property><key>splitExprValue</key><value>//Order/Item</value></ifl:property>
        <!-- splitExprValue: XPath to each split element -->
        <ifl:property><key>ParallelProcessing</key><value>false</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.5</value></ifl:property>
        <ifl:property><key>activityType</key><value>Splitter</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::GeneralSplitter/version::1.5.1</value>
        </ifl:property>
        <ifl:property><key>grouping</key><value/></ifl:property>
        <ifl:property><key>splitType</key><value>GeneralSplitter</value></ifl:property>
        <ifl:property><key>timeOut</key><value>300</value></ifl:property>
    </bpmn2:extensionElements>
    <bpmn2:incoming>SequenceFlow_1</bpmn2:incoming>
    <bpmn2:outgoing>SequenceFlow_2</bpmn2:outgoing>
</bpmn2:callActivity>
```

---

### Aggregator

```xml
<bpmn2:callActivity id="CallActivity_7" name="Aggregate">
    <bpmn2:extensionElements>
        <ifl:property><key>incomingFormat</key><value>XML_SAME_FORMAT</value></ifl:property>
        <!-- incomingFormat: "XML_SAME_FORMAT" | "XML_MIXED_FORMAT" | "Plain_Text" -->
        <ifl:property><key>aggregationAlgorithm</key><value>sap-id-list</value></ifl:property>
        <!-- aggregationAlgorithm: "sap-id-list" | "sap-sequenced-id-list" -->
        <ifl:property><key>correlationExpression</key><value>//@OrderID</value></ifl:property>
        <!-- correlationExpression: XPath to group messages by -->
        <ifl:property><key>lastMessageCondition</key><value>false</value></ifl:property>
        <!-- lastMessageCondition: XPath/expression that is true for the last message, or message count -->
        <ifl:property><key>messageSequenceExpression</key><value/></ifl:property>
        <ifl:property><key>datastoreName</key><value>MyAggregator</value></ifl:property>
        <ifl:property><key>timeout</key><value>2</value></ifl:property>
        <!-- timeout: minutes until aggregation is completed regardless -->
        <ifl:property><key>componentVersion</key><value>1.0</value></ifl:property>
        <ifl:property><key>activityType</key><value>Aggregator</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::Aggregator/version::1.0.5</value>
        </ifl:property>
    </bpmn2:extensionElements>
    <bpmn2:incoming>SequenceFlow_1</bpmn2:incoming>
    <bpmn2:outgoing>SequenceFlow_2</bpmn2:outgoing>
</bpmn2:callActivity>
```

---

### Request Reply (ExternalCall)

The Request Reply step is a `bpmn2:serviceTask` (not callActivity). The actual adapter config is on the outbound `bpmn2:messageFlow` that connects the ServiceTask to a Receiver Participant.

```xml
<bpmn2:serviceTask id="ServiceTask_1" name="Call Backend">
    <bpmn2:extensionElements>
        <ifl:property><key>componentVersion</key><value>1.0</value></ifl:property>
        <ifl:property><key>activityType</key><value>ExternalCall</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::ExternalCall/version::1.0.4</value>
        </ifl:property>
    </bpmn2:extensionElements>
    <bpmn2:incoming>SequenceFlow_1</bpmn2:incoming>
    <bpmn2:outgoing>SequenceFlow_2</bpmn2:outgoing>
</bpmn2:serviceTask>

<!-- Adapter on messageFlow from ServiceTask to Receiver participant -->
<bpmn2:messageFlow id="MessageFlow_2" name="HTTP"
    sourceRef="ServiceTask_1" targetRef="Participant_2">
    <!-- HTTP/SOAP/OData adapter config here -->
</bpmn2:messageFlow>
```

---

### Exclusive Gateway with Routing

```xml
<!-- Gateway element (bpmn2:exclusiveGateway, NOT callActivity) -->
<bpmn2:exclusiveGateway
    id="ExclusiveGateway_1"
    name="Route by Type?"
    default="SequenceFlow_Default">
    <bpmn2:extensionElements>
        <ifl:property><key>componentVersion</key><value>1.1</value></ifl:property>
        <ifl:property><key>activityType</key><value>ExclusiveGateway</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::ExclusiveGateway/version::1.1.2</value>
        </ifl:property>
        <ifl:property><key>throwException</key><value>false</value></ifl:property>
        <!-- throwException: "true" throws error if no route matches (instead of default) -->
    </bpmn2:extensionElements>
    <bpmn2:incoming>SequenceFlow_0</bpmn2:incoming>
    <bpmn2:outgoing>SequenceFlow_A</bpmn2:outgoing>
    <bpmn2:outgoing>SequenceFlow_Default</bpmn2:outgoing>
</bpmn2:exclusiveGateway>

<!-- Conditional route — has conditionExpression -->
<bpmn2:sequenceFlow id="SequenceFlow_A" name="TypeA"
    sourceRef="ExclusiveGateway_1" targetRef="CallActivity_A">
    <bpmn2:extensionElements>
        <ifl:property><key>expressionType</key><value>NonXML</value></ifl:property>
        <!-- expressionType: "NonXML" for Simple Language, "XML" for XPath -->
        <ifl:property><key>componentVersion</key><value>1.0</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::GatewayRoute/version::1.0.0</value>
        </ifl:property>
    </bpmn2:extensionElements>
    <bpmn2:conditionExpression
        id="FormalExpression_SequenceFlow_A"
        xsi:type="bpmn2:tFormalExpression">${property.docType} = 'TypeA'</bpmn2:conditionExpression>
</bpmn2:sequenceFlow>

<!-- Default route — no conditionExpression; referenced in gateway default="" attribute -->
<bpmn2:sequenceFlow id="SequenceFlow_Default" name="Default"
    sourceRef="ExclusiveGateway_1" targetRef="CallActivity_Default">
    <bpmn2:extensionElements>
        <ifl:property><key>expressionType</key><value>XML</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.0</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::GatewayRoute/version::1.0.0</value>
        </ifl:property>
    </bpmn2:extensionElements>
</bpmn2:sequenceFlow>
```

**Expression types:**
- `NonXML` + `conditionExpression`: Camel Simple Language — `${property.x} = 'value'`, `${header.x} contains 'foo'`
- `XML` + `conditionExpression`: XPath — `//Order/@type = 'PO'`
- Default route: `expressionType=XML`, no `conditionExpression`, ID in gateway `default=""` attribute

---

### Error Event Subprocess

Placed inside the process (sibling to normal flow steps). Contains an error start event, handling logic, and an end event.

```xml
<bpmn2:subProcess id="SubProcess_1" name="Error Handling">
    <bpmn2:extensionElements>
        <ifl:property><key>componentVersion</key><value>1.1</value></ifl:property>
        <ifl:property><key>activityType</key><value>ErrorEventSubProcessTemplate</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::ErrorEventSubProcessTemplate/version::1.1.0</value>
        </ifl:property>
    </bpmn2:extensionElements>

    <!-- Error Start Event — triggered when any error occurs in parent process -->
    <bpmn2:startEvent id="ErrorStartEvent_1" name="Error Start">
        <bpmn2:outgoing>SequenceFlow_E1</bpmn2:outgoing>
        <bpmn2:errorEventDefinition>
            <bpmn2:extensionElements>
                <ifl:property>
                    <key>cmdVariantUri</key>
                    <value>ctype::FlowstepVariant/cname::ErrorStartEvent</value>
                </ifl:property>
                <ifl:property><key>activityType</key><value>StartErrorEvent</value></ifl:property>
            </bpmn2:extensionElements>
        </bpmn2:errorEventDefinition>
    </bpmn2:startEvent>

    <!-- Error handling steps (Content Modifier, Groovy, etc.) -->
    <bpmn2:callActivity id="CallActivity_EH" name="Log Error">
        <!-- Groovy or ContentModifier step to handle the error -->
        <bpmn2:incoming>SequenceFlow_E1</bpmn2:incoming>
        <bpmn2:outgoing>SequenceFlow_E2</bpmn2:outgoing>
    </bpmn2:callActivity>

    <!-- End Event -->
    <bpmn2:endEvent id="EndEvent_E1" name="End Error">
        <bpmn2:extensionElements>
            <ifl:property><key>componentVersion</key><value>1.1</value></ifl:property>
            <ifl:property>
                <key>cmdVariantUri</key>
                <value>ctype::FlowstepVariant/cname::MessageEndEvent/version::1.1.0</value>
            </ifl:property>
        </bpmn2:extensionElements>
        <bpmn2:incoming>SequenceFlow_E2</bpmn2:incoming>
        <bpmn2:messageEventDefinition/>
    </bpmn2:endEvent>

    <bpmn2:sequenceFlow id="SequenceFlow_E1" sourceRef="ErrorStartEvent_1" targetRef="CallActivity_EH"/>
    <bpmn2:sequenceFlow id="SequenceFlow_E2" sourceRef="CallActivity_EH" targetRef="EndEvent_E1"/>
</bpmn2:subProcess>
```

---

### Local Integration Process Call

Calls another process defined in the same iFlow (used to decompose complex logic).

```xml
<!-- Caller step in main process -->
<bpmn2:callActivity id="CallActivity_LP" name="Call Error Handler">
    <bpmn2:extensionElements>
        <ifl:property><key>processId</key><value>Process_2</value></ifl:property>
        <!-- processId: the id of the target bpmn2:process element -->
        <ifl:property><key>componentVersion</key><value>1.0</value></ifl:property>
        <ifl:property><key>activityType</key><value>ProcessCallElement</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::NonLoopingProcess/version::1.0.4</value>
        </ifl:property>
        <ifl:property><key>subActivityType</key><value>NonLoopingProcess</value></ifl:property>
    </bpmn2:extensionElements>
    <bpmn2:incoming>SequenceFlow_1</bpmn2:incoming>
    <bpmn2:outgoing>SequenceFlow_2</bpmn2:outgoing>
</bpmn2:callActivity>

<!-- Target local process (sibling to main process, separate participant) -->
<bpmn2:process id="Process_2" name="Error Handler Process">
    <bpmn2:extensionElements>
        <ifl:property><key>componentVersion</key><value>1.1</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowElementVariant/cname::LocalIntegrationProcess/version::1.1.3</value>
        </ifl:property>
    </bpmn2:extensionElements>
    <!-- steps inside -->
</bpmn2:process>
```

---

### Data Store — Write (Put)

```xml
<bpmn2:callActivity id="CallActivity_DS" name="Write to Data Store">
    <bpmn2:extensionElements>
        <ifl:property><key>visibility</key><value>global</value></ifl:property>
        <!-- visibility: "global" | "local" (local = iFlow-scoped) -->
        <ifl:property><key>storageName</key><value>MyDataStore</value></ifl:property>
        <ifl:property><key>messageId</key><value>${header.SAPMessageID}</value></ifl:property>
        <!-- messageId: unique key for idempotency, can be expression -->
        <ifl:property><key>encrypt</key><value>false</value></ifl:property>
        <ifl:property><key>expire</key><value>90</value></ifl:property>
        <!-- expire: days until entry expires -->
        <ifl:property><key>alert</key><value>2</value></ifl:property>
        <!-- alert: days before expiry to alert -->
        <ifl:property><key>override</key><value>false</value></ifl:property>
        <!-- override: true = overwrite if entry exists -->
        <ifl:property><key>includeMessageHeaders</key><value>false</value></ifl:property>
        <ifl:property><key>operation</key><value>put</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.7</value></ifl:property>
        <ifl:property><key>activityType</key><value>DBstorage</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::put/version::1.7.1</value>
        </ifl:property>
    </bpmn2:extensionElements>
    <bpmn2:incoming>SequenceFlow_1</bpmn2:incoming>
    <bpmn2:outgoing>SequenceFlow_2</bpmn2:outgoing>
</bpmn2:callActivity>
```

---

## BPMNDiagram Layout Rules

Every element must have a `BPMNShape` (for nodes) or `BPMNEdge` (for flows). Positions can be arbitrary but must be present:

```xml
<bpmndi:BPMNDiagram id="BPMNDiagram_1" name="Default Collaboration Diagram">
    <bpmndi:BPMNPlane bpmnElement="Collaboration_1" id="BPMNPlane_1">
        <!-- Participant / pool lane -->
        <bpmndi:BPMNShape bpmnElement="Participant_Process_1" id="BPMNShape_Participant_Process_1">
            <dc:Bounds height="200.0" width="800.0" x="100.0" y="10.0"/>
        </bpmndi:BPMNShape>
        <!-- External participants (sender/receiver) -->
        <bpmndi:BPMNShape bpmnElement="Participant_1" id="BPMNShape_Participant_1">
            <dc:Bounds height="200.0" width="100.0" x="0.0" y="10.0"/>
        </bpmndi:BPMNShape>
        <!-- Start/end events: 32x32 -->
        <bpmndi:BPMNShape bpmnElement="StartEvent_1" id="BPMNShape_StartEvent_1">
            <dc:Bounds height="32.0" width="32.0" x="150.0" y="94.0"/>
        </bpmndi:BPMNShape>
        <!-- Steps (callActivity, serviceTask): 100x60 typical -->
        <bpmndi:BPMNShape bpmnElement="CallActivity_1" id="BPMNShape_CallActivity_1">
            <dc:Bounds height="60.0" width="100.0" x="230.0" y="80.0"/>
        </bpmndi:BPMNShape>
        <!-- Gateways: 40x40 -->
        <bpmndi:BPMNShape bpmnElement="ExclusiveGateway_1" id="BPMNShape_ExclusiveGateway_1" isMarkerVisible="true">
            <dc:Bounds height="40.0" width="40.0" x="380.0" y="90.0"/>
        </bpmndi:BPMNShape>
        <!-- Sequence flows: waypoints -->
        <bpmndi:BPMNEdge bpmnElement="SequenceFlow_1" id="BPMNEdge_SequenceFlow_1"
            sourceElement="BPMNShape_StartEvent_1" targetElement="BPMNShape_CallActivity_1">
            <di:waypoint x="182.0" xsi:type="dc:Point" y="110.0"/>
            <di:waypoint x="230.0" xsi:type="dc:Point" y="110.0"/>
        </bpmndi:BPMNEdge>
        <!-- Message flows (adapter connections) -->
        <bpmndi:BPMNEdge bpmnElement="MessageFlow_1" id="BPMNEdge_MessageFlow_1"
            sourceElement="BPMNShape_Participant_1" targetElement="BPMNShape_StartEvent_1">
            <di:waypoint x="100.0" xsi:type="dc:Point" y="110.0"/>
            <di:waypoint x="150.0" xsi:type="dc:Point" y="110.0"/>
        </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>
```

---

## ID and Naming Conventions

- **Element IDs**: use descriptive names — `StartEvent_1`, `CallActivity_SetHeaders`, `ExclusiveGateway_RouteByType`
- **SequenceFlow IDs**: `SequenceFlow_1`, `SequenceFlow_2` or descriptive `SequenceFlow_ToRouter`
- **MessageFlow IDs**: `MessageFlow_Sender`, `MessageFlow_Receiver`
- **Participant IDs**: `Participant_1` (Sender), `Participant_Process_1` (IntegrationProcess), `Participant_2` (Receiver)
- **FormalExpression IDs**: `FormalExpression_SequenceFlow_A_<timestamp>` (timestamp can be any unique number)
- **Process ID**: `Process_1` (main), `Process_2` (local subprocess)
- IDs must be **unique** within the document

---

## Externalized Parameters (Environment Promotion)

Externalized parameters are the mechanism for **environment-specific configuration** — the iFlow BPMN is identical across Dev, QAS, and Prod, but each environment has different values for the parameters. This is how SAP CPI handles environment promotion: you transport the iFlow and then configure the parameter values per environment in the tenant's Integration Operations → Configure section.

**Example:** A parameter `SAPHOST` holds the target SAP system URL. On Dev it is `https://dev.example.com`, QAS `https://qas.example.com`, Prod `https://prod.example.com`. The iFlow uses `{{SAPHOST}}` and never hardcodes the URL.

**In BPMN property values:** use `{{ParameterName}}` anywhere a value would otherwise be hardcoded:
```xml
<ifl:property><key>address</key><value>{{SAPHOST}}/api/endpoint</value></ifl:property>
<ifl:property><key>credentialName</key><value>{{SAP_CREDENTIAL}}</value></ifl:property>
```

**`parameters.prop`** — defines the parameter keys and their default values (used as the baseline / Dev values when the iFlow is first deployed):
```
# parameters.prop
SAPHOST=https://dev-sap.example.com
SAP_CREDENTIAL=DevCredential
MAX_RETRIES=3
```

**`parameters.propdef`** — declares the parameters with metadata (type, description). Required so CPI knows the parameters exist and shows them in the Configure UI:
```xml
<parameters>
    <parameter>
        <key>SAPHOST</key>
        <value>https://dev-sap.example.com</value>
        <datatype>xsd:string</datatype>
        <description>Target SAP system base URL — set per environment on deployment</description>
    </parameter>
    <parameter>
        <key>SAP_CREDENTIAL</key>
        <value>DevCredential</value>
        <datatype>xsd:string</datatype>
        <description>Security Material credential alias for target SAP system</description>
    </parameter>
    <parameter>
        <key>MAX_RETRIES</key>
        <value>3</value>
        <datatype>xsd:integer</datatype>
        <description>Maximum retry attempts for outbound calls</description>
    </parameter>
</parameters>
```

**The rule: if it could ever need to change between environments without touching the iFlow code, externalize it.**

Anything a Basis/ops person might need to change on QAS or Prod without involving a developer or transport is a candidate. Examples:
- URLs and hostnames (`TARGET_URL`, `SAPHOST`)
- Port numbers (`BACKEND_PORT`)
- Credential alias names (`CRED_BACKEND`, `CRED_SFTP`)
- Queue names (`JMS_QUEUE_INBOUND`)
- Retry counts and timeout values (`MAX_RETRIES`, `CALL_TIMEOUT`)
- Debug/trace flags (`DEBUG_ENABLED=false` on Prod, `true` on Dev)
- Log levels (`LOG_LEVEL`)
- Feature flags (`ENABLE_RETRY`, `SKIP_VALIDATION`)
- Any threshold or limit that might be tuned per environment

**What NOT to externalize:**
- Values that are structurally part of the integration logic (XPath expressions, fixed field mappings)
- Values guaranteed identical in every environment forever

**Runtime variables vs externalized params:**
- `{{ParamName}}` — resolved at deploy/configure time, set in CPI Operations UI per environment
- `${property.X}` / `${header.X}` — Apache Camel Simple Language, resolved at message runtime from exchange state

---

## Camel Simple Language Quick Reference

Used in ContentModifier `expression` type and gateway conditions:

| Expression | Meaning |
|------------|---------|
| `${header.MyHeader}` | Exchange header value |
| `${property.MyProperty}` | Exchange property value |
| `${in.body}` | Message body |
| `${date:now:yyyy-MM-dd}` | Current date |
| `${exchangeId}` | Exchange ID (unique per message) |
| `${header.x} = 'value'` | Equality check (gateway condition) |
| `${header.x} != null` | Null check |
| `${header.x} contains 'foo'` | Contains check |
| `${header.x} regex '^[0-9]+'` | Regex match |

---

## Complete Minimal iFlow Example

HTTPS inbound → Content Modifier → HTTP outbound:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
    xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
    xmlns:ifl="http:///com.sap.ifl.model/Ifl.xsd"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    id="Definitions_1">
    <bpmn2:collaboration id="Collaboration_1" name="Default Collaboration">
        <bpmn2:extensionElements>
            <ifl:property><key>namespaceMapping</key><value/></ifl:property>
            <ifl:property><key>allowedHeaderList</key><value/></ifl:property>
            <ifl:property><key>httpSessionHandling</key><value>None</value></ifl:property>
            <ifl:property><key>ServerTrace</key><value>false</value></ifl:property>
            <ifl:property><key>returnExceptionToSender</key><value>true</value></ifl:property>
            <ifl:property><key>log</key><value>All events</value></ifl:property>
            <ifl:property><key>componentVersion</key><value>1.1</value></ifl:property>
            <ifl:property>
                <key>cmdVariantUri</key>
                <value>ctype::IFlowVariant/cname::IFlowConfiguration/version::1.1.16</value>
            </ifl:property>
        </bpmn2:extensionElements>
        <bpmn2:participant id="Participant_1" name="Sender"/>
        <bpmn2:participant id="Participant_Process_1" ifl:type="IntegrationProcess"
            name="Integration Process" processRef="Process_1">
            <bpmn2:extensionElements/>
        </bpmn2:participant>
        <bpmn2:participant id="Participant_2" name="Receiver"/>
        <bpmn2:messageFlow id="MessageFlow_1" name="HTTPS"
            sourceRef="Participant_1" targetRef="StartEvent_1">
            <bpmn2:extensionElements>
                <ifl:property><key>ComponentType</key><value>HTTPS</value></ifl:property>
                <ifl:property><key>ComponentNS</key><value>sap</value></ifl:property>
                <ifl:property><key>componentVersion</key><value>1.4</value></ifl:property>
                <ifl:property><key>urlPath</key><value>/http/my-service</value></ifl:property>
                <ifl:property><key>Name</key><value>HTTPS</value></ifl:property>
                <ifl:property><key>TransportProtocolVersion</key><value>1.5.0</value></ifl:property>
                <ifl:property><key>ComponentSWCVName</key><value>external</value></ifl:property>
                <ifl:property><key>system</key><value>Sender</value></ifl:property>
                <ifl:property><key>xsrfProtection</key><value>1</value></ifl:property>
                <ifl:property><key>TransportProtocol</key><value>HTTPS</value></ifl:property>
                <ifl:property>
                    <key>cmdVariantUri</key>
                    <value>ctype::AdapterVariant/cname::sap:HTTPS/tp::HTTPS/mp::None/direction::Sender/version::1.5.0</value>
                </ifl:property>
                <ifl:property><key>senderAuthType</key><value>RoleBased</value></ifl:property>
                <ifl:property><key>userRole</key><value>ESBMessaging.send</value></ifl:property>
                <ifl:property><key>MessageProtocol</key><value>None</value></ifl:property>
                <ifl:property><key>MessageProtocolVersion</key><value>1.5.0</value></ifl:property>
                <ifl:property><key>ComponentSWCVId</key><value>1.5.0</value></ifl:property>
            </bpmn2:extensionElements>
        </bpmn2:messageFlow>
        <bpmn2:messageFlow id="MessageFlow_2" name="HTTP"
            sourceRef="EndEvent_1" targetRef="Participant_2">
            <bpmn2:extensionElements>
                <ifl:property><key>ComponentType</key><value>HTTP</value></ifl:property>
                <ifl:property><key>ComponentNS</key><value>sap</value></ifl:property>
                <ifl:property><key>componentVersion</key><value>1.10</value></ifl:property>
                <ifl:property><key>address</key><value>https://target.example.com/api</value></ifl:property>
                <ifl:property><key>httpMethod</key><value>POST</value></ifl:property>
                <ifl:property><key>Name</key><value>HTTP</value></ifl:property>
                <ifl:property><key>TransportProtocolVersion</key><value>1.10.0</value></ifl:property>
                <ifl:property><key>ComponentSWCVName</key><value>external</value></ifl:property>
                <ifl:property><key>system</key><value>Receiver</value></ifl:property>
                <ifl:property><key>authType</key><value>BasicAuthentication</value></ifl:property>
                <ifl:property><key>credentialName</key><value>TargetCredential</value></ifl:property>
                <ifl:property><key>httpRequestTimeout</key><value>60000</value></ifl:property>
                <ifl:property><key>TransportProtocol</key><value>HTTP</value></ifl:property>
                <ifl:property>
                    <key>cmdVariantUri</key>
                    <value>ctype::AdapterVariant/cname::sap:HTTP/tp::HTTP/mp::None/direction::Receiver/version::1.10.0</value>
                </ifl:property>
                <ifl:property><key>MessageProtocol</key><value>None</value></ifl:property>
                <ifl:property><key>MessageProtocolVersion</key><value>1.10.0</value></ifl:property>
                <ifl:property><key>ComponentSWCVId</key><value>1.10.0</value></ifl:property>
            </bpmn2:extensionElements>
        </bpmn2:messageFlow>
    </bpmn2:collaboration>
    <bpmn2:process id="Process_1" name="Integration Process">
        <bpmn2:extensionElements>
            <ifl:property><key>transactionTimeout</key><value>30</value></ifl:property>
            <ifl:property><key>componentVersion</key><value>1.1</value></ifl:property>
            <ifl:property>
                <key>cmdVariantUri</key>
                <value>ctype::FlowElementVariant/cname::IntegrationProcess/version::1.2.1</value>
            </ifl:property>
            <ifl:property><key>transactionalHandling</key><value>Not Required</value></ifl:property>
        </bpmn2:extensionElements>
        <bpmn2:startEvent id="StartEvent_1" name="Start">
            <bpmn2:extensionElements>
                <ifl:property><key>componentVersion</key><value>1.0</value></ifl:property>
                <ifl:property>
                    <key>cmdVariantUri</key>
                    <value>ctype::FlowstepVariant/cname::MessageStartEvent</value>
                </ifl:property>
                <ifl:property><key>activityType</key><value>StartEvent</value></ifl:property>
            </bpmn2:extensionElements>
            <bpmn2:outgoing>SequenceFlow_1</bpmn2:outgoing>
            <bpmn2:messageEventDefinition/>
        </bpmn2:startEvent>
        <bpmn2:callActivity id="CallActivity_1" name="Set Routing Header">
            <bpmn2:extensionElements>
                <ifl:property><key>bodyType</key><value/></ifl:property>
                <ifl:property><key>wrapContent</key><value/></ifl:property>
                <ifl:property>
                    <key>headerTable</key>
                    <value>&lt;row&gt;&lt;cell id='Action'&gt;Create&lt;/cell&gt;&lt;cell id='Type'&gt;constant&lt;/cell&gt;&lt;cell id='Value'&gt;application/xml&lt;/cell&gt;&lt;cell id='Default'&gt;&lt;/cell&gt;&lt;cell id='Name'&gt;Content-Type&lt;/cell&gt;&lt;cell id='Datatype'&gt;java.lang.String&lt;/cell&gt;&lt;/row&gt;</value>
                </ifl:property>
                <ifl:property><key>propertyTable</key><value/></ifl:property>
                <ifl:property><key>componentVersion</key><value>1.6</value></ifl:property>
                <ifl:property><key>activityType</key><value>Enricher</value></ifl:property>
                <ifl:property>
                    <key>cmdVariantUri</key>
                    <value>ctype::FlowstepVariant/cname::Enricher/version::1.6.1</value>
                </ifl:property>
            </bpmn2:extensionElements>
            <bpmn2:incoming>SequenceFlow_1</bpmn2:incoming>
            <bpmn2:outgoing>SequenceFlow_2</bpmn2:outgoing>
        </bpmn2:callActivity>
        <bpmn2:endEvent id="EndEvent_1" name="End">
            <bpmn2:extensionElements>
                <ifl:property><key>componentVersion</key><value>1.1</value></ifl:property>
                <ifl:property>
                    <key>cmdVariantUri</key>
                    <value>ctype::FlowstepVariant/cname::MessageEndEvent/version::1.1.0</value>
                </ifl:property>
            </bpmn2:extensionElements>
            <bpmn2:incoming>SequenceFlow_2</bpmn2:incoming>
            <bpmn2:messageEventDefinition/>
        </bpmn2:endEvent>
        <bpmn2:sequenceFlow id="SequenceFlow_1" sourceRef="StartEvent_1" targetRef="CallActivity_1"/>
        <bpmn2:sequenceFlow id="SequenceFlow_2" sourceRef="CallActivity_1" targetRef="EndEvent_1"/>
    </bpmn2:process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_1" name="Default Collaboration Diagram">
        <bpmndi:BPMNPlane bpmnElement="Collaboration_1" id="BPMNPlane_1">
            <bpmndi:BPMNShape bpmnElement="Participant_1" id="BPMNShape_Participant_1">
                <dc:Bounds height="200.0" width="100.0" x="0.0" y="10.0"/>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="Participant_Process_1" id="BPMNShape_Participant_Process_1">
                <dc:Bounds height="200.0" width="600.0" x="110.0" y="10.0"/>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="Participant_2" id="BPMNShape_Participant_2">
                <dc:Bounds height="200.0" width="100.0" x="720.0" y="10.0"/>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="StartEvent_1" id="BPMNShape_StartEvent_1">
                <dc:Bounds height="32.0" width="32.0" x="160.0" y="94.0"/>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="CallActivity_1" id="BPMNShape_CallActivity_1">
                <dc:Bounds height="60.0" width="100.0" x="250.0" y="80.0"/>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape bpmnElement="EndEvent_1" id="BPMNShape_EndEvent_1">
                <dc:Bounds height="32.0" width="32.0" x="650.0" y="94.0"/>
            </bpmndi:BPMNShape>
            <bpmndi:BPMNEdge bpmnElement="SequenceFlow_1" id="BPMNEdge_SequenceFlow_1"
                sourceElement="BPMNShape_StartEvent_1" targetElement="BPMNShape_CallActivity_1">
                <di:waypoint x="192.0" xsi:type="dc:Point" y="110.0"/>
                <di:waypoint x="250.0" xsi:type="dc:Point" y="110.0"/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="SequenceFlow_2" id="BPMNEdge_SequenceFlow_2"
                sourceElement="BPMNShape_CallActivity_1" targetElement="BPMNShape_EndEvent_1">
                <di:waypoint x="350.0" xsi:type="dc:Point" y="110.0"/>
                <di:waypoint x="650.0" xsi:type="dc:Point" y="110.0"/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="MessageFlow_1" id="BPMNEdge_MessageFlow_1"
                sourceElement="BPMNShape_Participant_1" targetElement="BPMNShape_StartEvent_1">
                <di:waypoint x="100.0" xsi:type="dc:Point" y="110.0"/>
                <di:waypoint x="160.0" xsi:type="dc:Point" y="110.0"/>
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNEdge bpmnElement="MessageFlow_2" id="BPMNEdge_MessageFlow_2"
                sourceElement="BPMNShape_EndEvent_1" targetElement="BPMNShape_Participant_2">
                <di:waypoint x="682.0" xsi:type="dc:Point" y="110.0"/>
                <di:waypoint x="720.0" xsi:type="dc:Point" y="110.0"/>
            </bpmndi:BPMNEdge>
        </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
</bpmn2:definitions>
```

---

## Generation Rules

1. **Every element needs a unique ID** — use descriptive names, not just numbers
0. **External participant `ifl:type` depends on adapter type:**
   - **HTTP/HTTPS flows**: participants work without any `ifl:type` attribute.
   - **SFTP and most other channel-based adapters**: participants MUST have `ifl:type` set in two places — as an XML attribute on `<bpmn2:participant>` AND as an `<ifl:property>` inside `extensionElements`. Sender = `EndpointSender`; Receiver = `EndpointRecevier` (SAP typo — note the misspelling, use it exactly). Without these, CPI won't render the adapter channels.
   - The `name` attribute on each participant must exactly match the `system` property value in the connected messageFlow.
2. **SequenceFlows wire the process** — every step needs `<bpmn2:incoming>` and `<bpmn2:outgoing>` matching SequenceFlow IDs
3. **MessageFlows connect adapters** — sourceRef/targetRef must match participant IDs and start/end event IDs
4. **Request-Reply uses ServiceTask** — not callActivity; the receiver adapter goes on a MessageFlow from ServiceTask
5. **ExclusiveGateway is its own element type** — not a callActivity; default route ID goes in the `default=""` attribute
6. **Conditional routes need GatewayRoute cmdVariantUri** on the sequenceFlow, plus a `conditionExpression`
7. **Default route** has no conditionExpression; `expressionType=XML`
8. **Error subprocess is a sibling** to main process steps inside `bpmn2:process`, not a child of another step
9. **BPMNDiagram section is required** — must include BPMNShape for every element and BPMNEdge for every flow
10. **ContentModifier table values are XML-escaped** — `<` → `&lt;`, `>` → `&gt;` in the `<value>` element
11. **Timer start event** uses `bpmn2:timerEventDefinition` inside the `bpmn2:startEvent`
12. **Local process call** references process by `processId` property = the `id` of a sibling `bpmn2:process`
13. **ProcessDirect** adapter: sender iFlow uses ProcessDirect Receiver; calling iFlow uses ProcessDirect Sender
14. **Externalized params** use `{{ParamName}}` syntax — these are environment-specific values (Dev/QAS/Prod URLs, credential names, queue names) configured per tenant after transport; never hardcode these values in BPMN

---

## Known Gaps (verify with real examples on trial tenant)

- AS2 adapter: MDN configuration, signing/encryption property names
- OData V2 receiver: operation type, entity set, query options properties
- XI adapter: quality of service, party/service properties
- SuccessFactors adapter: not in reference corpus
- SOAP adapter: WSDL URL binding, WS-Security properties
- IDoc adapter: full sender property set (SAP system configuration)
- EDI steps: EDIFACT/ANSI X12 specific property names
