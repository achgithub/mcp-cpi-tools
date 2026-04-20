---
name: cpi-adapters
description: Generate or reference adapter XML blocks for SAP CPI iFlow messageFlow elements — HTTPS sender, HTTP receiver, JMS sender/receiver, SFTP sender/receiver, SOAP, IDoc, XI, OData, AS2, ProcessDirect, and adapter cmdVariantUri reference table. Use when configuring adapter connections in an iFlow.
disable-model-invocation: true
---

# SAP CPI Adapters — Generation Reference

This skill covers adapter XML blocks for use in iFlow messageFlow elements.

For iFlow structure (collaboration, processes, participants, diagram) see `skill-cpi-structure.md`.
For flow step XML blocks see `skill-cpi-steps.md`.

---

## How Adapters Fit in the BPMN

Adapters live on `bpmn2:messageFlow` elements inside the `bpmn2:collaboration`.

- **Sender adapter**: `sourceRef="Participant_Sender"` → `targetRef="StartEvent_1"`
- **Receiver adapter (fire-and-forget)**: `sourceRef="EndEvent_1"` → `targetRef="Participant_Receiver"`
- **Receiver adapter (Request-Reply)**: `sourceRef="ServiceTask_1"` → `targetRef="Participant_Receiver"`

---

## Adapter cmdVariantUri Reference

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
| SFTP | Sender (poll, user/password) | `ctype::AdapterVariant/cname::sap:SFTP/tp::SFTP/mp::File/direction::Sender/version::1.20.1` |
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

---

## HTTPS Sender

Participant requires no `ifl:type`. The `system` value must match the participant `name`.

```xml
<bpmn2:messageFlow id="MessageFlow_Sender" name="HTTPS"
    sourceRef="Participant_Sender" targetRef="StartEvent_1">
    <bpmn2:extensionElements>
        <ifl:property><key>ComponentType</key><value>HTTPS</value></ifl:property>
        <ifl:property><key>ComponentNS</key><value>sap</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.4</value></ifl:property>
        <ifl:property><key>Name</key><value>HTTPS</value></ifl:property>
        <ifl:property><key>system</key><value>Sender</value></ifl:property>
        <ifl:property><key>Description</key><value/></ifl:property>
        <ifl:property><key>urlPath</key><value>/http/my-endpoint</value></ifl:property>
        <ifl:property><key>senderAuthType</key><value>RoleBased</value></ifl:property>
        <!-- senderAuthType: "RoleBased" | "ClientCertificate" | "None" -->
        <ifl:property><key>userRole</key><value>ESBMessaging.send</value></ifl:property>
        <ifl:property><key>xsrfProtection</key><value>1</value></ifl:property>
        <ifl:property><key>maximumBodySize</key><value>40</value></ifl:property>
        <ifl:property><key>TransportProtocol</key><value>HTTPS</value></ifl:property>
        <ifl:property><key>MessageProtocol</key><value>None</value></ifl:property>
        <ifl:property><key>TransportProtocolVersion</key><value>1.5.0</value></ifl:property>
        <ifl:property><key>MessageProtocolVersion</key><value>1.5.0</value></ifl:property>
        <ifl:property><key>ComponentSWCVName</key><value>external</value></ifl:property>
        <ifl:property><key>ComponentSWCVId</key><value>1.5.0</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::AdapterVariant/cname::sap:HTTPS/tp::HTTPS/mp::None/direction::Sender/version::1.5.0</value>
        </ifl:property>
    </bpmn2:extensionElements>
</bpmn2:messageFlow>
```

---

## HTTP Receiver

