---
name: cpi-structure
description: Generate or reference the structural skeleton of a SAP CPI iFlow — BPMN document layout, collaboration, participants, main/local processes, exception subprocess, process calls, BPMNDiagram layout, ID conventions, externalized parameters, and generation rules. Use when building or debugging iFlow XML structure.
disable-model-invocation: true
---

# SAP CPI iFlow Structure — Generation Reference

This skill covers the structural skeleton of an iFlow: the BPMN document, collaboration, processes (main + local), exception subprocess, process calls, start/end events, diagram layout, ID conventions, and generation rules.

For adapter XML blocks see `skill-cpi-adapters.md`.
For flow step XML blocks see `skill-cpi-steps.md`.

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

    <!-- 1. Collaboration: global settings + participants + adapter messageFlows -->
    <bpmn2:collaboration id="Collaboration_1" name="Default Collaboration">
        ...
    </bpmn2:collaboration>

    <!-- 2. Main Integration Process -->
    <bpmn2:process id="Process_1" name="Integration Process">
        ...
    </bpmn2:process>

    <!-- 3. Local Integration Process(es) — one per local subprocess -->
    <bpmn2:process id="Process_2" name="Local Integration Process 1">
        ...
    </bpmn2:process>

    <!-- 4. BPMNDiagram — layout, required -->
    <bpmndi:BPMNDiagram id="BPMNDiagram_1" name="Default Collaboration Diagram">
        <bpmndi:BPMNPlane bpmnElement="Collaboration_1" id="BPMNPlane_1">
            <!-- BPMNShape for every element, BPMNEdge for every flow -->
        </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
</bpmn2:definitions>
```

---

## Collaboration-Level Properties

```xml
<bpmn2:collaboration id="Collaboration_1" name="Default Collaboration">
    <bpmn2:extensionElements>
        <ifl:property><key>namespaceMapping</key><value/></ifl:property>
        <ifl:property><key>allowedHeaderList</key><value/></ifl:property>
        <!-- For SFTP-to-SFTP flows: <value>CamelFileName</value> -->
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
    <!-- participants and messageFlows follow -->
</bpmn2:collaboration>
```

**Key settings:**
- `log`: `"All events"` | `"No logging"` | `"Header only"` | `"Property only"`
- `returnExceptionToSender`: `"true"` for sync flows that need to propagate errors to caller
- `allowedHeaderList`: comma-separated headers that propagate through the flow (empty = none)

---

## Participant Declarations

Participants are declared inside `<bpmn2:collaboration>`. Each participant maps to either an external system (sender/receiver) or an internal process (integration process, local process).

### HTTP/HTTPS Sender & Receiver Participants
No `ifl:type` needed:
```xml
<bpmn2:participant id="Participant_Sender" name="Sender"/>
<bpmn2:participant id="Participant_Receiver" name="Receiver"/>
```

### Channel-Based Sender (SFTP, JMS, IDoc, etc.)
Must have `ifl:type` as both XML attribute AND `ifl:property`:
```xml
<bpmn2:participant id="Participant_Sender" ifl:type="EndpointSender" name="Sender1">
    <bpmn2:extensionElements>
        <ifl:property><key>enableBasicAuthentication</key><value>false</value></ifl:property>
        <ifl:property><key>ifl:type</key><value>EndpointSender</value></ifl:property>
    </bpmn2:extensionElements>
</bpmn2:participant>
```

### Channel-Based Receiver (SFTP, JMS, IDoc, etc.)
NOTE: "EndpointRecevier" is a SAP typo — use the misspelling exactly:
```xml
<bpmn2:participant id="Participant_Receiver" ifl:type="EndpointRecevier" name="Receiver1">
    <bpmn2:extensionElements>
        <ifl:property><key>ifl:type</key><value>EndpointRecevier</value></ifl:property>
    </bpmn2:extensionElements>
