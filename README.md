# auth-microservice-nestjs
An implementation of JWT strategy with refresh logic, thougt as standalone authentication service.

Further improvements: 
  * store only encrypted email in database :lock:
  * use also graphql endpoint, not only http :calling:
  * implement messaging (Kafka/NATS etc.) for informing other microservices about user_register event with id (used in jwt)
  * write integration tests
  * setup template with jwt strategy for other microservices (not refresh, only JWTAuthGuard)