```xml
<bpmn2:messageFlow id="MessageFlow_Receiver" name="HTTP"
    sourceRef="EndEvent_1" targetRef="Participant_Receiver">
    <bpmn2:extensionElements>
        <ifl:property><key>ComponentType</key><value>HTTP</value></ifl:property>
        <ifl:property><key>ComponentNS</key><value>sap</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.10</value></ifl:property>
        <ifl:property><key>Name</key><value>HTTP</value></ifl:property>
        <ifl:property><key>system</key><value>Receiver</value></ifl:property>
        <ifl:property><key>Description</key><value/></ifl:property>
        <ifl:property><key>address</key><value>ZZURL</value></ifl:property>
        <ifl:property><key>httpMethod</key><value>POST</value></ifl:property>
        <!-- httpMethod: POST | GET | PUT | DELETE | PATCH -->
        <ifl:property><key>authType</key><value>BasicAuthentication</value></ifl:property>
        <!-- authType: "BasicAuthentication" | "OAuth2ClientCredentials" | "ClientCertificate" | "None" -->
        <ifl:property><key>credentialName</key><value>ZZCREDENTIALNAME</value></ifl:property>
        <ifl:property><key>httpRequestTimeout</key><value>60000</value></ifl:property>
        <ifl:property><key>TransportProtocol</key><value>HTTP</value></ifl:property>
        <ifl:property><key>MessageProtocol</key><value>None</value></ifl:property>
        <ifl:property><key>TransportProtocolVersion</key><value>1.10.0</value></ifl:property>
        <ifl:property><key>MessageProtocolVersion</key><value>1.10.0</value></ifl:property>
        <ifl:property><key>ComponentSWCVName</key><value>external</value></ifl:property>
        <ifl:property><key>ComponentSWCVId</key><value>1.10.0</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::AdapterVariant/cname::sap:HTTP/tp::HTTP/mp::None/direction::Receiver/version::1.10.0</value>
        </ifl:property>
    </bpmn2:extensionElements>
</bpmn2:messageFlow>
```

---

## JMS Sender (poll from queue)

Participant requires `ifl:type="EndpointSender"`.

```xml
<bpmn2:messageFlow id="MessageFlow_Sender" name="JMS"
    sourceRef="Participant_Sender" targetRef="StartEvent_1">
    <bpmn2:extensionElements>
        <ifl:property><key>ComponentType</key><value>JMS</value></ifl:property>
        <ifl:property><key>ComponentNS</key><value>sap</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.4</value></ifl:property>
        <ifl:property><key>Name</key><value>JMS</value></ifl:property>
        <ifl:property><key>system</key><value>Sender1</value></ifl:property>
        <ifl:property><key>QueueName</key><value>ZZQUEUENAME</value></ifl:property>
        <ifl:property><key>NumberOfConcurrentProcesses</key><value>1</value></ifl:property>
        <ifl:property><key>RetryInterval</key><value>0</value></ifl:property>
        <ifl:property><key>MaxRetryInterval</key><value>60</value></ifl:property>
        <ifl:property><key>ExponentialBackoff</key><value>false</value></ifl:property>
        <ifl:property><key>DeadLetterQueue</key><value/></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::AdapterVariant/cname::sap:JMS/tp::Not Applicable/mp::Not Applicable/direction::Sender/version::1.4.3</value>
        </ifl:property>
        <ifl:property><key>TransportProtocol</key><value>Not Applicable</value></ifl:property>
        <ifl:property><key>MessageProtocol</key><value>Not Applicable</value></ifl:property>
        <ifl:property><key>TransportProtocolVersion</key><value>1.4.3</value></ifl:property>
        <ifl:property><key>MessageProtocolVersion</key><value>1.4.3</value></ifl:property>
        <ifl:property><key>ComponentSWCVId</key><value>1.4.3</value></ifl:property>
    </bpmn2:extensionElements>
</bpmn2:messageFlow>
```

---

## JMS Receiver (write to queue)

```xml
<bpmn2:messageFlow id="MessageFlow_Receiver" name="JMS"
    sourceRef="EndEvent_1" targetRef="Participant_Receiver">
    <bpmn2:extensionElements>
        <ifl:property><key>ComponentType</key><value>JMS</value></ifl:property>
        <ifl:property><key>ComponentNS</key><value>sap</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.6</value></ifl:property>
        <ifl:property><key>Name</key><value>JMS</value></ifl:property>
        <ifl:property><key>system</key><value>Receiver</value></ifl:property>
        <ifl:property><key>QueueName_outbound</key><value>ZZQUEUENAME</value></ifl:property>
        <ifl:property><key>UseMessageCompression</key><value>false</value></ifl:property>
        <ifl:property><key>EncryptMessage</key><value>false</value></ifl:property>
        <ifl:property><key>RetentionThresholdAlerting</key><value>2</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::AdapterVariant/cname::sap:JMS/tp::Not Applicable/mp::Not Applicable/direction::Receiver/version::1.6.3</value>
        </ifl:property>
        <ifl:property><key>TransportProtocol</key><value>Not Applicable</value></ifl:property>
        <ifl:property><key>MessageProtocol</key><value>Not Applicable</value></ifl:property>
        <ifl:property><key>TransportProtocolVersion</key><value>1.6.3</value></ifl:property>
        <ifl:property><key>MessageProtocolVersion</key><value>1.6.3</value></ifl:property>
        <ifl:property><key>ComponentSWCVId</key><value>1.6.3</value></ifl:property>
    </bpmn2:extensionElements>
</bpmn2:messageFlow>
```

