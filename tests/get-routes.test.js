const assert = require('node:assert/strict');
const test = require('node:test');
const Collection = require('../models/Collection');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const WasteRequest = require('../models/WasteRequest');
const collectionController = require('../controllers/collectionController');
const feedbackController = require('../controllers/feedbackController');
const userController = require('../controllers/userController');
const wasteRequestController = require('../controllers/wasteRequestController');

const makeResponse = () => ({
  statusCode: undefined,
  body: undefined,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(value) {
    this.body = value;
    return this;
  },
});

const replaceMethod = (t, target, method, replacement) => {
  const original = target[method];
  target[method] = replacement;
  t.after(() => {
    target[method] = original;
  });
};

const cases = [
  {
    name: 'users',
    model: User,
    controller: userController,
    getAll: 'getAllUsers',
    getOne: 'getUserById',
    allQuery: (records) => ({ select: async () => records }),
    oneQuery: (record) => ({ select: async () => record }),
  },
  {
    name: 'waste requests',
    model: WasteRequest,
    controller: wasteRequestController,
    getAll: 'getAllWasteRequests',
    getOne: 'getWasteRequestById',
    allQuery: (records) => ({ populate: async () => records }),
    oneQuery: (record) => ({ populate: async () => record }),
  },
  {
    name: 'collections',
    model: Collection,
    controller: collectionController,
    getAll: 'getAllCollections',
    getOne: 'getCollectionById',
    allQuery: (records) => Promise.resolve(records),
    oneQuery: (record) => Promise.resolve(record),
  },
  {
    name: 'feedback',
    model: Feedback,
    controller: feedbackController,
    getAll: 'getAllFeedback',
    getOne: 'getFeedbackById',
    allQuery: (records) => Promise.resolve(records),
    oneQuery: (record) => Promise.resolve(record),
  },
];

for (const resource of cases) {
  test(`GET all ${resource.name} returns HTTP 200 and a count`, async (t) => {
    const records = [{ id: 'one' }, { id: 'two' }];
    replaceMethod(t, resource.model, 'find', () => resource.allQuery(records));
    const res = makeResponse();
    const next = (error) => {
      throw error;
    };

    await resource.controller[resource.getAll]({}, res, next);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body.data, records);
    assert.equal(res.body.count, records.length);
    assert.equal(res.body.success, true);
  });

  test(`GET ${resource.name} by ID returns HTTP 200`, async (t) => {
    const record = { id: 'record-id' };
    replaceMethod(t, resource.model, 'findById', (id) => {
      assert.equal(id, 'record-id');
      return resource.oneQuery(record);
    });
    const res = makeResponse();
    const next = (error) => {
      throw error;
    };

    await resource.controller[resource.getOne]({ params: { id: 'record-id' } }, res, next);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body.data, record);
    assert.equal(res.body.success, true);
  });
}
