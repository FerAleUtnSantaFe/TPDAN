cd backend
cd ms-docker
docker-compose -f docker-compose-rabbit.yml down
cd ..
cd dan-eureka-srv
docker-compose down
cd ..
cd ms-clientes
docker-compose down
cd ..
cd ms-productos
docker-compose down
cd ..
cd ms-pedidos
docker-compose down
cd ..
cd dan-gateway
docker-compose down
cd ..
cd ..
cd frontend
docker-compose down
#docker-compose -f ms-docker/docker-compose-rabbit.yml up -d
#docker-compose -f ms-docker/docker-compose-graylog.yml up -d 
#docker-compose -f ms-docker/docker-compose-zipin.yml up -d 
#docker-compose -f ms-docker/docker-compose-perf.yml up -d 