---

## SFTP Sender (poll files — user/password auth)

**Participant:** requires `ifl:type="EndpointSender"` as both XML attribute and `ifl:property`. Add `enableBasicAuthentication=false`.

**Dummy values:** Use `ZZ`-prefixed placeholders. Do NOT use `{{ParamName}}` — causes save errors.

**`allowedHeaderList`:** For SFTP-to-SFTP flows, add `CamelFileName` to the collaboration-level `allowedHeaderList`.

**`scheduleKey` is mandatory** — without it the iFlow has no polling schedule. Always include the full block below. Developer adjusts timezone/interval after import.

```xml
<!-- Participant in collaboration -->
<bpmn2:participant id="Participant_Sender" ifl:type="EndpointSender" name="Sender1">
    <bpmn2:extensionElements>
        <ifl:property><key>enableBasicAuthentication</key><value>false</value></ifl:property>
        <ifl:property><key>ifl:type</key><value>EndpointSender</value></ifl:property>
    </bpmn2:extensionElements>
</bpmn2:participant>

<!-- MessageFlow -->
<bpmn2:messageFlow id="MessageFlow_Sender" name="SFTP"
    sourceRef="Participant_Sender" targetRef="StartEvent_1">
    <bpmn2:extensionElements>
        <ifl:property><key>ComponentType</key><value>SFTP</value></ifl:property>
        <ifl:property><key>ComponentNS</key><value>sap</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.20</value></ifl:property>
        <ifl:property><key>Name</key><value>SFTP</value></ifl:property>
        <ifl:property><key>system</key><value>Sender1</value></ifl:property>
        <ifl:property><key>direction</key><value>Sender</value></ifl:property>
        <ifl:property><key>Description</key><value/></ifl:property>
        <!-- Connection -->
        <ifl:property><key>host</key><value>ZZHOST</value></ifl:property>
        <ifl:property><key>authentication</key><value>user_password</value></ifl:property>
        <!-- authentication: "user_password" | "public_key" -->
        <ifl:property><key>credential_name</key><value>ZZCREDENTIALNAME</value></ifl:property>
        <!-- NOTE: property name is credential_name (underscore), NOT credentialName -->
        <ifl:property><key>username</key><value/></ifl:property>
        <ifl:property><key>privateKeyAlias</key><value/></ifl:property>
        <ifl:property><key>connectTimeout</key><value>10000</value></ifl:property>
        <ifl:property><key>maximumReconnectAttempts</key><value>3</value></ifl:property>
        <ifl:property><key>reconnectDelay</key><value>1000</value></ifl:property>
        <!-- File selection -->
        <ifl:property><key>path</key><value>ZZDIRECTORY</value></ifl:property>
        <!-- NOTE: property name is "path", NOT "directoryName" -->
        <ifl:property><key>fileName</key><value>*</value></ifl:property>
        <ifl:property><key>regex_filter</key><value>0</value></ifl:property>
        <ifl:property><key>recursive</key><value>0</value></ifl:property>
        <ifl:property><key>stepwise</key><value>0</value></ifl:property>
        <ifl:property><key>flatten</key><value/></ifl:property>
        <!-- Post-processing -->
        <ifl:property><key>noop</key><value>delete</value></ifl:property>
        <!-- noop: "delete" (remove after poll) | "move" (archive to file.move path) -->
        <ifl:property><key>file.move</key><value>.archive</value></ifl:property>
        <ifl:property><key>doneFileName</key><value>${file:name}.done</value></ifl:property>
        <!-- Polling schedule — MANDATORY, every 1 hour HST. Developer adjusts after import. -->
        <ifl:property>
            <key>scheduleKey</key>
            <value>&lt;row&gt;&lt;cell&gt;dayValue&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;monthValue&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;yearValue&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;dateType&lt;/cell&gt;&lt;cell&gt;DAILY&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;secondValue&lt;/cell&gt;&lt;cell&gt;0&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;minutesValue&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;hourValue&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;toInterval&lt;/cell&gt;&lt;cell&gt;1&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;fromInterval&lt;/cell&gt;&lt;cell&gt;0&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;OnEveryHour&lt;/cell&gt;&lt;cell&gt;1&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;timeType&lt;/cell&gt;&lt;cell&gt;TIME_HOUR_INTERVAL&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;timeZone&lt;/cell&gt;&lt;cell&gt;( UTC -10:00 ) Hawaii Standard Time(HST)&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;throwExceptionOnExpiry&lt;/cell&gt;&lt;cell&gt;true&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;second&lt;/cell&gt;&lt;cell&gt;*&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;minute&lt;/cell&gt;&lt;cell&gt;*&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;hour&lt;/cell&gt;&lt;cell&gt;*&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;day_of_month&lt;/cell&gt;&lt;cell&gt;?&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;month&lt;/cell&gt;&lt;cell&gt;*&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;dayOfWeek&lt;/cell&gt;&lt;cell&gt;*&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;year&lt;/cell&gt;&lt;cell&gt;*&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;startAt&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;endAt&lt;/cell&gt;&lt;cell&gt;&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;attributeBehaviour&lt;/cell&gt;&lt;cell&gt;isScheduleOnDayRequired,isScheduleRecurRequired,isScheduleAdvancedVisible&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;triggerType&lt;/cell&gt;&lt;cell&gt;cron&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;noOfSchedules&lt;/cell&gt;&lt;cell&gt;1&lt;/cell&gt;&lt;/row&gt;&lt;row&gt;&lt;cell&gt;schedule1&lt;/cell&gt;&lt;cell&gt;0+0+0+?+*+*+*&amp;amp;trigger.timeZone=HST&lt;/cell&gt;&lt;/row&gt;</value>
        </ifl:property>
        <!-- Concurrency and limits -->
        <ifl:property><key>maxMessagesPerPoll</key><value>20</value></ifl:property>
        <ifl:property><key>maximumFileSize</key><value>40</value></ifl:property>
        <ifl:property><key>disconnect</key><value>1</value></ifl:property>
        <ifl:property><key>readLock</key><value>none</value></ifl:property>
        <ifl:property><key>readLockCheckInterval</key><value>5000</value></ifl:property>
        <ifl:property><key>file_lock_timeout</key><value>15</value></ifl:property>
        <ifl:property><key>idempotentRepository</key><value>database</value></ifl:property>
        <ifl:property><key>emptyFileHandling</key><value>processFile</value></ifl:property>
        <ifl:property><key>stopOnException</key><value>1</value></ifl:property>
        <ifl:property><key>useClusterLock</key><value>0</value></ifl:property>
        <ifl:property><key>fastExistsCheck</key><value>1</value></ifl:property>
        <ifl:property><key>file_sorting_criteria</key><value>sort_by_none</value></ifl:property>
        <ifl:property><key>file_sorting_direction</key><value>sort_direction_asc</value></ifl:property>
        <ifl:property><key>allowDeprecatedAlgorithms</key><value>0</value></ifl:property>
        <ifl:property><key>location_id</key><value/></ifl:property>
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
- `host`: use `ZZHOST`
- `path`: property name is `path` (NOT `directoryName`)
- `credential_name`: uses underscore (NOT `credentialName`)
- `noop`: `delete` removes file after processing; `move` archives to `file.move` path
- `scheduleKey`: always include — omitting means no polling schedule

---

## SFTP Receiver (write file — public key auth)

**Participant:** requires `ifl:type="EndpointRecevier"` (SAP typo — use the misspelling).

```xml
<!-- Participant in collaboration -->
<bpmn2:participant id="Participant_Receiver" ifl:type="EndpointRecevier" name="Receiver1">
    <bpmn2:extensionElements>
        <ifl:property><key>ifl:type</key><value>EndpointRecevier</value></ifl:property>
    </bpmn2:extensionElements>
