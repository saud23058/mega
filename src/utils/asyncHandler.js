const asynHandler = (requestHandler) => {
  return (req, res, next)=> {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => {
      console.log("error",err);
      next(err);
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
