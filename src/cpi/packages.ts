import { apiGet, apiPost, apiDelete } from "./client.js";

export interface Package {
  Id: string;
  Name: string;
  Description: string;
  Version: string;
  Vendor: string;
  Mode: string;
  SupportedPlatform: string;
  ModifiedBy: string;
  CreationDate: string;
  ModifiedDate: string;
}

export interface PackageList {
  d: { results: Package[] };
}

export interface PackageDetail {
  d: Package;
}

export async function listPackages(): Promise<Package[]> {
  const data = await apiGet<PackageList>("/IntegrationPackages");
  return data.d.results;
}

export async function getPackage(id: string): Promise<Package> {
  const data = await apiGet<PackageDetail>(`/IntegrationPackages('${encodeURIComponent(id)}')`);
  return data.d;
}

export async function createPackage(id: string, name: string, description = ""): Promise<Package> {
  const data = await apiPost<PackageDetail>("/IntegrationPackages", {
    Id: id,
    Name: name,
    Description: description,
    Version: "1.0.0",
    Vendor: "",
    Mode: "EDIT_ALLOWED",
    SupportedPlatform: "SAP Cloud Integration",
  });
  return data.d;
}

export async function deletePackage(id: string): Promise<void> {
  await apiDelete(`/IntegrationPackages('${encodeURIComponent(id)}')`);
}