</bpmn2:participant>

<!-- MessageFlow -->
<bpmn2:messageFlow id="MessageFlow_Receiver" name="SFTP"
    sourceRef="EndEvent_1" targetRef="Participant_Receiver">
    <bpmn2:extensionElements>
        <ifl:property><key>ComponentType</key><value>SFTP</value></ifl:property>
        <ifl:property><key>ComponentNS</key><value>sap</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.13</value></ifl:property>
        <ifl:property><key>Name</key><value>SFTP</value></ifl:property>
        <ifl:property><key>system</key><value>Receiver1</value></ifl:property>
        <ifl:property><key>direction</key><value>Receiver</value></ifl:property>
        <ifl:property><key>Description</key><value/></ifl:property>
        <!-- Connection -->
        <ifl:property><key>host</key><value>ZZHOST</value></ifl:property>
        <ifl:property><key>authentication</key><value>public_key</value></ifl:property>
        <!-- authentication: "public_key" | "user_password" -->
        <ifl:property><key>privateKeyAlias</key><value>ZZPRIVATEKEYALIAS</value></ifl:property>
        <ifl:property><key>username</key><value>ZZUSERNAME</value></ifl:property>
        <ifl:property><key>credential_name</key><value/></ifl:property>
        <!-- credential_name: empty for public_key; set for user_password -->
        <ifl:property><key>connectTimeout</key><value>10000</value></ifl:property>
        <ifl:property><key>maximumReconnectAttempts</key><value>3</value></ifl:property>
        <ifl:property><key>reconnectDelay</key><value>1000</value></ifl:property>
        <!-- File target -->
        <ifl:property><key>path</key><value>ZZDIRECTORY</value></ifl:property>
        <ifl:property><key>fileName</key><value>${header.CamelFileName}</value></ifl:property>
        <!-- fileName: ${header.CamelFileName} preserves the filename set earlier in the flow -->
        <ifl:property><key>fileExist</key><value>Override</value></ifl:property>
        <!-- fileExist: "Override" | "Append" | "Fail" | "Ignore" -->
        <ifl:property><key>autoCreate</key><value>1</value></ifl:property>
        <ifl:property><key>stepwise</key><value>1</value></ifl:property>
        <ifl:property><key>flatten</key><value/></ifl:property>
        <ifl:property><key>useTempFile</key><value>0</value></ifl:property>
        <ifl:property><key>tempFileName</key><value>${file:name}.tmp</value></ifl:property>
        <ifl:property><key>fileAppendTimeStamp</key><value>0</value></ifl:property>
        <ifl:property><key>sftpSecEnabled</key><value>1</value></ifl:property>
        <ifl:property><key>disconnect</key><value>1</value></ifl:property>
        <ifl:property><key>maximumFileSize</key><value>40</value></ifl:property>
        <ifl:property><key>fastExistsCheck</key><value>1</value></ifl:property>
        <ifl:property><key>allowDeprecatedAlgorithms</key><value>0</value></ifl:property>
        <ifl:property><key>location_id</key><value/></ifl:property>
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
- `privateKeyAlias`: SSH key alias in Security Material — use `ZZPRIVATEKEYALIAS`
- `username`: SFTP login name — use `ZZUSERNAME`
- `fileName`: `${header.CamelFileName}` writes with the filename propagated through the flow
- `autoCreate`: `1` = create target directory if missing

