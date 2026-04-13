# SAP CPI Flow Steps — Generation Reference

This skill covers flow step XML blocks: all `bpmn2:callActivity`, `bpmn2:serviceTask`, and `bpmn2:exclusiveGateway` elements used inside an integration process.

For iFlow structure (collaboration, processes, participants, diagram) see `skill-cpi-structure.md`.
For adapter XML blocks see `skill-cpi-adapters.md`.

---

## Flow Step cmdVariantUri Reference

| Step | activityType | cmdVariantUri |
|------|-------------|--------------|
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

## Content Modifier

Sets headers, exchange properties, or replaces the message body. Element type: `bpmn2:callActivity`.

Table values are XML-escaped `<row><cell>` structures. Each row = one entry.

```xml
<bpmn2:callActivity id="CallActivity_SetHeaders" name="Set Headers">
    <bpmn2:extensionElements>
        <ifl:property><key>activityType</key><value>Enricher</value></ifl:property>
        <ifl:property><key>bodyType</key><value></value></ifl:property>
        <!-- bodyType: "" (no change) | "constant" | "expression" | "xpath" -->
        <ifl:property><key>wrapContent</key><value></value></ifl:property>
        <!-- wrapContent: the body value when bodyType is set -->
        <ifl:property>
            <key>headerTable</key>
            <!-- Each row: Action, Type, Value, Default, Name, Datatype -->
            <value>&lt;row&gt;&lt;cell id='Action'&gt;Create&lt;/cell&gt;&lt;cell id='Type'&gt;constant&lt;/cell&gt;&lt;cell id='Value'&gt;myValue&lt;/cell&gt;&lt;cell id='Default'&gt;&lt;/cell&gt;&lt;cell id='Name'&gt;MyHeader&lt;/cell&gt;&lt;cell id='Datatype'&gt;java.lang.String&lt;/cell&gt;&lt;/row&gt;</value>
        </ifl:property>
        <ifl:property>
            <key>propertyTable</key>
            <value>&lt;row&gt;&lt;cell id='Action'&gt;Create&lt;/cell&gt;&lt;cell id='Type'&gt;expression&lt;/cell&gt;&lt;cell id='Value'&gt;${header.SomeHeader}&lt;/cell&gt;&lt;cell id='Default'&gt;&lt;/cell&gt;&lt;cell id='Name'&gt;MyProperty&lt;/cell&gt;&lt;cell id='Datatype'&gt;java.lang.String&lt;/cell&gt;&lt;/row&gt;</value>
        </ifl:property>
        <ifl:property><key>componentVersion</key><value>1.6</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::Enricher/version::1.6.1</value>
        </ifl:property>
    </bpmn2:extensionElements>
    <bpmn2:incoming>SequenceFlow_1</bpmn2:incoming>
    <bpmn2:outgoing>SequenceFlow_2</bpmn2:outgoing>
</bpmn2:callActivity>
```

**Common patterns:**

Add timestamp prefix to filename (SFTP flows):
```
headerTable row: Action=Create, Type=expression, Value=${date:now:yyyyMMddHHmmss}_${header.CamelFileName}, Name=CamelFileName
```

Set constant header:
```
headerTable row: Action=Create, Type=constant, Value=application/xml, Name=Content-Type
```

Copy header to property:
```
propertyTable row: Action=Create, Type=header, Value=MyHeader, Name=MyProperty
```

**Cell `Type` values:**
- `constant` — literal string
- `expression` — Camel Simple: `${header.X}`, `${property.Y}`, `${date:now:yyyy-MM-dd}`
- `xpath` — XPath 1.0: `//Order/@id`
- `property` — reads exchange property
- `header` — reads exchange header

---

## Groovy Script

```xml
<bpmn2:callActivity id="CallActivity_Groovy" name="Process Message">
    <bpmn2:extensionElements>
        <ifl:property><key>activityType</key><value>Script</value></ifl:property>
        <ifl:property><key>subActivityType</key><value>GroovyScript</value></ifl:property>
        <ifl:property><key>script</key><value>myScript.groovy</value></ifl:property>
        <!-- script: filename in src/main/resources/script/ -->
        <ifl:property><key>scriptFunction</key><value>processData</value></ifl:property>
        <!-- scriptFunction: the Groovy method to call -->
        <ifl:property><key>scriptBundleId</key><value/></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.1</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::GroovyScript/version::1.1.2</value>
        </ifl:property>
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

    message.setHeader("MyHeader", "value")
    message.setProperty("MyProperty", "value")
    message.setBody("<root>modified</root>")

    return message
}
```

---

## XSLT Mapping

