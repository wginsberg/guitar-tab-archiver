const REQ_BOUNDARY = '-------314159265358979323846';
const REQ_DELIMITER = `\r\n--${REQ_BOUNDARY}\r\n`;
const REQ_CLOSE = `\r\n--${REQ_BOUNDARY}--`;

const FOLDER_NAME = "my guitar tabz"

window.onload = function() {
    document.getElementById('google_drive').addEventListener('click', async () => {
      chrome.identity.getAuthToken({interactive: true}, async(token) => {

        // Search for the folder by name
        const getFolderQuery = `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`
        const existingFolderId = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(getFolderQuery)}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(response => response.json())
          .then(({ files }) => files[0]?.id)

          // Create a new one if needed
          const newFolderMetadata = {
            name: FOLDER_NAME,
            mimeType: 'application/vnd.google-apps.folder'
          };
          const newFolderId = !existingFolderId && await fetch('https://www.googleapis.com/drive/v3/files', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newFolderMetadata)
          })
          .then(response => response.json())
          .then(({ id }) => id);
  
          const folderId = existingFolderId || newFolderId

          // List existing files
          const listFilesQuery = `'${folderId}' in parents and trashed=false`
          const namesOnDrive = await fetch(`https://www.googleapis.com/drive/v3/files?q=${listFilesQuery}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            .then(res => res.json())
            .then(async ({ files }) => new Set(files.map(({ name }) => name)))
                        
          const storage = await chrome.storage.local.get()
          for (const [key, value] of Object.entries(storage)) {
            if (key.startsWith("meta.")) continue
            if (namesOnDrive.has(`${key}.txt`)) continue
            await upload(`${key}.txt`, value, folderId, token)
          }
        })
    });
  };

async function upload(name, content, folderId, accessToken) {
  const metadata = {
    name,
    parents: [folderId],
    mimeType: 'text/plain'
  };
  
  const multipartRequestBody =
      REQ_DELIMITER +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      REQ_DELIMITER +
      `Content-Type: text/plain\r\n\r\n` +
      content +
      REQ_CLOSE;
  
  return fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary="${REQ_BOUNDARY}"`
    },
    body: multipartRequestBody
  })
}