---

## OData V2 Receiver (Request-Reply)

Used inside a `bpmn2:serviceTask` (ExternalCall) pattern. The adapter config lives entirely on the `bpmn2:messageFlow` — the serviceTask itself carries no adapter properties.

**Participant:** MUST use `ifl:type="EndpointRecevier"` (SAP typo — use the misspelling). Without this, CPI's API will silently strip the participant and its messageFlow from the iFlow on save.

**cmdVariantUri:** `ctype::AdapterVariant/cname::sap:HCIOData/tp::HTTP/mp::OData V2/direction::Receiver/version::1.24.0`
(Use `1.25.0` for API_PRODUCT_SRV)

### Operation types
| operation value | HTTP verb | Use case |
|----------------|-----------|----------|
| `Query(GET)` | GET | Read a collection with $filter/$select/$expand |
| `Read(GET)` | GET | Read a single entity by key |
| `Create(POST)` | POST | Create a new entity (deep insert supported) |
| `Patch(PATCH)` | PATCH | Update specific fields on an entity |

### Query(GET) example — read collection with filter and pagination

```xml
<!-- ServiceTask in process -->
<bpmn2:serviceTask id="ServiceTask_ODataQuery" name="Get Orders from S/4HANA">
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

<!-- MessageFlow from ServiceTask to Receiver participant -->
<bpmn2:messageFlow id="MessageFlow_OData" name="OData"
    sourceRef="ServiceTask_ODataQuery" targetRef="Participant_S4HANA">
    <bpmn2:extensionElements>
        <ifl:property><key>ComponentType</key><value>HCIOData</value></ifl:property>
        <ifl:property><key>ComponentNS</key><value>sap</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.24</value></ifl:property>
        <ifl:property><key>Name</key><value>OData</value></ifl:property>
        <ifl:property><key>system</key><value>S4HANA</value></ifl:property>
        <!-- system: must match participant name exactly -->
        <ifl:property><key>Description</key><value/></ifl:property>
        <ifl:property><key>address</key><value>ZZBASEURL/sap/opu/odata/sap/API_SALES_ORDER_SRV</value></ifl:property>
        <!-- address: base URL + OData service path. Use ZZBASEURL as placeholder -->
        <ifl:property><key>operation</key><value>Query(GET)</value></ifl:property>
        <!-- operation: Query(GET) | Read(GET) | Create(POST) | Patch(PATCH) -->
        <ifl:property><key>resourcePath</key><value>A_SalesOrder</value></ifl:property>
        <!-- resourcePath: entity set name, or entity set with key for Read/Patch:
             e.g. A_SalesOrder(SalesOrder='${property.orderId}') -->
        <ifl:property><key>queryOptions</key><value>$select=SalesOrder,SoldToParty,CreationDate</value></ifl:property>
        <!-- queryOptions: static $select/$expand. Use customQueryOptions for dynamic $filter -->
        <ifl:property><key>customQueryOptions</key><value>${property.customQueryOptions}</value></ifl:property>
        <!-- customQueryOptions: dynamic filter expression built by preceding Groovy script.
             e.g. $filter=SalesOrder eq '${property.orderId}'
             Set to empty string if not needed -->
        <ifl:property><key>fields</key><value/></ifl:property>
        <!-- fields: response field list for Create/Patch. Leave empty for Query/Read -->
        <ifl:property><key>pagination</key><value>1</value></ifl:property>
        <!-- pagination: 1=enabled (server-side paging), 0=disabled -->
        <ifl:property><key>odatapagesize</key><value>1000</value></ifl:property>
        <!-- odatapagesize: only meaningful when pagination=1. Typical: 1000, 250 -->
        <ifl:property><key>authenticationMethod</key><value>Basic</value></ifl:property>
        <!-- authenticationMethod: auth type enum — "Basic" | "OAuth2ClientCredentials" | "ClientCertificate" | "None"
             IMPORTANT: this is the auth TYPE, NOT the credential name. Credential name goes in alias below. -->
        <ifl:property><key>alias</key><value>ZZCREDENTIALNAME</value></ifl:property>
        <!-- alias: credential alias from Security Material (for BasicAuthentication and OAuth2) -->
        <ifl:property><key>isCSRFEnabled</key><value>false</value></ifl:property>
        <!-- isCSRFEnabled: false for reads. Set true ONLY on dedicated token-fetch call before writes -->
        <ifl:property><key>contentType</key><value>application/atom+xml</value></ifl:property>
        <!-- contentType: application/atom+xml (default XML OData) | application/json (for JSON payloads) -->
        <ifl:property><key>enableBatchProcessing</key><value>0</value></ifl:property>
        <ifl:property><key>characterEncoding</key><value>none</value></ifl:property>
        <ifl:property><key>enableMPLAttachments</key><value>true</value></ifl:property>
        <ifl:property><key>receiveTimeOut</key><value>60</value></ifl:property>
        <!-- receiveTimeOut: timeout in seconds (integer, not string). Default 60. -->
        <!-- proxyType: omit this property — CPI defaults to Internet (direct). Only add if using Cloud Connector: <ifl:property><key>proxyType</key><value>sapcc</value></ifl:property> -->
        <ifl:property><key>proxyHost</key><value/></ifl:property>
        <ifl:property><key>proxyPort</key><value/></ifl:property>
        <ifl:property><key>scc_location_id</key><value/></ifl:property>
        <!-- scc_location_id: Cloud Connector location ID — empty if not using On-Premise -->
        <ifl:property><key>metadataAllowedHeaders</key><value/></ifl:property>
        <!-- metadataAllowedHeaders: set to x-sap-security-session for write calls after CSRF fetch -->
        <ifl:property><key>metadataAllowedURIParams</key><value/></ifl:property>
        <ifl:property><key>whitelistRequestHeaders</key><value/></ifl:property>
        <!-- whitelistRequestHeaders: set to x-sap-security-session for write calls after CSRF fetch -->
        <ifl:property><key>whitelistResponseHeaders</key><value/></ifl:property>
        <ifl:property><key>odataCertAuthPrivateKeyAlias</key><value/></ifl:property>
        <ifl:property><key>enableTLSSessionReuse</key><value>false</value></ifl:property>
        <ifl:property><key>edmxFilePath</key><value/></ifl:property>
        <!-- edmxFilePath: path to bundled .edmx file if using local metadata. Usually empty -->
        <ifl:property><key>TransportProtocol</key><value>HTTP</value></ifl:property>
        <ifl:property><key>MessageProtocol</key><value>OData V2</value></ifl:property>
        <ifl:property><key>TransportProtocolVersion</key><value>1.24.0</value></ifl:property>
        <ifl:property><key>MessageProtocolVersion</key><value>1.24.0</value></ifl:property>
        <ifl:property><key>ComponentSWCVName</key><value>external</value></ifl:property>
        <ifl:property><key>ComponentSWCVId</key><value>1.24.0</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::AdapterVariant/cname::sap:HCIOData/tp::HTTP/mp::OData V2/direction::Receiver/version::1.24.0</value>
        </ifl:property>
    </bpmn2:extensionElements>
</bpmn2:messageFlow>
```

