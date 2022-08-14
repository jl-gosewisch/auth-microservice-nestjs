# auth-microservice-nestjs
An implementation of JWT strategy with refresh logic, thougt as standalone authentication service.

## Further improvements: 
  + :lock: store only encrypted email in database
  + :calling: use also graphql endpoint, not only http
  + :loudspeaker: implement messaging (Kafka/NATS etc.) for informing other microservices about user_register event with id (used in jwt) 
  + :cry: write integration tests
  + :smiling_imp: setup template with jwt strategy for other microservices (not refresh, only JWTAuthGuard)