</bpmn2:participant>
```

### Main Integration Process Participant
```xml
<bpmn2:participant id="Participant_Process_1"
    ifl:type="IntegrationProcess"
    name="Integration Process"
    processRef="Process_1">
    <bpmn2:extensionElements/>
</bpmn2:participant>
```

### Local Integration Process Participant
One participant per local process. Uses `ifl:type="IntegrationProcess"` (same as main):
```xml
<bpmn2:participant id="Participant_Process_2"
    ifl:type="IntegrationProcess"
    name="Local Integration Process 1"
    processRef="Process_2">
    <bpmn2:extensionElements/>
</bpmn2:participant>
```

**Rule:** The `name` attribute on each external participant must exactly match the `system` property in the connected messageFlow adapter.

---

## Main Integration Process

```xml
<bpmn2:process id="Process_1" name="Integration Process">
    <bpmn2:extensionElements>
        <ifl:property><key>transactionTimeout</key><value>30</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.2</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowElementVariant/cname::IntegrationProcess/version::1.2.1</value>
        </ifl:property>
        <ifl:property><key>transactionalHandling</key><value>Not Required</value></ifl:property>
    </bpmn2:extensionElements>

    <!-- Start Event -->
    <bpmn2:startEvent id="StartEvent_1" name="Start">
        <bpmn2:extensionElements>
            <ifl:property><key>componentVersion</key><value>1.0</value></ifl:property>
            <ifl:property>
                <key>cmdVariantUri</key>
                <value>ctype::FlowstepVariant/cname::MessageStartEvent/version::1.0</value>
            </ifl:property>
            <ifl:property><key>activityType</key><value>StartEvent</value></ifl:property>
        </bpmn2:extensionElements>
        <bpmn2:outgoing>SequenceFlow_1</bpmn2:outgoing>
        <bpmn2:messageEventDefinition/>
    </bpmn2:startEvent>

    <!-- Flow steps go here (callActivity, serviceTask, exclusiveGateway, subProcess) -->

    <!-- End Event -->
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

    <!-- Sequence flows -->
    <bpmn2:sequenceFlow id="SequenceFlow_1" sourceRef="StartEvent_1" targetRef="..."/>
</bpmn2:process>
```

**`transactionalHandling`:** `"Not Required"` | `"Required"` | `"Required (Commit Before Retry)"`

---

## Local Integration Process

A separate `bpmn2:process` element (sibling to the main process). Called from the main process via a Process Call step. Used to decompose complex logic into reusable blocks.

**Key differences from main process:**
- Uses `LocalIntegrationProcess` cmdVariantUri
- Has `processType: directCall`
- Has `transactionalHandling: From Calling Process`
- Start/End events use simpler variants (no `messageEventDefinition`)

```xml
<bpmn2:process id="Process_2" name="Local Integration Process 1">
    <bpmn2:extensionElements>
        <ifl:property><key>transactionTimeout</key><value>30</value></ifl:property>
        <ifl:property><key>processType</key><value>directCall</value></ifl:property>
        <ifl:property><key>componentVersion</key><value>1.1</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowElementVariant/cname::LocalIntegrationProcess/version::1.1.3</value>
        </ifl:property>
        <ifl:property><key>transactionalHandling</key><value>From Calling Process</value></ifl:property>
    </bpmn2:extensionElements>

    <!-- Local process start event — simpler variant, no messageEventDefinition -->
    <bpmn2:startEvent id="StartEvent_LP1" name="Start 1">
        <bpmn2:extensionElements>
            <ifl:property>
                <key>cmdVariantUri</key>
                <value>ctype::FlowstepVariant/cname::StartEvent</value>
            </ifl:property>
            <ifl:property><key>activityType</key><value>StartEvent</value></ifl:property>
        </bpmn2:extensionElements>
        <bpmn2:outgoing>SequenceFlow_LP1</bpmn2:outgoing>
    </bpmn2:startEvent>

    <!-- Steps go here -->

    <!-- Local process end event — no messageEventDefinition -->
    <bpmn2:endEvent id="EndEvent_LP1" name="End 1">
        <bpmn2:extensionElements>
            <ifl:property>
                <key>cmdVariantUri</key>
                <value>ctype::FlowstepVariant/cname::EndEvent</value>
            </ifl:property>
            <ifl:property><key>activityType</key><value>EndEvent</value></ifl:property>
        </bpmn2:extensionElements>
        <bpmn2:incoming>SequenceFlow_LP2</bpmn2:incoming>
    </bpmn2:endEvent>

    <bpmn2:sequenceFlow id="SequenceFlow_LP1" sourceRef="StartEvent_LP1" targetRef="..."/>
    <bpmn2:sequenceFlow id="SequenceFlow_LP2" sourceRef="..." targetRef="EndEvent_LP1"/>