### Key property variations by operation

| Property | Query(GET) | Read(GET) | Create(POST) | Patch(PATCH) |
|----------|-----------|-----------|-------------|-------------|
| `resourcePath` | Entity set: `A_SalesOrder` | Entity+key: `A_SalesOrder(SalesOrder='${property.id}')` | Entity set: `A_SalesOrder` | Entity+key: `A_SalesOrder(SalesOrder='${property.id}')` |
| `queryOptions` | `$select=...` | `$select=...$expand=...` | empty | empty |
| `customQueryOptions` | `${property.customQueryOptions}` (dynamic $filter) | empty | empty | empty |
| `fields` | empty | empty | response field list | response field list |
| `pagination` | `1` (if many records) | `0` | `0` | `0` |
| `isCSRFEnabled` | `false` | `false` | **`true`** (or via separate token fetch) | **`true`** (or via separate token fetch) |
| `contentType` | `application/atom+xml` | `application/atom+xml` | `application/atom+xml` | `application/atom+xml` or `application/json` |

### CSRF token pattern for multi-step writes

When doing sequential Create/Patch operations, use a dedicated "token fetch" call first:

```xml
<!-- Step 1: Token fetch (dummy read to acquire CSRF token + session) -->
<ifl:property><key>operation</key><value>Query(GET)</value></ifl:property>
<ifl:property><key>resourcePath</key><value>A_SalesOrder</value></ifl:property>
<ifl:property><key>queryOptions</key><value>$top=1</value></ifl:property>
<ifl:property><key>isCSRFEnabled</key><value>true</value></ifl:property>  <!-- hardcoded true -->
<ifl:property><key>pagination</key><value>0</value></ifl:property>

<!-- Step 2+: Write operations — propagate session via headers -->
<ifl:property><key>isCSRFEnabled</key><value>true</value></ifl:property>
<ifl:property><key>metadataAllowedHeaders</key><value>x-sap-security-session</value></ifl:property>
<ifl:property><key>whitelistRequestHeaders</key><value>x-sap-security-session</value></ifl:property>
```

