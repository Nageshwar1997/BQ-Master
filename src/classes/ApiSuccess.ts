class ApiSuccess<T = unknown> {
  message: string;
  data?: T;

  constructor(params: { message: string; data: T;  }) {
    this.message = params.message;
    this.data = params.data;
  }
}

export default ApiSuccess;
