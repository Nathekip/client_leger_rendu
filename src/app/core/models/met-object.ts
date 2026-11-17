export interface MetObject {
  objectID: number;
  title: string;
  artistDisplayName: string;
  artistDisplayBio: string;
  objectDate: string;
  medium: string;
  dimensions: string;
  department: string;
  culture: string;
  period: string;
  objectURL: string;
  primaryImage: string;
  primaryImageSmall: string;
  isHighlight: boolean;
  creditLine: string;
  accessionNumber: string;
  objectName: string;
}

export interface MetSearchResults {
  total: number;
  objectIDs: number[] | null;
}