### Dynamic filter pattern

Build the OData filter in a preceding Groovy/Content Modifier step, store in `customQueryOptions` exchange property:

```groovy
// In Groovy before the OData call:
def filter = "\$filter=SalesOrder eq '${property.orderId}' and SalesOrderType eq 'OR'"
message.setProperty("customQueryOptions", filter)
```

Then in the OData adapter: `<ifl:property><key>customQueryOptions</key><value>${property.customQueryOptions}</value></ifl:property>`

---

## Mail Receiver (SMTP)

Used with a `bpmn2:serviceTask` using `activityType=Send` (not ExternalCall).

```xml
<!-- ServiceTask uses Send, not ExternalCall -->
<bpmn2:serviceTask id="ServiceTask_Mail" name="Send Email">
    <bpmn2:extensionElements>
        <ifl:property><key>activityType</key><value>Send</value></ifl:property>
        <ifl:property><key>cmdVariantUri</key><value>ctype::FlowstepVariant/cname::Send/version::1.0.4</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.0</value></ifl:property>
    </bpmn2:extensionElements>
    <bpmn2:incoming>SequenceFlow_1</bpmn2:incoming>
    <bpmn2:outgoing>SequenceFlow_2</bpmn2:outgoing>
</bpmn2:serviceTask>

<bpmn2:messageFlow id="MessageFlow_Mail" name="Mail"
    sourceRef="ServiceTask_Mail" targetRef="Participant_Email">
    <bpmn2:extensionElements>
        <ifl:property><key>ComponentType</key><value>Mail</value></ifl:property>
        <ifl:property><key>ComponentNS</key><value>sap</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.11</value></ifl:property>
        <ifl:property><key>Name</key><value>Mail</value></ifl:property>
        <ifl:property><key>system</key><value>Email</value></ifl:property>
        <ifl:property><key>TransportProtocol</key><value>SMTP</value></ifl:property>
        <ifl:property><key>MessageProtocol</key><value>None</value></ifl:property>
        <ifl:property><key>server</key><value>ZZSMTPSERVER</value></ifl:property>
        <ifl:property><key>from</key><value>ZZFROMADDRESS</value></ifl:property>
        <ifl:property><key>to</key><value>ZZTOADDRESS</value></ifl:property>
        <ifl:property><key>cc</key><value/></ifl:property>
        <ifl:property><key>bcc</key><value/></ifl:property>
        <ifl:property><key>subject</key><value>ZZSUBJECT</value></ifl:property>
        <ifl:property><key>body</key><value>${in.body}</value></ifl:property>
        <ifl:property><key>content_type</key><value>text/plain</value></ifl:property>
        <!-- content_type: text/plain | text/html -->
        <ifl:property><key>content_encoding</key><value>UTF-8</value></ifl:property>
        <ifl:property><key>auth</key><value>ZZCREDENTIALNAME</value></ifl:property>
        <ifl:property><key>user</key><value>ZZCREDENTIALNAME</value></ifl:property>
        <ifl:property><key>ssl</key><value>STARTTLS</value></ifl:property>
        <!-- ssl: STARTTLS | SSL | Plain -->
        <ifl:property><key>timeout</key><value>30000</value></ifl:property>
        <ifl:property><key>encrypt.type</key><value>none</value></ifl:property>
        <ifl:property><key>keep_attachments</key><value>0</value></ifl:property>
        <ifl:property><key>attachmentTransferEncoding</key><value>auto</value></ifl:property>
        <ifl:property><key>proxyType</key><value>none</value></ifl:property>
        <ifl:property><key>TransportProtocolVersion</key><value>1.0</value></ifl:property>
        <ifl:property><key>MessageProtocolVersion</key><value>1.0</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::AdapterVariant/cname::sap:Mail/tp::SMTP/mp::None/direction::Receiver/version::1.11.0</value>
        </ifl:property>
    </bpmn2:extensionElements>
</bpmn2:messageFlow>
```

---

## Known Gaps

- SOAP adapter: full property set not yet validated against real example
- IDoc adapter: party/service properties not documented
- XI adapter: quality of service properties not documented
- AS2 adapter: MDN, signing/encryption properties not documented
