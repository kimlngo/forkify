import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchOp = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    //prettier-ignore
    const res = await Promise.race([
      fetchOp,
        timeout(TIMEOUT_SEC)
      ]);

    console.log(res);
    const data = await res.json();
    console.log(data);

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};

export const convertToHTTPS = function (inputUrl) {
  if (inputUrl.startsWith('https://')) return inputUrl;

  return `https:${inputUrl.split(':')[1]}`;
};

/*export const getJSON = async function (url) {
  try {
    //prettier-ignore
    const res = await Promise.race([
      fetch(url), 
      timeout(TIMEOUT_SEC)
    ]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    //prettier-ignore
    const res = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData)
      }), 
      timeout(TIMEOUT_SEC)
    ]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};
*/
