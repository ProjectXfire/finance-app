export function convertSCVtoObject(header: string[], body: string[][]) {
  const result = body.map((rowData) => {
    const obj: any = {};
    rowData.forEach((data, index) => {
      obj[header[index]] = data;
    });
    return obj;
  });
  const resultWithId = result.map((data, index) => ({ ...data, id: index.toString() }));
  return resultWithId;
}
