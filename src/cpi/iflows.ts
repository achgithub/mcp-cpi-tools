import { apiGet, apiPost, apiPut, apiGetRaw, cpiPost } from "./client.js";

export interface IFlow {
  Id: string;
  Name: string;
  Description: string;
  Version: string;
  PackageId: string;
  CreatedBy: string;
  CreatedAt: string;
  ModifiedBy: string;
  ModifiedAt: string;
}

export interface IFlowConfiguration {
  ParameterKey: string;
  ParameterValue: string;
  DataType: string;
}

export interface RuntimeArtifact {
  Id: string;
  Version: string;
  Name: string;
  Type: string;
  DeployedBy: string;
  DeployedOn: string;
  Status: string;
}

export interface ServiceEndpoint {
  Name: string;
  Id: string;
  Title: string;
  Url: string;
  ApiDefinitionUrl: string;
}

interface IFlowList { d: { results: IFlow[] } }
interface IFlowDetail { d: IFlow }
interface ConfigList { d: { results: IFlowConfiguration[] } }
interface RuntimeDetail { d: RuntimeArtifact }
interface EndpointList { d: { results: ServiceEndpoint[] } }

export async function listIFlows(packageId: string): Promise<IFlow[]> {
  const data = await apiGet<IFlowList>(
    `/IntegrationPackages('${encodeURIComponent(packageId)}')/IntegrationDesigntimeArtifacts`
  );
  return data.d.results;
}

export async function getIFlow(id: string, packageId?: string): Promise<IFlow> {
  const base = packageId
    ? `/IntegrationPackages('${encodeURIComponent(packageId)}')/IntegrationDesigntimeArtifacts`
    : "/IntegrationDesigntimeArtifacts";
  const data = await apiGet<IFlowDetail>(
    `${base}(Id='${encodeURIComponent(id)}',Version='active')`
  );
  return data.d;
}

// Returns base64-encoded ZIP of the iFlow artifact
export async function downloadIFlow(id: string): Promise<string> {
  const buf = await apiGetRaw(
    `/IntegrationDesigntimeArtifacts(Id='${encodeURIComponent(id)}',Version='active')/$value`
  );
  return buf.toString("base64");
}

// Saves the iFlow artifact ZIP to disk and extracts all files
export async function saveIFlowToDisk(id: string, outputDir: string): Promise<string[]> {
  const buf = await apiGetRaw(
    `/IntegrationDesigntimeArtifacts(Id='${encodeURIComponent(id)}',Version='active')/$value`
  );
  const AdmZip = (await import("adm-zip")).default;
  const fs = await import("fs");
  const path = await import("path");

  const zip = new AdmZip(buf);
  const targetDir = path.join(outputDir, id);
  fs.mkdirSync(targetDir, { recursive: true });
  zip.extractAllTo(targetDir, true);

  return zip.getEntries()
    .filter((e) => !e.isDirectory)
    .map((e) => path.join(targetDir, e.entryName));
}

// Extracts the .iflw BPMN XML from the artifact ZIP
export async function getIFlowBpmn(id: string): Promise<{ filename: string; xml: string; otherFiles: string[] }> {
  const buf = await apiGetRaw(
    `/IntegrationDesigntimeArtifacts(Id='${encodeURIComponent(id)}',Version='active')/$value`
  );
  const AdmZip = (await import("adm-zip")).default;
  const zip = new AdmZip(buf);
  const entries = zip.getEntries();

  const iflwEntry = entries.find((e) => e.entryName.endsWith(".iflw"));
  if (!iflwEntry) throw new Error("No .iflw file found in artifact ZIP");

  const otherFiles = entries
    .filter((e) => !e.isDirectory && e.entryName !== iflwEntry.entryName)
    .map((e) => e.entryName);

  return {
    filename: iflwEntry.entryName,
    xml: iflwEntry.getData().toString("utf-8"),
    otherFiles,
  };
}

// artifactContent = base64-encoded ZIP
export async function createIFlow(
  id: string,
  name: string,
  packageId: string,
  artifactContent: string,
  description = ""
): Promise<IFlow> {
  const data = await apiPost<IFlowDetail>("/IntegrationDesigntimeArtifacts", {
    Id: id,
    Name: name,
    PackageId: packageId,
    Description: description,
    ArtifactContent: artifactContent,
  });
  return data.d;
}

// artifactContent = base64-encoded ZIP of the updated artifact
export async function updateIFlow(
  id: string,
  name: string,
  packageId: string,
  artifactContent: string,
  description = ""
): Promise<void> {
  await apiPut(
    `/IntegrationDesigntimeArtifacts(Id='${encodeURIComponent(id)}',Version='active')`,
    {
      Name: name,
      PackageId: packageId,
      Description: description,
      ArtifactContent: artifactContent,
    }
  );
}

export async function deployIFlow(id: string): Promise<void> {
  await apiPost(
    `/DeployIntegrationDesigntimeArtifact?Id='${encodeURIComponent(id)}'&Version='active'`,
    null
  );
}

export async function getDeployStatus(id: string): Promise<RuntimeArtifact> {
  const data = await apiGet<RuntimeDetail>(
    `/IntegrationRuntimeArtifacts('${encodeURIComponent(id)}')`
  );
  return data.d;
}

export async function getDeployError(id: string): Promise<string> {
  try {
    const buf = await apiGetRaw(
      `/IntegrationRuntimeArtifacts('${encodeURIComponent(id)}')/ErrorInformation/$value`
    );
    return buf.toString("utf-8");
  } catch {
    return "No error information available";
  }
}

export async function getIFlowConfigurations(id: string): Promise<IFlowConfiguration[]> {
  const data = await apiGet<ConfigList>(
    `/IntegrationDesigntimeArtifacts(Id='${encodeURIComponent(id)}',Version='active')/Configurations`
  );
  return data.d.results;
}

export async function updateIFlowConfiguration(
  iflowId: string,
  key: string,
  value: string
): Promise<void> {
  await apiPut(
    `/IntegrationDesigntimeArtifacts(Id='${encodeURIComponent(iflowId)}',Version='active')/Configurations(ParameterKey='${encodeURIComponent(key)}')`,
    { ParameterValue: value }
  );
}

export async function getServiceEndpoints(iflowId?: string): Promise<ServiceEndpoint[]> {
  const params: Record<string, string> = iflowId ? { $filter: `Name eq '${iflowId}'` } : {};
  const data = await apiGet<EndpointList>("/ServiceEndpoints", params);
  return data.d.results;
}

export async function sendTestMessage(
  path: string,
  body: string,
  contentType = "application/xml"
): Promise<unknown> {
  return cpiPost(path, body, contentType);
}
