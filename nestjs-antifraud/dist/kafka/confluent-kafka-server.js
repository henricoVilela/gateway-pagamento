"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfluentKafkaServer = void 0;
const microservices_1 = require("@nestjs/microservices");
const kafkaLib = require("@confluentinc/kafka-javascript");
const common_1 = require("@nestjs/common");
const kafka_request_deserializer_1 = require("@nestjs/microservices/deserializers/kafka-request.deserializer");
const kafka_request_serializer_1 = require("@nestjs/microservices/serializers/kafka-request.serializer");
const constants_1 = require("@nestjs/microservices/constants");
const confluent_kafka_context_1 = require("./confluent-kafka-context");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const rxjs_1 = require("rxjs");
class ConfluentKafkaServer extends microservices_1.Server {
    options;
    logger = new common_1.Logger(ConfluentKafkaServer.name);
    client;
    consumer;
    producer;
    admin;
    parser;
    clientId;
    groupId;
    constructor(options) {
        super();
        this.options = options;
        const { postfixId = '-server' } = this.options;
        this.clientId =
            (this.options.server?.['client.id'] || constants_1.KAFKA_DEFAULT_CLIENT) + postfixId;
        this.groupId =
            (this.options.consumer?.groupId || constants_1.KAFKA_DEFAULT_GROUP) + postfixId;
        this.parser = new microservices_1.KafkaParser(options.parser || {});
        this.initializeSerializer(options.serializer);
        this.initializeDeserializer(options.deserializer);
    }
    async listen(callback) {
        try {
            this.client = this.createClient();
            await this.start(callback);
        }
        catch (e) {
            if (callback) {
                callback(e);
            }
        }
    }
    createClient() {
        return new kafkaLib.KafkaJS.Kafka({
            ...this.options.server,
            'client.id': this.clientId,
            'allow.auto.create.topics': true,
        });
    }
    async start(callback) {
        this.consumer = this.client.consumer({
            kafkaJS: {
                ...(this.options.consumer || {}),
                groupId: this.groupId,
            },
        });
        this.producer = this.client.producer({
            kafkaJS: this.options.producer || {},
        });
        this.admin = this.client.admin();
        await Promise.all([
            this.consumer.connect(),
            this.producer.connect(),
            this.admin.connect(),
        ]);
        await this.bindEvents(this.consumer);
        if (callback) {
            callback();
        }
    }
    async bindEvents(consumer) {
        const registeredPatterns = [...this.messageHandlers.keys()];
        const consumerSubscribeOptions = this.options.subscribe || {};
        if (registeredPatterns.length > 0) {
            if (this.options.consumer?.allowAutoTopicCreation === true) {
                await Promise.all(registeredPatterns.map(async (pattern) => {
                    await this.admin.createTopics({ topics: [{ topic: pattern }] });
                }));
            }
            await this.consumer.subscribe({
                ...consumerSubscribeOptions,
                topics: registeredPatterns,
            });
        }
        const consumerRunOptions = Object.assign(this.options.run || {}, {
            eachMessage: this.getMessageHandler(),
        });
        await consumer.run(consumerRunOptions);
    }
    getMessageHandler() {
        return async (payload) => {
            await this.handleMessage(payload);
        };
    }
    async handleMessage(payload) {
        const channel = payload.topic;
        const rawMessage = this.parser.parse(Object.assign(payload.message, {
            topic: payload.topic,
            partition: payload.partition,
        }));
        const headers = rawMessage.headers;
        const correlationId = headers?.[microservices_1.KafkaHeaders.CORRELATION_ID];
        const replyTopic = headers?.[microservices_1.KafkaHeaders.REPLY_TOPIC];
        const replyPartition = headers?.[microservices_1.KafkaHeaders.REPLY_PARTITION];
        const packet = await this.deserializer.deserialize(rawMessage, { channel });
        const kafkaContext = new confluent_kafka_context_1.ConfluentKafkaContext([
            rawMessage,
            payload.partition,
            payload.topic,
            this.consumer,
            payload.heartbeat,
            this.producer,
        ]);
        const handler = this.getHandlerByPattern(packet.pattern);
        if (handler?.isEventHandler || !correlationId || !replyTopic) {
            return this.handleEvent(packet.pattern, packet, kafkaContext);
        }
        const publish = this.getPublisher(replyTopic, replyPartition, correlationId);
        if (!handler) {
            return publish({
                id: correlationId,
                err: constants_1.NO_MESSAGE_HANDLER,
            });
        }
        const response$ = this.transformToObservable(handler(packet.data, kafkaContext));
        const replayStream$ = new rxjs_1.ReplaySubject();
        await this.combineStreamsAndThrowIfRetriable(response$, replayStream$);
        this.send(replayStream$, publish);
    }
    async handleEvent(pattern, packet, context) {
        const handler = this.getHandlerByPattern(pattern);
        if (!handler) {
            return this.logger.error((0, constants_1.NO_EVENT_HANDLER) `${pattern}`);
        }
        const resultOrStream = await handler(packet.data, context);
        if ((0, rxjs_1.isObservable)(resultOrStream)) {
            await (0, rxjs_1.lastValueFrom)(resultOrStream);
        }
    }
    getPublisher(replyTopic, replyPartition, correlationId) {
        return (data) => this.sendMessage(data, replyTopic, replyPartition, correlationId);
    }
    async sendMessage(message, replyTopic, replyPartition, correlationId) {
        const outgoingMessage = await this.serializer.serialize(message.response);
        this.assignReplyPartition(replyPartition, outgoingMessage);
        this.assignCorrelationIdHeader(correlationId, outgoingMessage);
        this.assignErrorHeader(message, outgoingMessage);
        this.assignIsDisposedHeader(message, outgoingMessage);
        return this.producer.send({
            topic: replyTopic,
            messages: [outgoingMessage],
        });
    }
    assignIsDisposedHeader(outgoingResponse, outgoingMessage) {
        if (!outgoingResponse.isDisposed) {
            return;
        }
        outgoingMessage.headers[microservices_1.KafkaHeaders.NEST_IS_DISPOSED] = Buffer.alloc(1);
    }
    assignCorrelationIdHeader(correlationId, outgoingMessage) {
        outgoingMessage.headers[microservices_1.KafkaHeaders.CORRELATION_ID] =
            Buffer.from(correlationId);
    }
    assignReplyPartition(replyPartition, outgoingMessage) {
        if ((0, shared_utils_1.isNil)(replyPartition)) {
            return;
        }
        outgoingMessage.partition = parseFloat(replyPartition);
    }
    assignErrorHeader(outgoingResponse, outgoingMessage) {
        if (!outgoingResponse.err) {
            return;
        }
        const stringifiedError = typeof outgoingResponse.err === 'object'
            ? JSON.stringify(outgoingResponse.err)
            : String(outgoingResponse.err);
        outgoingMessage.headers[microservices_1.KafkaHeaders.NEST_ERR] =
            Buffer.from(stringifiedError);
    }
    combineStreamsAndThrowIfRetriable(response$, replayStream$) {
        return new Promise((resolve, reject) => {
            let isPromiseResolved = false;
            response$.subscribe({
                next: (val) => {
                    replayStream$.next(val);
                    if (!isPromiseResolved) {
                        isPromiseResolved = true;
                        resolve();
                    }
                },
                error: (err) => {
                    if (err instanceof microservices_1.KafkaRetriableException && !isPromiseResolved) {
                        isPromiseResolved = true;
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                    replayStream$.error(err);
                },
                complete: () => replayStream$.complete(),
            });
        });
    }
    async close() {
        await Promise.all([
            this.consumer?.disconnect(),
            this.producer?.disconnect(),
            this.admin?.disconnect(),
        ]);
        this.consumer = null;
        this.producer = null;
        this.admin = null;
        this.client = null;
    }
    initializeSerializer(serializer) {
        this.serializer = serializer || new kafka_request_serializer_1.KafkaRequestSerializer();
    }
    initializeDeserializer(deserializer) {
        this.deserializer = deserializer || new kafka_request_deserializer_1.KafkaRequestDeserializer();
    }
    on(_event, _callback) {
        throw new Error('Not implemented');
    }
    unwrap() {
        throw new Error('Not implemented');
    }
}
exports.ConfluentKafkaServer = ConfluentKafkaServer;
//# sourceMappingURL=confluent-kafka-server.js.map