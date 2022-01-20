const app = require('./');
const { PORT = 9090 } = process.env;

app.listen(PORT, (err) => {
  if (err) throw new Error(err);
  else console.log(`Listening on port: ${PORT}`);
});
