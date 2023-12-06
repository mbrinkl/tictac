"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = exports.Player = void 0;
var schema_1 = require("@colyseus/schema");
var Player = function () {
    var _a;
    var _classSuper = schema_1.Schema;
    var _instanceExtraInitializers = [];
    var _id_decorators;
    var _id_initializers = [];
    var _mark_decorators;
    var _mark_initializers = [];
    var _isConnected_decorators;
    var _isConnected_initializers = [];
    var _timeRemainingMs_decorators;
    var _timeRemainingMs_initializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(Player, _super);
            function Player(id) {
                var _this = _super.call(this) || this;
                _this.id = (__runInitializers(_this, _instanceExtraInitializers), __runInitializers(_this, _id_initializers, void 0));
                _this.mark = __runInitializers(_this, _mark_initializers, void 0);
                _this.isConnected = __runInitializers(_this, _isConnected_initializers, void 0);
                _this.timeRemainingMs = __runInitializers(_this, _timeRemainingMs_initializers, void 0);
                _this.id = id;
                _this.mark = id === 0 ? 'X' : 'O';
                _this.isConnected = true;
                _this.timeRemainingMs = 10 * 1000;
                return _this;
            }
            return Player;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _id_decorators = [(0, schema_1.type)('number')];
            _mark_decorators = [(0, schema_1.type)('string')];
            _isConnected_decorators = [(0, schema_1.type)('boolean')];
            _timeRemainingMs_decorators = [(0, schema_1.type)('number')];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _mark_decorators, { kind: "field", name: "mark", static: false, private: false, access: { has: function (obj) { return "mark" in obj; }, get: function (obj) { return obj.mark; }, set: function (obj, value) { obj.mark = value; } }, metadata: _metadata }, _mark_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _isConnected_decorators, { kind: "field", name: "isConnected", static: false, private: false, access: { has: function (obj) { return "isConnected" in obj; }, get: function (obj) { return obj.isConnected; }, set: function (obj, value) { obj.isConnected = value; } }, metadata: _metadata }, _isConnected_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _timeRemainingMs_decorators, { kind: "field", name: "timeRemainingMs", static: false, private: false, access: { has: function (obj) { return "timeRemainingMs" in obj; }, get: function (obj) { return obj.timeRemainingMs; }, set: function (obj, value) { obj.timeRemainingMs = value; } }, metadata: _metadata }, _timeRemainingMs_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.Player = Player;
var GameState = function () {
    var _a;
    var _classSuper = schema_1.Schema;
    var _instanceExtraInitializers = [];
    var _players_decorators;
    var _players_initializers = [];
    var _board_decorators;
    var _board_initializers = [];
    var _activePlayerId_decorators;
    var _activePlayerId_initializers = [];
    var _lastElapsed_decorators;
    var _lastElapsed_initializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(GameState, _super);
            function GameState() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.players = (__runInitializers(_this, _instanceExtraInitializers), __runInitializers(_this, _players_initializers, new schema_1.MapSchema()));
                _this.board = __runInitializers(_this, _board_initializers, new (schema_1.ArraySchema.bind.apply(schema_1.ArraySchema, __spreadArray([void 0], Array(9).fill(''), false)))());
                _this.activePlayerId = __runInitializers(_this, _activePlayerId_initializers, 0);
                _this.lastElapsed = __runInitializers(_this, _lastElapsed_initializers, 0);
                return _this;
            }
            return GameState;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _players_decorators = [(0, schema_1.type)({ map: Player })];
            _board_decorators = [(0, schema_1.type)({ array: 'string' })];
            _activePlayerId_decorators = [(0, schema_1.type)('number')];
            _lastElapsed_decorators = [(0, schema_1.type)('number')];
            __esDecorate(null, null, _players_decorators, { kind: "field", name: "players", static: false, private: false, access: { has: function (obj) { return "players" in obj; }, get: function (obj) { return obj.players; }, set: function (obj, value) { obj.players = value; } }, metadata: _metadata }, _players_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _board_decorators, { kind: "field", name: "board", static: false, private: false, access: { has: function (obj) { return "board" in obj; }, get: function (obj) { return obj.board; }, set: function (obj, value) { obj.board = value; } }, metadata: _metadata }, _board_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _activePlayerId_decorators, { kind: "field", name: "activePlayerId", static: false, private: false, access: { has: function (obj) { return "activePlayerId" in obj; }, get: function (obj) { return obj.activePlayerId; }, set: function (obj, value) { obj.activePlayerId = value; } }, metadata: _metadata }, _activePlayerId_initializers, _instanceExtraInitializers);
            __esDecorate(null, null, _lastElapsed_decorators, { kind: "field", name: "lastElapsed", static: false, private: false, access: { has: function (obj) { return "lastElapsed" in obj; }, get: function (obj) { return obj.lastElapsed; }, set: function (obj, value) { obj.lastElapsed = value; } }, metadata: _metadata }, _lastElapsed_initializers, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.GameState = GameState;
