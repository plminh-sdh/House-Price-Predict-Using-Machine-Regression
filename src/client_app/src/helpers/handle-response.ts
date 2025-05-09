export function handleResponse(response: any) {
  return response.text().then((text: any) => {
    let data;
    try {
      data = text && JSON.parse(text);
    } catch (error) {
      return Promise.reject({
        error: error,
        status: response.status,
        data: text,
      });
    }
    if (!response.ok) {
      let error = (data && data.message) || response.statusText;
      if (!error) {
        if (response.status === 401) {
          error = "Unauthorized Access";
        } else if (response.status === 403) {
          error = "Forbidden";
        } else {
          error = "Unknown error";
        }
      }
      return Promise.reject({
        error: error,
        status: response.status,
        data: data,
        name: data.name,
        message: data.message,
      });
    }

    return Promise.resolve(data);
  });
}

export function handleBlobResponse(response: any) {
  let filename = response
    .headers!.get("Content-Disposition")!
    .split(`filename=`)[1]
    .split(`;`)[0]
    .replace(/["']/g, "");

  response.blob().then((blob: any) => {
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  });
}
export function handleProcessBlob(response: any) {
  let filename = response
    .headers!.get("Content-Disposition")!
    .split(`filename=`)[1]
    .split(`;`)[0]
    .replace(/["']/g, "");
  return response.blob().then((blob: any) => {
    return Promise.resolve({
      blob: blob,
      filename: filename,
    });
  });
}