```xml
<bpmn2:callActivity id="CallActivity_XSLT" name="Transform">
    <bpmn2:extensionElements>
        <ifl:property><key>activityType</key><value>Mapping</value></ifl:property>
        <ifl:property><key>subActivityType</key><value>XSLTMapping</value></ifl:property>
        <ifl:property><key>mappingpath</key><value>src/main/resources/mapping/MyMapping.xsl</value></ifl:property>
        <ifl:property><key>mappingoutputformat</key><value>Bytes</value></ifl:property>
        <!-- mappingoutputformat: "Bytes" (default) | "String" -->
        <ifl:property><key>mappingSource</key><value>mappingSrcBody</value></ifl:property>
        <!-- mappingSource: "mappingSrcBody" | "mappingSrcHeader" -->
        <ifl:property><key>componentVersion</key><value>1.2</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::XSLTMapping/version::1.2.0</value>
        </ifl:property>
    </bpmn2:extensionElements>
    <bpmn2:incoming>SequenceFlow_1</bpmn2:incoming>
    <bpmn2:outgoing>SequenceFlow_2</bpmn2:outgoing>
</bpmn2:callActivity>
```

---

## Message Mapping

```xml
<bpmn2:callActivity id="CallActivity_MMap" name="Map Message">
    <bpmn2:extensionElements>
        <ifl:property><key>activityType</key><value>Mapping</value></ifl:property>
        <ifl:property><key>mappingType</key><value>MessageMapping</value></ifl:property>
        <ifl:property><key>mappinguri</key><value>dir://mmap/src/main/resources/mapping/MyMapping.mmap</value></ifl:property>
        <ifl:property><key>mappingname</key><value>MyMapping</value></ifl:property>
        <ifl:property><key>mappingpath</key><value>src/main/resources/mapping/MyMapping</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.3</value></ifl:property>
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

## Filter

Retains only nodes matching an XPath expression.

```xml
<bpmn2:callActivity id="CallActivity_Filter" name="Filter Items">
    <bpmn2:extensionElements>
        <ifl:property><key>activityType</key><value>Filter</value></ifl:property>
        <ifl:property><key>xpathType</key><value>Nodelist</value></ifl:property>
        <!-- xpathType: "Nodelist" (multiple nodes) | "Node" (single node) -->
        <ifl:property><key>wrapContent</key><value>//Order/Items/Item[./Type='X']</value></ifl:property>
        <!-- wrapContent: XPath expression -->
        <ifl:property><key>componentVersion</key><value>1.0</value></ifl:property>
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

## General Splitter

Splits one message into N messages, one per XPath node (or token/line).

```xml
<bpmn2:callActivity id="CallActivity_Splitter" name="Split Messages">
    <bpmn2:extensionElements>
        <ifl:property><key>activityType</key><value>Splitter</value></ifl:property>
        <ifl:property><key>splitType</key><value>GeneralSplitter</value></ifl:property>
        <ifl:property><key>exprType</key><value>XPath</value></ifl:property>
        <!-- exprType: "XPath" | "Token" | "Line" -->
        <ifl:property><key>splitExprValue</key><value>//Order/Item</value></ifl:property>
        <!-- splitExprValue: XPath to each split element -->
        <ifl:property><key>ParallelProcessing</key><value>false</value></ifl:property>
        <ifl:property><key>Streaming</key><value>false</value></ifl:property>
        <ifl:property><key>StopOnExecution</key><value>true</value></ifl:property>
        <ifl:property><key>SplitterThreads</key><value>10</value></ifl:property>
        <ifl:property><key>grouping</key><value/></ifl:property>
        <ifl:property><key>timeOut</key><value>300</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.5</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::GeneralSplitter/version::1.5.1</value>
        </ifl:property>
    </bpmn2:extensionElements>
    <bpmn2:incoming>SequenceFlow_1</bpmn2:incoming>
    <bpmn2:outgoing>SequenceFlow_2</bpmn2:outgoing>
</bpmn2:callActivity>
```

---

## Aggregator

Collects split messages back into one. Typically placed after a Splitter + processing steps.

```xml
<bpmn2:callActivity id="CallActivity_Aggregator" name="Aggregate">
    <bpmn2:extensionElements>
        <ifl:property><key>activityType</key><value>Aggregator</value></ifl:property>
        <ifl:property><key>incomingFormat</key><value>XML_SAME_FORMAT</value></ifl:property>
        <!-- incomingFormat: "XML_SAME_FORMAT" | "XML_MIXED_FORMAT" | "Plain_Text" -->
        <ifl:property><key>aggregationAlgorithm</key><value>sap-id-list</value></ifl:property>
        <!-- aggregationAlgorithm: "sap-id-list" | "sap-sequenced-id-list" -->
        <ifl:property><key>correlationExpression</key><value>//@OrderID</value></ifl:property>
        <!-- correlationExpression: XPath to group messages -->
        <ifl:property><key>lastMessageCondition</key><value>false</value></ifl:property>
        <ifl:property><key>messageSequenceExpression</key><value/></ifl:property>
        <ifl:property><key>datastoreName</key><value>MyAggregator</value></ifl:property>
        <ifl:property><key>timeout</key><value>2</value></ifl:property>
        <!-- timeout: minutes -->
        <ifl:property><key>componentVersion</key><value>1.0</value></ifl:property>
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

## Request Reply (ExternalCall)

Used for synchronous outbound calls mid-flow. Uses `bpmn2:serviceTask` (not callActivity). The adapter config goes on the `bpmn2:messageFlow` from the ServiceTask to a Receiver participant.

```xml
<!-- ServiceTask in the process -->
<bpmn2:serviceTask id="ServiceTask_CallBackend" name="Call Backend">
    <bpmn2:extensionElements>
        <ifl:property><key>activityType</key><value>ExternalCall</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.0</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::ExternalCall/version::1.0.4</value>
        </ifl:property>
    </bpmn2:extensionElements>
    <bpmn2:incoming>SequenceFlow_1</bpmn2:incoming>
    <bpmn2:outgoing>SequenceFlow_2</bpmn2:outgoing>
