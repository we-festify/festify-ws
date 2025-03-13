import BridgeApi from '@bridge/models/bridge-api';
import BridgeApiEndpoint from '@bridge/models/bridge-api-endpoint';
import { EndpointInvokeService } from '@bridge/services/endpoint-invoke';
import MethodsHandler from '@methods/models/handler';
import { InvokeHandlerService } from '@methods/services/invoke-handler';
import { Router } from 'express';

const router = Router();

const endpointInvokeService = new EndpointInvokeService(
  BridgeApi,
  BridgeApiEndpoint,
  new InvokeHandlerService(MethodsHandler),
);

router.use('/:apiUId/*', async (req, res, next) => {
  try {
    const { apiUId } = req.params;
    const path = req.path.replace(`/${apiUId}`, '') || '/';
    const method = req.method.toUpperCase();
    const { verbose = false } = req.query;

    const { statusCode, body, headers, logs } =
      await endpointInvokeService.invoke(apiUId, { path, method });

    res.status(statusCode);
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, `${value}`);
    });
    if (verbose) {
      res.set('Content-Type', 'application/json').json({
        statusCode,
        body,
        logs,
      });
    } else {
      res.send(body);
    }
  } catch (err) {
    next(err);
  }
});

router.use('/:health', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;
