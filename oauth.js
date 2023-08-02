const REQ_BOUNDARY = '-------314159265358979323846';
const REQ_DELIMITER = `\r\n--${REQ_BOUNDARY}\r\n`;
const REQ_CLOSE = `\r\n--${REQ_BOUNDARY}--`;

window.onload = function() {
    document.querySelector('button').addEventListener('click', function() {
      chrome.identity.getAuthToken({interactive: true}, function(token) {
        console.log(token);

        const random = `${Math.random()}`
        const name = `tab-${random}.txt`

        const metadata = { name }
        const fileContent = "this will be a tab"

        const multipartRequestBody =
          REQ_DELIMITER +
          'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
          JSON.stringify(metadata) +
          REQ_DELIMITER +
          `Content-Type: text/plain\r\n\r\n` +
          fileContent +
          REQ_CLOSE;

        fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
          method: "POST",
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': `multipart/related; boundary="${REQ_BOUNDARY}"`,
          },
          body: multipartRequestBody
        })
      });
    });
  };