const logRequest = (request, response, next) => {
  console.log(
    `[${new Date().toDateString()}, ${new Date().toLocaleTimeString()}] ${request.method} ${request.url}`,
  );
  next()
};

export default logRequest;