</bpmn2:serviceTask>

<!-- Adapter on messageFlow from ServiceTask to Receiver participant (in collaboration) -->
<bpmn2:messageFlow id="MessageFlow_Backend" name="HTTP"
    sourceRef="ServiceTask_CallBackend" targetRef="Participant_Backend">
    <!-- HTTP / SOAP / OData adapter properties here — see skill-cpi-adapters.md -->
</bpmn2:messageFlow>
```

---

## Exclusive Gateway with Routing

Gateway element is `bpmn2:exclusiveGateway` (NOT callActivity).

```xml
<!-- Gateway -->
<bpmn2:exclusiveGateway
    id="ExclusiveGateway_RouteByType"
    name="Route by Type?"
    default="SequenceFlow_Default">
    <bpmn2:extensionElements>
        <ifl:property><key>activityType</key><value>ExclusiveGateway</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.1</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::ExclusiveGateway/version::1.1.2</value>
        </ifl:property>
        <ifl:property><key>throwException</key><value>false</value></ifl:property>
        <!-- throwException: "true" throws error if no route matches -->
    </bpmn2:extensionElements>
    <bpmn2:incoming>SequenceFlow_0</bpmn2:incoming>
    <bpmn2:outgoing>SequenceFlow_A</bpmn2:outgoing>
    <bpmn2:outgoing>SequenceFlow_Default</bpmn2:outgoing>
</bpmn2:exclusiveGateway>

<!-- Conditional route — Simple Language -->
<bpmn2:sequenceFlow id="SequenceFlow_A" name="TypeA"
    sourceRef="ExclusiveGateway_RouteByType" targetRef="CallActivity_A">
    <bpmn2:extensionElements>
        <ifl:property><key>expressionType</key><value>NonXML</value></ifl:property>
        <!-- expressionType: "NonXML" (Camel Simple) | "XML" (XPath) -->
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

<!-- Default route — no conditionExpression; ID in gateway default="" attribute -->
<bpmn2:sequenceFlow id="SequenceFlow_Default" name="Default"
    sourceRef="ExclusiveGateway_RouteByType" targetRef="CallActivity_Default">
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

**Condition expression types:**
- `NonXML` + conditionExpression: Camel Simple — `${property.x} = 'value'`, `${header.x} contains 'foo'`
- `XML` + conditionExpression: XPath — `//Order/@type = 'PO'`
- Default route: `expressionType=XML`, no conditionExpression, ID referenced in gateway `default=""` attribute

---

## Data Store — Write (Put)

```xml
<bpmn2:callActivity id="CallActivity_DSWrite" name="Write to Data Store">
    <bpmn2:extensionElements>
        <ifl:property><key>activityType</key><value>DBstorage</value></ifl:property>
        <ifl:property><key>operation</key><value>put</value></ifl:property>
        <ifl:property><key>storageName</key><value>MyDataStore</value></ifl:property>
        <ifl:property><key>messageId</key><value>${header.SAPMessageID}</value></ifl:property>
        <!-- messageId: unique key — can be expression -->
        <ifl:property><key>visibility</key><value>global</value></ifl:property>
        <!-- visibility: "global" | "local" (local = iFlow-scoped) -->
        <ifl:property><key>encrypt</key><value>false</value></ifl:property>
        <ifl:property><key>expire</key><value>90</value></ifl:property>
        <!-- expire: days -->
        <ifl:property><key>alert</key><value>2</value></ifl:property>
        <ifl:property><key>override</key><value>false</value></ifl:property>
        <ifl:property><key>includeMessageHeaders</key><value>false</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.7</value></ifl:property>
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

## Known Gaps

- Looping Process Call (LoopingProcess): exact property set not verified
- Multicast / Sequential Multicast: property set not documented
- Poll Enrich: property set not documented
- Variables step: property set not documented
- Splitter: Token and Line split types not tested
- Aggregator: lastMessageCondition XPath pattern not verified
