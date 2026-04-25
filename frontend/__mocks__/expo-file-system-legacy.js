module.exports = {
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
  deleteAsync: jest.fn(),
  getInfoAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
  readDirectoryAsync: jest.fn(),
  copyAsync: jest.fn(),
  moveAsync: jest.fn(),
  EncodingType: {
    UTF8: "utf8",
    Base64: "base64",
  },
  FileSystemSessionType: {
    BACKGROUND: 0,
    FOREGROUND: 1,
  },
  documentDirectory: "file:///mock-document-directory/",
  cacheDirectory: "file:///mock-cache-directory/",
};
