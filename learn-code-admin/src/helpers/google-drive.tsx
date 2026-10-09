const DRIVE_API = "https://www.googleapis.com/drive/v3";
const UPLOAD_API = "https://www.googleapis.com/upload/drive/v3";
const APP_DATA_SCOPE = "https://www.googleapis.com/auth/drive.appdata";

async function driveRequest(
  url: string,
  accessToken: string,
  options: any = {},
) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Drive API error: ${error}`);
  }

  return response;
}

// 1. List files in the hidden application folder.
export async function listAppData() {
  const accessToken = localStorage.getItem("gtkn");

  if (!accessToken) {
    return console.log("token is not provided");
  }

  const params = new URLSearchParams({
    spaces: "appDataFolder",
    fields: "files(id,name,mimeType,modifiedTime)",
    pageSize: "100",
  });

  const response = await driveRequest(
    `${DRIVE_API}/files?${params}`,
    accessToken,
  );

  const files = (await response.json())?.files ?? [];

  return files;
}

// 2. Read and parse a JSON file.
export async function readJsonFile(fileName: string) {
  const accessToken = localStorage.getItem("gtkn");

  if (!accessToken) {
    return console.log("token is not provided");
  }

  const files = await listAppData();

  const fileId = files.find((file: any) => file.name === fileName)?.id;

  const response = await driveRequest(
    `${DRIVE_API}/files/${fileId}?alt=media`,
    accessToken,
  );

  const data = await response.json();

  return data;
}

// 3. Create a new JSON file in appDataFolder.
export async function createJsonFile(
  accessToken: string,
  name: string,
  data: any,
) {
  const metadataResponse = await driveRequest(
    `${DRIVE_API}/files`,
    accessToken,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        mimeType: "application/json",
        parents: ["appDataFolder"],
      }),
    },
  );

  const file = await metadataResponse.json();

  try {
    await updateJsonFile(accessToken, file.id, data);
    return file;
  } catch (error) {
    // Avoid leaving an empty file if uploading its contents fails.
    // The file remains in Drive and can be updated later.
    throw error;
  }
}

// 4. Replace the contents of an existing JSON file.
export async function updateJsonFile(
  accessToken: string,
  fileId: string,
  data: any,
) {
  const response = await driveRequest(
    `${UPLOAD_API}/files/${fileId}?uploadType=media`,
    accessToken,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  return response.json();
}

export { APP_DATA_SCOPE };
