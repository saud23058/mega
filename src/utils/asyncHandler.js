const asynHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      console.log("error");
      next();
    });
  };
};

export { asynHandler };

//using try catch

// const asyncHandler = (func) => async () => {
//   try {
//     await (req, res, next);
//   } catch {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