</bpmn2:process>
```

**For multiple local processes:** add additional `bpmn2:process` + `bpmn2:participant` pairs, each with unique IDs (`Process_2`, `Process_3`, etc.).

---

## Process Call Step

Placed inside the calling process (main or another local process). Calls a local process by its `id`.

```xml
<bpmn2:callActivity id="CallActivity_ProcessCall1" name="Call Local Process 1">
    <bpmn2:extensionElements>
        <ifl:property><key>processId</key><value>Process_2</value></ifl:property>
        <!-- processId: must match the id attribute on the target bpmn2:process -->
        <ifl:property><key>componentVersion</key><value>1.0</value></ifl:property>
        <ifl:property><key>activityType</key><value>ProcessCallElement</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::NonLoopingProcess/version::1.0.4</value>
        </ifl:property>
        <ifl:property><key>subActivityType</key><value>NonLoopingProcess</value></ifl:property>
    </bpmn2:extensionElements>
    <bpmn2:incoming>SequenceFlow_N</bpmn2:incoming>
    <bpmn2:outgoing>SequenceFlow_N1</bpmn2:outgoing>
</bpmn2:callActivity>
```

---

## Exception Subprocess

Placed **inside** the main `bpmn2:process` (not as a separate process). Triggered automatically when any unhandled error occurs in the parent process. Every realistic iFlow should include one.

```xml
<!-- Inside bpmn2:process, as a sibling to normal flow steps -->
<bpmn2:subProcess id="SubProcess_EH" name="Exception Subprocess 1">
    <bpmn2:extensionElements>
        <ifl:property><key>componentVersion</key><value>1.1</value></ifl:property>
        <ifl:property><key>activityType</key><value>ErrorEventSubProcessTemplate</value></ifl:property>
        <ifl:property>
            <key>cmdVariantUri</key>
            <value>ctype::FlowstepVariant/cname::ErrorEventSubProcessTemplate/version::1.1.0</value>
        </ifl:property>
    </bpmn2:extensionElements>

    <!-- Error Start Event — triggered on any unhandled exception in parent process -->
    <bpmn2:startEvent id="ErrorStartEvent_1" name="Error Start 1">
        <bpmn2:outgoing>SequenceFlow_EH1</bpmn2:outgoing>
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

    <!-- Error handling steps (Content Modifier to set error body, Groovy to log, etc.) -->
    <bpmn2:callActivity id="CallActivity_EH" name="Handle Error">
        <!-- Enricher / Groovy step — see skill-cpi-steps.md -->
        <bpmn2:incoming>SequenceFlow_EH1</bpmn2:incoming>
        <bpmn2:outgoing>SequenceFlow_EH2</bpmn2:outgoing>
    </bpmn2:callActivity>

    <!-- End Event -->
    <bpmn2:endEvent id="EndEvent_EH" name="End Error">
        <bpmn2:extensionElements>
            <ifl:property><key>componentVersion</key><value>1.1</value></ifl:property>
            <ifl:property>
                <key>cmdVariantUri</key>
                <value>ctype::FlowstepVariant/cname::MessageEndEvent/version::1.1.0</value>
            </ifl:property>
        </bpmn2:extensionElements>
        <bpmn2:incoming>SequenceFlow_EH2</bpmn2:incoming>
        <bpmn2:messageEventDefinition/>
    </bpmn2:endEvent>

    <bpmn2:sequenceFlow id="SequenceFlow_EH1" sourceRef="ErrorStartEvent_1" targetRef="CallActivity_EH"/>
    <bpmn2:sequenceFlow id="SequenceFlow_EH2" sourceRef="CallActivity_EH" targetRef="EndEvent_EH"/>
