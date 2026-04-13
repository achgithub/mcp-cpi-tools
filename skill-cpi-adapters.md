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
        <!-- Proxy -->
        <ifl:property><key>proxyType</key><value>none</value></ifl:property>
        <ifl:property><key>proxyHost</key><value/></ifl:property>
        <ifl:property><key>proxyPort</key><value>8080</value></ifl:property>
        <ifl:property><key>proxyProtocol</key><value>socks5</value></ifl:property>
        <ifl:property><key>proxyAlias</key><value/></ifl:property>
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
        <!-- Proxy -->
        <ifl:property><key>proxyType</key><value>none</value></ifl:property>
        <ifl:property><key>proxyHost</key><value/></ifl:property>
        <ifl:property><key>proxyPort</key><value>8080</value></ifl:property>
        <ifl:property><key>proxyProtocol</key><value>socks5</value></ifl:property>
        <ifl:property><key>proxyAlias</key><value/></ifl:property>
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

## Known Gaps

- SOAP adapter: full property set not yet validated against real example
- IDoc adapter: party/service properties not documented
- XI adapter: quality of service properties not documented
- AS2 adapter: MDN, signing/encryption properties not documented
- OData V2 receiver: operation type, entity set, query options not documented
