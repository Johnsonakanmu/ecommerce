app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    res.status(statusCode).render('error', {
        title: `${statusCode} | Error`,
        message: err.message || 'Something went wrong.',
    });
});
