const app = require('./');
const port = 9090;

app.listen(port, (err) => {
  if (err) throw new Error(err);
  else console.log(`Listening on port: ${port}`);
});
