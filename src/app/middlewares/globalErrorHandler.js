import httpStatus from "http-status";

export default function clientErrorHandler(err, req, res, next) {
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    success: false,
    errorMessage: err.errmsg || "Something failed!",
  });
}
