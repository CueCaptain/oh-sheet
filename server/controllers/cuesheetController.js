import fetch from 'node-fetch';
import moment from 'moment';

export const getSheetNamesFromGoogleSheets = async (req, res) => {
  const spreadsheetUrl = req.query?.spreadsheetUrl;

  if (!spreadsheetUrl) {
    res.status(400).send({message: 'Missing Spreadsheet Url'});
    return;
  }

  const spreadsheetId = spreadsheetUrl.match(/[-\w]{25,}/);
  const spreadsheetDataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/?key=${process.env.SHEETS_API_KEY}&alt=json`;
  fetch(spreadsheetDataUrl)
    .then(response => {
      return response.json();
    })
    .then(spreadsheetData => {
      if (spreadsheetData?.sheets?.length > 0) {
        const sheetNames = spreadsheetData.sheets.map(s => s.properties.title);
        res.status(200).send(sheetNames);
      } else {
        res
          .status(400)
          .send({message: 'Something is wrong with your Spreadsheet Url'});
      }
    });
};

export const postGoogleSheet = async (req, res) => {
  const spreadsheetUrl = req.body?.spreadsheetUrl;
  const sheetName = req.body?.sheetName;
  const headerRow = !!req.body?.headerRow ? req.body.headerRow - 1 : 3;
  const spreadsheetId = spreadsheetUrl.match(/[-\w]{25,}/);
  if (!spreadsheetUrl)
    res.status(400).send({message: 'Missing spreadsheetUrl'});
  else if (!sheetName) res.status(400).send({message: 'Missing sheetName'});
  else if (!spreadsheetId)
    res.status(400).send({message: 'Could not parse spreadsheetUrl'});
  else {
    const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A1:Z1000?key=${process.env.SHEETS_API_KEY}&alt=json`;
    fetch(sheetUrl)
      .then(response => {
        return response.json();
      })
      .then(data => {
        const spreadsheetDataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/?key=${process.env.SHEETS_API_KEY}&alt=json`;
        fetch(spreadsheetDataUrl)
          .then(response => {
            return response.json();
          })
          .then(spreadsheetData => {
            const sheetMergeData = spreadsheetData?.sheets?.find(
              sheet => sheet.properties.title === sheetName,
            )?.merges;
            let values = [...data.values];
            if (sheetMergeData) {
              sheetMergeData.forEach(merges => {
                const {
                  startRowIndex,
                  endRowIndex,
                  startColumnIndex,
                  endColumnIndex,
                } = merges;
                for (let i = startRowIndex; i < endRowIndex; i++) {
                  for (let j = startColumnIndex; j < endColumnIndex; j++) {
                    let numDelete = 1;
                    if (typeof values[i][j] === 'undefined') {
                      numDelete = 0;
                    }
                    values[i].splice(
                      j,
                      numDelete,
                      data.values[startRowIndex][startColumnIndex],
                    );
                  }
                }
              });
            }
            const headers = values[headerRow];
            const validHeaders = validateHeaders(headers);
            if (!validHeaders.success) {
              res.status(400).send({message: validHeaders.message});
              return false;
            }
            let cues = values.slice(headerRow + 1, -1).map(cue => {
              let cueData = {};
              for (let i = 0; i < headers.length; i++) {
                const header = headers[i].toLowerCase();
                let data = cue[i];
                cueData[header] = data;
              }
              return cueData;
            });
            const end = cues.findIndex(
              row =>
                row.cue?.toLowerCase() === 'end' ||
                row.cue === undefined ||
                row.cue === null,
            );
            cues = end > 0 ? cues.slice(0, end - 1) : cues;
            let cueMap = [];

            for (let i = 0; i < cues.length; i++) {
              const cue = cues[i];
              if (cueMap[cue.cue]) {
                res
                  .status(400)
                  .send({message: 'Cue Numbers need to be unique.'});
                return false;
              }
              cueMap[cue.cue] = true;
              const start = moment(cue.start, 'hh:mm:ss a');
              const end = moment(cue.end, 'hh:mm:ss a');

              if (!start.isValid() || !end.isValid()) {
                res
                  .status(400)
                  .send({
                    message:
                      'Double check the values in your start or end columns. The time must be in `hh:mm:ss a` format',
                  });
                return false;
              }

              if (end.isBefore(start)) {
                end.add(1, 'day');
              }

              cues[i].duration = moment.duration(end.diff(start)).asSeconds();
            }
            global.serverData.openCueSheet(cues);
            res.status(200).send(true);
          });
      });
  }
};

const validateHeaders = headers => {
  headers = headers?.map(val => val.toLowerCase());
  const found = ['cue', 'start', 'end', 'item'].every(r => headers.includes(r));
  if (!found) {
    return {
      success: false,
      message:
        'Headers are missing. Please ensure the table headers are on the row entered and all required headers are included (cue, start, end, item)',
    };
  }

  return {success: true};
};
