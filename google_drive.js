const REQ_BOUNDARY = '-------314159265358979323846';
const REQ_DELIMITER = `\r\n--${REQ_BOUNDARY}\r\n`;
const REQ_CLOSE = `\r\n--${REQ_BOUNDARY}--`;

window.onload = function() {
    document.getElementById('google_drive').addEventListener('click', async () => {
      chrome.identity.getAuthToken({interactive: true}, async(token) => {
          const listFilesQuery = "trashed=false"
          const namesOnDrive = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(listFilesQuery)}`, {
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
            await upload(`${key}.txt`, value, token)
          }
        })
    });
  };

async function upload(name, content, accessToken) {
  const metadata = {
    name,
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