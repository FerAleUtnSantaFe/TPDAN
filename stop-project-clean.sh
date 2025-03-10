cd backend
cd ms-docker
docker-compose -f docker-compose-rabbit.yml down
cd ..
cd dan-eureka-srv
docker-compose down -v
cd ..
cd ms-clientes
docker-compose down -v
cd ..
cd ms-productos
docker-compose down -v
cd ..
cd ms-pedidos
docker-compose down -v
cd ..
cd dan-gateway
docker-compose down -v
cd ..
cd ..
cd frontend
docker-compose down -v
#docker-compose -f ms-docker/docker-compose-rabbit.yml up -d
#docker-compose -f ms-docker/docker-compose-graylog.yml up -d 
#docker-compose -f ms-docker/docker-compose-zipin.yml up -d 
#docker-compose -f ms-docker/docker-compose-perf.yml up -d 