</bpmn2:subProcess>
```

**Key rules:**
- The subProcess lives **inside** `bpmn2:process`, not as a sibling
- The error start event uses `bpmn2:errorEventDefinition`, not `bpmn2:messageEventDefinition`
- The exception subprocess does NOT need its own participant in the collaboration

---

## cmdVariantUri Reference

### IFlow Configuration
| Component | cmdVariantUri |
|-----------|--------------|
| IFlowConfiguration | `ctype::IFlowVariant/cname::IFlowConfiguration/version::1.1.16` |

### Process / Subprocess Elements
| Component | cmdVariantUri |
|-----------|--------------|
| IntegrationProcess | `ctype::FlowElementVariant/cname::IntegrationProcess/version::1.2.1` |
| LocalIntegrationProcess | `ctype::FlowElementVariant/cname::LocalIntegrationProcess/version::1.1.3` |

### Flow Steps (start/end/control)
| Step | cmdVariantUri |
|------|--------------|
| Message Start Event (main process) | `ctype::FlowstepVariant/cname::MessageStartEvent/version::1.0` |
| Start Event (local process) | `ctype::FlowstepVariant/cname::StartEvent` |
| Message End Event (main process) | `ctype::FlowstepVariant/cname::MessageEndEvent/version::1.1.0` |
| End Event (local process) | `ctype::FlowstepVariant/cname::EndEvent` |
| Error Start Event | `ctype::FlowstepVariant/cname::ErrorStartEvent` |
| Error End Event | `ctype::FlowstepVariant/cname::ErrorEndEvent` |
| Error Subprocess | `ctype::FlowstepVariant/cname::ErrorEventSubProcessTemplate/version::1.1.0` |
| Process Call (non-looping) | `ctype::FlowstepVariant/cname::NonLoopingProcess/version::1.0.4` |
| Process Call (looping) | `ctype::FlowstepVariant/cname::LoopingProcess/version::1.3.0` |
| Timer Start Event | `ctype::FlowstepVariant/cname::intermediatetimer/version::1.0.1` |

---

## BPMNDiagram Layout Rules

Every element must have a `BPMNShape`; every flow must have a `BPMNEdge`. Positions are arbitrary but must be present and non-overlapping.

```xml
<bpmndi:BPMNDiagram id="BPMNDiagram_1" name="Default Collaboration Diagram">
    <bpmndi:BPMNPlane bpmnElement="Collaboration_1" id="BPMNPlane_1">

        <!-- External participants (sender/receiver): 100x100 -->
        <bpmndi:BPMNShape bpmnElement="Participant_Sender" id="BPMNShape_Participant_Sender">
            <dc:Bounds height="100.0" width="100.0" x="60.0" y="160.0"/>
        </bpmndi:BPMNShape>

        <!-- Main integration process pool: tall enough to contain all steps + subprocess -->
        <bpmndi:BPMNShape bpmnElement="Participant_Process_1" id="BPMNShape_Participant_Process_1">
            <dc:Bounds height="312.0" width="920.0" x="220.0" y="110.0"/>
        </bpmndi:BPMNShape>

        <!-- Local process pool: separate lane below main process -->
        <bpmndi:BPMNShape bpmnElement="Participant_Process_2" id="BPMNShape_Participant_Process_2">
            <dc:Bounds height="220.0" width="548.0" x="139.0" y="452.0"/>
        </bpmndi:BPMNShape>

        <!-- Start/end events: 32x32 -->
        <bpmndi:BPMNShape bpmnElement="StartEvent_1" id="BPMNShape_StartEvent_1">
            <dc:Bounds height="32.0" width="32.0" x="300.0" y="194.0"/>
        </bpmndi:BPMNShape>

        <!-- Steps (callActivity): 100x60 -->
        <bpmndi:BPMNShape bpmnElement="CallActivity_1" id="BPMNShape_CallActivity_1">
            <dc:Bounds height="60.0" width="100.0" x="430.0" y="180.0"/>
        </bpmndi:BPMNShape>

        <!-- Exception subprocess: wide enough to show its contents -->
        <bpmndi:BPMNShape bpmnElement="SubProcess_EH" id="BPMNShape_SubProcess_EH">
            <dc:Bounds height="140.0" width="414.0" x="480.0" y="240.0"/>
        </bpmndi:BPMNShape>

        <!-- Gateways: 40x40 -->
        <bpmndi:BPMNShape bpmnElement="ExclusiveGateway_1" id="BPMNShape_ExclusiveGateway_1" isMarkerVisible="true">
            <dc:Bounds height="40.0" width="40.0" x="590.0" y="190.0"/>
        </bpmndi:BPMNShape>

        <!-- Sequence flows: connect via waypoints -->
        <bpmndi:BPMNEdge bpmnElement="SequenceFlow_1" id="BPMNEdge_SequenceFlow_1"
            sourceElement="BPMNShape_StartEvent_1" targetElement="BPMNShape_CallActivity_1">
            <di:waypoint x="332.0" xsi:type="dc:Point" y="210.0"/>
            <di:waypoint x="430.0" xsi:type="dc:Point" y="210.0"/>
        </bpmndi:BPMNEdge>

        <!-- Message flows (adapter connections) -->
        <bpmndi:BPMNEdge bpmnElement="MessageFlow_Sender" id="BPMNEdge_MessageFlow_Sender"
            sourceElement="BPMNShape_Participant_Sender" targetElement="BPMNShape_StartEvent_1">
            <di:waypoint x="110.0" xsi:type="dc:Point" y="210.0"/>
            <di:waypoint x="316.0" xsi:type="dc:Point" y="210.0"/>
        </bpmndi:BPMNEdge>

    </bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>
