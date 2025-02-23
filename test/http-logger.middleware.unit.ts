import { AsyncLocalStorage } from 'async_hooks';
import { NextFunction, Request, Response } from 'express';

import { HttpLoggerMiddleware } from '../src/http-logger.middleware';
import { Logger, LoggerLocalAsyncStorage } from '../src/interfaces';

describe('HttpLoggerMiddleware', () => {
  it('should log request details and call next when x-request-id header is provided', () => {
    expect.hasAssertions();

    // Arrange
    const logger: jest.Mocked<Pick<Logger, 'info'>> = { info: jest.fn() };
    const asyncStorage = {
      run: jest.fn((_store, callback: () => void) => {
        callback();
      }),
    } as unknown as jest.Mocked<AsyncLocalStorage<LoggerLocalAsyncStorage>>;

    const middleware: HttpLoggerMiddleware = new HttpLoggerMiddleware(
      logger as unknown as Logger,
      asyncStorage
    );

    const req = {
      method: 'POST',
      originalUrl: '/graphql',
      httpVersion: '1.1',
      ip: '127.0.0.1',
      ips: ['127.0.0.1', '127.0.0.2'],
      query: {},
      headers: { 'x-request-id': '1234' },
      body: { message: 'Success', statusCode: 200 },
    } as unknown as Request;

    const res = {
      statusCode: 200,
      getHeaders: jest.fn(() => ({ some: 'header' })),
    } as unknown as Response;

    const nextMock: NextFunction = jest.fn();

    // Action
    middleware.use(req, res, nextMock);

    // Assert
    expect(logger.info).toHaveBeenCalledWith(
      {
        correlationKey: '1234',
        request: {
          ip: '127.0.0.1',
          httpVersion: '1.1',
          protocol: req.protocol,
          query: req.query,
          method: req.method,
          originalUrl: req.originalUrl,
          headers: req.headers,
          body: req.body as never,
        },
        response: {
          statusCode: res.statusCode,
          headers: res.getHeaders(),
        },
      },
      'POST /graphql'
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(asyncStorage.run).toHaveBeenCalledWith(
      { correlationKey: '1234' },
      expect.any(Function)
    );
    expect(nextMock).toHaveBeenCalledWith();
  });

  it('should generate a correlationKey when x-request-id header is not provided', () => {
    expect.hasAssertions();

    // Arrange
    const logger: jest.Mocked<Pick<Logger, 'info'>> = { info: jest.fn() };
    const asyncStorage = {
      run: jest.fn((_store, callback: () => void) => {
        callback();
      }),
    } as unknown as jest.Mocked<AsyncLocalStorage<LoggerLocalAsyncStorage>>;

    const middleware = new HttpLoggerMiddleware(
      logger as unknown as Logger,
      asyncStorage
    );

    const req = {
      method: 'POST',
      originalUrl: '/graphql',
      httpVersion: '1.1',
      ip: '127.0.0.1',
      ips: [],
      query: {},
      headers: {},
      body: { message: 'Success', statusCode: 200 },
    } as unknown as Request;

    const res = {
      statusCode: 200,
      getHeaders: jest.fn(() => ({ some: 'header' })),
    } as unknown as Response;

    const nextMock: NextFunction = jest.fn();

    // Action
    middleware.use(req, res, nextMock);

    // Assert
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        correlationKey: expect.stringMatching(/^[\w\d]{26}$/) as never,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        request: expect.objectContaining({
          ip: '127.0.0.1',
          httpVersion: '1.1',
          protocol: req.protocol,
          query: req.query,
          method: req.method,
          originalUrl: req.originalUrl,
          headers: req.headers,
          body: req.body as never,
        }),
        response: {
          statusCode: res.statusCode,
          headers: res.getHeaders(),
        },
      }),
      'POST /graphql'
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(asyncStorage.run).toHaveBeenCalledWith(
      { correlationKey: expect.stringMatching(/^[\w\d]{26}$/) as never },
      expect.any(Function)
    );
    expect(nextMock).toHaveBeenCalledWith();
  });

  it('should use req.ip when ips property is not provided', () => {
    // Arrange
    const logger: jest.Mocked<Pick<Logger, 'info'>> = { info: jest.fn() };
    const asyncStorage = {
      run: jest.fn((_store, callback: () => void) => callback()),
    } as unknown as jest.Mocked<AsyncLocalStorage<LoggerLocalAsyncStorage>>;
    const middleware = new HttpLoggerMiddleware(
      logger as unknown as Logger,
      asyncStorage
    );

    const req = {
      method: 'GET',
      originalUrl: '/test',
      httpVersion: '1.0',
      ip: '192.168.1.1',
      query: { q: 'test' },
      headers: { 'x-request-id': 'abcd' },
      body: {},
      protocol: 'https',
    } as unknown as Request;

    const res = {
      statusCode: 404,
      getHeaders: jest.fn(() => ({ 'content-type': 'application/json' })),
    } as unknown as Response;

    const nextMock: NextFunction = jest.fn();

    // Action
    middleware.use(req, res, nextMock);

    // Assert
    expect(logger.info).toHaveBeenCalledWith(
      {
        correlationKey: 'abcd',
        request: {
          ip: '192.168.1.1',
          httpVersion: '1.0',
          protocol: req.protocol,
          query: req.query,
          method: req.method,
          originalUrl: req.originalUrl,
          headers: req.headers,
          body: req.body as never,
        },
        response: {
          statusCode: res.statusCode,
          headers: res.getHeaders(),
        },
      },
      'GET /test'
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(asyncStorage.run).toHaveBeenCalledWith(
      { correlationKey: 'abcd' },
      expect.any(Function)
    );
    expect(nextMock).toHaveBeenCalledWith();
  });

  it("should default to 'unknown' when neither ips nor ip are provided", () => {
    // Arrange
    const logger: jest.Mocked<Pick<Logger, 'info'>> = { info: jest.fn() };
    const asyncStorage = {
      run: jest.fn((_store, callback: () => void) => callback()),
    } as unknown as jest.Mocked<AsyncLocalStorage<LoggerLocalAsyncStorage>>;
    const middleware = new HttpLoggerMiddleware(
      logger as unknown as Logger,
      asyncStorage
    );

    const req = {
      method: 'PUT',
      originalUrl: '/not-found',
      httpVersion: '1.1',
      ip: '',
      ips: [],
      query: {},
      headers: {},
      body: { error: 'Not found' },
      protocol: 'http',
    } as unknown as Request;

    const res = {
      statusCode: 404,
      getHeaders: jest.fn(() => ({})),
    } as unknown as Response;

    const nextMock: NextFunction = jest.fn();

    // Action
    middleware.use(req, res, nextMock);

    // Assert
    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        correlationKey: expect.stringMatching(/^[\w\d]{26}$/) as never,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        request: expect.objectContaining({
          ip: 'unknown',
          httpVersion: '1.1',
          protocol: req.protocol,
          query: req.query,
          method: req.method,
          originalUrl: req.originalUrl,
          headers: req.headers,
          body: req.body as never,
        }),
        response: {
          statusCode: res.statusCode,
          headers: res.getHeaders(),
        },
      }),
      'PUT /not-found'
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(asyncStorage.run).toHaveBeenCalledWith(
      { correlationKey: expect.stringMatching(/^[\w\d]{26}$/) as never },
      expect.any(Function)
    );
    expect(nextMock).toHaveBeenCalledWith();
  });
});
