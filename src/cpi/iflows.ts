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
    "/IntegrationDesigntimeArtifacts",
    { $filter: `PackageId eq '${packageId}'` }
  );
  return data.d.results;
}

export async function getIFlow(id: string): Promise<IFlow> {
  const data = await apiGet<IFlowDetail>(
    `/IntegrationDesigntimeArtifacts(Id='${encodeURIComponent(id)}',Version='active')`
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
  const params = iflowId ? { $filter: `Name eq '${iflowId}'` } : {};
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
