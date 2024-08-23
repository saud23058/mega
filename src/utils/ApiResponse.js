class ApiResponse {
  constructor(statusCode,data, body, message = "Success") {
    this.statusCode = statusCode;
    this.statusCode = statusCode < 400;
    this.data = data;
    this.body = body;
    this.message = message;
  }
}

export {ApiResponse}