```

**Sizing guide:**
- Main process pool height: `200` for simple flows; `312+` when exception subprocess is present
- Local process pools: place below main process, starting around `y=450`
- Exception subprocess: place inside main process pool bounds

---

## ID and Naming Conventions

- **Element IDs**: descriptive — `StartEvent_1`, `CallActivity_SetHeaders`, `ExclusiveGateway_RouteByType`
- **SequenceFlow IDs**: `SequenceFlow_1`, `SequenceFlow_2` or descriptive `SequenceFlow_ToRouter`
- **MessageFlow IDs**: `MessageFlow_Sender`, `MessageFlow_Receiver`
- **Participant IDs**: `Participant_Sender`, `Participant_Process_1`, `Participant_Process_2`, `Participant_Receiver`
- **Process IDs**: `Process_1` (main), `Process_2`, `Process_3` (local processes)
- **SubProcess IDs**: `SubProcess_EH` or `SubProcess_1`
- **FormalExpression IDs**: `FormalExpression_SequenceFlow_A`
- All IDs must be **unique** within the document

---

## Externalized Parameters

**Do NOT use `{{ParamName}}` syntax** in generated iFlows. Two reasons:
1. CPI requires a real non-empty value before externalization can be applied. Using `{{PARAM}}` causes `COULD_NOT_SAVE_IFLOW_EXTERNALIZATION_PROPERTIES` on save.
2. Externalized parameters are typically **shared across multiple iFlows** in a project, managed by the transport/basis team — not set per-iFlow by the generator.

**Instead: use `ZZ`-prefixed dummy values** for mandatory environment-specific fields:
```xml
<ifl:property><key>host</key><value>ZZHOST</value></ifl:property>
<ifl:property><key>credential_name</key><value>ZZCREDENTIALNAME</value></ifl:property>
<ifl:property><key>path</key><value>ZZDIRECTORY</value></ifl:property>
<ifl:property><key>privateKeyAlias</key><value>ZZPRIVATEKEYALIAS</value></ifl:property>
<ifl:property><key>username</key><value>ZZUSERNAME</value></ifl:property>
```

The `ZZ` prefix is a SAP convention indicating "placeholder — replace before use". Developers handle externalization after import via CPI Operations UI → Configure.

**Runtime variables** (`${property.X}`, `${header.X}`) are Apache Camel Simple Language — resolved at message runtime. Use these freely in expressions; they are not affected by this rule.

---

## Camel Simple Language Quick Reference

Used in Content Modifier `expression` type, gateway conditions, and filename expressions:

| Expression | Meaning |
|------------|---------|
| `${header.MyHeader}` | Exchange header value |
| `${property.MyProperty}` | Exchange property value |
| `${in.body}` | Message body |
| `${date:now:yyyy-MM-dd}` | Current date |
| `${date:now:yyyyMMddHHmmss}` | Timestamp (for filenames) |
| `${exchangeId}` | Unique exchange ID |
| `${header.x} = 'value'` | Equality check (gateway condition) |
| `${header.x} != null` | Null check |
| `${header.x} contains 'foo'` | Contains check |
| `${header.x} regex '^[0-9]+'` | Regex match |

---

## Generation Rules

1. **Every element needs a unique ID** — use descriptive names, not just numbers
2. **External participant `ifl:type` depends on adapter type:**
   - HTTP/HTTPS: no `ifl:type` needed on participant
   - SFTP, JMS, IDoc, and other channel-based: MUST have `ifl:type` as both XML attribute AND `ifl:property`. Sender = `EndpointSender`; Receiver = `EndpointRecevier` (SAP typo — use the misspelling exactly)
   - The `name` on each external participant must exactly match the `system` property in the connected messageFlow
3. **SequenceFlows wire the process** — every step needs `<bpmn2:incoming>` and `<bpmn2:outgoing>` matching SequenceFlow IDs
4. **MessageFlows connect adapters** — sourceRef/targetRef must match participant IDs and start/end event IDs
5. **Local process start/end events differ from main process** — use `StartEvent`/`EndEvent` (no version, no `messageEventDefinition`) not `MessageStartEvent`/`MessageEndEvent`
6. **Process Call `processId`** must match the `id` attribute of the target `bpmn2:process` exactly
7. **Exception subprocess lives inside `bpmn2:process`** — it is a `bpmn2:subProcess` sibling to normal steps, not a separate process element
8. **Request-Reply uses `bpmn2:serviceTask`** — not callActivity; the receiver adapter goes on a MessageFlow from the ServiceTask to a Receiver participant
9. **ExclusiveGateway is its own element type** — `bpmn2:exclusiveGateway`, not callActivity; default route ID goes in the `default=""` attribute
10. **Conditional routes need GatewayRoute cmdVariantUri** on the sequenceFlow plus a `conditionExpression`
11. **Default route** has no conditionExpression; `expressionType=XML`
12. **BPMNDiagram is required** — every element needs a BPMNShape; every flow needs a BPMNEdge
13. **Content Modifier table values are XML-escaped** — `<` → `&lt;`, `>` → `&gt;` inside `<value>` elements
14. **Timer start event** uses `bpmn2:timerEventDefinition` inside `bpmn2:startEvent`
15. **ProcessDirect** adapter: sender iFlow uses ProcessDirect Receiver; receiving iFlow uses ProcessDirect Sender
16. **Do NOT use `{{ParamName}}` syntax** — use ZZ-prefixed dummy values instead (see Externalized Parameters above)

---

## Known Gaps

- Looping Process Call: XML structure not yet validated against real example
- Timer start event: exact property set not verified
- Multi-participant flows (multiple senders or receivers): layout conventions not documented
