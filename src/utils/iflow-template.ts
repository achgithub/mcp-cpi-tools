import AdmZip from "adm-zip";

export interface HttpIFlowConfig {
  id: string;
  name: string;
  senderAddress: string;   // e.g. /my-endpoint
  receiverUrl: string;     // e.g. https://echo.free.beeceptor.com
  senderMethod?: "POST" | "GET" | "PUT" | "DELETE";
  receiverMethod?: "POST" | "GET" | "PUT" | "DELETE";
  description?: string;
}

function manifest(id: string, name: string): string {
  return [
    "Manifest-Version: 1.0",
    `Bundle-Name: ${name}`,
    `Bundle-SymbolicName: ${id}`,
    "Bundle-Version: 1.1.0",
    `SAP_MANIFEST_NAME: ${name}`,
    "",
  ].join("\n");
}

function metainfo(id: string, name: string, description: string): string {
  return [
    "#",
    `#${new Date().toUTCString()}`,
    "version=1.1.0",
    `description=${description}`,
    `name=${name}`,
    `id=${id}`,
    "",
  ].join("\n");
}

function httpIFlowBpmn(cfg: HttpIFlowConfig): string {
  const senderMethod = cfg.senderMethod ?? "POST";
  const receiverMethod = cfg.receiverMethod ?? "POST";

  return `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  xmlns:ifl="http:///com.sap.ifl.model/Ifl.xsd"
  id="Definitions_1"
  targetNamespace="http://www.omg.org/spec/BPMN/20100524/MODEL">
  <bpmn2:collaboration id="Collaboration_1" name="">
    <bpmn2:participant id="Participant_Process" name="Integration Process" processRef="Process_1">
      <bpmn2:extensionElements>
        <ifl:property><key>componentVersion</key><value>1.1.0</value></ifl:property>
        <ifl:property><key>id</key><value>Participant_Process</value></ifl:property>
      </bpmn2:extensionElements>
    </bpmn2:participant>
    <bpmn2:participant id="Participant_Sender" name="Sender" ifl:type="ParticipantSender">
      <bpmn2:extensionElements>
        <ifl:property><key>PD_REQ</key><value>true</value></ifl:property>
      </bpmn2:extensionElements>
    </bpmn2:participant>
    <bpmn2:participant id="Participant_Receiver" name="Receiver" ifl:type="ParticipantReceiver"/>
    <bpmn2:messageFlow id="MF_Sender" name="HTTPS" sourceRef="Participant_Sender" targetRef="StartEvent_1">
      <bpmn2:extensionElements>
        <ifl:property><key>ComponentType</key><value>HTTPS</value></ifl:property>
        <ifl:property><key>address</key><value>${cfg.senderAddress}</value></ifl:property>
        <ifl:property><key>httpMethodRestriction</key><value>${senderMethod}</value></ifl:property>
        <ifl:property><key>authenticationMethod</key><value>None</value></ifl:property>
      </bpmn2:extensionElements>
    </bpmn2:messageFlow>
    <bpmn2:messageFlow id="MF_Receiver" name="HTTP" sourceRef="EndEvent_1" targetRef="Participant_Receiver">
      <bpmn2:extensionElements>
        <ifl:property><key>ComponentType</key><value>HTTP</value></ifl:property>
        <ifl:property><key>address</key><value>${cfg.receiverUrl}</value></ifl:property>
        <ifl:property><key>httpMethod</key><value>${receiverMethod}</value></ifl:property>
        <ifl:property><key>authenticationMethod</key><value>None</value></ifl:property>
        <ifl:property><key>credentialName</key><value></value></ifl:property>
      </bpmn2:extensionElements>
    </bpmn2:messageFlow>
  </bpmn2:collaboration>
  <bpmn2:process id="Process_1" name="Integration Process">
    <bpmn2:startEvent id="StartEvent_1" name="Start"/>
    <bpmn2:endEvent id="EndEvent_1" name="End"/>
    <bpmn2:sequenceFlow id="SequenceFlow_1" sourceRef="StartEvent_1" targetRef="EndEvent_1"/>
  </bpmn2:process>
</bpmn2:definitions>`;
}

// Builds a minimal HTTP pass-through iFlow ZIP and returns it as base64
export function buildHttpIFlowZip(cfg: HttpIFlowConfig): string {
  const zip = new AdmZip();
  const desc = cfg.description ?? "";

  zip.addFile("META-INF/MANIFEST.MF", Buffer.from(manifest(cfg.id, cfg.name)));
  zip.addFile("metainfo.prop", Buffer.from(metainfo(cfg.id, cfg.name, desc)));
  zip.addFile(
    `src/main/resources/scenarioflows/integrationflow/${cfg.id}.iflw`,
    Buffer.from(httpIFlowBpmn(cfg))
  );

  return zip.toBuffer().toString("base64");
}

// Builds an iFlow ZIP from raw BPMN XML and returns it as base64
export function buildIFlowZipFromBpmn(id: string, name: string, bpmnXml: string, description?: string): string {
  const zip = new AdmZip();
  const desc = description ?? "";

  zip.addFile("META-INF/MANIFEST.MF", Buffer.from(manifest(id, name)));
  zip.addFile("metainfo.prop", Buffer.from(metainfo(id, name, desc)));
  zip.addFile(
    `src/main/resources/scenarioflows/integrationflow/${id}.iflw`,
    Buffer.from(bpmnXml)
  );

  return zip.toBuffer().toString("base64");
}
