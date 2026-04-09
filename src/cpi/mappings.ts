import { apiGet, apiPost, apiPut } from "./client.js";

export interface MessageMapping {
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

interface MappingList { d: { results: MessageMapping[] } }
interface MappingDetail { d: MessageMapping }

export async function listMappings(packageId: string): Promise<MessageMapping[]> {
  const data = await apiGet<MappingList>(
    "/MessageMappingDesigntimeArtifacts",
    { $filter: `PackageId eq '${packageId}'` }
  );
  return data.d.results;
}

export async function getMapping(id: string): Promise<MessageMapping> {
  const data = await apiGet<MappingDetail>(
    `/MessageMappingDesigntimeArtifacts(Id='${encodeURIComponent(id)}',Version='active')`
  );
  return data.d;
}

// artifactContent = base64-encoded ZIP
export async function createMapping(
  id: string,
  name: string,
  packageId: string,
  artifactContent: string,
  description = ""
): Promise<MessageMapping> {
  const data = await apiPost<MappingDetail>("/MessageMappingDesigntimeArtifacts", {
    Id: id,
    Name: name,
    PackageId: packageId,
    Description: description,
    ArtifactContent: artifactContent,
  });
  return data.d;
}

export async function updateMapping(
  id: string,
  name: string,
  packageId: string,
  artifactContent: string,
  description = ""
): Promise<void> {
  await apiPut(
    `/MessageMappingDesigntimeArtifacts(Id='${encodeURIComponent(id)}',Version='active')`,
    {
      Name: name,
      PackageId: packageId,
      Description: description,
      ArtifactContent: artifactContent,
    }
  );
}

export async function deployMapping(id: string): Promise<void> {
  await apiPost(
    `/DeployMessageMappingDesigntimeArtifact?Id='${encodeURIComponent(id)}'&Version='active'`,
    null
  );
}

// Returns base64-encoded ZIP
export async function downloadMapping(id: string): Promise<string> {
  const { apiGetRaw } = await import("./client.js");
  const buf = await apiGetRaw(
    `/MessageMappingDesigntimeArtifacts(Id='${encodeURIComponent(id)}',Version='active')/$value`
  );
  return buf.toString("base64");
}
