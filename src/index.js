const express = require('express');
const cors = require('cors');
// DB
require('./models/database/mongoose');
// Router
const userRouter = require('./routers/web-user-manager');
const buildingRouter = require('./routers/web-building-manager');
const roomRouter = require('./routers/web-room-manager');
const tenantRouter = require('./routers/web-tenant-manager');
const contractRouter = require('./routers/web-contract-manager');
//
const { PORT, PATH } = require('./utils');
const app = express();
app.use(cors());
app.use(express.json());
//
app.use(userRouter);
app.use(buildingRouter);
app.use(roomRouter);
app.use(tenantRouter);
app.use(contractRouter);
// Check
app.get(PATH + '/check', async (req, res) => {
  res.send({ msg: 'OK'});
});
//
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});