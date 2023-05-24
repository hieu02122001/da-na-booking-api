const express = require('express');
const cors = require('cors');
// DB
require('./models/database/mongoose');
// Router
const userRouter = require('./routers/web-user-manager');
const houseRouter = require('./routers/web-house-manager');
const roomRouter = require('./routers/web-room-manager');
const bookingRouter = require('./routers/web-booking-manager');
const subscriptionRouter = require('./routers/web-subscription-manager');
const packageRouter = require('./routers/web-package-manager');
//
const { logger } = require('./middleware/logger');
const { PORT, PATH } = require('./utils');
const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);
//
app.use(userRouter);
app.use(houseRouter);
app.use(roomRouter);
app.use(bookingRouter);
app.use(subscriptionRouter);
app.use(packageRouter);
// Check
app.get(PATH + '/check', async (req, res) => {
  res.send({ msg: 'OK'});
});
//
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});